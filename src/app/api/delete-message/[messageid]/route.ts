import { prisma } from "../../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest, context:{ params: Promise<{ messageid: string }>}
) {
  const {messageid} = await context.params; 


  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not authenticated",
      },
      { status: 401 }
    );
  }

  const userId = Number(session.user.id);


  try {
    await prisma.message.deleteMany({
      where: { id: Number(messageid), userId: userId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete message",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
