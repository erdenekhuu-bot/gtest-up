"use client";
import {
  Button,
  Modal,
  Form,
  Select,
  message,
  Checkbox,
  Row,
  Col,
  Typography,
  Divider,
  Space,
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
  { label: "Үзэх", value: "VIEW" },
  { label: "Унших", value: "READ" },
  { label: "Засах", value: "EDIT"}
];



export function AdminWindow() {
  const { checkout, getCheckout, employeeId } = ZUSTAND();
  const [department, setDepartment] = useState([]);
  const [jobposition, setJobposition] = useState([]);
  const [mainForm] = Form.useForm();
  const [search, setSearch] = useState<string>("");
  const [finddepartment, setFindingDepartment] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const modalTitle =
    employeeId > 0 ? "Ажилтны Мэдээлэл Засах" : "Шинэ Ажилтан Нэмэх";

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
      if (id <= 0) {
        mainForm.resetFields();
        return;
      }

      try {
        const response = await axios.get("/api/admin/" + id);
        if (response.data?.success) {
          const data = response.data.data;
          mainForm.setFieldsValue({
            jobposition: data.jobPosition?.name,
            department: data.department?.name,
            permissions: data.permissions || [],
            isAdmin: data.isAdmin || false,
          });
        } else if (response.data && !response.data.success) {
          messageApi.warning(`Ажилтан (${id})-ийн мэдээлэл олдсонгүй.`);
        }
      } catch (error) {
        console.error(error);
        messageApi.error("Ажилтан мэдээллийг татаж чадсангүй.");
      }
    },
    [mainForm, messageApi]
  );

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const searchDep = (value: string) => {
    setFindingDepartment(value);
  };

  const onFinish: FormProps["onFinish"] = async (values) => {
    const merged = {
      ...values,
      employeeId,
    };
    console.log(merged);

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
            {modalTitle}
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
            onSearch={searchDep}
            filterOption={false}
            showSearch
            placeholder="Газар/хэлтэс сонгох..."
          />
        </Form.Item>

        <Form.Item
          name="admin"
          valuePropName="checked"
          style={{ marginBottom: 24 }}
        >
          <Checkbox>
            <span
              style={{ fontWeight: 600, color: "#1850f5", fontSize: "1.05em" }}
            >
              Админ Эрх Олгох
            </span>
          </Checkbox>
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500 }}>Бусад Нэмэлт Эрхүүд</span>}
          name="permissions"
          valuePropName="value"
        >
          <Checkbox.Group style={{ width: "100%" }}>
            <Row gutter={[16, 8]}>
              {PERMISSIONS_OPTIONS.map((p) => (
                <Col span={24} key={p.value}>
                  <Checkbox value={p.value} style={{ padding: "4px 0" }}>
                    {p.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
}
