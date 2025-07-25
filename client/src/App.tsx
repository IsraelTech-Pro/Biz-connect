import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShoppingCartModal } from "@/components/shopping-cart";
import { PaymentCallbackHandler } from "@/components/payment-callback-handler";
import { PaymentSuccessNotice } from "@/components/payment-success-notice";

// Core KTU BizConnect pages
import NotFound from "@/pages/not-found";
import KTUHome from "@/pages/ktu-home";
import KTUBusinesses from "./pages/businesses";
import KTUProductsListing from "./pages/products-listing";
import BusinessResources from "./pages/business-resources";
import CommunityForum from "./pages/community-forum";
import MentorshipHub from "./pages/mentorship-hub";

// Marketplace functionality
import ProductDetail from "@/pages/product-detail";
import Vendors from "@/pages/vendors";
import VendorStore from "@/pages/vendor-store";
import VendorDetail from "@/pages/vendor-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import PaymentResult from "@/pages/payment-result";
import Orders from "@/pages/orders";
import CartDashboard from './pages/cart-dashboard';
import ContactVendor from './pages/contact-vendor';

// Authentication
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

// Vendor functionality
import VendorRegister from "@/pages/vendor/vendor-register";
import VendorProducts from "@/pages/vendor/products";
import VendorProductsGrid from "@/pages/vendor/products-grid";
import VendorOrders from "@/pages/vendor/orders";
import VendorAnalytics from "@/pages/vendor/analytics";
import VendorSettings from "@/pages/vendor/settings";

// Dashboards
import BuyerDashboard from "@/pages/buyer-dashboard";

// Admin functionality
import AdminLogin from "./pages/admin/admin-login";
import AdminDashboard from "./pages/admin/admin-dashboard";
import AddMentor from "./pages/admin/mentors/add";
import AddProgram from "./pages/admin/programs/add";
import AddResource from "./pages/admin/resources/add";
import MentorsList from "./pages/admin/mentors/list";
import ProgramsList from "./pages/admin/programs/list";
import ResourcesList from "./pages/admin/resources/list";
import AdminVendors from "@/pages/admin/vendors";
import AdminSettings from "@/pages/admin/settings";

// Support and policy pages
import BrowseProducts from './pages/buyers/browse-products';
import VendorStores from './pages/buyers/vendor-stores';
import TrackOrder from './pages/buyers/track-order';
import ReturnPolicy from './pages/buyers/return-policy';
import CustomerSupport from './pages/buyers/customer-support';
import SellOnVendorHub from './pages/vendors/sell-on-vendorhub';
import VendorGuidelines from './pages/vendors/vendor-guidelines';
import PayoutInformation from './pages/vendors/payout-information';
import VendorSupport from './pages/vendors/vendor-support';
import PaymentOptions from './pages/policies/payment-options';
import MobileMoney from './pages/policies/mobile-money';

function Router() {
  return (
    <Switch>
      {/* Core KTU BizConnect pages */}
      <Route path="/" component={KTUHome} />
      <Route path="/businesses" component={KTUBusinesses} />
      <Route path="/mentorship" component={MentorshipHub} />
      <Route path="/resources" component={BusinessResources} />
      <Route path="/community" component={CommunityForum} />
      
      {/* Products and marketplace */}
      <Route path="/products-listing" component={KTUProductsListing} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/stores/:id" component={VendorStore} />
      <Route path="/vendor/:id" component={VendorDetail} />
      
      {/* Shopping and orders */}
      <Route path="/cart" component={Cart} />
      <Route path="/cart-dashboard" component={CartDashboard} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-result" component={PaymentResult} />
      <Route path="/orders" component={Orders} />
      
      {/* Authentication */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      
      {/* Vendor functionality */}
      <Route path="/vendor/register" component={VendorRegister} />
      <Route path="/vendor/products" component={VendorProducts} />
      <Route path="/vendor/products/grid" component={VendorProductsGrid} />
      <Route path="/vendor/orders" component={VendorOrders} />
      <Route path="/vendor/analytics" component={VendorAnalytics} />
      <Route path="/vendor/settings" component={VendorSettings} />
      
      {/* Dashboards */}
      <Route path="/dashboard/buyer" component={BuyerDashboard} />
      
      {/* Admin functionality */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/mentors/add" component={AddMentor} />
      <Route path="/admin/mentors" component={MentorsList} />
      <Route path="/admin/programs/add" component={AddProgram} />
      <Route path="/admin/programs" component={ProgramsList} />
      <Route path="/admin/resources/add" component={AddResource} />
      <Route path="/admin/resources" component={ResourcesList} />
      <Route path="/admin/vendors" component={AdminVendors} />
      <Route path="/admin/settings" component={AdminSettings} />
      
      {/* Support pages */}
      <Route path="/browse-products" component={BrowseProducts} />
      <Route path="/vendor-stores" component={VendorStores} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/customer-support" component={CustomerSupport} />
      
      {/* Information pages */}
      <Route path="/sell-on-vendorhub" component={SellOnVendorHub} />
      <Route path="/vendor-guidelines" component={VendorGuidelines} />
      <Route path="/payout-information" component={PayoutInformation} />
      <Route path="/vendor-support" component={VendorSupport} />
      <Route path="/payment-options" component={PaymentOptions} />
      <Route path="/mobile-money" component={MobileMoney} />
      
      {/* Contact */}
      <Route path="/contact-vendor/:vendorId" component={ContactVendor} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <PaymentCallbackHandler />
            <PaymentSuccessNotice />
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
            <ShoppingCartModal />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;