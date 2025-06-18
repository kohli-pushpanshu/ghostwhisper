import { resend } from "../lib/resend";

import VerificationEmail from "../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'noreply@codewithkohli.tech',
            to: [email],
            subject: 'Feedback | Verification code',
            react: VerificationEmail({username, otp:verifyCode}),
        });
        return{success:true, message:'verification email send successfully'}
    } catch (emailError) {
        console.error("Error sending verification code", emailError);
        return{success:false, message:'Failed to send email verification'}

    }
}