import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { BestSellers } from "@/components/home/best-sellers";
import { TrustBadges } from "@/components/home/trust-badges";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <BestSellers />
      <TrustBadges />
    </>
  );
}
