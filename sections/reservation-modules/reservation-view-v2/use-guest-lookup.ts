'use client';

import { useDebounce } from '@/hooks/useDebounce';
import type { ApiUserDetails } from '@/store/Reducer/user-list';
import { useGetUserDetailsQuery } from '@/store/Reducer/user-list';
import { useMemo } from 'react';
import { GuestProfile } from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LOOKUP_DELAY_MS = 700;

export interface GuestMatch {
  email: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phoneCode: string;
  phoneNumber: string;
  profile: GuestProfile;
}

interface UseGuestLookupArgs {
  email: string;
  enabled: boolean;
}

interface UseGuestLookupReturn {
  isLooking: boolean;
  match: GuestMatch | null;
}

const toGuestMatch = (email: string, details: ApiUserDetails): GuestMatch | null => {
  const basicInfo = details.basicInfo;
  if (!basicInfo) return null;

  const firstName = basicInfo.firstName ?? '';
  const lastName = basicInfo.lastName ?? '';
  const phoneCode = basicInfo.phoneNumber?.code ?? '';
  const phoneNumber = basicInfo.phoneNumber?.number ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    email,
    userId: basicInfo._id,
    firstName,
    lastName,
    phoneCode,
    phoneNumber,
    profile: {
      fullName: fullName || '—',
      email: basicInfo.email ?? email,
      phoneNumber: phoneCode && phoneNumber ? `${phoneCode} ${phoneNumber}` : phoneNumber,
      accountStatus: details.accountState?.status,
    },
  };
};

export const useGuestLookup = ({ email, enabled }: UseGuestLookupArgs): UseGuestLookupReturn => {
  const typedEmail = email.trim().toLowerCase();
  const debouncedEmail = useDebounce(typedEmail, LOOKUP_DELAY_MS);

  const skip = !enabled || !EMAIL_PATTERN.test(debouncedEmail);

  const { data, isFetching } = useGetUserDetailsQuery({ email: debouncedEmail }, { skip });

  const match = useMemo(() => {
    if (skip || isFetching || !data) return null;
    return toGuestMatch(debouncedEmail, data);
  }, [skip, isFetching, data, debouncedEmail]);

  const isPendingDebounce = enabled && typedEmail !== debouncedEmail && EMAIL_PATTERN.test(typedEmail);

  return {
    isLooking: isPendingDebounce || (!skip && isFetching),
    match,
  };
};
