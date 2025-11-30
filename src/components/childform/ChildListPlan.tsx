"use client";
import { useContext } from "react";
import type { ColumnsType } from "antd/es/table";
import { ActionDetail } from "../client/ClientListPlan";
import { Table } from "antd";
import { convertName } from "../../util/usable";

export function ReadDepartmentEmployeeRole() {
  const context = useContext(ActionDetail);
  const columns: ColumnsType = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (_, record: any) => record?.employee?.firstname,
    },
    {
      title: "Хэлтэс",
      dataIndex: "department",
      key: "department",
      render: (_, record: any) => {
        return record?.employee?.department.name;
      },
    },

    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record: any) => record?.role,
    },
  ];
  return (
    <Table
      dataSource={context?.departmentEmployeeRole}
      columns={columns}
      pagination={false}
      bordered
      rowKey="id"
    />
  );
}

export function ReadTestSchedule() {
  const detailContext = useContext(ActionDetail);
  const columns: ColumnsType = [
    {
      title: "Албан тушаал/Ажилтны нэр",
      dataIndex: "employee",
      key: "employee",
      render: (employee: any) => convertName(employee),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (role) => role,
    },
    {
      title: "Эхлэх хугацаа",
      dataIndex: "startedDate",
      key: "startedDate",
      render: (startedDate) =>
        new Date(startedDate).toLocaleString().split(" ")[0],
    },
    {
      title: "Дуусах хугацаа",
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate) => new Date(endDate).toLocaleString().split(" ")[0],
    },
  ];
  return (
    <div>
      <div className="font-bold my-2 text-lg mx-4">
        3. Төслийн багийн бүрэлдэхүүн, тест хийх хуваарь
      </div>
      <Table
        rowKey="id"
        dataSource={detailContext?.documentemployee}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}

export function ReadTestRisk() {
  const detailContext = useContext(ActionDetail);
  const columns: ColumnsType = [
    {
      title: "Эрсдэл",
      dataIndex: "riskDescription",
      key: "riskDescription",
      render: (riskDescription) => riskDescription,
    },
    {
      title: "Эрсдлийн магадлал",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (riskLevel) => riskLevel,
    },
    {
      title: "Эрсдлийн нөлөөлөл",
      dataIndex: "affectionLevel",
      key: "affectionLevel",
      render: (affectionLevel) => affectionLevel,
    },
    {
      title: "Бууруулах арга зам",
      dataIndex: "mitigationStrategy",
      key: "mitigationStrategy",
      render: (mitigationStrategy) => mitigationStrategy,
    },
  ];
  return (
    <div>
      <li className="mb-2 mt-4">4.1 Эрсдэл</li>
      <Table
        rowKey="id"
        dataSource={detailContext?.riskassessment}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}

export function ReadTestEnv() {
  const detailContext = useContext(ActionDetail);
  const columns: ColumnsType = [
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
        summary={() => {
          const data = detailContext?.budget || [];
          const total = data.reduce((sum: any, row: any) => {
            const numericValue = Number(
              String(row.priceTotal).replace(/\./g, "")
            );
            return sum + (isNaN(numericValue) ? 0 : numericValue);
          }, 0);

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4} align="right">
                Нийт
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {total.toLocaleString("de-DE")}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} />
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
}

export function ReadTestCase() {
  const detailContext = useContext(ActionDetail);
  const columns: ColumnsType = [
    {
      title: "Ангилал",
      dataIndex: "category",
      key: "category",
      render: (category) => category,
    },
    {
      title: "Тестийн төрөл",
      dataIndex: "types",
      key: "types",
      render: (types) => types,
    },
    {
      title: "Тест хийх алхамууд",
      dataIndex: "steps",
      key: "steps",
      render: (steps) => <div style={{ whiteSpace: "pre-wrap" }}>{steps}</div>,
    },
    {
      title: "Үр дүн",
      dataIndex: "result",
      key: "result",
      render: (result) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{result}</div>
      ),
    },
    {
      title: "Хариуцах нэгж",
      dataIndex: "division",
      key: "division",
      render: (division) => (
        <div style={{ whiteSpace: "pre-wrap" }}>{division}</div>
      ),
    },
  ];
  return (
    <Table
      dataSource={detailContext?.testcase}
      columns={columns}
      rowKey="id"
      pagination={false}
      bordered
    />
  );
}
