import React, { FC } from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"; // adjust path if needed

interface CustomHeaderProps {
  headLabel: Array<{
    id: string;
    label: string;
    align?: string;
  }>;
}

const TableHeadCustom: FC<CustomHeaderProps> = ({ headLabel}) => {

  const getTextAlignClass = (align?: string) => {
    switch (align) {
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      default:
        return "text-left";
    }
  };

  return (
    <TableHeader>
      <TableRow>
        {headLabel.map((header: any) => (
          <TableHead
            key={header.id}
            className={`text-slate-500 text-[16px] py-4 bg-slate-100 ${getTextAlignClass(header.align)}`}
          >
            {header.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeadCustom;
