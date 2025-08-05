import TableHeadCustom from "@/components/table/table-head-custom";
import CustomBadge from "@/components/ui/custom-badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const LoyaltyAndOrderTransaction = () => {
  return (
    <Table>
      <TableHeadCustom
        headLabel={[
          { id: "Invoice", label: "Invoice", align: "left" },
          { id: "Date", label: "Date", align: "left" },
          { id: "Transaction Type", label: "Transaction Type", align: "left" },
          { id: "Status", label: "Status", align: "left" },
          { id: "Total", label: "Total", align: "left" },
        ]}
      />
      <TableBody>
        {[
          {
            invoice: "INV-001",
            date: "01/10/2023",
            type: "Credit",
            status: "Paid",
            total: "$150",
          },
          {
            invoice: "INV-002",
            date: "01/10/2023",
            type: "Credit",
            status: "Paid",
            total: "$200",
          },
          {
            invoice: "INV-003",
            date: "01/10/2025",
            type: "Debit",
            status: "Unpaid",
            total: "$100",
          },
        ].map((txn, i) => (
          <TableRow key={i}>
            <TableCell>{txn.invoice}</TableCell>
            <TableCell>{txn.date}</TableCell>
            <TableCell className="w-48">
              <CustomBadge
                variant={txn.type === "Credit" ? "success" : "error"}
              >
                {txn.type}
              </CustomBadge>
            </TableCell>
            <TableCell>
              <CustomBadge
                variant={txn.status === "Paid" ? "success" : "error"}
              >
                {txn.status}
              </CustomBadge>
            </TableCell>
            <TableCell>{txn.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LoyaltyAndOrderTransaction;
