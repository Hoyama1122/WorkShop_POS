import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons"; // Note: free-solid-svg-icons instead of free-thin-svg-icons
import config from "../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";
import { useState } from "react";
function Navbar() {
  const navigate = useNavigate();
  const [memberName, setMemberName] = useState();

  const SignOut = () => {
    Swal.fire({
      title: "Sign Out",
      text: "ยืนยันการออกจากระบบ",
      icon: "warning",
      showCancelButton: true,
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem(config.token_name);
        navigate("/login");
      }
    });
  };
  const ChangeSave = async () => {
    try {
      const url = config.api_path + "/member/changeProfile";
      const payload = { memberName: memberName };
      await axios.put(url, payload, config.headers()).then((res) => {
        if (res.data.message === "success") {
          Swal.fire({
            title: "เปลี่ยนข้อมูลแล้ว",
            text: "เปลี่ยนสำเร็จ",
            icon: "success",
            timer: 1500,
          });
        }
      });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };
  const Editprofile = async () => {
    try {
      axios
        .get(config.api_path + "/member/info", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setMemberName(res.data.result.name);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button
              className="btn btn-info me-2"
              onClick={Editprofile}
              data-toggle="modal"
              data-target="#modalEditProfile"
            >
              <FontAwesomeIcon
                icon={faUserSecret}
                className="me-2 fa-xl"
                style={{ color: "black", cursor: "pointer" }}
              />
              แก้ไขข้อมูล
            </button>
            <button className="btn btn-danger" onClick={SignOut}>
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="me-2 fa-xl"
                style={{ color: "white", cursor: "pointer" }}
              />
              ออกจากระบบ
            </button>
          </li>
          <li className="nav-item"></li>
        </ul>
      </nav>
      <Modal id="modalEditProfile" title="แก้ไขข้อมูล">
        <div>
          <label>ชื่อร้าน</label>
          <input
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="mt-3">
          <button className="btn btn-primary" onClick={ChangeSave}>
            <i className="fa fa-check mr-2" />
            Save
          </button>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
