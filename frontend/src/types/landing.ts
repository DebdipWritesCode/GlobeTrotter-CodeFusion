export interface CTA {
  label: string
  href?: string
  ariaLabel?: string
}

export interface HeroData {
  headline: string
  subcopy: string
  primaryCta: CTA
  secondaryCtas: CTA[]
  image: string
}

export interface Feature {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
  cta?: CTA
}

export interface CarouselItem {
  id: string
  title: string
  description?: string
  image: string
  cta?: CTA
}

export interface DeepDiveItem {
  id: string
  title: string
  description: string
  image: string
  cta?: CTA
}

export interface ServiceItem {
  id: string
  name: string
  icon?: string
  comingSoon?: boolean
}

export interface Partner {
  id: string
  name: string
  logo: string
  url?: string
}

export interface GalleryItem {
  id: string
  image: string
  alt: string
}

export interface LandingData {
  hero: HeroData
  features: Feature[]
  carousel: CarouselItem[]
  deepDive: DeepDiveItem[]
  services: ServiceItem[]
  partners: Partner[]
  gallery: GalleryItem[]
}
