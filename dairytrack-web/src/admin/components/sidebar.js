import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "simplebar-react/dist/simplebar.min.css";

const Sidebar = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState([]);
  // Start with the sidebar collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSubmenu = (key) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const isMenuOpen = (key) => openMenus.includes(key);
  const isActive = (path) => location.pathname.startsWith(path);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Apply the styles when component mounts and when sidebar state changes
    const content = document.querySelector(".main-content");
    if (content) {
      // When collapsed, content takes up more space (remains in place but expands)
      content.style.marginLeft = isCollapsed ? "90px" : "250px";
      content.style.width = isCollapsed
        ? "calc(100% - 90px)"
        : "calc(100% - 250px)";
      content.style.transition = "all 0.3s ease-in-out";
    }

    // Apply this effect on component mount to ensure default collapsed state
  }, [isCollapsed]);

  // Run this effect only once when component mounts
  useEffect(() => {
    // Set the initial state for the sidebar and content
    const content = document.querySelector(".main-content");
    if (content) {
      content.style.marginLeft = "90px";
      content.style.width = "calc(100% - 90px)";
    }

    // Also add styles to the sidebar
    const sidebar = document.querySelector(".vertical-menu");
    if (sidebar) {
      sidebar.style.width = "90px";
    }
  }, []);

  return (
    <div
      className="vertical-menu"
      style={{
        width: isCollapsed ? "90px" : "250px",
        transition: "width 0.3s ease-in-out",
      }}
    >
      <div
        data-simplebar
        style={{
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className={isActive("/admin/dashboard") ? "mm-active" : ""}>
              <Link
                to="/admin/dashboard"
                className={`waves-effect ${isCollapsed ? "text-center" : ""}`}
              >
                <i className="ri-dashboard-line"></i>
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Peternakan  */}

            <li className={isMenuOpen("peternakan") ? "mm-active" : ""}>
              <Link
                to="#"
                className={`waves-effect ${
                  isCollapsed ? "text-center" : ""
                } d-flex justify-content-between align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu("peternakan");
                }}
                aria-expanded={isMenuOpen("peternakan")}
              >
                <div>
                  <i className="ri-bar-chart-box-line"></i>
                  {!isCollapsed && <span>Peternakan</span>}
                </div>
                {!isCollapsed && <i className="ri-arrow-down-s-line"></i>}
              </Link>
              {isMenuOpen("peternakan") && !isCollapsed && (
                <ul
                  className="sub-menu mm-show"
                  style={{ paddingLeft: "20px" }}
                >
                  {" "}
                  <li>
                    <Link
                      to="/admin/peternakan/peternak"
                      className={
                        isActive("/admin/peternakan/peternak") ? "active" : ""
                      }
                    >
                      <i className="ri-line-chart-line"></i> Data Peternak
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/peternakan/sapi"
                      className={
                        isActive("/admin/peternakan/sapi") ? "active" : ""
                      }
                    >
                      <i className="ri-file-list-3-line"></i> Data Sapi
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Pakan Sapi */}
            <li className={isMenuOpen("pakan") ? "mm-active" : ""}>
              <Link
                to="#"
                className={`waves-effect ${
                  isCollapsed ? "text-center" : ""
                } d-flex justify-content-between align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu("pakan");
                }}
                aria-expanded={isMenuOpen("pakan")}
              >
                <div>
                  <i className="ri-restaurant-line"></i>
                  {!isCollapsed && <span>Pakan Sapi</span>}
                </div>
                {!isCollapsed && <i className="ri-arrow-down-s-line"></i>}
              </Link>
              {isMenuOpen("pakan") && !isCollapsed && (
                <ul
                  className="sub-menu mm-show"
                  style={{ paddingLeft: "20px" }}
                >
                  <li>
                    <Link
                      to="/admin/pakan/harian"
                      className={
                        isActive("/admin/pakan/harian") ? "active" : ""
                      }
                    >
                      <i className="ri-calendar-line"></i> Pakan Harian
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/pakan/stok"
                      className={isActive("/admin/pakan/stok") ? "active" : ""}
                    >
                      <i className="ri-stack-line"></i> Stok Pakan
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Produktivitas Susu */}
            <li className={isMenuOpen("produktivitas") ? "mm-active" : ""}>
              <Link
                to="#"
                className={`waves-effect ${
                  isCollapsed ? "text-center" : ""
                } d-flex justify-content-between align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu("produktivitas");
                }}
                aria-expanded={isMenuOpen("produktivitas")}
              >
                <div>
                  <i className="ri-bar-chart-box-line"></i>
                  {!isCollapsed && <span>Produktivitas Susu</span>}
                </div>
                {!isCollapsed && <i className="ri-arrow-down-s-line"></i>}
              </Link>
              {isMenuOpen("produktivitas") && !isCollapsed && (
                <ul
                  className="sub-menu mm-show"
                  style={{ paddingLeft: "20px" }}
                >
                  <li>
                    <Link
                      to="/admin/susu/produksi"
                      className={
                        isActive("/admin/susu/produksi") ? "active" : ""
                      }
                    >
                      <i className="ri-database-2-line"></i> Data Produksi Susu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/susu/analisis"
                      className={
                        isActive("/admin/susu/analisis") ? "active" : ""
                      }
                    >
                      <i className="ri-line-chart-line"></i> Analisis Produksi
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Kesehatan Sapi */}
            <li className={isMenuOpen("kesehatan") ? "mm-active" : ""}>
              <Link
                to="#"
                className={`waves-effect ${
                  isCollapsed ? "text-center" : ""
                } d-flex justify-content-between align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu("kesehatan");
                }}
                aria-expanded={isMenuOpen("kesehatan")}
              >
                <div>
                  <i className="ri-hospital-line"></i>
                  {!isCollapsed && <span>Kesehatan Sapi</span>}
                </div>
                {!isCollapsed && <i className="ri-arrow-down-s-line"></i>}
              </Link>

              {isMenuOpen("kesehatan") && !isCollapsed && (
                <ul
                  className="sub-menu mm-show"
                  style={{ paddingLeft: "20px" }}
                >
                  <li>
                    <Link
                      to="/admin/kesehatan/gejala"
                      className={
                        isActive("/admin/kesehatan/gejala") ? "active" : ""
                      }
                    >
                      <i className="ri-health-book-line"></i> Gejala Penyakit
                      Sapi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/kesehatan/riwayat"
                      className={
                        isActive("/admin/kesehatan/riwayat") ? "active" : ""
                      }
                    >
                      <i className="ri-history-line"></i> Riwayat Penyakit Sapi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/kesehatan/reproduksi"
                      className={
                        isActive("/admin/kesehatan/reproduksi") ? "active" : ""
                      }
                    >
                      <i className="ri-parent-line"></i> Reproduksi Sapi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/kesehatan/pemeriksaan"
                      className={
                        isActive("/admin/kesehatan/pemeriksaan") ? "active" : ""
                      }
                    >
                      <i className="ri-stethoscope-line"></i> Pemeriksaan
                      Penyakit
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Keuangan */}
            <li className={isMenuOpen("keuangan") ? "mm-active" : ""}>
              <Link
                to="#"
                className={`waves-effect ${
                  isCollapsed ? "text-center" : ""
                } d-flex justify-content-between align-items-center`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubmenu("keuangan");
                }}
                aria-expanded={isMenuOpen("keuangan")}
              >
                <div>
                  <i className="ri-money-dollar-circle-line"></i>
                  {!isCollapsed && <span>Keuangan</span>}
                </div>
                {!isCollapsed && <i className="ri-arrow-down-s-line"></i>}
              </Link>
              {isMenuOpen("keuangan") && !isCollapsed && (
                <ul
                  className="sub-menu mm-show"
                  style={{ paddingLeft: "20px" }}
                >
                  <li>
                    <Link
                      to="/admin/keuangan/pemasukan"
                      className={
                        isActive("/admin/keuangan/pemasukan") ? "active" : ""
                      }
                    >
                      <i className="ri-arrow-up-circle-line"></i> Pemasukan
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/keuangan/pengeluaran"
                      className={
                        isActive("/admin/keuangan/pengeluaran") ? "active" : ""
                      }
                    >
                      <i className="ri-arrow-down-circle-line"></i> Pengeluaran
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/keuangan/laporan"
                      className={
                        isActive("/admin/keuangan/laporan") ? "active" : ""
                      }
                    >
                      <i className="ri-file-chart-line"></i> Laporan Keuangan
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Add toggle button to the bottom of sidebar */}
      <div
        className="text-center py-3"
        style={{
          position: "absolute",
          bottom: "0",
          width: "100%",
          borderTop: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={toggleSidebar}
          className="btn btn-sm btn-light"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i
            className={`ri-arrow-${isCollapsed ? "right" : "left"}-s-line`}
          ></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
