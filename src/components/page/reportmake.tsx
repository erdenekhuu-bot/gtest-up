"use client";
import { Button, Form, Input, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReportTestError } from "../window/report/ReportTestError";
import { ReportBudget } from "../window/report/ReportBudget";
import { convertName, formatHumanReadable } from "@/util/usable";

export function ReportMake({ id, data }: any) {
  const columns: ColumnsType = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (startedDate) =>
        new Date(startedDate).toLocaleString().split(" ")[0],
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => new Date(endDate).toLocaleString().split(" ")[0],
    },
  ];
  const casecolumns: ColumnsType = [
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
  return (
    <Form className="p-6">
      <div className="flex justify-between text-xl">
        <b>"ЖИМОБАЙЛ" ХХК</b>
      </div>
      <div className="mt-8">
        <Form.Item
          name="testname"
          rules={[{ required: true, message: "Тестийн нэр!" }]}
        >
          <Input size="middle" placeholder="Тестийн нэр бичнэ үү..." />
        </Form.Item>
      </div>
      <b>ЗОРИЛГО</b>
      <div className="mt-4">
        <Form.Item
          name="testpurpose"
          rules={[{ required: true, message: "Тестийн зорилго!" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Тестийн зорилго бичнэ үү..."
            style={{ resize: "none" }}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </div>
      <div className="my-4">
        <p className="my-4 font-bold">
          ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
        </p>
        <Table
          dataSource={data.documentemployee}
          columns={columns}
          pagination={false}
          bordered
        />
      </div>
      <b>ТЕСТИЙН ЯВЦЫН ТОЙМ</b>
      <div className="mt-4">
        <Form.Item
          name="testprocessing"
          rules={[{ required: true, message: "Тестийн нэр!" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Тестийн танилцуулга бичнэ үү..."
            style={{ resize: "none" }}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </div>
      <div>
        <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН АЛДААНЫ БҮРТГЭЛ</p>
        <ReportTestError />
      </div>
      <div>
        <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН ТӨСӨВ</p>
        <ReportBudget />
      </div>
      <div className="mt-8">
        <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
        <Form.Item
          name="conclusion"
          rules={[{ required: true, message: "Дүгнэлт!" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Тестийн дүгнэлт бичнэ үү..."
            style={{ resize: "none" }}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </div>
      <b>ЗӨВЛӨГӨӨ</b>
      <div className="mt-8">
        <Form.Item
          name="advice"
          rules={[{ required: true, message: "Зөвлөгөө!" }]}
        >
          <Input.TextArea
            rows={5}
            placeholder="Зөвлөгөө бичнэ үү..."
            style={{ resize: "none" }}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </div>

      <Table
        dataSource={data.testcase}
        columns={casecolumns}
        pagination={false}
        bordered
      />
    </Form>
  );
}
