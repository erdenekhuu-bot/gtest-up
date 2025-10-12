"use client";
import { Table, Flex, Button, Pagination, message } from "antd";
import { ZUSTAND } from "@/zustand";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { formatHumanReadable } from "@/util/usable";

export function TeamPaperPage({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const { getDocumentId } = ZUSTAND();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <section>
      <Table
        columns={[
          {
            title: "Баталгаажуулах хуудас",
            dataIndex: "title",
          },
          {
            title: "Хугацаа",
            dataIndex: "timeCreated",
            render: (record: any) => {
              return (
                <span>
                  {formatHumanReadable(
                    new Date(record).toISOString()
                  )}
                </span>
              );
            },
          },
          {
            title: "Төлөв",
            dataIndex: "check_status",
            render:(check:boolean, record:any)=>{
                   return check ? (
                <Badge variant="info">Танилцсан</Badge>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    getDocumentId(record.id);
                    router.push("/teampaper/" + record.id);
                  
                  }}
                >
                  Танилцах
                </Button>
              );
            },
            }
          
        ]}
        dataSource={data.map((c: any) => ({
          ...c,
          key: c.id,
        }))}
        
        pagination={false}
        bordered
      />

      <Flex justify="end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={handlePaginationChange}
        />
      </Flex>
    </section>
  );
}
