"use client";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { convertName, formatHumanReadable } from "@/util/usable";

type DataType = {
  key: number;
  employee: any;
  role: string;
  startedDate: Date;
  endDate: Date;
};

export function ReportTestSchedule({ detailId }: any) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      width: 200,
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      width: 200,
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (startedDate) => formatHumanReadable(startedDate),
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => formatHumanReadable(endDate),
    },
  ];

  const detail = async function ({ id }: { id: number }) {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        setDataSource(request.data.data.documentemployee);
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    detailId && detail({ id: detailId });
  }, [detailId]);

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
