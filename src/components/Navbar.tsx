'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import { useDebounceCallback } from 'usehooks-ts';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Search, X } from 'lucide-react';


const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const [username, setUsername] = useState('');
  const [suggestion, setSuggestion] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounced = useDebounceCallback(setUsername, 300);

  const hideSearchRoutes = ['/sign-in', '/sign-up', '/verifyemail'];
  const shouldHideSearch = hideSearchRoutes.includes(pathname);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (username.trim() === '') {
        setSuggestion([]);
        return;
      }

      try {
        const response = await axios.get(`/api/search-user?q=${username}`);
        setSuggestion(response.data.users || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSuggestions();
  }, [username]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchBox(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-gray-800 hover:text-blue-600 transition"
        >
          GhostWhisper
        </Link>

        <div className="flex items-center gap-4">
          {!shouldHideSearch && (
            <div className="relative" ref={searchRef}>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSearchBox(prev => !prev)}
                className="hover:bg-gray-100"
              >
                {showSearchBox ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
              </Button>

              {showSearchBox && (
                <div className="absolute top-12 left-0 w-64 z-50">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => debounced(e.target.value)}
                  />
                  {suggestion.length > 0 && (
                    <div className="mt-1 bg-white border border-gray-200 rounded-md shadow max-h-40 overflow-y-auto">
                      {suggestion.map((user: { username: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                        <Link
                          href={`/u/${user.username}`}
                          key={index}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowSearchBox(false)}
                        >
                          {user.username}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}


          {session ? (
            <>
              <Link href={'/dashboard'}><span className="text-sm text-gray-700 hidden sm:inline">
                Welcome, <span className="font-medium">{user?.username || user?.email}</span>
              </span></Link>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="text-sm px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
