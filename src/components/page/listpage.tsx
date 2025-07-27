"use client";
import { Table, Flex, Input, Button } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { convertName, formatHumanReadable } from "@/util/usable";

export function ListPage({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const dataWithKeys = data.map((item: any) => ({
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

  const columns = [
    {
      title: "Тоот",
      dataIndex: "document",
      render: (record: any) => <span>{record.generate}</span>,
    },
    {
      title: "Тестийн нэр",
      dataIndex: "document",
      render: (record: any) => <span>{record.title}</span>,
    },
    // { title: "Тушаал", dataIndex: "statement" },
    {
      title: "Үүсгэсэн ажилтан",
      dataIndex: "document",
      render: (record: any) => convertName(record.user.employee),
    },
    {
      title: "Огноо",
      dataIndex: "startedDate",
      sorter: (a: any, b: any) =>
        new Date(a.startedDate).getTime() - new Date(b.startedDate).getTime(),
      render: (startedDate: string) =>
        formatHumanReadable(new Date(startedDate).toISOString()),
    },
    {
      title: "Шалгах",
      dataIndex: "document",
      render: (record: any) => (
        <Button
          type="primary"
          onClick={() => {
            router.push("listplan/" + record.id);
          }}
        >
          View
        </Button>
      ),
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
