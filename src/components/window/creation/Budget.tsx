"use client";
import { Form, Input, Table, Button } from "antd";
import Image from "next/image";

export function TestBudget() {
  return (
    <section>
      <div className="font-bold my-2 text-lg mx-4">
        7. Тестийн төсөв /Тестийн орчин/
      </div>
      <Form.List name="testbudget">
        {(fields, { add, remove }) => (
          <section>
            <Table
              rowKey="id"
              dataSource={fields}
              pagination={false}
              columns={[
                {
                  title: "Ангилал",
                  dataIndex: "productCategory",
                  key: "productCategory",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "productCategory"]}>
                      <Input.TextArea rows={1} style={{ resize: "none" }} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Төрөл",
                  dataIndex: "product",
                  key: "product",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "product"]}>
                      <Input.TextArea rows={1} style={{ resize: "none" }} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тоо ширхэг",
                  dataIndex: "amount",
                  key: "amount",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "amount"]}>
                      <Input placeholder="" type="number" />
                    </Form.Item>
                  ),
                },
                {
                  title: "Нэгж үнэ (₮)",
                  dataIndex: "priceUnit",
                  key: "priceUnit",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "priceUnit"]}>
                      <Input placeholder="" type="number" />
                    </Form.Item>
                  ),
                },
                {
                  title: "Нийт үнэ (₮)",
                  dataIndex: "priceTotal",
                  key: "priceTotal",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "priceTotal"]}>
                      <Input placeholder="" type="number" />
                    </Form.Item>
                  ),
                },
                {
                  title: "",
                  key: "id",
                  render: (_, __, index) => (
                    <Image
                      src="/trash.svg"
                      alt=""
                      className="hover:cursor-pointer"
                      width={20}
                      height={20}
                      onClick={() => remove(index)}
                    />
                  ),
                },
              ]}
              bordered
            />
            <div className="text-end mt-4">
              <Button
                type="primary"
                onClick={() =>
                  add({
                    productCategory: "",
                    product: "",
                    amount: 0,
                    priceUnit: 0,
                    priceTotal: 0,
                  })
                }
              >
                Мөр нэмэх
              </Button>
            </div>
          </section>
        )}
      </Form.List>
    </section>
  );
}
