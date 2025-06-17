import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "../../../../lib/prisma";




export async function POST(request: Request){
    const session = await getServerSession(authOptions)
    const user = session?.user


    if (!session||!user) {
        return Response.json({
            success:false,
            message: "Not authenicated"
        },{status:401})
        
    }

    const userId = session.user?.username;
    const {acceptMessages} = await request.json()

    try {
        const updateUser = await prisma.user.update({where:{username:userId},data:{isAcceptingMessage: acceptMessages}})
        if(!updateUser){
            return Response.json({
                success:false,
                message:"Failed to update user status to accept messages"
            },{status:401})
        }

        return Response.json({
                success:false,
                message:"message acceptance status updated successfully"
            },{status:200}
        )
        
    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success:false,
            message:"Failed to update user status to accept messages"
        },{status:500})
    }
}


export async function GET(){
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session||!session.user) {
        return Response.json({
            success:false,
            message: "Not authenicated"
        },{status:401})
        
    }

    const userId = user?.username;

    try {
        const findUser = await prisma.user.findUnique({where:{username: userId}})
    
        if(!findUser){
                return Response.json({
                    success:false,
                    message:"User not found"
                },{status:404})
            }
        
            return Response.json({
                success:true,
                message:findUser.isAcceptingMessage
            },{status:200})
    
    } catch (error) {
        console.log("Failed to update user status to accept messages", error)
        return Response.json({
            success:false,
            message:"Error is getting message acceptance status"
        },{status:500})
    }
}