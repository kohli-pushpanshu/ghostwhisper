import { prisma } from "../../../../lib/prisma";

export async function POST(request: Request){
    const {username, content} = await request.json()
    try {
        const user = await prisma.user.findUnique({where:{username}})

        if (!user) {
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }


        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not Accepting messages"
            },{status:403})
        }
        console.log("Username and content",username,content)

        await prisma.message.create({data: {
                    content,
                    userId: user.id,
                },})

        return Response.json({
                success:true,
                message:"Message sent successfully"
            },{status:200})
    } catch (error) {
        console.error("Error in sending Messages", error);

    return Response.json(
        {
            success: false,
            message: "Error in sending Messages",
        }, 
        { 
            status: 500 
        }
    );
  }
}
