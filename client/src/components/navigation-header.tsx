import { Link, useLocation } from "wouter";
import { Heart } from "lucide-react";

export default function NavigationHeader() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-coral">
              <Heart className="inline mr-2" size={24} />
              Deal or No Deal
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location === "/" 
                    ? "bg-coral text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                data-testid="button-player-mode"
              >
                Player Mode
              </button>
            </Link>
            <Link href="/admin">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  location === "/admin" 
                    ? "bg-coral text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                data-testid="button-admin-mode"
              >
                Admin Panel
              </button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
