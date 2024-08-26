import Loading1 from "@/components/Loading/Loading1";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/interface/ICategoryRoom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Booking() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
      setFilteredCategories(response.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi tải dữ liệu danh mục.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);
    if (keyword) {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading1 />
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-20">
      <div className="text-right flex justify-end mb-5">
        <label className="border p-2 rounded-lg  flex items-center gap-2 w-96">
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
          <input
            type="text"
            placeholder="Tìm kiếm loại phòng"
            onChange={handleSearchChange}
            value={searchKeyword}
            className="w-full outline-none"
          />
        </label>
      </div>

      <div className="text-center bg-[#f9f9f9] py-6">
        <h2 className="font-bold text-2xl mb-5">
          Khách sạn Mường Thanh Grand Hoàng Mai
        </h2>
        <p>5 sao | Khối Bắc Mỹ, Quỳnh Lưu, Nghệ An | 0238 3866 555</p>
      </div>

      <div className="flex flex-col gap-4 my-5">
        {filteredCategories.map((item, index) => (
          <div
            className="flex items-center p-5 gap-5 shadow-lg border"
            key={index}
          >
            <div className="w-2/5 flex justify-center h-64">
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt="img room"
                className="object-cover object-center w-full h-full"
              />
            </div>
            <div className="w-3/5 flex flex-col gap-3">
              <h4 className="font-bold uppercase text-xl">{item?.name}</h4>
              <p>
                Kích thước phòng: {item?.size}{" "}
                <span>
                  m<sup>2</sup>
                </span>
              </p>
              <p>Số người: {item?.max_occupancy} người</p>
              <p>Hướng nhìn thành phố</p>
              <div className="flex items-center justify-between">
                <p>
                  Chỉ từ{" "}
                  <span className="font-bold text-yellow-500 text-2xl">
                    {parseInt(item?.price).toLocaleString("vi-VN")} VNĐ
                  </span>{" "}
                  / đêm
                </p>

                <Button asChild className="bg-blue-500 hover:bg-blue-700">
                  <Link to={`/booking/${item.id}`}>Đặt ngay</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
