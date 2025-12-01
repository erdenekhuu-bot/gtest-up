"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, redirect } from "next/navigation";
import axios from "axios";
import { Layout, Breadcrumb, Button, Table, Badge } from "antd";
import { ZUSTAND } from "../../../../zustand";
import { PaperRegister } from "../../../../components/window/reject/PaperRegister";

export default function Page() {
  const params = useParams();
  const [document, setDocument] = useState([]);
  const router = useRouter();
  const { getDocumentId, getCheckout } = ZUSTAND();
  const fetchData = async (id: number) => {
    const response = await axios.put("/api/member", { tm: id });
    if (response.data.success) {
      setDocument(response.data.data);
    }
  };

  useEffect(() => {
    fetchData(Number(params.tm));
  }, [Number(params.tm)]);

  return (
    <Layout.Content>
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
                <Badge status="success" text="Батлагдсан" />
              ) : checkout ? (
                <Badge status="processing" text="Хянагдаж байна" />
              ) : (
                <Badge status="warning" text="Шинэ" />
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
                onClick={() => router.push(`/plan/listplan/${id}`)}
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
    </Layout.Content>
  );
}
