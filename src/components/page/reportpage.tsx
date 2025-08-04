"use client";
import React, { useState, useCallback } from "react";
import { Table, Button, Flex, Input, Upload, message } from "antd";
import axios from "axios";
import Image from "next/image";
import { UploadOutlined } from "@ant-design/icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { formatHumanReadable } from "@/util/usable";
import type { UploadProps } from "antd";
import { ReportCard } from "../window/report/ReportCard";

const { Dragger } = Upload;

export function TestCaseReportPage({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
    null
  );
  const [ordering, setOrder] = useState<any | null>();

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: `/api/image/${selectedDocumentId}`,
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        messageApi.success(`${info.file.name} файл амжилттай хадгалагдлаа`);
      } else if (status === "error") {
        messageApi.error(`${info.file.name} файл оруулахад ажилтгүй боллоо.`);
      }
    },
    onDrop(e) {},
  };

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
              //   handleTestCaseClick(record.id);
              setOrder(generate);
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
      {selectedDocumentId && (
        <Dragger {...props}>
          <p className="my-6">
            <Button icon={<UploadOutlined />} type="primary" className="p-6">
              Файл оруулах
            </Button>
          </p>
          <p className="opacity-50">
            Уг тесттэй хамаарал бүхий тушаал оруулна уу. <b>{ordering}</b>
          </p>
        </Dragger>
      )}
      {selectedDocumentId && <ReportCard documentId={selectedDocumentId} />}
    </section>
  );
}
