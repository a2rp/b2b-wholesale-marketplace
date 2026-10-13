import { FiCoffee, FiFacebook, FiGithub, FiGlobe, FiHeart, FiLinkedin, FiMail, FiPackage, FiYoutube } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css";

const links = [
  { label: "Portfolio", href: "https://www.ashishranjan.net", detail: "ashishranjan.net", Icon: FiGlobe },
  { label: "GitHub", href: "https://github.com/a2rp", detail: "github.com/a2rp", Icon: FiGithub },
  { label: "CodePen", href: "https://codepen.io/ash1198", detail: "codepen.io/ash1198", Icon: FiPackage },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", detail: "linkedin.com/in/aashishranjan", Icon: FiLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", detail: "facebook.com/theash.ashish", Icon: FiFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", detail: "youtube.com/@ashishranjan-ashz", Icon: FiYoutube },
  { label: "Email", href: "mailto:ash.ranjan09@gmail.com", detail: "ash.ranjan09@gmail.com", Icon: FiMail },
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", detail: "a2rp-donation-page.netlify.app", Icon: FiHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", detail: "buymeacoffee.com/ashishranjan", Icon: FiCoffee },
  { label: "Patreon", href: "https://www.patreon.com/ashishranjan", detail: "patreon.com/ashishranjan", Icon: FiHeart },
  { label: "Source code", href: "https://github.com/a2rp/b2b-wholesale-marketplace", detail: "github.com/a2rp/b2b-wholesale-marketplace", Icon: FiGithub },
];

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.copyright}>
      <a href="https://www.ashishranjan.net" aria-label="Ashish Ranjan portfolio">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
      </a>
      <p>© {new Date().getFullYear()} <a className={styles.name} href="https://www.ashishranjan.net">Ashish Ranjan</a>. All rights reserved.</p>
    </div>
    <nav className={styles.links} aria-label="Creator links">
      {links.map(({ label, href, detail, Icon }) => (
        <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={`${label}: ${detail}`} data-tooltip-id="creator-links-tip" data-tooltip-content={`${label}\n${detail}`}>
          <Icon aria-hidden="true" />
        </a>
      ))}
    </nav>
    <Tooltip id="creator-links-tip" place="top" className={styles.tooltip} />
  </footer>
);

export default Footer;
