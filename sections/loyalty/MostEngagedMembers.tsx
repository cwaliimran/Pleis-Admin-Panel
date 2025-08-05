import TableHeadCustom from "@/components/table/table-head-custom";
import { Table, TableBody } from "@/components/ui/table";
import React from "react";
import { engagedMembers } from "./data";
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
    id: "tier",
    label: "TIER",
    align: "center",
  },
  {
    id: "lifeTimeValue",
    label: "LIFETIME VALUE",
    align: "right",
  },
];

const MostEngagedMembers = () => {
  return (
    <>
      <div className="border rounded-lg m-4">
        <Table className="w-full">
          <TableHeadCustom headLabel={headLabel} />
          <TableBody>
            {engagedMembers.map((item: any, index) => (
              <MostEngagedMemberTableRow key={index} item={item} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MostEngagedMembers;
