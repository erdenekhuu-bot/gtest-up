"use client"

import { Button, Form, Input, Table, Flex, message } from "antd";
import type { FormProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {ReportTestError} from "@/components/window/report/ReportTestError";
import { convertName } from "@/util/usable";
import {UsedPhone} from "@/components/window/report/UsedPhone";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {FullUpdate, ReportUpdate} from "@/util/action";
import {ZUSTAND} from "@/zustand";
import {useSession} from "next-auth/react";

export function ShareMemberReport({data}:any){
    const [messageApi, contextHolder] = message.useMessage();
    const {documentid}=ZUSTAND()
    const {data:session}=useSession()
    const columns: ColumnsType = [
        {
            title: "Нэр",
            dataIndex: "employee",
            key: "employee",
            render: (employee: any) => convertName(employee),
        },
        {
            title: "Үүрэг",
            dataIndex: "role",
            key: "role",
            render: (role) => role,
        },
        {
            title: "Эхлэх хугацаа",
            dataIndex: "startedDate",
            key: "startedDate",
            render: (startedDate) =>
                new Date(startedDate).toLocaleString().split(" ")[0],
        },
        {
            title: "Дуусах хугацаа",
            dataIndex: "endDate",
            key: "endDate",
            render: (endDate) => new Date(endDate).toLocaleString().split(" ")[0],
        },
    ];
    const casecolumns: ColumnsType = [
        {
            title: "Ангилал",
            dataIndex: "category",
            key: "category",
            render: (category) => category,
        },
        {
            title: "Тестийн төрөл",
            dataIndex: "types",
            key: "types",
            render: (types) => types,
        },
        {
            title: "Тест хийх алхамууд",
            dataIndex: "steps",
            key: "steps",
            render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
        },
        {
            title: "Үр дүн",
            dataIndex: "result",
            key: "result",
            render: (result) => (
                <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
            ),
        },
        {
            title: "Хариуцах нэгж",
            dataIndex: "division",
            key: "division",
            render: (division) => (
                <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
            ),
        },
    ];

    const budgetcolumns: ColumnsType = [
        {
            title: "Ангилал",
            dataIndex: "productCategory",
            key: "productCategory",

        },
        {
            title: "Төрөл",
            dataIndex: "product",
            key: "product",

        },
        {
            title: "Тоо ширхэг",
            dataIndex: "amount",
            key: "amount",
            render: (amount:number) => amount.toLocaleString("de-DE"),
        },
        {
            title: "Нэгж үнэ (₮)",
            dataIndex: "priceUnit",
            key: "priceUnit",
        },
        {
            title: "Нийт үнэ (₮)",
            dataIndex: "priceTotal",
            key: "priceTotal",
            render: (priceTotal:number) => priceTotal.toLocaleString("de-DE"),
        },
    ]

    const reporttesterror = data?.issue.map((item: any) => ({
        key: uuidv4(),
        id: data.id,
        list: item.list,
        level: item.level,
        exception: item.exception,
        value: item.value
    }));

    const usedphone = data?.usedphone.map((item: any) => ({
        key: uuidv4(),
        id: data.id,
        type: item.type,
        phone: item.phone,
        description: item.description,
        serial: item.serial
    }));

    const [mainForm] = Form.useForm();
    const onFinish: FormProps["onFinish"] = async (values)=>{
        const usedphone=await (values.usedphone || []).map((item:any)=>{
            return {
                type: item.type,
                phone: item.phone,
                description:item.description,
                serial: item.serial,
            }
        })
        const reporttesterror=await (values.reporttesterror || []).map((item:any)=>{
            return {
                list:item.list,
                level:item.level,
                exception:item.exception,
                value: item.value
            }
        })
        const merge ={
            id: data.id,
            values,
            usedphone,
            reporttesterror,
            documentid,
            userid: session?.user.id
        }
        const update = await ReportUpdate(merge);
        if (update > 0) {
            messageApi.success("Амжилттай засагдсан");
        } else {
            messageApi.error("Алдаа гарлаа");
        }

    }
    useEffect(()=>{
        mainForm.setFieldsValue({
            reportname:data?.document.title,
            reportpurpose: data?.document.detail?.aim,
            reportprocessing: data?.reportprocessing,
            reportconclusion: data?.reportconclusion,
            reportadvice: data?.reportadvice,
            reporttesterror,
            usedphone
        })
    },[data])
    return (
        <Form className="p-6" form={mainForm} onFinish={onFinish}>
            {contextHolder}
            <div className="flex justify-between text-xl">
                <b>"ЖИМОБАЙЛ" ХХК</b>
            </div>
            <div className="mt-8">
                <Form.Item name="reportname">
                    <Input size="middle"  readOnly/>
                </Form.Item>
            </div>
            <b>ЗОРИЛГО</b>
            <div className="mt-4">
                <Form.Item name="reportpurpose">
                    <Input.TextArea rows={3} readOnly/>
                </Form.Item>
            </div>
            <div className="my-4">
                <p className="my-4 font-bold">
                    ТЕСТЭД БАГИЙН БҮРЭЛДЭХҮҮН, ТЕСТ ХИЙСЭН ХУВААРЬ
                </p>
                <Table
                    dataSource={data.document.documentemployee}
                    columns={columns}
                    pagination={false}
                    bordered
                />
            </div>
            <b>ТЕСТИЙН ЯВЦЫН ТОЙМ</b>
            <div className="mt-4">
                <Form.Item name="reportprocessing">
                    <Input.TextArea rows={5}/>
                </Form.Item>
            </div>
            <div>
                <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН АЛДААНЫ БҮРТГЭЛ</p>
                <ReportTestError form={mainForm}/>
            </div>
            <div>
                <p className="my-4 font-bold">ТЕСТИЙН ҮЕИЙН ТӨСӨВ</p>
                <Table
                    dataSource={data.document?.budget}
                    columns={budgetcolumns}
                    pagination={false}
                    summary={() => {
                        const result = data.document?.budget || [];
                        const total = result.reduce((sum: any, row: any) => {
                            const numericValue = Number(
                                String(row.priceTotal).replace(/\./g, "")
                            );
                            return sum + (isNaN(numericValue) ? 0 : numericValue);
                        }, 0);

                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={4} align="right">
                                    Нийт
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4}>
                                    {total.toLocaleString("de-DE")}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={5} />
                            </Table.Summary.Row>
                        );
                    }}
                    bordered
                />
            </div>
            <div className="mt-8">
                <p className="my-4 font-bold">ТЕСТИЙН ДҮГНЭЛТ</p>
                <Form.Item name="reportconclusion">
                    <Input.TextArea rows={5}/>
                </Form.Item>
            </div>
            <b>ЗӨВЛӨГӨӨ</b>
            <div className="mt-8">
                <Form.Item name="reportadvice">
                    <Input.TextArea rows={5}/>
                </Form.Item>
            </div>
            <Table
                dataSource={data.document?.testcase}
                columns={casecolumns}
                pagination={false}
                bordered
            />
            <p className="mt-8 mb-4 font-bold text-lg">Ашигласан дугаарууд</p>
            <UsedPhone form={mainForm}/>
            <Flex justify="center" gap={20} style={{ marginTop: 40 }}>
                <Button size="large" type="primary" onClick={() => mainForm.submit()}>
                    Засаад хадгалах
                </Button>
            </Flex>
        </Form>
    )
}