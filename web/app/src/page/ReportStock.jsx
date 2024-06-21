import Template from "../components/Template";
import { useEffect, useState } from "react";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

export default function ReportStock() {
  const [stocks, setStocks] = useState([]);
  const [currentStock, setCurrentStock] = useState({});
  const [modalType, setModalType] = useState(""); // to track which modal to show

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
        setStocks(res.data.result || []);
      } else {
        ShowError("Failed to fetch stock data");
      }
    } catch (e) {
      ShowError(e.message);
    }
  };

  const selectStock = (item, type) => {
    setCurrentStock(item);
    setModalType(type);
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
            <table className="table table-bordered table-striped table-hover mt-3">
              <thead className="table-white text-center">
                <tr>
                  <td>Barcode</td>
                  <td>รายการ</td>
                  <td>รับเข้า</td>
                  <td>ขายออก</td>
                  <td>คงเหลือ</td>
                </tr>
              </thead>
              <tbody className="text-center">
                {stocks.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product.barcode}</td>
                    <td>{item.product.name}</td>
                    <td>
                      <a
                        onClick={() => selectStock(item, "stockIn")}
                        className="text-success"
                        data-bs-toggle="modal"
                        data-bs-target="#modalReport"
                      >
                        {item.stockIn}
                      </a>
                    </td>
                    <td className="text-danger">
                      <a
                        onClick={() => selectStock(item, "stockOut")}
                        className="text-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#modalReport"
                      >
                        {item.stockOut}
                      </a>
                    </td>
                    <td className="text-primary fw-bold h5">
                      {item.stockIn - item.stockOut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalReport" title={`รายงาน ${modalType === 'stockIn' ? 'StockIn' : 'StockOut'}`} modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead className="table-white text-center">
            <tr>
              <th>Barcode</th>
              <th>รายการ</th>
              <th>วันที่</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {currentStock && currentStock[`${modalType}Details`] && currentStock[`${modalType}Details`].length > 0 ? (
              currentStock[`${modalType}Details`].map((item, index) => (
                <tr key={index}>
                  <td>{item.product.barcode}</td>
                  <td>{item.product.name}</td>
                  <td>{dayjs(item.createdAt).format("DD/MM/YYYY HH:MM" )}</td>
                  <td>{item.qty}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="text-center">
            <tr>
              <td colSpan="3" className="fw-bold">
                ทั้งหมด
              </td>
              <td>
                {currentStock && currentStock[`${modalType}Details`] && currentStock[`${modalType}Details`].length > 0
                  ? currentStock[`${modalType}Details`]
                      .reduce((acc, item) => acc + Number(item.qty), 0)
                      .toLocaleString("th-TH")
                  : 0}
              </td>
            </tr>
          </tfoot>
        </table>
      </Modal>
    </>
  );
}
