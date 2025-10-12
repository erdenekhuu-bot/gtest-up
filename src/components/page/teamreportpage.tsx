"use client";
import { Table, Flex, Button } from "antd";
import { ZUSTAND } from "@/zustand";
import {
  useSearchParams,
  usePathname,
  useRouter,
  redirect,
} from "next/navigation";

export function TeamReportPage({ data, total, page, pageSize }: any) {
  
  const searchParams = useSearchParams();
  const { getMember } = ZUSTAND();
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
      dataIndex: "user",
      render:(record:any)=>record.employee.firstname
    },
    {
      title: "Тайлан үзэх",
      dataIndex: "report",
      render: (record: any) => {
        return record !== null ? (
          <Button
            type="primary"
            onClick={() => {
              getMember(record.id);
              redirect("teamreport/" + record.id);
            }}
          >
            Үзэх
            
          </Button>
        ) : null;
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
