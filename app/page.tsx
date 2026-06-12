"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/context/UIContext";
import { useLang } from "@/context/LangContext";

export default function HomePage() {
  const { openModal } = useUI();
  const { tr } = useLang();
  const planeStarted = useRef(false);

  useEffect(() => {
    /* ─ Scroll reveal ─ */
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("on");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal, .reveal-l, .reveal-r")
      .forEach((el) => observer.observe(el));

    /* ─ Particles ─ */
    const container = document.getElementById("particles");
    if (container) {
      for (let i = 0; i < 18; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const s = Math.random() * 6 + 2;
        p.style.cssText = [
          `width:${s}px`,
          `height:${s}px`,
          `left:${Math.random() * 100}%`,
          `bottom:${Math.random() * 20}%`,
          `animation-duration:${Math.random() * 12 + 8}s`,
          `animation-delay:${Math.random() * 10}s`,
        ].join(";");
        container.appendChild(p);
      }
    }

    /* ─ Hero parallax ─ */
    const heroEl = document.getElementById("hero");
    const onScroll = () => {
      if (heroEl && window.scrollY < window.innerHeight) {
        heroEl.style.backgroundPositionY = `calc(50% + ${window.scrollY * 0.32}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ─ Plane animation ─ */
    function launchPlane() {
      if (planeStarted.current) return;
      planeStarted.current = true;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById("plane-stage")?.classList.add("animate");
        }),
      );
    }
    if (document.readyState === "complete") setTimeout(launchPlane, 250);
    else
      window.addEventListener("load", () => setTimeout(launchPlane, 250), {
        once: true,
      });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section id="hero">
        <div className="particles" id="particles"></div>

        <div className="plane-stage" id="plane-stage">
          <div className="contrail-wrap" aria-hidden="true">
            <span className="contrail c1"></span>
            <span className="contrail c2"></span>
          </div>
          <Image
            id="plane-img"
            src="/assets/aircraft/Airplane-PNG.png"
            alt="Avion en vol – Ziara-Sahla"
            width={280}
            height={200}
            loading="eager"
            draggable={false}
            unoptimized
          />
          <div className="plane-shadow" aria-hidden="true"></div>
        </div>

        <div className="container">
          <div className="hero-content">
            {/* Big brand logo seal */}
            <div className="hero-brand">
              <Image
                src="/assets/logo/logo.png"
                alt="Ziara-Sahla"
                width={110}
                height={110}
                className="hero-brand-logo"
                draggable={false}
              />
              <div>
                <div className="hero-brand-name">Ziara-Sahla</div>
                <div className="hero-brand-tagline">{tr.hero.eyebrow}</div>
              </div>
            </div>

            <h1 className="hero-title">
              {tr.hero.title1}
              <br />
              <em>{tr.hero.title2}</em>
            </h1>
            <p className="hero-sub">{tr.hero.sub}</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={openModal}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16z" />
                </svg>
                {tr.hero.cta1}
              </button>
              <a href="#services" className="btn btn-outline">
                {tr.hero.cta2}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-pill"></div>
          {tr.hero.discover}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-stack reveal-l">
              <Image
                className="about-img-a"
                src="/assets/gherdaia/Ghardaia-1.jpeg"
                alt="Ghardaïa – cité millénaire"
                width={420}
                height={390}
                loading="lazy"
              />
              <Image
                className="about-img-b"
                src="/assets/gherdaia/guided-tours-with-algerian.jpg"
                alt="Visite guidée en groupe"
                width={300}
                height={260}
                loading="lazy"
              />
              <div className="about-float">
                <div className="ico">🏆</div>
                <div>
                  <strong>{tr.about.cert}</strong>
                  <span>{tr.about.certSub}</span>
                </div>
              </div>
            </div>

            <div className="about-text reveal-r">
              <span className="badge">{tr.about.badge}</span>
              <h2 className="section-title">{tr.about.title}</h2>
              <p className="section-sub">{tr.about.sub}</p>
              <div className="feat-grid">
                <div className="feat">
                  <div className="ico">🌍</div>
                  <div>
                    <strong>{tr.about.feat1.title}</strong>
                    <p>{tr.about.feat1.desc}</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🛡️</div>
                  <div>
                    <strong>{tr.about.feat2.title}</strong>
                    <p>{tr.about.feat2.desc}</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🏨</div>
                  <div>
                    <strong>{tr.about.feat3.title}</strong>
                    <p>{tr.about.feat3.desc}</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🤝</div>
                  <div>
                    <strong>{tr.about.feat4.title}</strong>
                    <p>{tr.about.feat4.desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services">
        <div className="container">
          <div className="services-head reveal">
            <span className="badge">{tr.services.badge}</span>
            <h2 className="section-title">{tr.services.title}</h2>
            <p className="section-sub">{tr.services.sub}</p>
          </div>

          <div className="cards">
            <div className="card reveal" style={{ transitionDelay: ".08s" }}>
              <div className="card-img">
                <Image
                  src="/assets/hotels/exterior.jpg"
                  alt="Hébergement économique"
                  width={400}
                  height={210}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-icon ci-eco">🌿</div>
                <div className="card-label">{tr.services.card1.label}</div>
                <h3>{tr.services.card1.title}</h3>
                <p>{tr.services.card1.desc}</p>
                <ul className="card-feats">
                  {tr.services.feats1.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    {tr.services.priceLabel} <small>/ pers.</small>
                  </div>
                  <button
                    className="card-link"
                    onClick={openModal}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {tr.services.moreBtn}
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card featured reveal"
              style={{ transitionDelay: ".16s" }}
            >
              <div className="ribbon">{tr.services.card2.ribbon}</div>
              <div className="card-img">
                <Image
                  src="/assets/hotels/algiers-marriott-hotel.jpg"
                  alt="Hôtel intermédiaire Alger"
                  width={400}
                  height={210}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-icon ci-mid">✨</div>
                <div className="card-label">{tr.services.card2.label}</div>
                <h3>{tr.services.card2.title}</h3>
                <p>{tr.services.card2.desc}</p>
                <ul className="card-feats">
                  {tr.services.feats2.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    {tr.services.priceLabel} <small>/ pers.</small>
                  </div>
                  <button
                    className="card-link"
                    onClick={openModal}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {tr.services.moreBtn}
                  </button>
                </div>
              </div>
            </div>

            <div className="card reveal" style={{ transitionDelay: ".24s" }}>
              <div className="card-img">
                <Image
                  src="/assets/hotels/sheraton-club-des-pins-resort-general-1267fc26.jpg"
                  alt="Sheraton Club des Pins Alger"
                  width={400}
                  height={210}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <div className="card-icon ci-prem">👑</div>
                <div className="card-label">{tr.services.card3.label}</div>
                <h3>{tr.services.card3.title}</h3>
                <p>{tr.services.card3.desc}</p>
                <ul className="card-feats">
                  {tr.services.feats3.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    {tr.services.priceLabel} <small>/ pers.</small>
                  </div>
                  <button
                    className="card-link"
                    onClick={openModal}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {tr.services.moreBtn}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust">
        <div className="container">
          <div style={{ maxWidth: "600px" }}>
            <span className="badge">{tr.trust.badge}</span>
            <h2 className="section-title reveal">{tr.trust.title}</h2>
            <p
              className="section-sub reveal"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              {tr.trust.sub}
            </p>
          </div>

          <div className="trust-cards">
            {tr.trust.cards.map((card, i) => (
              <div
                className="tc reveal"
                key={i}
                style={{ transitionDelay: `${0.05 + i * 0.06}s` }}
              >
                <div className="tc-icon">
                  {["🚔", "📞", "🗺️", "🏥", "📋", "🛡️"][i]}
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* trust-bar hidden until real stats are ready */}
          <div className="trust-bar reveal" style={{ display: "none" }}>
            <div className="tb-stat">
              <strong>200+</strong>
              <span>Groupes accompagnés</span>
            </div>
            <div className="tb-div"></div>
            <div className="tb-stat">
              <strong>0</strong>
              <span>Incident de sécurité</span>
            </div>
            <div className="tb-div"></div>
            <div className="tb-stat">
              <strong>5★</strong>
              <span>Note moyenne clients</span>
            </div>
            <div className="tb-div"></div>
            <div className="tb-stat">
              <strong>15+</strong>
              <span>Pays d&apos;origine</span>
            </div>
            <div className="tb-div"></div>
            <div className="tb-stat">
              <strong>100%</strong>
              <span>Satisfaction garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section id="why">
        <div className="container">
          <div className="why-grid">
            <div className="why-visual reveal-l">
              <Image
                src="/assets/sahara/-1x-1.webp"
                alt="Désert du Sahara algérien"
                width={600}
                height={520}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div className="why-visual-overlay"></div>
              <blockquote className="why-quote">
                &ldquo;{tr.why.quote}&rdquo;
              </blockquote>
            </div>

            <div className="reveal-r">
              <span className="badge">{tr.why.badge}</span>
              <h2 className="section-title">{tr.why.title}</h2>
              <div className="why-list">
                {tr.why.items.map((item, i) => (
                  <div className="why-item" key={i}>
                    <div className="why-num">0{i + 1}</div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery">
        <div className="container">
          <div className="gallery-head reveal">
            {/* Decorative brand seal above the badge */}
            <div className="gallery-brand-seal" aria-hidden="true">
              <div className="gbs-ring" />
              <Image
                src="/assets/logo/logo.png"
                alt=""
                width={88}
                height={88}
                className="gbs-logo"
                draggable={false}
              />
            </div>
            <span className="badge">{tr.gallery.badge}</span>
            <h2 className="section-title">{tr.gallery.title}</h2>
            <p className="section-sub">{tr.gallery.sub}</p>
          </div>

          <div className="gallery-grid reveal">
            <div className="gi gi-1">
              <Image
                src="/assets/sahara/sahara-desert.jpg"
                alt="Grand Erg Oriental – Sahara algérien"
                width={600}
                height={460}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Sahara</span>
            </div>
            <div className="gi gi-2">
              <Image
                src="/assets/gherdaia/ghardaia-Par-VisualEyze-min.jpg"
                alt="Ghardaïa – Vallée du M'Zab"
                width={400}
                height={230}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Ghardaïa</span>
            </div>
            <div className="gi gi-3">
              <Image
                src="/assets/hotels/getlstd-property-photo.jpg"
                alt="Hôtel de charme"
                width={300}
                height={230}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Hébergement</span>
            </div>
            <div className="gi gi-4">
              <Image
                src="/assets/gherdaia/association-d-orientation.jpg"
                alt="Visite culturelle guidée"
                width={300}
                height={230}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Culture</span>
            </div>
            <div className="gi gi-5">
              <Image
                src="/assets/hotels/649232884.jpg"
                alt="Piscine hôtel Algérie"
                width={400}
                height={230}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Confort</span>
            </div>
          </div>

          <div
            className="gallery-grid reveal"
            style={{ marginTop: "12px", gridTemplateRows: "200px" }}
          >
            <div className="gi" style={{ gridColumn: "span 4" }}>
              <Image
                src="/assets/sahara/images.jpg"
                alt="Dunes du Sahara"
                width={400}
                height={200}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Sahara</span>
            </div>
            <div className="gi" style={{ gridColumn: "span 4" }}>
              <Image
                src="/assets/hotels/4de8805405a9d2deb1ded672b3c4371cd996655229816595b538429ece31.webp"
                alt="Hôtel luxe Algérie"
                width={400}
                height={200}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Hôtel</span>
            </div>
            <div className="gi" style={{ gridColumn: "span 4" }}>
              <Image
                src="/assets/gherdaia/Ghardaia-1.jpeg"
                alt="Ghardaïa panorama"
                width={400}
                height={200}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span className="gi-label">Ghardaïa</span>
            </div>
          </div>

          <div
            className="gallery-more reveal"
            style={{
              display: "flex",
              gap: "14px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "32px",
            }}
          >
            <Link href="/galerie" className="btn btn-primary">
              {tr.gallery.viewAll}
            </Link>
            <button
              className="btn"
              onClick={openModal}
              style={{
                background: "transparent",
                color: "var(--orange)",
                border: "2px solid var(--orange)",
                padding: "15px 32px",
                borderRadius: "100px",
                fontWeight: 600,
                fontSize: ".95rem",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tr.gallery.organize}
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner reveal">
            {/* ── Brand Medallion ── */}
            <div className="cta-medallion" aria-hidden="true">
              <div className="cta-m-outer">
                <div className="cta-m-glow" />
                <div className="cta-m-ring" />
                <div className="cta-m-circle">
                  <Image
                    src="/assets/logo/logo.png"
                    alt="Ziara-Sahla"
                    width={110}
                    height={110}
                    draggable={false}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              </div>
              <span className="cta-m-label">Ziara‑Sahla</span>
            </div>

            <div className="cta-flag">
              <span className="pulse"></span>
              {tr.cta.flag}
            </div>
            <h2 className="cta-title">{tr.cta.title}</h2>
            <p className="cta-sub">{tr.cta.sub}</p>
            <div className="cta-actions">
              <a
                href="https://wa.me/213557610660?text=Bonjour%20Ziara-Sahla%2C%20je%20souhaite%20un%20devis%20pour%20un%20voyage%20en%20Alg%C3%A9rie."
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {tr.cta.btn1}
              </a>
              <a
                href="https://wa.me/213557610660"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {tr.cta.btn2}
              </a>
            </div>
            <div className="urgency">{tr.cta.urgency}</div>
          </div>
        </div>
      </section>
    </>
  );
}
