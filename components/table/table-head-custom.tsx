import React, { FC } from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"; // adjust path if needed

interface CustomHeaderProps {
  headLabel: Array<{
    id: string;
    label: string;
    align?: string; 
  }>;
}

const TableHeadCustom: FC<CustomHeaderProps> = ({ headLabel }) => {
  
  return (
    <TableHeader>
      <TableRow>
        {headLabel.map((header: any) => (
          <TableHead key={header.id} className={`text-slate-500 text-[16px] py-4 bg-slate-100 text-center text-${header.align }`}>{header.label}</TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export default TableHeadCustom;
