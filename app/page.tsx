"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUI } from "@/context/UIContext";

export default function HomePage() {
  const { openModal } = useUI();
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

    /* ─ Sound ─ */
    const audio = document.getElementById(
      "plane-audio",
    ) as HTMLAudioElement | null;
    const soundBtn = document.getElementById("sound-btn");
    if (audio && soundBtn) {
      audio.volume = 0.42;
      let soundOn = false;

      const setSoundState = (on: boolean) => {
        soundOn = on;
        soundBtn.classList.toggle("muted", !on);
        soundBtn.title = on ? "Couper le son" : "Activer le son";
      };

      const onFirstScroll = () => {
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setSoundState(true))
          .catch(() => {});
      };
      window.addEventListener("scroll", onFirstScroll, {
        once: true,
        passive: true,
      });
      audio.addEventListener("ended", () => setSoundState(false));

      soundBtn.addEventListener("click", () => {
        window.removeEventListener("scroll", onFirstScroll);
        if (soundOn) {
          audio.pause();
          audio.currentTime = 0;
          setSoundState(false);
        } else {
          audio.currentTime = 0;
          audio
            .play()
            .then(() => setSoundState(true))
            .catch(() => {});
        }
      });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      {/* SOUND BUTTON */}
      <button
        id="sound-btn"
        className="muted"
        title="Son avion"
        aria-label="Activer le son"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path
            d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
            id="sw"
          />
        </svg>
        <span className="muted-line"></span>
      </button>

      {/* AUDIO */}
      <audio id="plane-audio" preload="none">
        <source
          src="/assets/aircraft/u_inx5oo5fv3-aeroplane-327235 (1).mp3"
          type="audio/mpeg"
        />
      </audio>

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
            <div className="hero-eyebrow">
              Voyages culturels de groupe en Algérie
            </div>
            <h1 className="hero-title">
              L&apos;Algérie authentique,
              <br />
              <em>organisée pour vous.</em>
            </h1>
            <p className="hero-sub">
              Ziara-Sahla conçoit des circuits culturels sur mesure pour
              groupes, associations et entreprises européennes. Sécurisés,
              immersifs et inoubliables.
            </p>
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
                Demandez un devis
              </button>
              <a href="#services" className="btn btn-outline">
                Découvrir nos circuits
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
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>+200</strong>
                <span>Groupes accompagnés</span>
              </div>
              <div className="hero-stat">
                <strong>12</strong>
                <span>Wilayates couvertes</span>
              </div>
              <div className="hero-stat">
                <strong>100%</strong>
                <span>Sécurisé &amp; assuré</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-pill"></div>
          Découvrir
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
                  <strong>Agréé &amp; certifié</strong>
                  <span>Opérateur touristique officiel</span>
                </div>
              </div>
            </div>

            <div className="about-text reveal-r">
              <span className="badge">Qui sommes-nous</span>
              <h2 className="section-title">
                L&apos;expertise franco-algérienne au service de votre voyage
              </h2>
              <p className="section-sub">
                Fondée par une équipe binationale passionnée, Ziara-Sahla est
                votre pont entre l&apos;Europe et l&apos;âme profonde de
                l&apos;Algérie. Nous ne vendons pas des voyages — nous créons
                des expériences mémorables, en toute sécurité.
              </p>
              <div className="feat-grid">
                <div className="feat">
                  <div className="ico">🌍</div>
                  <div>
                    <strong>Bilinguisme total</strong>
                    <p>Guides francophones natifs</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🛡️</div>
                  <div>
                    <strong>Sécurité garantie</strong>
                    <p>Escorte policière 24h/24</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🏨</div>
                  <div>
                    <strong>Logistique complète</strong>
                    <p>Hôtels, transport, repas</p>
                  </div>
                </div>
                <div className="feat">
                  <div className="ico">🤝</div>
                  <div>
                    <strong>Sur mesure</strong>
                    <p>Adapté à chaque groupe</p>
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
            <span className="badge">Nos circuits</span>
            <h2 className="section-title">
              Choisissez votre formule de voyage
            </h2>
            <p className="section-sub">
              Trois niveaux d&apos;expérience, une seule promesse : authenticité
              et sécurité.
            </p>
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
                <div className="card-label">Formule 01</div>
                <h3>Économique</h3>
                <p>
                  L&apos;essentiel de l&apos;Algérie pour les groupes soucieux
                  du budget. Confort simple, authenticité totale.
                </p>
                <ul className="card-feats">
                  <li>Hébergement 2-3 étoiles</li>
                  <li>Transport bus climatisé</li>
                  <li>Guide francophone</li>
                  <li>Repas traditionnels inclus</li>
                  <li>Assistance 7j/7</li>
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    Sur devis <small>/ pers.</small>
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
                    En savoir plus →
                  </button>
                </div>
              </div>
            </div>

            <div
              className="card featured reveal"
              style={{ transitionDelay: ".16s" }}
            >
              <div className="ribbon">Populaire</div>
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
                <div className="card-label">Formule 02</div>
                <h3>Intermédiaire</h3>
                <p>
                  Le parfait équilibre entre confort et immersion culturelle.
                  Notre formule la plus demandée.
                </p>
                <ul className="card-feats">
                  <li>Hébergement 3-4 étoiles</li>
                  <li>Transport privé VIP</li>
                  <li>Guide expert bilingue</li>
                  <li>Excursions culturelles</li>
                  <li>Escorte sécuritaire incluse</li>
                  <li>Assistance 24h/24</li>
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    Sur devis <small>/ pers.</small>
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
                    En savoir plus →
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
                <div className="card-label">Formule 03</div>
                <h3>Premium</h3>
                <p>
                  Une expérience d&apos;exception, taillée sur mesure pour les
                  groupes exigeants et les événements corporate.
                </p>
                <ul className="card-feats">
                  <li>Hébergement 4-5 étoiles</li>
                  <li>Flotte de véhicules dédiés</li>
                  <li>Guide expert + interprète</li>
                  <li>Programme personnalisé</li>
                  <li>Escorte VIP garantie</li>
                  <li>Conciergerie dédiée</li>
                </ul>
                <div className="card-foot">
                  <div className="card-price">
                    Sur devis <small>/ pers.</small>
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
                    En savoir plus →
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
            <span className="badge">Confiance &amp; Sécurité</span>
            <h2 className="section-title reveal">
              Votre sécurité est notre priorité absolue
            </h2>
            <p
              className="section-sub reveal"
              style={{ color: "rgba(255,255,255,.55)" }}
            >
              Chaque circuit est organisé avec le plus haut niveau de sécurité
              pour vous offrir une sérénité totale.
            </p>
          </div>

          <div className="trust-cards">
            <div className="tc reveal" style={{ transitionDelay: ".05s" }}>
              <div className="tc-icon">🚔</div>
              <h3>Escorte policière</h3>
              <p>
                Chaque groupe bénéficie d&apos;une escorte officielle des forces
                de l&apos;ordre algériennes sur tout le parcours.
              </p>
            </div>
            <div className="tc reveal" style={{ transitionDelay: ".11s" }}>
              <div className="tc-icon">📞</div>
              <h3>Assistance 24h/24</h3>
              <p>
                Une équipe dédiée disponible à toute heure, urgences médicales
                incluses.
              </p>
            </div>
            <div className="tc reveal" style={{ transitionDelay: ".17s" }}>
              <div className="tc-icon">🗺️</div>
              <h3>Logistique maîtrisée</h3>
              <p>
                Transport, hébergements, restauration et activités — tout
                planifié avant votre arrivée.
              </p>
            </div>
            <div className="tc reveal" style={{ transitionDelay: ".23s" }}>
              <div className="tc-icon">🏥</div>
              <h3>Couverture médicale</h3>
              <p>
                Partenariat avec des structures médicales locales. Médecin
                référent disponible pour les longs séjours.
              </p>
            </div>
            <div className="tc reveal" style={{ transitionDelay: ".29s" }}>
              <div className="tc-icon">📋</div>
              <h3>Accréditation officielle</h3>
              <p>
                Opérateur agréé par le Ministère du Tourisme algérien. Vos
                droits sont protégés.
              </p>
            </div>
            <div className="tc reveal" style={{ transitionDelay: ".35s" }}>
              <div className="tc-icon">🛡️</div>
              <h3>Assurance incluse</h3>
              <p>
                Chaque participant est couvert par une assurance rapatriement et
                responsabilité civile complète.
              </p>
            </div>
          </div>

          <div className="trust-bar reveal">
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
                &ldquo;Un voyage en Algérie avec Ziara Sahla, c&apos;est bien
                plus qu&apos;un circuit — c&apos;est une rencontre avec une
                civilisation millénaire.&rdquo;
                <cite>— Marie D., Chef de projet, Paris</cite>
              </blockquote>
            </div>

            <div className="reveal-r">
              <span className="badge">Pourquoi nous choisir</span>
              <h2 className="section-title">
                Ce qui fait de nous votre meilleur partenaire voyage
              </h2>
              <div className="why-list">
                <div className="why-item">
                  <div className="why-num">01</div>
                  <div>
                    <strong>Double culture, double expertise</strong>
                    <p>
                      Notre équipe binationale comprend vos attentes européennes
                      et connaît l&apos;Algérie comme sa poche. Aucune mauvaise
                      surprise.
                    </p>
                  </div>
                </div>
                <div className="why-item">
                  <div className="why-num">02</div>
                  <div>
                    <strong>Circuits hors des sentiers battus</strong>
                    <p>
                      Sahara, Tassili, Ghardaïa, Béjaïa, Tipaza… Nous ouvrons
                      des portes que les agences ordinaires n&apos;osent pas
                      franchir.
                    </p>
                  </div>
                </div>
                <div className="why-item">
                  <div className="why-num">03</div>
                  <div>
                    <strong>Tout inclus, zéro stress</strong>
                    <p>
                      De votre arrivée à l&apos;aéroport jusqu&apos;à votre
                      départ, tout est pris en charge. Vous profitez, nous
                      gérons.
                    </p>
                  </div>
                </div>
                <div className="why-item">
                  <div className="why-num">04</div>
                  <div>
                    <strong>Idéal pour entreprises &amp; associations</strong>
                    <p>
                      Teambuilding, voyages d&apos;études, retraites
                      associatives — nous avons l&apos;expertise pour tous les
                      profils de groupe.
                    </p>
                  </div>
                </div>
                <div className="why-item">
                  <div className="why-num">05</div>
                  <div>
                    <strong>Transparence totale des prix</strong>
                    <p>
                      Devis détaillé sans surprise. Vous savez exactement ce que
                      vous payez et ce que vous recevez.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery">
        <div className="container">
          <div className="gallery-head reveal">
            <span className="badge">Galerie</span>
            <h2 className="section-title">
              L&apos;Algérie vue par nos voyageurs
            </h2>
            <p className="section-sub">
              Des paysages à couper le souffle qui ne demandent qu&apos;à être
              vécus de l&apos;intérieur.
            </p>
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
              Voir toute la galerie →
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
              Organiser votre voyage
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner reveal">
            <div className="cta-flag">
              <span className="pulse"></span>Disponible maintenant
            </div>
            <h2 className="cta-title">
              Prêt à vivre l&apos;Algérie autrement ?
            </h2>
            <p className="cta-sub">
              Demandez votre devis personnalisé gratuitement. Notre équipe vous
              répond sous 24h.
            </p>
            <div className="cta-actions">
              <button className="btn btn-white" onClick={openModal}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Demandez votre devis personnalisé
              </button>
              <a href="tel:+33123456789" className="btn btn-ghost">
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
                Appeler directement
              </a>
            </div>
            <div className="urgency">
              🗓️ Places limitées — Saison 2026 en cours de remplissage
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
