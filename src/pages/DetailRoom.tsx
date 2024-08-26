import { Link, useParams } from "react-router-dom";
import { FaShower } from "react-icons/fa";
import useSWR from "swr";
import { URL } from "@/consts/url-api";
import { fetcher } from "@/lib/fetcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import Dot from "@/components/Loading/Dot";

export default function DetailRoom() {
  const { id } = useParams();
  const { data, error, isLoading } = useSWR(
    URL.CATEGORY_DETAIL(String(id)),
    fetcher
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center">
        <Dot />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-28 flex flex-col gap-5 mb-10">
      <div className="text-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/list-room">Danh sách phòng</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.category?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="text-center text-[40px] font-semibold">
        {data?.category?.name}
      </div>

      <div className="grid grid-cols-2 gap-5 items-center">
        <div className="object-center object-cover w-full ">
          <img
            className="rounded-xl w-full h-full"
            src={"http://127.0.0.1:8000" + data?.category?.image}
            alt={data?.category?.name}
          />
        </div>
        <div className="flex flex-col gap-5">
          <div className="border-b">
            <b>Thông tin phòng</b>
            <p>
              <b>Kích thước</b>: {data?.category?.size} m2
            </p>
            <p>
              <b>Sức chứa</b>: {data?.category?.max_occupancy} người/phòng
            </p>
          </div>

          <div className="">
            <b>Chi tiết phòng</b>
            <p>{data?.category?.description}</p>
          </div>

          <div>
            <p>
              <b>Dịch vụ kèm theo</b>
            </p>
            <ul className="grid grid-cols-2 gap-3 px-5 mt-2">
              {data?.utilities?.map((item: any, index: number) => (
                <li key={index} className="flex items-center gap-1">
                  <FaShower />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Button className="btn btn-primary w-full" asChild>
            <Link to={`/booking/${id}`}>Đặt phòng ngay</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
