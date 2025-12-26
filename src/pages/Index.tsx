import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <OrderSection />
      <Footer />
    </main>
  );
};

export default Index;
