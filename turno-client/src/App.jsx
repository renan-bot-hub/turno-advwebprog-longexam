import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Layouts
import Layout from './layouts/Layout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import HomePage from './pages/LandingPages/HomePage';
import AboutPage from './pages/LandingPages/AboutPage';
import ProductListPage from './pages/LandingPages/ProductListPage';
import ProductPage from './pages/LandingPages/ProductPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import SignInPage from './pages/AuthPages/SignInPage';
import SignUpPage from './pages/AuthPages/SignUpPage';

// Customer Pages
import CartPage from './pages/CustomerPages/CartPage';
import OrdersPage from './pages/CustomerPages/OrdersPage';
import ProfilePage from './pages/CustomerPages/ProfilePage';

// Admin Pages
import AdminProductsPage from './pages/AdminPages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminPages/AdminOrdersPage';
import AdminReviewsPage from './pages/AdminPages/AdminReviewsPage';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: '', element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductPage /> },

      // Customer protected routes
      {
        path: 'cart',
        element: <ProtectedRoute><CartPage /></ProtectedRoute>,
      },
      {
        path: 'orders',
        element: <ProtectedRoute><OrdersPage /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
      },

      // Admin protected routes
      {
        path: 'admin/products',
        element: <AdminRoute><AdminProductsPage /></AdminRoute>,
      },
      {
        path: 'admin/orders',
        element: <AdminRoute><AdminOrdersPage /></AdminRoute>,
      },
      {
        path: 'admin/reviews',
        element: <AdminRoute><AdminReviewsPage /></AdminRoute>,
      },
      {
        path: 'admin/users',
        element: <AdminRoute><AdminUsersPage /></AdminRoute>,
      },
    ],
  },
  {
    path: 'auth/',
    element: <AuthLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;