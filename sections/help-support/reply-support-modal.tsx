'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateHelpSupportMutation } from '@/store/Reducer/help-support-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { FC, useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  ticket: any;
};

const ReplySupportModal: FC<Props> = ({ open, onClose, ticket }) => {
  const [reply, setReply] = useState('');
  const [updateHelpSupport, { isLoading }] = useUpdateHelpSupportMutation();

  useEffect(() => {
    if (open) {
      setReply('');
    }
  }, [open, ticket]);

  const handleSubmit = async () => {
    if (!reply.trim()) {
      showError('Please write a reply before submitting');
      return;
    }

    if (!ticket?._id) {
      showError('Ticket ID is missing');
      return;
    }

    try {
      const payload = {
        response: reply.trim(),
      };

      console.log('Update Payload:', { id: ticket._id, ...payload });

      const response = await updateHelpSupport({ id: ticket._id, ...payload }).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Reply sent successfully');
      setReply('');
      onClose();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    setReply('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex w-full flex-col overflow-y-auto md:max-w-[550px]!">
        <DialogHeader>
          <DialogTitle>Reply to Support Ticket</DialogTitle>
        </DialogHeader>

        <div className="w-full space-y-4">
          {/* Reply Input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Your Response</label>
            <Textarea
              placeholder="Write your reply to this support ticket..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={7}
              disabled={isLoading}
              className="resize-none"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">This response will be sent to the user who submitted the ticket.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>

            {isLoading ? (
              <Button disabled className="bg-primary hover:bg-primary cursor-not-allowed">
                <ButtonLoading title="Sending" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary-dark">
                Send Reply
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplySupportModal;
