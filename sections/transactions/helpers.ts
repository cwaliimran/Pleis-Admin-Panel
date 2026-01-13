export const getBadgeVariant = (type: string): 'success' | 'error' | 'warning' | 'default' => {
  switch (type) {
    case 'earn':
      return 'success';
    case 'redeem':
      return 'error';
    case 'adjustment':
      return 'warning';
    default:
      return 'default';
  }
};

export const getBadgeLabel = (type: string): string => {
  switch (type) {
    case 'earn':
      return 'Earned';
    case 'redeem':
      return 'Redeemed';
    case 'adjustment':
      return 'Adjusted';
    default:
      return 'N/A';
  }
};

export const getDomainType = (type: string): string => {
  switch (type) {
    case 'menuorders':
      return 'Menu Orders';
    case 'ticketingorders':
      return 'Ticketing Orders';
    case 'loyaltyrewardsorders':
      return 'Loyalty Rewards Orders';
    case 'loyaltychallengesorders':
      return 'Loyalty Challenges Orders';
    case 'userreservations':
      return 'User Reservations';
    default:
      return 'N/A';
  }
};
