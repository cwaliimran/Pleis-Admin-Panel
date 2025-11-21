export type Reservation = {
  _id: string;
  reservationType: string;
  availableReservations: number;
  maxCapacityPerReservation: number;
  conditionType: 'fixedPrice' | 'minimumSpendOnLocation' | 'prepayOption' | 'noCondition' | 'ticketRequirement' | 'customText' | string;
  taxPercentage: number;
  amount?: number;
  status: 'active' | 'inactive' | string;
  companyOrganizer: string;
};

export type UserReservation = {
  id: number;
  name: string;
  memberType: string;
  memberColor: string;
  date: string;
  time: string;
  reservationType: string;
  numberOfPeople: string;
  linkedTicket: string;
};

export type ReservationsApiResponse = {
  data: Reservation[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
};

export type UserReservationsApiResponse = {
  data: UserReservation[];
};

export type ReservationBodyProps = {
  data?: Reservation[];
  isLoading: boolean;
  meta?: ReservationsApiResponse['meta'];
  onPageChange: (page: number) => void;
  limit: number;
  companyOrganizer?: string;
  onLimitChange: (limit: number) => void;
};

export type ReservationHeaderProps = {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  range: string;
  onRangeChange: (range: string) => void;
};
