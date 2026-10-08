import skyline from "./assets/vybe-footer-skyline.png";
import "./site-footer.css";

const CITIES = ["Hyderabad", "Bengaluru", "Mumbai", "Delhi", "Chennai", "Pune"];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9V11h2v10h3.5V11H17l.4-2.5h-2.9z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <img className="footer-sky" src={skyline} alt="" />

      <div className="footer-main">
        <div>
          <h2>Terms and conditions</h2>
          <a href="#booking">Booking policy</a>
          <a href="#cancellations">Cancellations</a>
          <a href="#refunds">Refunds</a>
          <div className="footer-follow">
            <span>Follow Vybe</span>
            <a href="https://facebook.com" aria-label="Vybe on Facebook">
              <FacebookIcon />
            </a>
            <a href="https://instagram.com" aria-label="Vybe on Instagram">
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <h2>Information</h2>
          <a href="#about">About Vybe</a>
          <a href="#faqs">FAQs</a>
          <a href="#movies">Movies</a>
          <a href="#events">Events</a>
          <a href="#activities">Activities</a>
        </div>

        <div>
          <h2>Contact</h2>
          <p>
            <strong>Vybe</strong>
          </p>
          <p>Hyderabad, India</p>
          <a href="mailto:hello@vybe.in">hello@vybe.in</a>
        </div>
      </div>

      <div className="footer-base">
        <div className="footer-badges" aria-hidden="true">
          <span className="footer-badge">
            <svg viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M18 8.5l6.2 2.2v6.4c0 4.2-2.6 7.2-6.2 8.4-3.6-1.2-6.2-4.2-6.2-8.4v-6.4L18 8.5z" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M15.2 18.2l1.8 1.8 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Secure
            <small>booking</small>
          </span>
          <span className="footer-badge">
            <svg viewBox="0 0 36 36">
              <rect x="4" y="8" width="28" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M11 18.5l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Verified
            <small>checkout</small>
          </span>
        </div>

        <div className="footer-legal">
          <p>Movies, events and activities around you.</p>
          <ul>
            {CITIES.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
          <p>© 2026 Vybe. All rights reserved.</p>
        </div>

        <div className="footer-pay" aria-label="Payments">
          <span className="pay-word">Razorpay</span>
          <span className="pay-cards" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="pay-upi">UPI</span>
        </div>
      </div>
    </footer>
  );
}
