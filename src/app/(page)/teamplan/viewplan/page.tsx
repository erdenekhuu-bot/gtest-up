"use client";
import axios from "axios";
import { useRouter, redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge, Table, Breadcrumb, Button } from "antd";
import { mongollabel } from "@/util/usable";
import { PaperRegister } from "@/components/window/reject/PaperRegister";
import { ZUSTAND } from "@/zustand";

export default function ViewPlan(id: any) {
  const [document, setDocument] = useState<any>([]);
  const router = useRouter();
  const { getCheckout, checkout, getDocumentId } = ZUSTAND();

  const fetchData = async () => {
    const response = await axios.post("/api/member", { tm: id.id });
    if (response.data.success) {
      console.log(response.data.data);
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
          { title: "Гарчиг", dataIndex: "title", key: "title" },
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
              return <Button type="link" onClick={()=>{getDocumentId(id), getCheckout(14)}}>Үзэх</Button>;
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
