import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import "./movies.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TMDB = "https://api.themoviedb.org/3";
const POSTER = "https://image.tmdb.org/t/p/w780";
const MOVIE_LIMIT = 18;
const PER_ROW = 6;
const WORD_PINK = "#F22A72";
const WORD_DARK = "#57524f";

function cardStart(index, count) {
  const t = count === 1 ? 0 : (index / (count - 1)) * 2 - 1;
  const abs = Math.abs(t);
  return {
    rotateX: 90 - abs * 32,
    rotateY: -t * 18,
    y: 18 + abs * 30,
  };
}

function rowsOf(movies) {
  const rows = [];
  for (let i = 0; i < movies.length; i += PER_ROW) {
    rows.push(movies.slice(i, i + PER_ROW));
  }
  return rows;
}

const LANGUAGE_NAMES = {
  te: "Telugu",
  hi: "Hindi",
  en: "English",
  ta: "Tamil",
  kn: "Kannada",
  ml: "Malayalam",
  mr: "Marathi",
  bn: "Bengali",
  pa: "Punjabi",
  gu: "Gujarati",
};

function languageName(code, fallback) {
  return LANGUAGE_NAMES[code] || fallback || (code ? code.toUpperCase() : null);
}

function languageLine(movie) {
  const names = [];
  const seen = new Set();

  const add = (code, name) => {
    const label = languageName(code, name);
    if (!label || seen.has(label)) return;
    seen.add(label);
    names.push(label);
  };

  add(movie.original_language);
  for (const entry of movie.spoken_languages ?? []) {
    add(entry.iso_639_1, entry.english_name || entry.name);
  }

  if (!names.length) return "English";
  if (names.length === 1) return names[0];
  return `${names[0]} and ${names.length - 1} more`;
}

function certificationLine(releaseDates) {
  const india = releaseDates?.results?.find((entry) => entry.iso_3166_1 === "IN");
  const certification = india?.release_dates?.find((entry) => entry.certification)?.certification;

  if (!certification) return "UA16+";

  const normalized = certification.replace(/[\s/]/g, "");
  if (normalized === "U" || normalized === "A") return normalized;
  if (normalized.startsWith("UA")) return normalized.includes("+") ? normalized : `${normalized}+`;
  if (/^\d+/.test(normalized)) return `UA${normalized}${normalized.includes("+") ? "" : "+"}`;
  return normalized;
}

async function tmdb(path, key) {
  const separator = path.includes("?") ? "&" : "?";
  const response = await fetch(`${TMDB}${path}${separator}api_key=${encodeURIComponent(key)}`);
  if (!response.ok) throw new Error("TMDB request failed");
  return response.json();
}

async function fetchMovies() {
  const key = import.meta.env.VITE_TMDB_API_KEY;
  if (!key) return [];

  const pages = await Promise.all([
    tmdb("/movie/now_playing?region=IN&page=1", key),
    tmdb("/movie/popular?region=IN&page=1", key),
    tmdb("/movie/top_rated?region=IN&page=1", key),
  ]);

  const seen = new Set();
  const picked = [];

  for (const page of pages) {
    for (const movie of page.results ?? []) {
      if (!movie.poster_path || seen.has(movie.id)) continue;
      seen.add(movie.id);
      picked.push(movie);
      if (picked.length === MOVIE_LIMIT) break;
    }
    if (picked.length === MOVIE_LIMIT) break;
  }

  const details = await Promise.all(
    picked.map(async (movie) => {
      try {
        return await tmdb(`/movie/${movie.id}?append_to_response=release_dates&language=en-IN`, key);
      } catch {
        return movie;
      }
    }),
  );

  return details.map((movie) => ({
    id: movie.id,
    title: movie.title,
    src: `${POSTER}${movie.poster_path}`,
    meta: `${certificationLine(movie.release_dates)} | ${languageLine(movie)}`,
  }));
}

export default function MoviesStand() {
  const sectionRef = useRef(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    fetchMovies()
      .then((list) => {
        if (!cancelled) setMovies(list);
      })
      .catch(() => {
        if (!cancelled) setMovies([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!movies.length) return undefined;

    const section = sectionRef.current;
    let ctx;
    let cancelled = false;

    const start = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const copy = section.querySelector(".stand-copy");
        const words = new SplitText(section.querySelector(".stand-heading"), {
          type: "words",
          wordsClass: "word",
        }).words;

        gsap.set(copy, { y: -10 });
        gsap.set(words, { color: WORD_PINK });

        const cards = section.querySelectorAll(".movie-card");
        section.querySelectorAll(".cards-stage").forEach((stage) => {
          const rowCards = stage.querySelectorAll(".movie-card");
          rowCards.forEach((card, index) => {
            gsap.set(card, {
              ...cardStart(index, rowCards.length),
              transformOrigin: "50% 100%",
              transformPerspective: 1560,
            });
          });
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "top 20%",
              scrub: 1,
            },
          })
          .to(copy, { y: 0 }, 0)
          .to(words, { color: WORD_DARK, stagger: 0.2 }, 0)
          .to(
            cards,
            {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              ease: "power1.inOut",
              duration: 1,
            },
            0,
          );
      }, section);

      ScrollTrigger.refresh();
    };

    document.fonts.ready.then(start);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [movies]);

  return (
    <section className="movies-stand" ref={sectionRef}>
      <div className="stand-copy">
        <h2 className="stand-heading">Movies</h2>
        <p className="stand-sub">Grab best seats at theatres around you</p>
      </div>
      <div className="movies-rows">
        {rowsOf(movies).map((row) => (
          <div className="cards-stage" key={row[0].id}>
            {row.map((movie) => (
              <article className="movie-card" key={movie.id}>
                <img src={movie.src} alt={movie.title} />
                <div className="movie-card-body">
                  <h3 className="movie-title">{movie.title}</h3>
                  <p className="movie-meta">{movie.meta}</p>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
