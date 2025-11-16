"use client";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumb, Form, Input, Button, message } from "antd";
import type { FormProps } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { useState, useEffect } from "react";
import axios from "axios";
import { ConfirmMember } from "@/util/action";
import { ZUSTAND } from "@/zustand";
import { useSession } from "next-auth/react";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const [caseForm] = Form.useForm();
  const [jobs, setJobs] = useState("");
  const [description, setDescription] = useState("");
  const { documentid, fetchpaper, confirmpaperid } = ZUSTAND();
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();

 
  const onFinish: FormProps["onFinish"] = async (values) => {
    const merge = {
      confirmId: Number(params.paper),
      ...values,
      paperid: confirmpaperid,
      employeeId: Number(session?.user.employee.id),
      documentId: documentid,
    };

    const response = await ConfirmMember(merge);
    if (response > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
    } else {
      messageApi.error("Амжилтгүй боллоо.");
    }
  };


  return (
    <div>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => router.back()}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
          },
          {
            title: "Баталгаажуулах жагсаалт",
          },
        ]}
      />
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
              height={300}
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
              height={300}
              value={description}
              onChange={(e: any) => setDescription(e)}
            />
          </Form.Item>
        </div>

        <div className="mt-6">
          <Button type="primary" size="large" onClick={() => caseForm.submit()}>
            Дуусгах
          </Button>
        </div>
      </Form>
    </div>
  );
}
