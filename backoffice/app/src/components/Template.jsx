import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import "../css/Template.css";

export default function Template(props) {
  const [admin, setAdmin] = useState({});
  const [isNavOpen, setIsNavOpen] = useState(true); // Start with sidebar open
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/admin/info`,
        config.headers()
      );
      if (res.data.message === "success") {
        setAdmin(res.data.admin);
      }
    } catch (error) {
      showError(error);
    }
  };

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, sign out!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate("/");
      }
    });
  };

  const showError = (error) => {
    Swal.fire({
      title: "Error",
      text: error.message || "An error occurred",
      icon: "error",
    });
  };


  return (
    <div>
      <div
        className={`l-navbar ${isNavOpen ? "show" : ""}`}
        id="nav-bar"
        style={{ width: "270px" }}
      >
        <nav className="nav">
          <div>
            <NavLink to="/main" className="nav_logo">
              <i
                className="fas fa-user-shield"
                style={{
                  color: "white",
                  marginBottom: "10px",
                  fontSize: "24px",
                }}
              />
              <span className="nav_logo-name h5">{admin.name} : Admin</span>
            </NavLink>
            <div className="nav_list">
              <NavLink
                exact
                to="/main"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-home-alt " />
                <span className="nav_name ">หน้าหลัก</span>
              </NavLink>
              <NavLink
                to="/report-member"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-file-alt" />
                <span className="nav_name">รายงานที่สมัครใช้บริการ</span>
              </NavLink>
              <NavLink
                to="/messages"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-exchange-alt" />
                <span className="nav_name">รายงานคนที่ขอเปลี่ยนแพคเกจ</span>
              </NavLink>
              <NavLink
                to="/bookmark"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-chart-line" />
                <span className="nav_name">รายงานรายได้รายวัน</span>
              </NavLink>
              <NavLink
                to="/files"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-calendar-day" />
                <span className="nav_name">รายงานรายได้รายเดือน</span>
              </NavLink>
              <NavLink
                to="/stats"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-chart-line" />
                <span className="nav_name">รายงานรายได้รายปี</span>
              </NavLink>
              <NavLink
                to="/stats"
                className="nav_link my-menu"
                activeClassName="active"
              >
                <i className="fas fa-users" />
                <span className="nav_name">ผู้ใช้งานระบบ</span>
              </NavLink>
            </div>
          </div>
          <NavLink to="#" className="nav_link" onClick={handleSignOut}>
            <i className="bx bx-log-out nav_icon" />
            <span className="nav_name">Sign Out</span>
          </NavLink>
        </nav>
      </div>
      <div className="height-100 bg-light">{props.children}</div>
    </div>
  );
}