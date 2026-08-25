export interface MarketingPromos {
  id: string;
  tickerEnabled: boolean;
  tickerText: string;
  tickerDiscountCode: string | null;
  tickerExpiresAt: string | null;
  tickerCtaLink: string;
  tickerCtaText: string;

  popupEnabled: boolean;
  popupHeading: string;
  popupSubheading: string;
  popupDiscountTag: string;
  popupImageUrl: string;
  popupCtaText: string;
  popupCtaLink: string;
  popupExpiresAt: string | null;

  updatedAt?: string;
}

export interface PromoFormData {
  tickerEnabled: boolean;
  tickerText: string;
  tickerDiscountCode: string;
  tickerExpiresAt: string;
  tickerCtaLink: string;
  tickerCtaText: string;

  popupEnabled: boolean;
  popupHeading: string;
  popupSubheading: string;
  popupDiscountTag: string;
  popupImageUrl: string;
  popupCtaText: string;
  popupCtaLink: string;
  popupExpiresAt: string;
}
