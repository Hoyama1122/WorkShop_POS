import Template from "../components/Template";
import swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";
import "../css/sale.css";

export default function BillSale() {
  const [billSales, setbillSales] = useState([]);
  const [SelectBill, setSelectBill] = useState({});
  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = async () => {
    try {
      const res = await axios
        .get(`${config.api_path}/billSale/list`, config.headers())
        .catch((err) => {
          throw err.response.data;
        });
      if (res.data.message === "success") {
        setbillSales(res.data.result);
      }
    } catch (e) {
      showAlertError(e.message);
    }
  };

  const TotalBillList = () => {
    if (SelectBill.billsaledetails !== undefined) {
      return SelectBill.billsaledetails.reduce(
        (totalLastBill, item) => totalLastBill + item.qty * item.price,
        0
      );
    }
    return 0;
  };

  const showAlertError = (message) => {
    swal.fire({
      title: "error",
      text: message,
      icon: "error",
    });
  };

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
            <div className="h4 mb-0">รายงานบิลขาย</div>
          </div>
          <div className="card-body">
            <table className="table table-bordered table-striped table-hover">
              <thead className="text-center">
                <tr>
                  <th>เลขบิล</th>
                  <th>วันที่</th>
                  <th width="300px"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {billSales.length > 0 ? (
                  billSales.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>
                        {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td>
                        <button
                          onClick={(e) => setSelectBill(item)}
                          data-bs-toggle="modal"
                          data-bs-target="#modalDetailBill"
                          className="btn btn-primary btn-sm "
                        >
                          <i
                            className="fa fa-file-alt me-2"
                            aria-hidden="true"
                          ></i>
                          รายละเอียดบิล
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center fw-bold">
                      ไม่มีรายงานสั่งซื้อ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalDetailBill" title="รายละเอียดบิล" modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover">
          <thead className="text-center">
            <tr>
              <th>รายการ</th>
              <th>ราคา</th>
              <th>จำนวน</th>
              <th>ยอดรวม</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {SelectBill != {} && SelectBill.billsaledetails != null ? (
              SelectBill.billsaledetails.map((item, index) => (
                <tr key={index}>
                  <td>{item.product.name}</td>
                  <td>{item.product.price}</td>
                  <td>{item.qty}</td>
                  <td>{(item.qty * item.price).toLocaleString("th-TH")} ฿</td>
                </tr>
              ))
            ) : (
              <td colSpan="4" className="text-center fw-bold">
                ไม่มีรายงานสั่งซื้อ
              </td>
            )}
          </tbody>
          {SelectBill.billsaledetails && (
            <tfoot>
              <tr>
                <td colSpan="3" className="text-center fw-bold">
                  ยอดเงินทั้งหมด
                </td>
                <td className="text-center fw-bold">
                  {TotalBillList().toLocaleString("th-TH")} ฿
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </Modal>
    </>
  );
}
