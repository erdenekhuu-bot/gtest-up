"use client";
import { Form, Input, Table, Button, Select } from "antd";
import Image from "next/image";

export function Addition() {
  return (
    <Form.List name="attribute">
      {(fields, { add, remove }) => (
        <section>
          <Table
            rowKey="id"
            dataSource={fields}
            pagination={false}
            bordered
            columns={[
              {
                title: "Ангилал",
                dataIndex: "category",
                key: "category",
                width: 300,
                render: (_, __, index) => (
                  <Form.Item
                    name={[index, "category"]}
                    rules={[
                      { required: true, message: "Тестийн нэр бичнэ үү" },
                    ]}
                  >
                    <Select
                      placeholder=""
                      style={{ width: "100%" }}
                      options={[
                        {
                          label: "Түтгэлзүүлэх",
                          value: "Түтгэлзүүлэр",
                        },
                        {
                          label: "Дахин эхлүүлэх",
                          value: "Дахин эхлүүлэх",
                        },
                      ]}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Шалгуур",
                dataIndex: "category",
                key: "value",
                render: (_, __, index) => (
                  <Form.Item
                    name={[index, "value"]}
                    rules={[
                      { required: true, message: "Тестийн нэр бичнэ үү" },
                    ]}
                  >
                    <Input.TextArea rows={3} />
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
          />
          <div className="text-end mt-4">
            <Button
              type="primary"
              onClick={() => add({ category: "", types: "" })}
            >
              Мөр нэмэх
            </Button>
          </div>
        </section>
      )}
    </Form.List>
  );
}
