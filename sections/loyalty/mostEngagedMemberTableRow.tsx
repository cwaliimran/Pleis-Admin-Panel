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
                src={item?.user?.profileIcon || "https://github.com/shadcn.png"}
                className="cursor-pointer"
              />
            </Avatar>
            {(() => {
              const firstName = item?.user?.firstName || '';
              const lastName = item?.user?.lastName || '';
              const fullName = (firstName + ' ' + lastName).trim();
              return fullName.length > 20 ? fullName.slice(0, 20) + '...' : fullName;
            })()}
          </div>
        </TableCell>
        <TableCell className="text-center">{item?.totalPoints}</TableCell>
        <TableCell className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-xs bg-white text-black border border-gray-300`}
          >
            {item.level?.name}
          </span>
        </TableCell>
        <TableCell className="text-center">{item?.globalWallet?.lifetimePoints}</TableCell>
      </TableRow>
    </>
  );
};

export default MostEngagedMemberTableRow;
