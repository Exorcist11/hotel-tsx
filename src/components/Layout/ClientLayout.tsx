import { FaInstagram, FaFacebook, FaYoutube, FaPhoneAlt } from "react-icons/fa";

import { Outlet, Link } from "react-router-dom";

export default function ClientLayout() {
  const handleScroll = () => {
    const element = document.getElementById("about_me");
    element?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center flex-row justify-between px-20  border-b mb-5 ">
        <div className="basis-5/12">
          <ul className="flex items-center font-semibold text-base list-none gap-4 cursor-pointer">
            <li className="li_content flex items-center gap-2 hover:text-[#d1a543]">
              <FaPhoneAlt size={24} /> 1900 1000
            </li>
            <li className="li_content hover:text-[#d1a543]">
              <FaInstagram size={24} />
            </li>
            <li className="li_content hover:text-[#d1a543]">
              <FaFacebook size={24} />
            </li>
            <li className="li_content hover:text-[#d1a543]">
              <FaYoutube size={24} />
            </li>
          </ul>
        </div>
        <div className="w-44 basis-1/12">
          <img
            alt="logo"
            src="/images/muong-thanh-logo.png"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="basis-5/12">
          <ul className="flex items-center font-semibold  list-none gap-4 cursor-pointer text-xs">
            <li className="li_content">
              <Link to="/">Trang chủ</Link>
            </li>
            <li className="li_content" onClick={handleScroll}>
              Về chúng tôi
            </li>
            <li className="li_content">
              <Link to="/list-room">Danh sách phòng</Link>
            </li>
            <li className="li_content">
              <Link to="/booking">Đặt phòng </Link>
            </li>
            <li className="li_content">
              <Link to="/login">Đăng nhập</Link>
            </li>
          </ul>
        </div>
      </div>

      <div style={{ flex: "1 0 auto" }}>
        <Outlet />
      </div>
      <div className="bg-[#f2a900] grid grid-cols-3 gap-5 py-11">
        <div className="col-span-1 text-center">
          <p className="uppercase">Nhận thông tin tuyển dụng</p>
          <label className="input input-bordered flex items-center gap-2 bg-[#f2a900] text-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input type="text" className="grow" placeholder="Email" />
          </label>
        </div>
        <div className="col-span-1 text-center">
          <p className="uppercase">Theo dõi</p>
          <div className="divider">Folow us</div>
          <div className="flex justify-center gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="col-span-1 text-center">
          <p className="uppercase">Giải đáp mọi vướng mắc</p>

          <button className="btn w-full bg-[#db9900] border-none text-white">
            Hỗ trợ online
          </button>
        </div>
      </div>
      <footer className="footer text-base-content p-10 bg-[#343434] flex gap-5 items-center">
        <nav className="w-1/3 text-right text-[#d3a53a] text-[16px] uppercase justify-end">
          <h6 className="footer-title ">Khách sạn Mường Thanh</h6>
          <a className="link link-hover">Về chúng tôi</a>
          <a className="link link-hover" href="/list-room">
            Danh sách phòng
          </a>
          <a className="link link-hover" href="/booking">
            Đặt phòng
          </a>
          <a className="link link-hover">Liên hệ</a>
        </nav>
        <nav className="w-[228px] h-[440px] text-center flex items-center justify-center ">
          <img
            src="/images/luxury_1696912907.png"
            alt="ui"
            className="object-cover object-center "
          />
        </nav>

        <nav className="text-[#a09f9f] flex flex-col gap-11 w-1/3 ml-24">
          <h3 className="text-[72px] ">24</h3>
          <p className="uppercase ">Khách sạn</p>
          <h3 className="text-[72px] ">18 </h3>
          <p className="uppercase ">tỉnh thành</p>
          <p>
            Mường Thanh Luxury là phân khúc khách sạn hạng sang cao cấp nhất của
            Mường Thanh, nằm ở các thành phố lớn và trung tâm du lịch nổi tiếng
            trong nước và quốc tế. Quy mô lớn và đẳng cấp khác biệt, Mường Thanh
            Luxury mang đến cho khách hàng không gian nghỉ dưỡng tuyệt vời mang
            đậm giá trị Việt đến từ dịch vụ tận tâm và văn hóa ẩm thực bản địa
            độc đáo.
          </p>
        </nav>
      </footer>
    </div>
  );
}
