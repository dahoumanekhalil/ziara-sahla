"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUI } from "@/context/UIContext";
import { useLang, Lang } from "@/context/LangContext";
import { useTheme } from "@/context/ThemeContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar, openModal } = useUI();
  const { lang, setLang, tr } = useLang();
  const { theme, toggleTheme } = useTheme();
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <div
        className={`sidebar-overlay${isSidebarOpen ? " open" : ""}`}
        id="sidebar-overlay"
        onClick={closeSidebar}
      />

      <aside
        className={`sidebar${isSidebarOpen ? " open" : ""}`}
        id="sidebar"
        role="navigation"
        aria-label="Menu principal"
      >
        <div className="sidebar-head">
          <div className="sidebar-logo">
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
          <button
            className="sidebar-close"
            onClick={closeSidebar}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-links">
          <Link href="/#about" onClick={closeSidebar}>
            {tr.sidebar.about} <span className="arrow">›</span>
          </Link>
          <Link href="/#services" onClick={closeSidebar}>
            {tr.sidebar.circuits} <span className="arrow">›</span>
          </Link>
          <Link href="/#trust" onClick={closeSidebar}>
            {tr.sidebar.security} <span className="arrow">›</span>
          </Link>
          <Link href="/#why" onClick={closeSidebar}>
            {tr.sidebar.why} <span className="arrow">›</span>
          </Link>
          <Link href="/offres" onClick={closeSidebar}>
            {tr.sidebar.offers} <span className="arrow">›</span>
          </Link>
          <Link href="/galerie" onClick={closeSidebar}>
            {tr.sidebar.gallery} <span className="arrow">›</span>
          </Link>
          <Link href="/contact" onClick={closeSidebar}>
            {tr.sidebar.contact} <span className="arrow">›</span>
          </Link>
        </nav>

        <div className="sidebar-foot">
          <div className="sidebar-controls">
            <div
              className="lang-switch lang-switch--sidebar"
              role="group"
              aria-label="Language"
            >
              {(["fr", "en", "ar"] as Lang[]).map((l) => (
                <button
                  key={l}
                  className={`lang-btn${lang === l ? " active" : ""}`}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              className="theme-toggle theme-toggle--sidebar"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              openModal();
              closeSidebar();
            }}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {tr.sidebar.quoteBtn}
          </button>
          <div className="sidebar-contact">
            <p>
              📞 <a href="tel:+33761832197">+33 761 832 197</a>
            </p>
            <p>
              📧{" "}
              <a href="mailto:contact@ziara-sahla.com">
                contact@ziara-sahla.com
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
