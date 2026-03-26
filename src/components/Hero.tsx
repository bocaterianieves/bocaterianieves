import { useEffect, useRef } from "react";
import burger1 from "@/assets/burger_1.png";
import burger2 from "@/assets/burger_2.png";
import heroVideo from "@/assets/video_hamburguesa.mp4";

export const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const handleScroll = () => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - sectionTop;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));

      // Drive video playhead with scroll
      if (video.readyState >= 2 && video.duration) {
        video.currentTime = progress * video.duration;
      }

      // burger_1: visible at start, fades out in first 15%
      if (img1Ref.current) {
        const op1 = progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.1);
        img1Ref.current.style.opacity = String(op1);
      }

      // burger_2: fades in at the end (last 10%)
      if (img2Ref.current) {
        const op2 = progress > 0.9 ? Math.min(1, (progress - 0.9) / 0.1) : 0;
        img2Ref.current.style.opacity = String(op2);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="inicio" className="relative" style={{ height: "300vh" }}>
      {/* Sticky visual frame */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Video — scroll-driven */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Initial image — hamburguesa cerrada */}
        <div ref={img1Ref} className="absolute inset-0" style={{ opacity: 1 }}>
          <img src={burger2} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Final image — hamburguesa abierta */}
        <div ref={img2Ref} className="absolute inset-0" style={{ opacity: 0 }}>
          <img src={burger1} alt="" className="w-full h-full object-cover" />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center h-full flex items-center justify-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center mt-12">
            <span className="animate-slide-up opacity-0 inline-block px-5 py-2.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-semibold mb-8 backdrop-blur-md border border-primary/30 cursor-default" style={{ animationFillMode: "forwards", animationDelay: "0.1s" }}>
              🔥 Bocadillos Artesanales
            </span>

            <h1 className="animate-slide-up opacity-0 font-serif text-6xl md:text-8xl lg:text-9xl font-extrabold text-foreground mb-6 leading-[1.1] tracking-tight" style={{ animationFillMode: "forwards", animationDelay: "0.2s" }}>
              Bocatería<br />
              <span className="text-transparent bg-clip-text bg-gradient-warm drop-shadow-sm">Nieves</span>
            </h1>

            <p className="animate-slide-up opacity-0 text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium" style={{ animationFillMode: "forwards", animationDelay: "0.3s" }}>
              Ingredientes frescos, recetas tradicionales y el cariño de siempre.
              Disfruta del mejor sabor.
            </p>

            <div className="animate-slide-up opacity-0 relative group" style={{ animationFillMode: "forwards", animationDelay: "0.5s" }}>
              <div className="absolute -inset-1 bg-gradient-warm rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
              <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('pedido')?.scrollIntoView({ behavior: 'smooth' }); }} className="relative inline-flex items-center justify-center gap-3 bg-card text-foreground px-10 py-5 rounded-2xl font-bold text-lg md:text-xl border border-white/5 shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Pedir
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
};
