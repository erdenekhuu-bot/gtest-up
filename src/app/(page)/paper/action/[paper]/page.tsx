"use client";
import { useParams, redirect } from "next/navigation";
import { Breadcrumb, Table, Form, Button, Flex } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ZUSTAND } from "@/zustand";

export default function Page() {
  const params = useParams();
  const { data: session } = useSession();
  const [tableData, setTableData] = useState<any[]>([]);
  const [caseForm] = Form.useForm();
  const router = useRouter();
  const { getEmployeeId, getDocumentId,confirmpaperid } = ZUSTAND();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const detail = async ({ id }: { id: number }) => {
    const request = await axios.post(`/api/document/confirm/detail`, {
      id,
      userid: session?.user.id,
    });

    if (request.data.success) {
      getDocumentId(request.data.data.id);
      getEmployeeId(request.data.data?.confirm[0]?.sub[0]?.employeeId);
      const updatedData = request.data.data?.confirm
        ?.flatMap((c: any) => c.sub || [])
        .map((sub: any) => ({
          key: uuidv4(),
          id: sub.id,
          system: sub.system,
          jobs: sub.jobs,
          module: sub.module,
          version: sub.version,
          description: sub.description,
        }));
      setTableData(updatedData);

      caseForm.setFieldsValue({
        startedDate: dayjs(request.data.data.confirm[0]?.startedDate) || "",
        title: request.data.data.confirm[0]?.title || "",
      });
    }
  };

  useEffect(() => {
    params.paper && detail({ id: Number(params.paper) });
  }, [params.paper]);

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  return (
    <section>
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => redirect("/paper")}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
          },
          {
            title: "Баталгаажуулах жагсаалт",
          },
        ]}
      />
   
      <Flex justify="end" style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={() =>
            router.push("/paper/action/edit/" + confirmpaperid)
          }
        >
          Төлөвлөгөө үүсгэх
        </Button>
      </Flex>

      <Table
        dataSource={tableData}
        bordered
        rowKey="key"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: tableData.length,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        columns={[
          { title: "Систем нэр", dataIndex: "system" },
          { title: "Хийгдсэн ажлууд", dataIndex: "jobs" },
          { title: "Модул", dataIndex: "module" },
          { title: "Хувилбар", dataIndex: "version" },
          { title: "Тайлбар", dataIndex: "description" },
          {
            title: "Засвар",
            dataIndex: "id",
            render: (id: number) => (
              <Button
                type="primary"
                onClick={() => router.push("/paper/action/edit/" + id)}
              >
                Засах
              </Button>
            ),
          },
          {
            title: "Устгах",
            dataIndex: "id",
            render: (id: number) => (
              <Image
                src="/trash.svg"
                alt=""
                width={20}
                height={20}
                onClick={async () => {
                  await axios.delete("/api/document/confirm/detail", {
                    data: { id },
                  });
                  detail({ id: Number(params.paper) });
                }}
                className="hover:cursor-pointer"
              />
            ),
          },
        ]}
      />
    </section>
  );
}
