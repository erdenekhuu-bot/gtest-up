"use client";
import { Form, Input, Table, Flex, Steps, Button, Breadcrumb } from "antd";
import { useState, createContext, useRef, useEffect, useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { convertName } from "../../../../util/usable";
import axios from "axios";
import { useRouter, useParams, redirect } from "next/navigation";

export default function Page() {
  const params = useParams();
  const [mainForm] = Form.useForm();
  const [report, setReport] = useState<any>([]);
  const fetchData = async (id: number) => {
    const response = await axios.put("/api/member/report", { tm: id });
    if (response.data.success) {
      mainForm.setFieldsValue({
        reportname: response.data.data?.document?.report?.reportname,
        reportpurpose: response.data.data?.document?.report?.reportpurpose,
        reportprocessing:
          response.data.data?.document?.report?.reportprocessing,
        reportconclusion:
          response.data.data?.document?.report?.reportconclusion,
        reportadvice: response.data.data?.document?.report?.reportadvice,
      });
      setReport(response.data.data);
    }
  };
  useEffect(() => {
    fetchData(Number(params.tm));
  }, [Number(params.tm)]);

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

  const budgetcolumns: ColumnsType = [
    {
      title: "Ангилал",
      dataIndex: "productCategory",
      key: "productCategory",
    },
    {
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toLocaleString("de-DE"),
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (priceTotal: number) => priceTotal.toLocaleString("de-DE"),
    },
  ];

  const issuecolumns: ColumnsType = [
    {
      title: "Алдааны жагсаалт",
      dataIndex: "list",
      key: "list",
    },
    {
      title: "Алдааны түвшин",
      dataIndex: "level",
      key: "level",
    },
    {
      title: "Алдаа гарсан эсэх",
      dataIndex: "exception",
      key: "exception",
      render: (exception: boolean) => (
        <span>{exception ? "Гарсан" : "Гараагүй"}</span>
      ),
    },
    {
      title: "Шийдвэрлэсэн эсэх",
      dataIndex: "value",
      key: "value",
    },
  ];
  const usedPhonses: ColumnsType = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      render: (record: string) => (
        <span>
          {record === "POSTPAID" ? "Дараа төлбөрт" : "Урьдчилсан төлбөрт"}
        </span>
      ),
    },
    {
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Сиреал дугаар",
      dataIndex: "serial",
      key: "serial",
    },
  ];

  return (
    <Form className="p-6" form={mainForm}>
      <div className="flex justify-between text-xl">
        <b>"ЖИМОБАЙЛ" ХХК</b>
      </div>
      <div className="mt-8">
        <Form.Item name="reportname">
          <Input size="middle" readOnly />
        </Form.Item>
      </div>
      <b>ЗОРИЛГО</b>
      <div className="mt-4">
        <Form.Item name="reportpurpose">
          <Input.TextArea rows={5} readOnly />
        </Form.Item>
      </div>
      <div className="my-4">
        <p className="my-4 font-bold">
          ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
        </p>
        <Table
          dataSource={report?.document?.documentemployee}
          columns={columns}
          pagination={false}
          bordered
        />
      </div>
      <b>ТЕСТИЙН ЯВЦЫН ТОЙМ</b>
      <div className="mt-4">
        <Form.Item name="reportprocessing">
          <Input.TextArea rows={5} readOnly />
        </Form.Item>
      </div>
      <div>
        <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН АЛДААНЫ БҮРТГЭЛ</p>
        <Table
          dataSource={report?.document?.report?.issue}
          columns={issuecolumns}
          pagination={false}
          bordered
        />
      </div>
      <div>
        <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН ТӨСӨВ</p>
        <Table
          dataSource={report?.document?.budget}
          columns={budgetcolumns}
          pagination={false}
          summary={() => {
            const result = report.budget || [];
            const total = result.reduce((sum: any, row: any) => {
              const numericValue = Number(
                String(row.priceTotal).replace(/\./g, "")
              );
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }, 0);

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4} align="right">
                  Нийт
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {total.toLocaleString("de-DE")}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} />
              </Table.Summary.Row>
            );
          }}
          bordered
        />
      </div>
      <div className="mt-8">
        <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
        <Form.Item name="reportconclusion">
          <Input.TextArea rows={5} readOnly />
        </Form.Item>
      </div>
      <b>ЗӨВЛӨГӨӨ</b>
      <div className="mt-8">
        <Form.Item name="reportadvice">
          <Input.TextArea rows={5} readOnly />
        </Form.Item>
      </div>

      <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
      <Table
        dataSource={report?.document?.report?.usedphone}
        columns={usedPhonses}
        pagination={false}
        bordered
      />
    </Form>
  );
}
