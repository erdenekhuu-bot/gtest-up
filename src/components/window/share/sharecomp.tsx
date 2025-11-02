"use client";
import { Card, Flex, Popover, Button, Pagination, Table } from "antd";
import { redirect } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { EditShareWindow } from "./shareEditWindow";
import { EditShareReport } from "@/components/window/share/shareEditReport";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function ShareComp({ document, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { getDocumentId, getCheckout } = ZUSTAND();
  const { replace } = useRouter();
  const router = useRouter();
  const generateSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("pageSize", newPageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section>
      <Table
        dataSource={document}
        columns={[
          {
            title: "Төлөвлөгөө",
            dataIndex: "document",
            render: (document: any) => document.title,
          },
          {
            title: "Телөвлөгөөний зорилго",
            dataIndex: "document",
            render: (document: any) => document.detail.aim,
          },
          {
            title: "Үзэх",
            dataIndex: "document",
            render: (document: any) => {
              return (
                <Button
                  type="primary"
                  onClick={() => router.push(`/share/${Number(document.id)}`)}
                >
                  Төлөвлөгөө үзэх
                </Button>
              );
            },
          },
          // {
          //   title: "Тайлан",
          //   dataIndex: "document",
          //   render: (record: any) => {
          //     return (
          //       <Flex gap={10}>
          //         <Button
          //           type="primary"
          //           onClick={() => {
          //             getDocumentId(Number(record.documentId));
          //             redirect(`/sharereport/${Number(record.id)}`);
          //           }}
          //         >
          //           Тайлан үзэх
          //         </Button>
          //         <Button
          //           onClick={() => {
          //             getDocumentId(Number(record.id));
          //             getCheckout(17);
          //           }}
          //         >
          //           Хуваалцсан хүмүүс
          //         </Button>
          //       </Flex>
          //     );
          //   },
          // },
        ]}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePaginationChange,
        }}
      />
      <EditShareWindow />
      <EditShareReport />
    </section>
  );
}
