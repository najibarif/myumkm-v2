import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// GET all forum posts
export async function GET() {
  try {
    const posts = await prisma.forum_posts.findMany({
      include: {
        users: {
          select: {
            name: true,
            business_profiles: {
              select: {
                business_name: true,
                category: true,
                location: true
              }
            }
          }
        },
        forum_comments: {
          select: {
            id: true
          }
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform data to match frontend expectations
    // The frontend expects: id, title, content, createdAt, author: { businessName, category, location, userName }, _count: { comments }
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: post.created_at,
      author: {
        businessName: post.users?.business_profiles?.business_name || 'No Business Name',
        category: post.users?.business_profiles?.category || 'Uncategorized',
        location: post.users?.business_profiles?.location || 'Unknown Location',
        userName: post.users?.name || 'Unknown User'
      },
      _count: {
        comments: post.forum_comments.length
      }
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Failed to fetch forum posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch forum posts" },
      { status: 500 }
    );
  }
}

// POST a new forum post
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = user.id;

    // Parse request body
    let title: string, content: string;
    try {
      const body = await request.json();
      title = body.title;
      content = body.content;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Verify user exists and maybe get business profile (optional verification?)
    // The schema says forum_posts links to users (author_id).
    // We don't strictly *need* a business profile to post, unless business rule requires it.
    // Previous code checked for business profile. Let's keep that check if it's a "business forum".

    const businessProfile = await prisma.business_profiles.findUnique({
      where: { user_id: currentUserId }
    });

    if (!businessProfile) {
      return NextResponse.json({
        error: "Business profile not found",
        details: "You need to create a business profile to post in the forum"
      }, { status: 404 });
    }

    // Create the post
    const newPost = await prisma.forum_posts.create({
      data: {
        title,
        content,
        author_id: currentUserId,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json(newPost);

  } catch (error) {
    console.error("Failed to create forum post:", error);
    return NextResponse.json(
      { error: "Failed to create forum post" },
      { status: 500 }
    );
  }
}
