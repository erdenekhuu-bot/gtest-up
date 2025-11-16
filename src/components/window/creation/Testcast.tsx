"use client";
import { Form, Input, Table, Flex, Select } from "antd";
import ReactDragListView from "react-drag-listview";
import { MenuOutlined } from "@ant-design/icons";
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
  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex) return;
      const current = form.getFieldValue("testcase") || [];

      const newData = [...current];
      const item = newData.splice(fromIndex, 1)[0];
      newData.splice(toIndex, 0, item);
      form.setFieldsValue({ testcase: newData });
    },
    handleSelector: ".drag-handle",
    nodeSelector: "tr.ant-table-row",
  };

  return (
    <section>
      <Form.List name="testcase">
        {(fields, { add, remove }) => (
          <section>
            <ReactDragListView {...dragProps}>
              <Table
                rowKey="id"
                dataSource={fields}
                pagination={false}
                columns={[
                  {
                    title: "",
                    dataIndex: "drag",
                    width: 40,
                    render: () => (
                      <MenuOutlined
                        className="drag-handle"
                        style={{ cursor: "grab", color: "#999" }}
                      />
                    ),
                  },
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
            </ReactDragListView>
            <Flex style={{ marginTop: 10, marginBottom: 30 }}>
              <label
                htmlFor="case"
                className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
              >
                Хүснэгт оруулах
              </label>

              <Input id="case" type="file" hidden onChange={handleFileUpload} />
            </Flex>
          </section>
        )}
      </Form.List>
    </section>
  );
}
