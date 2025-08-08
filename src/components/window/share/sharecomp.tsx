"use client";
import { Card, Flex, Popover, Button } from "antd";
import { redirect } from "next/navigation";
import { convertName } from "@/util/usable";
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

export function ShareComp({ document }: any) {
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

  const handleTableChange = (pagination: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pagination.current.toString());
    params.set("pageSize", pagination.pageSize.toString());
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <section>
      <Flex gap={20}>
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
    </section>
  );
}
