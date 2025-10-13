'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import RewardCalculatorFields from './reward-calculation-fields';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';

type RewardFormValues = {
  image: any;
  name: string;
  type: string;
  pointValue: string;
  limit: string;
  tierLimit: string;
  description: string;
  creationMethod: string;
  percentOff: string;
  menuItems: string;
  eventId: string;
};

type RewardFormModalProps = {
  open: boolean;
  onClose: () => void;
  global?: boolean;
  isEdit: boolean;
};

const RewardFormModal = ({
  open,
  onClose,
  isEdit,
  global,
}: RewardFormModalProps) => {
  const defaultValues: RewardFormValues = {
    image: null,
    name: '',
    type: '',
    pointValue: '',
    limit: '',
    tierLimit: 'none',
    description: '',
    // creationMethod: 'menu-items',
    creationMethod: `${global ? 'custom' : 'menu-items'}`,
    percentOff: '',
    menuItems: '',
    eventId: '',
  };

  const methods = useForm<RewardFormValues>({
    defaultValues,
  });

  const { watch, reset, handleSubmit } = methods;
  const image = watch('image');
  const creationMethod = watch('creationMethod');
  const percentOff = watch('percentOff');

  const imagePreviewUrl = useMemo(() => {
    return image instanceof File ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const onSubmit = (data: RewardFormValues) => {
    console.log('Reward data:', data);
    reset(defaultValues);
    onClose();
  };

  // Handle modal close without submitting
  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[700px]"
        >
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Reward' : 'Create Reward'}
            </DialogTitle>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-0 flex w-full flex-col gap-4">
              <RHFUploadAvatar name="image" label="Image" />

              <RHFSelectField
                name="creationMethod"
                label="Creation Method"
                placeholder="Select creation method"
                className="w-full"
                options={[
                  ...(!global
                    ? [
                        {
                          label: 'From Menu Items',
                          value: 'menu-items',
                        },
                      ]
                    : []),

                  // { label: 'From Menu Items', value: 'menu-items' },
                  { label: 'Create Custom Reward', value: 'custom' },
                  { label: 'Add Ticket Reward', value: 'ticket' },
                ]}
              />

              {creationMethod === 'menu-items' && (
                <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    💡 Select menu items to link directly for easier scanning
                    and fulfillment. Use the calculator below to determine point
                    values.
                  </p>
                </div>
              )}

              {creationMethod === 'custom' && (
                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <p className="text-xs text-green-800 dark:text-green-200">
                    💡 Create custom rewards for items not in your menu
                    (merchandise, entry perks, etc.). Set your own point value
                    and description.
                  </p>
                </div>
              )}

              {creationMethod === 'ticket' && (
                <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    💡 Create exclusive tickets available only through loyalty
                    rewards. These are not for sale and provide special access
                    to events.
                  </p>
                </div>
              )}

              {creationMethod === 'menu-items' && (
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFSelectField
                    name="menuItems"
                    label="Select Preset Menu Items"
                    placeholder="Choose Preset"
                    options={[
                      { label: 'Pepperoni Pizza', value: 'pizza-1' },
                      { label: 'Caesar Salad', value: 'salad-1' },
                      { label: 'Cappuccino', value: 'coffee-1' },
                      { label: 'Vanilla Ice Cream', value: 'dessert-1' },
                    ]}
                  />
                </div>
              )}

              {creationMethod === 'ticket' && (
                <div className="grid w-full grid-cols-1 gap-4">
                  <RHFSelectField
                    name="eventId"
                    label="Select Event"
                    placeholder="Choose event for ticket reward"
                    className="w-full"
                    options={[
                      { label: 'Summer Music Festival', value: 'event-1' },
                      { label: 'Food & Wine Expo', value: 'event-2' },
                      { label: 'Business Networking Night', value: 'event-3' },
                    ]}
                  />
                </div>
              )}

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <RHFTextField
                  name="name"
                  label="Name"
                  placeholder="Enter reward name"
                />

                <RHFTextField
                  name="type"
                  label="Type"
                  placeholder="Enter type for sorting"
                />

                <div className="relative">
                  <RHFTextField
                    name="pointValue"
                    label="Point Value"
                    placeholder="Points required to claim"
                    type="number"
                  />
                </div>

                <RHFTextField
                  name="limit"
                  label="Limit (Optional)"
                  placeholder="Max times claimable"
                  type="number"
                />

                <RHFSelectField
                  name="tierLimit"
                  label="Tier Limit (Optional)"
                  placeholder="Minimum tier required"
                  className="w-full flex-1"
                  options={[
                    { label: 'No Restriction', value: 'none' },
                    { label: 'Bronze and above', value: 'bronze' },
                    { label: 'Silver and above', value: 'silver' },
                    { label: 'Gold only', value: 'gold' },
                  ]}
                />

                <RHFTextField
                  name="percentOff"
                  label="Percent Off (Optional)"
                  placeholder="For coupon rewards (0-100)"
                  type="number"
                  min="0"
                  max="100"
                />
              </div>

              {percentOff && Number(percentOff) > 0 && (
                <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    💡 This reward will provide {percentOff}% off instead of a
                    free item. Customers will pay the remaining amount.
                  </p>
                </div>
              )}

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                <RHFTextField
                  name="description"
                  label="Description (Optional)"
                  placeholder="Enter reward details"
                  multiline
                  rows={2}
                />
              </div>

              {creationMethod === 'custom' && (
                <div className="col-span-2 flex flex-col gap-2">
                  <div className="mb-2 flex max-w-[10rem] items-center justify-start">
                    <RHFUploadButton
                      name="customReward.photo"
                      label="Upload Photo"
                      initialImage={null}
                    />
                  </div>

                  <RHFTextField
                    name="customReward.name"
                    label="Custom Reward Name"
                    placeholder="Enter custom reward name"
                  />
                  <RHFTextField
                    name="customReward.description"
                    label="Custom Reward Description"
                    placeholder="Enter description"
                  />
                </div>
              )}

              <RewardCalculatorFields />
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <div className="flex w-full items-center justify-center">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                >
                  {isEdit ? 'Update' : 'Create'} Reward
                </Button>
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default RewardFormModal;
