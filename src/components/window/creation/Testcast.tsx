"use client";
import { Form, Input, Table, Button, Select, Flex } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import { useState } from "react";

export function TestCase() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState<any | null>(null);

  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      setData(sheetData);
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
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={[
                          {
                            label: "System testing",
                            value: "System testing",
                          },
                          {
                            label: "UI testing",
                            value: "UI testing",
                          },
                          {
                            label: "Integration testing",
                            value: "Integration testing",
                          },
                          {
                            label: "Unit testing + Integration testing",
                            value: "Unit testing + Integration testing",
                          },
                          {
                            label: "Acceptance Testing + System Testing",
                            value: "Acceptance Testing + System Testing",
                          },
                          {
                            label: "Smoke Testing",
                            value: "Smoke Testing",
                          },
                          {
                            label: "Performance Testing",
                            value: "Performance Testing",
                          },
                          {
                            label: "Security Testing",
                            value: "Security Testing",
                          },
                          {
                            label: "Regression Testing",
                            value: "Regression Testing",
                          },
                          {
                            label: "Load Testing",
                            value: "Load Testing",
                          },
                          {
                            label: "Stress Testing",
                            value: "Stress Testing",
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
                  title: "Тестийн төрөл",
                  dataIndex: "types",
                  key: "types",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "types"]}>
                      <Input.TextArea rows={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тест хийх алхамууд",
                  dataIndex: "steps",
                  key: "steps",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "steps"]}>
                      <Input.TextArea rows={1} />
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
            <Flex justify="space-between" style={{ marginTop: 10 }}>
              <Button type="primary" onChange={handleFileUpload}>
                Import
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  add({
                    category: "",
                    types: "",
                    steps: "",
                    result: "",
                    division: "",
                  })
                }
              >
                Мөр нэмэх
              </Button>
            </Flex>
          </section>
        )}
      </Form.List>
    </section>
  );
}
