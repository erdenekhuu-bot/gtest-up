"use client";
import type { FormProps } from "antd";
import { Button, Form, Input, message } from "antd";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import background from "../../../public/background.png";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [messageApi, contextHolder] = message.useMessage();
  const checkout = session?.user.permission.kind;

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const result = await signIn("localauth", {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    if (result?.ok) {
      router.push("/plan");
      messageApi.success("Амжилттай нэвтэрлээ");
    } else {
      messageApi.error("Амжилтгүй боллоо");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center relative">
      <Image
        alt=""
        src={background}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        width={0}
        height={0}
        fill
      />

      {contextHolder}
      <Form
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="relative z-10 p-8 rounded-lg"
      >
        <div className="z-30">
          <p className="text-center font-bold text-3xl text-[#01443F]">
            Тестийн бүртгэлийн систем
          </p>
        </div>
        <div className="my-8">
          <Form.Item<FieldType>
            label=""
            name="username"
            rules={[
              {
                required: true,
                message: "Нэвтрэх нэрээ оруулна уу",
              },
            ]}
          >
            <Input placeholder="Нэр" className="w-96 py-2" />
          </Form.Item>
        </div>

        <div className="my-8">
          <Form.Item<FieldType>
            label=""
            name="password"
            rules={[{ required: true, message: "Нууц үгээ оруулна уу" }]}
          >
            <Input.Password placeholder="Нууц үг" className="w-96 py-2" />
          </Form.Item>
        </div>

        <Form.Item>
          <Button
            size="large"
            htmlType="submit"
            className="w-96 bg-[#01443F] text-white"
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
