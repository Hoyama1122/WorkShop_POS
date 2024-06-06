import Template from "../components/Template";
import swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../components/Modal";

export default function Product() {
  const [product, setProduct] = useState({});
  const [products, setProducts] = useState([]);
  const [productImage, setProductImage] = useState({});
  const [productImages, setProductImages] = useState([]);

  const ClearForm = () => {
    setProduct({
      name: "",
      barcode: "",
      detail: "",
      cost: "",
      price: "",
    });
  };

  const Save = async (e) => {
    e.preventDefault();
    try {
      let url = config.api_path + "/product/insert";

      if (product.id !== undefined) {
        url = config.api_path + "/product/update";
      }

      await axios.post(url, product, config.headers()).then((res) => {
        if (res.data.message === "success") {
          swal.fire({
            title: "Success",
            text: "บันทึกข้อมูลแล้ว",
            icon: "success",
            timer: 2000,
          });
          fetchData();
          Close();
        }
      });
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Close = () => {
    const btns = document.getElementsByClassName("btnClose");
    for (let i = 0; i < btns.length; i++) {
      btns[i].click();
    }
  };

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/product/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setProducts(res.data.result);
          }
        });
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const Delete = (item) => {
    swal
      .fire({
        title: "Delete",
        text: "ยืนยันการลบข้อมูล",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await axios
              .delete(
                config.api_path + "/product/delete/" + item.id,
                config.headers()
              )
              .then((res) => {
                if (res.data.message === "success") {
                  fetchData();
                  swal.fire({
                    title: "ลบข้อมูล",
                    text: "ลบข้อมูลแล้ว",
                    icon: "success",
                    timer: 2000,
                  });
                }
              });
          } catch (e) {
            swal.fire({
              title: "Error",
              text: e.message,
              icon: "error",
            });
          }
        }
      });
  };

  const ChangeFile = (files) => {
    setProductImage(files[0]);
  };

  const Upload = () => {
    if (!product.id) {
      swal.fire({
        title: "Error",
        text: "Product ID is missing",
        icon: "error",
      });
      return;
    }

    swal
      .fire({
        title: "ยืนยันการอัปโหลด",
        text: "โปรดยืนยัน",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            const _config = {
              headers: {
                Authorization:
                  "Bearer " + localStorage.getItem(config.token_name),
                "Content-Type": "multipart/form-data",
              },
            };
            const formData = new FormData();
            formData.append("productImage", productImage);
            formData.append("productImageName", productImage.name);
            formData.append("productId", product.id);

            await axios
              .post(config.api_path + "/productImage/insert", formData, _config)
              .then((res) => {
                if (res.data.message === "success") {
                  swal.fire({
                    title: "Upload",
                    text: "Upload สำเร็จ",
                    icon: "success",
                    timer: 2000,
                  });
                  fetchDataImage({ id: product.id });
                }
              });
          } catch (e) {
            swal.fire({
              title: "Error",
              text: e.message,
              icon: "error",
            });
          }
        }
      });
  };

  const ChoseProduct = (item) => {
    setProduct(item);
    fetchDataImage(item);
  };

  const fetchDataImage = async (item) => {
    try {
      await axios
        .get(
          config.api_path + "/productImage/list/" + item.id,
          config.headers()
        )
        .then((res) => {
          if (res.data.message === "success") {
            setProductImages(res.data.results);
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const ChoseMainImage = (item) => {
    swal
      .fire({
        title: "เลือกภาพหลัก",
        text: "ยืนยันเลือกภาพนี้ เป็นภาพหลักสินค้า",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
      })
      .then(async (res) => {
        try {
          const url =
            config.api_path +
            "/productImage/choseMainImage/" +
            item.id +
            "/" +
            item.productId;
          await axios
            .get(url, config.headers())
            .then((res) => {
              if (res.data.message === "success") {
                fetchDataImage({ id: item.productId });
                swal.fire({
                  title: "เลือกภาพหลัก",
                  text: "บันทึกการเลือกภาพหลักแล้ว",
                  icon: "success",
                  timer: 2000,
                });
              }
            })
            .catch((err) => {
              throw err.response ? err.response.data : err;
            });
        } catch (e) {
          swal.fire({
            title: "Error",
            text: e.message,
            icon: "error",
          });
        }
      });
  };

  const ImageDelete = (item) => {
    try {
      swal
        .fire({
          title: "ลบภาพสินค้า",
          text: "โปรดยืนยัน",
          icon: "question",
          showCancelButton: true,
          showConfirmButton: true,
        })
        .then(async (res) => {
          if (res.isConfirmed) {
            try {
              await axios
                .delete(
                  `${config.api_path}/productImage/delete/${item.id}`,
                  config.headers()
                )
                .then((res) => {
                  if (res.data.message === "success") {
                    fetchDataImage({ id: item.productId });
                    swal.fire({
                      title: "Deleted!",
                      text: "ภาพสินค้าถูกลบเรียบร้อยแล้ว",
                      icon: "success",
                      timer: 2000,
                    });
                  }
                })
                .catch((err) => {
                  throw err.response.data;
                });
            } catch (e) {
              swal.fire({
                title: "Error",
                text: e.message,
                icon: "error",
              });
            }
          }
        });
    } catch (e) {
      swal.fire({
        title: "Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  return (
    <>
      <Template>
        <div className="card my-4">
          <div className="card-header">
            <div className="card-title h5">สินค้า</div>
          </div>
          <div className="card-body">
            <button
              onClick={() => {
                ClearForm();
                document.getElementById("modalProductButton").click();
              }}
              type="button"
              className="btn btn-primary mb-3"
            >
              <i className="fa-brands fa-product-hunt me-2"></i>
              เพิ่มสินค้า
            </button>
            <table className="table table-hover table-bordered">
              <thead className="thead-light">
                <tr>
                  <th>ชื่อสินค้า</th>
                  <th>Barcode</th>
                  <th>ต้นทุน</th>
                  <th>ราคาขาย</th>
                  <th>รายละเอียด</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.barcode}</td>
                      <td> {parseInt(item.cost).toLocaleString("th-TH")}</td>
                      <td> {parseInt(item.price).toLocaleString("th-TH")}</td>
                      <td>{item.detail}</td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => {
                            ChoseProduct(item);
                            document.getElementById("btnImageProduct").click();
                          }}
                        >
                          <i className="fas fa-image"></i>
                        </button>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => {
                            setProduct(item);
                            document
                              .getElementById("modalProductButton")
                              .click();
                          }}
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => Delete(item)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <button
        id="btnImageProduct"
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalImageProduct"
        style={{ display: "none" }}
      >
        ภาพสินค้า
      </button>

      <Modal title="ภาพสินค้า" id="modalImageProduct" modalSize="modal-lg">
        <div className="row input-group">
          <div className="col-4">
            <div class="input-group mb-3">
              <span class="input-group-text">Barcode</span>
              <input value={product.barcode} class="form-control" disabled />
            </div>
          </div>
          <div className="col-8">
            <div class="input-group mb-3">
              <span class="input-group-text">ชื่อสินค้า</span>
              <input value={product.name} class="form-control" disabled />
            </div>
          </div>
          <div className="col-12">
            <div class="input-group mb-3">
              <span class="input-group-text">
                รายละเอียด
              </span>
              <input
               value={product.detail}
                class="form-control"
               disabled
              />
            </div>
            
          </div>
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="file"
            onChange={(e) => ChangeFile(e.target.files)}
          />
        </div>
        <div className="mb-3">
          {productImage.name !== undefined ? (
            <div className="mt-2 ms-1">File: {productImage.name}</div>
          ) : (
            ""
          )}
          {productImage.name !== undefined ? (
            <button onClick={Upload} className="btn btn-primary mt-2">
              <i className="fa-solid fa-photo-film me-2 "></i>Upload
            </button>
          ) : (
            ""
          )}
        </div>

        {productImages.length > 0 ? (
          <div className="mb-3">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>รูปภาพ</th>
                  <th style={{ textAlign: "center" }}>เลือกเป็นภาพหลัก</th>
                  <th style={{ textAlign: "center" }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {productImages.map((item) => (
                  <tr key={item.id}>
                    <td style={{ textAlign: "center" }}>
                      <img
                        src={config.api_path + "/uploads/" + item.imageName}
                        style={{ width: "150px", height: "100px" }}
                        alt="Product"
                      />
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      {item.isMain ? (
                        <span className="badge bg-success" style={{ display: "inline-block" }}>ภาพหลัก</span>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => ChoseMainImage(item)}
                        >
                          เลือกเป็นภาพหลัก
                        </button>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-danger"
                        onClick={() => ImageDelete(item)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mb-3" style={{ textAlign: "center" }}>
            ยังไม่มีภาพสินค้า
          </div>
        )}
      </Modal>

      <button
        id="modalProductButton"
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalProduct"
        style={{ display: "none" }}
      >
        Launch demo modal
      </button>

      <Modal title="สินค้า" id="modalProduct" modalSize="modal-lg">
        <form onSubmit={Save}>
          <div className="mb-3">
            <label className="form-label">ชื่อสินค้า</label>
            <input
              className="form-control"
              type="text"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Barcode</label>
            <input
              className="form-control"
              type="text"
              value={product.barcode}
              onChange={(e) =>
                setProduct({ ...product, barcode: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">รายละเอียด</label>
            <textarea
              className="form-control"
              value={product.detail}
              onChange={(e) =>
                setProduct({ ...product, detail: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ต้นทุน</label>
            <input
              className="form-control"
              type="number"
              value={product.cost}
              onChange={(e) => setProduct({ ...product, cost: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ราคาขาย</label>
            <input
              className="form-control"
              type="number"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />
          </div>
          <div className="mb-3" style={{ textAlign: "right" }}>
            <button className="btn btn-primary me-2" type="submit">
              บันทึก
            </button>
            <button
              className="btn btn-secondary btnClose"
              type="button"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
