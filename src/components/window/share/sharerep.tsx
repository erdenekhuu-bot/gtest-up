"use client";

import { Card, Flex, Popover, Button, Pagination, Table } from "antd";
import { redirect } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { EditShareReport } from "@/components/window/share/shareEditReport";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Useitself = ({
  title,
  contents,
  id,
  documentId,
}: {
  title: string;
  contents: string;
  id: number;
  documentId: number;
}) => {
  const { getCheckout, getDocumentId } = ZUSTAND();
  const content = (
    <Flex gap={10}>
      <Button
        type="primary"
        onClick={() => {
          getDocumentId(documentId);
          redirect(`/sharereport/${id}`);
        }}
      >
        Тайлан үзэх
      </Button>
      <Button
        onClick={() => {
          getDocumentId(id);
          getCheckout(17);
        }}
      >
        Хуваалцсан хүмүүс
      </Button>
    </Flex>
  );
  return (
    <Popover content={content} title="Хуваалцсан тайлан">
      <Card
        title={title}
        variant="outlined"
        className="m-6"
        style={{ width: 400 }}
      >
        <p>{contents}</p>
      </Card>
    </Popover>
  );
};

export function ShareCompRep({ document, total, page, pageSize }: any) {
  console.log(document)
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const router = useRouter();
  const { getCheckout, getDocumentId } = ZUSTAND();
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

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("pageSize", newPageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section>
      {/* <Flex gap={20} wrap>
        {document.map((item: any, index: number) => (
          <Useitself
            key={index}
            title={item.report.reportname}
            contents={item.report.reportprocessing}
            id={item.report.id}
            documentId={item.report.documentId}
          />
        ))}
      </Flex> */}
      <Table
        dataSource={document}
        columns={[
          {
            title: "Гарчиг",
            dataIndex: "report",
            render: (record: any) => record.reportname,
          },
          {
            title: "Тайлбар",
            dataIndex: "report",
            render: (record: any) => record.reportpurpose,
          },
          {
            title: "Үзэх",
            dataIndex: "report",
            render: (record: any) => {
              
              return (
                <Flex gap={10}>
                  <Button
                    type="primary"
                    onClick={() => {
                      getDocumentId(Number(record.documentId));
                      redirect(`/sharereport/${Number(record.id)}`);
                    }}
                  >
                    Тайлан үзэх
                  </Button>
                  <Button
                  onClick={() => {
                    getDocumentId(Number(record.id));
                    getCheckout(17);
                  }}
                  >
                    Хуваалцсан хүмүүс
                  </Button>
                </Flex>
              );
            },
          },
        ]}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePaginationChange,
        }}
      />
      <EditShareReport />
      {/* <Flex justify="end">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={handlePaginationChange}
        />
      </Flex> */}
    </section>
  );
}
