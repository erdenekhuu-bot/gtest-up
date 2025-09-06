"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Badge, Table, Breadcrumb, Button } from "antd";
import { mongollabel } from "@/util/usable";

export default function ViewPlan(id: any) {
  const [document, setDocument] = useState<any>([]);

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
          { title: "Гарчиг", dataIndex: "title", key: "title" },
          {
            title: "Төлөв",
            dataIndex: "state",
            key: "state",
            render: (state) => (
              <Badge status="success" text={mongollabel(state)} />
            ),
          },
          {
            title: "",
            dataIndex: "id",
            key: "id",
            render: (id: number) => (
              <Button
                size="large"
                type="primary"
                onClick={() => redirect(`viewplan/${id}`)}
              >
                Хянах
              </Button>
            ),
          },
        ]}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </section>
  );
}
