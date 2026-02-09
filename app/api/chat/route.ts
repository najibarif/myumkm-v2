import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

// =========================
// Auth helper
// =========================
async function getCurrentUserId(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}



function pickOtherUserId(body: any, request: NextRequest) {
  const fromBody = body?.recipientId || body?.userId;
  const url = new URL(request.url);
  const fromQuery =
    url.searchParams.get("recipientId") ?? url.searchParams.get("userId");
  return fromBody ?? fromQuery ?? null;
}

async function getOrCreateConversation(currentUserId: string, otherUserId: string) {
  let convo = await prisma.conversations.findFirst({
    where: {
      AND: [
        { conversation_users: { some: { user_id: currentUserId } } },
        { conversation_users: { some: { user_id: otherUserId } } },
      ],
    },
    include: { conversation_users: { include: { users: true } } },
  });

  if (!convo) {
    const recipient = await prisma.users.findUnique({ where: { id: otherUserId } });
    if (!recipient) throw new Error("RECIPIENT_NOT_FOUND");

    convo = await prisma.conversations.create({
      data: {
        conversation_users: {
          create: [{ user_id: currentUserId }, { user_id: otherUserId }],
        },
      },
      include: { conversation_users: { include: { users: true } } },
    });
  }

  return convo;
}

// =========================
// POST: create conversation / send message
// =========================
export async function POST(request: NextRequest) {
  try {
    const currentUserId = await getCurrentUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { content, conversationId } = body ?? {};
    const otherUserId = pickOtherUserId(body, request);

    let conversation;

    if (conversationId) {
      conversation = await prisma.conversations.findFirst({
        where: { id: conversationId, conversation_users: { some: { user_id: currentUserId } } },
        include: { conversation_users: { include: { users: true } } },
      });
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }
    } else if (otherUserId) {
      try {
        conversation = await getOrCreateConversation(currentUserId, otherUserId);
      } catch (e: any) {
        if (e.message === "RECIPIENT_NOT_FOUND") {
          return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
        }
        throw e;
      }
    } else {
      return NextResponse.json(
        { error: "conversationId atau recipientId/userId diperlukan" },
        { status: 400 }
      );
    }

    let message = null;
    if (content && typeof content === "string" && content.trim()) {
      message = await prisma.messages.create({
        data: {
          content: content.trim(),
          conversation_id: conversation.id,
          author_id: currentUserId,
        },
        include: { users: { select: { id: true, name: true, email: true } } },

      });
    }

    return NextResponse.json({ conversation, message }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// =========================
// GET: list conversations
// =========================
export async function GET(request: NextRequest) {
  try {
    const currentUserId = await getCurrentUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const otherUserId = pickOtherUserId(null, request);
    if (otherUserId) {
      const conversation = await getOrCreateConversation(currentUserId, otherUserId);
      return NextResponse.json({ conversations: [conversation] });
    }

    const raw = await prisma.conversation.findMany({
      where: { users: { some: { id: currentUserId } } },
      include: {
        users: { select: { id: true, name: true } },
        messages: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const conversations = raw.map((c) => ({
      id: c.id,
      users: c.users,
      lastMessage: c.messages[0] ?? null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error in GET /api/chat:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// =========================
// PUT: get all messages of a conversation
// =========================
export async function PUT(request: NextRequest) {
  try {
    const currentUserId = await getCurrentUserId(request);
    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationId =
      searchParams.get("conversationId") ||
      (await request.json().catch(() => null))?.conversationId;

    if (!conversationId) {
      return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, users: { some: { id: currentUserId } } },
      include: {
        messages: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({ messages: conversation.messages });
  } catch (error) {
    console.error("Error in PUT /api/chat:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
