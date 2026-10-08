import bowling from "./assets/play/card-bowling.jpg";
import gokart from "./assets/play/card-gokart.jpg";
import kids from "./assets/play/card-kids.jpg";
import park from "./assets/play/card-park.jpg";
import "./play-near.css";

const CARDS = [
  {
    key: "park",
    title: "Amusement Parks",
    text: "Hold on for a fast ride near you.",
    image: park,
    alt: "A couple on a roller coaster at night",
  },
  {
    key: "kart",
    title: "Go Karting",
    text: "Race a friend on a track near you.",
    image: gokart,
    alt: "Two people racing go-karts",
  },
  {
    key: "bowl",
    title: "Bowling alleys near you",
    text: "Grab a lane and roll a few frames.",
    image: bowling,
    alt: "A person bowling",
  },
  {
    key: "kids",
    title: "Get the kids along",
    text: "Bring them out for a day of play.",
    image: kids,
    alt: "Two kids playing mini golf",
  },
];

export default function PlayNear() {
  return (
    <section className="play-near" aria-label="Play near you">
      <header className="play-head">
        <h2 className="">Activities for you</h2>
        <p>Go-karts, bowling, parks and a day out with the kids.</p>
      </header>
      <div className="play-grid">
        {CARDS.map((card) => (
          <article className={`story-card card-${card.key}`} key={card.key}>
            <img src={card.image} alt={card.alt} />
            <div className="story-copy">
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <button type="button">Learn more</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
