import React, { FC } from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"; // adjust path if needed
import { cn } from "@/lib/utils";

interface CustomHeaderProps {
  headLabel: Array<{
    id: string;
    label: string;
    align?: string;
  }>;
}

const TableHeadCustom: FC<CustomHeaderProps> = ({ headLabel }) => {

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
      <TableRow className="bg-slate-100 dark:bg-secondary">
        {headLabel.map((header: any) => (
          <TableHead
            key={header.id}
            className={cn(
              "text-[16px] py-4  ",
              "text-slate-700 dark:text-white",
              "bg-slate-100 dark:bg-[#272727]",
              "border-b border-slate-300 dark:border-[#272727]",
              getTextAlignClass(header.align)
            )}
          >
            {header.label}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeadCustom;
