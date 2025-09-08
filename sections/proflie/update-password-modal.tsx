// PasswordUpdateModal.tsx
import FormProvider, { RHFTextField } from '@/components/rhf';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { useUpdatePasswordMutation } from '@/store/Reducer/user-list';
import ButtonLoading from '@/components/common/button-loading';

interface PasswordUpdateFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

interface PasswordUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation(); // Uncomment and use actual mutation if available

  const methods = useForm<PasswordUpdateFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      console.log('Password update data:', data);

      const payload = {
        oldPassword: data.currentPassword,
        newPassword: data.newPassword,
      };

      const response = await updatePassword(payload).unwrap();

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      if (response?.message) {
        showSuccess(response?.message || 'Password updated successfully');
      }
      onClose();
      methods.reset();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-secondary sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new password.
          </DialogDescription>
        </DialogHeader>

        <FormProvider methods={methods} onSubmit={onSubmit}>
          <div className="mt-3 space-y-4">
            <RHFTextField
              name="currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
            />

            <RHFTextField
              name="newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
            />

            <RHFTextField
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {/* <Button
              type="submit"
              className="bg-primary hover:bg-primary text-white"
            >
              Update Password
            </Button> */}

            {isLoading ? (
              <Button
                type="button"
                className="bg-primary hover:bg-primary cursor-not-allowed text-white"
              >
                <ButtonLoading title="Loading" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary text-white"
              >
                Update Password
              </Button>
            )}
          </DialogFooter>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordUpdateModal;
