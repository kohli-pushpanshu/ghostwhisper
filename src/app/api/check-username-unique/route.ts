import { prisma } from '../../../../lib/prisma'
import {z} from 'zod'
import { usernameValidation } from '@/schemas/signupSchema'



const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParams)

        console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().
            username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length>0?usernameErrors.join(',') : 'Invalid query parameters'
            },{status:400})
        }

        const {username} = result.data

        const existingUser = await prisma.user.findUnique({where: {username, isVerfied:true}})

        if (existingUser) {
            return Response.json({
                success:false,
                message: 'username is already taken',
            },{status:400})
        }

        return Response.json({
                success:true,
                message: 'username is available',
            },{status:400})

    } catch (error) {
        console.error("Error checking Username", error)
        return Response.json({
            success:false,
            message: "Error checking username"
        },{status:500})
    }
}

