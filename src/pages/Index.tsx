import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { OrderSection } from "@/components/OrderSection";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <OrderSection />
      <Footer />
      <ChatBot />
    </main>
  );
};

export default Index;
