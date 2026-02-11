'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { CurrentUrl } from '@/constant/constant';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';

interface UseExportTransactionsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  companyOrganizer?: string;
  organizerOrganizationIds?: string[];
  userType: 'super-admin' | 'organizer';
}

export const useExportTransactions = ({ startDate, endDate, companyOrganizer, organizerOrganizationIds, userType }: UseExportTransactionsProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { user } = useSelector((state: RootState) => state.userSlice);

  const handleExportCSV = async () => {
    // Validate date selection
    if (!startDate || !endDate) {
      showError('Please select both start date and end date before exporting');
      return;
    }

    try {
      setIsExporting(true);

      const params = new URLSearchParams();

      if (companyOrganizer) {
        params.append('companyOrganizer', companyOrganizer);
      }
      if (userType === 'organizer' && organizerOrganizationIds?.length) {
        params.append('organization', organizerOrganizationIds.join(','));
      }

      const formattedStartDate = formatDate(startDate);
      if (formattedStartDate) params.append('startDate', formattedStartDate);

      const formattedEndDate = formatDate(endDate);
      if (formattedEndDate) params.append('endDate', formattedEndDate);

      const url = `${CurrentUrl}admin/transactions/download${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download CSV');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `transactions-${formatDate(new Date())}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      showSuccess('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExportCSV,
  };
};
