"use client";
import { Table, Flex, Input, Button, message } from "antd";
import { ZUSTAND } from "@/zustand";
import { formatHumanReadable } from "@/util/usable";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { ShareWindow } from "../window/sharewindow";
import { Badge } from "@/components/ui/badge";
import { RejectCause } from "../window/reject/rejectcause";
import { useSession } from "next-auth/react";

export function PlanPage({ data, total, page, pageSize }: TablePagination) {
  const [messageApi, contextHolder] = message.useMessage();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { getCheckout, getDocumentId } = ZUSTAND();
  const dataWithKeys = data.map((item: any) => ({
    ...item.data,
    key: item.data.id,
  }));
  const checkout = session?.user.employee.permission[0].kind.includes("READ");
  const hasEdit = session?.user.employee.permission[0].kind.includes("EDIT");
  const solopermission = session?.user.employee.super;
  const router = useRouter();

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

  const columns: any = [
    { title: "Тоот", dataIndex: "generate" },
    { title: "Тестийн нэр", dataIndex: "title" },
    {
      title: "Үүсгэсэн ажилтан",
      dataIndex: "employee",
    },
    {
      title: "Төлөв",
      dataIndex: "departmentRoles",
      render: (record: any) => {
        const accessed = record.every((item: any) => item.state === "ACCESS");
        const checkout = record.some((item: any) => item.state === "ACCESS");
        return accessed ? (
          <Badge variant="info">Батлагдсан</Badge>
        ) : checkout ? (
          <Badge variant="viewing">Хянагдаж байна</Badge>
        ) : (
          <Badge variant="secondary">Шинэ</Badge>
        );
      },
    },
    (solopermission === "VIEWER" || solopermission === "REPORT") && {
      title: "Шалгах",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          type="primary"
          onClick={() => {
            router.push("plan/listplan/" + id);
          }}
        >
          Шалгах
        </Button>
      ),
    },

    hasEdit && {
      title: "Хуваалцах",
      dataIndex: "id",
      render: (id: number, record: any) => {
        return record.state === "SHARED" ? (
          <Badge
            variant="secondary"
            className="hover:cursor-pointer"
            onClick={() => {
              getDocumentId(id);
              getCheckout(4);
            }}
          >
            Хуваалцсан
          </Badge>
        ) : (
          <Button
            onClick={() => {
              getDocumentId(id);
              getCheckout(4);
            }}
          >
            Хуваалцах
          </Button>
        );
      },
    },

    hasEdit && {
      title: "Кэйс нэмэх",
      dataIndex: "id",
      render: (id: number) => (
        <Button
          type="link"
          onClick={() => {
            getDocumentId(id);
            router.push("/plan/case/" + id);
          }}
        >
          Кэйс нэмэх
        </Button>
      ),
    },
    hasEdit && {
      title: "Засах",
      dataIndex: "id",
      render: (id: number) => {
        return (
          <Button type="primary" onClick={() => router.push("plan/" + id)}>
            Засах
          </Button>
        );
      },
    },
    {
      title: "Огноо",
      dataIndex: "timeCreated",
      sorter: (a: any, b: any) =>
        new Date(a.timeCreated).getTime() - new Date(b.timeCreated).getTime(),
      render: (timeCreated: string) =>
        formatHumanReadable(new Date(timeCreated).toISOString()),
    },
  ];

  return (
    <section>
      {contextHolder}
      <div className="mb-8">
        <Flex gap={20} justify="space-between">
          <Input.Search
            placeholder="Тестийн нэрээр хайх"
            onChange={(e) => {
              generateSearch(e.target.value);
            }}
            allowClear
          />

          {hasEdit && (
            <Button
              type="primary"
              onClick={() => {
                router.push("/plan/create");
              }}
            >
              Төлөвлөгөө үүсгэх
            </Button>
          )}
        </Flex>
      </div>

      <Flex gap="middle" vertical>
        <Table
          columns={columns.filter(Boolean)}
          dataSource={dataWithKeys}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          onChange={handleTableChange}
        />

        <ShareWindow />
        <RejectCause />
      </Flex>
    </section>
  );
}
