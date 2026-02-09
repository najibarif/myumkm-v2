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

    let conversation = null;

    if (conversationId) {
      conversation = await prisma.conversations.findFirst({
        where: {
          id: conversationId,
          conversation_users: { some: { user_id: user.id } },
        },
        include: {
          conversation_users: { include: { users: true } },
        },
      });
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else if (recipientId) {
      const recipient = await prisma.users.findUnique({
        where: { id: recipientId },
      });

      if (!recipient) {
        return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
      }

      const existingConversation = await prisma.conversations.findFirst({
        where: {
          AND: [
            { conversation_users: { some: { user_id: user.id } } },
            { conversation_users: { some: { user_id: recipientId } } },
          ],
        },
        include: {
          conversation_users: { include: { users: true } },
        },
      });

      if (existingConversation) {
        conversation = existingConversation;
      } else {
        conversation = await prisma.conversations.create({
          data: {
            conversation_users: {
              create: [{ user_id: user.id }, { user_id: recipientId }],
            },
          },
          include: {
            conversation_users: { include: { users: true } },
          },
        });
      }
    } else {
      return NextResponse.json(
        { error: "conversationId atau recipientId/userId diperlukan" },
        { status: 400 }
      );
    }

    if (!conversation) {
      return NextResponse.json({ error: "Failed to resolve conversation" }, { status: 500 });
    }

    // Create the message
    const newMessage = await prisma.messages.create({
      data: {
        content: content.trim(),
        conversation_id: conversation.id,
        author_id: user.id,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const responseData = {
      ...newMessage,
      user: newMessage.users,
    };

    return NextResponse.json(responseData);
  } catch (dbError) {
    console.error("Database error:", dbError);
    return NextResponse.json(
      {
        error: "Database operation failed",
        details: dbError instanceof Error ? dbError.message : String(dbError),
      },
      { status: 500 }
    );
  }
}
