"use client";
import React from "react";
import { Table, Button } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatHumanReadable } from "@/util/usable";
import { ShareReportWindow } from "@/components/window/sharereportwindow";
import { ZUSTAND } from "@/zustand";
import Image from "next/image";

export function TestCaseReportPage({ data, total, page, pageSize }: any) {
  const router = useRouter();
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

  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const columns = [
    {
      title: "Тоот",
      dataIndex: "generate",
      render: (generate: string) => generate,
    },
    { title: "Тестийн нэр", dataIndex: "title" },
    {
      title: "Огноо",
      dataIndex: "timeCreated",
      sorter: (a: any, b: any) => {
        return (
          new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()
        );
      },
      render: (timeCreated: string) => {
        return formatHumanReadable(new Date(timeCreated).toISOString());
      },
    },
    {
      title: "Тайлан үүсгэх",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          type="primary"
          onClick={() => {
            router.push("testcase/" + id);
          }}
        >
          Тайлан
        </Button>
      ),
    },
    {
      title: "Кэйсүүд",
      dataIndex: "id",
      render: (id: number) => (
        <Button type="link" onClick={() => router.push("testcase/make/" + id)}>
          Кэйсүүд
        </Button>
      ),
    },
    {
      title: "Хуваалцах",
      dataIndex: "id",
      render: (id: number, record: any) => (
        <Button
          type="dashed"
          onClick={() => {
            getDocumentId(record.report.id);
            getCheckout(16);
          }}
        >
          SHARE
        </Button>
      ),
    },
    {
      title: "PDF view",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Image
            alt=""
            src="/view.svg"
            width={40}
            height={40}
            onClick={() => window.open(`/api/download/view/${id}`, "_blank")}
            className="hover:cursor-pointer"
          />
        );
      },
    },
  ];

  return (
    <section>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
      />
      <ShareReportWindow />
    </section>
  );
}
