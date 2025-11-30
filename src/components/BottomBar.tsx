import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export default function BottomBar() {
  return (
    <footer className="bg-gray-900 text-white w-full shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6 grid md:grid-cols-3 gap-6">
        
        {/* Company Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">Future Path</span>
          </div>
          <p className="text-sm text-gray-300">Your pathway to global education and scholarships.</p>
          <div className="flex items-center gap-2 mt-2 text-gray-300">
            <Mail className="w-4 h-4" />
            <span>contact@futurepath.com</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Phone className="w-4 h-4" />
            <span>+92 300 1234567</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span>Lahore, Pakistan</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <Link to="/" className="hover:text-primary mb-1">Home</Link>
          <Link to="/universities" className="hover:text-primary mb-1">Universities</Link>
          <Link to="/scholarships" className="hover:text-primary mb-1">Scholarship</Link>
        </div>

        {/* Social Media */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-3 text-gray-300">
            <a href="#" className="hover:text-primary"><FaFacebookF className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><FaTwitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><FaLinkedinIn className="w-5 h-5" /></a>
            <a href="#" className="hover:text-primary"><FaInstagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>

      {/* Bottom border and copyright */}
      <div className="border-t border-gray-700 mt-4 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Future Path. All rights reserved.
      </div> 
    </footer>
  );
}
