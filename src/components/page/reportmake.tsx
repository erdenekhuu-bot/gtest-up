"use client";
import { Button, Form, Input, Table, Flex, message, Select } from "antd";
import type { FormProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReportTestError } from "../window/report/ReportTestError";
import { ReportBudget } from "../window/report/ReportBudget";
import { convertName } from "@/util/usable";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { Report } from "@/util/action";

export function ReportMake({ id, data }: any) {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [nextKey, setNextKey] = useState(1);
  const { data: session } = useSession();
  const handleAdd = () => {
    const newData = {
      key: nextKey,
      type: "",
      phone: "",
      description: "",
      serial: "",
    };
    setDataSource([...dataSource, newData]);
    setNextKey(nextKey + 1);
  };
  const handleDelete = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };
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
  const phonecolumns: ColumnsType = [
    {
      title: "Дугаарын төрөл",
      dataIndex: "type",
      key: "type",
      render: (_, record, index) => (
        <Form.Item name={["usedphone", index, "type"]}>
          <Select
            placeholder=""
            style={{ width: "100%" }}
            options={[
              {
                label: "Урьдчилсан төлбөрт",
                value: "PERPAID",
              },
              {
                label: "Дараа төлбөрт",
                value: "POSTPAID",
              },
            ]}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
      ),
    },

    {
      title: "Дугаар",
      dataIndex: "phone",
      key: "phone",
      render: (_, record, index) => (
        <Form.Item name={["usedphone", index, "phone"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
      render: (_, record, index) => (
        <Form.Item name={["usedphone", index, "description"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },
    {
      title: "Сиреал дугаар",
      dataIndex: "serial",
      key: "serial",
      render: (_, record, index) => (
        <Form.Item name={["usedphone", index, "serial"]}>
          <Input placeholder="" />
        </Form.Item>
      ),
    },

    {
      title: "",
      key: "id",
      render: (_, record: any) => (
        <Image
          src="/trash.svg"
          alt=""
          className="hover:cursor-pointer"
          width={20}
          height={20}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];
  const [mainForm] = Form.useForm();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const requestData = {
      ...values,
      documentId: Number(id),
      authuserId: Number(session?.user.id),
    };
    console.log(requestData);
    const request = await Report(requestData);
    console.log(request);
  };
  return (
    <Form className="p-6" form={mainForm} onFinish={onFinish}>
      <div className="flex justify-between text-xl">
        <b>"ЖИМОБАЙЛ" ХХК</b>
      </div>
      <div className="mt-8">
        <Form.Item
          name="reportname"
          rules={[{ required: true, message: "Тестийн нэр!" }]}
        >
          <Input size="middle" placeholder="Тестийн нэр бичнэ үү..." />
        </Form.Item>
      </div>
      <b>ЗОРИЛГО</b>
      <div className="mt-4">
        <Form.Item
          name="reportpurpose"
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
          name="reportprocessing"
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
          name="reportconclusion"
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
          name="reportadvice"
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
      <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
      <Table
        dataSource={dataSource}
        columns={phonecolumns}
        pagination={false}
        bordered
      />
      <div className="text-end mt-4">
        <Button
          type="primary"
          onClick={() => {
            handleAdd();
          }}
        >
          Мөр нэмэх
        </Button>
      </div>
      <Flex justify="start" gap={20} style={{ marginTop: 40 }}>
        <Button size="large" type="primary" onClick={() => mainForm.submit()}>
          Тайлан үүсгэх
        </Button>
      </Flex>
    </Form>
  );
}
