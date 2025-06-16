'use client';

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/apiResponse";
import { Message } from "@prisma/client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import MessageCard from "@/components/MessageCard";

import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";

const Page = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
    defaultValues: { acceptMessages: false },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-message');
      setMessages(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetchAcceptMessage();
    }
  }, [session, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update setting");
    }
  };

  const handleDeleteMessages = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id.toString() !== messageId));
  };

  if (!session?.user) {
    return <div className="text-center py-20 text-muted-foreground">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 text-gray-800 dark:text-gray-100">
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-background border rounded-xl p-6 shadow">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium uppercase">
          {session.user.username?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{session.user.username}</h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            Messages: {messages.length}
          </span>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="flex items-center justify-between bg-background border p-4 rounded-lg shadow-sm">
        <Label htmlFor="acceptMessages" className="font-medium">
          Accept Anonymous Messages
        </Label>
        <Switch
          id="acceptMessages"
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
      </div>

      {/* Messages Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Received Messages</h2>
        <Button variant="outline" onClick={fetchMessages} disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
        </Button>
      </div>

      <Separator />

      {/* Message Cards */}
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMessageDelete={handleDeleteMessages}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
