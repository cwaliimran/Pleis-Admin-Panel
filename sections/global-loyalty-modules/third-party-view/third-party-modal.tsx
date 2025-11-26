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
import { useForm } from 'react-hook-form';

type ThirdPartyRewardFormValues = {
  image: any;
  title: string;
  description: string;
  pointCost: number;
  claimLimit: number;
  rewardSourceLink: string;
  publicKeyForPartner: string;
  status: string;
};

const defaultValues: ThirdPartyRewardFormValues = {
  image: null,
  title: '',
  description: '',
  pointCost: 0,
  claimLimit: 1,
  rewardSourceLink: '',
  publicKeyForPartner: '',
  status: 'Active',
};

type ThirdPartyRewardModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
};

const ThirdPartyRewardModal = ({
  open,
  onClose,
  isEdit = false,
  selectedData,
}: ThirdPartyRewardModalProps) => {
  const methods = useForm<ThirdPartyRewardFormValues>({
    defaultValues: selectedData || defaultValues,
  });

  const { reset } = methods;

  const onSubmit = (data: ThirdPartyRewardFormValues) => {
    console.log('Third Party Reward Data:', data);
  };

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:!max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? 'Edit Third Party Reward' : 'Create Third Party Reward'}
            </DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider
              methods={methods}
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              <div className="mt-7 flex w-full flex-col gap-4">
                {/* Image */}
                <RHFUploadAvatar name="image" label="Image" />

                {/* Title */}
                <RHFTextField
                  name="title"
                  label="Title"
                  placeholder="Enter Title"
                />

                {/* Description */}
                <RHFTextField
                  name="description"
                  label="Description"
                  placeholder="Enter Description"
                  multiline
                  rows={2}
                />

                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Point Cost */}
                  <RHFTextField
                    name="pointCost"
                    label="Point Cost"
                    type="number"
                    placeholder="Enter Point Cost"
                  />

                  <RHFTextField
                    name="claimLimit"
                    label="Claim Limit (optional)"
                    type="number"
                    placeholder="Enter Claim Limit"
                  />
                </div>

                <RHFTextField
                  name="rewardSourceLink"
                  label="Reward Source Link"
                  placeholder="https://api.partner.com/redeem"
                />

                <RHFTextField
                  name="publicKeyForPartner"
                  label="Public Key For Partner"
                  placeholder="Enter Partner Public Key"
                />

                <RHFSelectField
                  name="statusLimits"
                  label="Status Limit"
                  placeholder="Select Status Limit"
                  options={[
                    { label: 'Silver', value: 'silver' },
                    { label: 'Gold', value: 'gold' },
                    { label: 'Platinum', value: 'platinum' },
                  ]}
                />

                {isEdit && (
                  <RHFSelectField
                    name="status"
                    label="Status"
                    placeholder="Select Status"
                    options={[
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                    ]}
                  />
                )}
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <div className="flex w-full items-center justify-center">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary mt-3 cursor-pointer px-7 text-white"
                  >
                    {isEdit ? 'Update Reward' : 'Save Reward'}
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

export default ThirdPartyRewardModal;
