import { Button } from "@/components/ui/button";
import { URL } from "@/consts/url-api";
import { fetcher } from "@/lib/fetcher";
import { Link } from "react-router-dom";
import useSWR from "swr";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Spinner from "@/components/Loading/Spinner";

export default function ListRoomm() {
  const { data, error, isLoading } = useSWR(URL.CATEGORY, fetcher);
  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-28 flex flex-col gap-5 mb-10">
      <div className="flex justify-center flex-col gap-2 text-center leading-tight border-y py-10">
        <div className=" text-sm">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/list-room">
                  Danh sách phòng
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-[40px]">Phòng nghỉ</h1>
        <p>
          318 phòng ở rộng rãi với nội thất và tiện nghi sang trọng bậc nhất hứa
          hẹn đem đến giây phút nghỉ ngơi thoải mái cho khách hàng.
        </p>
        <p>
          235 phòng tiêu chuẩn và 83 phòng cao cấp sở hữu tầm nhìn bao quát toàn
          thành phố.
        </p>
        <p>
          Nét truyền thống của Việt Nam điểm xuyết trong thiết kế nội thất của
          hai công ty HBA và Wilson Associates.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {data.map((item: any, index: number) => (
          <div
            className="rounded-lg bg-base-100 shadow-xl cursor-pointer group"
            key={index}
          >
            <figure className="rounded-lg overflow-hidden aspect-w-16 aspect-h-9">
              <img
                className=" group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
                src={"http://127.0.0.1:8000" + item?.image}
                alt={item?.name}
              />
            </figure>
            <div className="p-5 flex flex-col gap-3">
              <h2 className="font-bold text-2xl">{item?.name}</h2>

              <div className="flex justify-start gap-5">
                <p>
                  Kích thước{" "}
                  <strong>
                    {item?.size}
                    <span>
                      m<sup>2</sup>
                    </span>
                  </strong>
                </p>
                <p>
                  Sức chứa <strong>{item?.max_occupancy} người/phòng</strong>
                </p>
              </div>
              <p>{item?.description}</p>
              <div className="flex justify-end">
                <Button asChild>
                  <Link to={`/list-room/${item?.id}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
