"use client";

import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { ActionDetail } from "../MemberPlanDetail";
import { mongollabel } from "@/util/usable";

interface DataType {
  key: number;
  id: number;
  employee: any;
  department: any;
  role: string;
}

export function ReadDepartmentEmployee() {
  const context = useContext(ActionDetail);

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (_, record: any) => record?.employee?.firstname,
    },
    {
      title: "Хэлтэс",
      dataIndex: "department",
      key: "department",
      render: (_, record: any) => {
        return record?.employee?.department.name;
      },
    },

    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record: any) => mongollabel(record?.role),
    },
  ];

  return (
    <Table
      dataSource={context?.departmentEmployeeRole}
      columns={columns}
      pagination={false}
      bordered
      rowKey="id"
    />
  );
}
