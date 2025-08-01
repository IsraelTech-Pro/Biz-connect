import { Link } from 'wouter';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">KTU BizConnect</h4>
            <p className="text-gray-400 mb-4">
              Connecting KTU students and businesses. Discover amazing products and services from student entrepreneurs at Koforidua Technical University.
            </p>
            <div className="flex space-x-4">
              <i className="fab fa-facebook text-orange-500 hover:text-orange-600 cursor-pointer"></i>
              <i className="fab fa-twitter text-orange-500 hover:text-orange-600 cursor-pointer"></i>
              <i className="fab fa-instagram text-orange-500 hover:text-orange-600 cursor-pointer"></i>
            </div>
          </div>

          <div>
            <h5 className="font-semibold mb-4">For Buyers</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products"><span className="hover:text-orange-500 cursor-pointer">Browse Products</span></Link></li>
              <li><a href="#" className="hover:text-orange-500">Track Orders</a></li>
              <li><a href="#" className="hover:text-orange-500">Return Policy</a></li>
              <li><a href="#" className="hover:text-orange-500">Customer Support</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">For Vendors</h5>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/auth/register"><span className="hover:text-orange-500 cursor-pointer">Start Your Business</span></Link></li>
              <li><a href="#" className="hover:text-orange-500">Vendor Guidelines</a></li>
              <li><a href="#" className="hover:text-orange-500">Payout Information</a></li>
              <li><a href="#" className="hover:text-orange-500">Vendor Support</a></li>
            </ul>
          </div>

          
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 KTU BizConnect. All rights reserved. Empowering KTU student entrepreneurs.</p>
        </div>
      </div>
    </footer>
  );
};
