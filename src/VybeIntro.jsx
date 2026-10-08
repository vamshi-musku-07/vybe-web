import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import toxic from "./assets/posters/toxic.jpg";
import dune from "./assets/posters/dune.jpg";
import oppenheimer from "./assets/posters/oppenheimer.jpg";
import pushpa from "./assets/posters/pushpa.jpg";
import kgf from "./assets/posters/kgf.jpg";
import spiderman from "./assets/posters/spiderman-poster.jpg";
import "./intro.css";

gsap.registerPlugin(SplitText);

const CARDS = [
  { src: toxic, alt: "Toxic" },
  { src: dune, alt: "Dune" },
  { src: oppenheimer, alt: "Oppenheimer" },
  { src: pushpa, alt: "Pushpa" },
  { src: kgf, alt: "KGF" },
  { src: spiderman, alt: "Spider-Man" },
];

const ROTATIONS = [8, -3, -10, 10, -7, 5];

export default function VybeIntro() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const counter = root.querySelector(".count p");
    let ctx;

    const start = () => {
      ctx = gsap.context(() => {
        const title = new SplitText(".title", { type: "chars", mask: "chars" });

        gsap.set(".card", {
          xPercent: -50,
          yPercent: -50,
          scale: 0,
          rotate: (i) => ROTATIONS[i],
        });

        gsap.set(title.chars, {
          yPercent: 100,
          rotation: 10,
          transformOrigin: "0% 100%",
        });

        gsap.set(".count p", { yPercent: 100 });

        const tl = gsap.timeline({ delay: 0.5 });

        tl.to(".card", {
          scale: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1,
          ease: "power3.inOut",
          stagger: 0.2,
        });

        tl.set(".brand", { visibility: "visible" }, 0.35);

        tl.to(
          title.chars,
          {
            yPercent: 0,
            rotation: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.04,
          },
          0.35,
        );

        tl.to(".count p", { yPercent: 0, duration: 1, ease: "power3.out" }, "<");

        tl.to(
          { value: 0 },
          {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate() {
              counter.textContent = String(Math.round(this.targets()[0].value)).padStart(3, "0");
            },
          },
          "<0.5",
        );

        tl.to(
          title.chars,
          {
            yPercent: -100,
            rotation: -10,
            duration: 0.75,
            ease: "power3.in",
            stagger: 0.04,
          },
          3.25,
        );

        tl.to(".count p", { yPercent: -100, duration: 0.75, ease: "power3.in" }, 3.25);

        tl.to(
          ".card",
          {
            scale: 0,
            clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
            duration: 1,
            ease: "power3.inOut",
            stagger: -0.075,
          },
          3.5,
        );

        tl.to(
          ".loader",
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1,
            ease: "power3.inOut",
          },
          4.35,
        );
      }, root);
    };

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) start();
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="vybe-intro">
      <div className="loader">
        {CARDS.map((card) => (
          <div className="card" key={card.alt}>
            <img src={card.src} alt={card.alt} />
          </div>
        ))}

        <div className="brand">
          <h1 className="title">Vybe</h1>
          <div className="count">
            <p>000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
