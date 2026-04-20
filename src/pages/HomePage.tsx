import "../components/home/home.css";
import { Navbar } from "../components/home/Navbar";
import { HeroSection } from "../components/home/HeroSection";
import { TickerSection } from "../components/home/TickerSection";
import { ExamplesSection } from "../components/home/ExamplesSection";
import { CtaBanner } from "../components/home/CtaBanner";
import { HomeFooter } from "../components/home/HomeFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface text-text-primary font-nunito">
      <Navbar />
      <HeroSection />
      <TickerSection />
      <ExamplesSection />
      <CtaBanner />
      <HomeFooter />
    </div>
  );
}
