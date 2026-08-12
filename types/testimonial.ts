export interface Testimonial {
  id: string;
  clientName: string;
  content: string;
  rating?: number | null; // 1 to 5
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface TestimonialFormData {
  clientName: string;
  content: string;
  rating?: number | null;
  imageUrl?: string | null;
  isPublished: boolean;
}
