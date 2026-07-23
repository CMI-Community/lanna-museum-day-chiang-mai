import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Buildings,
  CalendarBlank,
  Camera,
  CaretDown,
  Check,
  CheckCircle,
  Clock,
  DownloadSimple,
  Images,
  List,
  MapPin,
  Sparkle,
  SquaresFour,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import {
  archiveSamples,
  collectionSteps,
  filterOptions,
  museums,
  participationSteps,
} from "./content";
import {
  createLocalPreviewPattern,
  fetchPublishedPatterns,
  isSupabaseConfigured,
  prepareImageFile,
  submitPattern,
} from "./lib/archive";

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

function Dialog({ open, onClose, label, children, size = "regular" }) {
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
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

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
          <span>探寻兰纳</span>
          <em>Lanna</em>
          <span>纹案的踪迹</span>
        </h1>
        <div className="hero__subtitle">
          <Sparkle size={23} weight="fill" />
          用 AI 创作
          <Sparkle size={17} weight="fill" />
        </div>

        <div className="hero__credits">
          <div className="initiator">
            <img src="/assets/brand/waytoagi-logo.svg" alt="WaytoAGI" />
            <strong>WaytoAGI</strong>
            <span>发起</span>
          </div>
          <div>清迈场由 CMI Community 组织</div>
        </div>

        <dl className="hero__facts">
          <div>
            <dt>
              <CalendarBlank size={19} />
              时间
            </dt>
            <dd>2026.07.26 · 12:30–17:30</dd>
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
        src="/assets/decor/lanna-history-ribbon.png"
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

function MuseumSection({ selectedMuseum, onSelect }) {
  const [hoveredMuseum, setHoveredMuseum] = useState(null);
  const activeMuseum = hoveredMuseum || selectedMuseum;

  return (
    <section id="museums" className="museum-section">
      <div className="museum-section__heading">
        <div className="section-kicker section-kicker--light">
          CHOOSE / 先选择你的博物馆
        </div>
        <h2>两个入口，两种观察兰纳的方式</h2>
        <p>滑动、悬停或点击一座馆，先做出你的参观选择。</p>
      </div>

      <div
        className={`museum-stage ${
          activeMuseum ? `museum-stage--${activeMuseum}` : ""
        }`}
        onMouseLeave={() => setHoveredMuseum(null)}
      >
        {museums.map((museum) => {
          const isSelected = selectedMuseum === museum.id;
          return (
            <article
              key={museum.id}
              className={`museum-card museum-card--${museum.id} ${
                isSelected ? "is-selected" : ""
              }`}
              tabIndex={0}
              onMouseEnter={() => setHoveredMuseum(museum.id)}
              onFocus={() => setHoveredMuseum(museum.id)}
            >
              <img
                src={museum.image}
                alt={`${museum.chineseName}馆内场景`}
                className="museum-card__image"
              />
              <div className="museum-card__wash" />
              <div className="museum-card__index">{museum.index}</div>
              {isSelected ? (
                <div className="museum-card__selected">
                  <CheckCircle size={18} weight="fill" />
                  已选择
                </div>
              ) : null}
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
                  <Button
                    variant={isSelected ? "selected" : "light"}
                    onClick={() => onSelect(museum.id)}
                    icon={isSelected ? <Check size={18} /> : null}
                  >
                    {isSelected ? "已选择此馆" : "选择此馆"}
                  </Button>
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
          );
        })}
        <span className="museum-stage__or">或</span>
      </div>

      <div className="museum-mobile-indicator" aria-hidden="true">
        <span className={selectedMuseum === "lanna_folklife" ? "is-active" : ""}>
          1
        </span>
        <i />
        <span className={selectedMuseum === "fam" ? "is-active" : ""}>2</span>
      </div>
    </section>
  );
}

function FilePicker({ label, helper, files, setFiles, minimum = 0, maximum = 6 }) {
  const inputRef = useRef(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews],
  );

  const addFiles = (incoming) => {
    const next = [...files, ...Array.from(incoming)].slice(0, maximum);
    setFiles(next);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="file-picker">
      <div className="field-label">
        <span>{label}</span>
        <small>
          {files.length}/{maximum}
          {minimum ? ` · 至少 ${minimum} 张` : ""}
        </small>
      </div>
      <button
        type="button"
        className="file-dropzone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
      >
        <UploadSimple size={26} />
        <span>{helper}</span>
        <small>JPEG、PNG 或 WebP · 自动压缩后单张不超过 1.5MB</small>
      </button>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        capture="environment"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {previews.length ? (
        <div className="file-previews">
          {previews.map((preview, index) => (
            <div className="file-preview" key={`${preview.file.name}-${index}`}>
              <img src={preview.url} alt="" />
              <button
                type="button"
                aria-label={`移除 ${preview.file.name}`}
                onClick={() => removeFile(index)}
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

function CollectionForm({ selectedMuseum, onPreview, onPublished }) {
  const [detailFiles, setDetailFiles] = useState([]);
  const [contextFiles, setContextFiles] = useState([]);
  const [labelFiles, setLabelFiles] = useState([]);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [values, setValues] = useState({
    museum: selectedMuseum || "lanna_folklife",
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
    if (selectedMuseum) {
      setValues((current) => ({ ...current, museum: selectedMuseum }));
    }
  }, [selectedMuseum]);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!detailFiles.length || !contextFiles.length) {
      setStatus({
        type: "error",
        message: "请至少上传 1 张纹样局部图和 1 张完整载体图。",
      });
      return;
    }

    if (!values.observation.trim()) {
      setStatus({ type: "error", message: "请写下你为什么注意到这枚纹样。" });
      return;
    }

    if (isSupabaseConfigured && !values.accessCode.trim()) {
      setStatus({ type: "error", message: "请输入活动群中的采集口令。" });
      return;
    }

    if (!isSupabaseConfigured) {
      const preview = createLocalPreviewPattern(
        values,
        detailFiles,
        contextFiles,
      );
      setStatus({
        type: "preview",
        message: "已生成本地预览卡；它不会进入公开档案。",
      });
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
          museum: values.museum,
          sourceTitle: values.sourceTitle,
          sourceLocation: values.sourceLocation,
          observation: values.observation,
          verifiedInformation: values.verifiedInformation,
          openQuestion: values.openQuestion,
          carrierTags: values.carrier ? [values.carrier] : [],
          positionTags: values.position ? [values.position] : [],
          structureTags: values.structure ? [values.structure] : [],
          materialTags: values.material ? [values.material] : [],
          collectorName: values.collectorName,
          accessCode: values.accessCode,
        }),
      );
      preparedDetails.forEach((file) => payload.append("detailImages", file));
      preparedContexts.forEach((file) => payload.append("contextImages", file));
      preparedLabels.forEach((file) => payload.append("labelImages", file));

      const result = await submitPattern(payload);
      setStatus({
        type: "success",
        message: `${result.archive_number} 已进入公开档案。`,
      });
      onPublished(result);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "提交失败，请保留页面并重试。",
      });
    }
  };

  return (
    <form className="collection-form" onSubmit={handleSubmit}>
      {!isSupabaseConfigured ? (
        <div className="service-banner">
          <Sparkle size={20} weight="fill" />
          <div>
            <strong>当前为本地预览模式</strong>
            <span>
              可以完成上传和生成卡片体验，但内容不会公开；连接 Supabase
              后会自动切换为正式提交。
            </span>
          </div>
        </div>
      ) : null}

      <div className="form-grid form-grid--2">
        <label className="field">
          <span className="field-label">来源博物馆</span>
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
          <span className="field-label">采集者展示名（可选）</span>
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
          <span className="field-label">作品或展品名称</span>
          <input
            name="sourceTitle"
            value={values.sourceTitle}
            onChange={update}
            placeholder="如果不知道，可以写“待确认”"
          />
        </label>
        <label className="field">
          <span className="field-label">展区或拍摄位置</span>
          <input
            name="sourceLocation"
            value={values.sourceLocation}
            onChange={update}
            placeholder="例如：二层织物展区"
          />
        </label>
      </div>

      <div className="form-grid form-grid--2 form-grid--files">
        <FilePicker
          label="纹样局部图"
          helper="上传多个纹样细节"
          files={detailFiles}
          setFiles={setDetailFiles}
          minimum={1}
          maximum={6}
        />
        <FilePicker
          label="完整载体图"
          helper="上传完整文物、艺术作品或场景"
          files={contextFiles}
          setFiles={setContextFiles}
          minimum={1}
          maximum={6}
        />
      </div>

      <FilePicker
        label="展签或来源图（可选）"
        helper="上传展签、展区名称或其他来源线索"
        files={labelFiles}
        setFiles={setLabelFiles}
        maximum={3}
      />

      <div className="form-grid form-grid--3">
        <label className="field">
          <span className="field-label">现场观察</span>
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
          <span className="field-label">来源信息</span>
          <textarea
            name="verifiedInformation"
            value={values.verifiedInformation}
            onChange={update}
            placeholder="只写展签或可靠资料中已经确认的内容"
            rows={5}
          />
        </label>
        <label className="field">
          <span className="field-label">仍待了解</span>
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
            <span className="field-label">{label}</span>
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

      <div className="form-submit-row">
        <label className="field access-code-field">
          <span className="field-label">活动采集口令</span>
          <input
            name="accessCode"
            type="password"
            value={values.accessCode}
            onChange={update}
            placeholder={
              isSupabaseConfigured ? "从活动群中获取" : "连接正式服务后启用"
            }
            disabled={!isSupabaseConfigured}
          />
        </label>
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
      </div>

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
    </form>
  );
}

function CollectionSection({ selectedMuseum, onPreview, onPublished }) {
  return (
    <section id="collect" className="collection-section section-shell">
      <div className="section-heading section-heading--split">
        <div>
          <div className="section-kicker">COLLECT / 如何采集一枚纹样</div>
          <h2>先看完整作品，再靠近一处细节</h2>
        </div>
        <p>
          纹样不是脱离来源的装饰素材。请同时保留局部、完整载体和来源，让之后的
          AI 创作仍然能回到真实文化语境。
        </p>
      </div>

      <ol className="collection-steps">
        {collectionSteps.map((step, index) => (
          <li key={step.id}>
            <span>{step.id}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {index < collectionSteps.length - 1 ? (
              <ArrowRight size={22} className="collection-steps__arrow" />
            ) : null}
          </li>
        ))}
      </ol>

      <CollectionForm
        selectedMuseum={selectedMuseum}
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

function PatternDetailDialog({ pattern, onClose }) {
  const cardRef = useRef(null);
  const [downloadStatus, setDownloadStatus] = useState("idle");

  useEffect(() => {
    setDownloadStatus("idle");
  }, [pattern?.id]);

  if (!pattern) {
    return null;
  }

  const downloadCard = async () => {
    try {
      setDownloadStatus("loading");
      await document.fonts.ready;
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#fbf8f1",
      });
      const anchor = document.createElement("a");
      const safeNumber = pattern.archive_number.replace(/[^a-zA-Z0-9-]/g, "-");
      anchor.download = `${safeNumber}-lanna-pattern-card.png`;
      anchor.href = dataUrl;
      anchor.click();
      setDownloadStatus("success");
    } catch {
      setDownloadStatus("error");
    }
  };

  const allImages = [
    ...(pattern.detail_image_urls || []),
    ...(pattern.context_image_urls || []),
    ...(pattern.label_image_urls || []),
  ];

  return (
    <Dialog
      open={Boolean(pattern)}
      onClose={onClose}
      label={`${pattern.archive_number} 纹样详情`}
      size="wide"
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
            <p className="download-error">生成失败，请保留此窗口后重试。</p>
          ) : null}
        </div>
        <div className="pattern-detail__info">
          <div className="section-kicker">ARCHIVE DETAIL</div>
          <h2>{pattern.archive_number}</h2>
          <h3>{pattern.source_title}</h3>
          <p className="pattern-detail__source">
            <MapPin size={17} />
            {pattern.source_location || "来源位置待补充"}
          </p>
          {pattern.preview ? (
            <div className="preview-label">预览样本，不作为历史资料引用</div>
          ) : null}
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
              <img
                key={`${url}-${index}`}
                src={url}
                alt={`${pattern.archive_number} 采集图片 ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
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
            当前展示 8 份体验预览素材；连接 Supabase
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
                <span className="archive-tile__hover">
                  <strong>{pattern.source_title}</strong>
                  <small>
                    {new Intl.DateTimeFormat("zh-CN", {
                      month: "2-digit",
                      day: "2-digit",
                    }).format(new Date(pattern.created_at))}
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
          <p>用 AI 创作，探寻兰纳 Lanna 纹案的踪迹。</p>
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
  const [selectedMuseum, setSelectedMuseum] = useState("lanna_folklife");
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [archiveRefreshKey, setArchiveRefreshKey] = useState(0);

  const handlePatternPublished = (pattern) => {
    setArchiveRefreshKey((current) => current + 1);
    setSelectedPattern(pattern);
  };

  return (
    <>
      <Header onSignup={() => setSignupOpen(true)} />
      <main>
        <Hero onSignup={() => setSignupOpen(true)} />
        <Manifesto />
        <Journey />
        <MuseumSection
          selectedMuseum={selectedMuseum}
          onSelect={setSelectedMuseum}
        />
        <CollectionSection
          selectedMuseum={selectedMuseum}
          onPreview={setSelectedPattern}
          onPublished={handlePatternPublished}
        />
        <ArchiveSection
          refreshKey={archiveRefreshKey}
          onOpenPattern={setSelectedPattern}
        />
      </main>
      <Footer onSignup={() => setSignupOpen(true)} />
      <SignupDialog open={signupOpen} onClose={() => setSignupOpen(false)} />
      <PatternDetailDialog
        pattern={selectedPattern}
        onClose={() => setSelectedPattern(null)}
      />
    </>
  );
}
