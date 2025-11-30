"use client";
import { Form, Table, Input, Select, Button, DatePicker, Flex } from "antd";
import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { convertUtil, capitalizeFirstLetter } from "../../util/usable";
import { v4 as uuidv4 } from "uuid";
import type { FormInstance } from "antd/es/form";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import * as XLSX from "xlsx";
import ReactDragListView from "react-drag-listview";
import { MenuOutlined } from "@ant-design/icons";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function DepartmentEmployeeRole({ form }: { form: FormInstance }) {
  const [getEmployee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const fetchEmployees = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue,
      });

      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {}
  }, []);

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };
  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search]);

  return (
    <Form.List name="departmentemployee">
      {(fields, { add, remove }) => (
        <section>
          <Table
            rowKey="id"
            dataSource={fields}
            pagination={false}
            bordered
            columns={[
              {
                title: "Нэр",
                dataIndex: "name",
                key: "name",
                width: 300,
                render: (_, __, index) => (
                  <Form.Item
                    name={[index, "employeeId"]}
                    key={`employeeId-${index}`}
                  >
                    <Select
                      options={convertUtil(getEmployee)}
                      onSearch={(value) => {
                        setSearch(capitalizeFirstLetter(value));
                      }}
                      filterOption={false}
                      showSearch
                      onChange={async (value, option) => {
                        const selectedEmployee = await findEmployee(value);
                        if (selectedEmployee) {
                          form.setFieldsValue({
                            departmentemployee: {
                              [index]: {
                                employeeId: value,
                                department:
                                  selectedEmployee.jobPosition?.name || "",
                              },
                            },
                          });
                        }
                      }}
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Албан тушаал",
                dataIndex: "department",
                key: "department",
                width: 300,
                render: (_, __, index) => (
                  <Form.Item
                    name={[index, "department"]}
                    key={`department-${index}`}
                  >
                    <Input readOnly />
                  </Form.Item>
                ),
              },
              {
                title: "Үүрэг",
                dataIndex: "role",
                key: "role",
                width: 300,
                render: (_, __, index) => (
                  <Form.Item name={[index, "role"]} key={`role-${index}`}>
                    <Select
                      tokenSeparators={[","]}
                      options={[
                        {
                          value: "ACCESSER",
                          label: "Тестийн төсвийг хянан баталгаажуулах",
                        },
                        {
                          value: "VIEWER",
                          label: "Баримт бичгийг хянан баталгаажуулах",
                        },
                      ]}
                    />
                  </Form.Item>
                ),
              },
              {
                title: "Устгах",
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
              onClick={() =>
                add({
                  id: uuidv4(),
                  employeeId: "",
                  department: "",
                  role: "",
                })
              }
            >
              Мөр нэмэх
            </Button>
          </div>
        </section>
      )}
    </Form.List>
  );
}

export function TestSchedule({ form }: { form: FormInstance }) {
  const [getEmployee, setEmployee] = useState<any>([]);
  const [search, setSearch] = useState("");

  const handleSearch = (value: any) => {
    setSearch(capitalizeFirstLetter(value));
  };
  const fetchEmployees = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue,
      });
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (search) {
      fetchEmployees(search);
    } else {
      setEmployee([]);
    }
  }, [search, fetchEmployees]);
  return (
    <section>
      <div className="font-bold my-2 text-lg">
        3. Төслийн багийн бүрэлдэхүүн, тест хийх хуваарь
      </div>
      <Form.List name="testschedule">
        {(fields, { add, remove }) => (
          <section>
            <Table
              rowKey="id"
              dataSource={fields}
              pagination={false}
              bordered
              columns={[
                {
                  title: "Албан тушаал/Ажилтны нэр",
                  dataIndex: "employeeId",
                  key: "employeeId",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "employeeId"]}
                      key={`employeeId-${index}`}
                    >
                      <Select
                        options={convertUtil(getEmployee)}
                        onSearch={handleSearch}
                        filterOption={false}
                        showSearch
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Үүрэг",
                  dataIndex: "role",
                  key: "role",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "role"]} key={`role-${index}`}>
                      <Select
                        tokenSeparators={[","]}
                        options={[
                          {
                            value: "Хяналт тавих, Асуудал шийдвэрлэх",
                            label: "Хяналт тавих, Асуудал шийдвэрлэх",
                          },
                          {
                            value: "Техникийн нөхцөлөөр хангах",
                            label: "Техникийн нөхцөлөөр хангах",
                          },
                          {
                            value: "Төлөвлөгөө боловсруулах, Тест хийх",
                            label: "Төлөвлөгөө боловсруулах, Тест хийх",
                          },
                        ]}
                      />
                    </Form.Item>
                  ),
                },
                {
                  title: "Эхлэх хугацаа",
                  dataIndex: "startedDate",
                  key: "startedDate",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "startedDate"]}
                      key={`startedDate-${index}`}
                    >
                      <DatePicker defaultValue={dayjs()} format={dateFormat} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Дуусах хугацаа",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (_, __, index) => (
                    <Form.Item
                      name={[index, "endDate"]}
                      key={`endDate-${index}`}
                    >
                      <DatePicker defaultValue={dayjs()} format={dateFormat} />
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
                onClick={() => add({ id: uuidv4(), employeeId: "", role: "" })}
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

export function TestRisk({ form }: { form: FormInstance }) {
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

      form.setFieldsValue({ testrisk: dataWithKeys });
    };

    reader.readAsBinaryString(file);
  };
  return (
    <section>
      <li className="mb-2 mt-4">4.2 Эрсдэл</li>
      <Form.List name="testrisk">
        {(fields, { add, remove }) => (
          <section>
            <Table
              rowKey="id"
              dataSource={fields}
              pagination={false}
              bordered
              columns={[
                {
                  title: "Эрсдэл",
                  dataIndex: "riskDescription",
                  key: "riskDescription",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "riskDescription"]}>
                      <Input.TextArea rows={1} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Эрсдлийн магадлал",
                  dataIndex: "riskLevel",
                  key: "riskLevel",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "riskLevel"]}>
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={[
                          {
                            label: "HIGH",
                            value: "HIGH",
                          },
                          {
                            label: "MEDIUM",
                            value: "HIGH",
                          },
                          {
                            label: "LOW",
                            value: "HIGH",
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
                  title: "Эрсдлийн нөлөөлөл",
                  dataIndex: "affectionLevel",
                  key: "affectionLevel",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "affectionLevel"]}>
                      <Select
                        placeholder=""
                        style={{ width: "100%" }}
                        options={[
                          {
                            label: "HIGH",
                            value: 1,
                          },
                          {
                            label: "MEDIUM",
                            value: 2,
                          },
                          {
                            label: "LOW",
                            value: 3,
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
                  title: "Бууруулах арга зам",
                  dataIndex: "mitigationStrategy",
                  key: "mitigationStrategy",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "mitigationStrategy"]}>
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
            />
            <Flex style={{ marginTop: 10, marginBottom: 30 }}>
              <label
                htmlFor="testrisk"
                className="bg-blue-500 text-white p-3 cursor-pointer rounded-lg active:opacity-50 transition-opacity"
              >
                Хүснэгт оруулах
              </label>

              <Input
                id="testrisk"
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

      const cleanedData = sheetData.map((row: any) => {
        const newRow: any = {};
        Object.keys(row).forEach((key) => {
          newRow[key.trim()] = row[key];
        });
        return newRow;
      });

      const dataWithKeys = cleanedData.map((item: any, index: number) => ({
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

  useEffect(() => {
    const testBudgetData = form.getFieldValue("testbudget") || [];
    setTableData(testBudgetData);
  }, [form.getFieldValue("testbudget"), form]);

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
