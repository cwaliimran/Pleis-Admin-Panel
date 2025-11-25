// types.ts
export type BannerStatus = 'active' | 'inactive' | 'draft';
export type BannerPosition = 'top' | 'inline' | 'bottom';
export type LinkType = 'loyalty' | 'event' | 'organizer';

export interface Banner {
  id: string;
  title: string;
  description: string;
  position: BannerPosition;
  status: BannerStatus;
  clicks?: number;
  scheduledDate?: string;
  backgroundColor: string;
  textColor: string;
  image?: string;
  linkType?: LinkType;
  linkTarget?: string;
  linkTargetName?: string;
  order: number;
  type: string;
  objectModel?: string;
  object?: any;
}
