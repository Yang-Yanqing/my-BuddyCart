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
import CreateItemPage from "../src/pages/CreateItemPage"
import UpdateItemPage from "../src/pages/UpdateItemPage"
import "../src/styles/App.css";

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
    <Routes>
      <Route
        element={
          <PageWrapper
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        }
      >
        <Route path="/items/new" element={<CreateItemPage />} />
        <Route path="/items/:itemId/edit" element={<UpdateItemPage />} /> 
        <Route path="/" element={<DashboardPage />} />
        <Route path="items/:itemId" element={<ItemsDetailsPage />} />
        <Route path="/Cart" element={<CartComponent />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/tags/:tag" element={<TagPage />} />
      </Route>
    </Routes>
  );
}
