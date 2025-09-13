"use client";
import { Flex, Form, Input, Table } from "antd";
import { useEffect } from "react";
import { ActionDetail } from "../MemberPlanDetail";
import { ReadDepartmentEmployee } from "../table/ReadDepartmentEmployee";
import { ReadTestSchedule } from "../table/ReadTestSchedule";
import { ReadTestRisk } from "../table/ReadTestRisk";
import { ReadTestEnv } from "../table/ReadTestEnv";
import { ReadTestCase } from "../table/ReadTestCase";

const columns = [
  {
    title: "Ангилал",
    dataIndex: "category",
    key: "id",
  },
  {
    title: "Шалгуур",
    dataIndex: "value",
    key: "value",
  },
];

export function CheckPaper({ data }: any) {
  const [attributeForm] = Form.useForm();
  useEffect(() => {
    attributeForm.setFieldsValue({
      title: data.title,
      aim: data.detail.aim,
      intro: data.detail.intro,
      bankname: data.bank?.name,
      bank: data.bank?.address,
      predict:
        data.attribute.find((attr: any) => attr.category === "Таамаглал")
          ?.value || "",
      dependecy:
        data.attribute.find((attr: any) => attr.category === "Хараат байдал")
          ?.value || "",
      standby:
        data.attribute.find((attr: any) => attr.category === "Бэлтгэл үе")
          ?.value || "",
      execute:
        data.attribute.find(
          (attr: any) => attr.category === "Тестийн гүйцэтгэл"
        )?.value || "",
      terminate:
        data.attribute.find((attr: any) => attr.category === "Тестийн хаалт")
          ?.value || "",
      adding:
        data.attribute.find((attr: any) => attr.category === "Нэмэлт")?.value ||
        "",
    });
  }, [data]);

  return (
    <Form form={attributeForm}>
      <ActionDetail.Provider value={data}>
        <section className="flex-1 w-3/4">
          <div className="first-column p-6">
            <div className="flex justify-between text-xl mb-6">
              <b>"ЖИМОБАЙЛ" ХХК</b>
            </div>
            <div className="mt-8">
              <Form.Item name="title">
                <Input size="large" readOnly />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="font-bold my-2 text-lg">Зөвшөөрөл</div>
              <p className="mb-4">
                Дор гарын үсэг зурсан албан тушаалтнууд нь тестийн үйл
                ажиллагааны төлөвлөгөөний баримт бичигтэй танилцаж, түүнтэй
                санал нийлж байгаагаа хүлээн зөвшөөрч, баталгаажуулсан болно.
                Энэхүү төлөвлөгөөний өөрчлөлтийг доор гарын үсэг зурсан эсвэл
                тэдгээрийн томилогдсон төлөөлөгчдийн зөвшөөрлийг үндэслэн
                зохицуулж, нэмэлтээр батална.
              </p>
              <ReadDepartmentEmployee />
            </div>
            <div className="my-4">
              <div className="font-bold my-2 text-lg mx-4">
                1. Үйл ажиллагааны зорилго
              </div>
              <Form.Item name="aim">
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
              </Form.Item>
            </div>
            <div className="my-4">
              <div className="font-bold my-2 text-lg mx-4">
                2. Төслийн танилцуулга
              </div>
              <Form.Item name="intro">
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
              </Form.Item>
            </div>
            <ReadTestSchedule />
            <div className="font-bold my-2 text-lg mx-4">
              4. Төслийн үр дүнгийн таамаглал, эрсдэл, хараат байдал
            </div>
            <ReadTestRisk />
            <Form.Item name="execute">
              <div>
                <li>4.2 Таамаглал</li>
                <div className="mt-2">
                  <Form.Item
                    name="predict"
                    rules={[{ required: true, message: "Тестийн нэр!" }]}
                  >
                    <Input.TextArea
                      rows={5}
                      style={{ resize: "none" }}
                      readOnly
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <li>4.3 Хараат байдал</li>
                <div className="mt-2">
                  <Form.Item
                    name="dependecy"
                    rules={[{ required: true, message: "Тестийн нэр!" }]}
                  >
                    <Input.TextArea
                      rows={5}
                      style={{ resize: "none" }}
                      readOnly
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="font-bold my-2 text-lg mx-4">
                5. Тестийн үе шат
              </div>
              <div>
                <li>5.1 Бэлтгэл үе</li>
                <div className="mt-2">
                  <Form.Item
                    name="standby"
                    rules={[{ required: true, message: "Тестийн бэлтгэл үе!" }]}
                  >
                    <Input.TextArea
                      rows={5}
                      style={{ resize: "none" }}
                      readOnly
                    />
                  </Form.Item>
                </div>
              </div>

              <div>
                <li>5.2 Тестийн гүйцэтгэл</li>
                <div className="mt-2">
                  <Form.Item
                    name="execute"
                    rules={[{ required: true, message: "Тестийн гүйцэтгэл!" }]}
                  >
                    <Input.TextArea
                      rows={5}
                      style={{ resize: "none" }}
                      readOnly
                    />
                  </Form.Item>
                </div>
              </div>
            </Form.Item>
          </div>
          <div>
            <li>5.3 Тестийн хаалт</li>
            <div className="mt-2">
              <Form.Item
                name="terminate"
                rules={[{ required: true, message: "Тестийн хаалт!" }]}
              >
                <Input.TextArea rows={5} style={{ resize: "none" }} readOnly />
              </Form.Item>
            </div>
          </div>
          <div className="font-bold my-2 text-lg mx-4">
            6. Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур
          </div>
          <div className="my-4">
            <Form.Item name="adding">
              <Input.TextArea
                rows={1}
                placeholder=""
                maxLength={500}
                readOnly
              />
            </Form.Item>
          </div>
          <Table
            rowKey="id"
            dataSource={data.attribute.filter(
              (attr: any) =>
                attr.categoryMain ===
                "Түтгэлзүүлэх болон дахин эхлүүлэх шалгуур"
            )}
            columns={columns}
            pagination={false}
            bordered
          />
          <ReadTestEnv />
          <div className="">
            <p className="my-4 font-bold">ТӨСВИЙН ДАНС</p>
            <Flex gap={10}>
              <Form.Item name="bankname" style={{ flex: 1 }}>
                <Input size="middle" placeholder="Дансны эзэмшигч" readOnly />
              </Form.Item>
              <Form.Item name="bank" style={{ flex: 1 }}>
                <Input
                  size="middle"
                  type="number"
                  placeholder="Дансны дугаар"
                  readOnly
                />
              </Form.Item>
            </Flex>
          </div>
          <div className="font-bold my-2 text-lg mx-4">5.3. Тестийн кэйс</div>
          <ReadTestCase />
        </section>
      </ActionDetail.Provider>
    </Form>
  );
}
