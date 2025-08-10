"use client";
import { Modal, Form, Input, Button, Flex, message } from "antd";
import { ZUSTAND } from "@/zustand";
import type { FormProps } from "antd";
import { TestSchedule } from "./creation/Schedule";
import { TestRisk } from "./creation/Risk";
import { Addition } from "./creation/Addition";
import { TestBudget } from "./creation/Budget";
import { SecondAction } from "@/util/action";
import dayjs from "dayjs";
import { selectConvert } from "@/util/usable";

export function SecondDocument() {
  const { checkout, getCheckout, documentid } = ZUSTAND();
  const [messageApi, contextHolder] = message.useMessage();
  const handleCancel = () => {
    getCheckout(-1);
  };
  const [mainForm] = Form.useForm();
  const onFinish: FormProps["onFinish"] = async (values) => {
    const bank = {
      bankname: values.bankname || "",
      bank: values.bank || "",
    };

    const testteam = values.testschedule.map((item: any) => ({
      employeeId: item.employeeId,
      role: item.role,
      startedDate: dayjs(item.startedDate).format("YYYY-MM-DDTHH:mm:ssZ"),
      endDate: dayjs(item.endDate).format("YYYY-MM-DDTHH:mm:ssZ"),
    }));

    const riskdata = values.testrisk.map((item: any) => {
      return {
        affectionLevel: selectConvert(item.affectionLevel),
        mitigationStrategy: item.mitigationStrategy,
        riskDescription: item.riskDescription,
        riskLevel: selectConvert(item.riskLevel),
      };
    });
    let attributeData = [
      {
        categoryMain: "Тестийн үе шат",
        category: "Бэлтгэл үе",
        value: values.predict || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн гүйцэтгэл",
        value: values.dependecy || "",
      },
      {
        categoryMain: "Тестийн үе шат",
        category: "Тестийн хаалт",
        value: values.standby || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Таамаглал",
        value: values.execute || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Хараат байдал",
        value: values.terminate || "",
      },
      {
        categoryMain: "Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал",
        category: "Нэмэлт",
        value: values.adding || "",
      },
    ];

    const addition = values.attribute.map((item: any) => {
      return {
        categoryMain: "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур",
        category: item.category,
        value: item.value,
      };
    });

    addition.forEach((item: any) => {
      attributeData.push(item);
    });

    const budgetdata = (values.testbudget || []).map((item: any) => ({
      productCategory: String(item.productCategory),
      product: String(item.product),
      priceUnit: Number(item.priceUnit),
      priceTotal: Number(item.priceTotal),
      amount: Number(item.amount),
      id: Number(item.id),
    }));

    const merge = {
      documentid,
      bank,
      testteam,
      riskdata,
      attributeData,
      budgetdata,
    };

    const result = await SecondAction(merge);
    if (result > 0) {
      messageApi.success("Амжилттай хадгалагдлаа!");
      getCheckout(3);
      mainForm.resetFields();
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };
  return (
    <Modal
      open={checkout === 2}
      onOk={onFinish}
      onCancel={handleCancel}
      title="ЖИМОБАЙЛ ХХК"
      width={800}
      className="scrollbar select-none"
      style={{ overflowY: "auto", maxHeight: "800px" }}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Болих
        </Button>,
        <Button key="next" type="primary" onClick={() => mainForm.submit()}>
          Цааш
        </Button>,
      ]}
    >
      {contextHolder}
      <Form form={mainForm} onFinish={onFinish}>
        <TestSchedule />
        <div className="font-bold my-2 text-lg">
          4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
        </div>
        <li>
          4.1 Таамаглал
          <ul className="ml-8">
            • Эхний оруулсан таамаглал энэ форматын дагуу харагдах. Хэдэн ч мөр
            байх боломжтой.
          </ul>
        </li>
        <div className="mt-2">
          <Form.Item
            name="predict"
            rules={[{ required: true, message: "Таамаглалаа бичнэ үү" }]}
          >
            <Input.TextArea
              rows={5}
              style={{ resize: "none" }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </div>
        <TestRisk form={mainForm} />
        <div>
          <li>
            4.3 Хараат байдал
            <ul className="ml-8">
              • Эхний оруулсан хараат байдал энэ форматын дагуу харагдах. Хэдэн
              ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item
              name="dependecy"
              rules={[{ required: true, message: "Хараат байдлыг бичнэ үү" }]}
            >
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div className="font-bold my-2 text-lg mx-4">5. Тестийн үе шат</div>
        <div>
          <li>
            5.1 Бэлтгэл үе
            <ul className="ml-8">
              • Эхний оруулсан бэлтгэл үе энэ форматын дагуу харагдах. Хэдэн ч
              мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item
              name="standby"
              rules={[{ required: true, message: "Бэлтгэл үеийг бичнэ үү" }]}
            >
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>
            5.2 Тестийн гүйцэтгэл
            <ul className="ml-8">
              • Эхний оруулсан тестийн гүйцэтгэл энэ форматын дагуу харагдах.
              Хэдэн ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item
              name="execute"
              rules={[
                { required: true, message: "Тестийн гүйцэтгэлээ бичнэ үү" },
              ]}
            >
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div>
          <li>
            5.3 Тестийн хаалт
            <ul className="ml-8">
              • Эхний оруулсан тестийн хаалт энэ форматын дагуу харагдах. Хэдэн
              ч мөр байх боломжтой.
            </ul>
          </li>
          <div className="mt-2">
            <Form.Item
              name="terminate"
              rules={[{ required: true, message: "Тестийн хаалт бичнэ үү" }]}
            >
              <Input.TextArea
                rows={5}
                style={{ resize: "none" }}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>
        </div>
        <div className="font-bold my-2 text-lg mx-4">
          6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
        </div>
        <div className="my-4">
          <Form.Item name="adding">
            <Input placeholder="" />
          </Form.Item>
        </div>
        <Addition form={mainForm} />
        <TestBudget form={mainForm} />
        <div className="">
          <p className="my-4 font-bold">ТӨСӨВИЙН ДАНС</p>
          <Flex gap={10}>
            <Form.Item name="bankname" style={{ flex: 1 }}>
              <Input size="middle" placeholder="Дансны эзэмшигч" />
            </Form.Item>
            <Form.Item name="bank" style={{ flex: 1 }}>
              <Input size="middle" type="number" placeholder="Дансны дугаар" />
            </Form.Item>
          </Flex>
        </div>
      </Form>
    </Modal>
  );
}
