"use client";
import { Card, Flex, Popover, Button } from "antd";
import { redirect } from "next/navigation";
import { convertName } from "@/util/usable";
import { ZUSTAND } from "@/zustand";

const Useitself = ({
  title,

  id,
}: {
  title: string;

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
    <Card
      title={title}
      variant="outlined"
      className="m-6"
      style={{ width: 300 }}
    >
      <Flex justify="center">
        <Button
          size="large"
          onClick={() => {
            redirect("report/" + id);
          }}
          type="primary"
        >
          Тайлан үүсгэх
        </Button>
      </Flex>
    </Card>
  );
};

export function ReportList({ document }: any) {
  return (
    <section>
      <Flex gap={20}>
        {document.map((item: any, index: number) => (
          <Useitself key={index} title={item.title} id={item.id} />
        ))}
      </Flex>
    </section>
  );
}
