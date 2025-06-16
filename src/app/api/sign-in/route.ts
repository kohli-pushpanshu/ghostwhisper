import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findFirst({
      where: { email, isVerfied: true }, // fixed typo here
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Create or verify your account first",
        },
        { status: 400 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid password",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Logged in successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
