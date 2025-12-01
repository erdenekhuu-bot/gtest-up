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
  Link,
  List,
  Heading,
  Underline,
  Strikethrough,
  Code,
  BlockQuote,
  Subscript,
  Superscript,
  FontColor,
  FontSize,
  Alignment,
  Table,
  TableToolbar,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { ZUSTAND } from "@/zustand";
import { useState } from "react";
import { UpdateCase, DuplicateTestCase } from "../../../util/action";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

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
                onClick={() => router.back()}
              >
                Үндсэн хуудас руу буцах
              </span>
            ),
          },
          {
            title: "Кэйс оруулах хуудас",
          },
        ]}
      />
      <Flex align="center" className="mb-4">
        <Badge status="success" />
        <p className="mx-2">Ангилал</p>
      </Flex>

      <Flex justify="space-between">
        <p className="font-bold text-lg">{record.record?.types}</p>
        <Flex gap={10}>
          <Form.Item name="status">
            <Button
              type="primary"
              onClick={async () => {
                const response = await DuplicateTestCase(caseid);
                if (response > 0) {
                  messageApi.success("Амжилттай хадгалсан");
                } else {
                  messageApi.error("Алдаа гарлаа");
                }
              }}
            >
              Бодит орчны кейс үүсгэх
            </Button>
          </Form.Item>
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
                Link,
                List,
                Image,
                ImageCaption,
                ImageStyle,
                ImageResize,
                ImageToolbar,
                ImageUpload,
                Base64UploadAdapter,
                PictureEditing,
                Heading,
                Underline,
                Strikethrough,
                Code,
                BlockQuote,
                Subscript,
                Superscript,
                FontColor,
                FontSize,
                Alignment,
                Table,
                TableToolbar,
              ],
              toolbar: [
                "undo",
                "redo",
                "|",
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "imageUpload",
                "insertTable",
                "blockQuote",
                "|",
                "code",
                "subscript",
                "superscript",
                "|",
                "fontColor",
                "fontSize",
                "alignment:left",
                "alignment:center",
                "alignment:right",
                "alignment:justify",
                "imageStyle:inline",
                "imageStyle:block",
                "imageStyle:side",
              ],
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "Paragraph",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading1",
                    view: "h1",
                    title: "Heading 1",
                    class: "ck-heading_heading1",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "Heading 2",
                    class: "ck-heading_heading2",
                  },
                ],
              },
              fontSize: {
                options: [10, 12, 14, "default", 18, 20, 24],
                supportAllValues: true,
              },
              fontColor: {
                colors: [
                  { color: "hsl(0, 0%, 0%)", label: "Black" },
                  { color: "hsl(0, 0%, 30%)", label: "Dim grey" },
                  { color: "hsl(0, 0%, 60%)", label: "Grey" },
                  { color: "hsl(0, 0%, 90%)", label: "Light grey" },
                  { color: "hsl(0, 0%, 100%)", label: "White" },
                ],
              },
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
                toolbar: ["imageTextAlternative"],
              },
              table: {
                contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
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