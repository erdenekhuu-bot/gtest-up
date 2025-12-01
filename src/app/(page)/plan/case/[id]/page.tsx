"use client";
import { useParams, redirect } from "next/navigation";
import {
  Form,
  Breadcrumb,
  type FormProps,
  Button,
  Flex,
  message,
  Table,
  Layout,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { TestCase } from "@/components/childform/ChildDocument";
import { AddTestCase } from "../../../../../util/action";

export default function Page() {
  const params = useParams();
  const [mainForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const detail = async (id: number) => {
    const response = await axios.get("/api/document/testcase/addcase/" + id);
    if (response.data.success) {
      const caseData = response.data.data.testcase.map((testCase: any) => ({
        key: uuidv4(),
        id: testCase.id,
        category: testCase.category || "",
        types: testCase.types || "",
        steps: testCase.steps || "",
        result: testCase.result || "",
        division: testCase.division || "",
      }));
      setData(caseData);
    }
  };
  const columns: ColumnsType = [
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
  useEffect(() => {
    detail(Number(params.id));
  }, [Number(params.id)]);

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
      documentId: Number(params.id),
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
    <Layout.Content>
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
        dataSource={data}
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
        <Button
          size="large"
          type="link"
          onClick={() => {
            mainForm.submit();
            detail(Number(params.id));
          }}
        >
          Засаад, хадгалах
        </Button>
      </Flex>
    </Layout.Content>
  );
}
