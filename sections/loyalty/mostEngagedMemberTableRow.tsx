import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { TableCell, TableRow } from "@/components/ui/table";
import React, { FC } from "react";

interface PageProps {
  item: any;
}
const MostEngagedMemberTableRow: FC<PageProps> = ({ item }) => {
  return (
    <>
      <TableRow className="h-14">
        <TableCell className="bordder border-red-600">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="cursor-pointer"
              />
            </Avatar>
            {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
          </div>
        </TableCell>
        <TableCell className="text-center">{item.points}</TableCell>
        <TableCell className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs bg-white text-black border border-gray-300`}
          >
            {item.level}
          </span>
        </TableCell>
        <TableCell className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs bg-white text-black border border-gray-300`}
          >
            {item.tier}
          </span>
        </TableCell>
        <TableCell className="text-center">{item.lifeTimeValue}</TableCell>
      </TableRow>
    </>
  );
};

export default MostEngagedMemberTableRow;
