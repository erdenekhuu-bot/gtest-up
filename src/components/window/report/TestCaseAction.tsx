"use client";
import {
  Avatar,
  Badge,
  Flex,
  Modal,
  Select,
  Input,
  Upload,
  Divider,
  Image,
  Form,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import { convertName } from "@/util/usable";
import { ZUSTAND } from "@/zustand";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export function TestCaseAction() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { caseid } = ZUSTAND();

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  // const detail = async function ({ id }: { id: number }) {
  //   try {
  //     const request = await axios.get(`/api/document/testcase/${id}`);
  //     if (request.data.success) {
  //       setData(request.data.data);
  //       setLoading(true);
  //       form.setFieldsValue({
  //         testType: request.data.data?.testType || "CREATED",
  //         description: request.data.data?.description || "",
  //       });
  //     }
  //   } catch (error) {
  //     return;
  //   }
  // };

  const handleDeleteTestCaseImage = async (imageId: number) => {
    try {
      const response = await axios.delete("/api/testcaseimage/" + imageId);
      if (response.data.success) {
        setData({
          ...data,
          testCaseImage: data.testCaseImage.filter(
            (img: any) => img.id !== imageId
          ),
        });
      }
    } catch (error) {
      return;
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Зураг оруулах</div>
    </button>
  );

  return (
    <Modal open={open} onOk={handleOk} onCancel={handleCancel} width={800}>
      <Form form={form}>
        <Flex align="center" className="mb-4">
          <Badge status="success" />
          <p className="mx-2">Ангилал</p>
        </Flex>

        <Flex justify="space-between">
          <p className="font-bold text-lg">{loading && data?.result}</p>
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
            <Image src="/users.svg" alt="" width={30} height={40} />
            <div>
              <Flex gap={4} wrap={true}>
                {loading &&
                  data?.document.documentemployee.map(
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
        {loading && (
          <div
            dangerouslySetInnerHTML={{
              __html: data?.steps.replace(/\n/g, "<br />"),
            }}
          />
        )}
        <div className="mt-4">
          <Form.Item name="description">
            <Input.TextArea
              rows={4}
              style={{ resize: "none" }}
              placeholder="Тайлбар бичих"
            />
          </Form.Item>
        </div>
        <div className="my-4">
          <Upload
            action={`/api/image/${id}`}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={{
              showRemoveIcon: false,
            }}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
          {loading && data?.testCaseImage.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4 overflow-x-scroll scrollbar">
              {data?.testCaseImage.map((item: any, index: number) => (
                <div key={index} className="relative">
                  <Image src={item.path} width={100} height={100} />
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:cursor-pointer"
                    onClick={() => handleDeleteTestCaseImage(item.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
}
