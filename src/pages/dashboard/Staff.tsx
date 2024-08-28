import { InputLabel } from "@/components/InputCustom/InputLabel";
import Dot from "@/components/Loading/Dot";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { URL } from "@/consts/url-api";
import { IAccount, IStaff } from "@/interface/IStaff";
import { fetcher } from "@/lib/fetcher";

import axios from "axios";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { MdDelete, MdCreate, MdOutlineDrafts } from "react-icons/md";
import { toast } from "sonner";
import useSWR from "swr";

export default function Staff() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  console.log(selectedAccount);
  const { handleSubmit, reset, control } = useForm<IStaff>({});
  const {
    handleSubmit: submitAccount,
    reset: resetAccount,
    control: controlAccount,
  } = useForm<IAccount>({});

  const {
    data: staffs,
    isLoading,
    mutate: mutateStaff,
  } = useSWR(URL.STAFF, fetcher);
  const [search, setSearch] = useState<string>("");

  const onSubmit: SubmitHandler<IStaff> = async (data) => {
    try {
      const response = await axios.post(URL.STAFF, {
        fullname: data.fullname,
        phone_number: data.phone_number,
        address: data.address,
        birth: data.birth,
        gender: "male",
        role: data.role,
        salary: data.salary,
      });
      if (response.status === 201) {
        toast.success("Thêm mới nhân viên thành công!");
        mutateStaff();
        setIsDialogAddOpen(false);
      }
      reset();
    } catch (e: any) {
      toast.error(e.response);
    }
  };

  const onSubmitAccount: SubmitHandler<IAccount> = async (data) => {
    console.log(data);
    try {
      await axios.put(URL.EMAIL(selectedAccount), {
        email: data.email,
        password: data.password,
      });
      toast.success("Thêm mới thành công tài khoản nhân viên");
      resetAccount();
      mutateStaff();
    } catch (error: any) {
      toast.error(error.response);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn muốn xoá nhân viên này!");
    if (confirm) {
      await axios
        .patch(`http://127.0.0.1:8000/api/staff/${id}?_method=PATCH`)
        .then(() => {
          toast.success("Xóa nhân viên thành công!");
          mutateStaff();
        })
        .catch((e) => {
          console.error(e);
          toast.error(e);
        });
    }
  };

  //   const handleGetUser = async (id) => {
  //     document.getElementById("modal_get_user").showModal();
  //     try {
  //       const response = await axios.get(`http://127.0.0.1:8000/api/staff/${id}`);
  //       const userData = response.data.user;
  //       setForm({
  //         id: userData.id,
  //         email: userData.email,
  //         role: userData.role,
  //         fullname: userData.profiles.fullname,
  //         birth: userData.profiles.birth,
  //         gender: userData.profiles.gender,
  //         phone_number: userData.profiles.phone_number,
  //         address: userData.profiles.address,
  //       });
  //       setIsApiSuccess(true);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };

  //   const handleUpdateUser = async (id) => {
  //     if (id) {
  //       await axios
  //         .put(`http://127.0.0.1:8000/api/staff/${id}`, form)
  //         .then(() => {
  //           toast.success("Cập nhật nhân viên thành công!");
  //           document.getElementById("modal_get_user").close();
  //           fetchRooms();
  //         })
  //         .catch((e) => console.log(e));
  //     }
  //   };

  //   const handleAddMail = async () => {
  //     if (!form.id || !form.password) {
  //       toast.error("Vui lòng nhập đủ thông tin!");
  //     }
  //     if (form.id) {
  //       await axios
  //         .put(`http://127.0.0.1:8000/api/staff-email/${form.id}`, {
  //           email: form.email,
  //           password: form.password,
  //         })
  //         .then(() => {
  //           toast.success("Thêm mới email thành công");
  //           fetchRooms();
  //         })
  //         .catch((error) => {
  //           console.error(error);
  //         });
  //     }
  //   };

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Dot />
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="uppercase text-2xl text-center font-bold">
        Quản lý nhân viên
      </h2>
      <div className="flex justify-between items-center">
        <Dialog open={isDialogAddOpen} onOpenChange={setIsDialogAddOpen}>
          <DialogTrigger>
            <Button className="max-w-xs mb-5">Thêm mới nhân viên</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[600px] scrollbar">
            <form
              className="flex flex-col gap-3 max-w-5xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="font-bold text-lg text-center">
                Thêm thể phòng mới!
              </h3>
              <div className="flex flex-col gap-4">
                <Controller
                  name="fullname"
                  control={control}
                  rules={{
                    required: "Tên nhân viên không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Họ tên nhân viên"
                      required
                      placeholder="Họ tên nhân viên"
                      type="text"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="phone_number"
                  control={control}
                  rules={{
                    required: "Số điện thoại không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Số điện thoại"
                      required
                      placeholder="Số điện thoại"
                      type="number"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: "Địa chỉ không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Địa chỉ"
                      required
                      placeholder="Địa chỉ"
                      type="number"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="salary"
                  control={control}
                  rules={{
                    required: "Lương không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Lương"
                      required
                      placeholder="Lương"
                      type="number"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="birth"
                  control={control}
                  rules={{
                    required: "Ngày sinh không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Ngày sinh"
                      type="date"
                      error={error?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <div className="flex gap-5 items-start">
                  <Controller
                    name="role"
                    control={control}
                    rules={{
                      required: "Chức vụ không được để trống",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="w-full">
                        <Label>Chức vụ</Label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chức vụ"></SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                            <SelectItem value="Quản lý">Quản trị</SelectItem>
                          </SelectContent>
                        </Select>
                        {error && (
                          <Label className="text-red-500">
                            {error.message}
                          </Label>
                        )}
                      </div>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex items-end gap-2">
                  <DialogClose asChild>
                    <Button
                      variant={"outline"}
                      type="reset"
                      onClick={() => {
                        reset();
                      }}
                    >
                      Huỷ
                    </Button>
                  </DialogClose>

                  <Button type="submit">Thêm mới</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* <Button className="btn btn-outline">Thêm nhân viên</Button> */}
        <label className="border rounded-lg flex items-center gap-2 h-12 px-2">
          <input
            type="text"
            className="w-[250px] outline-none"
            placeholder="Tìm kiếm thể loại phòng"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={14} />
        </label>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">STT</TableHead>
            <TableHead>Tên nhân viên</TableHead>
            <TableHead>Quê quán</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Lương</TableHead>
            <TableHead>Chức vụ</TableHead>
            <TableHead className="text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffs?.users
            ?.filter((s: any) =>
              s.profiles.fullname
                .toLowerCase()
                .includes(search?.toLocaleLowerCase())
            )
            ?.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="">{item?.profiles?.fullname}</TableCell>
                <TableCell className="">{item?.profiles?.address}</TableCell>
                <TableCell className="">
                  {item?.profiles?.phone_number}
                </TableCell>
                <TableCell className="">
                  {parseInt(item?.profiles?.salary).toLocaleString("vn-VI")} VND
                </TableCell>
                <TableCell>{item?.role}</TableCell>
                <TableCell className=" flex justify-end">
                  <div className="flex items-center justify-center gap-2">
                    {!item?.email && (
                      <Dialog>
                        <DialogTrigger>
                          <div
                            onClick={() => setSelectedAccount(item.id)}
                            className="bg-blue-700 flex p-2 rounded-xl gap-1 text-white cursor-pointer hover:opacity-90"
                          >
                            <MdOutlineDrafts size={20} />
                            <p>Thêm email</p>
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <form
                            className="flex flex-col gap-3"
                            onSubmit={submitAccount(onSubmitAccount)}
                          >
                            <Controller
                              name="email"
                              control={controlAccount}
                              rules={{
                                required: "Vui lòng nhập email",
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <InputLabel
                                  title="Email"
                                  required
                                  placeholder="Email"
                                  type="text"
                                  error={error?.message}
                                  {...field}
                                />
                              )}
                            />

                            <Controller
                              name="password"
                              control={controlAccount}
                              rules={{
                                required: "Vui lòng nhập mật khẩu tài khoản",
                              }}
                              render={({ field, fieldState: { error } }) => (
                                <InputLabel
                                  title="Mật khẩu"
                                  required
                                  placeholder="Mật khẩu"
                                  type="text"
                                  error={error?.message}
                                  {...field}
                                />
                              )}
                            />

                            <div className="flex justify-end">
                              <div className="flex items-end gap-2">
                                <DialogClose asChild>
                                  <Button
                                    variant={"outline"}
                                    type="reset"
                                    onClick={() => {
                                      reset();
                                    }}
                                  >
                                    Huỷ
                                  </Button>
                                </DialogClose>

                                <Button type="submit">Thêm mới</Button>
                              </div>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger>
                        <div
                          //   onClick={() => handleView(item.id)}
                          className="bg-green-700 flex p-2 rounded-xl gap-1 text-white cursor-pointer hover:opacity-90"
                        >
                          <MdCreate size={20} />
                          <p>Sửa</p>
                        </div>
                      </DialogTrigger>

                      {/* <DialogContent className="max-w-5xl scrollbar max-h-[650px] overflow-y-auto">
                        {loading_detail ? (
                          <Dot />
                        ) : (
                          <form
                            className="flex flex-col gap-3 max-w-5xl"
                            onSubmit={handleSubmit(onUpdate)}
                          >
                            <h3 className="font-bold text-lg text-center">
                              Thông tin phòng {detail_room?.room_no}
                            </h3>
                            <div className="flex flex-col gap-4">
                              <Controller
                                name="room_no"
                                control={control}
                                rules={{
                                  required: "Số phòng không được để trống",
                                }}
                                render={({ field, fieldState: { error } }) => (
                                  <InputLabel
                                    title="Số phòng"
                                    required
                                    placeholder="Số phòng"
                                    type="text"
                                    error={error?.message}
                                    {...field}
                                  />
                                )}
                              />

                              <Controller
                                name="floor"
                                control={control}
                                rules={{
                                  required: "Tầng không được để trống",
                                }}
                                render={({ field, fieldState: { error } }) => (
                                  <div className="w-full">
                                    <Label className="label-text">Mô tả</Label>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value?.toString()}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Chọn tầng">
                                          {field.value &&
                                            floors.find(
                                              (item) =>
                                                item.flor === field.value
                                            )?.name}
                                        </SelectValue>
                                      </SelectTrigger>
                                      <SelectContent>
                                        {floors?.map((item, index) => (
                                          <SelectItem
                                            value={item.flor.toString()}
                                            key={index}
                                          >
                                            {item.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    {error && (
                                      <Label className="text-red-500">
                                        {error.message}
                                      </Label>
                                    )}
                                  </div>
                                )}
                              />

                              <div className="flex gap-5 items-start">
                                <Controller
                                  name="category_id"
                                  control={control}
                                  rules={{
                                    required:
                                      "Thể loại phòng không được để trống",
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <div className="w-full">
                                      <Label className="label-text">
                                        Thể loại phòng
                                      </Label>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Chọn thể loại phòng">
                                            {field.value &&
                                              categories.find(
                                                (item: any) =>
                                                  item.id === field.value
                                              )?.name}
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories?.map(
                                            (item: any, index: number) => (
                                              <SelectItem
                                                value={item.id.toString()}
                                                key={index}
                                              >
                                                {item.name}
                                              </SelectItem>
                                            )
                                          )}
                                        </SelectContent>
                                      </Select>
                                      {error && (
                                        <Label className="text-red-500">
                                          {error.message}
                                        </Label>
                                      )}
                                    </div>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <div className="flex items-end gap-2">
                                <DialogClose asChild>
                                  <Button variant={"outline"} type="reset">
                                    Hủy bỏ
                                  </Button>
                                </DialogClose>

                                <Button type="submit">Cập nhật</Button>
                              </div>
                            </div>
                          </form>
                        )}
                      </DialogContent> */}
                    </Dialog>

                    <div
                      onClick={() => handleDelete(item?.id)}
                      className="bg-red-700 flex p-2 rounded-xl gap-1 text-white cursor-pointer hover:opacity-90"
                    >
                      <MdDelete size={20} />
                      <p>Xóa</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* <dialog id="modal_add_mail" className="modal">
        <div className="modal-box flex flex-col gap-3">
          <h3 className="font-bold text-lg">Thêm mới mail</h3>
          <div className="flex flex-col gap-5">
            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">
                  Email nhân viên <span className="text-red-500">*</span>
                </span>
              </div>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full  focus:outline-none focus:ring-0"
                onChange={handleChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">
                  Mật khẩu cung cấp <span className="text-red-500">*</span>
                </span>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                className="input input-bordered w-full  focus:outline-none focus:ring-0"
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <div className="flex items-end gap-2">
                <button className="btn">Cancel</button>
                <button className="btn" onClick={handleAddMail}>
                  Thêm mới
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog> */}

      {/* <dialog id="modal_get_user" className="modal">
        <div className="modal-box flex flex-col gap-3 max-w-xl">
          <h3 className="font-bold text-lg">Thông tin nhân viên {form.id}</h3>
          {isApiSuccess ? (
            <div className="flex flex-col gap-3">
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    Họ tên nhân viên <span className="text-red-500">*</span>
                  </span>
                </div>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Họ tên nhân viên"
                  value={form.fullname}
                  className="input input-bordered w-full  focus:outline-none focus:ring-0"
                  onChange={handleChange}
                />
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    Số điện thoại <span className="text-red-500">*</span>
                  </span>
                </div>
                <input
                  type="number"
                  name="phone_number"
                  placeholder="Số điện thoại"
                  value={form.phone_number}
                  className="input input-bordered w-full  focus:outline-none focus:ring-0"
                  onChange={handleChange}
                />
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    Địa chỉ <span className="text-red-500">*</span>
                  </span>
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Địa chỉ"
                  value={form.address}
                  className="input input-bordered w-full  focus:outline-none focus:ring-0"
                  onChange={handleChange}
                />
              </label>

              {form.email && (
                <label className="form-control w-full ">
                  <div className="label">
                    <span className="label-text">Tài khản nhân viên </span>
                  </div>
                  <input
                    disabled
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    className="input input-bordered w-full  focus:outline-none focus:ring-0"
                    onChange={handleChange}
                  />
                </label>
              )}

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    Sinh nhật <span className="text-red-500">*</span>
                  </span>
                </div>
                <input
                  type="date"
                  id="birthday"
                  name="birth"
                  className="input-bordered input cursor-pointer"
                  placeholder="Ngày sinh"
                  value={form.birth ? formatDate(form.birth) : ""}
                  onChange={handleChange}
                />
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text">
                    Chức vụ <span className="text-red-500">*</span>
                  </span>
                </div>
                <select
                  className="select select-bordered w-full"
                  onChange={handleChange}
                  name="role"
                  value={form.role}
                >
                  <option disabled>Chức vụ</option>
                  <option value="Nhân viên">Nhân viên</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
              </label>

              <div className="flex gap-5  rounded-xl">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      className="radio checked:bg-red-500"
                      value="male"
                      checked={form.gender === "male"}
                      onChange={handleChange}
                    />
                    <span className="label-text ml-2">Nam</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={form.gender === "female"}
                      className="radio checked:bg-blue-500"
                      onChange={handleChange}
                    />
                    <span className="label-text ml-2">Nữ</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <div className="flex items-end gap-2">
                <button className="btn">Cancel</button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => handleUpdateUser(form.id)}
                >
                  Chỉnh sửa
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog> */}
    </div>
  );
}
