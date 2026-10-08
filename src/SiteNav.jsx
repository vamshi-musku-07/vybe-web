import { useEffect, useRef, useState } from "react";
import avatar from "./assets/profile-avatar.png";
import "./site-nav.css";

const CITIES = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Pune"];

const TABS = [
  {
    id: "movies",
    label: "Movies",
    target: ".movies-stand",
    icon: "M4 7h16v12H4V7zm2 2v8h12V9H6zM8 4v3M16 4v3",
  },
  {
    id: "events",
    label: "Events",
    target: ".desi",
    icon: "M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2z",
  },
  {
    id: "activities",
    label: "Activities",
    target: ".play-near",
    icon: "M12 3.2 14.2 8l5.3.5-4 3.6 1.2 5.1L12 14.6 7.3 17.2 8.5 12 4.5 8.5 9.8 8 12 3.2z",
  },
  {
    id: "play",
    label: "Play",
    icon: "M7 4.5v15l13-7.5L7 4.5z",
  },
];

function LogoMark() {
  return (
    <svg viewBox="0 0 56 40" aria-hidden="true">
      <path d="M43 0C50.1797 6.44277e-07 56 5.8203 56 13C56 20.1797 50.1797 26 43 26H34.4844L48.4844 40H31.5156L15.7578 24.2422C14.672 23.1564 14 21.6569 14 20C14 16.6863 16.6863 14 20 14H43C43.5523 14 44 13.5523 44 13C44 12.4477 43.5523 12 43 12H20C15.5817 12 12 15.5817 12 20C12 22.3901 13.0482 24.5347 14.71 26H14.6875L28.6875 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.9543 0 20 0H43Z" />
      <path d="M56 28V40H51.3125L39.3125 28H56Z" />
    </svg>
  );
}

export default function SiteNav() {
  const [city, setCity] = useState("Hyderabad");
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [tab, setTab] = useState("movies");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [onLight, setOnLight] = useState(false);
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setCitiesOpen(false);
        setSearchOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setCitiesOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const update = () => {
      const movies = document.querySelector(".movies-stand");
      setOnLight(movies ? movies.getBoundingClientRect().top < 90 : window.scrollY > 80);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const goTo = (item) => {
    setTab(item.id);
    setCitiesOpen(false);
    setSearchOpen(false);
    if (!item.target) return;
    document.querySelector(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className={`site-nav ${onLight ? "on-light" : ""}`} ref={rootRef}>
      <a className="nav-logo" href="#top" aria-label="Vybe home">
        <LogoMark />
      </a>

      <div className={`nav-location ${citiesOpen ? "open" : ""}`}>
        <button
          type="button"
          className="nav-location-btn"
          aria-expanded={citiesOpen}
          aria-haspopup="listbox"
          onClick={() => {
            setCitiesOpen((open) => !open);
            setSearchOpen(false);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.2" />
          </svg>
          <span>{city}</span>
          <svg className="chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {citiesOpen ? (
          <ul className="nav-cities" role="listbox" aria-label="Cities">
            {CITIES.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  role="option"
                  aria-selected={name === city}
                  className={name === city ? "active" : ""}
                  onClick={() => {
                    setCity(name);
                    setCitiesOpen(false);
                  }}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <nav className="nav-tabs" aria-label="Sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? "active" : ""}
            onClick={() => goTo(item)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={item.icon} />
            </svg>
            {item.label}
          </button>
        ))}
      </nav>

      <div className={`nav-search ${searchOpen ? "open" : ""}`}>
        {searchOpen ? (
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies and events"
            aria-label="Search"
          />
        ) : null}
        <button
          type="button"
          className="nav-icon"
          aria-label={searchOpen ? "Close search" : "Search"}
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen((open) => !open);
            setCitiesOpen(false);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16.2 16.2 20.5 20.5" />
          </svg>
        </button>
      </div>

      <button type="button" className="nav-profile" aria-label="Profile">
        <img src={avatar} alt="" />
      </button>
    </header>
  );
}
