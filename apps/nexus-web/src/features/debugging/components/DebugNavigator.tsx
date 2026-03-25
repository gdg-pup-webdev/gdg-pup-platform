"use client";

import { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import Link from "next/link";
import { IoIosNavigate } from "react-icons/io";
import { IoNavigate } from "react-icons/io5";
import { configs } from "@/lib/constants/configs";
import { LINKS } from "@/lib/constants/links";

export const DebugNavigator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Create a reference

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the menu is open and if the clicked element is NOT inside the menuRef
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (configs.env.development !== true) {
    console.log("DebugNavigator is only rendered in development mode");
    return null; // Don't render anything if not in development mode
  }

  console.log("Rendering DebugNavigator");
  return (
    <>
      {/* Attached the ref to the wrapper div */}
      <div
        ref={menuRef}
        className="fixed right-5 bottom-20 z-[500] bg-yellow-500 shadow-md rounded-full aspect-square w-10 p-2"
      >
        <div className="relative flex h-full w-full items-center justify-center">
          <IoNavigate
            className="cursor-pointer text-3xl  text-white hover:scale-130 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>

        {isOpen && (
          <div className="absolute right-0 bottom-[110%] flex w-50 flex-col rounded-2xl bg-white p-4 text-black shadow-md">
            {Object.entries(DEBUGGIN_LINKS).map(([key, value]) => (
              <Link
                className="cursor-pointer hover:bg-gray-400"
                key={key}
                href={value}
                onClick={() => setIsOpen(false)} // Close when a link is clicked
              >
                {key}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const DEBUGGIN_LINKS = LINKS.debugging;
