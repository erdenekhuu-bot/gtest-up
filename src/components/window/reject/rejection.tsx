"use client";
import { Modal, Input, Form, Button, message } from "antd";
import { ZUSTAND } from "@/zustand";
import type { FormProps } from "antd";
import { RejectAction } from "@/util/action";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

export function Rejection() {
  const { data: session } = useSession();
  const { documentid, getCheckout, checkout, checkcountdoc } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const [mainForm] = Form.useForm();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const userid=Number(session?.user.id)
    const merge = { values, documentid,userid };
    
    const result = await RejectAction(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      checkcountdoc(Number(session?.user.id));
      getCheckout(-1);
      redirect("/teamplan");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  return (
    <Modal
      open={checkout === 12}
      onCancel={handleCancel}
      title="Буцаасан шалтгаан"
      onOk={onFinish}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Цааш
        </Button>,
      ]}
    >
      {contextHolder}
      <Form onFinish={onFinish} form={mainForm}>
        <Form.Item name="description">
          <Input.TextArea rows={10} maxLength={500} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
}
