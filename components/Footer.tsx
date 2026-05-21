"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/context/LangContext";

export default function Footer() {
  const { tr } = useLang();

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-mark logo-mark--lg">
                <Image
                  src="/assets/logo/logo.png"
                  alt="Ziara-Sahla logo"
                  width={60}
                  height={60}
                  draggable={false}
                />
              </div>
              Ziara-Sahla
            </div>
            <p className="footer-about">{tr.footer.about}</p>
            <div className="socials">
              <a href="#" className="soc" aria-label="Facebook">
                f
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
            <h4>{tr.footer.navTitle}</h4>
            <ul className="flinks">
              <li>
                <Link href="/#about">{tr.footer.nav.about}</Link>
              </li>
              <li>
                <Link href="/#services">{tr.footer.nav.circuits}</Link>
              </li>
              <li>
                <Link href="/offres">{tr.footer.nav.offers}</Link>
              </li>
              <li>
                <Link href="/#why">{tr.footer.nav.why}</Link>
              </li>
              <li>
                <Link href="/galerie">{tr.footer.nav.gallery}</Link>
              </li>
              <li>
                <Link href="/contact">{tr.footer.nav.contact}</Link>
              </li>
            </ul>
          </div>

          <div className="fcol">
            <h4>{tr.footer.formulasTitle}</h4>
            <ul className="flinks">
              {tr.footer.formulas.map((f, i) => (
                <li key={i}>
                  <a href="#">{f}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="fcol">
            <h4>{tr.footer.contactTitle}</h4>
            <div className="fcontact">
              <div className="fci">
                <span className="icon">📧</span>
                <a href="mailto:contact@ziara-sahla.com">
                  contact@ziara-sahla.com
                </a>
              </div>
              <div className="fci">
                <span className="icon">📞</span>
                <a href="tel:+33761832197">+33 761 832 197</a>
              </div>
              <div className="fci">
                <span className="icon">🇩🇿</span>
                <a href="tel:+213557610660">+213 557 610 660</a>
              </div>
              <div className="fci">
                <span className="icon">📍</span>
                <span>Paris, France · Alger, Algérie</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{tr.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
