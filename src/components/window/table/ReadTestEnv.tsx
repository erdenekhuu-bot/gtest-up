"use client";
import { Form, Input, Table, Button, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useContext } from "react";
import Image from "next/image";
import { ActionDetail } from "../MemberPlanDetail";

type DataType = {
  id: number;
  productCategory: string;
  product: string;
  amount: number;
  priceUnit: number;
  priceTotal: number;
};

export function ReadTestEnv() {
  const detailContext = useContext(ActionDetail);

  const columns: ColumnsType<DataType> = [
    {
      title: "Ангилал",
      dataIndex: "productCategory",
      key: "productCategory",
      render: (productCategory) => productCategory,
    },
    {
      title: "Төрөл",
      dataIndex: "product",
      key: "product",
      render: (product) => product,
    },
    {
      title: "Тоо ширхэг",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => amount,
    },
    {
      title: "Нэгж үнэ (₮)",
      dataIndex: "priceUnit",
      key: "priceUnit",
      render: (priceUnit) => priceUnit,
    },
    {
      title: "Нийт үнэ (₮)",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (priceTotal) => priceTotal,
    },
  ];

  return (
    <div>
      <div className="font-bold my-2 text-lg mx-4">
        7. Тестийн төсөв /Тестийн орчин/
      </div>

      <Table
        rowKey="id"
        dataSource={detailContext?.budget}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
