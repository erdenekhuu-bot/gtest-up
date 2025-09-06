"use client";
import { redirect } from "next/navigation";
import { Flex, Button, message, Form, Table, Breadcrumb } from "antd";
import type { FormProps } from "antd";
import { ZUSTAND } from "@/zustand";
import { someConvertName } from "@/util/usable";
import { BossCheckPaper } from "@/util/action";
import { Badge } from "@/components/ui/badge";

export default function ViewPaper(data: any) {
  
  const [caseForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish: FormProps["onFinish"] = async () => {
    const merge = {
      documentid,
    };
    const response = await BossCheckPaper(merge);
    if (response > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      redirect("/teampaper");
    } else {
      messageApi.error("Болсонгүй");
    }
  };

  const { documentid } = ZUSTAND();

  const tableData = data.document.confirm.flatMap((confirm: any) =>
    confirm.sub.map((sub: any) => {
      return {
        key: `${confirm.id}-${sub.id}`,
        confirmTitle: confirm.title,
        employee: `${sub.employee.firstname} ${sub.employee.lastname}`,
        system: sub.system,
        jobs: sub.jobs,
        module: sub.module,
        version: sub.version,
        description: sub.description,
        check: sub.check,
      };
    })
  );
  console.log(tableData)

  const columns = [
    {
      title: "Баталгаажуулах хуудас",
      dataIndex: "confirmTitle",
      key: "confirmTitle",
    },
    { title: "Систем нэр", dataIndex: "system", key: "system", width: 200 },
    { title: "Хийгдсэн ажлууд", dataIndex: "jobs", key: "jobs", width: 300 },
    { title: "Шинэчлэлт хийгдсэн модул", dataIndex: "module", key: "module" },
    { title: "Хувилбар", dataIndex: "version", key: "version" },
    {
      title: "Тайлбар",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Ажилтан",
      dataIndex: "employee",
      key: "employee",
      render: (record: any) => {
        return <span>{someConvertName(record)}</span>;
      },
    },
    {
      title: "Шалгагдсан",
      dataIndex: "check",
      key: "check",
      render: (record: any) => {
        return record === true ? (
          <Badge variant="info">Шалгагдсан</Badge>
        ) : (
          <Badge variant="secondary">Шалгагдаагүй</Badge>
        );
      },
    },
  ];

  return (
    <Form form={caseForm} className="p-6" onFinish={onFinish}>
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
            onClick: () => redirect("/teampaper"),
          },
          {
            title: "Баталгаажуулах",
          },
        ]}
      />
      {contextHolder}
      <div className="my-8">
        <Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          bordered
          rowKey="key"
        />
      </div>

      <Flex justify="end">
        <Button
          size="large"
          type="primary"
          onClick={() => {
            caseForm.submit();
          }}
        >
          Дуусгах
        </Button>
      </Flex>
    </Form>
  );
}
