"use client";
import { Form, Table, Button, Select, DatePicker } from "antd";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";
import { capitalizeFirstLetter, convertUtil } from "@/util/usable";
import axios from "axios";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY/MM/DD";

export function TestSchedule() {
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
                    <Form.Item name={[index, "employeeId"]}>
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
                    <Form.Item
                      name={[index, "role"]}
                      rules={[
                        { required: true, message: "Тестийн нэр бичнэ үү" },
                      ]}
                    >
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
                    <Form.Item name={[index, "startedDate"]}>
                      <DatePicker defaultValue={dayjs()} format={dateFormat} />
                    </Form.Item>
                  ),
                },
                {
                  title: "Дуусах хугацаа",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (_, __, index) => (
                    <Form.Item name={[index, "endDate"]}>
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
                onClick={() => add({ employeeId: "", role: "" })}
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
