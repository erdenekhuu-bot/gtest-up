"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Flex, Button, Pagination, Table } from "antd";
import { ZUSTAND } from "@/zustand";
import { PaperOthers } from "./paperothers";
import { Badge } from "../ui/badge";
import axios from "axios";
import { useSession } from "next-auth/react";

export function PaperDocument({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getEmployeeId, getDocumentId, takeConfirmId } = ZUSTAND();

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
            dataIndex: "document",
            render: (record: any) => {
              return <span>{record?.title}</span>;
            },
          },
          {
            title: "Үзсэн",
            dataIndex: "rode",
            render: (record: any, result: any) => {
              return record?.rode ? (
                <Badge variant="info">Бөглөсөн</Badge>
              ) : (
                <Button
                  type="primary"
                  onClick={async () => {
                    getEmployeeId(result.employeeId);
                    getDocumentId(result.document.id);
                    takeConfirmId(result.id);
                    router.push("/paper/action");
                  }}
                >
                  Хуудсыг бөглөх
                </Button>
              );
            },
          },
          {
            title: "Ахин хянах",
            dataIndex: "id",
            render: (id: number, result:any) => {
              return (
                <Button
                  size="large"
                  type="link"
                  // onClick={async () => {
                  //   await axios.patch("/api/document/paper", {
                  //     authUser: session?.user.id,
                  //     paperid: id,
                  //     action: false,
                  //   });
                  //   router.refresh();
                  // }}
                  onClick={()=>{
                    getEmployeeId(result.employeeId);
                    getDocumentId(result.document.id);
                    takeConfirmId(result.id);
                    router.push("/paper/action");
                  }}
                >
                  Засаад, хадгалах
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
      <PaperOthers />
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
