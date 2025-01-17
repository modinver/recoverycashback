import { Twitter, Facebook, Instagram, Youtube } from "lucide-react";

export const FooterSection = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">RecoveryCashback</h4>
            <p className="text-gray-400">
              Your trusted source for UAE credit card comparisons and cashback optimization.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/cashback-cards" className="hover:text-white">Cashback Cards</a></li>
              <li><a href="/credit-cards" className="hover:text-white">Credit Cards</a></li>
              <li><a href="/banks" className="hover:text-white">Banks</a></li>
              <li><a href="/loans" className="hover:text-white">Loans</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>The One Tower - 12th Floor - Sheikh Zayed Rd - Barsha Heights - Dubai</li>
              <li>info@recoverycashback.com</li>
              <li>04 381 2000</li>
            </ul>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://twitter.com/recoverycashback" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={24} />
              <span className="sr-only">Follow us on Twitter</span>
            </a>
            <a href="https://facebook.com/recoverycashback" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={24} />
              <span className="sr-only">Follow us on Facebook</span>
            </a>
            <a href="https://instagram.com/recoverycashback" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={24} />
              <span className="sr-only">Follow us on Instagram</span>
            </a>
            <a href="https://youtube.com/recoverycashback" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
              <Youtube size={24} />
              <span className="sr-only">Follow us on YouTube</span>
            </a>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} RecoveryCashback.com. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};