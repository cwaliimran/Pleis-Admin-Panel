'use client';

import FormProvider, {
  RHFDate,
  RHFSelectField,
  RHFTextField,
} from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
// import * as Yup from 'yup';

type PromotionsFormValues = {
  photo: any;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  tierLimit: string;
  repeatSettings: string;
  type: string;
  // Happy Hour specific fields
  timeRangeStart: string;
  timeRangeEnd: string;
  pointMultiplier: string;
  repeatOptions: string;
  // Extra Points for Buying Menu Item fields
  menuItem: string;
  extraPoints: string;
  // Product Sale fields
  saleMenuItem: string;
  discountedPrice: string;
};

const defaultValues = {
  photo: null,
  title: '',
  description: '',
  startTime: '',
  endTime: '',
  tierLimit: '',
  repeatSettings: '',
  type: '',
  // Happy Hour specific fields
  timeRangeStart: '',
  timeRangeEnd: '',
  pointMultiplier: '',
  repeatOptions: '',
  // Extra Points for Buying Menu Item fields
  menuItem: '',
  extraPoints: '',
  // Product Sale fields
  saleMenuItem: '',
  discountedPrice: '',
};

// const schema = Yup.object().shape({
//   photo: Yup.mixed().nullable().required('Photo is required'),
//   title: Yup.string().required('Title is required'),
//   description: Yup.string().required('Description is required'),
//   startTime: Yup.string().required('Start Time is required'),
//   endTime: Yup.string().required('End Time is required'),
//   tierLimit: Yup.string().required('Tier Limit is required'),
//   repeatSettings: Yup.string().required('Repeat Settings is required'),
//   type: Yup.string().required('Type is required'),
//   // Fields for different promotion types
//   timeRangeStart: Yup.string(),
//   timeRangeEnd: Yup.string(),
//   pointMultiplier: Yup.string(),
//   repeatOptions: Yup.string(),
//   menuItem: Yup.string(),
//   extraPoints: Yup.string(),
//   saleMenuItem: Yup.string(),
//   discountedPrice: Yup.string(),
// });

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const PromotionModal = ({
  open,
  onClose,
  isEdit = false,
  // selectedData,
}: ChallengeModalProps) => {
  const methods = useForm<PromotionsFormValues>({
    defaultValues,
  });

  const { reset, watch } = methods;
  const selectedType = watch('type');

  const onSubmit = (data: any) => {
    console.log('data', data);
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Promotion' : 'Create Promotion'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                <RHFUploadAvatar name="photo" label="Promotion Image" />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFSelectField
                    name="type"
                    label="Promotion Type"
                    placeholder="Select Type"
                    className="w-full flex-1"
                    options={[
                      { label: 'Happy Hour', value: 'Happy Hour' },
                      {
                        label: 'Extra Points for Buying Menu Item',
                        value: 'Extra Points for Buying Menu Item',
                      },
                      { label: 'Product Sale', value: 'Product Sale' },
                    ]}
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  <RHFTextField
                    name="title"
                    label="Title"
                    placeholder="Enter Title"
                  />

                  <RHFSelectField
                    name="tierLimit"
                    label="Tier Limit"
                    placeholder="Select Tier Limit"
                    className="w-full flex-1"
                    options={[
                      { label: 'Bronze', value: 'Bronze' },
                      { label: 'Silver', value: 'Silver' },
                      { label: 'Gold', value: 'Gold' },
                      { label: 'Platinum', value: 'Platinum' },
                    ]}
                  />

                  <RHFDate
                    name="startTime"
                    label="Start Time"
                    placeholder="Select Start Date"
                    className="cursor-pointe h-10 w-full"
                  />

                  <RHFDate
                    name="endTime"
                    label="End Time"
                    placeholder="Select End Date"
                    className="cursor-pointe h-10 w-full"
                  />

                  <RHFSelectField
                    name="repeatSettings"
                    label="Repeat Settings"
                    placeholder="Select Repeat Settings"
                    className="w-full flex-1"
                    options={[
                      { label: 'None', value: 'None' },
                      { label: 'Daily', value: 'Daily' },
                      { label: 'Weekly', value: 'Weekly' },
                      { label: 'Monthly', value: 'Monthly' },
                    ]}
                  />
                </div>

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-1">
                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    multiline
                    rows={2}
                  />
                </div>

                {/* Dynamic fields based on promotion type */}
                {selectedType === 'Happy Hour' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFTextField
                      name="timeRangeStart"
                      label="Promotion Time Start"
                      placeholder="Enter Start Time (e.g. 17:00)"
                      type="time"
                    />
                    <RHFTextField
                      name="timeRangeEnd"
                      label="Promotion Time End"
                      placeholder="Enter End Time (e.g. 20:00)"
                      type="time"
                    />
                    <RHFSelectField
                      name="pointMultiplier"
                      label="Point Multiplier"
                      placeholder="Select Multiplier"
                      className="w-full flex-1"
                      options={[
                        { label: '1.1x', value: '1.1' },
                        { label: '1.5x', value: '1.5' },
                        { label: '2x', value: '2' },
                        { label: '3x', value: '3' },
                      ]}
                    />
                    <RHFSelectField
                      name="repeatOptions"
                      label="Repeat Options"
                      placeholder="Select Repeat Options"
                      className="w-full flex-1"
                      options={[
                        { label: 'Daily', value: 'Daily' },
                        { label: 'Monday', value: 'Monday' },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        { label: 'Saturday', value: 'Saturday' },
                        { label: 'Sunday', value: 'Sunday' },
                      ]}
                    />
                  </div>
                )}

                {selectedType === 'Extra Points for Buying Menu Item' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelectField
                      name="menuItem"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      className="w-full flex-1"
                      options={[
                        { label: 'Coffee', value: 'Coffee' },
                        { label: 'Tea', value: 'Tea' },
                        { label: 'Sandwich', value: 'Sandwich' },
                        { label: 'Pizza', value: 'Pizza' },
                        { label: 'Burger', value: 'Burger' },
                      ]}
                    />
                    <RHFTextField
                      name="extraPoints"
                      label="Extra Points"
                      placeholder="Enter Extra Points"
                      type="number"
                    />
                  </div>
                )}

                {selectedType === 'Product Sale' && (
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelectField
                      name="saleMenuItem"
                      label="Menu Item"
                      placeholder="Select Menu Item"
                      className="w-full flex-1"
                      options={[
                        { label: 'Coffee', value: 'Coffee' },
                        { label: 'Tea', value: 'Tea' },
                        { label: 'Sandwich', value: 'Sandwich' },
                        { label: 'Pizza', value: 'Pizza' },
                        { label: 'Burger', value: 'Burger' },
                      ]}
                    />
                    <RHFTextField
                      name="discountedPrice"
                      label="Discounted Price"
                      placeholder="Enter Discounted Price"
                      type="number"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default PromotionModal;
