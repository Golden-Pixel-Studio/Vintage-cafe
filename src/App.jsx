import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import {
  BellRing,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Coffee,
  Facebook,
  Instagram,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Navigation,
  PackageCheck,
  PackagePlus,
  Phone,
  Quote,
  RefreshCw,
  Send,
  ShieldCheck,
  Star,
  Sun,
  TimerReset,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import {
  businessSources,
  fallbackBusiness,
  galleryImages,
  menuCategories,
  testimonials
} from "./data/cafeData";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

function createStarArray(rating) {
  return Array.from({ length: 5 }, (_, index) => index < Math.round(rating));
}

function parsePrice(price = "") {
  const value = Number(String(price).replace(/[^\d.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

const orderMenuItems = menuCategories.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.label,
    priceValue: parsePrice(item.price)
  }))
);

function toSchemaTime(value = "") {
  const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return value;
  let hour = Number(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

function playTick(soundEnabled) {
  if (!soundEnabled) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = 520;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.035, audio.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.12);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.14);
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return (
      localStorage.getItem("vintage-theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    );
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("vintage-theme", theme);
  }, [theme]);

  return [theme, setTheme];
}

function useBusinessData() {
  const [business, setBusiness] = useState(fallbackBusiness);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    fetch("/api/business")
      .then((response) => {
        if (!response.ok) throw new Error("Business API unavailable");
        return response.json();
      })
      .then((payload) => {
        if (alive && payload?.business) {
          setBusiness({ ...fallbackBusiness, ...payload.business });
        }
      })
      .catch(() => {
        if (alive) setBusiness(fallbackBusiness);
      })
      .finally(() => {
        if (alive) setIsLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  return { business, isLoading };
}

function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const smoothX = useSpring(x, { stiffness: 260, damping: 38 });
  const smoothY = useSpring(y, { stiffness: 260, damping: 38 });

  useEffect(() => {
    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return <motion.div className="cursor-glow" style={{ x: smoothX, y: smoothY }} aria-hidden="true" />;
}

function Header({ theme, setTheme, soundEnabled, setSoundEnabled, business }) {
  const [open, setOpen] = useState(false);
  const navItems = [
    ["Story", "#about"],
    ["Menu", "#menu"],
    ["Gallery", "#gallery"],
    ["Reviews", "#reviews"],
    ["Visit", "#location"]
  ];

  const handleTheme = () => {
    playTick(soundEnabled);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/15 bg-coffee-950/55 px-3 py-2.5 text-cream shadow-glow backdrop-blur-2xl sm:px-4 sm:py-3 dark:bg-coffee-950/70">
        <a href="#top" className="group flex items-center gap-3" aria-label="Vintage Cafe home">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-cream text-coffee-800 shadow-neumorph transition-transform duration-300 group-hover:rotate-6">
            <Coffee size={22} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-bold tracking-wide">Vintage</span>
            <span className="block text-[0.65rem] uppercase tracking-[0.4em] text-gold">Cafe Pune</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-cream/80 lg:flex" aria-label="Primary">
          {navItems.map(([label, href]) => (
            <a key={label} className="nav-link" href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            className="icon-button"
            type="button"
            onClick={() => setSoundEnabled((value) => !value)}
            aria-label={soundEnabled ? "Disable interface sound" : "Enable interface sound"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button className="icon-button" type="button" onClick={handleTheme} aria-label="Toggle dark and light mode">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a className="secondary-button px-4 py-3 text-sm" href="/admin">
            <ShieldCheck size={17} />
            Admin
          </a>
          <a className="premium-button px-5 py-3 text-sm" href="#order">
            Order Online
          </a>
        </div>

        <button
          className="icon-button md:hidden"
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-coffee-950/80 p-3 backdrop-blur-xl sm:p-4 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="ml-auto flex min-h-full max-w-sm flex-col rounded-[1.5rem] border border-white/15 bg-cream p-4 text-coffee-900 shadow-2xl sm:rounded-[2rem] sm:p-5"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-2xl font-bold">Vintage Cafe</span>
                <button className="icon-button icon-button--light" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-8 grid gap-3">
                {navItems.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl bg-coffee-800/5 px-4 py-3 font-display text-xl sm:py-4 sm:text-2xl"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <div className="mt-auto grid gap-3">
                <a className="premium-button justify-center py-4" href="#order" onClick={() => setOpen(false)}>
                  Order Online
                </a>
                <a className="secondary-button justify-center py-4" href="/admin" onClick={() => setOpen(false)}>
                  <ShieldCheck size={18} />
                  Admin Login
                </a>
                <a className="secondary-button justify-center py-4" href={`tel:${business.phone}`}>
                  Call {business.phoneDisplay}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ business, isLoading }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.18]);
  const stars = createStarArray(business.rating);

  return (
    <section id="top" ref={heroRef} className="relative min-h-screen overflow-hidden bg-coffee-950 text-cream">
      <motion.video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1800&q=84"
        style={{ scale }}
      >
        <source src="https://videos.pexels.com/video-files/4585695/4585695-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </motion.video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(201,161,74,0.35),transparent_30%),linear-gradient(115deg,rgba(22,14,11,0.94),rgba(62,39,35,0.72)_48%,rgba(22,14,11,0.72))]" />
      <div className="grain-overlay" />

      <motion.div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-20 pt-32 md:px-8" style={{ y, opacity }}>
        <div className="grid w-full items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} className="glass-pill mb-8 inline-flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_18px_rgba(201,161,74,0.9)]" />
              {getGreeting()}, Kondhwa. The cafe is warming up.
            </motion.div>
            <motion.p variants={fadeUp} className="mb-4 text-sm uppercase tracking-[0.52em] text-gold">
              Premium cafe experience
            </motion.p>
            <motion.h1 variants={fadeUp} className="max-w-5xl font-display text-5xl font-extrabold leading-[0.95] sm:text-6xl md:text-8xl md:leading-[0.9] lg:text-9xl">
              Vintage Cafe
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-7 max-w-2xl text-lg leading-8 text-cream/82 md:text-xl">
              {business.tagline}. A warm modern hangout near ISKCON Temple, crafted for cold coffee rituals,
              street-food comfort, and late-night conversations that refuse to hurry.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="premium-button px-7 py-4" href="#menu">
                View Menu
                <ChevronRight size={18} />
              </a>
              <a className="secondary-button px-7 py-4" href="#order">
                Order Online
                <CalendarDays size={18} />
              </a>
            </motion.div>
          </motion.div>

          <motion.aside
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hero-card ml-auto w-full max-w-md"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-gold">Live profile</p>
                <h2 className="mt-3 font-display text-4xl font-bold">Top-rated local comfort</h2>
              </div>
              <div className="steam-cup" aria-hidden="true">
                <span />
                <span />
                <span />
                <Coffee size={30} />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <MetricSkeleton loading={isLoading} label="Rating" value={business.rating.toFixed(1)} suffix="/5" />
              <MetricSkeleton loading={isLoading} label="Reviews" value={`${business.reviewCount}+`} />
              <MetricSkeleton loading={isLoading} label="Since" value={business.since} />
            </div>
            <div className="mt-7 flex items-center gap-1 text-gold" aria-label={`${business.rating} star rating`}>
              {stars.map((filled, index) => (
                <Star key={index} size={18} className={filled ? "fill-current" : "text-cream/30"} />
              ))}
              <span className="ml-3 text-sm text-cream/72">{business.visitCount}+ public listing visits</span>
            </div>
            <div className="mt-7 rounded-3xl border border-white/10 bg-white/8 p-5">
              <div className="flex items-center gap-3 text-sm text-cream/72">
                <Clock size={17} className="text-gold" />
                Open daily
              </div>
              <p className="mt-2 text-xl font-semibold">{business.openingHours?.[0]?.split(": ").slice(1).join(": ")}</p>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}

function MetricSkeleton({ loading, label, value, suffix = "" }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/8 p-4">
      <span className="text-xs uppercase tracking-[0.28em] text-cream/55">{label}</span>
      {loading ? (
        <span className="mt-4 block h-8 rounded-full bg-cream/15 skeleton" />
      ) : (
        <strong className="mt-3 block font-display text-3xl">
          {value}
          <small className="font-body text-sm text-cream/60">{suffix}</small>
        </strong>
      )}
    </div>
  );
}

function AboutSection({ business }) {
  return (
    <section id="about" className="section-shell bg-cream text-coffee-900 dark:bg-coffee-950 dark:text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
        >
          <div className="about-orbit" aria-hidden="true" />
          <img
            className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-2xl"
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=84"
            alt="Warm premium cafe interior with wood and soft lighting"
            loading="lazy"
          />
          <div className="absolute -bottom-6 left-6 right-6 rounded-[2rem] border border-white/40 bg-white/70 p-5 shadow-neumorph backdrop-blur-xl dark:border-white/10 dark:bg-coffee-900/78">
            <p className="text-sm uppercase tracking-[0.32em] text-gold">Signature mood</p>
            <p className="mt-2 font-display text-2xl font-bold">Vintage warmth, modern rhythm.</p>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.p variants={fadeUp} className="section-kicker">
            Our story
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title max-w-3xl">
            A neighborhood cafe with the polish of a destination brand.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-lg leading-8 text-coffee-800/75 dark:text-cream/74">
            Vintage Cafe began in {business.since} with a simple promise: keep the food familiar, the energy friendly,
            and the space memorable. The menu leans into crowd favorites like cold coffee, sandwiches, Chinese,
            pizza, pasta, dosa, pav bhaji, burgers, Maggi, nachos, and mastani, wrapped in a cafe experience made
            for students, families, celebrations, and coffee-led work sessions.
          </motion.p>
          <motion.div variants={stagger} className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["4.3", "Public rating"],
              ["INR 450", "Approx. for two"],
              ["Daily", "Open for visits"]
            ].map(([value, label]) => (
              <motion.div key={label} variants={fadeUp} className="soft-card p-5">
                <strong className="block font-display text-4xl text-coffee-800 dark:text-cream">{value}</strong>
                <span className="mt-2 block text-sm text-coffee-800/60 dark:text-cream/62">{label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function MenuSection() {
  const [active, setActive] = useState(menuCategories[0].id);
  const activeCategory = menuCategories.find((category) => category.id === active) || menuCategories[0];

  return (
    <section id="menu" className="section-shell relative overflow-hidden bg-[#f0dcc2] text-coffee-900 dark:bg-[#120b08] dark:text-cream">
      <div className="menu-texture" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-kicker">
            Menu highlights
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Familiar plates, dressed for a premium cafe moment.
          </motion.h2>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Menu categories">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              className={cn("tab-button", active === category.id && "tab-button--active")}
              type="button"
              onClick={() => setActive(category.id)}
              role="tab"
              aria-selected={active === category.id}
            >
              {category.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            className="mt-10"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.35 }}
          >
            <p className="mx-auto max-w-2xl text-center text-coffee-800/70 dark:text-cream/70">{activeCategory.intro}</p>
            <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {activeCategory.items.map((item) => (
                <article key={item.name} className="menu-card group">
                  <div className="relative h-56 overflow-hidden rounded-[1.75rem]">
                    <img
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-coffee-950/72 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur">
                      {item.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-2xl font-bold">{item.name}</h3>
                      <span className="rounded-full bg-gold/16 px-3 py-1 text-sm font-semibold text-coffee-800 dark:text-gold">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-coffee-800/68 dark:text-cream/68">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ImageWithSkeleton({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && <div className="absolute inset-0 skeleton rounded-[inherit]" />}
      <img
        className={cn("h-full w-full object-cover transition duration-700", loaded ? "opacity-100" : "opacity-0")}
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function GallerySection({ images = galleryImages }) {
  const [selected, setSelected] = useState(null);

  return (
    <section id="gallery" className="section-shell bg-coffee-950 text-cream">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <motion.p variants={fadeUp} className="section-kicker">
              Gallery
            </motion.p>
            <motion.h2 variants={fadeUp} className="section-title">
              A mosaic of warm lights, full tables, and coffee-led pauses.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-cream/70">
              These visuals use premium fallback imagery. When a Google Places API key is added, the backend can
              return approved place photo references through the same data contract.
            </motion.p>
          </motion.div>

          <div className="columns-1 gap-5 sm:columns-2">
            {images.map((image, index) => (
              <motion.button
                key={image.title}
                className="gallery-tile group mb-5 block w-full break-inside-avoid text-left"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelected(image)}
                aria-label={`Preview ${image.title}`}
              >
                <ImageWithSkeleton
                  className={cn("rounded-[2rem]", index % 3 === 0 ? "h-[30rem]" : "h-80")}
                  src={image.image}
                  alt={image.title}
                />
                <span className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/10 bg-coffee-950/66 p-4 backdrop-blur-xl">
                  <span className="block text-xs uppercase tracking-[0.3em] text-gold">{image.type}</span>
                  <strong className="mt-1 block font-display text-2xl">{image.title}</strong>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-coffee-950/90 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-coffee-900"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 z-10 rounded-full bg-cream p-3 text-coffee-900 shadow-xl"
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close gallery preview"
              >
                <X size={20} />
              </button>
              <img className="max-h-[78vh] w-full object-cover" src={selected.image} alt={selected.title} />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.32em] text-gold">{selected.type}</p>
                <h3 className="mt-2 font-display text-3xl">{selected.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewsSection({ business }) {
  const [active, setActive] = useState(0);
  const reviewItems = useMemo(() => {
    if (business.googleReviews?.length) {
      return business.googleReviews.map((review) => ({
        name: review.author_name || "Google reviewer",
        role: "Google review",
        quote: review.text || "A warm local cafe experience.",
        rating: review.rating || business.rating
      }));
    }
    return testimonials;
  }, [business.googleReviews, business.rating]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % reviewItems.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reviewItems.length]);

  const currentReview = reviewItems[active] || reviewItems[0];

  return (
    <section id="reviews" className="section-shell bg-cream text-coffee-900 dark:bg-coffee-950 dark:text-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-kicker">
            Guest love
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Public ratings say dependable. Guests say familiar, friendly, and worth revisiting.
          </motion.h2>
          <motion.div variants={fadeUp} className="rating-orb mt-9">
            <div>
              <strong>{business.rating.toFixed(1)}</strong>
              <span>Google-ready rating</span>
            </div>
            <div className="flex text-gold">
              {createStarArray(business.rating).map((filled, index) => (
                <Star key={index} size={20} className={filled ? "fill-current" : "text-coffee-800/20"} />
              ))}
            </div>
            <p>{business.reviewCount}+ reviews across public local directories.</p>
          </motion.div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.article
              key={currentReview.name}
              className="testimonial-card"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45 }}
            >
              <Quote className="text-gold" size={40} />
              <p className="mt-8 font-display text-3xl leading-snug md:text-4xl">"{currentReview.quote}"</p>
              <div className="mt-10 flex items-center justify-between gap-6">
                <div>
                  <strong className="block text-lg">{currentReview.name}</strong>
                  <span className="text-sm text-coffee-800/60 dark:text-cream/62">{currentReview.role}</span>
                </div>
                <div className="flex text-gold">
                  {createStarArray(currentReview.rating).map((filled, index) => (
                    <Star key={index} size={18} className={filled ? "fill-current" : "text-cream/25"} />
                  ))}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
          <div className="mt-5 flex gap-3">
            {reviewItems.map((testimonial, index) => (
              <button
                key={testimonial.name}
                className={cn("carousel-dot", active === index && "carousel-dot--active")}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationSection({ business }) {
  const hours = business.openingHours || fallbackBusiness.openingHours;

  return (
    <section id="location" className="section-shell bg-[#efe0cb] text-coffee-900 dark:bg-[#140c09] dark:text-cream">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          className="grid gap-8 lg:grid-cols-[1fr_0.86fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="map-shell">
            <iframe
              title="Vintage Cafe location map"
              src={business.mapEmbed || fallbackBusiness.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>

          <motion.div variants={fadeUp} className="location-card">
            <p className="section-kicker">Location and contact</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Find us near ISKCON Temple, Kondhwa.</h2>
            <div className="mt-7 grid gap-4">
              <InfoLine icon={<MapPin size={20} />} label="Address" value={business.address} />
              <InfoLine icon={<Phone size={20} />} label="Phone" value={business.phoneDisplay} href={`tel:${business.phone}`} />
              <InfoLine icon={<Navigation size={20} />} label="Maps" value="Open turn-by-turn directions" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`} />
            </div>
            <div className="mt-8 rounded-[1.75rem] border border-coffee-800/10 bg-white/50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="text-gold" size={20} />
                <strong>Opening Hours</strong>
              </div>
              <div className="grid gap-2 text-sm text-coffee-800/72 dark:text-cream/70">
                {hours.map((line) => (
                  <div key={line} className="flex justify-between gap-4 border-b border-coffee-800/8 pb-2 last:border-0">
                    <span>{line.split(": ")[0]}</span>
                    <span>{line.split(": ").slice(1).join(": ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoLine({ icon, label, value, href }) {
  const content = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold/16 text-gold">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-[0.28em] text-coffee-800/48 dark:text-cream/45">{label}</span>
        <span className="mt-1 block font-medium leading-6">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a className="info-line" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {content}
      </a>
    );
  }

  return <div className="info-line">{content}</div>;
}

function OrderSection({ business }) {
  const [selectedItemName, setSelectedItemName] = useState(orderMenuItems[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    fulfillmentType: "pickup",
    requestedTime: "",
    address: "",
    notes: "",
    paymentMode: "pay-at-cafe"
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");

  const selectedItem = orderMenuItems.find((item) => item.name === selectedItemName) || orderMenuItems[0];
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = () => {
    if (!selectedItem) return;
    setCart((current) => {
      const existing = current.find((item) => item.name === selectedItem.name);
      if (existing) {
        return current.map((item) =>
          item.name === selectedItem.name
            ? { ...item, quantity: Math.min(25, item.quantity + Number(quantity)) }
            : item
        );
      }
      return [
        ...current,
        {
          name: selectedItem.name,
          price: selectedItem.priceValue,
          quantity: Number(quantity),
          category: selectedItem.category
        }
      ];
    });
  };

  const removeFromCart = (name) => {
    setCart((current) => current.filter((item) => item.name !== name));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      setStatus("error");
      setMessage("Please add at least one menu item before placing the order.");
      return;
    }

    setStatus("loading");
    setMessage("");
    setOrderNumber("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          items: cart.map(({ name, quantity: itemQuantity, price }) => ({
            name,
            quantity: itemQuantity,
            price
          }))
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not place order");
      setStatus("success");
      setOrderNumber(payload.orderNumber || payload.id || "");
      setMessage(payload.message || "Your order is in. Vintage Cafe will confirm shortly.");
      setForm({
        customerName: "",
        phone: "",
        fulfillmentType: "pickup",
        requestedTime: "",
        address: "",
        notes: "",
        paymentMode: "pay-at-cafe"
      });
      setCart([]);
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Online ordering is offline. Please call the cafe.");
    }
  };

  return (
    <section id="order" className="section-shell relative overflow-hidden bg-coffee-950 text-cream">
      <div className="order-glow" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <motion.p variants={fadeUp} className="section-kicker">
            Online ordering
          </motion.p>
          <motion.h2 variants={fadeUp} className="section-title">
            Order cafe favorites before you arrive.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 max-w-xl leading-8 text-cream/70">
            Choose your items, pickup or dine in, and send the order straight to the cafe backend. With
            `MONGODB_URI` configured, every order is saved permanently in the `orders` collection.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
            <a className="secondary-button px-6 py-4" href={`tel:${business.phone}`}>
              <Phone size={18} />
              Click to call
            </a>
            <a
              className="secondary-button px-6 py-4"
              href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hi Vintage Cafe, I would like to place an online order.")}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              WhatsApp chat
            </a>
          </motion.div>
        </motion.div>

        <motion.form
          className="order-card"
          onSubmit={submit}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="rounded-[1.7rem] border border-white/10 bg-white/7 p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_7rem_auto]">
              <label className="field">
                <span>Select item</span>
                <select
                  value={selectedItemName}
                  onChange={(event) => setSelectedItemName(event.target.value)}
                  aria-label="Select menu item"
                >
                  {orderMenuItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} - {item.price}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Qty</span>
                <input
                  type="number"
                  min="1"
                  max="25"
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}
                />
              </label>
              <button className="premium-button self-end px-5 py-4" type="button" onClick={addToCart}>
                Add
              </button>
            </div>

            <div className="mt-5 rounded-[1.35rem] bg-coffee-950/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <strong>Your order</strong>
                <span className="text-sm text-gold">INR {totalAmount}</span>
              </div>
              {cart.length ? (
                <div className="grid gap-3">
                  {cart.map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-4 rounded-2xl bg-white/7 px-4 py-3">
                      <div>
                        <strong className="block text-sm">{item.name}</strong>
                        <span className="text-xs text-cream/55">
                          {item.category} x {item.quantity} - INR {item.price * item.quantity}
                        </span>
                      </div>
                      <button
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-cream/70 transition hover:bg-white/18"
                        type="button"
                        onClick={() => removeFromCart(item.name)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cream/55">Add items from the menu to start your order.</p>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="field">
              <span>Customer name</span>
              <input
                type="text"
                name="customerName"
                placeholder="Your name"
                value={form.customerName}
                onChange={(event) => setForm({ ...form, customerName: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                placeholder="+91..."
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Pickup / dine-in time</span>
              <input
                type="datetime-local"
                name="requestedTime"
                value={form.requestedTime}
                onChange={(event) => setForm({ ...form, requestedTime: event.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Order type</span>
              <select
                name="fulfillmentType"
                value={form.fulfillmentType}
                onChange={(event) => setForm({ ...form, fulfillmentType: event.target.value })}
              >
                <option value="pickup">Pickup</option>
                <option value="dine-in">Dine-in</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>
          </div>

          {form.fulfillmentType === "delivery" && (
            <label className="field mt-5">
              <span>Delivery address</span>
              <input
                type="text"
                name="address"
                placeholder="Flat, society, landmark"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
              />
            </label>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="field">
              <span>Payment</span>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={(event) => setForm({ ...form, paymentMode: event.target.value })}
              >
                <option value="pay-at-cafe">Pay at cafe</option>
                <option value="upi-on-confirmation">UPI on confirmation</option>
              </select>
            </label>
            <label className="field">
              <span>Notes</span>
              <input
                type="text"
                name="notes"
                placeholder="Less spicy, extra cheese..."
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </label>
          </div>

          <button className="premium-button mt-6 w-full justify-center py-4" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending order..." : "Place Online Order"}
            <Send size={18} />
          </button>
          <AnimatePresence>
            {message && (
              <motion.div
                className={cn("form-status", status === "success" ? "form-status--success" : "form-status--error")}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
              >
                {status === "success" && <CheckCircle2 size={20} />}
                <span>
                  {message}
                  {orderNumber && (
                    <>
                      {" "}
                      Order ID: <strong className="text-gold">{orderNumber}</strong>
                    </>
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

function Footer({ business }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="bg-[#0d0806] px-4 py-12 text-cream md:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <a href="#top" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-coffee-800">
              <Coffee size={22} />
            </span>
            <span className="font-display text-3xl font-bold">Vintage Cafe</span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-7 text-cream/62">
            A premium cafe identity for Kondhwa Budruk: warm, social, flavorful, and ready for modern online
            orders.
          </p>
          <div className="mt-6 flex gap-3">
            <a className="social-link" href="#" aria-label="Vintage Cafe on Instagram">
              <Instagram size={18} />
            </a>
            <a className="social-link" href="#" aria-label="Vintage Cafe on Facebook">
              <Facebook size={18} />
            </a>
            <a className="social-link" href={`mailto:hello@vintagecafe.example`} aria-label="Email Vintage Cafe">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="footer-title">Explore</h3>
          {["Story", "Menu", "Gallery", "Reviews", "Order Online"].map((item) => (
            <a
              key={item}
              className="footer-link"
              href={`#${item === "Story" ? "about" : item === "Order Online" ? "order" : item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <h3 className="footer-title">Hours</h3>
          <p className="text-sm leading-7 text-cream/62">Open daily</p>
          <p className="mt-2 font-semibold">{business.openingHours?.[0]?.split(": ").slice(1).join(": ")}</p>
          <a className="footer-link mt-5" href={`tel:${business.phone}`}>
            {business.phoneDisplay}
          </a>
        </div>

        <div>
          <h3 className="footer-title">Newsletter</h3>
          <p className="text-sm leading-7 text-cream/62">Get offers, new menu drops, and celebration table alerts.</p>
          <form
            className="mt-5 flex overflow-hidden rounded-full border border-white/12 bg-white/8 p-1"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
              setEmail("");
            }}
          >
            <input
              className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-cream/36"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              aria-label="Newsletter email"
            />
            <button className="rounded-full bg-gold px-4 py-3 text-coffee-950" type="submit" aria-label="Subscribe">
              <Send size={16} />
            </button>
          </form>
          {subscribed && <p className="mt-3 text-sm text-gold">You are on the list.</p>}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-6 text-xs text-cream/45 md:flex-row md:items-center md:justify-between">
        <span>Copyright {new Date().getFullYear()} Vintage Cafe. Built for high-performance deployment.</span>
        <span>{business.shortAddress}</span>
      </div>
    </footer>
  );
}

function FloatingWhatsApp({ business }) {
  return (
    <a
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.35)] transition hover:-translate-y-1"
      href={`https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Hi Vintage Cafe, I found your website and would like to know more.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Vintage Cafe on WhatsApp"
    >
      <MessageCircle size={26} />
    </a>
  );
}

function DataSourceStrip() {
  return (
    <section className="bg-coffee-950 px-4 py-4 text-cream md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-xs text-cream/60 md:flex-row md:items-center md:justify-between">
        <span>Business data uses public-directory fallback plus Google Places-ready API hooks.</span>
        <div className="flex flex-wrap gap-3">
          {businessSources.map((source) => (
            <a key={source.label} className="text-gold hover:text-honey" href={source.url} target="_blank" rel="noreferrer">
              {source.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const ADMIN_TOKEN_KEY = "vintage-admin-token";
const ADMIN_SOUND_KEY = "vintage-admin-sound-alerts";
const ORDER_ALERT_INTERVAL_MS = 15000;
let adminAudioContext;

const adminStatusMeta = {
  new: {
    title: "New Orders",
    label: "New",
    icon: PackagePlus,
    tone: "bg-gold/18 text-gold border-gold/25"
  },
  pending: {
    title: "Pending Orders",
    label: "Pending",
    icon: TimerReset,
    tone: "bg-sky-400/12 text-sky-200 border-sky-300/20"
  },
  delivered: {
    title: "Delivered Orders",
    label: "Delivered",
    icon: PackageCheck,
    tone: "bg-emerald-400/12 text-emerald-200 border-emerald-300/20"
  }
};

function getOrderId(order) {
  return order._id || order.id || order.orderNumber;
}

async function unlockAdminAudio() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  adminAudioContext ||= new AudioContext();
  if (adminAudioContext.state === "suspended") {
    await adminAudioContext.resume();
  }

  return adminAudioContext;
}

async function playNewOrderAlert() {
  const audio = await unlockAdminAudio();
  if (!audio || audio.state !== "running") return false;

  const now = audio.currentTime;
  const tones = [
    [740, 0, 0.18],
    [988, 0.2, 0.2],
    [1244, 0.44, 0.28]
  ];

  tones.forEach(([frequency, start, duration]) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(0.09, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration + 0.03);
  });

  if (navigator.vibrate) {
    navigator.vibrate([130, 45, 130]);
  }

  return true;
}

function normalizeAdminStatus(status = "new") {
  if (["delivered", "completed"].includes(status)) return "delivered";
  if (status === "new") return "new";
  return "pending";
}

function formatAdminDate(value) {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function formatOrderType(value = "pickup") {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function AdminMetric({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/7 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cream/45">{label}</p>
          <strong className="mt-3 block font-display text-4xl text-cream">{value}</strong>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold/20 bg-gold/12 text-gold">
          <Icon size={22} />
        </span>
      </div>
      {detail && <p className="mt-4 text-sm text-cream/55">{detail}</p>}
    </div>
  );
}

function AdminLogin({ business, onLogin }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not unlock admin.");
      onLogin(payload.token);
      setPassword("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Incorrect password.");
    } finally {
      setStatus((current) => (current === "loading" ? "idle" : current));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-coffee-950 text-cream">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-28"
        src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1800&q=84"
        alt=""
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(13,8,6,0.98),rgba(36,21,17,0.9)_52%,rgba(13,8,6,0.78))]" />
      <section className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-4 py-12 md:px-8 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-coffee-800">
              <Coffee size={22} />
            </span>
            <span>
              <span className="block font-display text-2xl font-bold sm:text-3xl">{business.name}</span>
              <span className="block text-xs uppercase tracking-[0.35em] text-gold">Admin desk</span>
            </span>
          </a>
          <p className="section-kicker mt-12">Private access</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-7xl">
            Order control for today&apos;s cafe service.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-cream/65">
            Review incoming orders, move active requests through pending, and keep completed service neatly archived.
          </p>
        </div>

        <form
          className="rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:p-8"
          onSubmit={submit}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-gold/20 bg-gold/12 text-gold">
            <LockKeyhole size={24} />
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">Admin Login</h2>
          <label className="field mt-7">
            <span>Password</span>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button className="premium-button mt-6 w-full py-4" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Unlocking..." : "Unlock Admin"}
            <ShieldCheck size={18} />
          </button>
          {message && <p className="form-status form-status--error">{message}</p>}
        </form>
      </section>
    </main>
  );
}

function AdminOrderCard({ order, onStatusChange, updating }) {
  const normalizedStatus = normalizeAdminStatus(order.status);
  const statusMeta = adminStatusMeta[normalizedStatus];
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.totalAmount || 0);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/7 p-4 shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cream/42">{order.orderNumber || "New order"}</p>
          <h3 className="mt-2 text-xl font-bold text-cream">{order.customerName}</h3>
          <a className="mt-1 inline-flex text-sm text-gold" href={`tel:${order.phone}`}>
            {order.phone}
          </a>
        </div>
        <span className={cn("rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]", statusMeta.tone)}>
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-cream/68">
        <div className="flex items-center justify-between gap-4 rounded-xl bg-coffee-950/35 px-3 py-2">
          <span>{formatOrderType(order.fulfillmentType)}</span>
          <strong className="text-cream">INR {total}</strong>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gold" />
          <span>{formatAdminDate(order.requestedTime)}</span>
        </div>
        {order.address && <p className="rounded-xl bg-white/6 px-3 py-2">{order.address}</p>}
        {order.notes && <p className="rounded-xl bg-white/6 px-3 py-2">Note: {order.notes}</p>}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-cream/42">Items</p>
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={`${order.orderNumber}-${item.name}`} className="flex justify-between gap-4 text-sm text-cream/72">
              <span>
                {item.quantity} x {item.name}
              </span>
              <span>INR {Number(item.price || 0) * Number(item.quantity || 0)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {normalizedStatus !== "pending" && (
          <button
            className="secondary-button py-3 text-sm"
            type="button"
            disabled={updating}
            onClick={() => onStatusChange(order, "pending")}
          >
            Move Pending
          </button>
        )}
        {normalizedStatus !== "delivered" && (
          <button
            className="premium-button py-3 text-sm"
            type="button"
            disabled={updating}
            onClick={() => onStatusChange(order, "delivered")}
          >
            Mark Delivered
          </button>
        )}
        {normalizedStatus !== "new" && (
          <button
            className="secondary-button py-3 text-sm"
            type="button"
            disabled={updating}
            onClick={() => onStatusChange(order, "new")}
          >
            Reopen
          </button>
        )}
      </div>
    </article>
  );
}

function AdminOrderSection({ status, orders, onStatusChange, updatingId }) {
  const meta = adminStatusMeta[status];
  const Icon = meta.icon;

  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className={cn("grid h-11 w-11 place-items-center rounded-2xl border", meta.tone)}>
            <Icon size={20} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold">{meta.title}</h2>
            <p className="text-sm text-cream/48">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <AdminOrderCard
              key={getOrderId(order)}
              order={order}
              onStatusChange={onStatusChange}
              updating={updatingId === getOrderId(order)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/14 p-6 text-sm text-cream/48">
            No {meta.label.toLowerCase()} orders right now.
          </div>
        )}
      </div>
    </section>
  );
}

function AdminPage({ business }) {
  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || "";
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mongoReady, setMongoReady] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(ADMIN_SOUND_KEY) === "on";
  });
  const [soundStatus, setSoundStatus] = useState("Enable sound alerts to hear a chime for every new order.");
  const knownOrderIdsRef = useRef(new Set());
  const initialOrdersLoadedRef = useRef(false);
  const soundAlertsEnabledRef = useRef(soundAlertsEnabled);

  const login = (nextToken) => {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, nextToken);
    setToken(nextToken);
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setOrders([]);
    knownOrderIdsRef.current = new Set();
    initialOrdersLoadedRef.current = false;
  };

  useEffect(() => {
    soundAlertsEnabledRef.current = soundAlertsEnabled;
    sessionStorage.setItem(ADMIN_SOUND_KEY, soundAlertsEnabled ? "on" : "off");
  }, [soundAlertsEnabled]);

  const enableSoundAlerts = async () => {
    const played = await playNewOrderAlert();
    setSoundAlertsEnabled(true);
    setSoundStatus(
      played
        ? "Sound alerts are on. Keep this admin page open to hear new orders."
        : "Sound alerts are on, but this browser blocked the test chime. Tap again if needed."
    );
  };

  const fetchOrders = async ({ silent = false } = {}) => {
    if (!token) return;
    if (!silent) {
      setLoading(true);
      setMessage("");
    }

    try {
      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const payload = await response.json();
      if (response.status === 401) {
        logout();
        throw new Error("Admin session expired. Please login again.");
      }
      if (!response.ok) throw new Error(payload.message || "Could not load orders.");
      const nextOrders = Array.isArray(payload.orders) ? payload.orders : [];
      const nextOrderIds = new Set(nextOrders.map(getOrderId).filter(Boolean));
      const incomingOrders = nextOrders.filter((order) => {
        const id = getOrderId(order);
        return id && !knownOrderIdsRef.current.has(id);
      });

      if (initialOrdersLoadedRef.current && incomingOrders.length > 0) {
        if (soundAlertsEnabledRef.current) {
          const played = await playNewOrderAlert();
          setSoundStatus(
            played
              ? `${incomingOrders.length} new order${incomingOrders.length === 1 ? "" : "s"} received. Sound played.`
              : "New order received, but the browser blocked sound. Tap Enable Sound again."
          );
        } else {
          setSoundStatus("New order received. Enable sound alerts to hear the next one.");
        }
      }

      knownOrderIdsRef.current = nextOrderIds;
      initialOrdersLoadedRef.current = true;
      setOrders(nextOrders);
      setMongoReady(Boolean(payload.mongoReady));
    } catch (error) {
      setMessage(error.message || "Could not load orders.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return undefined;

    fetchOrders();
    const intervalId = window.setInterval(() => {
      fetchOrders({ silent: true });
    }, ORDER_ALERT_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [token]);

  const groupedOrders = useMemo(
    () =>
      orders.reduce(
        (groups, order) => {
          groups[normalizeAdminStatus(order.status)].push(order);
          return groups;
        },
        { new: [], pending: [], delivered: [] }
      ),
    [orders]
  );

  const revenue = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders]
  );

  const updateStatus = async (order, status) => {
    const id = getOrderId(order);
    setUpdatingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message || "Could not update order.");
      setOrders((current) => current.map((item) => (getOrderId(item) === id ? payload.order : item)));
    } catch (error) {
      setMessage(error.message || "Could not update order.");
    } finally {
      setUpdatingId("");
    }
  };

  if (!token) {
    return <AdminLogin business={business} onLogin={login} />;
  }

  return (
    <main className="min-h-screen bg-[#0d0806] text-cream">
      <section className="border-b border-white/10 bg-coffee-950/92 px-4 py-5 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/" className="inline-flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-coffee-800">
              <Coffee size={22} />
            </span>
            <span>
              <span className="block font-display text-2xl font-bold sm:text-3xl">{business.name}</span>
              <span className="block text-xs uppercase tracking-[0.35em] text-gold">Admin orders</span>
            </span>
          </a>
          <div className="flex flex-wrap gap-3">
            <button
              className={cn("secondary-button px-5 py-3 text-sm", soundAlertsEnabled && "admin-sound-button--active")}
              type="button"
              onClick={enableSoundAlerts}
            >
              <BellRing size={17} />
              {soundAlertsEnabled ? "Test Sound" : "Enable Sound"}
            </button>
            <button className="secondary-button px-5 py-3 text-sm" type="button" onClick={fetchOrders} disabled={loading}>
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className="secondary-button px-5 py-3 text-sm" type="button" onClick={logout}>
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <AdminMetric icon={ClipboardList} label="Total Orders" value={orders.length} detail={mongoReady ? "Stored in MongoDB" : "Demo memory storage"} />
          <AdminMetric icon={PackagePlus} label="New" value={groupedOrders.new.length} detail="Fresh customer requests" />
          <AdminMetric icon={TimerReset} label="Pending" value={groupedOrders.pending.length} detail="Accepted or in progress" />
          <AdminMetric icon={PackageCheck} label="Value" value={`INR ${revenue}`} detail="Total order value shown" />
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/7 p-4 text-sm text-cream/62 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-2">
            <BellRing size={17} className={soundAlertsEnabled ? "text-gold" : "text-cream/35"} />
            {soundStatus}
          </span>
          <span className="text-cream/42">Auto-checks every {ORDER_ALERT_INTERVAL_MS / 1000} seconds.</span>
        </div>

        {message && <div className="form-status form-status--error mt-6">{message}</div>}

        <div className="mt-9 grid gap-8 xl:grid-cols-3">
          <AdminOrderSection
            status="new"
            orders={groupedOrders.new}
            onStatusChange={updateStatus}
            updatingId={updatingId}
          />
          <AdminOrderSection
            status="pending"
            orders={groupedOrders.pending}
            onStatusChange={updateStatus}
            updatingId={updatingId}
          />
          <AdminOrderSection
            status="delivered"
            orders={groupedOrders.delivered}
            onStatusChange={updateStatus}
            updatingId={updatingId}
          />
        </div>
      </section>
    </main>
  );
}

function App() {
  const [theme, setTheme] = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const { business, isLoading } = useBusinessData();
  const effectiveGallery = useMemo(
    () => (business.photos?.length ? business.photos : galleryImages),
    [business.photos]
  );
  const isAdminRoute =
    typeof window !== "undefined" && window.location.pathname.replace(/\/+$/, "") === "/admin";

  const schema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      name: business.name,
      image: effectiveGallery.map((item) => item.image),
      address: {
        "@type": "PostalAddress",
        streetAddress: "Shop no.15 & 16, Gagan Unnati, Katraj - Kondhwa Rd, next to Iskon Temple",
        addressLocality: "Kondhwa Budruk, Pune",
        addressRegion: "Maharashtra",
        postalCode: "411048",
        addressCountry: "IN"
      },
      telephone: business.phone,
      priceRange: "INR 450 for two",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: business.rating,
        reviewCount: business.reviewCount
      },
      servesCuisine: ["Cafe", "Chinese", "Fast Food", "South Indian", "Street Food"],
      openingHoursSpecification: business.openingHours?.map((line) => {
        const [day, hours] = line.split(": ");
        const [opens, closes] = hours.split(" - ");
        return {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: day,
          opens: toSchemaTime(opens),
          closes: toSchemaTime(closes)
        };
      })
    }),
    [business, effectiveGallery]
  );

  if (isAdminRoute) {
    return (
      <>
        <CursorGlow />
        <AdminPage business={business} />
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CursorGlow />
      <Header
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        business={business}
      />
      <main id="main">
        <Hero business={business} isLoading={isLoading} />
        <AboutSection business={business} />
        <MenuSection />
        <GallerySection images={effectiveGallery} />
        <ReviewsSection business={business} />
        <LocationSection business={business} />
        <OrderSection business={business} />
        <DataSourceStrip />
      </main>
      <Footer business={business} />
      <FloatingWhatsApp business={business} />
    </>
  );
}

export default App;
