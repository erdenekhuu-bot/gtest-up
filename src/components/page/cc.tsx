"use client";
import { Table, Flex, Input, Button, message } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { convertName, formatHumanReadable } from "@/util/usable";
import { useState } from "react";

export function CCpage({ data, total, page, pageSize }: any) {

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dataWithKeys = data.map((item: any) => ({
    ...item,
    key: item.id,
  }));

  const [pdfLoading, setPdfLoading] = useState<number | null>(null);

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


   const handleDownloadPDF = async (id: number) => {
    setPdfLoading(id);
    try {
      const response = await fetch(`/api/download/${id}`);
      if (!response.ok) {
        messageApi.error("Болсонгүй");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `paper_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
    } finally {
      setPdfLoading(null);
    }
  };


  const columns = [
    {
      title: "Тоот",
      dataIndex: "generate",
    },
    {
      title: "Тестийн нэр",
      dataIndex: "title",
    },

    {
      title: "Үүсгэсэн ажилтан",
      dataIndex: "user",
      render: (record: any) => convertName(record.employee),
    },
    {
      title: "Огноо",
      dataIndex: "timeCreated",
      sorter: (a: any, b: any) =>
        new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime(),
      render: (timeCreated: string) =>
        formatHumanReadable(new Date(timeCreated).toISOString()),
    },

    {
      title: "PDF хувилбар",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          onClick={() => handleDownloadPDF(id)}
          type="link"
          loading={pdfLoading === id}
        >
          Файл
        </Button>
      ),
    },
  ];

  return (
    <section>
      {contextHolder}
      <div className="mb-8">
        <Flex gap={20} justify="space-between">
          <Input.Search
            placeholder="Тестийн нэрээр хайх"
            onChange={(e) => {
              generateSearch(e.target.value);
            }}
            allowClear
          />
        </Flex>
      </div>

      <Table<DataType>
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
      />
    </section>
  );
}
