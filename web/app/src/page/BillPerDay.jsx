import { useEffect, useState } from "react";
import Template from "../components/Template";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

export default function BillPerDay() {
  const [currentYear, setCurrentYear] = useState(() => {
    let myDate = new Date();
    return myDate.getFullYear();
  });

  useEffect(() => {
    handleshowReport();
  }, []);

  const [arrYear, setArrYear] = useState(() => {
    let arr = [];
    let myDate = new Date();
    let currentYear = myDate.getFullYear();
    let beforeYear = currentYear - 5;
    for (let i = beforeYear; i <= currentYear; i++) {
      arr.push(i);
    }
    return arr;
  });

  const [currentMonth, setCurrentMonth] = useState(() => {
    let myDate = new Date();
    return myDate.getMonth() + 1;
  });

  const [arrMonth] = useState(() => {
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

  const [billSales, setBillSales] = useState([]);

  const [currentBill, setCurrentBill] = useState({});

  const handleshowReport = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/listByYearAndMonth/${currentYear}/${currentMonth}`,
        config.headers()
      );

      if (res.data && res.data.message === "success" && res.data.result) {
        setBillSales(res.data.result);
      } else {
        throw new Error("Invalid response from API");
      }
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
            <div className="row">
              <div className="col-3">
                <div className="input-group">
                  <span className="input-group-text">ปี</span>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="form-control"
                  >
                    {arrYear.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-3">
                <div className="input-group">
                  <span className="input-group-text">เดือน</span>
                  <select
                    onChange={(e) => setCurrentMonth(Number(e.target.value))}
                    value={currentMonth}
                    className="form-control"
                  >
                    {arrMonth.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-6">
                <button
                  onClick={handleshowReport}
                  className="btn btn-primary mt-0"
                >
                  <i className="fa fa-search me-2" aria-hidden="true"></i>
                  Search
                </button>
              </div>
            </div>
            <table className="table table-bordered table-striped table-hover mt-3">
              <thead className="table-white text-center">
                <tr>
                  <th>วันที่</th>
                  <th>ยอดขาย</th>
                  <th width="250px"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {billSales.length > 0 ? (
                  billSales.map((item) => (
                    <tr key={item.id}>
                      <td>{item.day}</td>
                      <td>{item.sum.toLocaleString("th-TH")}</td>
                      <td>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#modalBillSale"
                          onClick={() => {
                            setCurrentBill(item.result);
                            console.log(item.result);
                          }}
                          className="btn btn-primary"
                        >
                          <i
                            className="fa fa-search me-2"
                            aria-hidden="true"
                          ></i>
                          ค้นหา
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalBillSale" title="บิลขาย" modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead className="table-white text-center">
            <tr>
              <th>เลขบิล</th>
              <th>วันที่</th>
              <th width="250px"></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentBill && currentBill.length > 0 ? (
              currentBill.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                  <td>
                    <button className="btn btn-primary">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </>
  );
}
