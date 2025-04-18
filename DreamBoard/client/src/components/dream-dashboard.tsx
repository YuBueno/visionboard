import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Dream, Task, Resource, VisionItem } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  DashboardIcon,
  TimelineIcon,
  GoalsIcon,
  GalleryIcon,
  ResourcesIcon,
  SettingsIcon,
  SparkleIcon,
  BookIcon,
  VideoIcon,
  CheckIcon,
  ClockIcon,
  MenuIcon
} from "@/components/ui/icons";

interface DashboardProps {
  dreamId: string;
}

export const DreamDashboard: React.FC<DashboardProps> = ({ dreamId }) => {
  const { user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetching dream data
  const { data: dream, isLoading: isDreamLoading } = useQuery<Dream>({
    queryKey: [`/api/dreams/${dreamId}`],
    enabled: !!user && !!dreamId
  });

  // Fetching tasks data
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery<Task[]>({
    queryKey: [`/api/dreams/${dreamId}/tasks`],
    enabled: !!user && !!dreamId
  });

  // Fetching resources data
  const { data: resources = [], isLoading: isResourcesLoading } = useQuery<Resource[]>({
    queryKey: [`/api/dreams/${dreamId}/resources`],
    enabled: !!user && !!dreamId
  });

  // Fetching vision items data
  const { data: visionItems = [], isLoading: isVisionItemsLoading } = useQuery<VisionItem[]>({
    queryKey: [`/api/dreams/${dreamId}/vision-items`],
    enabled: !!user && !!dreamId
  });

  if (isDreamLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Dream not found</h2>
          <p className="mt-2 text-gray-600">This dream doesn't exist or you don't have permission to view it.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const completedTasks = tasks.filter(task => task.status === "Done").length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex h-full min-h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
              <SparkleIcon className="h-5 w-5 text-amber-500" />
              <span className="font-['Caveat'] text-lg ml-2 text-gray-800">Dream Board</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Current Dream</h3>
              <div className="mt-2 bg-amber-50 rounded-lg p-3 border border-amber-100">
                <h4 className="font-medium text-gray-900">{dream.title}</h4>
              </div>
            </div>
            <nav className="mt-2 px-2 space-y-1">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "dashboard" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <DashboardIcon className={`mr-3 ${activeTab === "dashboard" ? "text-primary-500" : "text-gray-500"}`} />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("timeline")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "timeline" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <TimelineIcon className={`mr-3 ${activeTab === "timeline" ? "text-primary-500" : "text-gray-500"}`} />
                Timeline
              </button>
              <button 
                onClick={() => setActiveTab("goals")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "goals" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <GoalsIcon className={`mr-3 ${activeTab === "goals" ? "text-primary-500" : "text-gray-500"}`} />
                Goals
              </button>
              <button 
                onClick={() => setActiveTab("gallery")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "gallery" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <GalleryIcon className={`mr-3 ${activeTab === "gallery" ? "text-primary-500" : "text-gray-500"}`} />
                Vision Gallery
              </button>
              <button 
                onClick={() => setActiveTab("resources")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "resources" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <ResourcesIcon className={`mr-3 ${activeTab === "resources" ? "text-primary-500" : "text-gray-500"}`} />
                Resources
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "settings" 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <SettingsIcon className={`mr-3 ${activeTab === "settings" ? "text-primary-500" : "text-gray-500"}`} />
                Settings
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center md:hidden">
              <button 
                type="button" 
                className="text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon />
              </button>
              <div className="ml-3 flex items-center cursor-pointer" onClick={() => navigate("/")}>
                <SparkleIcon className="h-5 w-5 text-amber-500" />
                <span className="font-['Caveat'] text-lg ml-2 text-gray-800">Dream Board</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <Button variant="ghost" onClick={() => navigate("/")}>
                    Home
                  </Button>
                  {user && (
                    <div className="ml-2 flex items-center space-x-2">
                      <span className="text-sm text-gray-700">{user.username}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3">
            <div className="mb-4">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Current Dream</h3>
              <div className="mt-1 bg-amber-50 rounded-lg p-2 border border-amber-100">
                <h4 className="font-medium text-gray-900">{dream.title}</h4>
              </div>
            </div>
            <nav className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "dashboard" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <DashboardIcon className={activeTab === "dashboard" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Dashboard</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("timeline");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "timeline" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <TimelineIcon className={activeTab === "timeline" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Timeline</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("goals");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "goals" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <GoalsIcon className={activeTab === "goals" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Goals</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("gallery");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "gallery" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <GalleryIcon className={activeTab === "gallery" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Gallery</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("resources");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "resources" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <ResourcesIcon className={activeTab === "resources" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Resources</span>
              </button>
              <button 
                onClick={() => {
                  setActiveTab("settings");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex flex-col items-center p-2 rounded-md ${
                  activeTab === "settings" ? "bg-primary-50 text-primary-700" : "text-gray-700"
                }`}
              >
                <SettingsIcon className={activeTab === "settings" ? "text-primary-500" : "text-gray-500"} />
                <span className="text-xs mt-1">Settings</span>
              </button>
            </nav>
          </div>
        )}
        
        {/* Dream dashboard content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Cover image & title */}
              <div className="relative h-48 rounded-lg bg-primary-700 overflow-hidden mb-6">
                <div className="w-full h-full object-cover opacity-50 bg-gradient-to-r from-primary-800 to-primary-600"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-primary-800/20 to-primary-900/60"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h1 className="text-2xl font-bold text-white">{dream.title}</h1>
                  <p className="text-primary-100">
                    Created {dream.createdAt ? new Date(dream.createdAt).toLocaleDateString() : "recently"}
                  </p>
                </div>
              </div>
              
              {/* Dashboard Content - Changes based on active tab */}
              {activeTab === "dashboard" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* AI Insights widget */}
                  <div className="col-span-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">AI Insights</h2>
                      <div className="mt-6 flex items-center justify-center">
                        <div className="relative h-24 w-24">
                          <svg className="h-24 w-24" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              strokeDasharray="283" 
                              strokeDashoffset={283 - (283 * progressPercentage / 100)} 
                              stroke="#4F46E5" 
                              strokeWidth="8" 
                              strokeLinecap="round" 
                              transform="rotate(-90 50 50)" 
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span 
                              className="text-3xl font-bold text-primary-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {progressPercentage}%
                            </motion.span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-center text-sm text-gray-500">
                        Your dream is {progressPercentage}% closer to becoming reality!
                      </p>
                      <div className="mt-5">
                        <h3 className="text-sm font-medium text-gray-900">Next Best Action</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {dream.nextAction || "Create your plan and break down your first steps"}
                        </p>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-900">AI Confidence</h3>
                        <div className="mt-1 h-2 bg-gray-200 rounded">
                          <div className="h-2 bg-primary-500 rounded" style={{ width: `${dream.aiConfidence || 75}%` }}></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">{dream.aiConfidence || 75}% confidence</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent milestones */}
                  <div className="col-span-1 md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Recent Milestones</h2>
                      <div className="mt-6 flow-root">
                        {isTasksLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          </div>
                        ) : tasks.length > 0 ? (
                          <ul className="-my-5 divide-y divide-gray-200">
                            {tasks.slice(0, 3).map((task) => (
                              <li key={task.id} className="py-4">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full 
                                      ${task.status === "Done" 
                                        ? "bg-green-100" 
                                        : task.status === "Doing" 
                                          ? "bg-primary-100" 
                                          : "bg-gray-100"
                                      }`}>
                                      {task.status === "Done" 
                                        ? <CheckIcon className="text-green-600" /> 
                                        : task.status === "Doing" 
                                          ? <ClockIcon className="text-primary-600" /> 
                                          : <ClockIcon className="text-gray-500" />
                                      }
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {task.status === "Done" 
                                        ? `Completed ${task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "recently"}`
                                        : task.status === "Doing" 
                                          ? `In progress - Due ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "soon"}`
                                          : `Upcoming - Due ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "soon"}`
                                      }
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No tasks yet. Start by adding your first milestone!</p>
                            <Button 
                              className="mt-4"
                              onClick={() => setActiveTab("timeline")}
                            >
                              Add First Task
                            </Button>
                          </div>
                        )}
                      </div>
                      {tasks.length > 0 && (
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setActiveTab("timeline")}
                          >
                            View Timeline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recommended resources */}
                  <div className="col-span-1 md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Recommended Resources</h2>
                      <div className="mt-6 flow-root">
                        {isResourcesLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          </div>
                        ) : resources.length > 0 ? (
                          <ul className="-my-5 divide-y divide-gray-200">
                            {resources.slice(0, 2).map((resource) => (
                              <li key={resource.id} className="py-4">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0">
                                    <span className={`inline-flex items-center justify-center h-10 w-10 rounded-md 
                                      ${resource.type === "article" 
                                        ? "bg-amber-100" 
                                        : resource.type === "video" 
                                          ? "bg-primary-100" 
                                          : "bg-gray-100"
                                      }`}>
                                      {resource.type === "article" 
                                        ? <BookIcon className="text-amber-600" /> 
                                        : resource.type === "video" 
                                          ? <VideoIcon className="text-primary-600" /> 
                                          : <ResourcesIcon className="text-gray-600" />
                                      }
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">{resource.title}</h3>
                                    <div className="mt-1 flex items-center">
                                      <span className="text-xs text-gray-500">
                                        {resource.type === "article" 
                                          ? `${resource.readTime || 10} min read`
                                          : resource.type === "video" 
                                            ? `${resource.duration || 15} min video`
                                            : `${resource.type}`
                                        }
                                      </span>
                                      <span className="mx-1 text-gray-500">•</span>
                                      {resource.isVerified && (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                          Verified by AI
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="ml-auto">
                                    <a 
                                      href={resource.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">No resources found yet. They'll appear as you progress!</p>
                          </div>
                        )}
                      </div>
                      {resources.length > 0 && (
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setActiveTab("resources")}
                          >
                            View All Resources
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Vision Gallery Preview */}
                  <div className="col-span-1 bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-lg font-medium text-gray-900">Vision Gallery</h2>
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        {isVisionItemsLoading ? (
                          <div className="col-span-2 flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                          </div>
                        ) : visionItems.length > 0 ? (
                          <>
                            {visionItems.slice(0, 3).map((item, index) => (
                              <div key={item.id} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  <GalleryIcon className="h-6 w-6" />
                                </div>
                              </div>
                            ))}
                            {visionItems.length > 3 && (
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-500 text-sm font-medium">+{visionItems.length - 3} more</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="col-span-2 text-center py-6">
                            <p className="text-gray-500">Start visualizing your dream by adding images!</p>
                            <Button 
                              className="mt-4"
                              onClick={() => setActiveTab("gallery")}
                            >
                              Add Images
                            </Button>
                          </div>
                        )}
                      </div>
                      {visionItems.length > 0 && (
                        <div className="mt-6">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setActiveTab("gallery")}
                          >
                            View Gallery
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Timeline Tab Content */}
              {activeTab === "timeline" && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Timeline & Milestones</h2>
                      <Button>Add New Task</Button>
                    </div>
                    
                    {isTasksLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                      </div>
                    ) : tasks.length > 0 ? (
                      <div className="space-y-8">
                        {tasks.map((task, index) => (
                          <div key={task.id} className="relative">
                            {/* Connecting line */}
                            {index < tasks.length - 1 && (
                              <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
                            )}
                            
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <div className={`
                                  h-8 w-8 rounded-full flex items-center justify-center
                                  ${task.status === "Done" 
                                    ? "bg-green-100 text-green-600" 
                                    : task.status === "Doing" 
                                      ? "bg-primary-100 text-primary-600" 
                                      : "bg-gray-100 text-gray-500"
                                  }
                                `}>
                                  {task.status === "Done" 
                                    ? <CheckIcon /> 
                                    : <ClockIcon />
                                  }
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                  <div className="flex justify-between">
                                    <h3 className="text-base font-medium text-gray-900">{task.title}</h3>
                                    <span className={`
                                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                      ${task.status === "Done" 
                                        ? "bg-green-100 text-green-800" 
                                        : task.status === "Doing" 
                                          ? "bg-blue-100 text-blue-800" 
                                          : "bg-gray-100 text-gray-800"
                                      }
                                    `}>
                                      {task.status}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                                    <span>Priority: {task.priority || "Medium"}</span>
                                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <GalleryIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating your first task or milestone.</p>
                        <div className="mt-6">
                          <Button>Create First Task</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Goals Tab Content */}
              {activeTab === "goals" && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Goals</h2>
                      <Button>Add New Goal</Button>
                    </div>
                    
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                      <GoalsIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Set your goals</h3>
                      <p className="mt-1 text-sm text-gray-500">Define what success looks like for your dream.</p>
                      <div className="mt-6">
                        <Button>Create First Goal</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Vision Gallery Tab Content */}
              {activeTab === "gallery" && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Vision Gallery</h2>
                      <Button>Add Vision Item</Button>
                    </div>
                    
                    {isVisionItemsLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                      </div>
                    ) : visionItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {visionItems.map((item) => (
                          <div key={item.id} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                              <GalleryIcon className="h-8 w-8" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <GalleryIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No images yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Add photos, videos, or other visual inspiration.</p>
                        <div className="mt-6">
                          <Button>Upload First Image</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Resources Tab Content */}
              {activeTab === "resources" && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-medium text-gray-900">Resources</h2>
                      <div className="flex space-x-2">
                        <Button variant="outline">Filter</Button>
                        <Button>Add Resource</Button>
                      </div>
                    </div>
                    
                    {isResourcesLoading ? (
                      <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                      </div>
                    ) : resources.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {resources.map((resource) => (
                          <div key={resource.id} className="py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-md 
                                  ${resource.type === "article" 
                                    ? "bg-amber-100" 
                                    : resource.type === "video" 
                                      ? "bg-primary-100" 
                                      : "bg-gray-100"
                                  }`}>
                                  {resource.type === "article" 
                                    ? <BookIcon className="text-amber-600" /> 
                                    : resource.type === "video" 
                                      ? <VideoIcon className="text-primary-600" /> 
                                      : <ResourcesIcon className="text-gray-600" />
                                  }
                                </span>
                              </div>
                              <div className="ml-4 flex-1">
                                <h3 className="text-base font-medium text-gray-900">{resource.title}</h3>
                                <p className="mt-1 text-sm text-gray-600">{resource.description}</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {resource.type}
                                  </span>
                                  {resource.isVerified && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Verified by AI
                                    </span>
                                  )}
                                  {resource.isFree === false && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                      Paid
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <a 
                                  href={resource.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <ResourcesIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No resources yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Resources will be suggested as you progress or you can add them manually.</p>
                        <div className="mt-6">
                          <Button>Add First Resource</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Settings Tab Content */}
              {activeTab === "settings" && (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Dream Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="dream-title" className="block text-sm font-medium text-gray-700">Dream Title</label>
                        <input
                          type="text"
                          id="dream-title"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          defaultValue={dream.title}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dream-description" className="block text-sm font-medium text-gray-700">Dream Description</label>
                        <textarea
                          id="dream-description"
                          rows={3}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          defaultValue={dream.description || ""}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                              >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Color Theme</h3>
                        <div className="mt-2 flex space-x-2">
                          {["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-yellow-500"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              className={`h-8 w-8 rounded-full border-2 ${color} ${color === "bg-purple-500" ? "border-gray-900" : "border-transparent"}`}
                              aria-label={`Select ${color.replace("bg-", "").replace("-500", "")} theme`}
                            ></button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                          <Button variant="destructive">Delete Dream</Button>
                          <Button variant="outline">Cancel</Button>
                          <Button>Save Changes</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
