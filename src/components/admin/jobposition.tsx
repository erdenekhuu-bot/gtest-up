"use client";
import {
  Table,
  Flex,
  Input,
  Button,
  Card,
  Space,
  Typography,
  Tag,
  Tooltip,
  Dropdown,
  Checkbox,
} from "antd";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { AdminWindow } from "./window";
import {
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export function JobPosition({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getCheckout, getEmployeeId } = ZUSTAND();

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
    {
      title: "АЖИЛТАН (Овог, Нэр)",
      dataIndex: "firstname",
      render: (firstname: string) => (
        <Space size="small">
          <UserOutlined style={{ color: "#595959" }} />
          <span style={{ fontWeight: 600, cursor: "pointer" }}>
            {firstname}
          </span>
        </Space>
      ),
    },
    {
      title: "АЛБАН ТУШААЛ",
      dataIndex: "jobPosition",
      render: (record: any) => {
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
      },
    },
    {
      title: "ГАЗАР/ХЭЛТЭС",
      dataIndex: "department",
      render: (record: any) => (
        <Space size="small">
          <EnvironmentOutlined style={{ color: "#595959" }} />
          <span style={{ color: "#434343" }}>{record?.name}</span>
        </Space>
      ),
    },
    {
      title: "ҮЙЛДЭЛ",
      dataIndex: "id",
      render: (id: number) => (
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
  ];

  return (
    <Card
      title={
        <Space size="middle">
          <Title
            level={3}
            style={{ margin: 0, fontWeight: 700, color: "#262626" }}
          ></Title>
        </Space>
      }
      extra={<Space></Space>}
      style={{
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        borderRadius: "12px",
        border: "1px solid #f0f0f0",
      }}
      bodyStyle={{ padding: "0 24px 24px 24px" }}
    >
      <div
        style={{
          padding: "20px 0",
          marginBottom: 20,
        }}
      >
        <Input
          placeholder="Нэрээр хайх"
          prefix={<SearchOutlined />}
          onChange={(e) => {
            generateSearch(e.target.value);
          }}
          allowClear
        />
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
        bordered
      />

      <AdminWindow />
    </Card>
  );
}
