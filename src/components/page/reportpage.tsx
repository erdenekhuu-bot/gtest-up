"use client";
import React, { useState } from "react";
import { Table, Button } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatHumanReadable } from "@/util/usable";
import { EditCaseCard } from "@/components/window/case/editcase";
import { ShareReportWindow } from "@/components/window/sharereportwindow";
import { ZUSTAND } from "@/zustand";

export function TestCaseReportPage({ data, total, page, pageSize }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
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
      render: (generate: any, record: any) => {
        return (
          <div
            className="hover:cursor-pointer"
            onClick={() => {
              setSelectedDocumentId(record.id);
            }}
          >
            {generate}
          </div>
        );
      },
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
  ];
  console.log(selectedDocumentId)
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
      {selectedDocumentId && <EditCaseCard documentId={selectedDocumentId} />}
      <ShareReportWindow />
    </section>
  );
}
