import useSWR, { mutate } from "swr";
import { useEffect, useState } from "react";
import { MdCreate, MdDelete } from "react-icons/md";
import { URL } from "@/consts/url-api";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { InputLabel } from "@/components/InputCustom/InputLabel";
import { Label } from "@/components/ui/label";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IRoom } from "@/interface/IRoom";
import { Search } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Dot from "@/components/Loading/Dot";

export default function Room() {
  const [search, setSearch] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isDialogAddOpen, setIsDialogAddOpen] = useState<boolean>(false);
  const { handleSubmit, reset, control, setValue } = useForm<IRoom>({});
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const {
    data: rooms,
    mutate: mutateRooms,
    isLoading,
  } = useSWR(URL.ROOM, fetcher);

  const { data: detail_room, isLoading: loading_detail } = useSWR(
    selectedRoom ? URL.ROOM_DETAIL(selectedRoom) : null,
    fetcher
  );

  const handleView = async (id: string) => {
    setSelectedRoom(id);

    await mutate(URL.CATEGORY_DETAIL(id), async () => {
      const response = await fetcher(URL.CATEGORY_DETAIL(id));
      return response;
    });
  };

  const { data: categories } = useSWR(URL.CATEGORY, fetcher);

  const floors = [
    { flor: 1, name: "Tầng 1" },
    { flor: 2, name: "Tầng 2" },
    { flor: 3, name: "Tầng 3" },
    { flor: 4, name: "Tầng 4" },
    { flor: 5, name: "Tầng 5" },
    { flor: 6, name: "Tầng 6" },
  ];

  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Bạn có chắc xóa phòng này chứ?");
    if (confirm) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/rooms/${id}`);
        toast.success("Xóa phòng thành công!");
        mutateRooms();
      } catch (e) {
        toast.error("Lỗi khi xóa");
      }
    }
  };

  const onSubmit: SubmitHandler<IRoom> = async (data) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/rooms",
        data
      );
      if (response.status === 201) {
        toast.success("Thêm mới phòng thành công!");
        mutateRooms();
        setIsDialogAddOpen(false);
      }

      reset();
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const onUpdate: SubmitHandler<IRoom> = async (data) => {
    if (selectedRoom) {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/rooms/${selectedRoom}`,
          data
        );
        setIsDialogOpen(false);
        toast.success("Cập nhật phòng thành công!");
        mutateRooms();
      } catch (e) {
        console.log(e);
        toast.error("Cập nhật phòng thất bại. Vui lòng thử lại sau!");
      }
    } else {
      toast.error("Không tìm thấy ID phòng cần cập nhật!");
    }
  };

  useEffect(() => {
    if (detail_room) {
      setValue("room_no", detail_room.room_no);
      setValue("floor", detail_room.floor);
      setValue("category_id", detail_room.category_id);
    }
  }, [detail_room, setValue]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Dot />
      </div>
    );

  return (
    <div>
      <h2 className="uppercase text-2xl text-center font-bold">
        Quản lý phòng
      </h2>
      <div className="flex items-center justify-between">
        <Dialog open={isDialogAddOpen} onOpenChange={setIsDialogAddOpen}>
          <DialogTrigger>
            <Button className="max-w-xs mb-5">Thêm phòng mới</Button>
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
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn tầng">
                            {field.value &&
                              floors.find((item) => item.flor === field.value)
                                ?.name}
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
                        <Label className="text-red-500">{error.message}</Label>
                      )}
                    </div>
                  )}
                />

                <div className="flex gap-5 items-start">
                  <Controller
                    name="category_id"
                    control={control}
                    rules={{
                      required: "Thể loại phòng không được để trống",
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div className="w-full">
                        <Label className="label-text">Thể loại phòng</Label>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn thể loại phòng">
                              {field.value &&
                                categories.find(
                                  (item: any) => item.id === field.value
                                )?.name}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((item: any, index: number) => (
                              <SelectItem
                                value={item.id.toString()}
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

        <label className="border p-2 rounded-lg flex items-center gap-2">
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
              <TableHead>Tên phòng</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead>Tầng</TableHead>
              <TableHead className="text-center">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms
              ?.filter((s: string) =>
                s.room_no.toLowerCase().includes(search?.toLocaleLowerCase())
              )
              ?.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="w-3/12">{item?.room_no}</TableCell>
                  <TableCell className="w-3/12">
                    {item?.category.name}
                  </TableCell>
                  <TableCell>{item?.floor}</TableCell>
                  <TableCell className="text-right">
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
                                Thông tin phòng {detail_room?.room_no}
                              </h3>
                              <div className="flex flex-col gap-4">
                                <Controller
                                  name="room_no"
                                  control={control}
                                  rules={{
                                    required: "Số phòng không được để trống",
                                  }}
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
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
                                  render={({
                                    field,
                                    fieldState: { error },
                                  }) => (
                                    <div className="w-full">
                                      <Label className="label-text">
                                        Mô tả
                                      </Label>
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
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
                                          defaultValue={field.value}
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
