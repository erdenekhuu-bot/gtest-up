"use client";
import { Card, Spin, Flex, Badge, Avatar, Form } from "antd";
import { useEffect, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { mongollabel, convertStatus, mergeLetter } from "@/util/usable";
import axios from "axios";
import { ZUSTAND } from "@/zustand";
import { TestCaseAction } from "./TestCaseAction";

export function ReportCard({ documentId }: any) {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { caseid, getCaseId, getCheckout } = ZUSTAND();
  const [form] = Form.useForm();
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const request = await axios.patch(`/api/document/testcase/${caseid}`, {
        action: values.testType,
        description: values.description,
      });

      if (request.data.success) {
        getCheckout(-1);
        detail({ id: documentId });
        form.resetFields();
      }
    } catch (error) {}
  };

  const detail = async (id: any) => {
    try {
      setLoading(true);
      const request = await axios.get("/api/document/detail/" + documentId);
      if (request.data.success) {
        setData(request.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    documentId && detail({ id: documentId });
  }, [documentId]);

  return (
    <section className="mt-8">
      <Flex justify="space-evenly">
        <Card
          title=""
          style={{
            backgroundColor: "#F8F9FA",
            width: "350px",
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
                          <Badge status={convertStatus(item.category)} />
                          <span className="opacity-70">
                            {mongollabel(item.testType)}
                          </span>
                        </Flex>
                        <EllipsisOutlined
                          className="hover:cursor-pointer text-lg"
                          onClick={() => {
                            getCaseId(item.id);
                            getCheckout(9);
                          }}
                        />
                      </Flex>
                      <p className="my-2 font-bold">{item.result}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.steps.replace(/\n/g, "<br />"),
                        }}
                      />
                      <Avatar.Group className="mt-8">
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
                      </Avatar.Group>
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
            width: "350px",
            margin: "10px",
          }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Тест хийгдэж эхэлсэн</span>
          </div>
          <div className="mt-4 h-[500px] overflow-y-scroll scrollbar">
            {!loading ? (
              <Spin />
            ) : (
              data?.testcase?.map(
                (item: any, index: number) =>
                  item.testType === "STARTED" && (
                    <div
                      key={index}
                      className="bg-white p-6 my-8 rounded-lg border"
                    >
                      <Flex justify="space-between">
                        <Flex gap={8}>
                          <Badge status={convertStatus(item.category)} />
                          <span className="opacity-70">
                            {mongollabel(item.testType)}
                          </span>
                        </Flex>
                        <EllipsisOutlined
                          className="hover:cursor-pointer text-lg"
                          onClick={() => {
                            getCaseId(item.id);
                            getCheckout(9);
                          }}
                        />
                      </Flex>
                      <p className="my-2 font-bold">{item.result}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.steps.replace(/\n/g, "<br />"),
                        }}
                      />
                      <Avatar.Group className="mt-8">
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
                      </Avatar.Group>
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
            width: "350px",
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
                          <Badge status={convertStatus(item.category)} />
                          <span className="opacity-70">
                            {mongollabel(item.testType)}
                          </span>
                        </Flex>
                        <EllipsisOutlined
                          className="hover:cursor-pointer text-lg"
                          onClick={() => {
                            getCaseId(item.id);
                            getCheckout(9);
                          }}
                        />
                      </Flex>
                      <p className="my-2 font-bold">{item.result}</p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.steps.replace(/\n/g, "<br />"),
                        }}
                      />
                      <Avatar.Group className="mt-8">
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
                      </Avatar.Group>
                    </div>
                  )
              )
            )}
          </div>
        </Card>
      </Flex>
      <Form form={form}>
        <TestCaseAction form={form} handleOk={handleOk} />
      </Form>
    </section>
  );
}
