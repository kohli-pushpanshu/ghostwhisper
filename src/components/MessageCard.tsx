'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete(`/api/delete-message/${message.id}`);
      toast.success(res.data.message || "Message deleted.");
      onMessageDelete(message.id.toString());
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete message.");
    }
  };

  return (
    <Card className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 shadow-sm rounded-2xl max-w-2xl w-full mx-auto mb-6 transition-all">
      <CardHeader className="relative px-6 pt-6 pb-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This message will be permanently deleted. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="px-6 pb-4 pt-0">
        <p className="text-gray-800 dark:text-gray-100 text-4xl whitespace-pre-line leading-relaxed">
          {message.content}
        </p>

        <div className="mt-4 text-right">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.createdAt
                ? new Date(message.createdAt).toLocaleString()
                : "Unknown date"
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
