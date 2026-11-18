'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFAsyncCombobox, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetDeliveryOptionsQuery } from '@/store/Reducer/delivery-options-api';
import { useGeteventsQuery } from '@/store/Reducer/events';
import { useGetAllEventsQuery } from '@/store/Reducer/helpers-api';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useAddQrcodeMutation } from '@/store/Reducer/qrcodes-api';
import { useGetLoyaltyClubsListQuery } from '@/store/Reducer/user-list';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { RootState } from '@/store/store';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { X } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { QR_TYPE_CONFIG } from './constants';
import { QRCodeType } from './types';

interface QRGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrType: QRCodeType | null;
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
      baseSchema.deliveryOptionId = Yup.string().required('Table is required');
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
  deliveryOptionId?: string;
};

const TARGET_FIELDS = ['organizationId', 'eventId', 'loyaltyId', 'venueId', 'deliveryOptionId'] as const;
const ORGANIZATION_QUERY_ARGS = { status: '', sortBy: 'organizationName', sortOrder: 'asc' };
const EVENT_QUERY_ARGS = { status: '', sortBy: 'title', sortOrder: 'asc' };
const VENUE_QUERY_ARGS = { status: '', sortBy: 'title', sortOrder: 'asc' };

const eventLabel = (event: any) => event?.basicInfo?.title || 'No Title';
const loyaltyLabel = (company: any) =>
  company?.companyDetails?.loyaltySettings?.title || company?.companyDetails?.name || 'Unknown Company';

const organizationIdFromVenue = (venue: any) => {
  const organization = venue?.organization;
  return (typeof organization === 'string' ? organization : organization?._id)?.toString() || '';
};

/** Renders a code's deep link to a PNG and downloads it. */
const downloadLinkAsPng = async (link: string, filename: string, dark: string, light: string) => {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, link, { width: 512, margin: 2, color: { dark, light } });
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(filename || 'QR-Code').replace(/\s+/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};

export const QRGeneratorModal: React.FC<QRGeneratorModalProps> = ({ isOpen, onClose, qrType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useSelector((state: RootState) => state.userSlice);

  // console.log('Loyalty Club', user?.basicInfo?.companyDetails?.loyaltySettings?.title);

  // Fixed colors (not customizable)
  const color = '#1d1d1f';
  const bgColor = '#ffffff';

  const { companyId } = useCompanySelectionState();
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
      deliveryOptionId: '',
    },
    mode: 'onChange',
  });

  const { reset, watch, setValue, getValues } = methods;

  // Watch all form values for preview
  const formValues = watch();
  const isAdmin = user?.accountState?.userType === 'admin';

  const [selectedOrganizationLabel, setSelectedOrganizationLabel] = useState('');
  const [selectedEventLabel, setSelectedEventLabel] = useState('');
  const [selectedLoyaltyLabel, setSelectedLoyaltyLabel] = useState('');
  const [selectedVenueLabel, setSelectedVenueLabel] = useState('');
  const [selectedVenueOrganizationId, setSelectedVenueOrganizationId] = useState('');

  const { data: venueData, isLoading: isLoadingVenues } = useGetVenuesQuery(
    {
      page: 0,
      search: '',
      limit: '10000',
      status: '',
      date: undefined,
    },
    {
      skip: !isOpen || qrType !== 'checkin-ordering',
    }
  );

  const venueOptions = useMemo(
    () =>
      venueData?.data?.map((venue: any) => ({
        label: venue?.title || 'No Title',
        value: venue?._id?.toString(),
      })) || [],
    [venueData]
  );

  // A table is a "Table delivery" destination of the venue's organization (#59).
  const { data: deliveryOptions = [], isFetching: isLoadingTables } = useGetDeliveryOptionsQuery(
    { organizationId: selectedVenueOrganizationId, limit: 1000 },
    { skip: !isOpen || qrType !== 'checkin-table' || !selectedVenueOrganizationId }
  );

  const tableOptions = useMemo(
    () =>
      deliveryOptions
        .filter((option) => option.deliveryMethod === 'tableDelivery' && option.status === 'active')
        .map((option) => ({ label: option.title, value: option._id })),
    [deliveryOptions]
  );

  // A different venue has different tables.
  useEffect(() => {
    if (qrType === 'checkin-table') setValue('deliveryOptionId', '');
  }, [formValues.venueId, qrType, setValue]);

  // The table's name is the label printed next to the code unless one is typed.
  useEffect(() => {
    const table = tableOptions.find((option) => option.value === formValues.deliveryOptionId);
    if (table && !getValues('label')) setValue('label', table.label, { shouldValidate: true });
  }, [formValues.deliveryOptionId, tableOptions, getValues, setValue]);

  // RESET FORM WHEN MODAL OPENS
  useEffect(() => {
    if (isOpen && config) {
      reset({
        label: '',
        organizationId: '',
        eventId: '',
        // For non-admin users, auto-set loyaltyId from their company
        loyaltyId: !isAdmin && qrType === 'loyalty-page' ? user?.basicInfo?._id : '',
        venueId: '',
        deliveryOptionId: '',
      });
      setSelectedOrganizationLabel('');
      setSelectedEventLabel('');
      setSelectedLoyaltyLabel('');
      setSelectedVenueLabel('');
      setSelectedVenueOrganizationId('');
    }
  }, [isOpen, config, reset, isAdmin, qrType, user?.basicInfo?._id]);

  // Target fields filled in so far, keyed by field id.
  const buildFormData = () => {
    const formData: Record<string, string> = {};
    TARGET_FIELDS.forEach((field) => {
      const value = formValues[field];
      if (value) formData[field] = value;
    });
    return formData;
  };

  // The real link carries a token the server issues on save (#59), so the
  // preview shows the code's shape with a placeholder link.
  const getCurrentUrl = () => {
    if (!config) return '';
    const formData = buildFormData();
    const isValid = config.fields.every((field) => !field.required || formData[field.id]);
    return isValid ? config.generateUrl(formData) : '';
  };

  // UPDATE PREVIEW
  useEffect(() => {
    if (!canvasRef.current) return;
    const url = getCurrentUrl();
    if (!url) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(canvasRef.current, url, {
      width: 300,
      margin: 2,
      color: { dark: color, light: bgColor },
    }).catch((error) => {
      console.error('QR Code generation error:', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, config]);

  // SAVE QR CODE: the server issues the token and returns the code's link.
  const handleSubmit = async (data: QRFormValues) => {
    if (!config) {
      showError('Invalid QR type configuration');
      return;
    }

    try {
      const payload: any = {
        label: data.label,
        globalQrType: config.globalQrType,
      };

      if (user?.accountState?.userType === 'admin' && companyId) {
        payload.companyOrganizer = companyId;
      }

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
          payload.deliveryOptionId = data.deliveryOptionId;
          break;
      }

      const response = await addQrcode(payload).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'QR Code saved successfully');

      const link = response?.data?.link;
      if (link) {
        await downloadLinkAsPng(link, data.label, color, bgColor).catch((error) => console.error('Auto-download error:', error));
      }

      onClose();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !config) return null;

  const isLoading = addQrcodeLoading;
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
                <RHFAsyncCombobox
                  name="organizationId"
                  label="Select Organization"
                  placeholder="Choose an organization"
                  searchPlaceholder="Search organizations..."
                  limit={50}
                  selectedLabel={selectedOrganizationLabel}
                  useOptionsQuery={useGetOrganizationQuery}
                  queryArgs={ORGANIZATION_QUERY_ARGS}
                  getOptionValue={(org) => org?._id?.toString()}
                  getOptionLabel={(org) => org?.basicInfo?.name || 'No Name'}
                  onValueChange={(_value, org) => setSelectedOrganizationLabel(org?.basicInfo?.name || '')}
                />
              )}

              {/* Event Dropdown */}
              {qrType === 'event-page' && (
                <RHFAsyncCombobox
                  name="eventId"
                  label="Select Event"
                  placeholder="Choose an event"
                  searchPlaceholder="Search events..."
                  limit={50}
                  selectedLabel={selectedEventLabel}
                  useOptionsQuery={isAdmin ? useGeteventsQuery : useGetAllEventsQuery}
                  queryArgs={EVENT_QUERY_ARGS}
                  getOptionValue={(event) => event?._id?.toString()}
                  getOptionLabel={eventLabel}
                  onValueChange={(_value, event) => setSelectedEventLabel(eventLabel(event))}
                />
              )}

              {/* Loyalty Dropdown - Admin only */}
              {qrType === 'loyalty-page' && isAdmin && (
                <RHFAsyncCombobox
                  name="loyaltyId"
                  label="Select Loyalty Program"
                  placeholder="Choose a loyalty program"
                  searchPlaceholder="Search loyalty programs..."
                  limit={50}
                  selectedLabel={selectedLoyaltyLabel}
                  useOptionsQuery={useGetLoyaltyClubsListQuery}
                  getOptionValue={(company) => company?._id?.toString()}
                  getOptionLabel={loyaltyLabel}
                  onValueChange={(_value, company) => setSelectedLoyaltyLabel(loyaltyLabel(company))}
                />
              )}

              {/* Loyalty Program Text - Non-admin users */}
              {qrType === 'loyalty-page' && !isAdmin && (
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">Loyalty Program</label>
                  <div className="flex h-10 w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-100">
                    {user?.basicInfo?.companyDetails?.loyaltySettings?.title || 'No Loyalty Program'}
                  </div>
                </div>
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
                  <RHFAsyncCombobox
                    name="venueId"
                    label="Select Venue"
                    placeholder="Choose a venue"
                    searchPlaceholder="Search venues..."
                    limit={50}
                    selectedLabel={selectedVenueLabel}
                    useOptionsQuery={useGetVenuesQuery}
                    queryArgs={VENUE_QUERY_ARGS}
                    getOptionValue={(venue) => venue?._id?.toString()}
                    getOptionLabel={(venue) => venue?.title || 'No Title'}
                    onValueChange={(_value, venue) => {
                      setSelectedVenueLabel(venue?.title || '');
                      setSelectedVenueOrganizationId(organizationIdFromVenue(venue));
                    }}
                  />
                  {formValues.venueId && (
                    <RHFCustomDropdown
                      name="deliveryOptionId"
                      label="Select Table"
                      placeholder={isLoadingTables ? 'Loading tables' : tableOptions.length ? 'Choose a table' : 'No tables for this venue'}
                      options={tableOptions}
                      isLoading={isLoadingTables}
                      showNone={false}
                    />
                  )}
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
                {currentUrl ? 'The link is created when you save.' : 'Please fill in all required fields'}
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
