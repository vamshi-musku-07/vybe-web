import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./exo.css";

const BACKDROP = "https://image.tmdb.org/t/p/original";
const POSTER = "https://image.tmdb.org/t/p/original";

const PROJECTS = [
  {
    src: `${POSTER}/tZ8eSBXbza96vzCYeVTG9RBJ78E.jpg`,
    backdrop: `${BACKDROP}/tBRSSfgqOAq7YlG8udcoJIBm2FG.jpg`,
    alt: "Toxic",
    title: "Toxic",
    genres: "Action · Thriller · Drama",
    meta: "UA16+ · 2h 25m · 2026",
    synopsis: "A gangster fairytale that deserves to be seen in theatres.",
    cast: "Yash",
  },
  {
    src: `${POSTER}/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg`,
    backdrop: `${BACKDROP}/eZ239CUp1d6OryZEBPnO2n87gMG.jpg`,
    alt: "Dune",
    title: "Dune: Part Two",
    genres: "Science Fiction · Adventure · Drama",
    meta: "UA16+ · 2h 46m · 2024 · English",
    synopsis:
      "Paul Atreides unites with the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
  },
  {
    src: `${POSTER}/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdrop: `${BACKDROP}/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg`,
    alt: "Oppenheimer",
    title: "Oppenheimer",
    genres: "Drama · Thriller",
    meta: "UA16+ · 3h · 2023 · English",
    synopsis: "The story of J. Robert Oppenheimer and the race to build the atomic bomb.",
    cast: "Cillian Murphy",
  },
  {
    src: `${POSTER}/1T21FblunT0y8fz7YaW8JMYgUKm.jpg`,
    backdrop: `${BACKDROP}/7jGItf7idJsBm9QTNoTNTU3KiGe.jpg`,
    alt: "Pushpa",
    title: "Pushpa 2: The Rule",
    genres: "Action · Crime · Thriller",
    meta: "UA16+ · 3h 20m · 2024 · Telugu",
    synopsis: "Pushpa Raj's smuggling empire grows as rivals close in from every side.",
    cast: "Allu Arjun, Rashmika Mandanna",
  },
  {
    src: `${POSTER}/khNVygolU0TxLIDWff5tQlAhZ23.jpg`,
    backdrop: `${BACKDROP}/nsV5Mfi9FAV4w8eDsdr7uqVswOk.jpg`,
    alt: "KGF",
    title: "K.G.F: Chapter 2",
    genres: "Action · Drama · Crime",
    meta: "UA16+ · 2h 48m · 2022 · Telugu",
    synopsis: "Rocky rises to power in the Kolar Gold Fields with bloodier battles ahead.",
    cast: "Yash, Sanjay Dutt",
  },
  {
    src: `${POSTER}/s2Fkuq0tj7mjAHEdbfQkFkdbeRI.jpg`,
    backdrop: `${BACKDROP}/3eOINbgRs8WiWfQfViXeuZ3enrs.jpg`,
    alt: "Avengers: Doomsday",
    title: "Avengers: Doomsday",
    genres: "Science Fiction · Action · Adventure",
    meta: "UA16+ · 2h 45m · 2026 · English",
    synopsis:
      "Beloved heroes from three universes collide and face an existential threat unlike anything they have encountered.",
    cast: "Robert Downey Jr., Chris Evans, Chris Hemsworth",
  },
];

const EASE = "power3.inOut";
const DUR = 1.25;
const OPEN = "inset(0% 0% 0% 0%)";
const FROM_BOTTOM = "inset(100% 0% 0% 0%)";
const FROM_TOP = "inset(0% 0% 100% 0%)";

const pad = (n) => String(n).padStart(2, "0");

export default function ExoSlider() {
  const sliderRef = useRef(null);
  const mainImgRef = useRef(null);
  const countRef = useRef(null);
  const totalRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const mainBox = mainImgRef.current;
    const countBox = countRef.current;
    const detailsBox = detailsRef.current;
    const N = PROJECTS.length;

    const el = (tag, className, html) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (html != null) node.textContent = html;
      return node;
    };

    const pic = (project) => Object.assign(new Image(), { src: project.src, alt: project.alt });

    function build(i, dir) {
      const project = PROJECTS[i];
      const slide = el("div", "slide");

      const bg = el("div", "bg");
      bg.style.clipPath = dir ? (dir === 1 ? FROM_BOTTOM : FROM_TOP) : OPEN;
      bg.appendChild(pic({ src: project.backdrop, alt: project.alt }));
      slide.appendChild(bg);

      const wrap = el("div", "frame-img");
      wrap.style.clipPath = dir ? (dir === 1 ? FROM_TOP : FROM_BOTTOM) : OPEN;
      wrap.appendChild(pic(project));

      const c = el("p", "", pad(i + 1));

      const info = el("div", "detail");
      info.append(
        el("p", "detail-genres", project.genres),
        el("h2", "detail-title", project.title),
        el("p", "detail-meta", project.meta),
        el("p", "detail-synopsis", project.synopsis),
        el("p", "detail-label", "Cast"),
        el("p", "detail-cast", project.cast),
      );

      if (dir) {
        gsap.set([c, info], { yPercent: dir * 110 });
      }

      return { slide, wrap, c, info };
    }

    function mount(s) {
      slider.appendChild(s.slide);
      mainBox.appendChild(s.wrap);
      countBox.appendChild(s.c);
      detailsBox.appendChild(s.info);
      return s;
    }

    let cur = 0;
    let busy = false;
    totalRef.current.textContent = pad(N);
    let live = mount(build(0, 0));

    function go(dir) {
      if (busy) return;
      busy = true;

      const old = live;
      cur = (cur + dir + N) % N;
      const next = (live = mount(build(cur, dir)));

      const newBg = next.slide.firstChild.firstChild;
      const oldBg = old.slide.firstChild.firstChild;

      gsap.set(newBg, { scale: 1.06 });
      gsap.set(next.wrap.firstChild, { yPercent: -dir * 50 });

      gsap
        .timeline({
          defaults: { duration: DUR, ease: EASE },
          onComplete() {
            [old.slide, old.wrap, old.c, old.info].forEach((node) => node.remove());
            busy = false;
          },
        })
        .to(next.slide.firstChild, { clipPath: OPEN }, 0)
        .to(newBg, { scale: 1 }, 0)
        .to(oldBg, { scale: 1.03 }, 0)
        .to(next.wrap, { clipPath: OPEN }, 0)
        .to(old.wrap.firstChild, { yPercent: dir * 50 }, 0)
        .to(next.wrap.firstChild, { yPercent: 0 }, 0)
        .to([old.c, old.info], { yPercent: -dir * 110 }, 0)
        .to([next.c, next.info], { yPercent: 0 }, 0);
    }

    let timer = 0;
    const start = window.setTimeout(() => {
      timer = window.setInterval(() => go(1), 4000);
    }, 6000);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
      gsap.killTweensOf([slider, mainBox, countBox, detailsBox]);
      slider.querySelectorAll(".slide").forEach((node) => node.remove());
      mainBox.replaceChildren();
      countBox.replaceChildren();
      detailsBox.replaceChildren();
    };
  }, []);

  return (
    <div className="exo" id="top">
      <div className="slider" ref={sliderRef}>
        <div className="details" ref={detailsRef} />
        <div className="frame" id="mainImg" ref={mainImgRef} />
      </div>

      <footer>
        <div className="counter">
          <div className="count" ref={countRef} />
          <p className="sep">/</p>
          <p className="total" ref={totalRef} />
        </div>
      </footer>
    </div>
  );
}
