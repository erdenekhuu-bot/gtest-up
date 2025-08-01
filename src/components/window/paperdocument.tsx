"use client";
import { redirect } from "next/navigation";
import { Card, Flex, Badge, theme, Button, Pagination } from "antd";
import { ZUSTAND } from "@/zustand";
import { PaperWindow } from "./paperwindow";

const { useToken } = theme;

export function PaperDocument({ data, total, page, pageSize }: any) {
  const { token } = useToken();
  const { getDocumentId, getCheckout } = ZUSTAND();
  return (
    <section>
      <Flex gap={20} wrap="wrap" style={{ padding: 24 }}>
        {data.map((item: any, index: number) => (
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
                onClick={() => {
                  getDocumentId(item.id);
                  getCheckout(5);
                }}
              >
                Хуудас үүсгэх
              </Button>
            </div>
          </Card>
        ))}
      </Flex>
      <Pagination
        total={total}
        pageSize={pageSize}
        current={page}
        align="end"
      />
      <PaperWindow />
    </section>
  );
}
