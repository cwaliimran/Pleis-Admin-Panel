'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useAddQrcodeMutation } from '@/store/Reducer/qrcodes-api';
import { useGetCompanyListQuery } from '@/store/Reducer/user-list';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { X } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { QR_TYPE_CONFIG } from './constants';
import { QRCodePayload, QRCodeType } from './types';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrType: QRCodeType | null;
}

interface CompanyOption {
  label: string;
  value: string;
}

// Dynamic schema based on QR type
const createSchema = (qrType: QRCodeType | null) => {
  const baseSchema: any = {
    label: Yup.string().required('Label is required'),
  };

  switch (qrType) {
    case 'organizer-page':
      baseSchema.organizationId = Yup.string().required('Organization is required');
      break;
    case 'event-page':
      baseSchema.eventId = Yup.string().required('Event is required');
      break;
    case 'loyalty-page':
      baseSchema.loyaltyId = Yup.string().required('Loyalty program is required');
      break;
    case 'checkin-ordering':
      baseSchema.venueId = Yup.string().required('Venue is required');
      break;
    case 'checkin-table':
      baseSchema.venueId = Yup.string().required('Venue is required');
      baseSchema.tableNo = Yup.string().required('Table number is required');
      break;
  }

  return Yup.object().shape(baseSchema);
};

type QRFormValues = {
  label: string;
  organizationId?: string;
  eventId?: string;
  loyaltyId?: string;
  venueId?: string;
  tableNo?: string;
};

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ isOpen, onClose, qrType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fixed colors (not customizable)
  const color = '#1d1d1f';
  const bgColor = '#ffffff';

  const { companyId } = useCompanySelectionState();
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [addQrcode, { isLoading: addQrcodeLoading }] = useAddQrcodeMutation();

  const config = qrType ? QR_TYPE_CONFIG[qrType] : null;

  // Initialize form with dynamic schema
  const methods = useForm<QRFormValues>({
    resolver: yupResolver(createSchema(qrType)) as any,
    defaultValues: {
      label: '',
      organizationId: '',
      eventId: '',
      loyaltyId: '',
      venueId: '',
      tableNo: '',
    },
    mode: 'onChange',
  });

  const { reset, watch } = methods;

  // Watch all form values for preview
  const formValues = watch();

  // CONDITIONAL API QUERIES - Only fetch when modal is open and qrType matches
  const { data: organizationData, isLoading: isLoadingOrganizations } = useGetOrganizationQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
    },
    {
      skip: !isOpen || qrType !== 'organizer-page',
    }
  );

  const { data: eventData, isLoading: isLoadingEvents } = useGeteventsQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
    },
    {
      skip: !isOpen || qrType !== 'event-page',
    }
  );

  const { data: venueData, isLoading: isLoadingVenues } = useGetVenuesQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    },
    {
      skip: !isOpen || (qrType !== 'checkin-ordering' && qrType !== 'checkin-table'),
    }
  );

  // Company List Query for Loyalty
  const {
    data: companyList,
    isLoading: isLoadingCompanies,
    isFetching: isFetchingCompanies,
  } = useGetCompanyListQuery(
    {},
    {
      skip: !isOpen || qrType !== 'loyalty-page',
    }
  );

  // TRANSFORM DATA TO OPTIONS
  const organizationOptions = useMemo(
    () =>
      organizationData?.data?.map((org: any) => ({
        label: org?.basicInfo?.name || 'No Name',
        value: org?._id?.toString(),
      })) || [],
    [organizationData]
  );

  const eventOptions = useMemo(
    () =>
      eventData?.data?.map((event: any) => ({
        label: event?.basicInfo?.title || 'No Title',
        value: event?._id?.toString(),
      })) || [],
    [eventData]
  );

  const venueOptions = useMemo(
    () =>
      venueData?.data?.map((venue: any) => ({
        label: venue?.title || 'No Title',
        value: venue?._id?.toString(),
      })) || [],
    [venueData]
  );

  const companyOptions = useMemo<CompanyOption[]>(
    () =>
      companyList?.map((company: any) => ({
        label: company?.companyDetails?.loyaltySettings?.title || company?.companyDetails?.name || 'Unknown Company',
        value: company?._id,
      })) || [],
    [companyList]
  );

  // RESET FORM WHEN MODAL OPENS
  useEffect(() => {
    if (isOpen && config) {
      reset({
        label: '',
        organizationId: '',
        eventId: '',
        loyaltyId: '',
        venueId: '',
        tableNo: '',
      });
    }
  }, [isOpen, config, reset]);

  // UPDATE PREVIEW
  useEffect(() => {
    updatePreview();
  }, [formValues, config]);

  const updatePreview = () => {
    if (!config || !canvasRef.current) return;

    // Build form data object for URL generation
    const formData: Record<string, string> = {};

    if (formValues.organizationId) formData.organizationId = formValues.organizationId;
    if (formValues.eventId) formData.eventId = formValues.eventId;
    if (formValues.loyaltyId) formData.loyaltyId = formValues.loyaltyId;
    if (formValues.venueId) formData.venueId = formValues.venueId;
    if (formValues.tableNo) formData.tableNo = formValues.tableNo;

    // Check if all required fields are filled
    const isValid = config.fields.every((field) => !field.required || formData[field.id]);

    if (!isValid) {
      // Clear canvas
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    // Generate URL
    const url = config.generateUrl(formData);

    // Generate QR Code on canvas
    QRCode.toCanvas(canvasRef.current, url, {
      width: 300,
      margin: 2,
      color: {
        dark: color,
        light: bgColor,
      },
    }).catch((error) => {
      console.error('QR Code generation error:', error);
    });
  };

  // GENERATE QR CODE AS BLOB
  const generateQRCodeBlob = async (): Promise<Blob | null> => {
    if (!config) return null;

    const formData: Record<string, string> = {};

    if (formValues.organizationId) formData.organizationId = formValues.organizationId;
    if (formValues.eventId) formData.eventId = formValues.eventId;
    if (formValues.loyaltyId) formData.loyaltyId = formValues.loyaltyId;
    if (formValues.venueId) formData.venueId = formValues.venueId;
    if (formValues.tableNo) formData.tableNo = formValues.tableNo;

    const url = config.generateUrl(formData);

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    try {
      await QRCode.toCanvas(canvas, url, {
        width: 512,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      });

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('QR Code generation error:', error);
      return null;
    }
  };

  // AUTO-DOWNLOAD PNG
  const autoDownloadPNG = async () => {
    if (!config) return;

    const formData: Record<string, string> = {};

    if (formValues.organizationId) formData.organizationId = formValues.organizationId;
    if (formValues.eventId) formData.eventId = formValues.eventId;
    if (formValues.loyaltyId) formData.loyaltyId = formValues.loyaltyId;
    if (formValues.venueId) formData.venueId = formValues.venueId;
    if (formValues.tableNo) formData.tableNo = formValues.tableNo;

    const url = config.generateUrl(formData);
    const filename = formValues.label || 'QR-Code';
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    try {
      await QRCode.toCanvas(canvas, url, {
        width: 512,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${filename.replace(/\s+/g, '-')}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Auto-download error:', error);
    }
  };

  // SAVE QR CODE TO DATABASE
  const handleSubmit = async (data: QRFormValues) => {
    if (!config) {
      showError('Invalid QR type configuration');
      return;
    }

    if (!companyId) {
      showError('Please select a company first');
      return;
    }

    try {
      // Generate QR code as blob
      const qrBlob = await generateQRCodeBlob();
      if (!qrBlob) {
        showError('Failed to generate QR code image');
        return;
      }

      // Convert blob to file for upload
      const file = new File([qrBlob], `qr-${Date.now()}.png`, { type: 'image/png' });

      // Upload image to Azure
      const uploadedImageKey = await uploadImage(file);

      if (!uploadedImageKey) {
        showError('Failed to upload QR code image');
        return;
      }

      // Build payload based on QR type
      const payload: QRCodePayload = {
        label: data.label,
        image: uploadedImageKey,
        globalQrType: config.globalQrType,
        companyOrganizer: companyId,
      };

      // Add type-specific fields
      switch (config.globalQrType) {
        case 'organization':
          payload.organizationId = data.organizationId;
          break;
        case 'event':
          payload.eventId = data.eventId;
          break;
        case 'loyalty':
          payload.loyaltyId = data.loyaltyId;
          break;
        case 'checkInOrder':
          payload.venueId = data.venueId;
          break;
        case 'checkInTableID':
          payload.venueId = data.venueId;
          payload.tableNo = parseInt(data.tableNo || '0', 10);
          break;
      }

      // Call API
      const response = await addQrcode(payload).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'QR Code saved successfully');

      // Auto-download PNG
      await autoDownloadPNG();

      // Close modal
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Get current URL for display
  const getCurrentUrl = () => {
    if (!config) return '';

    const formData: Record<string, string> = {};

    if (formValues.organizationId) formData.organizationId = formValues.organizationId;
    if (formValues.eventId) formData.eventId = formValues.eventId;
    if (formValues.loyaltyId) formData.loyaltyId = formValues.loyaltyId;
    if (formValues.venueId) formData.venueId = formValues.venueId;
    if (formValues.tableNo) formData.tableNo = formValues.tableNo;

    const isValid = config.fields.every((field) => !field.required || formData[field.id]);

    return isValid ? config.generateUrl(formData) : '';
  };

  if (!isOpen || !config) return null;

  const isLoading = addQrcodeLoading || imageUploading;
  const currentUrl = getCurrentUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-5 pt-10 md:p-10" onClick={handleClose}>
      <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl md:p-7 dark:bg-[#222121]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-gray-100 pb-5 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{config.title}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">{config.subtitle}</p>
            </div>
          </div>
          <button
            title="close"
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-3xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid gap-10 lg:grid-cols-[1fr,400px]">
          {/* Configuration Section */}
          <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              {/* Organization Dropdown */}
              {qrType === 'organizer-page' && (
                <>
                  {isLoadingOrganizations ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-3 w-24" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="organizationId"
                      label="Select Organization"
                      placeholder="Choose an organization"
                      options={organizationOptions}
                      isLoading={isLoadingOrganizations}
                      showNone={false}
                    />
                  )}
                </>
              )}

              {/* Event Dropdown */}
              {qrType === 'event-page' && (
                <>
                  {isLoadingEvents ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-3 w-20" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="eventId"
                      label="Select Event"
                      placeholder="Choose an event"
                      options={eventOptions}
                      isLoading={isLoadingEvents}
                      showNone={false}
                    />
                  )}
                </>
              )}

              {/* Loyalty Dropdown */}
              {qrType === 'loyalty-page' && (
                <>
                  {isLoadingCompanies || isFetchingCompanies ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-3 w-32" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="loyaltyId"
                      label="Select Loyalty Program"
                      placeholder="Choose a loyalty program"
                      options={companyOptions}
                      isLoading={isLoadingCompanies || isFetchingCompanies}
                      showNone={false}
                    />
                  )}
                </>
              )}

              {/* Venue Dropdown - Check-in Ordering */}
              {qrType === 'checkin-ordering' && (
                <>
                  {isLoadingVenues ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-3 w-20" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="venueId"
                      label="Select Venue"
                      placeholder="Choose a venue"
                      options={venueOptions}
                      isLoading={isLoadingVenues}
                      showNone={false}
                    />
                  )}
                </>
              )}

              {/* Venue + Table - Check-in with Table */}
              {qrType === 'checkin-table' && (
                <>
                  {isLoadingVenues ? (
                    <div className="space-y-2">
                      <Skeleton className="ml-1 h-3 w-20" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ) : (
                    <RHFCustomDropdown
                      name="venueId"
                      label="Select Venue"
                      placeholder="Choose a venue"
                      options={venueOptions}
                      isLoading={isLoadingVenues}
                      showNone={false}
                    />
                  )}
                  <RHFTextField name="tableNo" label="Table Number" placeholder="e.g., 1, 12, A5" />
                </>
              )}

              {/* Label Field */}
              <RHFTextField name="label" label="QR Code Label" placeholder="e.g., Main Entrance, Table 5" />
            </div>

            {/* Hidden submit button - we'll trigger from outside */}
            <button title="Submit QR Code Form" type="submit" className="hidden" />
            {/* <button type="submit" style={{ display: 'none' }} /> */}
          </FormProvider>

          {/* Preview Section */}
          <div className="sticky top-5 flex flex-col items-center rounded-2xl bg-gray-50 p-8 dark:bg-[#1a1a1a]">
            <h3 className="mb-6 text-center text-base font-bold text-gray-900 dark:text-gray-100">QR Code Preview</h3>

            <div className="mb-6 flex flex-col items-center rounded-2xl bg-white p-8 shadow-lg dark:bg-[#222121]">
              <canvas ref={canvasRef} width="300" height="300" className="max-w-full" />
              <div className="mt-4 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">{formValues.label || 'QR Code Label'}</div>
              <div className="mt-1 max-w-full text-center text-xs break-all text-gray-500 dark:text-gray-500">
                {currentUrl || 'Please fill in all required fields'}
              </div>
            </div>

            {/* Save Button */}
            <div className="w-full">
              {isLoading ? (
                <Button type="button" disabled className="h-12 w-full cursor-not-allowed font-semibold">
                  <ButtonLoading title="Saving" />
                </Button>
              ) : (
                <Button
                  onClick={() => methods.handleSubmit(handleSubmit)()}
                  className="dark:bg-primary dark:hover:bg-primary/80 h-12 w-full bg-blue-600 font-semibold hover:bg-blue-700"
                  disabled={!currentUrl}
                >
                  Save QR Code
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
