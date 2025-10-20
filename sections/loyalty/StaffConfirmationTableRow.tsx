import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { FC } from "react";

interface Props {
  item: any;
}

const StaffLogTableRow: FC<Props> = ({ item }) => {
  return (
    <TableRow className="h-14">
      <TableCell className="text-left">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          {item.staff}
        </div>
      </TableCell>
      <TableCell className="text-left">{item.action}</TableCell>
      <TableCell className="text-left">{item.reservationId}</TableCell>
      <TableCell className="text-left">{item.date}</TableCell>
      <TableCell className="text-left">{item.notes}</TableCell>
    </TableRow>
  );
};

export default StaffLogTableRow;
