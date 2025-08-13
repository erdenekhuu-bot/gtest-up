"use client";
import { Modal, Form, Button, message, Table, Select } from "antd";
import { ZUSTAND } from "@/zustand";
import type { FormProps } from "antd";
import Image from "next/image";
import { convertUtil, capitalizeFirstLetter } from "@/util/usable";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { ShareGR } from "@/util/action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ShareWindow() {
  const [mainForm] = Form.useForm();
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const router = useRouter();
  const { data: session } = useSession();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const sharegroup = values.sharegroup.map((item: any) => {
      return {
        employeeId: item.employeeId,
        documentId: documentid,
      };
    });
    const merge = {
      authuser: Number(session?.user.id),
      documentid,
      share: 4,
      sharegroup,
    };

    const result = await ShareGR(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хуваалцлаа!");
      getCheckout(-1);
      router.refresh();
      // for (const share of values.sharegroup) {
      //   await axios.put("/api/otp/share", { employeeId: share.employeeId });
      // }
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  const [messageApi, contextHolder] = message.useMessage();
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

  const findEmployee = async (id: number) => {
    try {
      const response = await axios.get("/api/employee/" + id);
      return response.data.data;
    } catch (error) {}
  };

  useEffect(() => {
    search ? fetchEmployees(search) : setEmployee([]);
  }, [search, fetchEmployees]);

  return (
    <Modal
      open={checkout === 4}
      onOk={onFinish}
      onCancel={handleCancel}
      title="ЖИМОБАЙЛ ХХК"
      className="scrollbar select-none"
      style={{ overflowY: "auto", maxHeight: "800px" }}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Цааш
        </Button>,
      ]}
    >
      {contextHolder}
      <Form form={mainForm} onFinish={onFinish}>
        <Form.List name="sharegroup">
          {(fields, { add, remove }) => (
            <section>
              <Table
                rowKey="id"
                dataSource={fields}
                pagination={false}
                columns={[
                  {
                    title: "Нэр",
                    dataIndex: "name",
                    key: "name",
                    width: 400,
                    render: (_, __, index) => (
                      <Form.Item name={[index, "employeeId"]}>
                        <Select
                          style={{ width: "100%" }}
                          options={convertUtil(getEmployee)}
                          onSearch={handleSearch}
                          filterOption={false}
                          showSearch
                          onChange={async (value, option) => {
                            const selectedEmployee = await findEmployee(value);
                            if (selectedEmployee) {
                              mainForm.setFieldsValue({
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
                  onClick={() =>
                    add({
                      employeeId: "",
                    })
                  }
                >
                  Мөр нэмэх
                </Button>
              </div>
            </section>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
