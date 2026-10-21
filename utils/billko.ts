/**
 * Billko API key setup state.
 *
 * The login/user payload reports the same thing three ways and they are not
 * always all present, so the check below reads them in order of how explicit
 * they are:
 *
 *   companyDetails.billkoApiKey        "" | "1234"     — the value itself
 *   companyDetails.billkoKeyConfigured false | true    — derived flag
 *   accountState.billkoSetupRequired   true  | false   — derived flag
 *
 * `companyDetails` is mirrored under both `basicInfo` and `accountState`;
 * either one is read since an update response may refresh only one of them.
 *
 * Only organizers own a Billko key — managers and staff sit under the same
 * `(organizer)` route group and must never be nagged about it.
 */
export const isBillkoKeyMissing = (user: any): boolean => {
  const userType = user?.accountState?.userType ?? user?.role;
  if (userType !== 'organizer') return false;

  const companyDetails = user?.basicInfo?.companyDetails ?? user?.accountState?.companyDetails;

  if (String(companyDetails?.billkoApiKey ?? '').trim()) return false;
  if (companyDetails?.billkoKeyConfigured === true) return false;
  if (user?.accountState?.billkoSetupRequired === false) return false;

  return true;
};

/** Profile route, deep-linked to the Business Details tab. */
export const BILLKO_KEY_PROFILE_HREF = '/organizer/organizer-profile?tab=business';

/**
 * Stamps a just-saved key into every place `isBillkoKeyMissing` looks, so the
 * warning clears immediately after a successful save instead of waiting for the
 * next login — the update response is not guaranteed to echo back a refreshed
 * `companyDetails`.
 */
export const applyBillkoKey = (user: any, key: string | undefined) => {
  const billkoApiKey = key ?? '';
  const configured = Boolean(billkoApiKey.trim());
  const patch = (companyDetails: any) => (companyDetails ? { ...companyDetails, billkoApiKey, billkoKeyConfigured: configured } : companyDetails);

  return {
    ...user,
    ...(user?.basicInfo && {
      basicInfo: { ...user.basicInfo, companyDetails: patch(user.basicInfo.companyDetails) },
    }),
    ...(user?.accountState && {
      accountState: {
        ...user.accountState,
        companyDetails: patch(user.accountState.companyDetails),
        billkoSetupRequired: !configured,
      },
    }),
  };
};
