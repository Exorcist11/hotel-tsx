import { InputLabel } from "@/components/InputCustom/InputLabel";
import { Button } from "@/components/ui/button";
import { URL } from "@/consts/url-api";
import { IOrder } from "@/interface/IOrder";
import { fetcher } from "@/lib/fetcher";
import axios from "axios";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";
import useSWR from "swr";

export default function BookingDetail() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    URL.CATEGORY_DETAIL(String(id)),
    fetcher
  );

  const { handleSubmit, reset, control } = useForm<IOrder>({
    defaultValues: {
      start_date: new Date().toISOString().split("T")[0], // Đặt giá trị mặc định là ngày hiện tại
    },
  });

  const onSubmit: SubmitHandler<IOrder> = async (data) => {
    try {
      await axios.post(URL.ORDER, {
        fullname: data.fullname,
        gender: "male",
        phone: data.phone,
        citizen_number: data.citizen_number,
        email: data.email,
        category_id: id,
        number_of_rooms: data.number_of_rooms,
        start_date: data.start_date,
        end_date: data.end_date,
      });
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <form className="mx-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative text-center text-white py-5 bg-[url('https://kingdomhotel.vn/wp-content/uploads/2021/02/cua-lo-755x350.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h2 className="relative font-bold text-3xl mb-5 uppercase">
          Thông tin đặt phòng
        </h2>
        <p className="relative">
          Khách sạn Mường Thanh Grand Hoàng Mai - Khối Bắc Mỹ, Quỳnh Lưu, Nghệ
          An - 0238 3866 555
        </p>
      </div>

      <div className="flex justify-center my-5">
        <div className="w-[800px] flex flex-col gap-3 ">
          <h3 className="font-bold text-lg">Thông tin người đặt phòng</h3>
          <Controller
            name="fullname"
            control={control}
            rules={{
              required: "Vui lòng nhập họ tên",
            }}
            render={({ field, fieldState: { error } }) => (
              <InputLabel
                title="Họ và tên"
                type="text"
                placeholder="Nhập họ và tên"
                required
                error={error?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="citizen_number"
            control={control}
            rules={{
              required: "Vui lòng nhập căn cước công dân",
            }}
            render={({ field, fieldState: { error } }) => (
              <InputLabel
                title="Căn cước công dân/ Chứng minh nhân dân"
                type="text"
                placeholder="Căn cước công dân/ Chứng minh nhân dân"
                required
                error={error?.message}
                {...field}
              />
            )}
          />

          <div className="flex gap-4">
            <Controller
              name="phone"
              control={control}
              rules={{
                required: "Vui lòng nhập số điện thoại",
                minLength: {
                  value: 10,
                  message: "Số điện thoại phải có đúng 10 ký tự",
                },
                maxLength: {
                  value: 10,
                  message: "Số điện thoại phải có đúng 10 ký tự",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <InputLabel
                  title="Số điện thoại"
                  type="tel"
                  placeholder="Số điện thoại"
                  required
                  error={error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <InputLabel
                    title="Email"
                    type="email"
                    placeholder="Email"
                    error={error && error.message}
                    required
                    {...field}
                  />
                );
              }}
            />
          </div>

          <div className="flex gap-4">
            <Controller
              name="start_date"
              control={control}
              rules={{
                required: "Vui lòng chọn ngày nhận phòng",
              }}
              render={({ field, fieldState: { error } }) => (
                <InputLabel
                  title="Ngày nhận phòng"
                  type="date"
                  error={error?.message}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="end_date"
              control={control}
              rules={{
                required: "Vui lòng chọn ngày trả phòng",
              }}
              render={({ field, fieldState: { error } }) => (
                <InputLabel
                  title="Ngày trả phòng"
                  type="date"
                  error={error?.message}
                  required
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center my-5">
        <div className="w-[800px] flex flex-col gap-3 ">
          <h3 className="font-bold text-lg">Thông tin phòng đặt</h3>

          <div className="flex items-center pb-5 gap-5 ">
            <div className="w-2/5 flex justify-center h-32">
              <img
                src={`http://127.0.0.1:8000${data?.category.image}`}
                alt="img romom"
                className="object-cover object-center w-full h-full rounded-xl"
              />
            </div>
            <div className="w-2/5 flex flex-col gap-2">
              <h4 className="font-bold uppercase text-lg">
                {data?.category.name}
              </h4>
              <p className="text-[13px]">
                Kích thước phòng: {data?.category.size}{" "}
                <span>
                  m<sup>2</sup>
                </span>
              </p>
              <p className="text-[13px]">
                Số người: {data?.category.max_occupancy} người/phòng
              </p>
              <p className="text-[13px]">Hướng nhìn thành phố</p>
            </div>
            <div className="w-1/5">
              <Controller
                name="number_of_rooms"
                control={control}
                render={({ field }) => (
                  <select
                    className="select select-bordered w-full max-w-xs"
                    {...field}
                  >
                    <option disabled selected>
                      0 phòng
                    </option>
                    <option value={1}>1 phòng</option>
                    <option value={2}>2 phòng</option>
                    <option value={3}>3 phòng</option>
                    <option value={4}>4 phòng</option>
                  </select>
                )}
              />
            </div>
          </div>

          <Button type="submit">Đặt phòng</Button>
        </div>
      </div>
    </form>
  );
}
