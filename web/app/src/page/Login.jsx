import { useState } from "react";
import Swal from "sweetalert2";
import config from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState();
  const [pass, setPass] = useState();
  const navigate = useNavigate();
  const Signin = async () => {
    try {
      const payload = {
        phone: phone,
        pass: pass,
      };
      await axios
        .post(config.api_path + "/member/signin", payload)
        .then((res) => {
          if (res.data.message === "success") {
            Swal.fire({
              title: "Sign In",
              text: "เข้าสู่ระบบเรียบร้อยแล้ว",
              icon: "success",
              timer: 2000,
            });
            localStorage.setItem(config.token_name, res.data.token);
            navigate("/home");
          } else {
            Swal.fire({
              title: "Sign In",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "warning",
              timer: 2000,
            });
          }
        })
        .catch((err) => {
          throw err.response.data;
        });
    } catch (e) {
      Swal.fire({
        title: "Sign In",
        text: "ไม่พบข้อมูลในระบบ",
        icon: "warning",
        timer: 2000,
      });
    }
  };
  return (
    <>
      <div className="card container mt-5">
        <div className="card-header">
          <div className="card-title">Login to POS</div>
        </div>
        <div className="card-body">
          <div className="">
            <label>เบอร์โทร</label>
            <input
              className="form-control"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mt-2">
            <label>รหัส</label>
            <input
              className="form-control"
              type="password"
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={Signin}>
              <i className="fa fa-check " style={{ marginRight: "10px" }}></i>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
