"use client";

import { Modal, Input, Form } from "antd";
import { ZUSTAND } from "@/zustand";
import { useEffect } from "react";
import axios from "axios";

export function RejectCause() {
  const { documentid, getCheckout, checkout } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const [mainForm] = Form.useForm();

  const detail = async function name(id: number) {
    const response = await axios.get("/api/paper/" + id);
    if (response.data.success) {
      console.log(response.data.data);
      // mainForm.setFieldsValue({
      //   description: response.data.data.description,
      // });
    }
  };
  useEffect(() => {
    detail(Number(documentid));
  }, [documentid]);
  return (
    <Modal
      open={checkout === 13}
      onCancel={handleCancel}
      title="Буцаасан шалтгаан"
      onOk={handleCancel}
    >
      <Form form={mainForm}>
        <Form.Item name="description">
          <Input.TextArea rows={10} maxLength={500} showCount readOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
}
