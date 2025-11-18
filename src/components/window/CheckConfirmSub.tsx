"use client";
import axios from "axios";
import { Breadcrumb, Table, Form, Button, Flex, Modal } from "antd";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";
import { ZUSTAND } from "@/zustand";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DeleteConfirmSub, UpdateConfirmPaper } from "../../util/action";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { convertName } from "../../util/usable";

export function CheckConfirmSub() {
  const router = useRouter();
  const { data: session } = useSession();
  const isAdmin = session?.user.employee.super === "REPORT";
  const [checking, setChecking] = useState(false);
  const { getCheckout, checkout, getDocumentId, confirmId, takeConfirmId } =
    ZUSTAND();
  const handleCancel = () => {
    getCheckout(-1);
  };
  console.log(confirmId);
  const [data, setData] = useState<any[]>([]);

  const detail = async (id: number) => {
    const response = await axios.get(
      "/api/document/confirm/detail/onlypaper/" + id
    );
    if (response.data.success) {
      setData(response.data.data.sub);
      setChecking(response.data.data.check);
    }
  };

  useEffect(() => {
    confirmId && detail(confirmId);
  }, [confirmId]);

  return (
    <Modal
      title=""
      closable={{ "aria-label": "Custom Close Button" }}
      open={checkout === 18}
      onOk={handleCancel}
      onCancel={handleCancel}
      width="80%"
      style={{ padding: 6 }}
      footer={[
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
        >
          {checking ? (
            <Badge variant="info">Шалгагдсан</Badge>
          ) : (
            <Button
              key="back"
              onClick={async () => {
                await UpdateConfirmPaper(confirmId);
                detail(confirmId);
              }}
            >
              Шалгаж дуусгах
            </Button>
          )}

          <Button key="next" type="primary" onClick={handleCancel}>
            Ok
          </Button>
        </div>,
      ]}
    >
      {!isAdmin && (
        <div className="flex justify-end my-2">
          <Button
            onClick={() =>
              router.push("/paper/action/edit/" + Number(confirmId))
            }
          >
            Шинээр үүсгэх
          </Button>
        </div>
      )}
      <Table
        dataSource={data}
        pagination={false}
        bordered
        rowKey="key"
        columns={
          [
            {
              title: "Систем нэр",
              dataIndex: "system",
              key: "system",
            },
            {
              title: "Хийгдсэн ажлууд",
              dataIndex: "jobs",
              key: "jobs",
            },
            {
              title: "Шинэчлэлт хийгдсэн модул",
              dataIndex: "module",
              key: "module",
            },
            {
              title: "Хувилбар",
              dataIndex: "version",
              key: "version",
            },
            {
              title: "Тайлбар",
              dataIndex: "description",
              key: "description",
            },
            isAdmin && {
              title: "Хариуцагч",
              dataIndex: "employee",
              key: "employeeId",
              render: (record: any) => convertName(record),
            },

            !isAdmin && {
              title: "",
              dataIndex: "id",
              key: "id",
              render: (id: number, record: any) => {
                return (
                  <Button
                    onClick={() => {
                      router.push("/paper/action/edit/" + id);
                      takeConfirmId(Number(record.confirmId));
                    }}
                  >
                    Засах
                  </Button>
                );
              },
            },
            !isAdmin && {
              title: "Устгах",
              dataIndex: "id",
              key: "id",
              render: (id: number) => (
                <Image
                  src="/trash.svg"
                  alt=""
                  width={20}
                  height={20}
                  onClick={async () => {
                    await DeleteConfirmSub(id);
                    detail(confirmId);
                  }}
                  className="hover:cursor-pointer"
                />
              ),
            },
          ].filter(Boolean) as any
        }
      />
    </Modal>
  );
}
