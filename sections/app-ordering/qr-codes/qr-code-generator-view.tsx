'use client';

import React, { useState } from 'react';
import { QRTypeCard } from './qr-type-card';
import { SavedQRCard } from './saved-qr-card';
import { QRGeneratorModal } from './qr-generator-modal';
import { QRCodeType, SavedQRCode } from './types';
import { MOCK_SAVED_QR_CODES } from './constants';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { showError } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';

export const QRCodeGeneratorView: React.FC = () => {
  const deleteModal = useBoolean();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQRType, setSelectedQRType] = useState<QRCodeType | null>(null);
  const [savedQRCodes, setSavedQRCodes] = useState<SavedQRCode[]>(MOCK_SAVED_QR_CODES);

  const handleOpenGenerator = (type: QRCodeType) => {
    setSelectedQRType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQRType(null);
  };

  const handleDownloadSavedQR = (qrCode: SavedQRCode) => {
    const canvas = document.createElement('canvas');
    canvas.width = qrCode.size;
    canvas.height = qrCode.size;

    import('qrcode').then((QRCode) => {
      QRCode.toCanvas(canvas, qrCode.url, {
        width: qrCode.size,
        margin: 2,
        color: {
          dark: qrCode.color,
          light: qrCode.bgColor,
        },
      }).then(() => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${qrCode.name.replace(/\s+/g, '-')}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, 'image/png');
      });
    });
  };

  const handleDeleteSavedQR = (id: string) => {
    setSavedQRCodes((prev) => prev.filter((qr) => qr.id !== id));
    deleteModal.onTrue();
  };

  // DELETE CALL
  const onDelete = async () => {
    try {
      console.log('Call Delete API');
      //   const response = await deleteRewardCategory(selectedId).unwrap();
      //   if (response?.error) {
      //     const errorMessage = getErrorMessage(response.error);
      //     showError(errorMessage);
      //     return;
      //   }
      //   showSuccess(response?.message || 'Deleted successfully');
      //   setSelectedId(null);
      //   deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <>
      <section className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
          <div className="px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">QR Code Generator</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Create and download QR codes for your venue, events, and services</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
          {/* Info Banner */}
          <div className="mb-8 flex items-center gap-5 rounded-xl bg-linear-to-br from-[#2A7B9B] to-[#1300FF] p-6 text-white">
            <div className="text-5xl">💡</div>
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-bold">Streamline Your Operations</h2>
              <p className="text-sm leading-relaxed opacity-90">
                Generate QR codes for check-in, ordering, loyalty programs, and more. Print them for your venue or share them digitally. Users can
                scan to instantly access your services without manual data entry.
              </p>
            </div>
          </div>

          {/* QR Code Types Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <QRTypeCard
              icon="🏢"
              title="Organizer Page QR"
              description="Direct users to your organizer's public profile page in the app."
              features={['View all your events', 'See organizer information', 'Follow your organization']}
              onClick={() => handleOpenGenerator('organizer-page')}
            />

            <QRTypeCard
              icon="🎉"
              title="Event Page QR"
              description="Link directly to a specific event page for easy access and registration."
              features={['View event details', 'Purchase tickets', 'Add to calendar']}
              onClick={() => handleOpenGenerator('event-page')}
            />

            <QRTypeCard
              icon="⭐"
              title="Loyalty Program QR"
              description="Direct users to your loyalty club page for program enrollment and benefits."
              features={['Join loyalty program', 'View tier benefits', 'Track rewards']}
              onClick={() => handleOpenGenerator('loyalty-page')}
            />

            <QRTypeCard
              icon="✅"
              title="Check-in / Ordering QR"
              description="Allow users to check in at your venue and access in-app ordering."
              features={['Automatic venue check-in', 'Access ordering menu', 'Activate preorders']}
              onClick={() => handleOpenGenerator('checkin-ordering')}
            />

            <QRTypeCard
              icon="🍽️"
              title="Check-in with Table ID"
              description="Pre-fill table number during check-in for faster service and fewer errors."
              features={['Automatic table assignment', 'Instant menu access', 'No manual table entry']}
              onClick={() => handleOpenGenerator('checkin-table')}
            />
          </div>

          {/* Saved QR Codes Section */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Generated QR Codes</h2>
            </div>

            {savedQRCodes.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl opacity-30">📦</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No QR Codes Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-500">Generate your first QR code using the cards above</p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {savedQRCodes.map((qrCode) => (
                  <SavedQRCard key={qrCode.id} qrCode={qrCode} onDownload={handleDownloadSavedQR} onDelete={handleDeleteSavedQR} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generator Modal */}
        <QRGeneratorModal isOpen={isModalOpen} onClose={handleCloseModal} qrType={selectedQRType} />
      </section>

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Saved QR Code"
        content="Are you sure you want to delete this saved QR code?"
        onClose={() => {
          deleteModal.onFalse();
          //   setSavedQRCodes(undefined);
        }}
        onConfirm={onDelete}
        isLoading={false}
      />
    </>
  );
};
