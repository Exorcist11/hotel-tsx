import Dot from "@/components/Loading/Dot";
import { Button } from "@/components/ui/button";
import { URL } from "@/consts/url-api";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { fetcher } from "@/lib/fetcher";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDelete, MdCreate } from "react-icons/md";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { InputLabel } from "@/components/InputCustom/InputLabel";
import { ICategory } from "@/interface/ICategoryRoom";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export default function CategoryRoom() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false);
  const { data, error, isLoading } = useSWR(URL.CATEGORY, fetcher);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const { data: detail_category, isLoading: loading_detail } = useSWR(
    selectedCategoryId ? URL.CATEGORY_DETAIL(selectedCategoryId) : null,
    fetcher
  );
  const [checkedItem, setCheckedItem] = useState<string[]>([]);

  const handleView = async (id: string) => {
    setSelectedCategoryId(id);

    await mutate(URL.CATEGORY_DETAIL(id), async () => {
      const response = await fetcher(URL.CATEGORY_DETAIL(id));
      return response;
    });
  };

  const { handleSubmit, reset, control } = useForm<ICategory>({});

  const services = [
    "Tủ quần áo",
    "Ga trải giường, gối",
    "Phòng tắm - Vòi sen",
    "Quầy bar mini",
    "Điều hòa",
    "Dịch vụ giặt ủi",
    "Tủ lạnh",
    "Wifi",
    "Bàn làm việc",
    "Truyền hình cáp/Vệ tinh",
  ];

  const onSubmit: SubmitHandler<ICategory> = async (category) => {
    try {
      const formData = new FormData();
      formData.append("image", category.image);
      formData.append("name", category.name);
      formData.append("size", category.size.toString());
      formData.append("max_occupancy", category.max_occupancy.toString());
      formData.append("description", category.description);
      formData.append("price", category.price.toString());
      formData.append("utilities", checkedItem.join("#"));

      const response = await axios.post(URL.CATEGORY, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success === true) {
        toast.success("Thêm mới thể loại thành công");
        setCheckedItem([]);
        setIsDialogAddOpen(false);
        mutate(URL.CATEGORY);
      }

      reset({
        name: "",
        price: 0,
        max_occupancy: 0,
        size: 0,
        description: "",
        image: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdate: SubmitHandler<ICategory> = async (update) => {
    const formData = new FormData();
    formData.append("name", update.name);
    formData.append("description", update.description);
    formData.append("size", update.size.toString());
    formData.append("max_occupancy", update.max_occupancy.toString());
    formData.append("price", update.price.toString());
    formData.append(
      "utilities",
      Array.isArray(checkedItem) ? checkedItem.join("#") : ""
    );
    formData.append("image", update.image);

    try {
      await axios({
        method: "post",
        url: `http://127.0.0.1:8000/api/categories/${selectedCategoryId}?_method=PATCH`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(() => {
        mutate(URL.CATEGORY);
        setIsDialogOpen(false);
        toast.success("Cập nhật thành công!");
      });
    } catch (error) {
      console.error("There was an error updating the category!", error);
    }
  };

  const handleChangeCheckbox = (item: string) => {
    setCheckedItem((prev: any[]) => {
      if (!Array.isArray(prev)) {
        prev = [];
      }

      if (prev.includes(item)) {
        return prev.filter((i: string) => i !== item);
      } else {
        return [...prev, item];
      }
    });
  };

  useEffect(() => {
    if (detail_category) {
      reset({
        name: detail_category.category.name,
        price: detail_category.category.price,
        max_occupancy: detail_category.category.max_occupancy,
        size: detail_category.category.size,
        description: detail_category.category.description,
        image: detail_category.category.image,
      });

      setCheckedItem(detail_category.category.utilities || []);
    }
  }, [detail_category, reset]);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bạn muốn xóa thể loại phòng này chứ?");
    if (confirm) {
      await axios
        .delete(URL.CATEGORY_DETAIL(id))
        .then(() => {
          toast.success("Xóa thể loại thành công!");
          mutate(URL.CATEGORY);
        })
        .catch((error) => console.error(error));
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Dot />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-5 max-h-full">
      <h1 className="font-bold text-2xl text-center uppercase">
        Thể loại phòng
      </h1>
      <div className="flex justify-between">
        <Dialog open={isDialogAddOpen} onOpenChange={setIsDialogAddOpen}>
          <DialogTrigger>
            <Button className="max-w-xs">Thêm thể loại phòng</Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl overflow-y-auto max-h-[600px] scrollbar">
            <form
              className="flex flex-col gap-3 max-w-5xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="font-bold text-lg text-center">
                Thêm thể loại phòng!
              </h3>
              <div className="flex flex-col gap-4">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Tên thể loại không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Tên thể loại"
                      required
                      placeholder="Tên thể loại phòng"
                      type="text"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="price"
                  control={control}
                  rules={{
                    required: "Giá phòng không được để trống",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <InputLabel
                      title="Giá phòng"
                      required
                      placeholder="Giá phòng"
                      type="number"
                      error={error?.message}
                      {...field}
                    />
                  )}
                />

                <div className="flex gap-5 items-start">
                  <Controller
                    name="max_occupancy"
                    control={control}
                    rules={{
                      required: "Số lượng không được để trống",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <InputLabel
                        title="Số lượng người"
                        required
                        placeholder="Số lượng người/phòng"
                        type="number"
                        error={error?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="size"
                    control={control}
                    rules={{
                      required: "Kích thước phòng không được để trống",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <InputLabel
                        title="Kích thước phòng"
                        required
                        placeholder="Kích thước phòng"
                        type="number"
                        error={error?.message}
                        {...field}
                      />
                    )}
                  />
                </div>

                <label className="form-control w-full ">
                  <Label className="font-semibold">Tiện ích kèm theo</Label>

                  <div className="grid grid-cols-4 gap-3">
                    {services.map((item, index) => (
                      <div className="form-control col-span-1" key={index}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            value={item}
                            type="checkbox"
                            className="checkbox"
                            checked={checkedItem.includes(item)}
                            onChange={() => handleChangeCheckbox(item)}
                          />
                          <span className="label-text">{item}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </label>

                <label className="form-control w-full ">
                  <Label className="label-text">Mô tả</Label>

                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        placeholder="Mô tả"
                        className="textarea textarea-bordered w-full min-h-[150px] focus:outline-none focus:ring-0 focus-visible:ring-0"
                        {...field}
                      />
                    )}
                  />
                </label>

                <label className="form-control w-full ">
                  <Label className="label-text">
                    Hình ảnh <span className="text-red-500">*</span>
                  </Label>

                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        className="file-input file-input-bordered w-full"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                      />
                    )}
                  />
                </label>
              </div>
              <div className="flex justify-end">
                <div className="flex items-end gap-2">
                  <DialogClose asChild>
                    <Button variant={"outline"} type="reset">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button type="submit">Thêm mới</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <label className="border py-1 px-2 rounded-lg flex items-center gap-2">
          <input
            type="text"
            className="w-[250px] outline-none"
            placeholder="Tìm kiếm thể loại phòng"
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search size={14} />
        </label>
      </div>

      <div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">STT</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {data
              ?.filter((s: ICategory) =>
                s.name.toLowerCase().includes(search?.toLocaleLowerCase())
              )
              .map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="w-3/12">{item?.name}</TableCell>
                  <TableCell className="w-[350px]">
                    <div className="flex items-center justify-center">
                      <div className="w-full h-48">
                        <img
                          src={"http://127.0.0.1:8000" + item?.image}
                          alt={item?.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item?.description}</TableCell>
                  <TableCell className="text-right w-1/12">
                    <div className="flex items-center justify-center gap-2">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger>
                          <div
                            onClick={() => handleView(item.id)}
                            className="bg-green-700 flex p-2 rounded-xl gap-1 text-white cursor-pointer hover:opacity-90"
                          >
                            <MdCreate size={20} />
                            <p>Sửa</p>
                          </div>
                        </DialogTrigger>

                        <DialogContent className="max-w-5xl scrollbar max-h-[650px] overflow-y-auto">
                          {loading_detail ? (
                            <Dot />
                          ) : (
                            <form
                              className="flex flex-col gap-3 max-w-5xl"
                              onSubmit={handleSubmit(onUpdate)}
                            >
                              <h3 className="font-bold text-lg text-center">
                                Thông tin loại phòng{" "}
                                {detail_category?.category.name}
                              </h3>
                              <div className="flex flex-col gap-4">
                                <Controller
                                  name="name"
                                  control={control}
                                  rules={{
                                    required:
                                      "Tên thể loại không được để trống",
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <InputLabel
                                      title="Tên thể loại"
                                      required
                                      placeholder="Tên thể loại phòng"
                                      type="text"
                                      error={error?.message}
                                      {...field}
                                    />
                                  )}
                                />

                                <Controller
                                  name="price"
                                  control={control}
                                  rules={{
                                    required: "Giá phòng không được để trống",
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <InputLabel
                                      title="Giá phòng"
                                      required
                                      placeholder="Giá phòng"
                                      type="number"
                                      error={error?.message}
                                      {...field}
                                    />
                                  )}
                                />

                                <div className="flex gap-5 items-start">
                                  <Controller
                                    name="max_occupancy"
                                    control={control}
                                    rules={{
                                      required: "Số lượng không được để trống",
                                    }}
                                    render={({
                                      field,
                                      fieldState: { error },
                                    }) => (
                                      <InputLabel
                                        title="Số lượng người"
                                        required
                                        placeholder="Số lượng người/phòng"
                                        type="number"
                                        error={error?.message}
                                        {...field}
                                      />
                                    )}
                                  />

                                  <Controller
                                    name="size"
                                    control={control}
                                    rules={{
                                      required:
                                        "Kích thước phòng không được để trống",
                                    }}
                                    render={({
                                      field,
                                      fieldState: { error },
                                    }) => (
                                      <InputLabel
                                        title="Kích thước phòng"
                                        required
                                        placeholder="Kích thước phòng"
                                        type="number"
                                        error={error?.message}
                                        {...field}
                                      />
                                    )}
                                  />
                                </div>

                                <label className="form-control w-full ">
                                  <Label className="font-semibold">
                                    Tiện ích kèm theo
                                  </Label>

                                  <div className="grid grid-cols-4 gap-3">
                                    {services.map((item, index) => (
                                      <div
                                        className="form-control col-span-1"
                                        key={index}
                                      >
                                        <label className="flex items-center gap-2 cursor-pointer">
                                          <input
                                            value={item}
                                            type="checkbox"
                                            className="checkbox"
                                            checked={checkedItem.includes(item)}
                                            onChange={() =>
                                              handleChangeCheckbox(item)
                                            }
                                          />
                                          <span className="label-text">
                                            {item}
                                          </span>
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                </label>

                                <label className="form-control w-full ">
                                  <Label className="label-text">Mô tả</Label>

                                  <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                      <Textarea
                                        placeholder="Mô tả"
                                        className="textarea textarea-bordered w-full min-h-[150px] focus:outline-none focus:ring-0 focus-visible:ring-0"
                                        {...field}
                                      />
                                    )}
                                  />
                                </label>

                                <label className="form-control w-full ">
                                  <Label className="label-text">
                                    Hình ảnh{" "}
                                    <span className="text-red-500">*</span>
                                  </Label>

                                  <Controller
                                    name="image"
                                    control={control}
                                    render={({ field }) => (
                                      <input
                                        type="file"
                                        className="file-input file-input-bordered w-full"
                                        onChange={(e) => {
                                          if (
                                            e.target.files &&
                                            e.target.files.length > 0
                                          ) {
                                            field.onChange(e.target.files[0]);
                                          }
                                        }}
                                      />
                                    )}
                                  />
                                </label>
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
                        </DialogContent>
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
      </div>
    </div>
  );
}
