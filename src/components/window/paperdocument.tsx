"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Flex, Button, Pagination, Table, Badge as BD } from "antd";
import { ZUSTAND } from "@/zustand";
import { PaperOthers } from "./paperothers";
import { Badge } from "../ui/badge";
import { DeleteConfirmPaper } from "@/util/action";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { CheckConfirmSub } from "./CheckConfirmSub";

export function PaperDocument({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const {
    getEmployeeId,
    getDocumentId,
    takeConfirmId,
    triggerPaper,
    getCheckout,
  } = ZUSTAND();
  const { data: session } = useSession();

  const handlePaginationChange = (page: number, pageSize?: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    if (pageSize) params.set("pageSize", pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");
  const isAdmin = session?.user.employee.super === "REPORT";

  const columns: any = [
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
      render: (record: any, paper: any) => {
        return record?.rode ? (
          <Badge
            variant="info"
            className="hover:cursor-pointer"
            onClick={() => {
              getCheckout(18);
              takeConfirmId(paper.id);
            }}
          >
            Бөглөсөн
          </Badge>
        ) : (
          <Button
            disabled={hasEdit || isAdmin ? true : false}
            type="primary"
            onClick={async () => {
              getEmployeeId(paper.employeeId);
              getDocumentId(paper.document.id);
              takeConfirmId(paper.id);
              // triggerPaper(id);
              router.push("/paper/action/edit/" + Number(paper.id));
              router.refresh();
            }}
          >
            Хуудсыг бөглөх
          </Button>
        );
      },
    },
    isAdmin && {
      title: "Хянах",
      dataIndex: "rode",
      render: (record: any, paper: any) => {
        return (
          <BD
            status={paper.check ? "success" : "warning"}
            text={paper.check ? "Хянасан" : "Шинэ"}
            className="hover:cursor-pointer"
            onClick={() => {
              getCheckout(18);
              takeConfirmId(paper.id);
            }}
          />
        );
      },
    },

    // hasEdit !== true && {
    //   title: "Бөглөх",
    //   dataIndex: "id",
    //   render: (id: number, result: any) => {
    //     return (
    //       <Button
    //         type="primary"
    //         onClick={async () => {
    //           getEmployeeId(result.employeeId);
    //           getDocumentId(result.document.id);
    //           takeConfirmId(result.id);
    //           triggerPaper(id);

    //           // router.push("/paper/action/" + Number(result.document.id));
    //           router.push("/paper/action/edit/" + Number(result.id));
    //         }}
    //       >
    //         Хуудсыг бөглөх
    //       </Button>
    //     );
    //   },
    // },
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
      <CheckConfirmSub />
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
