import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { username }, 
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User found successfully",
        user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
}
