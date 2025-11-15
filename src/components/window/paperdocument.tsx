"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Flex, Button, Pagination, Table } from "antd";
import { ZUSTAND } from "@/zustand";
import { PaperOthers } from "./paperothers";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { DeleteConfirmPaper } from "@/util/action";
import { useSession } from "next-auth/react";

export function PaperDocument({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getEmployeeId, getDocumentId, takeConfirmId, triggerPaper } =
    ZUSTAND();
  const { data: session } = useSession();

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");

  const columns:any = [
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
      render: (record: any) => {
        return record?.rode ? (
          <Badge variant="info">Бөглөсөн</Badge>
        ) : (
          <Badge variant="secondary">Бөглөөгүй</Badge>
        );
      },
    },
    hasEdit !== true && {
      title: "Бөглөх",
      dataIndex: "id",
      render: (id: number, result: any) => {
        return (
          <Button
            type="primary"
            onClick={async () => {
              getEmployeeId(result.employeeId);
              getDocumentId(result.document.id);
              takeConfirmId(result.id);
              triggerPaper(id);
              router.push("/paper/action/" + Number(result.document.id));
            }}
          >
            Хуудсыг бөглөх
          </Button>
        );
      },
    },
    hasEdit !== true && {
      title: "Устгах",
      dataIndex: "id",
      render: (id: number) => (
        <Image
          src="/trash.svg"
          alt=""
          width={20}
          height={20}
          onClick={async () => {
            await DeleteConfirmPaper(id);
            router.refresh();
          }}
          className="hover:cursor-pointer"
        />
      ),
    },
  ];
  return (
    <section>
      <Table
        columns={columns.filter(Boolean)}
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
