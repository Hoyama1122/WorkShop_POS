import { useState, useEffect } from "react";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [memberName, setMemberName] = useState();
  const [packageName, setPackageName] = useState();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.api_path + "/member/info", config.headers());
      if (res.data.message === "success") {
        setMemberName(res.data.result.name);
        setPackageName(res.data.result.package.name);
      }
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/home" className="brand-link">
          <img
            src="dist/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">POS ขายเห้ไรดีหว่ะ</span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                className="img-circle elevation-2"
                alt="User Image"
              />
            </div>
            <div className="info text-light">
              <div>Name: {memberName}</div>
              <div>Package: {packageName}</div>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <i className="nav-icon fas fa-th" />
                  <p>Dashboard</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/product" className="nav-link">
                  <i className="nav-icon fas fa-box" />
                  <p>สินค้า</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/user" className="nav-link">
                  <i className="nav-icon fas fa-user" />
                  <p>ผู้ใช้งาน</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sale" className="nav-link">
                  <i className="nav-icon fas fa-dollar-sign"></i>
                  <p>ขายสินค้า</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sumSalePerday" className="nav-link">
                  <i className="nav-icon fas fa-chart-line"></i>
                  <p>สรุปรายงานยอดขาย</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/billSale" className="nav-link">
                  <i className="nav-icon fas fa-file-invoice-dollar"></i>
                  <p>รายงานบิลขาย</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stock" className="nav-link">
                  <i className="nav-icon fas fa-boxes" />
                  <p>รับสินค้าเข้า Stock</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stockReport" className="nav-link">
                  <i className="nav-icon fas fa-box" />
                  <p>รายงาน Stock</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
}
