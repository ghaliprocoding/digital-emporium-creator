
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-100 border-t">
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-md bg-brand-600 text-white grid place-items-center font-bold">DM</span>
              <span className="font-bold">Digital Marketplace</span>
            </Link>
            <p className="text-sm text-slate-600">
              The platform for creators to sell their digital products directly to consumers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?category=videos" className="text-sm text-slate-600 hover:text-brand-600">
                  Video Content
                </Link>
              </li>
              <li>
                <Link to="/search?category=audio" className="text-sm text-slate-600 hover:text-brand-600">
                  Audio Files
                </Link>
              </li>
              <li>
                <Link to="/search?category=designs" className="text-sm text-slate-600 hover:text-brand-600">
                  Design Assets
                </Link>
              </li>
              <li>
                <Link to="/search?category=documents" className="text-sm text-slate-600 hover:text-brand-600">
                  Documents
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-slate-600 hover:text-brand-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-600 hover:text-brand-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-600 hover:text-brand-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-slate-600">
                support@digitalmarketplace.com
              </li>
              <li className="text-sm text-slate-600">
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
          &copy; {new Date().getFullYear()} Digital Marketplace. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
