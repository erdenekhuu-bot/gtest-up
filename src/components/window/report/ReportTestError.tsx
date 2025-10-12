"use client";
import { Form, Input, Table, Flex, Select } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";


export function ReportTestError({ form }: { form: FormInstance }) {
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
        form.setFieldsValue({ reporttesterror: dataWithKeys });
      };
  
      reader.readAsBinaryString(file);
    };

  return (
    <Form.List name="reporttesterror">
      {(fields, {add,remove})=>(
        <section>
          <Table
           rowKey="id"
           dataSource={fields}
           pagination={false}
           bordered
           columns={[
              {
                title: "Алдааны жагсаалт",
                dataIndex: "list",
                key: "list",
                render: (_, __, index) => (
                  <Form.Item name={[index, "list"]}>
                    <Input.TextArea rows={1} />
                  </Form.Item>
                ),
              },
              {
                title: "Алдааны түвшин",
                dataIndex: "level",
                key: "level",
                render: (_, __, index) => (
                  <Form.Item name={[index, "level"]}>
                    <Select
                      options={[
                        {
                          label: "HIGH",
                          value: "HIGH",
                        },
                        {
                          label: "MEDIUM",
                          value: "MEDIUM",
                        },
                        {
                          label: "LOW",
                          value: "LOW",
                        },
                      ]}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Алдаа гарсан эсэх",
                dataIndex: "exception",
                key: "exception",
                render: (_, __, index) => (
                  <Form.Item name={[index, "exception"]}>
                    <Select
                      options={[
                        {
                          label: "Гараагүй",
                          value: false,
                        },
                        {
                          label: "Гарсан",
                          value: true,
                        },
                      ]}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Шийдвэрлэсэн эсэх",
                dataIndex: "value",
                key: "value",
                render: (_, __, index) => (
                  <Form.Item name={[index,"value"]}>
                    <Input.TextArea rows={1}/>
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
                htmlFor="reporttesterror"
                className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
              >
                Хүснэгт оруулах
              </label>

              <Input
                id="reporttesterror"
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
