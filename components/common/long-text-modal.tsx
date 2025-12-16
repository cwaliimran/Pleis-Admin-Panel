import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { capitalizeFirstLetter } from '@/utils/format-time';
import { FC } from 'react';

interface TruncatedTextWithModalProps {
  text: string | undefined;
  title: string;
  maxLength?: number;
  fallback?: string;
}

export const TruncatedTextWithModal: FC<TruncatedTextWithModalProps> = ({ text, title, maxLength = 22, fallback = '-' }) => {
  if (!text) return <>{fallback}</>;

  if (text.length > maxLength) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <span className="cursor-pointer hover:text-blue-600" title={`Click to view full ${title.toLowerCase()}`}>
            {/* {text.slice(0, maxLength) + '...'} */}
            {capitalizeFirstLetter(text.slice(0, maxLength) + '...')}
          </span>
        </DialogTrigger>

        <DialogContent aria-describedby={undefined} className="dark:bg-secondary max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm leading-relaxed break-all text-gray-700 dark:text-gray-300">{capitalizeFirstLetter(text)}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <>{text}</>;
};
