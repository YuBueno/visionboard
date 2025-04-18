import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { SparkleIcon, MenuIcon } from "@/components/ui/icons";
import { CorkBoard } from "@/components/cork-board";
import { DreamForm } from "@/components/dream-form";
import { useAuth } from "@/hooks/use-auth";

export const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [_, navigate] = useLocation();
  
  // Try to use auth, but provide fallbacks if not available
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    console.log("Auth provider not available", error);
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center" aria-label="Dream Board Home">
                <SparkleIcon className="h-5 w-5 text-amber-500" />
                <span className="font-['Caveat'] text-xl ml-2 text-gray-800">Dream Board</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="#features" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                Pricing
              </Link>
              <Link href="#team" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                Our Team
              </Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <Button
                  variant="outline" 
                  className="hidden md:inline-flex items-center rounded-full text-primary-700 bg-primary-50 hover:bg-primary-100"
                  onClick={() => navigate("/dashboard/all")}
                >
                  Dashboard
                </Button>
              ) : (
                <Link href="/auth" className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                  Sign In
                </Link>
              )}
              
              <Link href={user ? "/dashboard/all" : "/auth"} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
                <span className="hidden md:inline">{user ? "My Dreams" : "Sign Up"}</span>
                <span className="md:hidden">{user ? "My Dreams" : "Get Started"}</span>
              </Link>
              
              <button 
                type="button" 
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
                aria-expanded="false"
                aria-label="Open menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-2">
          <div className="px-4 space-y-2">
            <Link href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Pricing
            </Link>
            <Link href="#team" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 transition-colors">
              Our Team
            </Link>
            {!user && (
              <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex-1 py-10 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-amber-200 text-opacity-40 transform translate-x-1/3 -translate-y-1/4 text-9xl animate-pulse">
          <SparkleIcon className="h-32 w-32" />
        </div>
        <div className="absolute bottom-0 left-0 text-amber-200 text-opacity-30 transform -translate-x-1/3 translate-y-1/4 text-9xl animate-pulse" style={{ animationDelay: "1s" }}>
          <SparkleIcon className="h-32 w-32" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <h1 className="flex items-center justify-center text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              <SparkleIcon className="h-8 w-8 text-amber-500 mr-2" />
              <span className="font-['Caveat']">Dream Board</span>
              <SparkleIcon className="h-8 w-8 text-amber-500 ml-2" />
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Pin your dreams, aspirations, and ideas to this virtual corkboard. Watch as they 
              take shape and inspire your journey.
            </p>
            <div className="mt-8 flex justify-center flex-wrap gap-4">
              {user ? (
                <Button 
                  className="inline-flex items-center px-5 py-3 text-base rounded-full shadow-sm"
                  onClick={() => navigate("/dashboard/all")}
                >
                  View Your Dreams
                </Button>
              ) : (
                <Button 
                  className="inline-flex items-center px-5 py-3 text-base rounded-full shadow-sm"
                  onClick={() => navigate("/auth")}
                >
                  Get Started
                </Button>
              )}
              <Button
                variant="outline"
                className="ml-0 md:ml-4 inline-flex items-center px-5 py-3 text-base rounded-full border-gray-200"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Learn More
                <svg className="ml-2 w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Cork Board */}
          <CorkBoard />

          {/* Dream Form */}
          <div className="mt-8 max-w-lg mx-auto">
            <DreamForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Transform Dreams Into Reality</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform helps you break down ambitious goals into actionable steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary-100 p-3 rounded-full mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated Roadmaps</h3>
              <p className="text-gray-600">Our AI automatically creates personalized timelines to help you achieve your dreams</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary-100 p-3 rounded-full mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Visualize your journey with intuitive progress indicators and milestone tracking</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-8 shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary-100 p-3 rounded-full mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resource Recommendations</h3>
              <p className="text-gray-600">Get personalized articles, videos, and tools curated specifically for your dream</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <SparkleIcon className="h-5 w-5 text-amber-500" />
              <span className="font-['Caveat'] text-xl ml-2 text-gray-800">Dream Board</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; 2023 Dream Board. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
