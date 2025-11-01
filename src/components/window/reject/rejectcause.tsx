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
    const response = await axios.get("/api/paper/reject/" + id);
    if (response.data.success) {
      mainForm.setFieldsValue({
        employee: response.data.data?.reject?.employee?.employee,
        description: response.data.data?.reject?.description,
      });
    }
  };
  useEffect(() => {
    detail(Number(documentid));
  }, [documentid]);
  return (
    <Modal
      open={checkout === 13}
      onCancel={handleCancel}
      title="Буцаасагдсан"
      onOk={handleCancel}
    >
      <Form form={mainForm}>
        <Form.Item name="employee">
          <Input readOnly/>
        </Form.Item>
        <Form.Item name="description">
          <Input.TextArea rows={10} maxLength={500} showCount readOnly />
        </Form.Item>
      </Form>
    </Modal>
  );
}
