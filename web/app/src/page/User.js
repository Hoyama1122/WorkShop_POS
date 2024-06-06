import Modal from "../components/Modal";
import Template from "../components/Template";
import { useEffect, useState } from "react";
import swal from "sweetalert2";
import config from "../config";
import axios from "axios";

export default function User() {
  const [User, setUser] = useState({});
  const [Users, setUsers] = useState([]);
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await axios
        .get(config.api_path + "/user/list", config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            setUsers(res.data.result); // Assuming `results` is changed to `result`
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

  const Save = async (e) => {
    e.preventDefault();
    try {
      if (!Password || !ConfirmPassword) {
        swal.fire({
          title: "ตรวจสอบรหัสผ่าน",
          text: "โปรดกรอกรหัสผ่านทั้งสองช่อง",
          icon: "warning",
        });
        return;
      }
      if (Password !== ConfirmPassword) {
        swal.fire({
          title: "ตรวจสอบรหัสผ่าน",
          text: "โปรดกรอกรหัสผ่าน ให้ตรงกัน",
          icon: "warning",
        });
        return;
      }
      const insertUsers = {
        ...User,
        pwd: Password,
      };
      let url = "/user/insert";
      if (User.id !== undefined) {
        url = "/user/edit";
      }
      await axios
        .post(config.api_path + url, insertUsers, config.headers())
        .then((res) => {
          if (res.data.message === "success") {
            swal.fire({
              title: "บันทึกข้อมูล",
              text: "บันทึกข้อมูลเรียบร้อย",
              icon: "success",
              timer: 2000,
            });
            clearForm();
            document.getElementById("closeModalButton").click();
            fetchData();
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

  const clearForm = () => {
    setUser({
      id: undefined,
      name: "",
      usr: "",
      level: "user",
    });
    setPassword("");
    setConfirmPassword("");
  };

  const ChangePassword = (item) => {
    setPassword(item);
  };

  const ChangeConfirmPassword = (item) => {
    setConfirmPassword(item);
  };

  const DeleteUser = (item) => {
    swal
      .fire({
        title: "ยืนยันการลบข้อมูล",
        text: "ต้องการลบข้อมูลผู้ใช้งาน ใช้หรือไม่",
        icon: "question",
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
      })
      .then(async (res) => {
        if (res.isConfirmed) {
          try {
            await axios
              .delete(
                config.api_path + "/user/delete/" + item.id,
                config.headers()
              )
              .then((res) => {
                if (res.data.message === "success") {
                  swal.fire({
                    title: "ลบข้อมูลสำเร็จ",
                    text: "ระบบได้ทำการลบข้อมูลแล้ว",
                    icon: "success",
                    timer: 2000,
                  });
                  fetchData();
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
  };

  return (
    <>
      <Template>
        <div className="card">
          <div className="card-header">
            <div className="card-title mt-2">ผู้ใช้งานระบบ</div>
          </div>
          <div className="card-body">
            <button
              onClick={(e) => {
                clearForm();
                document.getElementById("btnuser").click();
              }}
              data-bs-toggle="modal"
              data-bs-target="#modalUser"
              className="btn btn-primary"
            >
              <i className="fa-solid fa-user-plus me-2"></i>เพิ่มผู้ใช้งานระบบ
            </button>

            <table className="mt-3 table table-bordered table-striped">
              <thead className="thead-light">
                <tr>
                  <th>ชื่อ</th>
                  <th>user</th>
                  <th>ระดับ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {Users.length > 0 ? (
                  Users.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.usr}</td>
                      <td>{item.level}</td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => {
                            setUser(item);
                            document.getElementById("btnuser").click();
                          }}
                          data-bs-toggle="modal" // Corrected attribute
                          data-bs-target="#modalUser" // Corrected attribute
                          className="btn btn-info me-2"
                        >
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button
                          onClick={() => DeleteUser(item)}
                          className="btn btn-danger me-2"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Template>

      <button
        id="btnuser"
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#modalUser"
        style={{ display: "none" }}
      ></button>

      <Modal id="modalUser" title="ผู้ใช้งานระบบ" modaSize="modal-lg">
        <form onSubmit={Save}>
          <div className="mb-3">
            <label className="form-label">ชื่อ</label>
            <input
              value={User.name}
              className="form-control"
              type="text"
              onChange={(e) => setUser({ ...User, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              value={User.usr}
              className="form-control"
              type="text"
              onChange={(e) => setUser({ ...User, usr: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              type="password"
              onBlur={(e) => ChangePassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              type="password"
              onBlur={(e) => ChangeConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ระดับ</label>
            <select
              value={User.level}
              onChange={(e) => setUser({ ...User, level: e.target.value })}
              className="form-select"
              aria-label="Default select example"
            >
              <option value="">โปรดเลือกระดับผู้ใช้งาน</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-3" style={{ textAlign: "right" }}>
            <button className="btn btn-primary me-2" type="submit">
              บันทึก
            </button>
            <button
              id="closeModalButton"
              className="btn btn-secondary hidden"
              type="button"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
          </div>
        </form>
      </Modal>
      <style jsx>{`
        .hidden {
          display: none;
        }
      `}</style>
    </>
  );
}
