import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

// Define the expected parameter type
type RouteParams = {
  params: {
    id: string;
  };
};

// Define the route handler type
type RouteHandler = (
  request: Request,
  context: RouteParams
) => Promise<Response> | Response;

// GET /api/profiles/[id]
export const GET: RouteHandler = async (
  request: Request,
  { params }
) => {
  const { id } = params;
  try {
    const profile = await prisma.business_profiles.findUnique({
      where: { id },
      include: {
        users: {
          select: { id: true, name: true, email: true },
        },
        marketplace_listings: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            category: true,
            created_at: true,
          },
          orderBy: { created_at: "desc" },
          take: 50,
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const response = NextResponse.json(profile);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    return response;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PATCH /api/profiles/[id]
export const PATCH: RouteHandler = async (
  request: Request,
  { params }
) => {
  const { id } = params;
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.business_profiles.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.users.id !== user.id) {
      return NextResponse.json({ error: "Forbidden - You can only update your own profile" }, { status: 403 });
    }

    const data = await request.json();

    const updatedProfile = await prisma.business_profiles.update({
      where: { id },
      data: {
        business_name: data.businessName ?? profile.business_name,
        description: data.description ?? profile.description,
        category: data.category ?? profile.category,
        location: data.location ?? profile.location,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

// DELETE /api/profiles/[id]
export const DELETE: RouteHandler = async (
  request: Request,
  { params }
) => {
  const { id } = params;
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.business_profiles.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.users.id !== user.id) {
      return NextResponse.json({ error: "Forbidden - You can only delete your own profile" }, { status: 403 });
    }

    await prisma.business_profiles.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
