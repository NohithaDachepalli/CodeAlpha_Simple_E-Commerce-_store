import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Wishlist from './pages/Wishlist.jsx';
import FAQ from './pages/FAQ.jsx';
import Contact from './pages/Contact.jsx';
import Admin from './pages/Admin.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        
        {/* Protected User Routes */}
        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="order-confirmation/:id"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Guest Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Public Storefront Routes */}
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />

        {/* Admin Only Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
