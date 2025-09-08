import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useAddTwoFactorAuthMutation,
  useConfirmTwoFactorAuthMutation,
  useDisableTwoFactorAuthMutation,
} from '@/store/Reducer/twoFactorAuth';
import { setUser } from '@/store/slice/userSlice';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function TwoFactorAuth({ user }: any) {
  const dispatch = useDispatch();
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    user?.accountState?.twoFactorAuth || false
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [addTwoFactorAuth] = useAddTwoFactorAuthMutation();
  const [confirmTwoFactorAuth] = useConfirmTwoFactorAuthMutation();
  const [disableTwoFactorAuth] = useDisableTwoFactorAuthMutation();

  const updateUserState = (twoFactorAuth: boolean) => {
    const role = user?.accountState?.userType || user?.role || '';
    const newUser = {
      ...user,
      accountState: {
        ...user.accountState,
        twoFactorAuth,
      },
      role,
      key: process.env.NEXT_PUBLIC_PROJECT_KEY,
    };
    dispatch(setUser(newUser));
  };

  const handleToggleChange = async () => {
    if (isTwoFactorEnabled) {
      // Disable 2FA using the dedicated disable API
      try {
        setIsLoading(true);
        const response = await disableTwoFactorAuth({}).unwrap();

        if (!response) {
          showError('No response from server. Please try again later.');
          return;
        }

        if (response.error) {
          const errorMessage = getErrorMessage(response.error);
          showError(errorMessage);
          return;
        }

        // Update global user state with twoFactorAuth: false
        updateUserState(false);

        showSuccess(
          response?.message || 'Two-factor authentication disabled successfully'
        );
        setIsTwoFactorEnabled(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.log('Failed to disable 2FA:', errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Enable 2FA and show QR code on success
      try {
        setIsLoading(true);
        const response = await addTwoFactorAuth({
          enabled: true,
        }).unwrap();

        if (!response) {
          showError('No response from server. Please try again later.');
          return;
        }

        if (response.error) {
          const errorMessage = getErrorMessage(response.error);
          showError(errorMessage);
          return;
        }

        // Open modal and show QR code only on successful response
        if (response?.data?.qrCode) {
          setQrCode(response.data.qrCode);
          setIsModalOpen(true);
          // showSuccess(response?.message || 'Scan the QR code to set up 2FA');
        } else {
          showError('QR code not received. Please try again.');
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.log('Failed to initiate 2FA:', errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp) {
      showError('Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const payload = { token: otp };
      const response = await confirmTwoFactorAuth(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      updateUserState(true);

      showSuccess(
        response?.message || 'Two-factor authentication enabled successfully'
      );
      setIsModalOpen(false);
      setOtp('');
      setQrCode(null);
      setIsTwoFactorEnabled(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to confirm OTP:', errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Label
          htmlFor="two-factor"
          className="cursor-pointer text-gray-700 dark:text-white"
          onClick={handleToggleChange}
        >
          Enable two factor
        </Label>
        <div className="relative flex items-center gap-x-1">
          {!isLoading && (
            <>
              <Input
                id="two-factor"
                type="checkbox"
                checked={isTwoFactorEnabled}
                onChange={handleToggleChange}
                className="peer sr-only"
                disabled={isLoading}
              />

              <div
                className={`peer relative h-6 w-11 cursor-pointer rounded-full after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] ${
                  isTwoFactorEnabled
                    ? 'bg-primary after:translate-x-full after:border-white'
                    : 'bg-gray-200'
                } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={isLoading ? undefined : handleToggleChange}
              ></div>
            </>
          )}

          {isLoading && (
            <Loader2 className="ml-2 h-5 w-5 animate-spin text-gray-500" />
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="dark:bg-secondary sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-3 text-center">
              Setup Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCode ? (
              <Image
                src={qrCode}
                alt="2FA QR Code"
                width={192}
                height={192}
                className="h-48 w-48"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
            <p className="text-center text-sm text-gray-600 dark:text-gray-300">
              Scan the QR code with your authenticator app and enter the OTP
              below.
            </p>
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-2"
              disabled={isLoading}
            />
            <Button
              onClick={handleConfirmOtp}
              className="w-full h-10"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Confirm OTP'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
