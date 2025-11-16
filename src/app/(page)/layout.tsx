"use client";
import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LoginOutlined,
  SelectOutlined,
  RadarChartOutlined,
  SettingOutlined,
  MobileOutlined,
  ProjectTwoTone,
  PaperClipOutlined,
  MailOutlined,
  CopyOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  theme,
  Flex,
  Badge,
  Avatar,
  Popover,
} from "antd";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ZUSTAND } from "@/zustand";
import { subLetter } from "@/util/usable";
import Image from "next/image";

const { Header, Sider, Content, Footer } = Layout;

export default function RootPage({ children }: { children?: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const { countdocument, sharecount, fetchshare, shareReport, getShareReport } =
    ZUSTAND();
  const { data: session, status } = useSession();
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");
  const manager = session?.user.name;
  const department = session?.user.employee.department.name;

  const menu: any = [
    (department === "Програм хөгжүүлэлтийн хэлтэс" || hasEdit) && {
      key: "1",
      icon: <PaperClipOutlined />,
      label: "Баталгаажуулах хуудас",
      onClick: () => router.push("/paper"),
    },
    {
      key: "2",
      icon: <SelectOutlined />,
      label: "Удирдамж",
      children: [
        {
          key: "20",
          icon: <SelectOutlined />,
          label: "Удирдамж үүсгэх",
          onClick: () => router.push("/plan"),
        },
        {
          key: "21",
          icon: <SelectOutlined />,
          label: (
            <Flex align="center" gap={10}>
              Хуваалцсан удирдамж <Badge count={sharecount} size="small" />
            </Flex>
          ),
          onClick: () => router.push("/share"),
        },
        {
          key: "22",
          icon: <SelectOutlined />,
          label: "Хуваалцсан кейс",
          onClick: () => router.push("/sharecase"),
        },
      ],
    },
    hasEdit && {
      key: "3",
      icon: <MailOutlined />,
      label: "Тайлан",
      children: [
        {
          key: "30",
          icon: <MailOutlined />,
          label: "Тайлан үүсгэх",
          onClick: () => router.push("/testcase"),
        },
        {
          key: "31",
          icon: <MailOutlined />,
          label: "Хуваалцсан тайлан",
          onClick: () => router.push("/sharereport"),
        },
      ],
    },
    manager === "uuganbayar.ts" && {
      key: "4",
      icon: <FullscreenExitOutlined />,
      label: "Хэлтсийн дарга",
      children: [
        {
          key: "5",
          icon: <MailOutlined />,
          label: (
            <Flex align="center" gap={5}>
              Ирсэн төлөвлөгөө
              <Badge count={countdocument} size="small" />
            </Flex>
          ),
          onClick: () => router.push("/teamplan"),
        },
        {
          key: "6",
          icon: <CopyOutlined />,
          label: "Ирсэн тайлан",
          onClick: () => router.push("/teamreport"),
        },
      ],
    },
    hasEdit && {
      key: "7",
      icon: <MobileOutlined />,
      label: "Тестийн бүртгэлтэй дугаарууд",
      onClick: () => router.push("/numbers"),
    },
    manager === "cc573"
      ? {
          key: "8",
          icon: <RadarChartOutlined />,
          label: "Ирсэн төлөвлөгөөн (cc573)",
          onClick: () => router.push("/cc573"),
        }
      : null,
    department === "Програм ашиглалт, үйлчилгээний хэлтэс" && {
      key: "9",
      icon: <SettingOutlined />,
      label: "Тохиргоо",
      onClick: () => router.push("/admin"),
    },
    {
      key: "10",
      icon: <LoginOutlined />,
      label: "Системээс гарах",
      onClick: () => signOut({ callbackUrl: "/login" }),
    },
  ];

  useEffect(() => {
    session?.user.id && fetchshare(Number(session.user.id));
    session?.user.id && getShareReport(Number(session.user.employee.id));
  }, [session?.user.id]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={300}
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="md:block hidden"
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={menu}
        />
      </Sider>
      <Layout>
        <Header
          className="px-1"
          style={{
            background: colorBgContainer,
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div className="sm:block hidden">
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
          </div>
          <Flex gap={10}>
            <Avatar
              shape="square"
              size="large"
              style={{ backgroundColor: "#00569E" }}
              icon={<ProjectTwoTone className="text-3xl" />}
            />
            <Image
              src={
                session?.user.employee.gender === "female"
                  ? "/female.png"
                  : "/male.png"
              }
              alt=""
              width={40}
              height={40}
            />
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
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} made by Gmobile
        </Footer>
      </Layout>
    </Layout>
  );
}
