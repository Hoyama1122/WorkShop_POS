import { useState } from "react";
import Template from "../components/Template";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";

export default function BillPerDay() {
  const [currentYear, setcurrentYear] = useState(() => {
    let myDate = new Date();
    return myDate.getFullYear();
  });

  const [arrYear, setarrYear] = useState(() => {
    let arr = [];
    let myDate = new Date();
    let currentYear = myDate.getFullYear();
    let before = currentYear - 5;
    for (let i = before; i <= currentYear; i++) {
      arr.push(i);
    }
    return arr;
  });

  const [currentMonth, setcurrentMonth] = useState(() => {
    let myDate = new Date();
    return myDate.getMonth() + 1;
  });

  const [arrMonth, setarrMonth] = useState(() => {
    return [
      { value: 1, label: "มกราคม" },
      { value: 2, label: "กุมภาพันธ์" },
      { value: 3, label: "มีนาคม" },
      { value: 4, label: "เมษายน" },
      { value: 5, label: "พฤษภาคม" },
      { value: 6, label: "มิถุนายน" },
      { value: 7, label: "กรกฎาคม" },
      { value: 8, label: "สิงหาคม" },
      { value: 9, label: "กันยายน" },
      { value: 10, label: "ตุลาคม" },
      { value: 11, label: "พฤศจิกายน" },
      { value: 12, label: "ธันวาคม" },
    ];
  });

  const handleshowReport = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/listByYearAndMonth/${currentYear}/${currentMonth}`,
        config.headers()
      );
      console.log(res.data);
    } catch (e) {
      showErrorAlert(e.message);
    }
  };
  
  const showErrorAlert = (message) => {
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
            <div className="h4 mb-0">รายงานการขายรายวัน</div>
          </div>
          <div className="card-body">
            <div className="row ">
              <div className="col-3">
                <div className="input-group">
                  <span className="input-group-text">ปี</span>
                  <select
                    value={currentYear}
                    onChange={(e) => setcurrentYear(e.target.value)}
                    className="form-control"
                  >
                    {arrYear.map((item) => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <span className="input-group-text">เดือน</span>
                  <select
                    onChange={(e) => setcurrentMonth(e.target.value)}
                    value={currentMonth}
                    className="form-control"
                  >
                    {arrMonth.map((item) => (
                      <option value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6">
                <button
                  onClick={handleshowReport}
                  className="btn btn-primary mt-0"
                >
                  <i class="fa fa-search me-2" aria-hidden="true"></i>
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </div>
      </Template>
    </>
  );
}
