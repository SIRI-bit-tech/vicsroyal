'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { HeroSlide } from '@/types/hero';
import { HeroSearch } from './hero-search';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-1',
    imageUrl: '/hero/hero-1.png',
    heading: 'LUXURY BONE STRAIGHT WIGS',
    subheading: '100% Virgin Human Hair • Invisible HD Lace',
    ctaText: 'Shop Wigs',
    ctaLink: '/category/wigs',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'hero-2',
    imageUrl: '/hero/hero-2.png',
    heading: 'RAW HUMAN HAIR BUNDLES',
    subheading: 'Unprocessed Double Drawn Hair • Thick Full Ends',
    ctaText: 'Explore Bundles',
    ctaLink: '/category/bundles',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'hero-3',
    imageUrl: '/hero/hero-3.png',
    heading: 'HD CLOSURES & FRONTALS',
    subheading: 'Seamless Melt Technology • Pre-Plucked Hairline',
    ctaText: 'Shop Closures',
    ctaLink: '/category/closures',
    sortOrder: 3,
    isActive: true,
  },
];

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_HERO_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden bg-[#0A0A0A] py-8 sm:py-12">
      {/* Search Bar Embedded in Hero */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <HeroSearch />
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#2B0A1F]" ref={emblaRef}>
          <div className="flex">
            {activeSlides.map((slide) => (
              <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-[450px] sm:h-[550px] lg:h-[600px]">
                <Image
                  src={slide.imageUrl}
                  alt={slide.heading}
                  fill
                  priority
                  className="object-cover object-center brightness-75"
                />
                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#2B0A1F]/40 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-3xl">
                  <span className="inline-block mb-3 px-4 py-1.5 rounded-full bg-[#E6007E]/90 text-white font-bold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md w-max">
                    {slide.ctaText}
                  </span>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#FFFFFF] leading-tight mb-4 drop-shadow-lg">
                    {slide.heading}
                  </h1>
                  <p className="text-base sm:text-xl text-gray-200 font-medium mb-8 drop-shadow-md">
                    {slide.subheading}
                  </p>
                  <div>
                    <Link
                      href={slide.ctaLink}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E6007E] to-[#FF4FA0] text-white font-extrabold text-base sm:text-lg shadow-xl hover:opacity-95 transition-all transform hover:-translate-y-0.5"
                    >
                      {slide.ctaText} →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Arrows */}
        <button
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/70 text-white hover:bg-[#E6007E] backdrop-blur-md transition-colors hidden sm:flex"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A0A0A]/70 text-white hover:bg-[#E6007E] backdrop-blur-md transition-colors hidden sm:flex"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {activeSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === selectedIndex ? 'w-8 bg-[#E6007E]' : 'w-2.5 bg-[#2B0A1F]'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
