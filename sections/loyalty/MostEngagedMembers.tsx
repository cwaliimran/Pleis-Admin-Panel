import TableHeadCustom from "@/components/table/table-head-custom";
import { Table, TableBody } from "@/components/ui/table";
import React from "react";
import { engagedMembers } from "./data";
import { FC } from "react";
import MostEngagedMemberTableRow from "./mostEngagedMemberTableRow";

const headLabel = [
  {
    id: "member",
    label: "MEMBER",
    align: "left",
  },
  {
    id: "points",
    label: "POINTS",
    align: "center",
  },
  {
    id: "level",
    label: "LEVEL",
    align: "center",
  },
  {
    id: "lifeTimeValue",
    label: "LIFETIME VALUE",
    align: "right",
  },
];

interface PageProps {
  data: any;
}

const MostEngagedMembers: FC<PageProps> = ({ data }) => {
  return (
    <>
      <div className="border rounded-lg m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <TableBody>
            {data?.map((item: any, index: number) => (
              <MostEngagedMemberTableRow key={index} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MostEngagedMembers;
