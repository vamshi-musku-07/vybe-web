import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import bandNight from "./assets/events/band-night.png";
import bollyTech from "./assets/events/bolly-tech.png";
import clubNight from "./assets/events/club-night.png";
import comedyNight from "./assets/events/comedy-night.png";
import dining from "./assets/events/dining.png";
import fridayVibes from "./assets/events/friday-vibes.png";
import janmashtami from "./assets/events/janmashtami.png";
import "./mise.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const WORD_PINK = "#F22A72";
const WORD_DARK = "#57524f";

const PEOPLE = [bandNight, bollyTech, clubNight, comedyNight, dining, fridayVibes, janmashtami];

const SLOTS = [
  { w: "12.6vw", h: "34vh", y: "14vh" },
  { w: "13vw", h: "38vh", y: "30vh" },
  { w: "13.6vw", h: "40vh", y: "13vh" },
  { w: "13vw", h: "42vh", y: "3vh" },
  { w: "13.8vw", h: "43vh", y: "9vh" },
  { w: "12.6vw", h: "34vh", y: "31vh" },
  { w: "13.2vw", h: "38vh", y: "14vh" },
];

const CARDS = [0, 1, 2, 3, 4, 5, 6].flatMap((copy) =>
  SLOTS.map((slot, index) => ({
    src: PEOPLE[index],
    ...slot,
    key: `${copy}-${index}`,
  }))
);

export default function MiseSection() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    let ctx;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const copy = section.querySelector(".mise-copy");
        const words = new SplitText(section.querySelector(".mise-heading"), {
          type: "words",
          wordsClass: "word",
        }).words;

        gsap.set(copy, { y: -10 });
        gsap.set(words, { color: WORD_PINK });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 40%",
              end: "top 0%",
              scrub: 1,
            },
          })
          .to(copy, { y: 0 }, 0)
          .to(words, { color: WORD_DARK, stagger: 0.2 }, 0.1);
      }, section);
    };

    document.fonts.ready.then(start);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const track = trackRef.current;
    const centered = () => -(track.scrollWidth - frame.clientWidth) / 2;
    const travel = () => frame.clientWidth * 0.72;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { x: () => centered() - travel() },
        {
          x: () => centered() + travel(),
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, frame);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mise" aria-label="Crowd favourite events" ref={sectionRef}>
      <div className="mise-copy">
        <h2 className="mise-heading">Crowd favourite events</h2>
      </div>
      <div className="mise-frame" ref={frameRef}>
        <div className="mise-glow" />
        <div className="mise-type" aria-hidden="true">
          <span>The Attitude</span>
          <span>Entertainment</span>
        </div>

        <div className="mise-track" ref={trackRef}>
          {CARDS.map((card) => (
            <div className="mise-slot" key={card.key} style={{ width: card.w, paddingTop: card.y }}>
              <article className="mise-card" style={{ height: card.h }}>
                <img className="photo" src={card.src} alt="" />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
