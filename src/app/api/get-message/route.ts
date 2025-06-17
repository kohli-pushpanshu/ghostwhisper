import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const user = session?.user;


  if (!session || !user) {
    return Response.json({
      success: false,
      message: "Not authenticated",
    }, { status: 401 });
  }

  const userId = user?.username;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { username: userId },
      include: {
        messages: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!dbUser) {
      return Response.json({
        success: false,
        message: "User not found",
      }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: dbUser.messages,
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching messages:", error);

    return Response.json({
      success: false,
      message: "Internal server error",
    }, { status: 500 });
  }
}
