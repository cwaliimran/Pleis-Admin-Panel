export type TimelinePoint = {
  label: string;
  value: number;
};

export type RepeatPurchasePoint = {
  label: string;
  percentage: number;
  count: number;
};

export type GenderPoint = {
  name: string;
  value: number;
  percent?: number;
};

export type LocationPoint = {
  location: string;
  males: number;
  females: number;
  others: number;
};

export type InterestPoint = {
  category: string;
  males: number;
  females: number;
  others: number;
};

export type TagPoint = {
  tag: string;
  males: number;
  females: number;
  others: number;
};

const DEFAULT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export const formatCompact = (value: number): string => {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return `${value}`;
};

export const getFirstNumber = (item: any, keys: string[]): number => {
  for (const key of keys) {
    const candidate = Number(item?.[key]);
    if (!Number.isNaN(candidate)) {
      return candidate;
    }
  }
  return 0;
};

export const getTimelineLabel = (item: any, idx: number): string => {
  return (
    item?.month ??
    item?.week ??
    item?.day ??
    item?.date ??
    item?.label ??
    item?.name ??
    `P${idx + 1}`
  );
};

export const fallbackTimeline = (): TimelinePoint[] =>
  DEFAULT_MONTHS.map((month) => ({ label: month, value: 0 }));

export const mapTimelineData = (source: any[], valueKeys: string[]): TimelinePoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => ({
    label: String(getTimelineLabel(item, idx)),
    value: getFirstNumber(item, valueKeys),
  }));
};

export const mapRepeatPurchaseData = (source: any[]): RepeatPurchasePoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => {
    const count = getFirstNumber(item, [
      "repeatPurchasers",
      "repeatUsers",
      "newTransactionCount",
      "newTransactions",
      "newPurchaseUsers",
      "newUsers",
      "count",
      "users",
      "total",
      "value",
    ]);

    return {
      label: String(getTimelineLabel(item, idx)),
      percentage: 0,
      count,
    };
  });
};

export const mapInterestData = (source: any[]): InterestPoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => {
    return {
      category: String(item?.category ?? item?.tag ?? item?.interest ?? item?.name ?? `Category ${idx + 1}`),
      males: getFirstNumber(item, ["males", "male"]),
      females: getFirstNumber(item, ["females", "female"]),
      others: getFirstNumber(item, ["others", "other"]),
    };
  });
};

export const mapGenderData = (source: any[]): GenderPoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => ({
    name: String(item?.name ?? item?.label ?? `Gender ${idx + 1}`),
    value: getFirstNumber(item, ["count", "value", "total"]),
    percent: getFirstNumber(item, ["percent", "percentage"]),
  }));
};

export const mapLocationData = (source: any[]): LocationPoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => {
    return {
      location: String(item?.region ?? item?.location ?? item?.country ?? item?.name ?? `Region ${idx + 1}`),
      males: getFirstNumber(item, ["males", "male"]),
      females: getFirstNumber(item, ["females", "female"]),
      others: getFirstNumber(item, ["others", "other"]),
    };
  });
};

export const mapTagData = (source: any[]): TagPoint[] => {
  if (!Array.isArray(source)) {
    return [];
  }

  return source.map((item, idx) => {
    return {
      tag: String(item?.tagTitle ?? item?.tag ?? item?.name ?? item?.label ?? `Tag ${idx + 1}`),
      males: getFirstNumber(item, ["males", "male"]),
      females: getFirstNumber(item, ["females", "female"]),
      others: getFirstNumber(item, ["others", "other"]),
    };
  });
};
