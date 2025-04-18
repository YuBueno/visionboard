import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { InsertDream } from "@shared/schema";

export const DreamForm: React.FC = () => {
  const [dream, setDream] = useState("");
  const { toast } = useToast();
  const [_, navigate] = useLocation();
  
  // Try to use auth, but provide fallbacks if not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth provider not available for DreamForm", error);
  }

  const createDreamMutation = useMutation({
    mutationFn: async (newDream: InsertDream) => {
      const res = await apiRequest("POST", "/api/dreams", newDream);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dreams"] });
      toast({
        title: "Dream created!",
        description: "Your dream has been added to your board",
        variant: "default"
      });
      setDream("");
      
      if (user) {
        navigate(`/dashboard/${data.id}`);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create dream",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dream.trim()) {
      toast({
        title: "Dream is required",
        description: "Please enter your dream",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add dreams",
        variant: "default"
      });
      navigate("/auth");
      return;
    }
    
    createDreamMutation.mutate({
      title: dream,
      userId: user.id
    });
  };

  return (
    <form className="flex items-center" onSubmit={handleSubmit}>
      <div className="flex-1 relative">
        <input 
          type="text" 
          id="dream-input" 
          placeholder="Enter your dream..." 
          aria-label="Enter your dream"
          className="block w-full px-4 py-3 border border-gray-300 rounded-l-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          disabled={createDreamMutation.isPending}
        />
      </div>
      <Button
        type="submit"
        className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-r-full"
        aria-label="Add dream"
        disabled={createDreamMutation.isPending}
      >
        {createDreamMutation.isPending ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </Button>
    </form>
  );
};
