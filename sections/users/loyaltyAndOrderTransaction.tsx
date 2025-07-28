import TableHeadCustom from '@/components/table/table-head-custom'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import React from 'react'

const LoyaltyAndOrderTransaction = () => {
  return (
    <Table>
      <TableHeadCustom headLabel={[
        { id: "type", label: "Type", align: "left" },
        { id: "value", label: "Value", align: "left" },
        { id: "items", label: "Items", align: "left" },
        { id: "time", label: "Time", align: "left" }
      ]}
      />
      <TableBody>
        {[
          { type: "Points Earned", value: "+150", items: "-", time: "2025-07-20 10:45 AM" },
          { type: "Redemption", value: "-100", items: "Free Drink", time: "2025-07-21 2:30 PM" },
          { type: "Order", value: "$24.99", items: "Pizza, Soda", time: "2025-07-22 7:15 PM" },
        ].map((txn, i) => (
          <TableRow key={i}>
            <TableCell>{txn.type}</TableCell>
            <TableCell>{txn.value}</TableCell>
            <TableCell>{txn.items}</TableCell>
            <TableCell>{txn.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LoyaltyAndOrderTransaction