import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-mark">
                <Image
                  src="/assets/logo/logo.png"
                  alt="Ziara-Sahla logo"
                  width={42}
                  height={42}
                  draggable={false}
                />
              </div>
              Ziara-Sahla
            </div>
            <p className="footer-about">
              Votre spécialiste des voyages culturels de groupe en Algérie.
              Sécurisés, authentiques et inoubliables depuis plus de 10 ans.
            </p>
            <div className="socials">
              <a href="#" className="soc" aria-label="Facebook">
                f
              </a>
              <a href="#" className="soc" aria-label="Instagram">
                ig
              </a>
              <a href="#" className="soc" aria-label="LinkedIn">
                in
              </a>
              <a href="#" className="soc" aria-label="WhatsApp">
                wa
              </a>
            </div>
          </div>

          <div className="fcol">
            <h4>Navigation</h4>
            <ul className="flinks">
              <li>
                <Link href="/#about">À propos</Link>
              </li>
              <li>
                <Link href="/#services">Nos circuits</Link>
              </li>
              <li>
                <Link href="/offres">Nos offres</Link>
              </li>
              <li>
                <Link href="/#why">Pourquoi nous</Link>
              </li>
              <li>
                <Link href="/galerie">Galerie</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="fcol">
            <h4>Formules</h4>
            <ul className="flinks">
              <li>
                <a href="#">Circuit Économique</a>
              </li>
              <li>
                <a href="#">Circuit Intermédiaire</a>
              </li>
              <li>
                <a href="#">Circuit Premium</a>
              </li>
              <li>
                <a href="#">Sur mesure groupes</a>
              </li>
              <li>
                <a href="#">Entreprises &amp; CE</a>
              </li>
            </ul>
          </div>

          <div className="fcol">
            <h4>Contact</h4>
            <div className="fcontact">
              <div className="fci">
                <span className="icon">📧</span>
                <a href="mailto:contact@ziara-sahla.com">
                  contact@ziara-sahla.com
                </a>
              </div>
              <div className="fci">
                <span className="icon">📞</span>
                <a href="tel:+33123456789">+33 1 23 45 67 89</a>
              </div>
              <div className="fci">
                <span className="icon">🇩🇿</span>
                <a href="tel:+213555000000">+213 555 000 000</a>
              </div>
              <div className="fci">
                <span className="icon">📍</span>
                <span>Paris, France · Alger, Algérie</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Ziara-Sahla. Tous droits réservés.</span>
          <span>
            <a href="#">Mentions légales</a> · <a href="#">Confidentialité</a> ·{" "}
            <a href="#">CGV</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
