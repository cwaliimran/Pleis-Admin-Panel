import TableHeadCustom from '@/components/table/table-head-custom';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import React from 'react';

const Loyalty = () => {
  return (
    <Table>
      <TableHeadCustom
        headLabel={[
          { id: 'user', label: 'User', align: 'left' },
          { id: 'organizer', label: 'Organizer', align: 'left' },
          { id: 'typeOfTransaction', label: 'Type of Transaction', align: 'left' },
          { id: 'referenceList', label: 'Reference List', align: 'left' },
          { id: 'pointEarned', label: 'Point Earned', align: 'left' },
          { id: 'pointSpent', label: 'Point Spent', align: 'left' },
          { id: 'timestamp', label: 'Timestamp', align: 'left' },
        ]}
      />
      <TableBody>
        {[
          {
            user: 'John Doe',
            organizer: 'Marriott Karachi',
            typeOfTransaction: 'Ticketing',
            referenceList: 'Menu Item',
            pointEarned: 150,
            pointSpent: 0,
            timestamp: '2025-07-20 10:45 AM',
          },
          {
            user: 'John Doe',
            organizer: 'The Millennium Hall',
            typeOfTransaction: 'In App Order',
            referenceList: 'Purchase',
            pointEarned: 0,
            pointSpent: 100,
            timestamp: '2025-07-21 2:30 PM',
          },
          {
            user: 'John Doe',
            organizer: 'Expo Center Lahore',
            typeOfTransaction: 'Refferral Reward',
            referenceList: 'Reward',
            pointEarned: 24,
            pointSpent: 0,
            timestamp: '2025-07-22 7:15 PM',
          },
        ].map((txn, i) => (
          <TableRow key={i}>
            <TableCell>{txn.user}</TableCell>
            <TableCell>{txn.organizer}</TableCell>
            <TableCell>{txn.typeOfTransaction}</TableCell>
            <TableCell>{txn.referenceList}</TableCell>
            <TableCell>{txn.pointEarned}</TableCell>
            <TableCell>{txn.pointSpent}</TableCell>
            <TableCell>{txn.timestamp}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Loyalty;
