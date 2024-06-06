import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";
import Modal from "../components/Modal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Package() {
  const [Package, setPackage] = useState([]);
  const [yourpackage, setYourpackage] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(config.api_path + "/package/list");
      setPackage(res.data.results);
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
    }
  };

  const chosePackage = (item) => {
    setYourpackage(item);
  };

  const Register = async (e) => {
    e.preventDefault();
    try {
      if (phone.length !== 10) {
        Swal.fire({
          title: "Error",
          text: "เบอร์โทรต้องมีความยาว 10 ตัวอักษร",
          icon: "error",
        });
        return;
      }
      if (pass.length <= 5) {
        Swal.fire({
          title: "Error",
          text: "รหัสต้องมีความยาวมากกว่า 5 ตัวอักษร",
          icon: "error",
        });
        return;
      }
      const res = await Swal.fire({
        title: "ยืนยันการสมัคร",
        text: "โปรดยืนยันการสมัคร Package ของเรา",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "green",
      });

      if (res.isConfirmed) {
        const payload = {
          packageId: yourpackage.id,
          name: name,
          phone: phone,
          pass: pass,
        };
        const response = await axios.post(
          config.api_path + "/package/memberRegister",
          payload
        );
        if (response.data.message === "success") {
          Swal.fire({
            title: "บันทึกข้อมูล",
            text: "บันทึกข้อมูลการสมัครแล้ว",
            icon: "success",
            timer: 2000,
            showCloseButton: false,
          });
          document.getElementById("btnModalClose").click();
          navigate("/login");
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "เกิดข้อผิดพลาดโปรดกรอกข้อมูลใหม่",
        icon: "error",
      });
      console.log(err.response ? err.response.data : err.message);
    }
  };

  return (
    <>
      <div className="container mt-2">
        <div className="h2 text-secondary">Whisky : Sale on Cloud</div>
        <div className="h5">Package for you</div>
        <div className="row">
          {Package.map((item) => (
            <div className="col-4" key={item.id}>
              <div className="card">
                <div className="card-body text-center">
                  <div className="h4 text-success">{item.name}</div>
                  <div className="h5">
                    {parseInt(item.bill_amount).toLocaleString("th-th")}
                    &nbsp;1&nbsp;Mouth
                  </div>
                  <div className="h5 text-secondary">
                    {parseInt(item.price).toLocaleString("th-th")}&nbsp;Bath
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => chosePackage(item)}
                      data-bs-toggle="modal"
                      data-bs-target="#modalRegister"
                      className="btn btn-primary"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal id="modalRegister" title="Register for service">
        <form onSubmit={Register}>
          <div className="alert alert-info h6">
            {yourpackage.name}&nbsp;{yourpackage.price} บาท ต่อเดือน
          </div>
          <div>
            <label className="mt-2">ชื่อร้าน</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>เบอร์โทร</label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>รหัสผ่าน</label>
            <input
              type="password"
              className="form-control"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div>
            <button className="btn btn-success mt-3" type="submit">
              Register
              <i className="fa fa-arrow-right ms-2"></i>
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default Package;
