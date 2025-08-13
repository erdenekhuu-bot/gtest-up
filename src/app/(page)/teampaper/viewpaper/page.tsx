"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, Flex, Badge, theme, Button } from "antd";
import { FinalCheck } from "@/components/window/confirm/finalcheck";
import { ZUSTAND } from "@/zustand";

const { useToken } = theme;

export default function ViewPaper(id: any) {
  const { token } = useToken();
  const [document, setDocument] = useState<any>([]);
  const { getCheckout, getEmployeeId, triggerPaper, checkout } = ZUSTAND();

  const fetchData = async () => {
    const response = await axios.put("/api/paper", { tm: id.id });
    if (response.data.success) {
      setDocument(response.data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Number(id.id)]);

  useEffect(() => {
    if (checkout === -1) {
      fetchData();
    }
  }, [checkout]);

  return (
    <Flex gap={20} wrap="wrap" style={{ padding: 24 }}>
      {document?.confirm?.map((item: any, index: number) => (
        <Card
          key={index}
          title="Баталгаажуулах хуудас"
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
            >
              {item?.document?.title}
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
            <div
              style={{
                height: 4,
                background: `linear-gradient(90deg, ${token.colorPrimary} 0%, ${token.colorSuccess} 100%)`,
                borderRadius: 2,
              }}
            />
            {item.check ? (
              <Badge status="success" text="Уншсан" />
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  getCheckout(11);
                  getEmployeeId(item.employeeId);
                  triggerPaper(item.id);
                }}
              >
                Хянах
              </Button>
            )}
          </div>
        </Card>
      ))}
      <FinalCheck />
    </Flex>
  );
}
