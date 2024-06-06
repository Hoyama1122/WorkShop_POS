import { useEffect, useState } from "react";
import Template from "../components/Template";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";

import "../css/sale.css"; // Make sure to import the CSS file

export default function Sale() {
  const [products, setProducts] = useState([]);
  const [billSale, setbillSale] = useState({});

  useEffect(() => {
    fetchData();
    openBill();
  }, []);

  const openBill = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/billSale/openBill",
        config.headers()
      );
      setbillSale(res.data.result);
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        config.api_path + "/product/listForSale",
        config.headers()
      );
      if (res.data.message === "success") {
        setProducts(res.data.result);
      }
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <Template>
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-success text-white">
          <div className="h5 mb-0">ขายสินค้า</div>
          <div>
            <button className="btn btn-light me-2">
              <i className="fa fa-check me-2"></i>จบการขาย
            </button>
            <button className="btn btn-info me-2">
              <i className="fa fa-file me-2"></i>จบบิลวันนี้
            </button>
            <button className="btn btn-secondary">
              <i className="fa fa-file-alt me-2"></i>จบบิลล่าสุด
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="text-end mb-4">
            <span className="bg-dark text-white h2 ps-5 pe-5 py-2 rounded">
              0.00
            </span>
          </div>
          <div className="input-group mb-4">
            <span className="input-group-text">Barcode</span>
            <input className="form-control" />
            <button className="btn btn-primary">
              <i className="fa fa-check"></i>บันทึก
            </button>
          </div>
          
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
                      src={
                        config.api_path +
                        "/uploads/" +
                        item.productImages[0].imageName
                      }
                      alt={item.name}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-primary text-center">{item.name}</h5>
                      <p className="card-text">{parseInt(item.price).toLocaleString("th-TH")}&nbsp;฿</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No products available</p>
            )}
          </div>
        </div>
      </div>
    </Template>
  );
}
