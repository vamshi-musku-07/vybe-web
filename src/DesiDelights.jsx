import bandNight from "./assets/events/band-night.png";
import bollyTech from "./assets/events/bolly-tech.png";
import clubNight from "./assets/events/club-night.png";
import comedyNight from "./assets/events/comedy-night.png";
import dining from "./assets/events/dining.png";
import fridayVibes from "./assets/events/friday-vibes.png";
import janmashtami from "./assets/events/janmashtami.png";
import eventLine from "./assets/event-line.png";
import "./desi.css";

const EVENTS = [bandNight, bollyTech, clubNight, comedyNight, dining, fridayVibes, janmashtami];
const TOP = EVENTS;
const BOTTOM = [...EVENTS].reverse();

function Set({ images, suffix }) {
  return (
    <div className="desi-set">
      {images.map((src) => (
        <article className="desi-card" key={`${suffix}-${src}`}>
          <img src={src} alt="" />
        </article>
      ))}
    </div>
  );
}

function Row({ images, direction }) {
  return (
    <div className={`desi-row ${direction}`}>
      <Set images={images} suffix={`${direction}-a`} />
      <Set images={images} suffix={`${direction}-b`} />
    </div>
  );
}

export default function DesiDelights() {
  return (
    <section className="desi" aria-label="Explore the Events">
      <img className="desi-line" src={eventLine} alt="" />
      <div className="desi-copy">
        <h2>
          Explore
          <br />
          the Events
        </h2>
        <button type="button">Find Your Next Event</button>
      </div>

      <div className="desi-rails">
        <Row images={TOP} direction="to-left" />
        <Row images={BOTTOM} direction="to-right" />
      </div>
    </section>
  );
}
