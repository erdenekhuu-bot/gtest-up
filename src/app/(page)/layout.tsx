"use client";
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  DropboxOutlined,
  HomeOutlined,
  SelectOutlined,
  SnippetsOutlined,
  FormOutlined,
  HighlightOutlined,
  RadarChartOutlined,
  AliwangwangOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Breadcrumb } from "antd";
import { redirect, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { MenuProps } from "antd";
import { ZUSTAND } from "@/zustand";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

const { Header, Sider, Content } = Layout;

export default function RootPage({ children }: { children?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { bread, getBread } = ZUSTAND();
  const { data: session } = useSession();

  const chekcout = session?.user.permission.kind?.length;
  const manager = session?.user.name;

  const items: MenuItem[] = [
    chekcout > 1
      ? {
          key: "1",
          icon: <HomeOutlined />,
          label: "Хэлтсийн дарга",
          children: [
            {
              key: "s10",
              icon: <FormOutlined />,
              label: "Ирсэн төлөвлөгөө",
              onClick: () => router.push("/teamplan"),
            },
            {
              key: "s110",
              icon: <HighlightOutlined />,
              label: "Ирсэн тайлан",
            },
          ],
        }
      : null,
    chekcout > 1
      ? null
      : {
          key: "2",
          icon: <SelectOutlined />,
          label: "Төлөвлөгөө",
          children: [
            {
              key: "s2",
              icon: <AliwangwangOutlined />,
              label: "Төлөвлөгөө үүсгэх",
              onClick: () => {
                router.push("/plan");
                getBread("Төлөвлөгөө үүсгэх");
              },
            },
            { key: "s3", icon: <PieChartOutlined />, label: "Батлах хуудас" },
            { key: "s4", icon: <HighlightOutlined />, label: "Тайлан" },
            {
              key: "s5",
              icon: <DesktopOutlined />,
              label: "Хуваалцсан",
              onClick: () => {
                router.push("/share");
                getBread("Хуваалцсан");
              },
            },
          ],
        },
    chekcout >= 2 && chekcout < 5
      ? {
          key: "3",
          icon: <SnippetsOutlined />,
          label: "Ирсэн төлөвлөгөө",
          onClick: () => router.push("/listplan"),
        }
      : null,
    chekcout >= 5
      ? {
          key: "4",
          icon: <DesktopOutlined />,
          label: "Ирсэн төлөвлөгөө CEO",
        }
      : null,
    manager === "cc573"
      ? {
          key: "5",
          icon: <RadarChartOutlined />,
          label: "Ирсэн төлөвлөгөөн (cc573)",
        }
      : null,
    chekcout > 1 && chekcout < 2
      ? null
      : {
          key: "6",
          icon: <DropboxOutlined />,
          label: "Ашигласан дугаарууд",
        },
    {
      key: "7",
      icon: <LoginOutlined />,
      label: "Системээс гарах",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  return (
    <Layout>
      <Sider width={300} trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            userSelect: "none",
          }}
        >
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              <Link href={"/"}>Нүүр хуудас</Link>
            </Breadcrumb.Item>
          </Breadcrumb> */}
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
