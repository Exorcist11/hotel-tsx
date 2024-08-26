import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    password: "",
    res_pass: "",
  });
  const fetchAccount = async () => [
    await axios
      .get("http://127.0.0.1:8000/api/getAccount")
      .then((response) => setAccounts(response.data))
      .catch((error) => console.error(error)),
  ];

  const handleDeleteAccount = async (id: any) => {
    await axios
      .patch(`http://127.0.0.1:8000/api/deleteAccount/${id}`)
      .then(() => {
        toast.success("Xóa tài khoản thành công!");
        fetchAccount();
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const handleUpdatePass = async () => {
    if (form?.id && form?.password === form?.res_pass) {
      await axios
        .put(`http://127.0.0.1:8000/api/updatePassword/${form.id}`, {
          password: form.password,
        })
        .then((response) => console.log(response))
        .catch((err) => console.error(err));
    } else {
      toast.error("Mật khẩu nhập lại không đúng!");
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl uppercase font-bold text-center mt-4">
        Quản lý tài khoản
      </h1>

      <label className="input input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Tìm kiếm tài khoản nhân viên"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên tài khoản</th>
              <th>Tên người dùng</th>
              <th>Quyền hạn</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts
              .filter((item) => item?.email)
              .map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.email}</td>
                  <td>{item?.fullname}</td>
                  <td>{item?.role}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleDeleteAccount(item?.id)}
                    >
                      Xoá tài khoản
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={() => {
                        setForm({
                          ...form,
                          id: item.id,
                        });
                        document.getElementById("my_modal_1").showModal();
                      }}
                    >
                      Cập nhật mật khẩu
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box flex flex-col gap-3">
          <h3 className="font-bold text-lg">Cập nhật mật khẩu</h3>
          <div className="flex flex-col gap-5">
            <input
              type="password"
              name="password"
              placeholder="Nhập mật khẩu"
              className="input input-bordered w-full max-w-lg focus:outline-none focus:ring-0"
              onChange={handleChange}
            />
            <input
              type="password"
              name="res_pass"
              placeholder="Xác nhận mật khẩu"
              className="input input-bordered w-full max-w-lg focus:outline-none focus:ring-0"
              onChange={handleChange}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <div className="flex items-end gap-2">
                <button className="btn">Cancel</button>
                <button className="btn" onClick={handleUpdatePass}>
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
