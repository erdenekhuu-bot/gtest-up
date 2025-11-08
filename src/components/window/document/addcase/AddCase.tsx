"use client";
import {
  Form,
  Breadcrumb,
  type FormProps,
  Button,
  Flex,
  message,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { redirect, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { TestCase } from "@/components/window/creation/Testcast";
import { useEffect } from "react";
import { ZUSTAND } from "@/zustand";
import { AddTestCase } from "@/util/action";

export function AddCase(data: any) {
  const { documentid } = ZUSTAND();
  const router = useRouter();
  const caseData = data.data.testcase.map((testCase: any) => ({
    key: uuidv4(),
    id: testCase.id,
    category: testCase.category || "",
    types: testCase.types || "",
    steps: testCase.steps || "",
    result: testCase.result || "",
    division: testCase.division || "",
  }));
  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (category) => category,
    },
    {
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      render: (types) => types,
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (division) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
      ),
    },
  ];
  const [mainForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const testcase = (values.testcase || []).map((item: any) => {
      return {
        category: item.category,
        division: item.division,
        result: item.result,
        steps: item.steps,
        types: item.types,
      };
    });
    const merge = {
      testcase,
      documentid,
    };
    const update = await AddTestCase(merge);
    if (update > 0) {
      messageApi.success("Амжилттай засагдсан");
      redirect("/plan");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
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
            onClick: () => redirect("/plan"),
          },
          {
            title: "Кэйс нэмэх хуудас",
          },
        ]}
      />
      {contextHolder}
      <p className="font-bold text-xl my-2">Батлагтсан кэйсүүд</p>
      <Table
        dataSource={data.data.testcase}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
      <p className="mt-8"></p>
      <div className="font-bold my-2 text-lg mx-4">
        Тестийн кэйс нэмэж оруулах
      </div>
      <Form form={mainForm} onFinish={onFinish}>
        <TestCase form={mainForm} />
      </Form>
      <Flex justify={"center"}>
        <Button size="large" type="link" onClick={() => mainForm.submit()}>
          Засаад, хадгалах
        </Button>
      </Flex>
    </section>
  );
}
