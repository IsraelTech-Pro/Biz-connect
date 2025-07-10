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
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products/index";
import ProductDetail from "@/pages/product-detail";
import Vendors from "@/pages/vendors";
import VendorStore from "@/pages/vendor-store";
import VendorDetail from "@/pages/vendor-detail";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import VendorRegister from "@/pages/vendor/vendor-register";
import PaymentResult from "@/pages/payment-result";
import Orders from "@/pages/orders";
import VendorDashboard from "@/pages/vendor/vendor-dashboard";
import BuyerDashboard from "@/pages/buyer-dashboard";
import VendorDashboardNew from "@/pages/vendor-dashboard";
import VendorProducts from "@/pages/vendor/products";
import VendorProductsGrid from "@/pages/vendor/products-grid";
import VendorOrders from "@/pages/vendor/orders";
import VendorAnalytics from "@/pages/vendor/analytics";
import VendorSettings from "@/pages/vendor/settings";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminVendors from "@/pages/admin/vendors";
import AdminSettings from "@/pages/admin/settings";

// Buyer pages
import BrowseProducts from './pages/buyers/browse-products';
import VendorStores from './pages/buyers/vendor-stores';
import TrackOrder from './pages/buyers/track-order';
import ReturnPolicy from './pages/buyers/return-policy';
import CustomerSupport from './pages/buyers/customer-support';

// Vendor pages
import SellOnVendorHub from './pages/vendors/sell-on-vendorhub';
import VendorGuidelines from './pages/vendors/vendor-guidelines';
import PayoutInformation from './pages/vendors/payout-information';
import VendorSupport from './pages/vendors/vendor-support';

// Policy pages
import PaymentOptions from './pages/policies/payment-options';
import MobileMoney from './pages/policies/mobile-money';

// Contact page
import ContactVendor from './pages/contact-vendor';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetail} />
      <Route path="/vendors" component={Vendors} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/payment-result" component={PaymentResult} />
      <Route path="/orders" component={Orders} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/vendor/register" component={VendorRegister} />
      <Route path="/vendor/dashboard" component={VendorDashboard} />
      <Route path="/dashboard/vendor" component={VendorDashboardNew} />
      <Route path="/dashboard/buyer" component={BuyerDashboard} />
      <Route path="/vendor/products" component={VendorProducts} />
      <Route path="/vendor/products/grid" component={VendorProductsGrid} />
      <Route path="/vendor/orders" component={VendorOrders} />
      <Route path="/vendor/analytics" component={VendorAnalytics} />
      <Route path="/vendor/settings" component={VendorSettings} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/vendors" component={AdminVendors} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/stores/:id" component={VendorStore} />
      <Route path="/vendor/:id" component={VendorDetail} />
      
      {/* Buyer pages */}
      <Route path="/browse-products" component={BrowseProducts} />
      <Route path="/vendor-stores" component={VendorStores} />
      <Route path="/track-order" component={TrackOrder} />
      <Route path="/return-policy" component={ReturnPolicy} />
      <Route path="/customer-support" component={CustomerSupport} />
      
      {/* Vendor pages */}
      <Route path="/sell-on-vendorhub" component={SellOnVendorHub} />
      <Route path="/vendor-guidelines" component={VendorGuidelines} />
      <Route path="/payout-information" component={PayoutInformation} />
      <Route path="/vendor-support" component={VendorSupport} />
      
      {/* Policy pages */}
      <Route path="/payment-options" component={PaymentOptions} />
      <Route path="/mobile-money" component={MobileMoney} />
      
      {/* Contact page */}
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
