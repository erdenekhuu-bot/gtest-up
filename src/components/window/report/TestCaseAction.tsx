"use client";
import {
  Avatar,
  Badge,
  Flex,
  Select,
  Divider,
  Image as IMG,
  Form,
  Button,
  message,
  Breadcrumb,
} from "antd";
import { useEffect } from "react";
import type { FormProps } from "antd";
import { convertName } from "@/util/usable";
import { useRouter } from "next/navigation";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Italic,
  Base64UploadAdapter,
  Essentials,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Paragraph,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import { UpdateCase } from "@/util/action";
import { ZUSTAND } from "@/zustand";
import { redirect } from "next/navigation";

export function TestCaseAction(record: any) {
  const [mainForm] = Form.useForm();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const { caseid } = ZUSTAND();

  const onFinish: FormProps["onFinish"] = async (values) => {
    const merge = {
      values,
      caseid,
    };
    const update = await UpdateCase(merge);
    if (update > 0) {
      messageApi.success("Амжилттай хадгалсан");
      redirect("/sharecase");
    } else {
      messageApi.error("Алдаа гарлаа");
    }
  };

  useEffect(() => {
    mainForm.setFieldsValue({
      testType: record.record.testType || "CREATED",
      description: record.record.description || "",
    });
    router.refresh();
  }, []);

  return (
    <Form form={mainForm} onFinish={onFinish}>
      {contextHolder}
      <Breadcrumb
        style={{ margin: "16px 0" }}
        items={[
          {
            title: (
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
            onClick: () => redirect("/testcase"),
          },
          {
            title: "Кэйс засварлах хуудас",
          },
        ]}
      />
      <Flex align="center" className="mb-4">
        <Badge status="success" />
        <p className="mx-2">Ангилал</p>
      </Flex>

      <Flex justify="space-between">
        <p className="font-bold text-lg">{record.record?.result}</p>
        <Form.Item name="testType">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Кэйсийн төлөв"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[
              {
                value: "STARTED",
                label: "Эхэлсэн",
              },
              {
                value: "ENDED",
                label: "Дууссан",
              },
              {
                value: "CREATED",
                label: "Үүссэн",
              },
            ]}
          />
        </Form.Item>
      </Flex>

      <Divider />
      <Avatar.Group>
        <Flex gap={10} align="center">
          <IMG src="/users.svg" alt="" width={30} height={40} />
          <div>
            <Flex gap={4} wrap={true}>
              {record.record?.document.documentemployee.map(
                (item: any, index: number) => (
                  <Flex key={index} gap={4} className="opacity-60">
                    <p>{convertName(item.employee)}</p>
                  </Flex>
                )
              )}
            </Flex>
          </div>
        </Flex>
      </Avatar.Group>
      <Divider />
      <div
        dangerouslySetInnerHTML={{
          __html: record.record.steps.replace(/\n/g, "<br />"),
        }}
      />
      <div className="mt-4">
        <Form.Item name="description">
          <CKEditor
            editor={ClassicEditor}
            config={{
              licenseKey: "GPL",
              plugins: [
                Essentials,
                Paragraph,
                Bold,
                Italic,
                Image,
                ImageCaption,
                ImageStyle,
                ImageResize,
                ImageToolbar,
                ImageUpload,
                Base64UploadAdapter,
                PictureEditing,
              ],
              toolbar: [
                "undo",
                "redo",
                "|",
                "bold",
                "italic",
                "|",
                "imageUpload",
                "|",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
              ],
              image: {
                resizeOptions: [
                  {
                    name: "resizeImage:original",
                    label: "Original",
                    value: null,
                  },
                  { name: "resizeImage:50", label: "50%", value: "50" },
                  { name: "resizeImage:75", label: "75%", value: "75" },
                ],
                toolbar: [
                  "resizeImage:50",
                  "resizeImage:75",
                  "resizeImage:original",
                  "|",
                  "imageTextAlternative",
                ],
              },
              htmlSupport: {
                allow: [
                  {
                    name: /.*/,
                    attributes: true,
                    styles: true,
                    classes: true,
                  },
                ],
              },
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              mainForm.setFieldsValue({ description: data });
            }}
            data={mainForm.getFieldValue("description")}
            onReady={(editor) => {
             
              editor.model.document.on("change:data", () => {
                mainForm.setFieldsValue({ description: editor.getData() });
              });
            }}
          />
        </Form.Item>
        <Flex justify="center">
          <Button size="large" type="primary" onClick={() => mainForm.submit()}>
            Хадгалах
          </Button>
        </Flex>
      </div>
    </Form>
  );
}
