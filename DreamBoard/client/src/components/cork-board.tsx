import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { Dream } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { SparkleIcon } from "./ui/icons";

type StickyNoteColors = "amber" | "blue" | "green" | "pink" | "purple" | "yellow";
type PinColors = "red" | "blue" | "green" | "yellow" | "purple";

interface StickyNoteProps {
  id: number;
  title: string;
  color?: StickyNoteColors;
  pinColor?: PinColors;
  rotation?: number;
  position?: { x: number; y: number };
  onClick?: () => void;
}

const getRandomColor = (): StickyNoteColors => {
  const colors: StickyNoteColors[] = ["amber", "blue", "green", "pink", "purple", "yellow"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomPinColor = (): PinColors => {
  const colors: PinColors[] = ["red", "blue", "green", "yellow", "purple"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomRotation = (): number => {
  return Math.floor(Math.random() * 10) - 5;
};

const StickyNote: React.FC<StickyNoteProps> = ({
  id,
  title,
  color = getRandomColor(),
  pinColor = getRandomPinColor(),
  rotation = getRandomRotation(),
  position = { x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 },
  onClick
}) => {
  const bgColorMap = {
    amber: "bg-amber-100",
    blue: "bg-blue-100",
    green: "bg-green-100",
    pink: "bg-pink-100",
    purple: "bg-purple-100",
    yellow: "bg-yellow-100"
  };

  const pinColorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };

  return (
    <motion.div
      className={`${bgColorMap[color]} p-4 rounded-lg absolute note-shadow cursor-pointer max-w-[200px] z-10`}
      style={{
        top: `${position.y}%`,
        left: `${position.x}%`,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "2px 2px 5px rgba(0,0,0,0.1)"
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div className={`pushpin ${pinColorMap[pinColor]} w-3 h-3 rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2 z-20 shadow-sm`} />
      <p className="font-['Caveat'] text-gray-700 break-words">{title}</p>
    </motion.div>
  );
};

export const CorkBoard: React.FC = () => {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // Try to use auth, but provide fallbacks if not available
  let user = null;
  let dreams: Dream[] = [];
  
  try {
    const auth = useAuth();
    user = auth.user;
    
    // Only attempt to query dreams if auth is available
    const { data = [] } = useQuery<Dream[]>({
      queryKey: ["/api/dreams"],
      enabled: !!user
    });
    
    dreams = data;
  } catch (error) {
    console.log("Auth provider not available for CorkBoard", error);
  }

  const handleDreamClick = (id: number) => {
    if (user) {
      navigate(`/dashboard/${id}`);
    } else {
      toast({
        title: "Sign in required",
        description: "Please sign in to view your dream details",
        variant: "default"
      });
    }
  };

  return (
    <div className="cork-texture rounded-xl overflow-hidden shadow-lg mx-auto max-w-4xl h-96 md:h-[28rem] relative border-4 border-[#B89C78]" style={{
      backgroundColor: "#D2B48C",
      backgroundImage: `
        radial-gradient(#C4A87A 8%, transparent 8%),
        radial-gradient(#BFA277 15%, transparent 16%)
      `,
      backgroundSize: "30px 30px",
      backgroundPosition: "0 0, 15px 15px"
    }}>
      {/* Decorated corners */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-primary-500 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
      
      <AnimatePresence>
        {dreams && dreams.length > 0 ? (
          dreams.map((dream) => (
            <StickyNote
              key={dream.id}
              id={dream.id}
              title={dream.title}
              onClick={() => handleDreamClick(dream.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-amber-100 p-6 rounded-lg max-w-xs note-shadow transform rotate-1 relative">
              <div className="pushpin bg-red-500 w-3 h-3 rounded-full absolute -top-1.5 left-1/2 transform -translate-x-1/2"></div>
              <p className="font-['Caveat'] text-lg text-gray-700 text-center">
                {user ? "Add your first dream below!" : "This is your dream board. Add your first dream below!"}
              </p>
              <SparkleIcon className="h-5 w-5 text-amber-500 absolute -bottom-2 -right-2" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
