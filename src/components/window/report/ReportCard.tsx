"use client";
import { Card, Spin, Flex, Badge, Avatar, Breadcrumb } from "antd";
import { useEffect, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { mongollabel, convertStatus, mergeLetter } from "@/util/usable";
import axios from "axios";
import { ZUSTAND } from "@/zustand";
import { redirect, useRouter } from "next/navigation";

export function ReportCard({ documentId }: any) {
  const [data, setData] = useState<any>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { getCaseId } = ZUSTAND();
  const detail = async (id: any) => {
    try {
      setLoading(true);
      const request = await axios.get("/api/document/detail/" + documentId);
      if (request.data.success) {
        setData(request.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  return (
    <section className="mt-8">
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
            onClick: () => redirect("/sharecase"),
          },
          {
            title: "Кэйс оруулах хуудас",
          },
        ]}
      />
      <Flex justify="space-evenly">
        <Card
          title=""
          style={{
            backgroundColor: "#F8F9FA",
            width: "500px",
            margin: "10px",
          }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Кэйс</span>
          </div>

          <div className="mt-4 h-[500px] overflow-y-scroll scrollbar">
            {!loading ? (
              <Spin />
            ) : (
              data?.testcase?.map(
                (item: any, index: number) =>
                  item.testType === "CREATED" && (
                    <div
                      key={index}
                      className="bg-white p-6 my-8 rounded-lg border"
                    >
                      <Flex justify="space-between">
                        <Flex gap={8}>
                          <Badge status={convertStatus(item.testType)} />
                          <span className="opacity-70">
                            {mongollabel(item.testType)}
                          </span>
                        </Flex>
                        <EllipsisOutlined
                          className="hover:cursor-pointer text-lg"
                          onClick={() => {
                            getCaseId(item.id);
                            router.push(`/sharecase/${item.id}`);
                          }}
                        />
                      </Flex>
                      <p className="my-2 font-bold">{item.types}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: (item?.steps ?? "").replace(/\n/g, "<br />"),
                        }}
                      />
                    </div>
                  )
              )
            )}
          </div>
        </Card>

        <Card
          title=""
          style={{
            backgroundColor: "#F8F9FA",
            width: "500px",
            margin: "10px",
          }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Тест хийгдэж дууссан</span>
          </div>
          <div className="mt-4 h-[500px] overflow-y-scroll scrollbar">
            {!loading ? (
              <Spin />
            ) : (
              data?.testcase?.map(
                (item: any, index: number) =>
                  item.testType === "ENDED" && (
                    <div
                      key={index}
                      className="bg-white p-6 my-8 rounded-lg border"
                    >
                      <Flex justify="space-between">
                        <Flex gap={8}>
                          <Badge status={convertStatus(item.types)} />
                          <span className="opacity-70">
                            {mongollabel(item.testType)}
                          </span>
                        </Flex>
                        <EllipsisOutlined
                          className="hover:cursor-pointer text-lg"
                          onClick={() => {
                            getCaseId(item.id);
                            router.push(`/sharecase/${item.id}`);
                          }}
                        />
                      </Flex>
                      <p className="my-2 font-bold">{item.types}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.steps.replace(/\n/g, "<br />"),
                        }}
                      />
                      <Avatar.Group className="mt-8">
                        <Flex wrap>
                          {data?.documentemployee?.map(
                            (emp: any, index: number) => (
                              <Avatar
                                key={index}
                                style={{ backgroundColor: "#00569E" }}
                              >
                                {mergeLetter(emp.employee)}
                              </Avatar>
                            )
                          )}
                        </Flex>
                      </Avatar.Group>
                    </div>
                  )
              )
            )}
          </div>
        </Card>
      </Flex>
    </section>
  );
}
