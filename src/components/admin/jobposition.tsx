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
  SettingOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { useState, useCallback, useMemo } from "react";
import type { MenuProps } from "antd";

const { Title } = Typography;

const COLOR_MAP = {
  Manager: "volcano",
  Specialist: "geekblue",
  Assistant: "green",
  Other: "blue",
} as const;

type PositionKey = keyof typeof COLOR_MAP;

interface EmployeeData {
  id: string | number;
  key: string | number;
  lastname: string;
  firstname: string;
  jobPosition?: { name: string };
  department: { name: string };
  isActive: boolean;
}

const debounce = (func: Function, delay: number) => {
  let timeout: NodeJS.Timeout | null;
  return (...args: any) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const DEFAULT_COLUMNS_KEYS = [
  "fullName",
  "jobPositionName",
  "departmentName",
  "status",
  "action",
];

export function JobPosition({ data, total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getCheckout, getEmployeeId } = ZUSTAND();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(DEFAULT_COLUMNS_KEYS);
  const [filterDepartment, setFilterDepartment] = useState<string | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState<boolean | undefined>(
    undefined
  );

  const dataWithKeys: EmployeeData[] = data.map((item: any) => ({
    ...item,
    key: item.id,
    isActive: item.isActive ?? true,
  }));

  const generateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("search", term);
        params.set("page", "1");
      } else {
        params.delete("search");
        params.delete("page");
      }
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );

  const debouncedSearch = useCallback(debounce(generateSearch, 300), [
    generateSearch,
  ]);

  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  const handleColumnToggle = (key: string, checked: boolean) => {
    setVisibleColumns((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key)
    );
  };

  const handleDepartmentFilter = (departmentName: string | undefined) => {
    setFilterDepartment(departmentName);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
  };

  const handleStatusFilter = (status: boolean | undefined) => {
    setFilterStatus(status);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
  };

  const baseColumns: ColumnsType<EmployeeData> = useMemo(
    () => [
      {
        title: "АЖИЛТАН (Овог, Нэр)",
        key: "fullName",
        dataIndex: "lastname",
        render: (text, record) => (
          <Space
            size="small"
            onClick={() => console.log(`Go to detail page for: ${record.id}`)}
          >
            <UserOutlined style={{ color: "#595959" }} />
            <span style={{ fontWeight: 600, cursor: "pointer" }}>
              {record.lastname.toUpperCase().charAt(0)}. {record.firstname}
            </span>
          </Space>
        ),
        sorter: (a, b) =>
          (a.lastname + a.firstname).localeCompare(b.lastname + b.firstname),
        width: 250,
      },
      {
        title: "АЛБАН ТУШААЛ",
        key: "jobPositionName",
        dataIndex: "jobPosition",
        render: (text, record) => {
          const positionName = record.jobPosition?.name || "Other";
          const tagColor =
            COLOR_MAP[positionName as PositionKey] || COLOR_MAP.Other;
          return (
            <Tag
              color={tagColor}
              style={{
                minWidth: "100px",
                textAlign: "center",
                textTransform: "uppercase",
                padding: "4px 8px",
              }}
            >
              {positionName}
            </Tag>
          );
        },
        sorter: (a, b) =>
          (a.jobPosition?.name || "").localeCompare(b.jobPosition?.name || ""),
      },
      {
        title: "ГАЗАР/ХЭЛТЭС",
        key: "departmentName",
        dataIndex: "department",
        render: (text, record) => (
          <Space size="small">
            <EnvironmentOutlined style={{ color: "#595959" }} />
            <span style={{ color: "#434343" }}>
              {record.department?.name || "Тодорхойгүй"}
            </span>
          </Space>
        ),
        sorter: (a, b) =>
          (a.department?.name || "").localeCompare(b.department?.name || ""),
      },
      {
        title: "ҮЙЛДЭЛ",
        key: "action",
        render: (record) => (
          <Tooltip title="Мэдээллийг өөрчлөх">
            <Button
              type="link"
              size="middle"
              icon={<EditOutlined />}
              onClick={() => {
                getEmployeeId(record.id);
                getCheckout(15);
              }}
              style={{ color: "#1890ff" }}
            >
              Засах
            </Button>
          </Tooltip>
        ),
        width: 120,
        align: "center",
      },
    ],
    [getCheckout, getEmployeeId]
  );

  const columnMenuItems: MenuProps["items"] = useMemo(
    () =>
      baseColumns.map((col) => ({
        key: col.key as string,
        label: (
          <Checkbox
            checked={visibleColumns.includes(col.key as string)}
            onChange={(e) =>
              handleColumnToggle(col.key as string, e.target.checked)
            }
            onClick={(e) => e.stopPropagation()}
          >
            {col.title as string}
          </Checkbox>
        ),
      })),
    [baseColumns, visibleColumns]
  );

  const departmentOptions: string[] = useMemo(() => {
    const departments = data
      .map((item: any) => item.department?.name)
      .filter(Boolean);
    const uniqueDepartments = Array.from(new Set(departments));
    return uniqueDepartments as string[];
  }, [data]);

  const filterMenuItems: MenuProps["items"] = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        key: "all",
        label: "Бүгд",
        onClick: () => handleDepartmentFilter(undefined),
        style: {
          fontWeight: filterDepartment === undefined ? "bold" : "normal",
        },
      },
      ...departmentOptions.map((dept) => ({
        key: dept,
        label: dept,
        onClick: () => handleDepartmentFilter(dept),
        style: { fontWeight: filterDepartment === dept ? "bold" : "normal" },
      })),
    ];
    return items;
  }, [departmentOptions, filterDepartment]);

  const statusFilterMenuItems: MenuProps["items"] = useMemo(
    () => [
      {
        key: "all",
        label: "Бүгд",
        onClick: () => handleStatusFilter(undefined),
        style: {
          fontWeight: filterStatus === undefined ? "bold" : "normal",
        },
      },
      {
        key: "active",
        label: "Идэвхтэй",
        onClick: () => handleStatusFilter(true),
        style: { fontWeight: filterStatus === true ? "bold" : "normal" },
      },
      {
        key: "inactive",
        label: "Идэвхгүй",
        onClick: () => handleStatusFilter(false),
        style: { fontWeight: filterStatus === false ? "bold" : "normal" },
      },
    ],
    [filterStatus]
  );

  const finalColumns = baseColumns.filter((col) =>
    visibleColumns.includes(col.key as string)
  );

  const filteredData = useMemo(() => {
    let currentData = dataWithKeys;

    if (filterDepartment) {
      currentData = currentData.filter(
        (item) => item.department?.name === filterDepartment
      );
    }

    if (filterStatus !== undefined) {
      currentData = currentData.filter(
        (item) => item.isActive === filterStatus
      );
    }

    const currentSearchTerm = searchParams.get("search")?.toLowerCase() || "";
    if (currentSearchTerm) {
      currentData = currentData.filter(
        (item) =>
          item.lastname.toLowerCase().includes(currentSearchTerm) ||
          item.firstname.toLowerCase().includes(currentSearchTerm)
      );
    }

    return currentData;
  }, [dataWithKeys, filterDepartment, filterStatus, searchParams]);

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
        <Flex
          justify="space-between"
          align="center"
          vertical={false}
          wrap="wrap"
        >
          <Space direction="vertical" style={{ minWidth: 380 }}>
            <Input
              placeholder="Нэрээр хайх"
              prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedSearch(e.target.value);
              }}
              allowClear
              style={{ width: 380, borderRadius: "6px" }}
              size="large"
            />
          </Space>

          <Space wrap={true}>
            <Dropdown
              menu={{ items: statusFilterMenuItems }}
              trigger={["click"]}
            ></Dropdown>

            <Dropdown menu={{ items: filterMenuItems }} trigger={["click"]}>
              <Button icon={<FilterOutlined />} size="large">
                Газраар шүүх ({filterDepartment || "Бүгд"})
              </Button>
            </Dropdown>
            <Dropdown menu={{ items: columnMenuItems }} trigger={["click"]}>
              <Button icon={<SettingOutlined />} size="large" type="default">
                Баганын Тохиргоо
              </Button>
            </Dropdown>
          </Space>
        </Flex>
      </div>

      <Table
        columns={finalColumns}
        dataSource={filteredData}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (tableTotal, range) => (
            <span
              style={{ color: "#595959", fontSize: "14px", fontWeight: 500 }}
            >
              Нийт **{tableTotal}** ажилтан. {range[0]}-{range[1]} харуулж
              байна.
            </span>
          ),
          position: ["bottomLeft"],
        }}
        onChange={handleTableChange}
        scroll={{ x: "max-content" }}
        size="large"
        sticky
        bordered={false}
        style={{ borderRadius: "6px", overflow: "hidden" }}
        rowClassName={() => "cursor-pointer"}
      />

      <AdminWindow />
    </Card>
  );
}
