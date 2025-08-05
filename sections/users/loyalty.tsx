import TableHeadCustom from "@/components/table/table-head-custom";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const Loyalty = () => {
  return (
    <Table>
      <TableHeadCustom
        headLabel={[
          { id: "items", label: "Items", align: "left" },
          { id: "type", label: "Point Earned", align: "left" },
          { id: "venueOrg", label: "Venue / Organization", align: "left" },
          { id: "value", label: "Point Redemed", align: "left" },
          { id: "time", label: "Time", align: "left" },
        ]}
      />
      <TableBody>
        {[
          {
            type: "Points Earned",
            value: "150",
            venueOrg: "Marriott Karachi",
            items: "200",
            time: "2025-07-20 10:45 AM",
          },
          {
            type: "Redemption",
            value: "100",
            venueOrg: "The Millennium Hall",
            items: "115",
            time: "2025-07-21 2:30 PM",
          },
          {
            type: "Order",
            value: "24",
            venueOrg: "Expo Center Lahore",
            items: "11",
            time: "2025-07-22 7:15 PM",
          },
        ].map((txn, i) => (
          <TableRow key={i}>
            <TableCell>{txn.type}</TableCell>
            <TableCell>{txn.value}</TableCell>
            <TableCell>{txn.venueOrg}</TableCell>
            <TableCell>{txn.items}</TableCell>
            <TableCell>{txn.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Loyalty;
