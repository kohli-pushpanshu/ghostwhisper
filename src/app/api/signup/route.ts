import { sendVerificationEmail } from "../../../../helpers/sendVerificationEmail";
import { testPostgresConnection } from "../../../../lib/dbCheck";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";


testPostgresConnection();
const prisma = new PrismaClient();

export async function POST(request: Request){
    try {
        const {username, email, password} = await request.json()
        const existingUserVerifiedByUsername = await prisma.user.findFirst({
            where: {
                username,
                isVerfied: true
            }
        })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success:false,
                message:"Username already taken"
            },{status:400})
        }

        const existingUserByEmail = await prisma.user.findUnique({
            where:{ email }
        })
        const VerifyCode = Math.floor(100000+ Math.random()*900000).toString()


        if (existingUserByEmail) {
           if (existingUserByEmail.isVerfied) {
                return Response.json({
                    success:false,
                    message:"User already exists with this email."
                },{status:400})
           }else{
                const hashedPassword = await bcrypt.hash(password, 10)
                const verifyExpiry= new Date(Date.now()+3600000)
                await prisma.user.update({where:{email}, 
                    data:{
                        password: hashedPassword,
                        verifyToken: VerifyCode,
                        verifyTokenExpiry: verifyExpiry
                }})
           }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

           await prisma.user.create({
            data:{
                username,
                email,
                password: hashedPassword,
                isVerfied:false,
                verifyToken:VerifyCode,
                verifyTokenExpiry:expiryDate,
                isAcceptingMessage:true,
                messages: {create :[]}
            }
           })
        }

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            VerifyCode
        )
        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:"Username Already Taken"
            }, {status:500})
        }

        return Response.json({
                success:true,
                message:"User register successfully. Please Verify your email"
            }, {status:201})
 
    } catch (error) {
        console.error('Error Registering User', error)
        return Response.json({
            success:false,
            message: "error registering user"
        },{
            status: 500
        })
    }
}