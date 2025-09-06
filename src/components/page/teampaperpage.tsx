"use client";
import { Table, Flex, Button, Pagination, message } from "antd";
import { ZUSTAND } from "@/zustand";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { formatHumanReadable } from "@/util/usable";

export function TeamPaperPage({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
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
      {contextHolder}
      <Table
        columns={[
          {
            title: "Баталгаажуулах хуудас",
            dataIndex: "confirm",
            key: "confirm",
            render: (record: any) => {
              return (
                <span>
                  {record[0].title !== null || record[0].title===""
                    ? record[0].title
                    : "Баталгаажуулах хуудас"}
                </span>
              );
            },
          },
          {
            title: "Хугацаа",
            dataIndex: "confirm",
            key: "confirm",
            render: (record: any) => {
              return (
                <span>
                  {formatHumanReadable(
                    new Date(record[0].startedDate).toISOString()
                  )}
                </span>
              );
            },
          },

          {
            title: "Танилцах",
            dataIndex: "id",
            key: "id",
            render: (id: number, record: any) => {
              const allChecked =
                Array.isArray(record.confirm) &&
                record.confirm.length > 0 &&
                record.confirm.every((item: any) => item.check === true);

              return allChecked ? (
                <Badge variant="info">Танилцсан</Badge>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    getDocumentId(id);
                    router.push("/teampaper/" + record.id);
                  }}
                >
                  Танилцах
                </Button>
              );
            },
          },
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
