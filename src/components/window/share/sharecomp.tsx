"use client";
import { Card, Flex, Popover, Button, Pagination } from "antd";
import { redirect } from "next/navigation";
import { ZUSTAND } from "@/zustand";
import { EditShareWindow } from "./shareEditWindow";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const Useitself = ({
  title,
  contents,
  id,
}: {
  title: string;
  contents: string;
  id: number;
}) => {
  const { getCheckout, getDocumentId } = ZUSTAND();
  const content = (
    <Flex gap={10}>
      <Button type="primary" onClick={() => redirect(`/share/${id}`)}>
        Төлөвлөгөө үзэх
      </Button>
      <Button
        onClick={() => {
          getDocumentId(id);
          getCheckout(8);
        }}
      >
        Хуваалцсан хүмүүс
      </Button>
    </Flex>
  );
  return (
    <Popover content={content} title="Хуваалцсан төлөвлөгөө">
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

export function ShareComp({ document,total, page, pageSize }: any) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
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

   const handlePaginationChange = (newPage: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    params.set("pageSize", newPageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <section>
      <Flex gap={20} wrap>
        {document.map((item: any, index: number) => (
          <Useitself
            key={index}
            title={item.document.title}
            contents={item.document.detail.aim}
            id={item.document.id}
          />
        ))}
      </Flex>
      <EditShareWindow />
      <Flex justify="end">
        <Pagination 
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={handlePaginationChange}
          />
      </Flex>
    </section>
  );
}
