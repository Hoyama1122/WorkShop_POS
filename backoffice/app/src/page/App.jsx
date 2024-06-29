import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import axios from "axios";
import config from "../config";

export default function App() {
  const [usr, setUsr] = useState("");
  const [psd, setPsd] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    const payload = {
        usr: usr,
        psd: psd,
    };
    try {
        const res = await axios.post(`${config.api_path}/admin/signin`, payload);
        if (res.data.message === "success") {
            localStorage.setItem(config.token_name, res.data.token); 
            navigate("/main");
        } else {
            swal.fire("Error", res.data.message, "error");
        }
    } catch (err) {
        swal.fire(
            "Error",
            err.response.data.msg || "โปรดตรวจสอบรหัสผ่าน",
            "error"
        );
    }
};

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #dfdfdf;
          }

          .login-box {
            display: flex;
            justify-content: center;
            flex-direction: column;
            width: 440px;
            height: 480px;
            padding: 30px;
          }

          .login-header {
            text-align: center;
            margin: 20px 0 40px 0;
          }

          .login-header header {
            color: #333;
            font-size: 30px;
            font-weight: 600;
          }

          .input-box .input-field {
            width: 100%;
            height: 60px;
            font-size: 17px;
            padding: 0 25px;
            margin-bottom: 15px;
            border-radius: 30px;
            border: none;
            box-shadow: 0px 5px 10px 1px rgba(0,0,0, 0.05);
            outline: none;
            transition: .3s;
          }

          ::placeholder {
            font-weight: 500;
            color: #222;
          }

          .input-field:focus {
            width: 105%;
          }

          .forgot {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
          }

          section {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #555;
          }

          #check {
            margin-right: 10px;
          }

          a {
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          section a {
            color: #555;
          }

          .input-submit {
            position: relative;
          }

          .submit-btn {
            width: 100%;
            height: 60px;
            background: #222;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            transition: .3s;
          }

          .input-submit label {
            position: absolute;
            top: 45%;
            left: 50%;
            color: #fff;
            transform: translate(-50%, -50%);
            cursor: pointer;
          }

          .submit-btn:hover {
            background: #000;
            transform: scale(1.05, 1);
          }

          .sign-up-link {
            text-align: center;
            font-size: 15px;
            margin-top: 20px;
          }

          .sign-up-link a {
            color: #000;
            font-weight: 600;
          }
        `}
      </style>
      <div className="login-box text-center">
    
        <div className="login-header">
          <header>Sign In to BackOffice</header>
        </div>
        <div className="input-box">
          <input
            onChange={(e) => setUsr(e.target.value)}
            type="text"
            className="input-field"
            placeholder="Username"
            autoComplete="off"
            required
          />
        </div>
        <div className="input-box">
          <input
            onChange={(e) => setPsd(e.target.value)}
            type="password"
            className="input-field"
            placeholder="Password"
            autoComplete="off"
            required
          />
        </div>
        <div className="input-submit">
          <button onClick={handleSignIn} className="submit-btn" id="submit">
            <label htmlFor="submit">Sign In</label>
          </button>
        </div>
      </div>
    </>
  );
}
