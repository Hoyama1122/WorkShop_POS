import { useEffect, useState } from "react";
import Template from "../components/Template";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

export default function Stock() {
  const [products, setproducts] = useState([]);
  const [productName, setproductName] = useState("");
  const [productId, setproductId] = useState(0);
  const [qty, setqty] = useState(0);
  const [stocks, setstocks] = useState([]);

  const fetchData = () => {
    try {
      axios
        .get(config.api_path + "/product/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setproducts(res.data.result);
          }
        });
    } catch (e) {
      ShowError(e.message);
    }
  };

  useEffect(() => {
    fetchDataStock();
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      if (productName === "") {
        ShowError("โปรดเลือกสินค้า");
        return;
      }
      if (qty <= 0) {
        ShowError("กรอกจํานวน");
        return;
      }
      const payload = {
        qty: qty,
        productId: productId,
      };
      const res = await axios.post(
        `${config.api_path}/stock/save`,
        payload,
        config.headers()
      );
      if (res.data.message === "success") {
        swal.fire({
          title: "บันทึก",
          text: "บันทึกข้อมูลแล้ว",
          icon: "success",
          timer: 2000,
        });
        fetchData();
        fetchDataStock();
        setqty(1);
      }
    } catch (e) {
      ShowError(e.message);
    }
  };

  const handleChoseProduct = (item) => {
    setproductName(item.name);
    setproductId(item.id);

    const btns = document.getElementsByClassName("btnClose");
    for (let i = 0; i < btns.length; i++) btns[i].click();
  };

  const ShowError = (message) => {
    swal.fire({
      title: "Error",
      text: message,
      icon: "error",
    });
  };

  const fetchDataStock = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/stock/list",
        config.headers()
      );
      setstocks(res.data.result);
    } catch (e) {
      ShowError(e.message);
    }
  };

  const handleDeleteStock = async (item) => {
    try {
      swal
        .fire({
          title: "Are you sure?",
          text: "คุณต้องการลบข้อมูลนี้หรือไม่",
          icon: "warning",
          showCancelButton: true,
          showConfirmButton: true,
        })
        .then(async (res) => {
          if (res.isConfirmed) {
            const res = await axios.delete(
              `${config.api_path}/stock/delete/${item.id}`,
              config.headers()
            );
            if (res.data.message === "success") {
              swal.fire({
                title: "Success",
                text: "ลบข้อมูลแล้ว",
                icon: "success",
                timer: 2000,
              });
              fetchDataStock();
            }
          }
        });
    } catch (e) {
      ShowError(e.message);
    }
  };
  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
            <div className="h4 mb-0">รับสินค้าเข้า Stock</div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <div className="input-group">
                  <span className="input-group-text mb-2">ชื่อสินค้า</span>
                  <input
                    value={productName}
                    type="text"
                    className="form-control"
                    disabled
                  />
                  <button
                    onClick={fetchData}
                    data-bs-toggle="modal"
                    data-bs-target="#modalproductlist"
                    className="btn btn-primary mt-0"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="col-2">
                <div className="input-group">
                  <span className="input-group-text mb-2">จำนวน</span>
                  <input
                    value={qty}
                    onChange={(e) => setqty(e.target.value)}
                    type="number"
                    disabled={!productName}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-6 text-end">
                <button
                  onClick={() => handleSave()}
                  className="btn btn-primary mt-0"
                >
                  <i className="fa fa-plus me-2"></i>เพิ่มสินค้า
                </button>
              </div>
            </div>
            <table className="table table-bordered table-striped table-hover mt-3">
              <thead className="table-white text-center">
                <tr>
                  <th>Barcode</th>
                  <th>รายการ</th>
                  <th>จำนวน</th>
                  <th>วันที่</th>
                  <th width="150px"></th>
                </tr>
              </thead>
              <tbody className="text-center">
                {stocks.length > 0 ? (
                  stocks.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product.barcode}</td>
                      <td>{item.product.name}</td>
                      <td>{item.qty}</td>
                      <td>
                        {dayjs(item.product.createdAt).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteStock(item)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="fa fa-trash me-2"></i>ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">ไม่พบข้อมูล</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <Modal id="modalproductlist" title="สินค้า" modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead className="table-white text-center">
            <tr>
              <th>Barcode</th>
              <th>รายการ</th>
              <th width="150px"></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id}>
                  <td>{item.barcode}</td>
                  <td>{item.name}</td>
                  <td>
                    <button
                      onClick={() => handleChoseProduct(item)}
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fa fa-plus me-2"></i>เลือกรายการ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </Modal>
    </>
  );
}
