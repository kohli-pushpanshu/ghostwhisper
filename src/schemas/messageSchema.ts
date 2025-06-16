import {z} from "zod";

export const messagesSchema = z.object({
    content: z.string().min(5,{message:"Content must be atleast 5 words"}).max(300,{message:'Content must be no longer than 300 characters'})
})