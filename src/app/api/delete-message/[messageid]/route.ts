import { prisma } from "../../../../../lib/prisma";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";


export async function DELETE(request:NextRequest, context : { params: { messageid: string }}){
    const params = await context.params;
    const messageId = params.messageid;

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User
    const Id = Number(messageId)
    

    if(!session||!session.user){
        return Response.json({
            success:false,
            message:"not authenticated"
        },{status:401})
    }
    const UserId = user.username
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