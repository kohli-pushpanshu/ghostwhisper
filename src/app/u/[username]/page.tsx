'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { messagesSchema } from "@/schemas/messageSchema";
import { toast } from "sonner";
import { UserProfile } from "@/types/profile";

const Profile = () => {
  const params = useParams();
  const username = params.username as string;

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user-profile/${username}`);
        setProfile(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };
    if (username) fetchUser();
  }, [username]);

   const handleMessage = async () => {
    const result = messagesSchema.safeParse({ content: message });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    if (!profile?.isAcceptingMessage) {
      toast.error("User is not accepting messages");
      return;
    }
    try {
      const response = await axios.post("/api/send-message", {
        username: profile?.username,
        content: result.data.content,
      });
      if (response.data) {
        toast.success(response.data.message);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSuggestMessage = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/suggest-messages');
      setSuggestions(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Oops! Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-10">


        <Card className="shadow-lg border border-gray-300 bg-white">
          <CardHeader>
            <h1 className="text-3xl font-bold text-gray-800">
              {profile?.username}&apos;s Public Profile
            </h1>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm">
                Avatar
              </div>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Username:</span> {profile?.username}</p>
              <p><span className="font-semibold">Email:</span> <span className="text-sm italic text-gray-500">Private</span></p>
              <p><span className="font-semibold">Accepting Messages:</span> {profile?.isAcceptingMessage ? "Yes" : "No"}</p>
              <p><span className="font-semibold">Verified:</span> {profile?.isVerfied ? "Yes" : "No"}</p>
            </div>
          </CardContent>
        </Card>


        <div className="text-right">
          <Button onClick={() => setShowMessageBox(!showMessageBox)} variant="secondary">
            {showMessageBox ? "Cancel" : "Send a Message"}
          </Button>
        </div>



        {showMessageBox && (
          <Card className="shadow-md border border-gray-300 bg-white">
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800">Send an Anonymous Message</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Type your message here..."
                className="w-full min-h-[120px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Note: Will not send to unverified users.</span>
                <Button onClick={handleMessage}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}


        <div className="text-center">
          <Button onClick={handleSuggestMessage} disabled={loading}>
            {loading ? "Generating..." : "Suggest Messages using ai"}
          </Button>
        </div>


        {suggestions.length > 0 && (
          <div className="grid gap-3 mt-6">
            {suggestions.map((suggested, index) => (
              <div
                key={index}
                onClick={() => setMessage(suggested)}
                className="cursor-pointer p-3 border border-gray-300 rounded-md bg-white hover:bg-green-50 transition text-sm text-gray-800 shadow-sm"
                title="Click to use this message"
              >
                {suggested}
              </div>
            ))}
          </div>
        )}


        {error && (
          <div className="p-4 mt-4 bg-red-100 text-red-800 border border-red-300 rounded-md text-center font-medium">
            {error}
          </div>
        )}

      </div>
    </main>
  );
};

export default Profile;
