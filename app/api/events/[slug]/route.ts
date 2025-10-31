import { NextRequest, NextResponse } from 'next/server';
import { Event, IEvent } from '@/database';
import connectDB from '@/lib/mongodb';

// Define the params type for the dynamic route
interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug identifier
 * @param request - Next.js request object (unused but required by signature)
 * @param context - Contains the dynamic route params
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // Extract and validate slug parameter
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Slug parameter is required' 
        },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugPattern.test(slug)) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid slug format. Must contain only lowercase letters, numbers, and hyphens' 
        },
        { status: 400 }
      );
    }

    // Establish database connection
    await connectDB();

    // Query event by slug
    const event: IEvent | null = await Event.findOne({ slug }).lean();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          success: false,
          message: `Event with slug '${slug}' not found` 
        },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      { 
        success: true,
        message: 'Event fetched successfully',
        event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (server-side only)
    console.error('Error fetching event by slug:', error);

    // Handle specific error types
    if (error instanceof Error) {
      // Database connection errors
      if (error.name === 'MongooseError' || error.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { 
            success: false,
            message: 'Database connection failed',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 503 }
        );
      }

      // Generic error response
      return NextResponse.json(
        { 
          success: false,
          message: 'Failed to fetch event',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      );
    }

    // Unknown error type
    return NextResponse.json(
      { 
        success: false,
        message: 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}

// Type definitions for API responses
interface SuccessResponse {
  success: true;
  message: string;
  event: IEvent;
}

interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}
