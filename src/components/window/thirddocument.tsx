"use client";
import { Modal, Form, Button, message } from "antd";
import { ZUSTAND } from "@/zustand";
import type { FormProps } from "antd";
import { TestCase } from "./creation/Testcast";
import { ThirdAction } from "@/util/action";

export function ThirdDocument() {
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const onFinish: FormProps["onFinish"] = async (values) => {
    const merge = {
      documentid,
      ...values,
    };
    const result = await ThirdAction(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      getCheckout(-1);
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
  const [mainForm] = Form.useForm();
  return (
    <Modal
      open={checkout === 3}
      onOk={onFinish}
      onCancel={handleCancel}
      title="ЖИМОБАЙЛ ХХК"
      width={800}
      className="scrollbar select-none"
      style={{ overflowY: "auto", maxHeight: "800px" }}
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
      <Form form={mainForm} onFinish={onFinish}>
        <TestCase />
      </Form>
    </Modal>
  );
}
