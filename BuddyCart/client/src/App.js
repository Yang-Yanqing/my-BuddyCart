import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ItemsDetailsPage from "./pages/ItemsDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import TagPage from "./pages/TagsPage";
import CartComponent from "./components/CartComponent";
import CreateItemPage from "./pages/CreateItemPage";
import UpdateItemPage from "./pages/UpdateItemPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ChatAndShop from "./pages/ChatAndShop";
import FullpageDashboard from "./pages/FullpageDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Profile from "./pages/ProfilePage";
import MyShopPage from "./pages/MyShopPage";
import "./styles/App.css";
import { ItemsProvider } from "./context/ItemsContext";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute"
import { ThemeProvider } from "../src/context/UserContext"


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
    <UserProvider>
      <ThemeProvider>
        <ItemsProvider>
          <CartProvider>
            <Routes>
              <Route element={<PageWrapper isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>}>
                <Route index element={<FullpageDashboard/>}/>
                <Route path="/items/new" element={<ProtectedRoute roles={["admin","vendor"]}><CreateItemPage /></ProtectedRoute>} />
                <Route path="/items/:itemId/edit" element={<ProtectedRoute roles={["admin","vendor"]}><UpdateItemPage /></ProtectedRoute>} />
                <Route path="/items/:itemId" element={<ItemsDetailsPage />} />
                <Route path="/cart" element={<CartComponent />} />
                <Route path="/tags/:tag" element={<TagPage />} />
                <Route path="/auth/register" element={<RegisterPage />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/chatandshop/:roomId?"element={<ChatAndShop />}/>
                <Route path="/profile"element={<ProtectedRoute roles={["admin","vendor","customer"]}><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}/>
                <Route path="/vendor" element={<ProtectedRoute roles={["vendor"]}><VendorDashboard /></ProtectedRoute>}/>
                 <Route path="/chat" element={<ChatAndShop/>}/>
               <Route path="/my-shop" element={<ProtectedRoute role={["vendor"]}><MyShopPage/></ProtectedRoute>}/>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </ItemsProvider>
      </ThemeProvider> 
      </UserProvider>
     
  
  );
}
