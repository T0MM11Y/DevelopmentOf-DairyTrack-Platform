import { Route, Routes, Navigate } from "react-router-dom";
import "./configuration/i18n";
import React, { useEffect, useState } from "react";
import './i18n'; // ✅ ini harus ada


// Public
import Login from "./Auth/login";
import withUserLayout from "./user/withUserLayout";

// Admin Layout
import Header from "./admin/components/header";
import Sidebar from "./admin/components/sidebar";
import Footer from "./admin/components/footer";

// Admin Pages
import Dashboard from "./admin/pages/dashboard/Dashboard";

import JenisPakan from "./admin/pages/pakan/FeedType/FeedTypeListPage.js";
import TambahJenisPakan from "./admin/pages/pakan/FeedType/CreateFeedType.js";
import DetailJenisPakan from "./admin/pages/pakan/FeedType/FeedTypeDetail.js";

import Pakan from "./admin/pages/pakan/Feed/FeedListPage.js";
import TambahPakan from "./admin/pages/pakan/Feed/CreateFeed.js";
import DetailPakan from "./admin/pages/pakan/Feed/FeedDetailPage.js";

import StokPakan from "./admin/pages/pakan/FeedStock/feedStockList.js";
import TambahStokPakan from "./admin/pages/pakan/FeedStock/AddStock.js";
import EditStock from "./admin/pages/pakan/FeedStock/EditStock.js";

import PakanHarian from "./admin/pages/pakan/DailyFeed/DailyFeedList.js";
import TambahPakanHarian from "./admin/pages/pakan/DailyFeed/CreateDailyFeed.js";
import DetailPakanHarian from "./admin/pages/pakan/DailyFeed/DetailDailyFeed.js";

import ItemPakanHarian from "./admin/pages/pakan/DailyFeedItem/DailyFeedItem.js";
import TambahItemPakan from "./admin/pages/pakan/DailyFeedItem/CreateDailyFeedItem.js";

import Nutrisi from "./admin/pages/pakan/Nutrition/ListNutrisi.js";
import DashboardPakan from "./admin/pages/pakan/Dashboard/FeedDashboard.js";

import DataProduksiSusu from "./admin/pages/produktivitas/MilkProductionLogs/DataProduksiSusu";
import MilkProductionPhase from "./admin/pages/produktivitas/MilkProductionAnalysis/MilkProductionPhaseAnalysis.js";
import FreshnesOfMilk from "./admin/pages/produktivitas/FreshnessOfMilk/FreshnessOfMilk.js";

// Sales & Financial
import Sales from "./admin/pages/keuangan/sales/Sales.js";
import SalesEditPage from "./admin/pages/keuangan/sales/SalesEditPage.js";
import SalesCreatePage from "./admin/pages/keuangan/sales/SalesCreatePage.js";

import Finance from "./admin/pages/keuangan/finance/Finance.js";
import AddIncomePage from "./admin/pages/keuangan/finance/AddIncomePage.js";
import AddExpensePage from "./admin/pages/keuangan/finance/AddExpensePage.js";

import ProductListPage from "./admin/pages/keuangan/product/ProductPage.js";
import ProductCreatePage from "./admin/pages/keuangan/product/ProductCreatePage.js";
import ProductEditPage from "./admin/pages/keuangan/product/ProductEditPage.js";
import ProductHistoryPage from "./admin/pages/keuangan/product/ProductHistoryPage.js";

import ProductTypePage from "./admin/pages/keuangan/product/ProductTypePage.js";
import ProductTypeCreatePage from "./admin/pages/keuangan/product/ProductTypeCreatePage.js";
import ProductTypeEditPage from "./admin/pages/keuangan/product/ProductTypeEditPage.js";

//kesehatan
import CowListPage from "./admin/pages/peternakan/cows/CowListPage.js";
import CowCreatePage from "./admin/pages/peternakan/cows/CowCreatePage.js";
import CowEditPage from "./admin/pages/peternakan/cows/CowEditPage.js";

import FarmerListPage from "./admin/pages/peternakan/farmers/FarmerListPage.js";
import FarmerCreatePage from "./admin/pages/peternakan/farmers/FarmerCreatePage.js";
import FarmerEditPage from "./admin/pages/peternakan/farmers/FarmerEditPage.js";

import SupervisorListPage from "./admin/pages/peternakan/supervisor/SupervisorListPage.js";
import SupervisorCreatePage from "./admin/pages/peternakan/supervisor/SupervisorCreatePage.js";
import SupervisorEditPage from "./admin/pages/peternakan/supervisor/SupervisorEditPage.js";

// Symptoms
import SymptomListPage from "./admin/pages/kesehatan/symptoms/SymptomListPage.js";
import SymptomCreatePage from "./admin/pages/kesehatan/symptoms/SymptomCreatePage.js";
import SymptomEditPage from "./admin/pages/kesehatan/symptoms/SymptomEditPage.js";

import HealthCheckListPage from "./admin/pages/kesehatan/health-checks/HealthCheckListPage.js";
import HealthCheckCreatePage from "./admin/pages/kesehatan/health-checks/HealthCheckCreatePage.js";
import HealthCheckEditPage from "./admin/pages/kesehatan/health-checks/HealthCheckEditPage.js";

import DiseaseHistoryListPage from "./admin/pages/kesehatan/disease-history/DiseaseHistoryListPage.js";
import DiseaseHistoryCreatePage from "./admin/pages/kesehatan/disease-history/DiseaseHistoryCreatePage.js";
import DiseaseHistoryEditPage from "./admin/pages/kesehatan/disease-history/DiseaseHistoryEditPage.js";

import ReproductionListPage from "./admin/pages/kesehatan/reproduction/ReproductionListPage.js";
import ReproductionCreatePage from "./admin/pages/kesehatan/reproduction/ReproductionCreatePage.js";
import ReproductionEditPage from "./admin/pages/kesehatan/reproduction/ReproductionEditPage.js";
import DashboardKesehatanPage from "./admin/pages/kesehatan/DashboardKesehatanPage";

// Import CSS
import "./assets/admin/css/icons.min.css";
import "./assets/admin/css/app.css";
import "./assets/admin/css/bootstrap.min.css";
// import "./assets/admin/css/modal.css";

import "simplebar-react/dist/simplebar.min.css";

// User Pages
import IdentitasPeternakanPage from "./user/pages/IdentitasPeternakanPage";
import SejarahPage from "./user/pages/SejarahPage";
import FasilitasPage from "./user/pages/FasilitasPage";
import BlogPage from "./user/pages/BlogPage";
import ProdukPage from "./user/pages/ProdukPage";
import GaleriPage from "./user/pages/GaleriPage";
import DashboardUser from "./user/pages/Dashboard";
import Pemesanan from "./user/pages/Pemesanan/Pemesanan.js";

// Artikel Detail Page (komponen baru)
import ArticleDetail from "./user/pages/BlogDetail.js"; // Artikel Detail
import blogAll from "./admin/pages/peternakan/blog/blogAll.js";
import blogCreate from "./admin/pages/peternakan/blog/createBlog.js";
import galleryAll from "./admin/pages/peternakan/gallery/gallery_all.js";
import MilkProductionAnalysis from "./admin/pages/produktivitas/MilkProductionAnalysis/MilkProductionTrendAnalysis.js";
// import Pemesanan from "./user/pages/Pemesanan.js";
const withAdminLayout = (Component) => {
  const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Deteksi ukuran layar
    useEffect(() => {
      const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        setSidebarOpen(!mobile);
      };

      handleResize(); // initial
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
      <div className="d-flex flex-column min-vh-100">
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="d-flex flex-grow-1" style={{ position: "relative" }}>
          {/* Sidebar (left column) */}
          {(isSidebarOpen || !isMobile) && (
            <Sidebar
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}

          {/* Overlay untuk mobile */}
          {isMobile && isSidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                position: "fixed",
                top: "60px", // tinggi header
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 1030,
              }}
            />
          )}

          {/* Main Content */}
          <div
            className="flex-grow-1"
            style={{
              marginLeft: !isMobile ? (isCollapsed ? 80 : 275) : 0,
              padding: "20px",
              paddingTop: isMobile ? "15px" : "25px", // ✅ offset tinggi header
              overflowY: "auto",
              transition: "margin-left 0.3s ease-in-out",
            }}
          >
            <Component />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return <AdminLayout />;
};

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={withUserLayout(DashboardUser)} />
      <Route path="/logout" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<Login />} />
      {/* User Routes */}
      <Route path="/dashboard" element={withUserLayout(DashboardUser)} />
      <Route path="/sejarah" element={withUserLayout(SejarahPage)} />
      <Route path="/fasilitas" element={withUserLayout(FasilitasPage)} />
      <Route path="/blog" element={withUserLayout(BlogPage)} />
      <Route path="/produk" element={withUserLayout(ProdukPage)} />
      <Route path="/galeri" element={withUserLayout(GaleriPage)} />
      <Route
        path="/identitas-peternakan"
        element={withUserLayout(IdentitasPeternakanPage)}
      />
      <Route path="/pemesanan" element={withUserLayout(Pemesanan)} />
      {/* Artikel Detail Route */}
      <Route path="/blog/:id" element={withUserLayout(ArticleDetail)} />{" "}
      {/* Menambahkan rute untuk detail artikel */}
      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute>{withAdminLayout(Dashboard)}</ProtectedRoute>}
      />
      <Route
        path="/admin/pakan/dashboard"
        element={
          <ProtectedRoute>{withAdminLayout(DashboardPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan/jenis"
        element={<ProtectedRoute>{withAdminLayout(JenisPakan)}</ProtectedRoute>}
      />
      <Route
        path="/admin/detail/jenis-pakan/:id"
        element={
          <ProtectedRoute>{withAdminLayout(DetailJenisPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan/jenis/tambah"
        element={
          <ProtectedRoute>{withAdminLayout(TambahJenisPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan"
        element={<ProtectedRoute>{withAdminLayout(Pakan)}</ProtectedRoute>}
      />
      <Route
        path="/admin/detail-pakan/:id"
        element={
          <ProtectedRoute>{withAdminLayout(DetailPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan/tambah"
        element={
          <ProtectedRoute>{withAdminLayout(TambahPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan/stok"
        element={<ProtectedRoute>{withAdminLayout(StokPakan)}</ProtectedRoute>}
      />
      <Route
        path="/admin/stok/edit/:id"
        element={<ProtectedRoute>{withAdminLayout(EditStock)}</ProtectedRoute>}
      />
      <Route
        path="/admin/pakan/tambah-stok"
        element={
          <ProtectedRoute>{withAdminLayout(TambahStokPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/pakan-harian"
        element={
          <ProtectedRoute>{withAdminLayout(PakanHarian)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/detail-pakan-harian/:id"
        element={
          <ProtectedRoute>{withAdminLayout(DetailPakanHarian)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/tambah/pakan-harian"
        element={
          <ProtectedRoute>{withAdminLayout(TambahPakanHarian)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/item-pakan-harian"
        element={
          <ProtectedRoute>{withAdminLayout(ItemPakanHarian)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/tambah/item-pakan-harian"
        element={
          <ProtectedRoute>{withAdminLayout(TambahItemPakan)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/nutrisi-pakan-harian"
        element={<ProtectedRoute>{withAdminLayout(Nutrisi)}</ProtectedRoute>}
      />
      <Route
        path="/admin/susu/produksi"
        element={
          <ProtectedRoute>{withAdminLayout(DataProduksiSusu)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/milk-production/analysis"
        element={
          <ProtectedRoute>
            {withAdminLayout(MilkProductionAnalysis)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/susu/milk-production/phase"
        element={
          <ProtectedRoute>
            {withAdminLayout(MilkProductionPhase)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/susu/kesegaransusu"
        element={
          <ProtectedRoute>{withAdminLayout(FreshnesOfMilk)}</ProtectedRoute>
        }
      />
      {/* Admin peternakan - Sapi */}
      <Route
        path="/admin/peternakan/sapi"
        element={
          <ProtectedRoute>{withAdminLayout(CowListPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/sapi/create"
        element={
          <ProtectedRoute>{withAdminLayout(CowCreatePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/sapi/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(CowEditPage)}</ProtectedRoute>
        }
      />
      {/* Admin peternakan - Farmers */}
      <Route
        path="/admin/peternakan/farmer"
        element={
          <ProtectedRoute>{withAdminLayout(FarmerListPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/farmer/create"
        element={
          <ProtectedRoute>{withAdminLayout(FarmerCreatePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/farmer/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(FarmerEditPage)}</ProtectedRoute>
        }
      />
      {/* Admin peternakan - Supervisor */}
      <Route
        path="/admin/peternakan/supervisor"
        element={
          <ProtectedRoute>{withAdminLayout(SupervisorListPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/supervisor/create"
        element={
          <ProtectedRoute>
            {withAdminLayout(SupervisorCreatePage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/peternakan/supervisor/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(SupervisorEditPage)}</ProtectedRoute>
        }
      />
      {/* Admin Article */}
      <Route
        path="/admin/blog/all"
        element={<ProtectedRoute>{withAdminLayout(blogAll)}</ProtectedRoute>}
      />
      <Route
        path="/admin/blog/create"
        element={<ProtectedRoute>{withAdminLayout(blogCreate)}</ProtectedRoute>}
      />
      <Route
        path="/admin/gallery/all"
        element={<ProtectedRoute>{withAdminLayout(galleryAll)}</ProtectedRoute>}
      />
      {/* Admin Kesehatan - Pemeriksaan */}
      <Route
        path="/admin/kesehatan/pemeriksaan"
        element={
          <ProtectedRoute>
            {withAdminLayout(HealthCheckListPage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/pemeriksaan/create"
        element={
          <ProtectedRoute>
            {withAdminLayout(HealthCheckCreatePage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/pemeriksaan/edit/:id"
        element={
          <ProtectedRoute>
            {withAdminLayout(HealthCheckEditPage)}
          </ProtectedRoute>
        }
      />
      {/* Admin Kesehatan - Gejala */}
      <Route
        path="/admin/kesehatan/gejala"
        element={
          <ProtectedRoute>{withAdminLayout(SymptomListPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/gejala/create"
        element={
          <ProtectedRoute>{withAdminLayout(SymptomCreatePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/gejala/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(SymptomEditPage)}</ProtectedRoute>
        }
      />
      {/* Admin Kesehatan - Riwayat Penyakit */}
      <Route
        path="/admin/kesehatan/riwayat"
        element={
          <ProtectedRoute>
            {withAdminLayout(DiseaseHistoryListPage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/riwayat/create"
        element={
          <ProtectedRoute>
            {withAdminLayout(DiseaseHistoryCreatePage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/riwayat/edit/:id"
        element={
          <ProtectedRoute>
            {withAdminLayout(DiseaseHistoryEditPage)}
          </ProtectedRoute>
        }
      />
      {/* Admin Kesehatan - Reproduksi */}
      <Route
        path="/admin/kesehatan/reproduksi"
        element={
          <ProtectedRoute>
            {withAdminLayout(ReproductionListPage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/reproduksi/create"
        element={
          <ProtectedRoute>
            {withAdminLayout(ReproductionCreatePage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/reproduksi/edit/:id"
        element={
          <ProtectedRoute>
            {withAdminLayout(ReproductionEditPage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/kesehatan/dashboard"
        element={
          <ProtectedRoute>
            {withAdminLayout(DashboardKesehatanPage)}
          </ProtectedRoute>
        }
      />
      {/* Sales And Financial Routing */}
      <Route
        path="/admin/keuangan/product"
        element={
          <ProtectedRoute>{withAdminLayout(ProductListPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/history-product"
        element={
          <ProtectedRoute>{withAdminLayout(ProductHistoryPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/product/create"
        element={
          <ProtectedRoute>{withAdminLayout(ProductCreatePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/product/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(ProductEditPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/type-product"
        element={
          <ProtectedRoute>{withAdminLayout(ProductTypePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/type-product/create"
        element={
          <ProtectedRoute>
            {withAdminLayout(ProductTypeCreatePage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/type-product/edit/:id"
        element={
          <ProtectedRoute>
            {withAdminLayout(ProductTypeEditPage)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/sales"
        element={<ProtectedRoute>{withAdminLayout(Sales)}</ProtectedRoute>}
      />
      <Route
        path="/admin/keuangan/sales/create"
        element={
          <ProtectedRoute>{withAdminLayout(SalesCreatePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/sales/edit/:id"
        element={
          <ProtectedRoute>{withAdminLayout(SalesEditPage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/finance"
        element={<ProtectedRoute>{withAdminLayout(Finance)}</ProtectedRoute>}
      />
      <Route
        path="/admin/keuangan/finance/addIncome"
        element={
          <ProtectedRoute>{withAdminLayout(AddIncomePage)}</ProtectedRoute>
        }
      />
      <Route
        path="/admin/keuangan/finance/addExpense"
        element={
          <ProtectedRoute>{withAdminLayout(AddExpensePage)}</ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
