"use client";
import { Table, Modal, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { convertName } from "@/util/usable";
import axios from "axios";
import { ZUSTAND } from "@/zustand";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function TableConfirm() {
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const [data, setData] = useState<any | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const [loading, setLoading] = useState(false);

  const columns: ColumnsType = [
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
      dataIndex: "employee",
      key: "employee",
      render: (record: any) => {
        return <span>{convertName(record)}</span>;
      },
    },
  ];

  const detail = async (id: number) => {
    setLoading(true);
    const request = await axios.get(`/api/document/paper/${id}`);
    if (request.data.success) {
      setData(request.data.data);
    }
  };
  useEffect(() => {
    documentid && detail(documentid);
  }, [documentid]);

  return (
    <Modal
      open={checkout === 6}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button
          key="next"
          type="primary"
          onClick={async () => {
            await axios.patch(`/api/document/paper`, {
              authUser: session?.user.id,
            });
            router.refresh();
            getCheckout(-1);
          }}
        >
          Шалгалаа
        </Button>,
      ]}
    >
      <section className="p-4">
        <Table
          dataSource={loading && data?.confirm}
          pagination={false}
          bordered
          rowKey="key"
          columns={columns}
        ></Table>
      </section>
    </Modal>
  );
}
