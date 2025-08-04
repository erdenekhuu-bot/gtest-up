"use client";
import { Card, Flex, Popover, Button } from "antd";
import { redirect } from "next/navigation";
import { convertName } from "@/util/usable";

const Useitself = ({ title, employee }: { title: string; employee: any }) => {
  const content = (
    <Flex gap={10}>
      <Button type="primary" onClick={() => redirect("/share/1")}>
        Төлөвлөгөө үзэх
      </Button>
      <Button>Хуваалцсан хүмүүс</Button>
    </Flex>
  );
  return (
    <Popover content={content} title="Document">
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
          />
        ))}
      </Flex>
    </section>
  );
}
