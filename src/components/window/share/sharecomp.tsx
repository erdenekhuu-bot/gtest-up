"use client";
import { Card, Flex } from "antd";
import { redirect } from "next/navigation";
import { convertName } from "@/util/usable";

const Useitself = ({ title, employee }: { title: string; employee: any }) => {
  return (
    <Card
      title={title}
      variant="outlined"
      className="hover:cursor-pointer m-6"
      style={{ width: 300 }}
      onClick={() => redirect("/share/1")}
    >
      <p>{convertName(employee)}</p>
    </Card>
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
