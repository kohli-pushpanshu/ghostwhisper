import { prisma } from "../../../../lib/prisma";



export async function GET(request: Request){
    const {searchParams}= new URL(request.url)
    const query = searchParams.get('q') || '';

    if(query.length===0){
        return Response.json([]);
    }

    const users = await prisma.user.findMany({
        where:{
            username:{
                startsWith:query,
                mode: 'insensitive',
            },
        },
        select:{
            username:true,
        },
        take:10,
    })

    if(!users){
        return Response.json({
            success:false,
            message:"No user with this username"
        },{status:400})
    }

    return Response.json({
            success:true,
            message:"user found",
            users
        },{status:200}
    )
}
