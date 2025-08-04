"use client";
import { Card, Flex, Popover, Button } from "antd";
import { redirect } from "next/navigation";
import { convertName } from "@/util/usable";
import { ZUSTAND } from "@/zustand";
import { EditShareWindow } from "./shareEditWindow";

const Useitself = ({
  title,
  employee,
  id,
}: {
  title: string;
  employee: any;
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
        style={{ width: 300 }}
      >
        <p>{convertName(employee)}</p>
      </Card>
    </Popover>
  );
};

export function ShareComp({ document }: any) {
  return (
    <section>
      <Flex gap={20}>
        {document.map((item: any, index: number) => (
          <Useitself
            key={index}
            title={item.document.title}
            employee={item.employee}
            id={item.document.id}
          />
        ))}
      </Flex>
      <EditShareWindow />
    </section>
  );
}
