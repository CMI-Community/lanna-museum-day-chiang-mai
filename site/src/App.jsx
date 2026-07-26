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
import {
  archiveSamples,
  filterOptions,
  museums,
  participationSteps,
} from "./content";
import {
  createLocalPreviewPattern,
  fetchPublishedPatterns,
  formatPatternCapturedAt,
  isSupabaseConfigured,
  prepareImageFile,
  renderPatternCardPng,
  submitPattern,
} from "./lib/archive";
import { generateIdea, ideaCategories } from "./lib/ideas";

const toneColors = {
  purple: "#5c2683",
  orange: "#ec7623",
  green: "#4d9c54",
  cyan: "#1e9fbd",
  pink: "#e34f7d",
};

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
          aria-label="关闭"
          onClick={onClose}
        >
          <X size={22} weight="bold" />
        </button>
        {children}
      </section>
    </div>
  );
}

function Header({ onSignup }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["活动", "about"],
    ["日程", "journey"],
    ["博物馆", "museums"],
    ["采集", "collect"],
    ["纹样档案", "archive"],
    ["灵感", "ideas"],
  ];

  const navigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="CMI Community 首页">
        <img
          src="/assets/brand/cmi-community.svg"
          alt=""
          className="brand-lockup__mark"
        />
        <span>CMI Community</span>
      </a>

      <nav className="desktop-nav" aria-label="主要导航">
        {links.map(([label, id]) => (
          <button key={id} type="button" onClick={() => navigate(id)}>
            {label}
          </button>
        ))}
      </nav>

      <Button className="desktop-signup" onClick={onSignup}>
        报名入群
      </Button>

      <button
        type="button"
        className="icon-button mobile-menu-button"
        aria-label={menuOpen ? "关闭导航" : "打开导航"}
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
          <Button onClick={onSignup}>报名入群</Button>
        </div>
      ) : null}
    </header>
  );
}

function SignupDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} label="报名加入活动群">
      <div className="signup-dialog">
        <div className="section-kicker">REGISTER / 报名入群</div>
        <h2>扫码加入清迈场活动群</h2>
        <p>
          入群后获取 CMI Studio 详细位置、博物馆结伴信息、纹样采集口令与活动提醒。
        </p>
        <div className="signup-dialog__commitment">
          <CheckCircle size={22} weight="fill" />
          <div>
            <strong>加入前，请先确认</strong>
            <span>请确保自己有兴趣，且有时间来参加该活动。</span>
          </div>
        </div>
        <div className="signup-dialog__qr">
          <img
            src="/assets/registration/wechat-group-qr-20260730.jpg"
            alt="博物馆奇妙日·清迈 CMI·兰纳纹样微信群二维码，有效至 7 月 30 日"
            onError={(event) => {
              event.currentTarget.hidden = true;
              event.currentTarget
                .closest(".signup-dialog__qr")
                ?.classList.add("is-unavailable");
            }}
          />
          <div className="qr-fallback">
            <strong>群二维码更新中</strong>
            <span>请稍后刷新，或联系 CMI Community 获取最新二维码。</span>
          </div>
        </div>
        <div className="signup-dialog__notice">
          <Clock size={18} />
          当前二维码图片标注 7 月 30 日前有效；过期后将在此处直接更新。
        </div>
      </div>
    </Dialog>
  );
}

function Hero({ onSignup }) {
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
          <span>AI 切磋大会 第 26 期</span>
          <span>博物馆奇妙日 · 清迈场</span>
        </div>
        <h1>
          <span>共同探寻兰纳</span>
          <em>Lanna</em>
          <span>纹案的踪迹</span>
        </h1>
        <div className="hero__subtitle">
          <Sparkle size={23} weight="fill" />
          用 AI 创作
          <Sparkle size={17} weight="fill" />
        </div>

        <div className="hero__credits">
          <div className="initiator" aria-label="WaytoAGI 发起">
            <img
              src="/assets/brand/waytoagi-logo-transparent.svg"
              alt="WaytoAGI"
            />
            <span>发起</span>
          </div>
          <div className="hero__venue-credit">
            CMI Community 主办 清迈线下场
          </div>
        </div>

        <dl className="hero__facts">
          <div>
            <dt>
              <CalendarBlank size={19} />
              时间
            </dt>
            <dd>本周日 · 2026.07.26 · 12:30–17:30</dd>
          </div>
          <div>
            <dt>
              <MapPin size={19} />
              地点
            </dt>
            <dd>CMI Studio</dd>
          </div>
          <div>
            <dt>
              <Buildings size={19} />
              位置
            </dt>
            <dd>报名入群后获取详细信息</dd>
          </div>
        </dl>

        <div className="hero__actions">
          <Button
            onClick={onSignup}
            icon={<Sparkle size={21} weight="fill" />}
          >
            报名入群
          </Button>
          <Button
            variant="outline"
            className="hero__collect-button"
            onClick={scrollToCollect}
            icon={<Camera size={21} />}
          >
            开始采集纹样
          </Button>
        </div>
      </div>
      <button
        className="scroll-cue"
        type="button"
        onClick={() =>
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        了解这场活动
        <ArrowDown size={18} />
      </button>
    </section>
  );
}

function Manifesto() {
  return (
    <section id="about" className="manifesto">
      <img
        className="manifesto__ribbon"
        src="/assets/decor/lanna-history-ribbon.jpg"
        alt=""
        aria-hidden="true"
      />
      <div className="manifesto__content">
        <div className="section-kicker">ABOUT / 这是一场什么活动</div>
        <h2>
          这不是一场坐着听完的讲座。
          <br />
          它从一枚让你停下来的
          <strong>兰纳纹样</strong>开始。
        </h2>
        <p className="manifesto__intro">
          AI 切磋大会由 WaytoAGI 发起，清迈场由 CMI Community
          组织。活动前，你会走进两座博物馆中的一座，记录纹样的局部、完整文物与来源；7
          月 26 日，再把它带回 CMI Studio，与伙伴一起用 AI 创作。
        </p>
        <p className="manifesto__creative">
          <Sparkle size={24} weight="fill" />
          从观察出发，把真实的文化细节做成
          <span>网页、影像、智能体、游戏、3D 或亲子作品。</span>
        </p>
        <h3>最后留下的，不只是一个好看的图案。</h3>
        <p className="manifesto__outcome">
          你会带走一张有编号、有来源、可下载的纹样卡；完成一件可以展示、分享并继续完善的
          AI
          作品；也让这次发现进入一座持续生长的清迈兰纳纹样档案。
        </p>
        <div className="manifesto__credits">
          WaytoAGI 发起 · CMI Community 组织清迈场 · 现场 CMI Studio
        </div>
        <a className="manifesto__next" href="#journey">
          接下来，看看这条参与路径如何展开
          <ArrowDown size={18} />
        </a>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" className="journey section-shell">
      <div className="section-heading section-heading--split">
        <div>
          <div className="section-kicker">JOURNEY / 一次完整的参与路径</div>
          <h2>从报名，到作品上墙</h2>
        </div>
        <p>
          活动前先去看、去拍、去问；活动当天再把真实观察变成一件 AI
          作品。所有时间均为清迈时间 GMT+7。
        </p>
      </div>

      <ol className="fishbone">
        {participationSteps.map((step, index) => (
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
          <span>先选择你的博物馆</span>
          <ArrowDown size={19} />
        </a>
      </div>
    </section>
  );
}

function MuseumSection() {
  const [hoveredMuseum, setHoveredMuseum] = useState(null);

  return (
    <section id="museums" className="museum-section">
      <div className="museum-section__heading">
        <div className="section-kicker section-kicker--light">
          CHOOSE / 先选择你的博物馆
        </div>
        <h2>两个入口，两种观察兰纳的方式</h2>
        <p>滑动或悬停查看两座馆；出发前可打开官网与地图确认信息。</p>
      </div>

      <div
        className={`museum-stage ${
          hoveredMuseum ? `museum-stage--${hoveredMuseum}` : ""
        }`}
        onMouseLeave={() => setHoveredMuseum(null)}
      >
        {museums.map((museum) => (
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
                alt={`${museum.chineseName}馆内场景`}
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
                    <span>查看官网</span>
                  </a>
                  <a
                    className="button button--ghost-light"
                    href={museum.map}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MapPin size={18} />
                    <span>打开地图</span>
                  </a>
                </div>
                <small>图片来源：{museum.source}</small>
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
  return (
    <span className="field-label field-label--icon">
      <span>
        {icon}
        {children}
      </span>
      {optional ? <small>可选</small> : null}
    </span>
  );
}

function FilePicker({ label, helper, files, setFiles, minimum = 0, maximum = 6 }) {
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
          {minimum ? ` · 至少 ${minimum} 张` : ""}
        </small>
      </div>
      <p>{helper}</p>
      <div className="file-picker__actions">
        <Button
          variant="outline"
          onClick={() => uploadInputRef.current?.click()}
          icon={<UploadSimple size={20} />}
        >
          上传图片
        </Button>
        <Button
          variant="soft"
          onClick={() => captureInputRef.current?.click()}
          icon={<Camera size={20} />}
        >
          拍摄采集
        </Button>
      </div>
      <small className="file-picker__format">
        JPEG、PNG 或 WebP · 自动压缩后单张不超过 1.5MB
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
                aria-label={`移除 ${preview.file.name}`}
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

const wizardPages = [
  {
    id: "01",
    title: "选择来源",
    description:
      "先告诉我们这枚纹样来自哪里。即使不知道作品全名，也可以填写“待确认”后继续。",
    icon: <IdentificationCard size={24} weight="fill" />,
  },
  {
    id: "02+03",
    title: "采集图像",
    description:
      "先拍吸引你的局部，再退后一步保留完整载体。每一类图片都可以从相册上传或直接拍摄。",
    icon: <Camera size={24} weight="fill" />,
  },
  {
    id: "04",
    title: "观察与标注",
    description:
      "写下你真实看到的、已经确认的，以及仍想追问的。最后用标签帮助大家重新找到它。",
    icon: <NotePencil size={24} weight="fill" />,
  },
];

function CollectionForm({ open, onClose, onPreview, onPublished }) {
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
        message: "请至少添加 1 张纹样局部图和 1 张完整载体图。",
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
        message: "请至少添加 1 张纹样局部图和 1 张完整载体图。",
      });
      return;
    }
    if (!values.observation.trim()) {
      setStatus({ type: "error", message: "请写下你为什么注意到这枚纹样。" });
      return;
    }
    if (!values.accessCode.trim()) {
      setStatus({ type: "error", message: "请输入活动群中的采集口令。" });
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
      setStatus({ type: "loading", message: "正在压缩图片并安全上传…" });
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
        message: error.message || "提交失败，请保留页面并重试。",
      });
    }
  };

  const currentPage = wizardPages[page - 1];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      label="采集新纹样"
      size="collector"
    >
      <form className="collection-form" onSubmit={handleSubmit}>
        <header className="collector-wizard__header">
          <div>
            <div className="section-kicker">NEW PATTERN / 采集新纹样</div>
            <h2>把这次发现，做成一张有来源的纹样卡</h2>
          </div>
          {!isSupabaseConfigured ? (
            <div className="collector-wizard__mode">
              <Sparkle size={18} weight="fill" />
              本地预览
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
                    来源博物馆
                  </FieldLabel>
                  <div className="select-wrap">
                    <select name="museum" value={values.museum} onChange={update}>
                      <option value="lanna_folklife">兰纳民俗博物馆</option>
                      <option value="fam">FAM Fahlanna Art Museum</option>
                      <option value="other">其他清迈来源</option>
                    </select>
                    <CaretDown size={17} />
                  </div>
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<IdentificationCard size={18} weight="fill" />}
                    optional
                  >
                    采集者展示名
                  </FieldLabel>
                  <input
                    name="collectorName"
                    value={values.collectorName}
                    onChange={update}
                    placeholder="例如：小明 / 匿名"
                  />
                </label>
              </div>
              <div className="form-grid form-grid--2">
                <label className="field">
                  <FieldLabel icon={<ImageSquare size={18} weight="fill" />}>
                    作品或展品名称
                  </FieldLabel>
                  <input
                    name="sourceTitle"
                    value={values.sourceTitle}
                    onChange={update}
                    placeholder="如果不知道，可以写“待确认”"
                  />
                </label>
                <label className="field">
                  <FieldLabel icon={<MapPin size={18} weight="fill" />}>
                    展区或拍摄位置
                  </FieldLabel>
                  <input
                    name="sourceLocation"
                    value={values.sourceLocation}
                    onChange={update}
                    placeholder="例如：二层织物展区"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {page === 2 ? (
            <div className="wizard-page__content">
              <div className="form-grid form-grid--2 form-grid--files">
                <FilePicker
                  label="纹样局部图"
                  helper="靠近一处真正吸引你的细节，可添加多张。"
                  files={detailFiles}
                  setFiles={setDetailFiles}
                  minimum={1}
                  maximum={6}
                />
                <FilePicker
                  label="完整载体图"
                  helper="退后一步，拍下完整文物、艺术作品或场景。"
                  files={contextFiles}
                  setFiles={setContextFiles}
                  minimum={1}
                  maximum={6}
                />
              </div>
              <FilePicker
                label="展签或来源图"
                helper="如果现场有展签、展区名称或其他来源线索，也请留下。"
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
                    现场观察
                  </FieldLabel>
                  <textarea
                    name="observation"
                    value={values.observation}
                    onChange={update}
                    placeholder="你为什么停下来？它如何重复、延伸或连接？"
                    rows={5}
                    required
                  />
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<CheckCircle size={18} weight="fill" />}
                    optional
                  >
                    来源信息
                  </FieldLabel>
                  <textarea
                    name="verifiedInformation"
                    value={values.verifiedInformation}
                    onChange={update}
                    placeholder="只写展签或可靠资料中已经确认的内容"
                    rows={5}
                  />
                </label>
                <label className="field">
                  <FieldLabel
                    icon={<NotePencil size={18} weight="fill" />}
                    optional
                  >
                    仍待了解
                  </FieldLabel>
                  <textarea
                    name="openQuestion"
                    value={values.openQuestion}
                    onChange={update}
                    placeholder="你最想继续了解的问题是什么？"
                    rows={5}
                  />
                </label>
              </div>

              <div className="form-grid form-grid--4">
                {[
                  ["carrier", "载体", ["", "织物", "器物", "建筑", "雕塑", "壁画", "编织结构", "装置"]],
                  ["position", "位置", ["", "中心", "边缘", "底部", "表面", "身体", "入口"]],
                  ["structure", "结构", ["", "重复", "对称", "交织", "环绕", "放射", "延伸", "层叠"]],
                  ["material", "材料", ["", "织物", "木", "陶", "漆", "金属", "石材", "竹", "颜料"]],
                ].map(([name, label, options]) => (
                  <label className="field" key={name}>
                    <FieldLabel icon={<Sparkle size={16} weight="fill" />}>
                      {label}
                    </FieldLabel>
                    <div className="select-wrap">
                      <select name={name} value={values[name]} onChange={update}>
                        {options.map((option) => (
                          <option value={option} key={option || "empty"}>
                            {option || `选择${label}`}
                          </option>
                        ))}
                      </select>
                      <CaretDown size={17} />
                    </div>
                  </label>
                ))}
              </div>

              <label className="field access-code-field">
                <FieldLabel icon={<Ticket size={18} weight="fill" />}>
                  活动采集口令
                </FieldLabel>
                <input
                  name="accessCode"
                  type="password"
                  value={values.accessCode}
                  onChange={update}
                  placeholder="请输入活动群中的口令"
                  autoComplete="off"
                />
                <small>口令不区分大小写；正式提交由服务端验证。</small>
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
                上一步
              </Button>
            ) : (
              <span>共 3 页，已完成 {page - 1} 页</span>
            )}
          </div>
          {page < 3 ? (
            <Button onClick={goNext} icon={<ArrowRight size={19} />}>
              下一步
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
                ? "正在提交"
                : isSupabaseConfigured
                  ? "提交并生成编号卡"
                  : "生成本地预览卡"}
            </Button>
          )}
        </footer>
      </form>
    </Dialog>
  );
}

function CollectionSection({ onPreview, onPublished, refreshKey }) {
  const [collectorOpen, setCollectorOpen] = useState(false);
  const [recentPatterns, setRecentPatterns] = useState(
    isSupabaseConfigured ? [] : archiveSamples.slice(0, 6),
  );
  const [recentCount, setRecentCount] = useState(
    isSupabaseConfigured ? 0 : archiveSamples.length,
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
          <div className="section-kicker">COLLECT / 收集兰纳纹样</div>
          <h2>现在，收集一枚属于你的兰纳纹样</h2>
        </div>
        <p>
          看到让你停下来的细节，就把局部、完整作品与来源一起留下。点击入口后，用三步完成采集并生成一张可下载的编号卡。
        </p>
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
            <h3>从一处细节出发，保留它完整的来处。</h3>
            <span>三步采集 · 自动编号 · 生成下载卡片</span>
          </div>
          <Button
            variant="accent"
            onClick={() => setCollectorOpen(true)}
            icon={<Sparkle size={20} weight="fill" />}
          >
            采集新纹样
          </Button>
        </article>

        <div className="collection-recent">
          <header>
            <div>
              <span>RECENTLY COLLECTED</span>
              <h3>已经收集进来的纹样</h3>
            </div>
            <a href="#archive">
              查看全部 {recentCount} 枚
              <ArrowDown size={17} />
            </a>
          </header>
          {recentPatterns.length ? (
            <div className="collection-recent__grid">
              {recentPatterns.map((pattern) => (
                <button
                  type="button"
                  key={pattern.id}
                  onClick={() => onPreview(pattern)}
                  aria-label={`查看 ${pattern.archive_number} ${pattern.source_title}`}
                >
                  <img src={pattern.detail_image_urls[0]} alt="" />
                  <span>{pattern.archive_number}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="collection-recent__empty">
              <Images size={30} />
              <p>档案正在等待第一枚真实纹样。</p>
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
  const tags = [
    ...(pattern.carrier_tags || []),
    ...(pattern.structure_tags || []),
    ...(pattern.material_tags || []),
  ].slice(0, 5);
  const collectorName = pattern.collector_name?.trim() || "匿名采集者";
  const capturedAt = formatPatternCapturedAt(pattern, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

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
              : "兰纳民俗博物馆")}
        </div>
        <div className="pattern-card-export__collector">
          <span>采集者 / COLLECTED BY</span>
          <strong>{collectorName}</strong>
          {capturedAt ? (
            <span className="pattern-card-export__captured-at">
              采集于 {capturedAt}
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
        <span>现场观察 · 来源信息 · 仍待了解 · 创意再表达</span>
        <span>WaytoAGI 发起 · CMI Community 清迈场</span>
      </footer>
    </article>
  );
}

function PatternDetailDialog({ pattern, onClose, onUseForIdea }) {
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
      const blob = await renderPatternCardPng(pattern);
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
      setDownloadError(error.message || "生成失败，请保留此窗口后重试");
      setDownloadStatus("error");
    }
  };

  return (
    <Dialog
      open={Boolean(pattern)}
      onClose={onClose}
      label={`${pattern.archive_number} 纹样详情`}
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
              ? "正在生成"
              : downloadStatus === "success"
                ? "已下载，再下一张"
                : "下载纹样卡"}
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
            <span>采集者</span>
            <strong>
              {pattern.collector_name?.trim() || "匿名采集者"}
            </strong>
          </p>
          <p className="pattern-detail__source">
            <MapPin size={17} />
            {pattern.source_location || "来源位置待补充"}
          </p>
          {formatPatternCapturedAt(pattern) ? (
            <p className="pattern-detail__source">
              <CalendarBlank size={17} />
              实际采集时间 {formatPatternCapturedAt(pattern)}
            </p>
          ) : null}
          {pattern.preview ? (
            <div className="preview-label">预览样本，不作为历史资料引用</div>
          ) : null}
          <Button
            className="pattern-detail__idea-button"
            variant="outline"
            icon={<MagicWand size={20} />}
            onClick={() => onUseForIdea(pattern)}
          >
            拿它生成 IDEA
          </Button>
          <dl className="pattern-detail__notes">
            <div>
              <dt>现场观察</dt>
              <dd>{pattern.observation || "未填写"}</dd>
            </div>
            <div>
              <dt>来源信息</dt>
              <dd>{pattern.verified_information || "待补充"}</dd>
            </div>
            <div>
              <dt>仍待了解</dt>
              <dd>{pattern.open_question || "暂未填写"}</dd>
            </div>
          </dl>
          <div className="pattern-detail__gallery">
            {allImages.map((url, index) => (
              <button
                type="button"
                className="pattern-detail__thumb"
                key={`${url}-${index}`}
                aria-label={`放大查看 ${pattern.archive_number} 采集图片 ${index + 1}`}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={url}
                  alt={`${pattern.archive_number} 采集图片 ${index + 1}`}
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
          aria-label={`${pattern.archive_number} 图片预览`}
          onMouseDown={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="image-lightbox__close"
            aria-label="关闭图片预览"
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
                aria-label="查看上一张图片"
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
              alt={`${pattern.archive_number} 放大图片 ${lightboxIndex + 1}`}
            />
            {allImages.length > 1 ? (
              <button
                type="button"
                className="image-lightbox__nav image-lightbox__nav--next"
                aria-label="查看下一张图片"
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
      setError("档案暂时没有加载出来，请重试。");
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

  return (
    <section id="archive" className="archive-section">
      <div className="section-shell">
        <div className="section-heading section-heading--split">
          <div>
            <div className="section-kicker">ARCHIVE / 大家的纹样</div>
            <h2>一座持续生长的兰纳纹样档案</h2>
          </div>
          <p>
            从最新发现开始浏览。点击任何方格，打开它与完整文物、来源和采集问题之间的关系。
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="archive-preview-notice">
            当前展示 {archiveSamples.length} 份体验预览素材；连接 Supabase
            后，这里会自动切换为参与者的真实公开采集。
          </div>
        ) : null}

        <div className="archive-toolbar">
          <div className="archive-toolbar__filters">
            {Object.entries(filterOptions).map(([name, options]) => (
              <label key={name}>
                <span className="sr-only">
                  {name === "museum"
                    ? "博物馆"
                    : name === "carrier"
                      ? "载体"
                      : "结构"}
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
          <span>{filteredPatterns.length} 枚纹样</span>
        </div>

        {loading ? (
          <div className="archive-state">
            <span className="spinner spinner--purple" />
            正在整理档案…
          </div>
        ) : error ? (
          <div className="archive-state">
            <p>{error}</p>
            <Button variant="outline" onClick={loadPatterns}>
              重新加载
            </Button>
          </div>
        ) : filteredPatterns.length ? (
          <div className="archive-grid">
            {filteredPatterns.map((pattern) => (
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
                  采集者 · {pattern.collector_name?.trim() || "匿名采集者"}
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
                    )}
                  </small>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="archive-state archive-state--empty">
            <Images size={34} />
            <h3>还没有符合条件的纹样</h3>
            <p>换一个筛选条件，或者成为第一个提交的人。</p>
            <a className="button button--primary" href="#collect">
              <span>开始采集</span>
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
  const fallbackPatterns = archiveSamples.slice(0, 18);
  const [patterns, setPatterns] = useState(fallbackPatterns);
  const [currentPattern, setCurrentPattern] = useState(
    preferredPattern || fallbackPatterns[0],
  );
  const [category, setCategory] = useState("any");
  const [idea, setIdea] = useState(() =>
    generateIdea(preferredPattern || fallbackPatterns[0]),
  );
  const [ideaTurn, setIdeaTurn] = useState(0);
  const generatorRef = useRef(null);

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
      generateIdea(preferredPattern, category, current?.id),
    );
    setIdeaTurn((turn) => turn + 1);
  }, [preferredPattern]);

  const nextIdea = () => {
    setIdea((current) =>
      generateIdea(currentPattern, category, current?.id),
    );
    setIdeaTurn((turn) => turn + 1);
  };

  const chooseCategory = (nextCategory) => {
    setCategory(nextCategory);
    setIdea((current) =>
      generateIdea(currentPattern, nextCategory, current?.id),
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
    setIdea((current) => generateIdea(nextPattern, category, current?.id));
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
    currentPattern?.collector_name?.trim() || "匿名采集者";

  return (
    <section
      id="ideas"
      className="idea-generator"
      ref={generatorRef}
      aria-labelledby="idea-generator-title"
    >
      <div className="idea-generator__header section-shell">
        <div>
          <div className="section-kicker">IDEA LAB / AI 可能性生成器</div>
          <h2 id="idea-generator-title">这枚纹样，还能变成什么？</h2>
        </div>
        <p>
          不用先想完整。选一种媒介，或者把选择交给偶然，再生成一个可以开始动手的方向。
        </p>
      </div>

      <div className="idea-generator__categories" aria-label="选择 IDEA 类型">
        <div className="idea-generator__category-track">
          {ideaCategories.map((item) => {
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
            src={currentPattern?.detail_image_urls?.[0]}
            alt=""
            key={currentPattern?.id}
          />
          <div className="idea-stage__medium">
            <CurrentIcon size={26} weight="fill" />
            <span>{idea.code}</span>
            <strong>{idea.categoryLabel}</strong>
          </div>
        </div>

        <div
          className="idea-stage__content"
          key={`${idea.id}-${ideaTurn}-${currentPattern?.id}`}
          aria-live="polite"
        >
          <div className="idea-line idea-line--look">
            <span>LOOK / 从这个角度</span>
            <p>{idea.look}</p>
          </div>
          <div className="idea-line idea-line--use">
            <span>USE / 使用这些素材</span>
            <p>{idea.use}</p>
          </div>
          <div className="idea-line idea-line--make">
            <span>MAKE / 做一件这样的事</span>
            <p>{idea.make}</p>
          </div>
          <div className="idea-line idea-line--ai">
            <span>AI CAN HELP / AI 的价值</span>
            <p>{idea.ai}</p>
          </div>
        </div>

        <div className="idea-stage__source">
          <img src={currentPattern?.detail_image_urls?.[0]} alt="" />
          <div>
            <span>CURRENT PATTERN / 当前纹样</span>
            <strong>
              {currentPattern?.archive_number} ·{" "}
              {currentPattern?.source_title || "未命名纹样"}
            </strong>
            <small>采集者 · {collectorName}</small>
          </div>
          <button type="button" onClick={changePattern}>
            换一枚纹样
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="idea-stage__action">
          <button type="button" onClick={nextIdea}>
            <MagicWand size={23} weight="fill" />
            <span>再来一个 IDEA</span>
            <small>SPACE</small>
          </button>
          <div>
            <Sparkle size={16} weight="fill" />
            REIMAGINED / 创意再表达
          </div>
        </div>
      </div>
    </section>
  );
}

function CreationVideo() {
  return (
    <section className="creation-video" aria-labelledby="creation-video-title">
      <div className="creation-video__copy">
        <div className="section-kicker section-kicker--light">
          FROM IDEA TO WORK
        </div>
        <h2 id="creation-video-title">一条已经发生的可能性</h2>
        <p>从一个文化线索出发，AI 可以帮助我们把想法变成影像。</p>
        <div className="creation-video__credit">
          <span>作品署名</span>
          <p>
            该作品由 <strong>AIGC 创作者「锐童学」学员</strong>倾力创作。
          </p>
        </div>
        <div className="creation-video__labels">
          <span>AI 创作示例</span>
          <span>创意再表达</span>
          <span>非历史影像</span>
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
          你的浏览器暂不支持视频播放。
        </video>
        <div className="creation-video__playmark" aria-hidden="true">
          <Play size={26} weight="fill" />
        </div>
      </div>
    </section>
  );
}

function Footer({ onSignup }) {
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
          <h2>带一枚让你停下来的纹样，来现场一起做出来。</h2>
          <p>用 AI 创作，共同探寻兰纳 Lanna 纹案的踪迹。</p>
        </div>
        <Button variant="accent" onClick={onSignup}>
          报名入群
        </Button>
      </div>
      <div className="site-footer__bottom">
        <a className="brand-lockup brand-lockup--light" href="#top">
          <img src="/assets/brand/cmi-community.svg" alt="" />
          <span>CMI Community</span>
        </a>
        <span>WaytoAGI 发起 · CMI Community 组织清迈场</span>
        <span>活动地点：CMI Studio · 详细位置入群获取</span>
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
