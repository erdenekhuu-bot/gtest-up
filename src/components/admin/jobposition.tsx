"use client";
import { Table, Flex, Input, Button } from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { AdminWindow } from "./window";

export function JobPosition({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const {getCheckout, getEmployeeId} = ZUSTAND()
  

  const dataWithKeys = data.map((item: any) => ({
    ...item,
    key: item.id,
  }));

  
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
    { title: "Овог", dataIndex: "lastname" },
    { title: "Нэр", dataIndex: "firstname" },
    {
      title: "Албан тушаал",
      dateIndex: "jobPosition",
      render: (record: any) => {
        return <span>{record.jobPosition?.name}</span>;
      },
    },
    {
      title: "Газар",
      dateIndex: "department",
      render: (record: any) => {
        return <span>{record.department.name}</span>;
      },
    },
    {
      title: "Засварлах",
      dateIndex: "id",
      render: (record: any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              getEmployeeId(record.id)
              getCheckout(15)
            }}
          >
            Өөрчлөх
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
            placeholder="Ажилтны нэрээр хайх"
            onChange={(e) => {
              generateSearch(e.target.value);
            }}
            allowClear
          />
        </Flex>
      </div>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
      />
      <AdminWindow/>
    </section>
  );
}
