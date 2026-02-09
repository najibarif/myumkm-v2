import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  console.log('=== NEW MESSAGE REQUEST ===');
  console.log('Request URL:', request.url);

  try {
    console.log('Authenticating request...');
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Authenticated user:', { userId: user.id });

    const requestBody = await request.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const { content, conversationId, recipientId } = requestBody;

    if (!content) {
      console.error('Validation error: Content is required');
      return new NextResponse(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!conversationId && !recipientId) {
      console.error('Validation error: Either conversationId or recipientId is required');
      return new NextResponse(
        JSON.stringify({ error: 'Either conversationId or recipientId is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    let conversation;

    try {
      // If we have a conversationId, try to find the conversation
      if (conversationId) {
        conversation = await prisma.conversations.findUnique({
          where: { id: conversationId },
          include: { conversation_users: { include: { users: true } } }
        });

        if (!conversation) {
          return new NextResponse(
            JSON.stringify({ error: 'Conversation not found' }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      }
      // If no conversationId, we need to create a new conversation
      else if (recipientId) {
        // Check if recipient exists
        const recipient = await prisma.users.findUnique({
          where: { id: recipientId }
        });

        if (!recipient) {
          return new NextResponse(
            JSON.stringify({ error: 'Recipient not found' }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Check if a conversation already exists between these users
        const existingConversation = await prisma.conversations.findFirst({
          where: {
            AND: [
              {
                conversation_users: {
                  some: {
                    user_id: user.id
                  }
                }
              },
              {
                conversation_users: {
                  some: {
                    user_id: recipientId
                  }
                }
              }
            ]
          },
          include: {
            conversation_users: {
              include: {
                users: true
              }
            }
          }
        });

        if (existingConversation) {
          conversation = existingConversation;
        } else {
          // Create new conversation
          conversation = await prisma.conversations.create({
            data: {
              conversation_users: {
                create: [
                  { user_id: user.id },
                  { user_id: recipientId }
                ]
              }
            },
            include: {
              conversation_users: {
                include: {
                  users: true
                }
              }
            }
          });
        }
      }

      // Create the message
      const newMessage = await prisma.messages.create({
        data: {
          content,
          conversation_id: conversation.id,
          author_id: user.id
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Prepare response data
      // Transform Prisma result to match expected frontend structure if needed
      // Assuming frontend expects snake_case from DB or we need to map to camelCase
      // The previous code returned `user` (singular) which implies camelCase expectation on frontend?
      // Step 651 view showed `include: { user: ... }`
      // So I should map `users` to `user` in the response to be safe.

      const responseData = {
        ...newMessage,
        user: newMessage.users
      };

      return NextResponse.json(responseData);

    } catch (dbError) {
      console.error('Database error:', dbError);
      return new NextResponse(
        JSON.stringify({ error: 'Database operation failed', details: dbError instanceof Error ? dbError.message : String(dbError) }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
