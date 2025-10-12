"use client"
import { Button, Modal, Form, Select, message } from "antd";
import type { FormProps } from "antd";
import { ZUSTAND } from "@/zustand";
import { useState, useEffect,useCallback } from "react";
import axios from "axios";
import { convertAdmin } from "@/util/usable";
import { ChangeStatus } from "@/util/action";
import { v4 as uuidv4 } from "uuid";

export function AdminWindow(){
    const {checkout, getCheckout, employeeId} = ZUSTAND()
    const [department, setDepartment]=useState<any>([])
    const [jobposition, setJobposition]=useState<any>([])
    const [mainForm] = Form.useForm();
    const [search, setSearch] = useState("");
    const [finddepartment, setFindingDepartment]=useState("")
    const [messageApi, contextHolder] = message.useMessage();

    const handleCancel = () => {
      getCheckout(-1);
    };

    const fetchJobposition = useCallback(async (searchValue: string) => {
      const response = await axios.get('/api/admin/jobposition?search='+searchValue);
        if (response.data.success) {
          setJobposition(response.data.data);
        }
    }, []);

    const fetchDepartment = useCallback(async (searchValue: string) => {
      const response = await axios.get('/api/admin/department?search='+searchValue);
        if (response.data.success) {
          setDepartment(response.data.data);
        }
    }, []);

    const employee = useCallback(async (id:number)=>{
      const response = await axios.get('/api/admin/'+id);
        if (response.data.success) {
           mainForm.setFieldsValue({
              jobposition: response.data.data.jobPosition.name,
              department: response.data.data.department.name
           })
        }
    },[])

    const handleSearch = (value: any) => {
        setSearch(value);
    };

    const searchDep = (value:any)=>{
      setFindingDepartment(value)
    }

    const onFinish: FormProps["onFinish"] = async (values) => {
      const merged = {
        ...values,
        employeeId
      }
      console.log(merged)
      const response = await ChangeStatus(merged)
      if (response > 0) {
          messageApi.success("Амжилттай хадгалагдлаа!");
      } else {
          messageApi.error("Амжилтгүй боллоо.");
      }
    }


    useEffect(() => {
      search ? fetchJobposition(search) : setJobposition([]);
      finddepartment ? fetchDepartment(finddepartment) : setDepartment([]);
    }, [search, fetchJobposition, finddepartment, fetchDepartment]);

    useEffect(()=>{
      employee(employeeId)
    },[employeeId])
  
    return (
    <Modal
        title=""
        open={checkout === 15}
        onOk={onFinish}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Болих
          </Button>,
          <Button key="next" type="primary" onClick={() => mainForm.submit()}>
            Цааш
          </Button>,
        ]}
      >
        <Form form={mainForm} onFinish={onFinish}>
            <div>
              <p>Албан тушаал</p>
              <Form.Item name="jobposition">
                <Select options={convertAdmin(jobposition)} onSearch={handleSearch} filterOption={false} showSearch/>
              </Form.Item>
             </div>
             <div>
             <p>Харъяалагдах газар</p>
              <Form.Item name="department">
                <Select options={convertAdmin(department)} onSearch={searchDep} filterOption={false} showSearch/>
              </Form.Item>
             </div>
        </Form>
      </Modal>)
}