"use client";
import { ZUSTAND } from "@/zustand";
import { Form, Input, Table, Button, message } from "antd";
import type { FormProps } from "antd";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ConfirmMember } from "@/util/action";
import Image from "next/image";
import { redirect } from "next/navigation";
import MDEditor, { selectWord } from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

export default function Page() {
  const { fetchpaper, employeeId, documentid, confirmId } = ZUSTAND();
  const [caseForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const [tableData, setTableData] = useState<any[]>([]);
  const [jobs, setJobs] = useState("");
  const [description, setDescription] = useState("");

  const detail = async ({ id }: { id: number }) => {
    const request = await axios.post(`/api/document/confirm/detail`, {
      id,
      userid: session?.user.id,
    });

    if (request.data.success) {
      const updatedData = request.data.data?.confirm[0]?.sub.map(
        (data: any) => ({
          key: uuidv4(),
          system: data.system,
          jobs: data.jobs,
          module: data.module,
          version: data.version,
          description: data.description,
        })
      );

      setTableData(updatedData);

      caseForm.setFieldsValue({
        startedDate: dayjs(request.data.data.confirm[0]?.startedDate) || "",
        title: request.data.data.confirm[0]?.title || "",
      });
    }
  };

  useEffect(() => {
    if (documentid) detail({ id: documentid });
  }, [documentid]);

  const addToTable = () => {
    const values = caseForm.getFieldsValue();

    const newRow = {
      key: uuidv4(),
      system: values.system,
      jobs: values.jobs,
      module: values.module,
      version: values.version,
      description: values.description || "",
    };

    setTableData((prev) => [...prev, newRow]);
    caseForm.resetFields([
      "system",
      "jobs",
      "module",
      "version",
      "description",
    ]);
  };

  const onFinish: FormProps["onFinish"] = async () => {
    const merge = tableData.map((item) => ({
      system: item.system,
      jobs: item.jobs,
      module: item.module,
      version: item.version,
      description: item.description,
      employeeId,
      confirmId,
      documentId: documentid,
    }));

    const response = await ConfirmMember(merge);

    if (response > 0) {
      await axios.patch("/api/document/paper", {
        authUser: session?.user.id,
        paperid: confirmId,
        action: true,
      });
      fetchpaper(Number(session?.user.id));
      messageApi.success("Амжилттай хадгалагдлаа!");
      redirect("/paper");
    } else {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };

  return (
    <div>
      {contextHolder}
      <Form form={caseForm} className="p-6" onFinish={onFinish}>
        <div className="p-1">
          <p className="font-bold text-xl my-2">Систем нэр</p>
          <Form.Item name="system">
            <Input maxLength={100} showCount />
          </Form.Item>
        </div>
        <div className="p-1">
          <p className="font-bold text-xl my-2">Хийгдсэн ажилууд</p>
          <Form.Item name="jobs">
            <MDEditor
              height={200}
              value={jobs}
              onChange={(e: any) => setJobs(e)}
            />
          </Form.Item>
        </div>
        <div className="p-1">
          <p className="font-bold text-xl my-2">Шинэчлэлт хийгдсэн модул</p>
          <Form.Item name="module">
            <Input maxLength={100} showCount />
          </Form.Item>
        </div>
        <div className="p-1">
          <p className="font-bold text-xl my-2">Хувилбар</p>
          <Form.Item name="version">
            <Input maxLength={100} showCount />
          </Form.Item>
        </div>
        <div className="p-1">
          <p className="font-bold text-xl my-2">Тайлбар</p>
          <Form.Item name="description">
            <MDEditor
              height={200}
              value={description}
              onChange={(e: any) => setDescription(e)}
            />
          </Form.Item>
        </div>

        <Button type="primary" onClick={addToTable} className="mt-4 mb-6">
          Хадгалах
        </Button>

        <Table
          dataSource={tableData}
          pagination={false}
          bordered
          rowKey="key"
          columns={[
            { title: "Систем нэр", dataIndex: "system", key: "system" },
            { title: "Хийгдсэн ажлууд", dataIndex: "jobs", key: "jobs" },
            { title: "Модул", dataIndex: "module", key: "module" },
            { title: "Хувилбар", dataIndex: "version", key: "version" },
            { title: "Тайлбар", dataIndex: "description", key: "description" },
            {
              title: "Устгах",
              key: "delete",
              render: (_, record) => (
                <Image
                  src="/trash.svg"
                  alt=""
                  className="hover:cursor-pointer"
                  width={20}
                  height={20}
                  onClick={() =>
                    setTableData((prev) =>
                      prev.filter((item) => item.key !== record.key)
                    )
                  }
                />
              ),
            },
          ]}
        />

        <div className="mt-6">
          <Button type="primary" size="large" onClick={() => caseForm.submit()}>
            Дуусгах
          </Button>
        </div>
      </Form>
    </div>
  );
}
