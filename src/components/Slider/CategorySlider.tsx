import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { URL } from "@/consts/url-api";
import { ICategory } from "@/interface/ICategoryRoom";
import { fetcher } from "@/lib/fetcher";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { Button } from "../ui/button";

export default function CategorySlider() {
  const { data, error, isLoading } = useSWR(URL.CATEGORY, fetcher);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-full"
      >
        <CarouselContent>
          {data?.map((item: ICategory, index: number) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 ">
              <div className="p-1">
                <Card>
                  <CardContent className="flex flex-col h-full aspect-square gap-2 p-6">
                    <figure className="overflow-hidden aspect-w-16 aspect-h-9">
                      <img
                        className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
                        src={"http://127.0.0.1:8000" + item?.image}
                        alt={item?.name}
                      />
                    </figure>

                    <h2 className="font-bold text-2xl uppercase">
                      {item?.name}
                    </h2>

                    <div className="flex justify-between">
                      <p>
                        Kích thước:{" "}
                        <strong>
                          {item?.size}
                          <span>
                            m<sup>2</sup>
                          </span>
                        </strong>
                      </p>
                      <p>
                        Sức chứa:{" "}
                        <strong>{item?.max_occupancy} người/phòng</strong>
                      </p>
                    </div>
                    <p className="line-clamp-4 text-justify">
                      {item?.description}
                    </p>

                    <Button asChild>
                      <Link to={`/list-room/${item?.id}`}>Xem chi tiết</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
