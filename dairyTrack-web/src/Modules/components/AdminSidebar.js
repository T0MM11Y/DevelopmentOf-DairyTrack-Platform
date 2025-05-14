import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ collapsed, activeMenu, onMenuToggle }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
        }
      }
    }
  }, []);

  const allMenuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "far fa-tachometer-alt",
      link: "/admin",
      showForRoles: ["admin", "supervisor", "farmer"],
    },
    {
      id: "users",
      title: "Users Management",
      icon: "far fa-users",
      submenu: [
        { id: "list-users", title: "List of Users", link: "/admin/list-users" },
        { id: "add-users", title: "Adding User", link: "/admin/add-users" },
      ],
      showForRoles: ["admin", "supervisor"],
    },
    {
      id: "cattle",
      title: "Cattle Distribution",
      icon: "far fa-link",
      link: "/admin/cattle-distribution",
      showForRoles: ["admin", "supervisor"],
    },
    {
      id: "highlights",
      title: "Highlights",
      icon: "fa-book-open",
      submenu: [
        { id: "gallery", title: "Gallery", link: "/admin/list-of-gallery" },
        { id: "blog", title: "Blog", link: "/admin/list-of-blog" },
      ],
      showForRoles: ["admin", "supervisor"],
    },
    {
      id: "cow",
      title: "Cow Management",
      icon: "far fa-paw",
      submenu: [
        { id: "list-cows", title: "All Cows", link: "/admin/list-cows" },
        { id: "add-cow", title: "Add Cow", link: "/admin/add-cow" },
      ],
      showForRoles: ["admin", "supervisor"],
    },
    {
      id: "milking",
      title: "Milking",
      icon: "far fa-mug-hot",
      link: "/admin/list-milking",
      showForRoles: ["admin", "supervisor", "farmer"],
    },
    {
      id: "feed-management",
      title: "Feed Management",
      icon: "fas fa-seedling",
      submenu: [
        { id: "feed-type", title: "Feed Type", link: "/admin/list-feedType" },
        { id: "nutrition-type", title: "Nutrition Type", link: "/admin/list-nutrition" },
        { id: "feed", title: "Feed", link: "/admin/list-feed" },
        { id: "feed-stock", title: "Feed Stock", link: "/admin/feed-stock" },
        { id: "daily-feed-schedule", title: "Daily Feed Schedule", link: "/admin/daily-feed-schedule" },
        { id: "daily-feed-item", title: "Daily Feed Item", link: "/admin/daily-feed-item" },
        { id: "daily-feed-nutrition", title: "Daily Feed Nutrition", link: "/admin/daily-feed-nutrition" },
      ],
      showForRoles: ["admin","farmer", "supervisor"],
    },
  ];

  const userRole = userData?.role?.toLowerCase() || "";
  const menuItems = allMenuItems.filter(
    (item) => item.showForRoles.includes(userRole) || userRole === "admin"
  );

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="profile">
        <div className="avatar">
          {userData?.username?.substring(0, 2).toUpperCase() || "AU"}
        </div>
        <div className="user-info">
          {userData ? (
            <>
              <div className="username">
                {userData.username || "Unknown User"}
              </div>
              <div className="email">
                {userData.email || "No Email Provided"}
              </div>
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>

      <ul className="sidebar-nav">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
          >
            {item.submenu ? (
              <>
                <div
                  className="nav-link"
                  onClick={() => onMenuToggle && onMenuToggle(item.id)}
                >
                  <span className="nav-icon">
                    <i className={`fas ${item.icon}`}></i>
                  </span>
                  <span className="nav-text">{item.title}</span>
                  <span className="nav-arrow">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </div>
                <ul className="submenu">
                  {item.submenu.map((subItem) => (
                    <li key={subItem.id}>
                      <Link to={subItem.link}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={item.link} className="nav-link">
                <span className="nav-icon">
                  <i className={`fas ${item.icon}`}></i>
                </span>
                <span className="nav-text">{item.title}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;