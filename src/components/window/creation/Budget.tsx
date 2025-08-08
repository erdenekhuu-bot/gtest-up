"use client";
import { Form, Input, Table, Flex } from "antd";
import Image from "next/image";
import * as XLSX from "xlsx";
import type { FormInstance } from "antd/es/form";
import { useState } from "react";

export function TestBudget({ form }: { form: FormInstance }) {
  const [tableData, setTableData] = useState<any[]>([]);
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(sheet);

      const dataWithKeys = sheetData.map((item: any, index: number) => ({
        productCategory: item.productCategory,
        product: item.product,
        amount: item.amount.toLocaleString("de-DE"),
        priceUnit: item.priceUnit,
        priceTotal: item.priceTotal.toLocaleString("de-DE"),
        id: index.toString(),
      }));

      form.setFieldsValue({ testbudget: dataWithKeys });
      setTableData(dataWithKeys);
    };

    reader.readAsBinaryString(file);
  };

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
                      <Input.TextArea rows={1} readOnly />
                    </Form.Item>
                  ),
                },
                {
                  title: "Төрөл",
                  dataIndex: "product",
                  key: "product",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "product"]}>
                      <Input.TextArea rows={1} readOnly />
                    </Form.Item>
                  ),
                },
                {
                  title: "Тоо ширхэг",
                  dataIndex: "amount",
                  key: "amount",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "amount"]}>
                      <Input placeholder="" type="number" readOnly />
                    </Form.Item>
                  ),
                },
                {
                  title: "Нэгж үнэ (₮)",
                  dataIndex: "priceUnit",
                  key: "priceUnit",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "priceUnit"]}>
                      <Input placeholder="" type="number" readOnly />
                    </Form.Item>
                  ),
                },
                {
                  title: "Нийт үнэ (₮)",
                  dataIndex: "priceTotal",
                  key: "priceTotal",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "priceTotal"]}>
                      <Input placeholder="" readOnly />
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
              summary={() => {
                const total = tableData.reduce((sum, row) => {
                  const numericValue = Number(
                    String(row.priceTotal).replace(/\./g, "")
                  );
                  return sum + numericValue;
                }, 0);

                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      Нийт
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      {total.toLocaleString("de-DE")}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
              bordered
            />
            <Flex style={{ marginTop: 10, marginBottom: 30 }}>
              <label
                htmlFor="budget"
                className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
              >
                Хүснэгт оруулах
              </label>

              <Input
                id="budget"
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </Flex>
          </section>
        )}
      </Form.List>
    </section>
  );
}
