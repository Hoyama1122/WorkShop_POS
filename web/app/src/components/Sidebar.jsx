import { useState, useEffect } from "react";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import "../css/hover.css"; // Import the CSS file

export default function Sidebar() {
  const [memberName, setMemberName] = useState();
  const [packageName, setPackageName] = useState();
  const [Packages, setPackages] = useState([]);
  const [TotalBill, setTotalBill] = useState(0);
  const [BillAmount, setBillAmount] = useState(0);

  useEffect(() => {
    fetchData();
    fetchPackages();
    fetchDataTotalBill();
  }, []);

  const fetchDataTotalBill = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/package/countBill`,
        config.headers()
      );
      if (res.data.totalBill !== undefined) {
        setTotalBill(res.data.totalBill);
      }
    } catch (e) {
      ShowError(e.message);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/member/info",
        config.headers()
      );
      if (res.data.message === "success") {
        setMemberName(res.data.result.name);
        setPackageName(res.data.result.package.name);
        setBillAmount(res.data.result.package.bill_amount);
      }
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/package/list",
        config.headers()
      );

      if (res.data.results && res.data.results.length > 0) {
        setPackages(res.data.results);
      }
    } catch (e) {
      ShowError(e.message);
    }
  };

  const ShowError = (message) => {
    swal.fire({
      title: "Error",
      text: message,
      icon: "error",
    });
  };

  const renderButton = (item) => {
    if (packageName === item.name) {
      return (
        <button
          type="button"
          className="btn btn-primary disabled"
          data-bs-toggle="modal"
          data-bs-target="#modalUpgrade"
          disabled
        >
          <i className="fa fa-check me-2"></i>
          เลือก
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className="btn btn-primary btn-hover"
          data-bs-toggle="modal"
          data-bs-target="#modalUpgrade"
        >
          <i className="fa fa-check me-2"></i>
          เลือก
        </button>
      );
    }
  };

  const calculateProgressBarWidth = () => {
    if (!TotalBill || !BillAmount) return "0%";
    const percentage = (TotalBill / BillAmount) * 100;
    return `${Math.min(percentage, 100)}%`; // Ensure it doesn't exceed 100%
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
              <div>
                <a
                  onClick={fetchPackages}
                  data-bs-toggle="modal"
                  data-bs-target="#modalUpgrade"
                  className="btn btn-warning mt-2 icon-link icon-link-hover"
                  href="#"
                >
                  <i className="fa-sharp fa-solid fa-arrow-up me-2"></i>
                  Upgrade
                </a>
              </div>
            </div>
          </div>
          <span className="text-light text-center">
            {TotalBill} / {BillAmount} 
          </span>
          <span className="float-end text-light">{calculateProgressBarWidth()}</span>
          <div className="progress mt-2 mb-2 h-40">
            <div
              className="progress-bar"
              style={{ width: calculateProgressBarWidth() }}
              aria-valuenow={TotalBill}
              aria-valuemin="0"
              aria-valuemax={BillAmount}
            >
              {calculateProgressBarWidth()}
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

      <Modal
        id="modalUpgrade"
        title="เลือกแพ็คเกรดที่ต้องการ"
        modalSize="modal-lg"
      >
        <div className="row">
          {Packages.length > 0
            ? Packages.map((item) => (
                <div className="col-4" key={item.id}>
                  <div className="card">
                    <div className="card-body">
                      <div className="h4 text-center text-success">
                        {item.name}
                      </div>
                      <div className="h5 text-center text-primary">
                        {item.price}&nbsp;฿&nbsp;/&nbsp;เดือน{" "}
                      </div>
                      <div className="h5 text-center">
                        จำนวนบิล&nbsp;
                        <span className="text-danger">
                          {parseInt(item.bill_amount).toLocaleString("th-TH")}
                        </span>
                        &nbsp;ต่อเดือน
                      </div>
                      <div className="text-center">{renderButton(item)}</div>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </Modal>
    </>
  );
}
