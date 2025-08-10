"use client";
import { Table, Flex, Input, Button, message } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { convertName, formatHumanReadable } from "@/util/usable";
import axios from "axios";

export function CCpage({ document, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dataWithKeys = document.map((item: any) => ({
    ...item,
    key: item.id,
  }));
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

  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await axios.get(`/api/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Удирдамж_${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      messageApi.error("Амжилтгүй боллоо.");
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
      title: "Шалгах",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              handleDownload(id);
            }}
          >
            Шалгах
          </Button>
        );
      },
    },
  ];

  return (
    <section>
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
