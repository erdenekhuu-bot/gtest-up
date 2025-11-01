"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Table, Input } from "antd";
import type { ColumnsType } from "antd/es/table";

export function UsedPhone({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dataWithKeys = data.map((item: any) => ({
    ...item,
    key: item.id,
  }));
  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const usedPhonses: ColumnsType = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      render: (record: string) => (
        <span>
          {record === "POSTPAID" ? "Дараа төлбөрт" : "Урьдчилсан төлбөрт"}
        </span>
      ),
    },
    {
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Сиреал дугаар",
      dataIndex: "serial",
      key: "serial",
    },
    {
      title: "Оролцсон тест",
      dataIndex: "report",
      key: "report",
      render: (record: any) => {
        return <span>{record.document.title}</span>;
      },
    },
  ];
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
  return (
    <section>
      <Input.Search
        onChange={(e) => {
          generateSearch(e.target.value);
        }}
        allowClear
      />
      <Table
        columns={usedPhonses}
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
