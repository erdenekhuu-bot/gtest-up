"use client";
import {
  Table,Tag,Tooltip,Button
} from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { AdminWindow } from "./window";
import {EditOutlined} from "@ant-design/icons"

export function JobPosition({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getCheckout, getEmployeeId } = ZUSTAND();

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

  const columns=[
    {
      title: "Ажилтан",
      dataIndex: "firstname"
    },
    {
      title: "АЛБАН ТУШААЛ",
      dataIndex: "jobPosition",
      render: (record:any) => {
          return (
            <Tag
              color={"blue"}
              style={{
                minWidth: "100px",
                textAlign: "center",
                textTransform: "uppercase",
                padding: "4px 8px",
              }}
            >
              {record?.name}
            </Tag>
          );
      }  
    },
    {
      title: "ГАЗАР/ХЭЛТЭС",
      dataIndex: "department",
      render: (record:any) => <span style={{ color: "#434343" }}>{record.name}</span>
    },
    {
        title: "ҮЙЛДЭЛ",
        dataIndex: "id",
        render: (id:number) => (
          <Tooltip title="Мэдээллийг өөрчлөх">
            <Button
              type="link"
              size="middle"
              icon={<EditOutlined />}
              onClick={() => {
                getEmployeeId(id);
                getCheckout(15);
              }}
              style={{ color: "#1890ff" }}
            >
              Засах
            </Button>
          </Tooltip>
        ),
      },
  ]

  return (
    <section>
      <Table
        columns={columns}
        dataSource={dataWithKeys}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
        }}
        onChange={handleTableChange}
        bordered
      />

      <AdminWindow />
    </section>
  );
}
