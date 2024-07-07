import { useEffect, useState , useRef} from "react";
import Template from "../components/Template";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";
import "../css/sale.css";
import Modal from "../components/Modal";
import * as dayjs from "dayjs";

export default function Sale() {
  const [products, setProducts] = useState([]);
  const [billSale, setBillSale] = useState({});
  const [currentBill, setCurrentBills] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [item, setItem] = useState({ qty: 1 });
  const [inputMoney, setInputMoney] = useState(0);
  const [lastBill, setLastBill] = useState({});
  const [billToday, setBillToday] = useState([]);
  const [selectBill, setselectBill] = useState({});

  const saleRef = useRef()

  useEffect(() => {
    fetchData();
    openBill();
    fetchBillSaleDetail();
  }, []);

  const showErrorAlert = (message) => {
    swal.fire({
      title: "Error",
      text: message,
      icon: "error",
    });
  };

  const fetchBillSaleDetail = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/currentBillinfo`,
        config.headers()
      );
      if (res.data.result) {
        setCurrentBills(res.data.result);
        sumTotalPrice(res.data.result.billsaledetails);
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const deleteItem = async (item) => {
    swal
      .fire({
        title: "ยืนยันการลบ",
        text: "ต้องการลบรายงานสินค้าใช่หรือไม่",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ใช่",
        cancelButtonText: "ไม่",
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            const response = await axios.delete(
              `${config.api_path}/billSale/deleteItem/${item.id}`,
              config.headers()
            );
            if (response.data.message === "success") {
              swal.fire({
                title: "ลบรายงานสินค้า",
                text: "ลบรายงานสินค้าสำเร็จ",
                icon: "success",
                timer: 2000,
              });
              fetchBillSaleDetail();
            }
          } catch (error) {
            showErrorAlert(error.message);
          }
        }
      });
  };

  const openBill = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/openBill`,
        config.headers()
      );
      setBillSale(res.data.result);
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/product/listForSale`,
        config.headers()
      );
      if (res.data.message === "success") {
        setProducts(res.data.result);
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const sale = async (item) => {
    try {
      const res = await axios.post(
        `${config.api_path}/billSale/sale`,
        item,
        config.headers()
      );
      if (res.data.message === "success") {
        fetchBillSaleDetail();
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const sumTotalPrice = (billsaledetails) => {
    let sum = 0;
    for (let i = 0; i < billsaledetails.length; i++) {
      const item = billsaledetails[i];
      const qty = parseInt(item.qty);
      const price = parseInt(item.price);
      sum += qty * price;
    }
    setTotalPrice(sum);
  };

  const updateQty = async () => {
    try {
      const res = await axios.post(
        `${config.api_path}/billSale/updateQty`,
        item,
        config.headers()
      );
      if (res.data.message === "success") {
        swal.fire({
          title: "อัปเดต",
          text: "อัปเดตข้อมูลการสั่งซื้อสำเร็จ",
          icon: "success",
          timer: 2000,
        });
        let btns = document.getElementsByClassName("btnClose");
        for (let i = 0; i < btns.length; i++) btns[i].click();
        fetchBillSaleDetail();
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const endSale = () => {
    swal
      .fire({
        title: "จบการขาย",
        text: "ยืนยันการจบการขาย",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            const response = await axios.get(
              `${config.api_path}/billSale/EndSale`,
              config.headers()
            );
            if (response.data.message === "success") {
              swal.fire({
                title: "จบการขาย",
                text: "จบการขายสำเร็จ",
                icon: "success",
                timer: 1000,
              });
              setCurrentBills({});
              openBill();
              fetchBillSaleDetail();
              setTotalPrice(0);
              let btns = document.getElementsByClassName("btnClose");
              for (let i = 0; i < btns.length; i++) btns[i].click();

              if(saleRef.current){
                saleRef.current.refreshCountBill();
              }
            }
          } catch (e) {
            showErrorAlert(e.message);
          }
        }
      });
  };

  const fetchLastBill = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/lastBill`,
        config.headers()
      );
      if (res.data.message === "success") {
        setLastBill(res.data.result);
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const fetchBillToday = async () => {
    try {
      const res = await axios.get(
        `${config.api_path}/billSale/billToday`,
        config.headers()
      );
      if (res.data.message === "success") {
        setBillToday(res.data.result);
      }
    } catch (e) {
      showErrorAlert(e.message);
    }
  };

  const calculateLastBillTotal = () => {
    if (lastBill.billsaledetails !== undefined) {
      return lastBill.billsaledetails.reduce(
        (totalLastBill, item) => totalLastBill + item.qty * item.price,
        0
      );
    }
    return 0;
  };

  const calculateLastBillTotalSelect = () => {
    if (selectBill.billsaledetails !== undefined) {
      return selectBill.billsaledetails.reduce(
        (totalLastBill, item) => totalLastBill + item.qty * item.price,
        0
      );
    }
    return 0;
  };

  const calculateLastBillToday = () => {
    let totalAmount = 0;
    billToday.forEach((item) => {
      item.billsaledetails.forEach((detailQtyAndPrice) => {
        totalAmount += detailQtyAndPrice.qty * detailQtyAndPrice.price;
      });
    });
    return totalAmount;
  };

  return (
    <>
      <Template ref={saleRef}>
        <div className="card mt-4">
          <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
            <div className="h5 mb-0">ขายสินค้า</div>
            <div>
              <button
                data-bs-toggle="modal"
                data-bs-target="#ModalEndSale"
                className="btn btn-light me-2"
              >
                <i className="fa fa-check me-2"></i>จบการขาย
              </button>
              <button
                onClick={fetchBillToday}
                data-bs-toggle="modal"
                data-bs-target="#ModalBillToday"
                className="btn btn-info me-2"
              >
                <i className="fa fa-file me-2"></i>บิลวันนี้
              </button>
              <button
                onClick={fetchLastBill}
                data-bs-toggle="modal"
                data-bs-target="#ModalLastBill"
                className="btn btn-secondary"
              >
                <i className="fa fa-file-alt me-2"></i>จบบิลล่าสุด
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row mt-3">
              <div className="col-9">
                <div className="row">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                        key={item.id}
                      >
                        <div className="card h-100 card-hover">
                          <img
                            className="card-img-top product-img"
                            src={`${config.api_path}/uploads/${item.productImages[0].imageName}`}
                            alt={item.name}
                          />
                          <div className="card-body">
                            <h5 className="card-title text-primary text-center">
                              {item.name}
                            </h5>
                            <p className="card-text text-center">
                              {parseInt(item.price).toLocaleString("th-TH")}
                              &nbsp;฿
                            </p>
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => sale(item)}
                            >
                              <i className="fa fa-shopping-cart"></i> ซื้อ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center">No products available</p>
                  )}
                </div>
              </div>

              <div className="col-3">
                <div className="text-end mb-4">
                  <span className="bg-dark text-white h2 ps-5 pe-5 py-2 rounded">
                    ยอดเงิน&nbsp;{totalPrice.toLocaleString("th-TH")}&nbsp;฿
                  </span>
                </div>

                {currentBill.billsaledetails !== undefined ? (
                  currentBill.billsaledetails.map((item, index) => (
                    <div key={index} className="card mb-2">
                      <div className="card-body p-2 d-flex justify-content-between">
                        <div>
                          <div className="text-center h5 text-primary">
                            <span>{item.product.name}</span>
                          </div>
                          <div className="text-end">
                            <span className="text-danger h4 fw-bold mx-2">
                              {item.qty}
                            </span>
                            <span>
                              &nbsp;x{" "}
                              {parseInt(item.price).toLocaleString("th-TH")} ={" "}
                              {(item.qty * item.price).toLocaleString("th-TH")}{" "}
                              ฿
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 d-flex justify-content-center">
                          <button
                            onClick={() => setItem(item)}
                            data-bs-toggle="modal"
                            data-bs-target="#modalQty"
                            className="btn btn-primary me-2"
                          >
                            <i className="fa fa-pencil"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteItem(item)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-danger">
                    **ยังไม่มีรายการสั่งซื้อ**
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Template>

      <Modal id="modalQty" title="ปรับจำนวน" modalSize="modal-lg">
        <div>
          <label>จำนวน</label>
          <input
            value={item.qty}
            onChange={(e) => setItem({ ...item, qty: e.target.value })}
            className="form-control"
          />
          <div className="mt-3">
            <button className="btn btn-primary" onClick={updateQty}>
              <i className="fa fa-check me-2"></i> บันทึก
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="ModalEndSale" title="จบการขาย" modalSize="modal-lg">
        <div className="p-4">
          <div className="mb-3">
            <label className="form-label">ยอดเงินทั้งหมด</label>
            <input
              disabled
              value={totalPrice.toLocaleString("th-TH")}
              type="text"
              className="text-end form-control"
              placeholder="ยอดเงินทั้งหมด"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">รับเงิน</label>
            <input
              value={inputMoney}
              onChange={(e) => setInputMoney(e.target.value)}
              type="text"
              className="form-control text-end"
              placeholder="จำนวนเงินที่รับ"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">เงินทอน</label>
            <input
              value={(inputMoney - totalPrice).toLocaleString("th-TH")}
              type="text"
              className="form-control text-end"
              disabled
              placeholder="เงินทอน"
            />
          </div>
          <div className="text-center mt-4">
            <button
              onClick={(e) => setInputMoney(totalPrice)}
              className="btn btn-primary btn-lg me-2"
            >
              <i className="fa fa-check me-2"></i>จ่ายพอดี
            </button>
            <button onClick={endSale} className="btn btn-success btn-lg">
              <i className="fa fa-check me-2"></i>จบการขาย
            </button>
          </div>
        </div>
      </Modal>

      <Modal id="ModalLastBill" title="บิลล่าสุด" modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th className="text-center">Barcode</th>
              <th className="text-center">รายการ</th>
              <th className="text-center">ราคา</th>
              <th className="text-center">จำนวน</th>
              <th className="text-center">ยอดรวม</th>
            </tr>
          </thead>
          <tbody>
            {lastBill.billsaledetails !== undefined
              ? lastBill.billsaledetails.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{item.product.barcode}</td>
                    <td className="text-center">{item.product.name}</td>
                    <td className="text-center">
                      {parseInt(item.price).toLocaleString("th-TH")}
                    </td>
                    <td className="text-center">{item.qty}</td>
                    <td className="text-center">
                      {(item.qty * item.price).toLocaleString("th-TH")}
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-center fw-bold">
                ยอดเงินทั้งหมด
              </td>
              <td className="text-center fw-bold">
                {calculateLastBillTotal().toLocaleString("th-TH")} ฿
              </td>
            </tr>
          </tfoot>
        </table>
      </Modal>

      <Modal id="ModalBillToday" title="บิลวันนี้" modalSize="modal-lg">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>เลขบิล</th>
              <th>วัน เวลาที่ขาย</th>
              <th width="300px">ดูข้อมูลรายการสินค้า</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {billToday.length > 0
              ? billToday.map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">
                      {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm")}
                    </td>
                    <td className="text-center">
                      <button
                        onClick={(e) => setselectBill(item)}
                        data-bs-toggle="modal"
                        data-bs-target="#ModalBillSaleDetail"
                        className="btn btn-primary"
                      >
                        <i class="fa fa-eye" aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                ))
              : ""}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="text-center fw-bold">
                ยอดเงินทั้งหมด
              </td>
              <td className="text-center fw-bold">
                {calculateLastBillToday().toLocaleString("th-TH")} ฿
              </td>
            </tr>
          </tfoot>
        </table>
      </Modal>

      <Modal
        id="ModalBillSaleDetail"
        title="รายละเอียดบิล"
        modalSize="modal-lg"
      >
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>Barcode</th>
              <th>รายการ</th>
              <th>ราคา</th>
              <th>จำนวนชิ้น</th>
              <th>ยอดรวม</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {selectBill != {} &&
            selectBill.billsaledetails !== undefined &&
            selectBill.billsaledetails.length > 0 ? (
              selectBill.billsaledetails.map((item) => (
                <tr>
                  <td>{item.product.barcode}</td>
                  <td>{item.product.name}</td>
                  <td>{item.price}</td>
                  <td>{item.qty}</td>
                  <td>{(item.qty * item.price).toLocaleString("th-TH")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  ไม่พบข้อมูลรายการสินค้า
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {selectBill &&
              selectBill.billsaledetails &&
              selectBill.billsaledetails.length > 0 && (
                <tr>
                  <td colSpan="4" className="text-center fw-bold">
                    ยอดเงินทั้งหมด
                  </td>
                  <td className="text-center fw-bold">
                    {calculateLastBillTotalSelect().toLocaleString("th-TH")} ฿
                  </td>
                </tr>
              )}
          </tfoot>
        </table>
        <div className="text-end">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#ModalBillToday"
          >
            <i class="fa fa-arrow-circle-left me-2" aria-hidden="true"></i>
            กลับหน้าบิลวันนี้
          </button>
        </div>
      </Modal>
    </>
  );
}
