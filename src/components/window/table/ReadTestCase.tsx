"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useContext } from "react";
import { ActionDetail } from "../MemberPlanDetail";

type DataType = {
  id: number;
  category: string;
  types: string;
  steps: string;
  result: string;
  division: string;
  testType: string;
  description: string;
  timeCreated: string;
  timeUpdate: string;
  documentId: number;
};

export function ReadTestCase() {
  const detailContext = useContext(ActionDetail);

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (category) => category,
    },
    {
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      render: (types) => types,
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (division) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
      ),
    },
  ];

  return (
    <Table
      dataSource={detailContext?.testcase}
      columns={columns}
      rowKey="id"
      pagination={false}
      bordered
    />
  );
}
