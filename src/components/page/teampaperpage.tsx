"use client";
import { Table, Flex, Button } from "antd";
import { ZUSTAND } from "@/zustand";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";

interface DataType {
  key: React.Key;
  id: number;
  firstname: string;
  authUser: object;
}

export function TeamPaperPage({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const { getMember, getDocumentId } = ZUSTAND();
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
  const columns = [
    {
      title: "Гишүүд",
      dataIndex: "firstname",
    },
    {
      title: "Ирсэн батлах хуудас",
      dataIndex: "confirm",
      render: (record: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              getMember(record.id);
              redirect("teampaper/" + record[0].employeeId);
            }}
          >
            {record?.length > 0 ? record?.length : 0}
          </Button>
        );
      },
    },
  ];
  return (
    <Flex gap="middle" vertical>
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
    </Flex>
  );
}
