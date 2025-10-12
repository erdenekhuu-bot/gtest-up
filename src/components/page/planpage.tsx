"use client";
import { Table, Flex, Input, Button, message } from "antd";
import { useState } from "react";
import type { TableProps } from "antd";
import { ZUSTAND } from "@/zustand";
import { FirstDocument } from "../window/firstdocument";
import { SecondDocument } from "../window/seconddocument";
import { ThirdDocument } from "../window/thirddocument";
import { convertName, formatHumanReadable } from "@/util/usable";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { DeleteAll } from "@/util/action";
import { ShareWindow } from "../window/sharewindow";
import { Badge } from "@/components/ui/badge";
import { RejectCause } from "../window/reject/rejectcause";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

export function PlanPage({ data, total, page, pageSize }: any) {
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const { getCheckout, getDocumentId } = ZUSTAND();
  const dataWithKeys = data.map((item: any) => ({
    ...item,
    key: item.id,
  }));
  const router = useRouter();


  const start = async () => {
    setLoading(true);
    const record = await DeleteAll(selectedRowKeys);
    record > 0 &&
      setTimeout(() => {
        setSelectedRowKeys([]);
        router.refresh();
        setLoading(false);
      }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

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


  const columns:any = [
    { title: "Тоот", dataIndex: "generate" },
    { title: "Тестийн нэр", dataIndex: "title" },
    {
      title: "Үүсгэсэн ажилтан",
      dataIndex: "user",
      render: (record: any) => {
        return <span>{convertName(record.employee)}</span>;
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
    {
      title: "Төлөв",
      dataIndex: "state",
      render: (state: string, record: any) => {
        const checkout = record.departmentEmployeeRole.every((item: any) => item.state==='ACCESS');
        if (checkout) {
          return <Badge variant="info">Зөвшөөрөгдсөн</Badge>;
        }
        return state === "PENDING" ? (
          <Badge variant="default">Хүлээгдэж байна</Badge>
        ) : state === "FORWARD" ? (
          <Badge variant="viewing">Хянагдаж байна</Badge>
        )  : (
          <Badge variant="outline">Шинэ</Badge>
        );
      },
    },
      // {
      //     title: "Шинэ Төлөв",
      //     dataIndex: "state",
      //     render: (state: string) => {
      //         return state === "SHARED" ? (
      //             <Badge variant="viewing">Хуваалцаж байна</Badge>
      //         ) : null;
      //     },
      // },
      {
          title: "Кэйс нэмэх",
          dataIndex: "id",
          render: (id:number) => <Button onClick={()=>{getDocumentId(id);router.push('/plan/case/'+id)}}>Нэмэх</Button>
      },
    {
      title: "Засах",
      dataIndex: "id",
      render: (id: number, record:any) => {
        const checkout = record.departmentEmployeeRole.every((item: any) => item.state==='ACCESS');
        return (
          <Button
            type="primary"
            onClick={() => {
              router.push("plan/" + id);
            }}
            disabled={checkout}
          >
            Хянах
            
          </Button>
        );
      },
    },
    {
      title: "Хуваалцах",
      dataIndex: "id",
      render: (id: number, record: any) => {
        return record.state === "SHARED" ? (
          <Badge variant="secondary">Хуваалцсан</Badge>
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
    {
      title: "Хариу",
      dataIndex: "reject",
      render: (record: any, adding:any) => {
        const checkout = adding.departmentEmployeeRole.every((item: any) => item.state);
        if (checkout) {
          return record=null;
        }
        return record != null ? (
          <Badge
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={() => {
              getDocumentId(record.documentId);
              getCheckout(13);
            }}
          >
            Буцаагдсан
          </Badge>
        ) : (
          <Badge variant="secondary">Хэвийн</Badge>
        );
      },
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

          <Button
            type="primary"
            onClick={() => {
              getCheckout(1);
            }}
          >
            Төлөвлөгөө үүсгэх
          </Button>
        </Flex>
      </div>

      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Устгах
          </Button>
          {hasSelected
            ? `Сонгогдсон ${selectedRowKeys.length} төлөвлөгөө`
            : null}
        </Flex>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataWithKeys}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
          }}
          onChange={handleTableChange}
        />
        <FirstDocument />
        <SecondDocument />
        <ThirdDocument />
        <ShareWindow />
        <RejectCause />
      </Flex>
    </section>
  );
}
