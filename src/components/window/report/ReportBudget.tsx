"use client";
import { Form, Input, Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import Image from "next/image";

interface DataType {
  key: number;
  total: number;
  spent: number;
  excess: number;
}

export function ReportBudget() {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const handleAdd = () => {
    const newData: DataType = {
      key: nextKey,
      total: 0,
      spent: 0,
      excess: 0,
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };

  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Нийт авсан мөнгөн дүн",
      dataIndex: "total",
      key: "total",
      render: (_, record, index) => (
        <Form.Item name={["reportbudget", index, "total"]}>
          <Input type="number" placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "Нийт зарцуулсан дүн",
      dataIndex: "spent",
      key: "spent",

      render: (_, record, index) => (
        <Form.Item name={["reportbudget", index, "spent"]}>
          <Input type="number" placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Төсөвөөс хэтэрсэн дүн",
      dataIndex: "excess",
      key: "excess",
      render: (_, record, index) => (
        <Form.Item name={["reportbudget", index, "excess"]}>
          <Input type="number" placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "",
      key: "id",
      render: (_, record) => (
        <Image
          src="/trash.svg"
          alt=""
          className="hover:cursor-pointer"
          width={20}
          height={20}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
      <div className="text-end mt-4">
        <Button
          type="primary"
          onClick={() => {
            handleAdd();
          }}
        >
          Мөр нэмэх
        </Button>
      </div>
    </div>
  );
}
