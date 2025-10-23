import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import DashboardPage from "./pages/DashboardPage";
import ItemsDetailsPage from "./pages/ItemsDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import TagPage from "./pages/TagsPage";
import CartComponent from "./components/CartComponent";
import CreateItemPage from "./pages/CreateItemPage";
import UpdateItemPage from "./pages/UpdateItemPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import "./styles/App.css";
import { ItemsProvider } from "./context/ItemsContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";  

//protected route(Draft)
function ProtectedRoute({ children, roles }) {
  const { useAuth } = require("./context/AuthContext");
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <LoginPage />; 
  if (roles && !roles.includes(user?.role)) return <DashboardPage />;
  return children;
}

function PageWrapper({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="App">
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  return (
    <AuthProvider> 
      <UserProvider>
        <ItemsProvider>
          <CartProvider>
            <Routes>
              <Route
                element={
                  <PageWrapper
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                  />
                }
              >
                <Route path="/" element={<DashboardPage />} />
                <Route path="/items/new" element={<CreateItemPage />} />
                <Route path="/items/:itemId/edit" element={<UpdateItemPage />} />
                <Route path="/items/:itemId" element={<ItemsDetailsPage />} />
                <Route path="/cart" element={<CartComponent />} />
                <Route path="/tags/:tag" element={<TagPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />

                {/* what olny can be visite by admin and vendor
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor"
                  element={
                    <ProtectedRoute roles={["vendor","admin"]}>
                      <VendorPage />
                    </ProtectedRoute>
                  }
                />
                */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </ItemsProvider>
      </UserProvider>
    </AuthProvider>
  );
}
