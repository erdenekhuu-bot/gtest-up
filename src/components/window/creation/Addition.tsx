"use client";
import { Form, Input, Table, Flex, Select } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";

export function Addition({ form }: { form: FormInstance }) {
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      const dataWithKeys = sheetData.map((item: any, index: number) => ({
        ...item,
        id: index.toString(),
      }));
      form.setFieldsValue({ attribute: dataWithKeys });
    };

    reader.readAsBinaryString(file);
  };
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
                  <Form.Item name={[index, "category"]}>
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
                  <Form.Item name={[index, "value"]}>
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

          <Flex style={{ marginTop: 10, marginBottom: 30 }}>
            <label
              htmlFor="addition"
              className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
            >
              Хүснэгт оруулах
            </label>

            <Input
              id="addition"
              type="file"
              hidden
              onChange={handleFileUpload}
            />
          </Flex>
        </section>
      )}
    </Form.List>
  );
}
