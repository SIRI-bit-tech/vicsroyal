export interface HeroSlide {
  id: string;
  imageUrl: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  isActive: boolean;
}

export interface HeroSlideFormData {
  imageUrl: string;
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink: string;
  sortOrder: number;
  isActive: boolean;
}
