import axios from "axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ILogin } from "@/interface/ILogin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LuAlertCircle } from "react-icons/lu";
import { URL } from "@/consts/url-api";

export default function LoginPage() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm<ILogin>({});

  const errorMessages = Object.values(errors)
    .map((error) => error.message)
    .filter((message) => message)
    .join(" / ");

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    try {
      const response = await axios.post(URL.LOGIN, {
        email: data.username,
        password: data.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      setError("username", {
        type: "manual",
        message: error.response.data.message,
      });
    }
  };

  return (
    <section className="px-20 w-full flex items-center justify-center bg-[#f2f2f2] main-section py-10">
      <div className="shadow-md sha rounded-xl bg-white flex items-center">
        <div>
          <img
            src="/images/brand_2_1556849374.jpg"
            alt="brand2"
            className="object-cover object-center"
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-10 flex flex-col gap-4"
        >
          <h3 className="text-3xl font-semibold">Mường Thanh Management</h3>
          <p className="text-lg">
            Chào mừng quay trở lại! Đăng nhập hệ thống quản lý khách sạn Mường
            Thanh
          </p>
          {errorMessages && (
            <Alert variant="destructive">
              <LuAlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessages}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-5">
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Vui lòng nhập tên đăng nhập",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field }) => (
                <div className="border-b px-2 py-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Tên đăng nhập"
                    className="outline-none w-full"
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Vui lòng nhập mật khẩu",
                pattern: {
                  value: /^(?=.{8,})/,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
              }}
              render={({ field }) => (
                <div className="border-b px-2 py-3 rounded-lg">
                  <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="outline-none w-full"
                    {...field}
                  />
                </div>
              )}
            />

            <button
              className="bg-black text-white py-2 rounded-lg hover:opacity-85 w-full"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
