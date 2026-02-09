import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

// GET /api/profiles - Get all public profiles
export async function GET() {
  try {
    const profiles = await prisma.business_profiles.findMany({
      select: {
        id: true,
        business_name: true,
        description: true,
        category: true,
        location: true,
        created_at: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const response = NextResponse.json(profiles);
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return response;
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create a new business profile
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingProfile = await prisma.business_profiles.findUnique({
      where: { user_id: user.id },
    });

    const data = await request.json();

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Business profile already exists' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['businessName', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new business profile with all required fields
    const profile = await prisma.business_profiles.create({
      data: {
        id: crypto.randomUUID(),
        business_name: data.businessName,
        description: data.description || null,
        category: data.category,
        location: data.location || null,
        user_id: user.id,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
