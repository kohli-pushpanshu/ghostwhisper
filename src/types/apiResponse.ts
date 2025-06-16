import { Message } from "@prisma/client";


export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Message[];
}