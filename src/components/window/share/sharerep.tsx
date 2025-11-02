"use client";

import { Flex, Button, Table } from "antd";
import { redirect } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { EditShareReport } from "@/components/window/share/shareEditReport";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export function ShareCompRep({ document, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getCheckout, getDocumentId } = ZUSTAND();
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
            dataIndex: "report",
            render: (record: any) => record.reportname,
          },
          
          {
            title: "Үзэх",
            dataIndex: "report",
            render: (record: any) => {
              return (
                <Flex gap={10}>
                  <Button
                    type="primary"
                    onClick={() => {
                      getDocumentId(Number(record.documentId));
                      redirect(`/sharereport/${Number(record.id)}`);
                    }}
                  >
                    Тайлан үзэх
                  </Button>
                  <Button
                    onClick={() => {
                      getDocumentId(Number(record.id));
                      getCheckout(17);
                    }}
                  >
                    Хуваалцсан хүмүүс
                  </Button>
                </Flex>
              );
            },
          },
          {
            title: "PDF view",
            dataIndex: "report",
            render: (record: any) => {
              return (
                <Image
                  alt=""
                  src="/view.svg"
                  width={40}
                  height={40}
                  onClick={() =>
                    window.open(
                      `/api/download/view/${Number(record.documentId)}`,
                      "_blank"
                    )
                  }
                  className="hover:cursor-pointer"
                />
              );
            },
          },
        ]}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePaginationChange,
        }}
      />
      <EditShareReport />
    </section>
  );
}
