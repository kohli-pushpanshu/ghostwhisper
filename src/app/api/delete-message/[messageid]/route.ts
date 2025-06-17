import { prisma } from "../../../../../lib/prisma";
import { getServerSession} from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";


export async function DELETE(request:NextRequest, context : { params: { messageId: string }}){
    const {messageId} = context.params;

    const session = await getServerSession(authOptions)
    const user = session?.user
    const Id = Number(messageId)
    

    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"not authenticated"
        },{status:401})
    }
    const UserId = user?.username
    const User = await prisma.user.findFirst({where:{username:UserId},select:{
        id:true
    }})
    


    try {
        await prisma.message.deleteMany({where:{id:Id, userId: User?.id},})
        return Response.json({
            success:true,
            message:"message deleted successfully",
        },{status:200})

    } catch (error) {
        console.error("delete error",error)
    }
}