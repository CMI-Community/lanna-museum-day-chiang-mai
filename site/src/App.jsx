import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Binoculars,
  Buildings,
  CalendarBlank,
  Camera,
  CaretDown,
  Check,
  CheckCircle,
  Clock,
  Cube,
  DownloadSimple,
  GameController,
  GlobeHemisphereWest,
  IdentificationCard,
  ImageSquare,
  Images,
  List,
  MagicWand,
  MapPin,
  NotePencil,
  Palette,
  PenNib,
  Play,
  Shuffle,
  SpeakerHigh,
  Sparkle,
  SquaresFour,
  Ticket,
  UploadSimple,
  VideoCamera,
  X,
} from "@phosphor-icons/react";
import { archiveSamples } from "./content";
import {
  getFilterOptions,
  getMuseums,
  getParticipationSteps,
  localizePattern,
} from "./content-i18n";
import { languageOptions, useI18n } from "./i18n";
import {
  createLocalPreviewPattern,
  fetchPublishedPatterns,
  formatPatternCapturedAt,
  isSupabaseConfigured,
  prepareImageFile,
  renderPatternCardPng,
  submitPattern,
} from "./lib/archive";
import { generateIdea, getIdeaCategories } from "./lib/ideas";

const toneColors = {
  purple: "#5c2683",
  orange: "#ec7623",
  green: "#4d9c54",
  cyan: "#1e9fbd",
  pink: "#e34f7d",
};

const getFeaturedWorks = (t) => [
  {
    id: "pattern-garden",
    number: "01",
    type: "website",
    medium: t("works.interactiveWebsite"),
    title: t("works.gardenTitle"),
    description: t("works.gardenDescription"),
    creator: t("works.gardenCreator"),
    cover: "/assets/works/pattern-garden-cover.png",
    coverPosition: "50% 36%",
    href: "https://lanna-pattern-garden.vercel.app/",
  },
  {
    id: "video-work-01",
    number: "02",
    type: "video",
    medium: t("works.videoWork"),
    title: t("works.microTitle1"),
    description: (
      <>
        {t("works.microDescription1")}{" "}
        <strong className="work-description__emphasis">
          {t("works.microEmphasis")}
        </strong>
        {t("works.microDescription2")}
        <br />
        <br />
        {" "}
        {t("works.microDescription3")}
      </>
    ),
    creator: "Shindo Teenager Group",
    cover: "/assets/works/lanna-video-work-01-cover.jpg",
    coverPosition: "50% 18%",
    videoSrc: "/assets/works/lanna-video-work-01.mp4",
  },
  {
    id: "video-work-02",
    number: "03",
    type: "video",
    medium: t("works.videoWork"),
    title: t("works.microTitle2"),
    description: (
      <>
        {t("works.microDescription1")}{" "}
        <strong className="work-description__emphasis">
          {t("works.microEmphasis")}
        </strong>
        {t("works.microDescription2")}
        <br />
        <br />
        {" "}
        {t("works.microDescription3")}
      </>
    ),
    creator: "Shindo Teenager Group",
    cover: "/assets/works/lanna-video-work-02-cover.jpg",
    coverPosition: "50% 45%",
    videoSrc: "/assets/works/lanna-video-work-02.mp4",
  },
  {
    id: "event-recap",
    number: "04",
    type: "video",
    medium: t("works.eventRecap"),
    title: t("works.recapTitle"),
    description: t("works.recapDescription"),
    creator: t("works.creatorPending"),
    cover: "/assets/works/lanna-event-recap-cover-v2.jpg",
    coverPosition: "50% 38%",
    videoSrc: "/assets/works/lanna-event-recap.mp4",
  },
];

function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

function Dialog({
  open,
  onClose,
  label,
  children,
  size = "regular",
  disableEscape = false,
}) {
  const { t } = useI18n();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !disableEscape) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [disableEscape, open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="dialog-layer" role="presentation" onMouseDown={onClose}>
      <section
        className={`dialog dialog--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          className="icon-button dialog__close"
          type="button"
          aria-label={t("close")}
          onClick={onClose}
        >
          <X size={22} weight="bold" />
        </button>
        {children}
      </section>
    </div>
  );
}

function LanguageSwitcher() {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const switcherRef = useRef(null);
  const currentLanguage =
    languageOptions.find(({ code }) => code === language) || languageOptions[0];

  useEffect(() => {
    if (!open) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!switcherRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button
        className="language-switcher__trigger"
        type="button"
        aria-label={`${t("language")}: ${currentLanguage.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <GlobeHemisphereWest size={19} weight="bold" />
        <span>{currentLanguage.short}</span>
        <CaretDown size={14} weight="bold" />
      </button>
      {open ? (
        <div
          className="language-switcher__menu"
          role="listbox"
          aria-label={t("languageMenu")}
        >
          <span className="language-switcher__eyebrow">{t("language")}</span>
          {languageOptions.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={language === option.code}
              className={language === option.code ? "is-active" : ""}
              key={option.code}
              onClick={() => {
                setLanguage(option.code);
                setOpen(false);
              }}
            >
              <span>{option.nativeLabel}</span>
              <small>
                {option.code === "zh"
                  ? "Chinese"
                  : option.code === "th"
                    ? "Thai"
                    : "English"}
              </small>
              {language === option.code ? (
                <Check size={16} weight="bold" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Header({ onSignup }) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    [t("nav.works"), "works"],
    [t("nav.about"), "about"],
    [t("nav.journey"), "journey"],
    [t("nav.museums"), "museums"],
    [t("nav.collect"), "collect"],
    [t("nav.archive"), "archive"],
    [t("nav.ideas"), "ideas"],
  ];

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="CMI Community">
        <img
          src="/assets/brand/cmi-community.svg"
          alt=""
          className="brand-lockup__mark"
        />
        <span>CMI Community</span>
      </a>

      <nav className="desktop-nav" aria-label={t("navLabel")}>
        {links.map(([label, id]) => (
          <button key={id} type="button" onClick={() => navigate(id)}>
            {label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <LanguageSwitcher />
        <Button className="desktop-signup" onClick={onSignup}>
          {t("signup.action")}
        </Button>
      </div>

      <button
        type="button"
        className="icon-button mobile-menu-button"
        aria-label={menuOpen ? t("closeNav") : t("openNav")}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <X size={24} /> : <List size={26} />}
      </button>

      {menuOpen ? (
        <div className="mobile-nav">
          {links.map(([label, id]) => (
            <button key={id} type="button" onClick={() => navigate(id)}>
              {label}
              <ArrowRight size={18} />
            </button>
          ))}
          <Button onClick={onSignup}>{t("signup.action")}</Button>
        </div>
      ) : null}
    </header>
  );
}

function SignupDialog({ open, onClose }) {
  const { t } = useI18n();
  return (
    <Dialog open={open} onClose={onClose} label={t("signup.dialogLabel")}>
      <div className="signup-dialog">
        <div className="section-kicker">{t("signup.kicker")}</div>
        <h2>{t("signup.title")}</h2>
        <p>{t("signup.description")}</p>
        <div className="signup-dialog__commitment">
          <CheckCircle size={22} weight="fill" />
          <div>
            <strong>{t("signup.confirmTitle")}</strong>
            <span>{t("signup.confirmText")}</span>
          </div>
        </div>
        <div className="signup-dialog__qr">
          <img
            src="/assets/registration/wechat-group-qr-20260730.jpg"
            alt={t("signup.qrAlt")}
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget
                .closest(".signup-dialog__qr")
                ?.classList.add("is-unavailable");
            }}
          />
          <div className="qr-fallback">
            <strong>{t("signup.qrUnavailable")}</strong>
            <span>{t("signup.qrUnavailableHelp")}</span>
          </div>
        </div>
        <div className="signup-dialog__notice">
          <Clock size={18} />
          {t("signup.qrNotice")}
        </div>
      </div>
    </Dialog>
  );
}

function Hero({ onSignup }) {
  const { t } = useI18n();
  const scrollToCollect = () => {
    document.getElementById("collect")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="top" className="hero">
      <img
        className="hero__art"
        src="/assets/decor/lanna-history-ribbon.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="hero__content">
        <div className="hero__series">
          <span>{t("hero.series")}</span>
          <span>{t("hero.event")}</span>
        </div>
        <h1>
          <span>{t("hero.headlineBefore")}</span>
          <em>Lanna</em>
          <span>{t("hero.headlineAfter")}</span>
        </h1>
        <div className="hero__subtitle">
          <Sparkle size={23} weight="fill" />
          {t("hero.subtitle")}
          <Sparkle size={17} weight="fill" />
        </div>

        <div className="hero__credits">
          <div className="initiator" aria-label={`WaytoAGI ${t("hero.initiator")}`}>
            <img
              src="/assets/brand/waytoagi-logo-transparent.svg"
              alt="WaytoAGI"
            />
            <span>{t("hero.initiator")}</span>
          </div>
          <div className="hero__venue-credit">
            {t("hero.venue")}
          </div>
        </div>

        <dl className="hero__facts">
          <div>
            <dt>
              <CalendarBlank size={19} />
              {t("hero.timeLabel")}
            </dt>
            <dd>{t("hero.time")}</dd>
          </div>
          <div>
            <dt>
              <MapPin size={19} />
              {t("hero.placeLabel")}
            </dt>
            <dd>CMI Studio</dd>
          </div>
          <div>
            <dt>
              <Buildings size={19} />
              {t("hero.locationLabel")}
            </dt>
            <dd>{t("hero.location")}</dd>
          </div>
        </dl>

        <div className="hero__actions">
          <Button
            onClick={onSignup}
            icon={<Sparkle size={21} weight="fill" />}
          >
            {t("signup.action")}
          </Button>
          <Button
            variant="outline"
            className="hero__collect-button"
            onClick={scrollToCollect}
            icon={<Camera size={21} />}
          >
            {t("hero.collect")}
          </Button>
        </div>
      </div>
      <button
        className="scroll-cue"
        type="button"
        onClick={() =>
          document.getElementById("works")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {t("hero.worksCue")}
        <ArrowDown size={18} />
      </button>
    </section>
  );
}

function WorkCard({ work, onOpenVideo }) {
  const { t } = useI18n();
  const isWebsite = work.type === "website";
  const isVideo = Boolean(work.videoSrc);
  const CardTag = work.href ? "a" : "article";
  const cardProps = work.href
    ? {
        href: work.href,
        target: "_blank",
        rel: "noreferrer",
        "aria-label": t("works.open", { title: work.title }),
      }
    : isVideo
      ? {
          role: "button",
          tabIndex: 0,
          "aria-label": t("works.play", { title: work.title }),
          onClick: () => onOpenVideo(work),
          onKeyDown: (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onOpenVideo(work);
            }
          },
        }
      : {};

  return (
    <CardTag
      className={`work-card ${work.href || isVideo ? "is-interactive" : ""}`}
      {...cardProps}
    >
      <div className={`work-card__cover ${work.cover ? "has-cover" : "is-pending"}`}>
        {work.cover ? (
          <img
            src={work.cover}
            alt={t("works.coverAlt", { title: work.title })}
            style={
              work.coverPosition
                ? { objectPosition: work.coverPosition }
                : undefined
            }
          />
        ) : (
          <div className="work-card__cover-placeholder">
            <span>VIDEO COVER</span>
            <strong>{work.number}</strong>
          </div>
        )}
        <div className="work-card__media">
          {isWebsite ? (
            <GlobeHemisphereWest size={17} weight="bold" />
          ) : (
            <VideoCamera size={17} weight="bold" />
          )}
          {work.medium}
        </div>
        <span className="work-card__number">/ {work.number}</span>
      </div>

      <div className="work-card__body">
        <div className="work-card__title-row">
          <h3>{work.title}</h3>
          {work.href ? (
            <span className="work-card__open" aria-hidden="true">
              <ArrowRight size={21} weight="bold" />
            </span>
          ) : isVideo ? (
            <span className="work-card__play" aria-hidden="true">
              <Play size={17} weight="fill" />
            </span>
          ) : null}
        </div>
        <p>{work.description}</p>
        <div className="work-card__creator">
          <span>{t("works.creator")}</span>
          <strong>{work.creator}</strong>
        </div>
      </div>
    </CardTag>
  );
}

function WorkVideoDialog({ work, onClose }) {
  const { t } = useI18n();
  if (!work) {
    return null;
  }

  return (
    <Dialog
      open
      onClose={onClose}
      label={t("works.play", { title: work.title })}
      size="wide"
    >
      <div className="work-video-dialog">
        <div className="work-video-dialog__copy">
          <div className="section-kicker section-kicker--light">
            VIDEO / {work.medium}
          </div>
          <h2>{work.title}</h2>
          <p>{work.description}</p>
          <div className="work-video-dialog__creator">
            <span>{t("works.creator")}</span>
            <strong>{work.creator}</strong>
          </div>
        </div>
        <div className="work-video-dialog__player">
          <video
            key={work.videoSrc}
            controls
            playsInline
            preload="metadata"
            poster={work.cover}
          >
            <source src={work.videoSrc} type="video/mp4" />
            {t("works.videoUnsupported")}
          </video>
        </div>
      </div>
    </Dialog>
  );
}

function WorksShowcase() {
  const { t } = useI18n();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const worksRailRef = useRef(null);
  const featuredWorks = useMemo(() => getFeaturedWorks(t), [t]);

  const scrollWorks = (direction) => {
    const rail = worksRailRef.current;
    const firstCard = rail?.querySelector(".work-card");

    if (!rail || !firstCard) {
      return;
    }

    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 18;
    rail.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  };

  return (
    <>
      <section id="works" className="works-showcase" aria-labelledby="works-title">
        <div className="works-showcase__header">
          <div>
            <div className="section-kicker">{t("works.kicker")}</div>
            <h2 id="works-title">
              {t("works.titleLine1")}
              <br />
              {t("works.titleLine2")}
            </h2>
          </div>
          <div className="works-showcase__intro">
            <span>JUL 26 · CMI STUDIO</span>
            <p>{t("works.intro")}</p>
          </div>
        </div>

        <div className="works-showcase__rail-shell">
          <div className="works-showcase__rail-toolbar">
            <span>04 WORKS · HORIZONTAL VIEW</span>
            <div className="works-showcase__rail-actions">
              <button
                type="button"
                aria-label={t("works.previous")}
                onClick={() => scrollWorks(-1)}
              >
                <ArrowLeft size={20} weight="bold" />
              </button>
              <button
                type="button"
                aria-label={t("works.next")}
                onClick={() => scrollWorks(1)}
              >
                <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          </div>
          <div
            ref={worksRailRef}
            className="works-showcase__rail"
            aria-label={t("works.railLabel")}
          >
          {featuredWorks.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onOpenVideo={setSelectedVideo}
            />
          ))}
          </div>
        </div>

        <div className="works-showcase__footer">
          <span>01—04 / FIRST DROP</span>
          <p>{t("works.footer")}</p>
        </div>
      </section>
      <WorkVideoDialog
        work={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}

function Manifesto() {
  const { t } = useI18n();
  return (
    <section id="about" className="manifesto">
      <img
        className="manifesto__ribbon"
        src="/assets/decor/lanna-history-ribbon.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="manifesto__content">
        <div className="section-kicker">{t("manifesto.kicker")}</div>
        <h2>
          {t("manifesto.title1")}
          <br />
          {t("manifesto.title2")}{" "}
          <strong>{t("manifesto.pattern")}</strong>
          {t("manifesto.title3")}
        </h2>
        <p className="manifesto__intro">{t("manifesto.intro")}</p>
        <p className="manifesto__creative">
          <Sparkle size={24} weight="fill" />
          {t("manifesto.creative1")}
          <span>{t("manifesto.creative2")}</span>
        </p>
        <h3>{t("manifesto.outcomeTitle")}</h3>
        <p className="manifesto__outcome">{t("manifesto.outcome")}</p>
        <div className="manifesto__credits">{t("manifesto.credits")}</div>
        <a className="manifesto__next" href="#journey">
          {t("manifesto.next")}
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}

function Journey() {
  const { language, t } = useI18n();
  const localizedSteps = useMemo(
    () => getParticipationSteps(language),
    [language],
  );
  return (
    <section id="journey" className="journey section-shell">
      <div className="section-heading section-heading--split">
        <div>
          <div className="section-kicker">{t("journey.kicker")}</div>
          <h2>{t("journey.title")}</h2>
        </div>
        <p>{t("journey.intro")}</p>
      </div>

      <ol className="fishbone">
        {localizedSteps.map((step, index) => (
          <li
            key={step.id}
            className={index % 2 === 0 ? "fishbone__item is-top" : "fishbone__item is-bottom"}
            style={{ "--step-color": toneColors[step.tone] }}
          >
            <div className="fishbone__node">
              <span>{step.id}</span>
              <Check size={13} weight="bold" />
            </div>
            <div className="fishbone__content">
              <span className="fishbone__phase">{step.phase}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="journey__cta">
        <a className="button button--primary" href="#museums">
          <span>{t("journey.choose")}</span>
          <ArrowDown size={19} />
        </a>
      </div>
    </section>
  );
}

function MuseumSection() {
  const { language, t } = useI18n();
  const [hoveredMuseum, setHoveredMuseum] = useState(null);
  const localizedMuseums = useMemo(() => getMuseums(language), [language]);

  return (
    <section id="museums" className="museum-section">
      <div className="museum-section__heading">
        <div className="section-kicker section-kicker--light">
          {t("museums.kicker")}
        </div>
        <h2>{t("museums.title")}</h2>
        <p>{t("museums.intro")}</p>
      </div>

      <div
        className={`museum-stage ${
          hoveredMuseum ? `museum-stage--${hoveredMuseum}` : ""
        }`}
        onMouseLeave={() => setHoveredMuseum(null)}
      >
        {localizedMuseums.map((museum) => (
            <article
              key={museum.id}
              className={`museum-card museum-card--${museum.id}`}
              tabIndex={0}
              onMouseEnter={() => setHoveredMuseum(museum.id)}
              onFocus={() => setHoveredMuseum(museum.id)}
              onBlur={() => setHoveredMuseum(null)}
            >
              <img
                src={museum.image}
                alt={t("museums.sceneAlt", { name: museum.chineseName })}
                className="museum-card__image"
              />
              <div className="museum-card__wash" />
              <div className="museum-card__index">{museum.index}</div>
              <div className="museum-card__content">
                <div className="museum-card__title">
                  <span>{museum.name}</span>
                  <h3>{museum.chineseName}</h3>
                </div>
                <p>{museum.description}</p>
                <dl>
                  <div>
                    <MapPin size={18} />
                    <span>{museum.address}</span>
                  </div>
                  <div>
                    <Clock size={18} />
                    <span>{museum.hours}</span>
                  </div>
                  <div>
                    <Buildings size={18} />
                    <span>{museum.ticket}</span>
                  </div>
                </dl>
                <div className="museum-card__actions">
                  <a
                    className="button button--light"
                    href={museum.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GlobeHemisphereWest size={18} />
                    <span>{t("museums.website")}</span>
                  </a>
                  <a
                    className="button button--ghost-light"
                    href={museum.map}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin size={18} />
                    <span>{t("museums.map")}</span>
                  </a>
                </div>
                <small>{t("museums.source", { source: museum.source })}</small>
              </div>
            </article>
          ))}
      </div>

      <div className="museum-mobile-indicator" aria-hidden="true">
        <span>1</span>
        <i />
        <span>2</span>
      </div>
    </section>
  );
}

function FieldLabel({ icon, children, optional = false }) {
  const { t } = useI18n();
  return (
    <span className="field-label field-label--icon">
      <span>
        {icon}
        {children}
      </span>
      {optional ? <small>{t("optional")}</small> : null}
    </span>
  );
}

function FilePicker({ label, helper, files, setFiles, minimum = 0, maximum = 6 }) {
  const { t } = useI18n();
  const uploadInputRef = useRef(null);
  const captureInputRef = useRef(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews],
  );

  const addFiles = (incoming) => {
    const next = [...files, ...Array.from(incoming || [])].slice(0, maximum);
    setFiles(next);
  };

  const handleInput = (event) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  return (
    <div
      className="file-picker"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        addFiles(event.dataTransfer.files);
      }}
    >
      <div className="file-picker__heading">
        <div>
          <ImageSquare size={20} weight="fill" />
          <span>{label}</span>
        </div>
        <small>
          {files.length}/{maximum}
          {minimum ? ` · ${t("collect.minimum", { count: minimum })}` : ""}
        </small>
      </div>
      <p>{helper}</p>
      <div className="file-picker__actions">
        <Button
          variant="outline"
          onClick={() => uploadInputRef.current?.click()}
          icon={<UploadSimple size={20} />}
        >
          {t("collect.upload")}
        </Button>
        <Button
          variant="soft"
          onClick={() => captureInputRef.current?.click()}
          icon={<Camera size={20} />}
        >
          {t("collect.capture")}
        </Button>
      </div>
      <small className="file-picker__format">
        {t("collect.format")}
      </small>
      <input
        ref={uploadInputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={maximum > 1}
        onChange={handleInput}
      />
      <input
        ref={captureInputRef}
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleInput}
      />
      {previews.length ? (
        <div className="file-previews">
          {previews.map((preview, index) => (
            <div className="file-preview" key={`${preview.file.name}-${index}`}>
              <img src={preview.url} alt="" />
              <button
                type="button"
                aria-label={t("collect.remove", { name: preview.file.name })}
                onClick={() =>
                  setFiles(
                    files.filter((_, fileIndex) => fileIndex !== index),
                  )
                }
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const normalizeAccessCode = (value) =>
  value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");

function localizeRuntimeError(message, language, fallback) {
  if (language === "zh" || !message) {
    return message || fallback;
  }

  if (/1\.5MB/.test(message)) {
    return language === "th"
      ? "ภาพยังมีขนาดเกิน 1.5MB หลังประมวลผล โปรดเลือกภาพที่เล็กกว่า"
      : "The image is still larger than 1.5MB after processing. Choose a smaller image.";
  }
  if (/图片|图像|image/i.test(message)) {
    return language === "th"
      ? "ไม่สามารถอ่านหรือประมวลผลภาพได้ โปรดอัปโหลดใหม่แล้วลองอีกครั้ง"
      : "The image could not be read or processed. Upload it again and retry.";
  }

  return fallback;
}

function CollectionForm({ open, onClose, onPreview, onPublished }) {
  const { language, t } = useI18n();
  const wizardPages = useMemo(
    () => [
      {
        id: "01",
        title: t("collect.step1Title"),
        description: t("collect.step1Description"),
        icon: <IdentificationCard size={24} weight="fill" />,
      },
      {
        id: "02+03",
        title: t("collect.step2Title"),
        description: t("collect.step2Description"),
        icon: <Camera size={24} weight="fill" />,
      },
      {
        id: "04",
        title: t("collect.step3Title"),
        description: t("collect.step3Description"),
        icon: <NotePencil size={24} weight="fill" />,
      },
    ],
    [t],
  );
  const [page, setPage] = useState(1);
  const [detailFiles, setDetailFiles] = useState([]);
  const [contextFiles, setContextFiles] = useState([]);
  const [labelFiles, setLabelFiles] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [values, setValues] = useState({
    museum: "lanna_folklife",
    sourceTitle: "",
    sourceLocation: "",
    observation: "",
    verifiedInformation: "",
    openQuestion: "",
    carrier: "",
    position: "",
    structure: "",
    material: "",
    collectorName: "",
    accessCode: "",
  });

  useEffect(() => {
    if (open) {
      setPage(1);
      setStatus({ type: "idle", message: "" });
    }
  }, [open]);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const goNext = () => {
    setStatus({ type: "idle", message: "" });
    if (page === 2 && (!detailFiles.length || !contextFiles.length)) {
      setStatus({
        type: "error",
        message: t("collect.imageRequired"),
      });
      return;
    }
    setPage((current) => Math.min(3, current + 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!detailFiles.length || !contextFiles.length) {
      setPage(2);
      setStatus({
        type: "error",
        message: t("collect.imageRequired"),
      });
      return;
    }
    if (!values.observation.trim()) {
      setStatus({ type: "error", message: t("collect.observationRequired") });
      return;
    }
    if (!values.accessCode.trim()) {
      setStatus({ type: "error", message: t("collect.codeRequired") });
      return;
    }

    const normalizedValues = {
      ...values,
      accessCode: normalizeAccessCode(values.accessCode),
    };

    if (!isSupabaseConfigured) {
      const preview = createLocalPreviewPattern(
        normalizedValues,
        detailFiles,
        contextFiles,
        labelFiles,
      );
      onClose();
      onPreview(preview);
      return;
    }

    try {
      setStatus({ type: "loading", message: t("collect.uploading") });
      const [preparedDetails, preparedContexts, preparedLabels] =
        await Promise.all([
          Promise.all(detailFiles.map(prepareImageFile)),
          Promise.all(contextFiles.map(prepareImageFile)),
          Promise.all(labelFiles.map(prepareImageFile)),
        ]);

      const payload = new FormData();
      payload.append(
        "metadata",
        JSON.stringify({
          museum: normalizedValues.museum,
          sourceTitle: normalizedValues.sourceTitle,
          sourceLocation: normalizedValues.sourceLocation,
          observation: normalizedValues.observation,
          verifiedInformation: normalizedValues.verifiedInformation,
          openQuestion: normalizedValues.openQuestion,
          carrierTags: normalizedValues.carrier
            ? [normalizedValues.carrier]
            : [],
          positionTags: normalizedValues.position
            ? [normalizedValues.position]
            : [],
          structureTags: normalizedValues.structure
            ? [normalizedValues.structure]
            : [],
          materialTags: normalizedValues.material
            ? [normalizedValues.material]
            : [],
          collectorName: normalizedValues.collectorName,
          accessCode: normalizedValues.accessCode,
        }),
      );
      preparedDetails.forEach((file) => payload.append("detailImages", file));
      preparedContexts.forEach((file) => payload.append("contextImages", file));
      preparedLabels.forEach((file) => payload.append("labelImages", file));

      const result = await submitPattern(payload);
      onClose();
      onPublished(result);
    } catch (error) {
      setStatus({
        type: "error",
        message: localizeRuntimeError(
          error.message,
          language,
          t("collect.submitFailed"),
        ),
      });
    }
  };

  const currentPage = wizardPages[page - 1];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label={t("collect.wizardLabel")}
      size="collector"
    >
      <form className="collection-form" onSubmit={handleSubmit}>
        <header className="collector-wizard__header">
          <div>
            <div className="section-kicker">{t("collect.kicker")}</div>
            <h2>{t("collect.title")}</h2>
          </div>
          {!isSupabaseConfigured ? (
            <div className="collector-wizard__mode">
              <Sparkle size={18} weight="fill" />
              {t("collect.localPreview")}
            </div>
          ) : null}
        </header>

        <ol className="collector-wizard__progress">
          {wizardPages.map((item, index) => (
            <li
              key={item.id}
              className={`${page === index + 1 ? "is-current" : ""} ${
                page > index + 1 ? "is-complete" : ""
              }`}
            >
              <span>{page > index + 1 ? <Check size={14} /> : item.id}</span>
              <strong>{item.title}</strong>
            </li>
          ))}
        </ol>

        <section className="wizard-page" aria-live="polite">
          <div className="wizard-page__intro">
            <div className="wizard-page__icon">{currentPage.icon}</div>
            <div>
              <span>STEP {currentPage.id}</span>
              <h3>{currentPage.title}</h3>
              <p>{currentPage.description}</p>
            </div>
          </div>

          {page === 1 ? (
            <div className="wizard-page__content">
              <div className="form-grid form-grid--2">
                <label className="field">
                  <FieldLabel icon={<Buildings size={18} weight="fill" />}>
                    {t("collect.museum")}
                  </FieldLabel>
                  <div className="select-wrap">
                    <select name="museum" value={values.museum} onChange={update}>
                      <option value="lanna_folklife">{t("taxonomy.lannaMuseum")}</option>
                      <option value="fam">{t("taxonomy.famMuseum")}</option>
                      <option value="other">{t("taxonomy.otherSource")}</option>
                    </select>
                    <CaretDown size={17} />
                  </div>
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<IdentificationCard size={18} weight="fill" />}
                    optional
                  >
                    {t("collect.collectorName")}
                  </FieldLabel>
                  <input
                    name="collectorName"
                    value={values.collectorName}
                    onChange={update}
                    placeholder={t("collect.collectorPlaceholder")}
                  />
                </label>
              </div>
              <div className="form-grid form-grid--2">
                <label className="field">
                  <FieldLabel icon={<ImageSquare size={18} weight="fill" />}>
                    {t("collect.sourceTitle")}
                  </FieldLabel>
                  <input
                    name="sourceTitle"
                    value={values.sourceTitle}
                    onChange={update}
                    placeholder={t("collect.sourceTitlePlaceholder")}
                  />
                </label>
                <label className="field">
                  <FieldLabel icon={<MapPin size={18} weight="fill" />}>
                    {t("collect.location")}
                  </FieldLabel>
                  <input
                    name="sourceLocation"
                    value={values.sourceLocation}
                    onChange={update}
                    placeholder={t("collect.locationPlaceholder")}
                  />
                </label>
              </div>
            </div>
          ) : null}

          {page === 2 ? (
            <div className="wizard-page__content">
              <div className="form-grid form-grid--2 form-grid--files">
                <FilePicker
                  label={t("collect.detailImage")}
                  helper={t("collect.detailHelp")}
                  files={detailFiles}
                  setFiles={setDetailFiles}
                  minimum={1}
                  maximum={6}
                />
                <FilePicker
                  label={t("collect.contextImage")}
                  helper={t("collect.contextHelp")}
                  files={contextFiles}
                  setFiles={setContextFiles}
                  minimum={1}
                  maximum={6}
                />
              </div>
              <FilePicker
                label={t("collect.labelImage")}
                helper={t("collect.labelHelp")}
                files={labelFiles}
                setFiles={setLabelFiles}
                maximum={3}
              />
            </div>
          ) : null}

          {page === 3 ? (
            <div className="wizard-page__content">
              <div className="form-grid form-grid--3">
                <label className="field">
                  <FieldLabel icon={<Binoculars size={18} weight="fill" />}>
                    {t("collect.observation")}
                  </FieldLabel>
                  <textarea
                    name="observation"
                    value={values.observation}
                    onChange={update}
                    placeholder={t("collect.observationPlaceholder")}
                    rows={5}
                    required
                  />
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<CheckCircle size={18} weight="fill" />}
                    optional
                  >
                    {t("collect.verified")}
                  </FieldLabel>
                  <textarea
                    name="verifiedInformation"
                    value={values.verifiedInformation}
                    onChange={update}
                    placeholder={t("collect.verifiedPlaceholder")}
                    rows={5}
                  />
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<NotePencil size={18} weight="fill" />}
                    optional
                  >
                    {t("collect.unknown")}
                  </FieldLabel>
                  <textarea
                    name="openQuestion"
                    value={values.openQuestion}
                    onChange={update}
                    placeholder={t("collect.unknownPlaceholder")}
                    rows={5}
                  />
                </label>
              </div>

              <div className="form-grid form-grid--4">
                {[
                  ["carrier", "taxonomy.carrier", [["", ""], ["织物", "taxonomy.textile"], ["器物", "taxonomy.object"], ["建筑", "taxonomy.architecture"], ["雕塑", "taxonomy.sculpture"], ["壁画", "taxonomy.mural"], ["编织结构", "taxonomy.weave"], ["装置", "taxonomy.installation"]]],
                  ["position", "taxonomy.position", [["", ""], ["中心", "taxonomy.center"], ["边缘", "taxonomy.edge"], ["底部", "taxonomy.bottom"], ["表面", "taxonomy.surface"], ["身体", "taxonomy.body"], ["入口", "taxonomy.entrance"]]],
                  ["structure", "taxonomy.structure", [["", ""], ["重复", "taxonomy.repeat"], ["对称", "taxonomy.symmetry"], ["交织", "taxonomy.interlace"], ["环绕", "taxonomy.surround"], ["放射", "taxonomy.radiate"], ["延伸", "taxonomy.extend"], ["层叠", "taxonomy.layer"]]],
                  ["material", "taxonomy.material", [["", ""], ["织物", "taxonomy.textile"], ["木", "taxonomy.wood"], ["陶", "taxonomy.ceramic"], ["漆", "taxonomy.lacquer"], ["金属", "taxonomy.metal"], ["石材", "taxonomy.stone"], ["竹", "taxonomy.bamboo"], ["颜料", "taxonomy.pigment"]]],
                ].map(([name, labelKey, options]) => {
                  const label = t(labelKey);
                  return (
                  <label className="field" key={name}>
                    <FieldLabel icon={<Sparkle size={16} weight="fill" />}>
                      {label}
                    </FieldLabel>
                    <div className="select-wrap">
                      <select name={name} value={values[name]} onChange={update}>
                        {options.map(([value, optionKey]) => (
                          <option value={value} key={value || "empty"}>
                            {value
                              ? t(optionKey)
                              : t("taxonomy.choose", { label })}
                          </option>
                        ))}
                      </select>
                      <CaretDown size={17} />
                    </div>
                  </label>
                  );
                })}
              </div>

              <label className="field access-code-field">
                <FieldLabel icon={<Ticket size={18} weight="fill" />}>
                  {t("collect.accessCode")}
                </FieldLabel>
                <input
                  name="accessCode"
                  type="password"
                  value={values.accessCode}
                  onChange={update}
                  placeholder={t("collect.accessCodePlaceholder")}
                  autoComplete="off"
                />
                <small>{t("collect.accessCodeHelp")}</small>
              </label>
            </div>
          ) : null}
        </section>

        {status.message ? (
          <div className={`form-status form-status--${status.type}`} role="status">
            {status.type === "error" ? (
              <X size={18} weight="bold" />
            ) : (
              <CheckCircle size={19} weight="fill" />
            )}
            {status.message}
          </div>
        ) : null}

        <footer className="collector-wizard__actions">
          <div>
            {page > 1 ? (
              <Button
                variant="quiet"
                onClick={() => {
                  setStatus({ type: "idle", message: "" });
                  setPage((current) => Math.max(1, current - 1));
                }}
                icon={<ArrowLeft size={19} />}
              >
                {t("collect.previous")}
              </Button>
            ) : (
              <span>{t("collect.progress", { count: page - 1 })}</span>
            )}
          </div>
          {page < 3 ? (
            <Button onClick={goNext} icon={<ArrowRight size={19} />}>
              {t("collect.next")}
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={status.type === "loading"}
              icon={
                status.type === "loading" ? (
                  <span className="spinner" />
                ) : (
                  <SquaresFour size={20} weight="fill" />
                )
              }
            >
              {status.type === "loading"
                ? t("collect.submitting")
                : isSupabaseConfigured
                  ? t("collect.submit")
                  : t("collect.preview")}
            </Button>
          )}
        </footer>
      </form>
    </Dialog>
  );
}

function CollectionSection({ onPreview, onPublished, refreshKey }) {
  const { language, t } = useI18n();
  const [collectorOpen, setCollectorOpen] = useState(false);
  const [recentPatterns, setRecentPatterns] = useState(
    isSupabaseConfigured ? [] : archiveSamples.slice(0, 6),
  );
  const [recentCount, setRecentCount] = useState(
    isSupabaseConfigured ? 0 : archiveSamples.length,
  );
  const localizedRecentPatterns = useMemo(
    () => recentPatterns.map((pattern) => localizePattern(pattern, language)),
    [language, recentPatterns],
  );

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setRecentPatterns(archiveSamples.slice(0, 6));
      setRecentCount(archiveSamples.length);
      return undefined;
    }

    let active = true;
    fetchPublishedPatterns()
      .then((patterns) => {
        if (!active) return;
        setRecentPatterns(patterns.slice(0, 6));
        setRecentCount(patterns.length);
      })
      .catch(() => {
        if (!active) return;
        setRecentPatterns([]);
        setRecentCount(0);
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <section id="collect" className="collection-section section-shell">
      <div className="section-heading section-heading--split">
        <div>
          <div className="section-kicker">{t("collect.sectionKicker")}</div>
          <h2>{t("collect.sectionTitle")}</h2>
        </div>
        <p>{t("collect.sectionIntro")}</p>
      </div>

      <div className="collection-portal">
        <article className="collection-entry-card">
          <img
            className="collection-entry-card__ribbon"
            src="/assets/decor/lanna-history-ribbon.jpg"
            alt=""
            aria-hidden="true"
          />
          <div className="collection-entry-card__top">
            <span>NEW COLLECTION</span>
            <strong>01 · 02+03 · 04</strong>
          </div>
          <div className="collection-entry-card__seal">
            <Camera size={34} weight="fill" />
          </div>
          <div className="collection-entry-card__copy">
            <p>CMI · LANNA PATTERN ARCHIVE</p>
            <h3>{t("collect.cardTitle")}</h3>
            <span>{t("collect.cardMeta")}</span>
          </div>
          <Button
            variant="accent"
            onClick={() => setCollectorOpen(true)}
            icon={<Sparkle size={20} weight="fill" />}
          >
            {t("collect.newPattern")}
          </Button>
        </article>

        <div className="collection-recent">
          <header>
            <div>
              <span>RECENTLY COLLECTED</span>
              <h3>{t("collect.recentTitle")}</h3>
            </div>
            <a href="#archive">
              {t("collect.viewAll", { count: recentCount })}
              <ArrowDown size={17} />
            </a>
          </header>
          {recentPatterns.length ? (
            <div className="collection-recent__grid">
              {localizedRecentPatterns.map((pattern) => (
                <button
                  type="button"
                  key={pattern.id}
                  onClick={() => onPreview(pattern)}
                  aria-label={t("collect.viewPattern", {
                    number: pattern.archive_number,
                    title: pattern.source_title,
                  })}
                >
                  <img src={pattern.detail_image_urls[0]} alt="" />
                  <span>{pattern.archive_number}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="collection-recent__empty">
              <Images size={30} />
              <p>{t("collect.empty")}</p>
            </div>
          )}
        </div>
      </div>

      <CollectionForm
        open={collectorOpen}
        onClose={() => setCollectorOpen(false)}
        onPreview={onPreview}
        onPublished={onPublished}
      />
    </section>
  );
}

function PatternCard({ pattern, cardRef }) {
  const { language, t } = useI18n();
  const tags = [
    ...(pattern.carrier_tags || []),
    ...(pattern.structure_tags || []),
    ...(pattern.material_tags || []),
  ].slice(0, 5);
  const collectorName = pattern.collector_name?.trim() || t("archive.anonymous");
  const capturedAt = formatPatternCapturedAt(pattern, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }, false, language === "th" ? "th-TH-u-ca-gregory" : language === "en" ? "en-GB" : "zh-CN");

  return (
    <article className="pattern-card-export" ref={cardRef}>
      <header>
        <div className="pattern-card-export__brand">
          <img src="/assets/brand/cmi-community.svg" alt="" />
          <span>CMI · LANNA PATTERN ARCHIVE</span>
        </div>
        <strong>{pattern.archive_number}</strong>
      </header>
      <div className="pattern-card-export__visual">
        <img
          src={pattern.detail_image_urls?.[0]}
          alt=""
          crossOrigin="anonymous"
        />
        <div className="pattern-card-export__context">
          <img
            src={pattern.context_image_urls?.[0]}
            alt=""
            crossOrigin="anonymous"
          />
        </div>
      </div>
      <div className="pattern-card-export__body">
        <div className="pattern-card-export__eyebrow">
          {pattern.museumLabel ||
            (pattern.museum === "fam"
              ? "FAM Fahlanna Art Museum"
              : t("taxonomy.lannaMuseum"))}
        </div>
        <div className="pattern-card-export__collector">
          <span>{t("archive.collectedBy")}</span>
          <strong>{collectorName}</strong>
          {capturedAt ? (
            <span className="pattern-card-export__captured-at">
              {t("archive.capturedAt", { date: capturedAt })}
            </span>
          ) : null}
        </div>
        <h3>{pattern.source_title}</h3>
        <div className="pattern-card-export__tags">
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`}>{tag}</span>
          ))}
        </div>
        <p>{pattern.observation}</p>
      </div>
      <footer>
        <span>{t("archive.footer1")}</span>
        <span>{t("archive.footer2")}</span>
      </footer>
    </article>
  );
}

function PatternDetailDialog({ pattern, onClose, onUseForIdea }) {
  const { language, t } = useI18n();
  const cardRef = useRef(null);
  const [downloadStatus, setDownloadStatus] = useState("idle");
  const [downloadError, setDownloadError] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const allImages = [
    ...(pattern?.detail_image_urls || []),
    ...(pattern?.context_image_urls || []),
    ...(pattern?.label_image_urls || []),
  ];

  useEffect(() => {
    setDownloadStatus("idle");
    setDownloadError("");
    setLightboxIndex(null);
  }, [pattern?.id]);

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setLightboxIndex(null);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setLightboxIndex((current) =>
          current === null ? 0 : (current + 1) % allImages.length,
        );
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLightboxIndex((current) =>
          current === null
            ? 0
            : (current - 1 + allImages.length) % allImages.length,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [allImages.length, lightboxIndex]);

  if (!pattern) {
    return null;
  }

  const downloadCard = async () => {
    try {
      setDownloadStatus("loading");
      setDownloadError("");
      const blob = await renderPatternCardPng(pattern, language);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const safeNumber = pattern.archive_number.replace(/[^a-zA-Z0-9-]/g, "-");
      anchor.download = `${safeNumber}-lanna-pattern-card.png`;
      anchor.href = objectUrl;
      anchor.style.display = "none";
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
      setDownloadStatus("success");
    } catch (error) {
      console.error("Pattern card export failed", error);
      setDownloadError(
        localizeRuntimeError(
          error.message,
          language,
          t("archive.exportFailed"),
        ),
      );
      setDownloadStatus("error");
    }
  };

  return (
    <Dialog
      open={Boolean(pattern)}
      onClose={onClose}
      label={t("archive.details", { number: pattern.archive_number })}
      size="wide"
      disableEscape={lightboxIndex !== null}
    >
      <div className="pattern-detail">
        <div className="pattern-detail__card-column">
          <PatternCard pattern={pattern} cardRef={cardRef} />
          <Button
            onClick={downloadCard}
            disabled={downloadStatus === "loading"}
            icon={<DownloadSimple size={20} />}
          >
            {downloadStatus === "loading"
              ? t("archive.generating")
              : downloadStatus === "success"
                ? t("archive.downloaded")
                : t("archive.download")}
          </Button>
          {downloadStatus === "error" ? (
            <p className="download-error">{downloadError}</p>
          ) : null}
        </div>
        <div className="pattern-detail__info">
          <div className="section-kicker">ARCHIVE DETAIL</div>
          <h2>{pattern.archive_number}</h2>
          <h3>{pattern.source_title}</h3>
          <p className="pattern-detail__collector">
            <IdentificationCard size={19} />
            <span>{t("archive.collector")}</span>
            <strong>
              {pattern.collector_name?.trim() || t("archive.anonymous")}
            </strong>
          </p>
          <p className="pattern-detail__source">
            <MapPin size={17} />
            {pattern.source_location || t("archive.sourceMissing")}
          </p>
          {formatPatternCapturedAt(
            pattern,
            undefined,
            false,
            language === "th"
              ? "th-TH-u-ca-gregory"
              : language === "en"
                ? "en-GB"
                : "zh-CN",
          ) ? (
            <p className="pattern-detail__source">
              <CalendarBlank size={17} />
              {t("archive.actualTime", {
                date: formatPatternCapturedAt(
                  pattern,
                  undefined,
                  false,
                  language === "th"
                    ? "th-TH-u-ca-gregory"
                    : language === "en"
                      ? "en-GB"
                      : "zh-CN",
                ),
              })}
            </p>
          ) : null}
          {pattern.preview ? (
            <div className="preview-label">{t("archive.previewLabel")}</div>
          ) : null}
          <Button
            className="pattern-detail__idea-button"
            variant="outline"
            icon={<MagicWand size={20} />}
            onClick={() => onUseForIdea(pattern)}
          >
            {t("archive.idea")}
          </Button>
          <dl className="pattern-detail__notes">
            <div>
              <dt>{t("archive.observation")}</dt>
              <dd>{pattern.observation || t("archive.emptyObservation")}</dd>
            </div>
            <div>
              <dt>{t("archive.verified")}</dt>
              <dd>{pattern.verified_information || t("archive.emptyVerified")}</dd>
            </div>
            <div>
              <dt>{t("archive.unknown")}</dt>
              <dd>{pattern.open_question || t("archive.emptyUnknown")}</dd>
            </div>
          </dl>
          <div className="pattern-detail__gallery">
            {allImages.map((url, index) => (
              <button
                type="button"
                className="pattern-detail__thumb"
                key={`${url}-${index}`}
                aria-label={t("archive.enlarge", {
                  number: pattern.archive_number,
                  index: index + 1,
                })}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={url}
                  alt={t("archive.imageAlt", {
                    number: pattern.archive_number,
                    index: index + 1,
                  })}
                />
                <span>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {String(allImages.length).padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {lightboxIndex !== null ? (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("archive.imagePreview", {
            number: pattern.archive_number,
          })}
          onMouseDown={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="image-lightbox__close"
            aria-label={t("archive.closePreview")}
            onClick={() => setLightboxIndex(null)}
          >
            <X size={25} weight="bold" />
          </button>
          <div
            className="image-lightbox__stage"
            onMouseDown={(event) => event.stopPropagation()}
          >
            {allImages.length > 1 ? (
              <button
                type="button"
                className="image-lightbox__nav image-lightbox__nav--previous"
                aria-label={t("archive.previousImage")}
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + allImages.length) % allImages.length,
                  )
                }
              >
                <ArrowLeft size={28} weight="bold" />
              </button>
            ) : null}
            <img
              src={allImages[lightboxIndex]}
              alt={t("archive.enlargedAlt", {
                number: pattern.archive_number,
                index: lightboxIndex + 1,
              })}
            />
            {allImages.length > 1 ? (
              <button
                type="button"
                className="image-lightbox__nav image-lightbox__nav--next"
                aria-label={t("archive.nextImage")}
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex + 1) % allImages.length,
                  )
                }
              >
                <ArrowRight size={28} weight="bold" />
              </button>
            ) : null}
          </div>
          <div
            className="image-lightbox__caption"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span>{pattern.archive_number}</span>
            <strong>{pattern.source_title}</strong>
            <em>
              {lightboxIndex + 1} / {allImages.length}
            </em>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}

function ArchiveSection({ refreshKey, onOpenPattern }) {
  const { language, t } = useI18n();
  const [patterns, setPatterns] = useState(
    isSupabaseConfigured ? [] : archiveSamples,
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    museum: "all",
    carrier: "all",
    structure: "all",
  });
  const localizedFilterOptions = useMemo(
    () => getFilterOptions(language),
    [language],
  );

  const loadPatterns = async () => {
    if (!isSupabaseConfigured) {
      setPatterns(archiveSamples);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchPublishedPatterns();
      setPatterns(data);
    } catch {
      setError(t("archive.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatterns();
  }, [refreshKey]);

  const filteredPatterns = patterns.filter((pattern) => {
    const museumMatch =
      filters.museum === "all" || pattern.museum === filters.museum;
    const carrierMatch =
      filters.carrier === "all" ||
      pattern.carrier_tags?.includes(filters.carrier);
    const structureMatch =
      filters.structure === "all" ||
      pattern.structure_tags?.includes(filters.structure);
    return museumMatch && carrierMatch && structureMatch;
  });
  const localizedPatterns = useMemo(
    () =>
      filteredPatterns.map((pattern) => localizePattern(pattern, language)),
    [filteredPatterns, language],
  );

  return (
    <section id="archive" className="archive-section">
      <div className="section-shell">
        <div className="section-heading section-heading--split">
          <div>
            <div className="section-kicker">{t("archive.kicker")}</div>
            <h2>{t("archive.title")}</h2>
          </div>
          <p>{t("archive.intro")}</p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="archive-preview-notice">
            {t("archive.previewNotice", { count: archiveSamples.length })}
          </div>
        ) : null}

        <div className="archive-toolbar">
          <div className="archive-toolbar__filters">
            {Object.entries(localizedFilterOptions).map(([name, options]) => (
              <label key={name}>
                <span className="sr-only">
                  {name === "museum"
                    ? t("archive.museumFilter")
                    : name === "carrier"
                      ? t("archive.carrierFilter")
                      : t("archive.structureFilter")}
                </span>
                <select
                  value={filters[name]}
                  onChange={(event) =>
                    setFilters((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                >
                  {options.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <CaretDown size={16} />
              </label>
            ))}
          </div>
          <span>{t("archive.count", { count: localizedPatterns.length })}</span>
        </div>

        {loading ? (
          <div className="archive-state">
            <span className="spinner spinner--purple" />
            {t("archive.loading")}
          </div>
        ) : error ? (
          <div className="archive-state">
            <p>{error}</p>
            <Button variant="outline" onClick={loadPatterns}>
              {t("archive.reload")}
            </Button>
          </div>
        ) : localizedPatterns.length ? (
          <div className="archive-grid">
            {localizedPatterns.map((pattern) => (
              <button
                type="button"
                className="archive-tile"
                key={pattern.id}
                onClick={() => onOpenPattern(pattern)}
              >
                <img
                  src={pattern.detail_image_urls?.[0]}
                  alt={pattern.source_title}
                  loading="lazy"
                />
                <span className="archive-tile__number">
                  {pattern.archive_number}
                </span>
                <span className="archive-tile__collector">
                  {t("archive.tileCollector", {
                    name:
                      pattern.collector_name?.trim() || t("archive.anonymous"),
                  })}
                </span>
                <span className="archive-tile__hover">
                  <strong>{pattern.source_title}</strong>
                  <small>
                    {formatPatternCapturedAt(
                      pattern,
                      {
                        month: "2-digit",
                        day: "2-digit",
                      },
                      true,
                      language === "th"
                        ? "th-TH-u-ca-gregory"
                        : language === "en"
                          ? "en-GB"
                          : "zh-CN",
                    )}
                  </small>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="archive-state archive-state--empty">
            <Images size={34} />
            <h3>{t("archive.noMatches")}</h3>
            <p>{t("archive.noMatchesHelp")}</p>
            <a className="button button--primary" href="#collect">
              <span>{t("archive.start")}</span>
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

const ideaCategoryIcons = {
  any: Shuffle,
  writing: PenNib,
  image: Palette,
  video: VideoCamera,
  website: GlobeHemisphereWest,
  "3d": Cube,
  game: GameController,
  audio: SpeakerHigh,
  assistant: Sparkle,
  installation: Buildings,
};

function PossibilityGenerator({ preferredPattern }) {
  const { language, t } = useI18n();
  const fallbackPatterns = archiveSamples.slice(0, 18);
  const [patterns, setPatterns] = useState(fallbackPatterns);
  const [currentPattern, setCurrentPattern] = useState(
    preferredPattern || fallbackPatterns[0],
  );
  const [category, setCategory] = useState("any");
  const [idea, setIdea] = useState(() =>
    generateIdea(
      localizePattern(preferredPattern || fallbackPatterns[0], language),
      "any",
      "",
      language,
    ),
  );
  const [ideaTurn, setIdeaTurn] = useState(0);
  const generatorRef = useRef(null);
  const localizedCategories = useMemo(
    () => getIdeaCategories(language),
    [language],
  );
  const localizedCurrentPattern = useMemo(
    () => localizePattern(currentPattern, language),
    [currentPattern, language],
  );

  useEffect(() => {
    let cancelled = false;

    fetchPublishedPatterns()
      .then((publishedPatterns) => {
        if (cancelled || !publishedPatterns.length) {
          return;
        }

        setPatterns(publishedPatterns);
        setCurrentPattern((existing) => existing || publishedPatterns[0]);
      })
      .catch(() => {
        // The preview archive remains usable when the public archive is offline.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!preferredPattern) {
      return;
    }

    setCurrentPattern(preferredPattern);
    setIdea((current) =>
      generateIdea(
        localizePattern(preferredPattern, language),
        category,
        current?.id,
        language,
      ),
    );
    setIdeaTurn((turn) => turn + 1);
  }, [preferredPattern, language]);

  useEffect(() => {
    setIdea((current) =>
      generateIdea(
        localizedCurrentPattern,
        category,
        current?.id,
        language,
      ),
    );
    setIdeaTurn((turn) => turn + 1);
  }, [language]);

  const nextIdea = () => {
    setIdea((current) =>
      generateIdea(
        localizedCurrentPattern,
        category,
        current?.id,
        language,
      ),
    );
    setIdeaTurn((turn) => turn + 1);
  };

  const chooseCategory = (nextCategory) => {
    setCategory(nextCategory);
    setIdea((current) =>
      generateIdea(
        localizedCurrentPattern,
        nextCategory,
        current?.id,
        language,
      ),
    );
    setIdeaTurn((turn) => turn + 1);
  };

  const changePattern = () => {
    if (!patterns.length) {
      return;
    }

    const currentIndex = patterns.findIndex(
      (pattern) => pattern.id === currentPattern?.id,
    );
    const nextPattern = patterns[(currentIndex + 1) % patterns.length];
    setCurrentPattern(nextPattern);
    setIdea((current) =>
      generateIdea(
        localizePattern(nextPattern, language),
        category,
        current?.id,
        language,
      ),
    );
    setIdeaTurn((turn) => turn + 1);
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        event.code !== "Space" ||
        event.repeat ||
        event.target.closest("button, a, input, select, textarea, video")
      ) {
        return;
      }

      const bounds = generatorRef.current?.getBoundingClientRect();
      if (!bounds || bounds.bottom < 0 || bounds.top > window.innerHeight) {
        return;
      }

      event.preventDefault();
      nextIdea();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [category, currentPattern]);

  const CurrentIcon = ideaCategoryIcons[idea.category] || Sparkle;
  const collectorName =
    localizedCurrentPattern?.collector_name?.trim() || t("archive.anonymous");

  return (
    <section
      id="ideas"
      className="idea-generator"
      ref={generatorRef}
      aria-labelledby="idea-generator-title"
    >
      <div className="idea-generator__header section-shell">
        <div>
          <div className="section-kicker">{t("ideas.kicker")}</div>
          <h2 id="idea-generator-title">{t("ideas.title")}</h2>
        </div>
        <p>{t("ideas.intro")}</p>
      </div>

      <div
        className="idea-generator__categories"
        aria-label={t("ideas.categoriesLabel")}
      >
        <div className="idea-generator__category-track">
          {localizedCategories.map((item) => {
            const CategoryIcon = ideaCategoryIcons[item.value] || Sparkle;
            return (
              <button
                type="button"
                className={category === item.value ? "is-active" : ""}
                aria-pressed={category === item.value}
                onClick={() => chooseCategory(item.value)}
                key={item.value}
              >
                <CategoryIcon size={17} weight="bold" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`idea-stage idea-stage--${idea.tone}`}>
        <div className="idea-stage__number" aria-hidden="true">
          {String(ideaTurn + 1).padStart(2, "0")}
        </div>
        <div className="idea-stage__media">
          <img
            src={localizedCurrentPattern?.detail_image_urls?.[0]}
            alt=""
            key={localizedCurrentPattern?.id}
          />
          <div className="idea-stage__medium">
            <CurrentIcon size={26} weight="fill" />
            <span>{idea.code}</span>
            <strong>{idea.categoryLabel}</strong>
          </div>
        </div>

        <div
          className="idea-stage__content"
          key={`${idea.id}-${ideaTurn}-${localizedCurrentPattern?.id}`}
          aria-live="polite"
        >
          <div className="idea-line idea-line--look">
            <span>{t("ideas.look")}</span>
            <p>{idea.look}</p>
          </div>
          <div className="idea-line idea-line--use">
            <span>{t("ideas.use")}</span>
            <p>{idea.use}</p>
          </div>
          <div className="idea-line idea-line--make">
            <span>{t("ideas.make")}</span>
            <p>{idea.make}</p>
          </div>
          <div className="idea-line idea-line--ai">
            <span>{t("ideas.ai")}</span>
            <p>{idea.ai}</p>
          </div>
        </div>

        <div className="idea-stage__source">
          <img src={localizedCurrentPattern?.detail_image_urls?.[0]} alt="" />
          <div>
            <span>{t("ideas.current")}</span>
            <strong>
              {localizedCurrentPattern?.archive_number} ·{" "}
              {localizedCurrentPattern?.source_title || t("ideas.unnamed")}
            </strong>
            <small>{t("ideas.collector", { name: collectorName })}</small>
          </div>
          <button type="button" onClick={changePattern}>
            {t("ideas.change")}
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="idea-stage__action">
          <button type="button" onClick={nextIdea}>
            <MagicWand size={23} weight="fill" />
            <span>{t("ideas.again")}</span>
            <small>SPACE</small>
          </button>
          <div>
            <Sparkle size={16} weight="fill" />
            {t("ideas.reimagined")}
          </div>
        </div>
      </div>
    </section>
  );
}

function CreationVideo() {
  const { t } = useI18n();
  return (
    <section className="creation-video" aria-labelledby="creation-video-title">
      <div className="creation-video__copy">
        <div className="section-kicker section-kicker--light">
          FROM IDEA TO WORK
        </div>
        <h2 id="creation-video-title">{t("video.title")}</h2>
        <p>{t("video.intro")}</p>
        <div className="creation-video__credit">
          <span>{t("video.creditLabel")}</span>
          <p>
            {t("video.creditBefore")}{" "}
            <strong>{t("video.creditName")}</strong>
            {t("video.creditAfter")}
          </p>
        </div>
        <div className="creation-video__labels">
          <span>{t("video.example")}</span>
          <span>{t("video.reimagined")}</span>
          <span>{t("video.nonHistorical")}</span>
        </div>
      </div>
      <div className="creation-video__player">
        <video
          controls
          playsInline
          preload="metadata"
          poster="/assets/video/lanna-ai-creation-poster.webp"
        >
          <source
            src="/assets/video/lanna-ai-creation.mp4"
            type="video/mp4"
          />
          {t("video.unsupported")}
        </video>
        <div className="creation-video__playmark" aria-hidden="true">
          <Play size={26} weight="fill" />
        </div>
      </div>
    </section>
  );
}

function Footer({ onSignup }) {
  const { t } = useI18n();
  return (
    <footer className="site-footer">
      <div className="site-footer__art" aria-hidden="true">
        <img src="/assets/decor/lanna-history-ribbon.jpg" alt="" />
      </div>
      <div className="site-footer__content">
        <div>
          <div className="section-kicker section-kicker--light">
            JULY 26 · CMI STUDIO
          </div>
          <h2>{t("footer.title")}</h2>
          <p>{t("footer.intro")}</p>
        </div>
        <Button variant="accent" onClick={onSignup}>
          {t("signup.action")}
        </Button>
      </div>
      <div className="site-footer__bottom">
        <a className="brand-lockup brand-lockup--light" href="#top">
          <img src="/assets/brand/cmi-community.svg" alt="" />
          <span>CMI Community</span>
        </a>
        <span>{t("footer.credits")}</span>
        <span>{t("footer.location")}</span>
      </div>
    </footer>
  );
}

export function App() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [ideaPattern, setIdeaPattern] = useState(null);
  const [archiveRefreshKey, setArchiveRefreshKey] = useState(0);

  const handlePatternPublished = (pattern) => {
    setArchiveRefreshKey((current) => current + 1);
    setSelectedPattern(pattern);
  };

  const handleUseForIdea = (pattern) => {
    setIdeaPattern(pattern);
    setSelectedPattern(null);
    window.setTimeout(() => {
      document
        .getElementById("ideas")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  return (
    <>
      <Header onSignup={() => setSignupOpen(true)} />
      <main>
        <Hero onSignup={() => setSignupOpen(true)} />
        <WorksShowcase />
        <Manifesto />
        <Journey />
        <MuseumSection />
        <CollectionSection
          onPreview={setSelectedPattern}
          onPublished={handlePatternPublished}
          refreshKey={archiveRefreshKey}
        />
        <ArchiveSection
          refreshKey={archiveRefreshKey}
          onOpenPattern={setSelectedPattern}
        />
        <PossibilityGenerator preferredPattern={ideaPattern} />
        <CreationVideo />
      </main>
      <Footer onSignup={() => setSignupOpen(true)} />
      <SignupDialog open={signupOpen} onClose={() => setSignupOpen(false)} />
      <PatternDetailDialog
        pattern={selectedPattern}
        onClose={() => setSelectedPattern(null)}
        onUseForIdea={handleUseForIdea}
      />
    </>
  );
}
