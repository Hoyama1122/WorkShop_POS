import { useEffect, useState } from "react";
import Template from "../components/Template";
import '../css/ReportMember.css';
import Swal from "sweetalert2";
import axios from "axios";
import config from '../config';
import * as dayjs from "dayjs";

export default function ReportMember() {
  const [members, setMembers] = useState([]);
  const [TotalBill, setTotalBill] = useState(0)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${config.api_path}/member/list`, config.headers());
      if (res.data.message === "success") {
        setMembers(res.data.result);
      }
    } catch (e) {
      showError(e);
    }
  };

  const showError = (e) => {
    Swal.fire({
      title: "Error",
      text: e.message,
      icon: "error",
    });
  };

  return (
    <Template>
      <div className="container mt-4">
        <div className="card shadow-lg" style={{ maxWidth: "90%", margin: "0 auto" }}>
          <div className="card-header h5 bg-primary text-white">รายงานที่สมัครใช้บริการ</div>
          <div className="card-body">
            <table className="table table-striped w-100">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>Packages</th>
                  <th>วันที่สมัคร</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ?
                  members.map((member, index) => (
                    <tr key={index}>
                      <td>{member.name}</td>
                      <td>{member.phone}</td>
                      <td>{member.package.name}</td>
                      <td>{dayjs(member.createdAt).format("DD/MM/YYYY HH:MM")}</td>
                    </tr>
                  )) : (
                    <div className="text-center" calSpan="4">ไม่พบข้อมูล</div>
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Template>
  );
}
