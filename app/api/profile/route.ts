import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

// Helper function to verify the token and get the user ID
async function getUserIdFromToken(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: 'Unauthorized', status: 401 };
  }

  return { userId: user.id };
}

// GET /api/profile - Get current user's profile
export async function GET(request: Request) {
  try {
    const { userId, error, status } = await getUserIdFromToken(request);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    // Get the current user with their business profile
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        business_profiles: {
          include: {
            marketplace_listings: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                category: true,
                created_at: true,
              },
              orderBy: { created_at: 'desc' },
            },
          },
        },
      },
    });

    if (!user?.business_profiles) {
      return NextResponse.json(
        {
          error: 'Business profile not found',
        },
        { status: 404 }
      );
    }

    // Transform the data to match the expected interface
    const profile = {
      id: user.business_profiles.id,
      businessName: user.business_profiles.business_name,
      description: user.business_profiles.description || '',
      category: user.business_profiles.category,
      location: user.business_profiles.location || 'Lokasi belum diisi',
      marketplacelisting: user.business_profiles.marketplace_listings.map(item => ({
        ...item,
        price: Number(item.price),
        createdAt: item.created_at ? new Date(item.created_at).toISOString() : new Date().toISOString(),
      })),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    };

    const response = NextResponse.json(profile);
    response.headers.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=300');
    return response;

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/profile - Create or update user's business profile
export async function POST(request: Request) {
  try {
    // Verify authentication and get user ID
    const { userId, error, status } = await getUserIdFromToken(request);
    if (error) {
      console.error('Authentication error:', error);
      return NextResponse.json({ error }, { status });
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { businessName, description, category, location } = body;

    // Validate required fields
    const missingFields = [];
    if (!businessName) missingFields.push('businessName');
    if (!category) missingFields.push('category');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          missingFields,
          message: 'Nama bisnis dan kategori harus diisi'
        },
        { status: 400 }
      );
    }

    // Check if user already has a profile
    const existingProfile = await prisma.business_profiles.findUnique({
      where: { user_id: userId }
    });

    let result;

    if (existingProfile) {
      // Update existing profile
      result = await prisma.business_profiles.update({
        where: { id: existingProfile.id },
        data: {
          business_name: businessName.trim(),
          description: description ? description.trim() : null,
          category: category.trim(),
          location: location ? location.trim() : null,
          updated_at: new Date()
        },
        include: {
          marketplace_listings: true
        }
      });
    } else {
      // Create new profile with proper type assertion
      result = await prisma.business_profiles.create({
        data: {
          business_name: businessName.trim(),
          description: description ? description.trim() : null,
          category: category.trim(),
          location: location ? location.trim() : null,
          user_id: userId as string, // Assert userId as string since we've already validated it
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          marketplace_listings: true
        }
      });
    }

    // Return the created/updated profile
    return NextResponse.json({
      success: true,
      data: {
        id: result.id,
        businessName: result.business_name,
        description: result.description,
        category: result.category,
        location: result.location,
        userId: result.user_id,
        marketplacelisting: result.marketplace_listings || []
      }
    });

  } catch (error: unknown) {
    console.error('Error in profile API:', error);

    // Define error message variable
    let errorMessage = 'An unknown error occurred';

    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      // Handle specific Prisma errors
      if (error.code === 'P2002') { // Unique constraint violation
        return NextResponse.json(
          {
            error: 'Validation error',
            message: 'A profile with these details already exists',
            code: 'DUPLICATE_PROFILE'
          },
          { status: 409 }
        );
      }

      // Get error message if it exists
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }

    // Handle other errors
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Gagal menyimpan profil. Silakan coba lagi nanti.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
