import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import RegistrationModal from "@/components/auth/RegistrationModal";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { language, translations } = useLanguage();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [hasVisited, setHasVisited] = useLocalStorage("hasVisited", false);

  useEffect(() => {
    if (!hasVisited) {
      setShowRegModal(true);
      setHasVisited(true);
    }
  }, [hasVisited, setHasVisited]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const navLinks = [
    { href: "/", icon: "fas fa-home", label: translations.home },
    { href: "/modules", icon: "fas fa-book", label: translations.modules },
    { href: "/chat", icon: "fas fa-comment-dots", label: translations.chat },
    { href: "/resources", icon: "fas fa-file-pdf", label: translations.resources }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside 
        className={`w-full md:w-64 bg-gray-800 text-white flex-shrink-0 ${showSidebar ? 'block' : 'hidden md:block'}`}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center space-x-2 mb-8">
            <i className="fas fa-robot text-primary text-xl"></i>
            <h1 className="text-xl font-semibold">AI Learning</h1>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1 flex-grow">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center space-x-2 p-2 rounded ${
                  location === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <i className={link.icon}></i>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Section */}
          <div className="mt-auto">
            <div className="p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm">
                  {user?.username ? user.username.substring(0, 2).toUpperCase() : "ES"}
                </div>
                <div className="text-sm">
                  <p className="font-medium">{user?.username || translations.student}</p>
                  <p className="text-xs text-gray-300">{translations.basicAccount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              className="md:hidden mr-2 text-gray-500"
              onClick={toggleSidebar}
            >
              <i className="fas fa-bars"></i>
            </button>
            <h2 className="text-lg font-medium">{translations.platformTitle}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <LanguageToggle />
            <Button size="sm" variant="outline" asChild>
              <Link href="/resources">
                <i className="fas fa-download mr-1"></i> {translations.resources}
              </Link>
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-grow overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Registration Modal */}
      <RegistrationModal isOpen={showRegModal} onClose={() => setShowRegModal(false)} />
    </div>
  );
}
