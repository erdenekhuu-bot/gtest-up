"use client";
import React, { useState, useEffect } from "react";
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
  DatabaseTwoTone,
  PieChartTwoTone,
  CheckOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Flex,
  Popover,
  Badge,
  Avatar,
} from "antd";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import type { MenuProps } from "antd";
import { ZUSTAND } from "@/zustand";
import { subLetter } from "@/util/usable";

type MenuItem = Required<MenuProps>["items"][number];

const { Header, Sider, Content } = Layout;

export default function RootPage({ children }: { children?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { getBread, papercount, fetchpaper, fetchshare, sharecount } =
    ZUSTAND();
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
            {
              key: "s111",
              icon: <HighlightOutlined />,
              label: "Баталгаажуулах хуудасууд",
              onClick: () => router.push("/teampaper"),
            },
            {
              key: "s55",
              icon: <DesktopOutlined />,
              label: "Хуваалцсан",
              onClick: () => {
                router.push("/share");
                getBread("Хуваалцсан");
              },
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
            {
              key: "s3",
              icon: <PieChartOutlined />,
              label: "Батлах хуудас",
              onClick: () => router.push("/paper"),
            },
            {
              key: "s4",
              icon: <HighlightOutlined />,
              label: "Тест кэйс",
              onClick: () => {
                router.push("/testcase");
              },
            },
            {
              key: "s8",
              icon: <CheckOutlined />,
              label: "Тайлан",
              onClick: () => {
                router.push("/report");
              },
            },
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
    chekcout > 1
      ? chekcout > 4
        ? {
            key: "4",
            icon: <DesktopOutlined />,
            label: "Ирсэн төлөвлөгөө CEO",
            onClick: () => router.push("/ceoplan"),
          }
        : chekcout > 2
        ? {
            key: "8",
            icon: <SnippetsOutlined />,
            label: "Ирсэн төлөвлөгөө",
            onClick: () => router.push("/dirplan"),
          }
        : {
            key: "3",
            icon: <SnippetsOutlined />,
            label: "Ирсэн төлөвлөгөө",
            onClick: () => router.push("/listplan"),
          }
      : null,
    manager === "cc573"
      ? {
          key: "5",
          icon: <RadarChartOutlined />,
          label: "Ирсэн төлөвлөгөөн (cc573)",
          onClick: () => router.push("/cc573"),
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

  const content = (
    <div>
      <p>Ирсэн батлах хуудас: {papercount}</p>
    </div>
  );

  const sharecontent = (
    <div>
      <p>Хуваалцсан хуудас: {sharecount}</p>
    </div>
  );

  useEffect(() => {
    session?.user.id && fetchpaper(Number(session?.user.id));
    session?.user.id && fetchshare(Number(session.user.id));
  }, [session?.user.id]);

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
        <Header className="px-1" style={{ background: colorBgContainer }}>
          <Flex justify="space-between" gap={20} align="center">
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
            <Flex gap={10}>
              <Popover content={content}>
                <Badge count={papercount}>
                  <Avatar
                    shape="square"
                    size="large"
                    icon={<PieChartTwoTone className="text-3xl" />}
                  />
                </Badge>
              </Popover>
              <Popover content={sharecontent}>
                <Badge count={sharecount} className="hover:cursor-pointer">
                  <Avatar
                    shape="square"
                    size="large"
                    icon={<DatabaseTwoTone className="text-3xl" />}
                  />
                </Badge>
              </Popover>
              <Avatar
                shape="square"
                size="large"
                style={{ backgroundColor: "#00569E" }}
              >
                <span className="text-2xl">
                  {subLetter(String(session?.user.name))}
                </span>
              </Avatar>
            </Flex>
          </Flex>
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
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
