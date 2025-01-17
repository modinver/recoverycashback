import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NavBar() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary">
              Recovery Cashback
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/cards" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Credit Cards
              </Link>
              <Link 
                to="/blog" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link 
                to="/about" 
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
