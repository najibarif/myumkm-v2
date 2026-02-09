import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const products = await prisma.marketplace_listings.findMany({
      include: {
        business_profiles: {
          select: {
            business_name: true,
            category: true,
            location: true,
            users: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Map back to camelCase for frontend compatibility if needed
    const mappedProducts = products.map((p: any) => ({
      ...p,
      // Frontend expects 'businessprofile' with camelCase fields
      businessprofile: {
        businessName: p.business_profiles?.business_name,
        category: p.business_profiles?.category,
        location: p.business_profiles?.location,
        user: p.business_profiles?.users
      },
      createdAt: p.created_at
    }));

    return NextResponse.json(mappedProducts);
  } catch (error) {
    console.error("Failed to fetch marketplace products:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, price, category } = await request.json();

    if (!title || !description || !price || !category) {
      return NextResponse.json({
        error: "Missing required fields",
      }, { status: 400 });
    }

    // Verify business profile exists
    const businessProfile = await prisma.business_profiles.findUnique({
      where: { user_id: user.id },
      select: { id: true }
    });

    if (!businessProfile) {
      return NextResponse.json({
        error: "Business profile not found",
        details: "You need to create a business profile first"
      }, { status: 404 });
    }

    try {
      // First create the marketplace listing
      const newListing = await prisma.marketplace_listings.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category: category.trim(),
          owner_id: businessProfile.id,
          created_at: new Date(),
          updated_at: new Date()
        }
      });

      // Then fetch the complete product with relations
      const productWithRelations = await prisma.marketplace_listings.findUnique({
        where: { id: newListing.id },
        include: {
          business_profiles: {
            select: {
              id: true,
              business_name: true,
              category: true,
              location: true,
              users: {
                select: {
                  name: true,
                  email: true,
                  id: true
                }
              }
            }
          }
        }
      });

      const mappedProduct = productWithRelations ? {
        ...productWithRelations,
        createdAt: productWithRelations.created_at,
        businessprofile: {
          ...productWithRelations.business_profiles,
          businessName: productWithRelations.business_profiles?.business_name,
          user: productWithRelations.business_profiles?.users
        }
      } : null;

      return NextResponse.json(mappedProduct);

    } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json({
        error: "Failed to create product",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
