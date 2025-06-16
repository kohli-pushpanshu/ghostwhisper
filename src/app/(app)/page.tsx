'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from './../../messages.json';
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#f9fafb]">
      

      <header className="w-full px-4 py-4 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center">
          GhostWhisper
        </h1>
      </header>

      <div className="w-full flex flex-col items-center px-4 py-12 flex-1">
        <section className="text-center max-w-2xl mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Dive into the World of Anonymous Conversations
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore <span className="font-semibold text-blue-600">GhostWhisper</span> — where your identity remains a secret.
          </p>
        </section>

        <Carousel className="w-full max-w-md" plugins={[Autoplay({ delay: 3000 })]}>
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="h-64 flex flex-col justify-center bg-white border border-gray-200 shadow-md">
                  <CardHeader className="text-sm font-semibold text-gray-500 text-center">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center px-4 text-center">
                    <p className="text-gray-800 text-lg leading-relaxed">{message.content}</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <footer className="w-full text-center py-4 bg-white border-t border-gray-200 text-sm text-gray-500">
        © GhostWhisper 2025. All rights reserved.
      </footer>
    </main>
  );
};

export default Home;
