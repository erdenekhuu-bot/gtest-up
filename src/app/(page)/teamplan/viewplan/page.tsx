"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, Flex, Badge, theme, Button } from "antd";

const { useToken } = theme;

export default function ViewPlan(id: any) {
  const { token } = useToken();
  const { data: session } = useSession();
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
    <Flex gap={20} wrap="wrap" style={{ padding: 24 }}>
      {document.map((item: any, index: number) => (
        <Card
          key={index}
          title={
            <span
              style={{
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              {item.title}
            </span>
          }
          className="m-4 transition-all duration-300 hover:shadow-lg"
          style={{
            width: 320,
            viewTransitionName: `card-${item.id}`,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            transition: "all 0.3s ease",
          }}
          cover={
            <div
              style={{
                height: 160,
                background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimaryBgHover} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorPrimary,
                fontSize: 24,
                fontWeight: "bold",
              }}
              className="hover:cusror-pointer"
              onClick={() => redirect(`viewplan/${item.id}`)}
            >
              {item.title}
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <Badge status="success" text={item.state} />

            <div
              style={{
                height: 4,
                background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorSuccess} 100%)`,
                borderRadius: 2,
              }}
            />
            <Button
              type="primary"
              disabled={item.state !== "PENDING"}
              onClick={async () => {
                await axios.put(`/api/final/`, {
                  authuserId: session?.user.id,
                  reject: 2,
                  documentId: item.id,
                });
                await axios.patch(`/api/final`, {
                  authuserId: session?.user.id,
                  reject: 3,
                  documentId: item.id,
                });
                fetchData();
              }}
            >
              Зөвшөөрөх
            </Button>
          </div>
        </Card>
      ))}
    </Flex>
  );
}
