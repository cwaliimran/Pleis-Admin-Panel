'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import * as React from 'react';
import { FastTrackFeature } from './FastTrackFeature';
import { RepeatableFeature } from './RepeatableFeature';
import { RequiredFieldsSection } from './RequiredFieldsSection';
import { ResaleProtectionFeature } from './ResaleProtectionFeature';
import { ReservationFeature } from './ReservationFeature';
import { SectionHeader } from './SectionHeader';
import { TimeSensitivePricingFeature } from './TimeSensitivePricingFeature';
import { TimeslotFeature } from './TimeslotFeature';

interface TicketingModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const TicketingModal: React.FC<TicketingModalProps> = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
  // selectedVenueType,
}) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const { formState, watch, setValue } = methods;
  const isDirty = formState?.isDirty;

  // Watch feature toggles
  const timeslotEnabled = watch('features.timeslot');
  const repeatableEnabled = watch('features.repeatable');
  const resaleProtection = watch('features.resale') || 'none';
  const pricingType = watch('features.pricing') || 'none';
  const fasttrackEnabled = watch('features.fasttrack');
  const reservationEnabled = watch('features.reservation');
  const baseQuantity = watch('quantity');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/50">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[35vh] w-full flex-col items-center overflow-y-auto md:!max-w-[700px]"
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {editMode ? 'Edit Ticket' : 'Create New Ticket'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="mt-4 flex flex-col gap-6">
                {/* Required Fields */}
                <RequiredFieldsSection
                  formState={formState}
                  isLoading={isLoading}
                />

                {/* Optional Features */}
                <div>
                  <SectionHeader title="Optional Features" />

                  <TimeslotFeature
                    enabled={timeslotEnabled}
                    onChange={(val) =>
                      setValue('features.timeslot', val, { shouldDirty: true })
                    }
                    isLoading={isLoading}
                  />

                  <RepeatableFeature
                    enabled={repeatableEnabled}
                    onChange={(val) =>
                      setValue('features.repeatable', val, {
                        shouldDirty: true,
                      })
                    }
                    timeslotEnabled={timeslotEnabled}
                    isLoading={isLoading}
                  />

                  <ResaleProtectionFeature
                    value={resaleProtection}
                    onChange={(val) =>
                      setValue('features.resale', val, { shouldDirty: true })
                    }
                    isLoading={isLoading}
                  />

                  <TimeSensitivePricingFeature
                    value={pricingType}
                    onChange={(val) =>
                      setValue('features.pricing', val, { shouldDirty: true })
                    }
                    isLoading={isLoading}
                  />

                  <FastTrackFeature
                    enabled={fasttrackEnabled}
                    onChange={(val) =>
                      setValue('features.fasttrack', val, {
                        shouldDirty: true,
                      })
                    }
                    baseQuantity={baseQuantity}
                    isLoading={isLoading}
                  />

                  <ReservationFeature
                    enabled={reservationEnabled}
                    onChange={(val) =>
                      setValue('features.reservation', val, {
                        shouldDirty: true,
                      })
                    }
                    isLoading={isLoading}
                  />
                </div>

                {/* Status field for edit mode */}
                {editMode && (
                  <RHFSelectField
                    name="status"
                    placeholder="Select Status"
                    label="Status"
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                    disabled={isLoading}
                  />
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="px-4 py-2"
                  >
                    Cancel
                  </Button>

                  {isLoading ? (
                    <Button
                      type="button"
                      disabled
                      className="bg-primary hover:bg-primary cursor-not-allowed px-4 py-2 text-white"
                    >
                      <ButtonLoading
                        title={editMode ? 'Updating' : 'Creating'}
                      />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary-dark cursor-pointer px-4 py-2 text-white"
                      disabled={editMode ? !isDirty : false}
                    >
                      {editMode ? 'Update Ticket' : 'Create Ticket'}
                    </Button>
                  )}
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TicketingModal;
