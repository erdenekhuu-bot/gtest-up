"use client";
import axios from "axios";
import { useRouter, redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Table, Breadcrumb, Button } from "antd";
import { mongollabel } from "@/util/usable";
import { PaperRegister } from "@/components/window/reject/PaperRegister";
import { ZUSTAND } from "@/zustand";
import { Badge } from "@/components/ui/badge";

export default function ViewPlan(id: any) {
  const [document, setDocument] = useState<any>([]);
  const router = useRouter();
  const { getCheckout, checkout, getDocumentId } = ZUSTAND();

  const fetchData = async () => {
    const response = await axios.post("/api/member", { tm: id.id });
    if (response.data.success) {
      setDocument(response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Number(id.id)]);

  return (
    <section>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
            onClick: () => redirect("/teamplan"),
          },
          {
            title: "Хянах хуудас",
          },
        ]}
      />

      <Table
        dataSource={document}
        columns={[
          { title: "Гарчиг", dataIndex: "title", key: "id" },
          {
            title: "Төлөв",
            dataIndex: "departmentEmployeeRole",
            key: "id",
            render: (record: any) => {
              const accessed = record.every(
                (item: any) => item.state === "ACCESS"
              );
              const checkout = record.some(
                (item: any) => item.state === "ACCESS"
              );

              return accessed ? (
                <Badge variant="info">Батлагдсан</Badge>
              ) : checkout ? (
                <Badge variant="viewing">Хянагдаж байна</Badge>
              ) : (
                <Badge variant="secondary">Хүлээгдэж байна</Badge>
              );
            },
          },
          {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id: number) => (
              <Button
                size="large"
                type="primary"
                onClick={() => router.push(`viewplan/${id}`)}
              >
                Хянах
              </Button>
            ),
          },

          {
            title: "Баталгаажуулах хуудас",
            dataIndex: "id",
            key: "id",
            render: (id: number) => {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    getDocumentId(id), getCheckout(14);
                  }}
                >
                  Үзэх
                </Button>
              );
            },
          },
        ]}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
      <PaperRegister />
    </section>
  );
}
