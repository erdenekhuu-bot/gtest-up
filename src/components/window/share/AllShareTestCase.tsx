"use client";
import React, {useState} from "react";
import {Table, message} from "antd";
import {useSearchParams, usePathname, useRouter} from "next/navigation";
import {formatHumanReadable} from "@/util/usable";
import {ReportCard} from "@/components/window/report/ReportCard";
import {ShareReportWindow} from "@/components/window/sharereportwindow";

export function AllShareTestCase({data, total, page, pageSize}: any) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace} = useRouter();
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(
        null
    );

    const generateSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
            params.set("page", "1");
        } else {
            params.delete("search");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleTableChange = (pagination: any) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pagination.current.toString());
        params.set("pageSize", pagination.pageSize.toString());
        replace(`${pathname}?${params.toString()}`);
    };
    const columns = [
        {
            title: "Тоот",
            dataIndex: "generate",
            render: (generate: any, record: any) => {
                return (
                    <div
                        className="hover:cursor-pointer"
                        onClick={() => {

                            setSelectedDocumentId(record.document.id);
                        }}
                    >
                        {record.document.generate}
                    </div>
                );
            },
        },
        {title: "Тестийн нэр", dataIndex: "document", render: (record: any) => record.title},
        {
            title: "Огноо",
            dataIndex: "timeCreated",
            sorter: (a: any, b: any) => {
                return (
                    new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime()
                );
            },
            render: (timeCreated: string, record:any) => {
                return formatHumanReadable(new Date(record.document.timeCreated).toISOString());
            },
        }

    ];
    return (
        <section>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: total,
                }}
                onChange={handleTableChange}
            />
            {contextHolder}
            {selectedDocumentId && <ReportCard documentId={selectedDocumentId}/>}
            <ShareReportWindow/>
        </section>
    );
}
