import Template from "../components/Template";
import { useEffect, useState } from "react";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";

export default function ReportStock() {
  const [stocks, setstocks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/stock/report",
        config.headers()
      );
      if (res.data.message === "success") {
        setstocks(res.data.result);
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
  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
            <div className="h4 mb-0">รายงาน Stock</div>
          </div>
          <div className="card-body">
            <div className="table-responsive"></div>
          </div>
        </div>
      </Template>
    </>
  );
}
