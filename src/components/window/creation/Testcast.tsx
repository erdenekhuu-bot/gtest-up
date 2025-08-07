"use client";
import { Form, Input, Table, Button, Select, Flex } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";

export function TestCase({ form }: { form: FormInstance }) {
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
      form.setFieldsValue({ testcase: dataWithKeys });
    };

    reader.readAsBinaryString(file);
  };
  return (
    <section>
      <Form.List name="testcase">
        {(fields, { add, remove }) => (
          <section>
            <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
            <Table
              rowKey="id"
              dataSource={fields}
              pagination={false}
              columns={[
                {
                  title: "Ангилал",
                  dataIndex: "category",
                  key: "category",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "category"]}>
                      <Input.TextArea />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тестийн төрөл",
                  dataIndex: "types",
                  key: "types",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "types"]}>
                      <Input.TextArea />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тест хийх алхамууд",
                  dataIndex: "steps",
                  key: "steps",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "steps"]}>
                      <Input.TextArea />
                    </Form.Item>
                  ),
                },
                {
                  title: "Үр дүн",
                  dataIndex: "result",
                  key: "result",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "result"]}>
                      <Input.TextArea rows={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Хариуцах нэгж",
                  dataIndex: "division",
                  key: "division",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "division"]}>
                      <Input.TextArea rows={1} />
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
            <Flex style={{ marginTop: 10 }}>
              <Input type="file" onChange={handleFileUpload} />
            </Flex>
          </section>
        )}
      </Form.List>
    </section>
  );
}
