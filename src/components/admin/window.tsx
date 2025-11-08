"use client";
import {
  Button,
  Modal,
  Form,
  Select,
  message,
  Typography,
  Divider,
  Space,
  Radio,
} from "antd";
import type { FormProps } from "antd";
import { ZUSTAND } from "@/zustand";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { convertAdmin } from "@/util/usable";
import { ChangeStatus } from "@/util/action";
import {
  UserSwitchOutlined,
  SolutionOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
const { Title } = Typography;

const PERMISSIONS_OPTIONS = [
  { label: "Бүгд", value: "ADMIN" },
  { label: "Унших", value: "VIEWER" },
  { label: "Засах", value: "DEV" },
];

export function AdminWindow() {
  const { checkout, getCheckout, employeeId } = ZUSTAND();
  const [department, setDepartment] = useState([]);
  const [jobposition, setJobposition] = useState([]);
  const [mainForm] = Form.useForm();
  const [search, setSearch] = useState("");
  const [finddepartment, setFindingDepartment] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleCancel = () => {
    getCheckout(-1);
    mainForm.resetFields();
  };

  const fetchJobposition = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.get(
        "/api/admin/jobposition?search=" + searchValue
      );
      if (response.data?.success) {
        setJobposition(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchDepartment = useCallback(async (searchValue: string) => {
    try {
      const response = await axios.get(
        "/api/admin/department?search=" + searchValue
      );
      if (response.data?.success) {
        setDepartment(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const employee = useCallback(
    async (id: number) => {
      try {
        const response = await axios.get("/api/admin/" + id);
        if (response.data?.success) {
          const data = response.data.data;
          mainForm.setFieldsValue({
            jobposition: data.jobPosition?.name,
            department: data.department?.name,
            super: data.super,
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [mainForm, messageApi]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    const merged = {
      ...values,
      employeeId,
    };

    const response = await ChangeStatus(merged);
    if (response > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      getCheckout(-1);
    } else {
      messageApi.error("Хадгалах үйлдэл амжилтгүй боллоо.");
    }
  };

  useEffect(() => {
    search ? fetchJobposition(search) : setJobposition([]);
    finddepartment ? fetchDepartment(finddepartment) : setDepartment([]);
  }, [search, fetchJobposition, finddepartment, fetchDepartment]);

  useEffect(() => {
    if (checkout === 15) {
      employee(employeeId);
    }
  }, [employeeId, employee, checkout]);

  return (
    <Modal
      title={
        <Space>
          <UserSwitchOutlined style={{ color: "#1890ff" }} />
          <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
            Ажилтны Мэдээлэл Засах
          </Title>
        </Space>
      }
      open={checkout === 15}
      onCancel={handleCancel}
      width={500}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Хадгалах
        </Button>,
      ]}
    >
      {contextHolder}
      <Divider style={{ margin: "16px 0" }} />
      <Form form={mainForm} onFinish={onFinish} layout="vertical">
        <Form.Item
          label={
            <Space size={4}>
              <SolutionOutlined style={{ color: "#595959" }} />
              <span>Албан тушаал</span>
            </Space>
          }
          name="jobposition"
        >
          <Select
            options={convertAdmin(jobposition)}
            onSearch={handleSearch}
            filterOption={false}
            showSearch
            placeholder="Албан тушаал сонгох..."
          />
        </Form.Item>

        <Form.Item
          label={
            <Space size={4}>
              <EnvironmentOutlined style={{ color: "#595959" }} />
              <span>Харъяалагдах газар</span>
            </Space>
          }
          name="department"
        >
          <Select
            options={convertAdmin(department)}
            filterOption={false}
            showSearch
            placeholder="Газар/хэлтэс сонгох..."
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Эрх</span>}
          name="super"
        >
          <Radio.Group>
            {PERMISSIONS_OPTIONS.map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
