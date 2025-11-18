"use client";

import { Modal, Form, Table } from "antd";
import { ZUSTAND } from "@/zustand";
import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { convertName } from "@/util/usable";

export function PaperRegister() {
  const { documentid, getCheckout, checkout } = ZUSTAND();
  const [data, setData] = useState<any[]>([]);

  const detail = async (id: number) => {
    try {
      const response = await axios.get("/api/paper/" + id);
      if (response.data.success) {
        const updatedData =
          response.data.data?.confirm?.flatMap((confirmItem: any) =>
            confirmItem.sub.map((subItem: any) => ({
              key: uuidv4(),
              id: subItem.id,
              jobs: subItem.jobs,
              module: subItem.module,
              system: subItem.system,
              version: subItem.version,
              description: subItem.description,
              employeeId: convertName(subItem.employee),
              check: confirmItem.check, // << HERE IS THE FIX
            }))
          ) || [];

        setData(updatedData);
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (documentid) {
      detail(Number(documentid));
    }
  }, [documentid]);

  const handleCancel = () => {
    getCheckout(-1);
  };

  return (
    <Modal
      open={checkout === 14}
      onCancel={handleCancel}
      width={1000}
      title="Баримтын дэлгэрэнгүй"
      onOk={handleCancel}
    >
      <div className="mt-8">
        <Table
          dataSource={data}
          pagination={false}
          bordered
          rowKey="key"
          columns={[
            {
              title: "Систем нэр",
              dataIndex: "system",
              key: "system",
            },
            {
              title: "Хийгдсэн ажлууд",
              dataIndex: "jobs",
              key: "jobs",
            },
            {
              title: "Шинэчлэлт хийгдсэн модул",
              dataIndex: "module",
              key: "module",
            },
            {
              title: "Хувилбар",
              dataIndex: "version",
              key: "version",
            },
            {
              title: "Тайлбар",
              dataIndex: "description",
              key: "description",
            },
            {
              title: "Хариуцагч",
              dataIndex: "employeeId",
              key: "employeeId",
            },
            {
              title: "Төлөв",
              dataIndex: "check",
              key: "check",
              render: (status: boolean) => {
                return (
                  <span>{status === true ? "Шалгагдсан" : "Шалгагдаагүй"}</span>
                );
              },
            },
          ]}
        />
      </div>
    </Modal>
  );
}
