"use client"
import { Table, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const param=useParams()
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { getCaseId } = ZUSTAND();
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchDetail = async (id: number, page: number, pageSize: number) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/testcase/`, {
        params: {
          page,
          pageSize,
          id
        },
      });
      if (request.data.success) {
        const dataWithKeys = request.data.data.map((item: any) => ({
          ...item,
          key: item.id,
        }));
        setData(dataWithKeys);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: request.data.total,
        });
      }
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    fetchDetail(Number(param.id), pagination.current, pagination.pageSize);
  }, [Number(param.id), pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination: any) => {
    setPagination({
      ...pagination,

      pageSize: pagination.pageSize || 10,
    });
  };

  return (
    <section className="mt-8">
     
      <Table
        columns={[
          {
            title: "Кейсүүд",
            dataIndex: "types",
          },
          {
            title: "Төлөв",
            dataIndex: "testType",
            render: (state: string) => {
              return (
                <Badge variant={state === "CREATED" ? "secondary" : "info"}>
                  {state === "CREATED" ? "Эхэлсэн" : "Дууссан"}
                </Badge>
              );
            },
          },
          {
            title: "Үйлдэл",
            dataIndex: "id",
            render: (id: number) => (
              <Button
                type="primary"
                onClick={() => {
                  getCaseId(id);
                  router.push(`/testcase/edit/${id}`);
                }}
              >
                Оруулах
              </Button>
            ),
          },
        ]}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) =>
            handleTableChange({ current: page, pageSize }),
        }}
        bordered
      />
    </section>
  );
}