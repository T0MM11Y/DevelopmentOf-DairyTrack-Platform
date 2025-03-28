import React from "react";
import "../assets/client/css/bootstrap.min.css";
import "../assets/client/css/default.css";
import "../assets/client/css/style.css";

import "../assets/client/css/responsive.css";
import "../assets/client/css/fontawesome-all.min.css";
import "../assets/client/css/magnific-popup.css";
import "../assets/client/css/slick.css";
import "../assets/client/css/animate.min.css";

import Header from "./components/header";
import Content from "./components/content";
import Footer from "./components/footer";

function UserApp() {
  return (
    <div className="user-app">
      <Header />
      <div className="user-body">
        <Content />
      </div>
      <Footer />
    </div>
  );
}

export default UserApp;
