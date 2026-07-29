import {
  activityWebsite,
  articleMeta,
  museums,
  sections,
  websiteRoles,
} from "./recap-content";
import "./recap.css";

function SectionHeading({ kicker, title }) {
  return (
    <header className="section-heading">
      <p className="kicker">{kicker}</p>
      <h2>{title}</h2>
    </header>
  );
}

function Paragraphs({ items }) {
  return (
    <div className="prose">
      {items.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export function RecapPage() {
  return (
    <article className="recap-page">
      <section className="hero" id="recap-top">
        <div className="hero-copy">
          <p className="hero-eyebrow">{articleMeta.eyebrow}</p>
          <h1>
            带着一枚纹样
            <span>重新认识我们生活的清迈</span>
          </h1>
          <p className="hero-subtitle">{articleMeta.subtitle}</p>
          <div className="hero-meta">
            <span>{articleMeta.date}</span>
            <span>{articleMeta.place}</span>
          </div>
        </div>
        <figure className="hero-image">
          <img
            src="/assets/recap/article/textile-pillars.jpg"
            alt="FAM Fahlanna Art Museum 展厅中的兰纳织物立柱"
          />
          <figcaption>
            FAM · KINGDOM OF TEXTILES
            <span>由 HEIC 原片转换并整理</span>
          </figcaption>
        </figure>
        <div className="hero-seal" aria-hidden="true">
          <span>兰纳</span>
          <small>LANNA</small>
        </div>
      </section>

      <section className="standfirst shell">
        <p>{articleMeta.standfirst}</p>
        <div className="fact-strip" aria-label="活动数据">
          <div>
            <strong>10+</strong>
            <span>位参与者</span>
          </div>
          <div>
            <strong>400+</strong>
            <span>张采集照片</span>
          </div>
          <div>
            <strong>90</strong>
            <span>分钟现场共创</span>
          </div>
          <div>
            <strong>06</strong>
            <span>个作品原型</span>
          </div>
        </div>
      </section>

      <section className="story-section shell" id="afternoon">
        <SectionHeading
          kicker={sections.opening.kicker}
          title={sections.opening.title}
        />
        <div className="story-grid">
          <Paragraphs items={sections.opening.paragraphs} />
          <figure className="editorial-figure landscape">
            <img
              src="/assets/recap/article/event-cover.jpg"
              alt="CMI Studio 半开放空间内，参与者围坐进行 AI 共创"
            />
            <figcaption>
              新接通的网络、搬来的旧家具，以及第一次被共同使用的新空间。
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-inner shell">
          <SectionHeading
            kicker={sections.shindo.kicker}
            title={sections.shindo.title}
          />
          <div className="feature-grid">
            <figure className="tall-image">
              <img
                src="/assets/recap/article/team-making.jpg"
                alt="年轻参与者围着电脑和手绘草图共同创作"
              />
              <figcaption>从细节出发，想法在讨论中慢慢显形。</figcaption>
            </figure>
            <div>
              <Paragraphs items={sections.shindo.paragraphs} />
              <blockquote>
                <span>“</span>
                {sections.shindo.quote}
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="pattern-section shell">
        <SectionHeading
          kicker={sections.whyPattern.kicker}
          title={sections.whyPattern.title}
        />
        <div className="pattern-layout">
          <Paragraphs items={sections.whyPattern.paragraphs} />
          <ol className="method-line" aria-label="纹样观察方法">
            {["看见", "记录", "核验", "提问", "再创作"].map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <figure className="pattern-banner">
          <img
            src="/assets/recap/article/procession-pattern.jpg"
            alt="FAM 展出的佛教礼敬行列图案 Mud Mee 织物"
          />
          <figcaption>
            纹样不是可以随意抽离的装饰。材料、工艺、用途与信仰，共同决定它如何出现。
          </figcaption>
        </figure>
      </section>

      <section className="museum-story">
        <div className="shell">
          <SectionHeading
            kicker={sections.museums.kicker}
            title={sections.museums.title}
          />
          <div className="museum-story-copy">
            <Paragraphs items={sections.museums.paragraphs} />
            <aside className="side-note">
              <span>FIELD NOTE</span>
              两座博物馆是本次活动的推荐参观地点，并非活动联合主办方。
            </aside>
          </div>
          <div className="museum-mosaic">
            <figure className="mosaic-main">
              <img
                src="/assets/recap/article/wooden-loom.jpg"
                alt="FAM 展厅中的传统木织机和正在织造的条纹织物"
              />
              <figcaption>工艺不是纹样背后的注脚，它就是纹样如何发生。</figcaption>
            </figure>
            <figure>
              <img
                src="/assets/recap/article/lanna-roof-pattern.jpg"
                alt="FAM 展厅中的兰纳红金建筑纹饰"
              />
            </figure>
            <figure className="mosaic-wide">
              <img
                src="/assets/recap/article/fam-red-gold-panorama.jpg"
                alt="FAM 博物馆内红金祭坛主题展陈空间"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="capture-section shell">
        <SectionHeading
          kicker={sections.capture.kicker}
          title={sections.capture.title}
        />
        <div className="capture-grid">
          <Paragraphs items={sections.capture.paragraphs} />
          <div className="capture-card">
            <p className="capture-card-title">一套更轻的采集顺序</p>
            <ol>
              <li>
                <span>01</span>
                <strong>DETAIL</strong>
                先拍多个纹样细节
              </li>
              <li>
                <span>02</span>
                <strong>OBJECT</strong>
                再拍完整载体
              </li>
              <li>
                <span>03</span>
                <strong>LABEL</strong>
                最后拍展签与来源
              </li>
            </ol>
            <p className="capture-card-foot">
              先让眼睛自由地看，理解与建档可以在离开展厅之后慢慢完成。
            </p>
          </div>
        </div>
      </section>

      <section className="website-section" id="website">
        <div className="website-thread" aria-hidden="true" />
        <div className="shell">
          <SectionHeading
            kicker={sections.website.kicker}
            title={sections.website.title}
          />
          <div className="website-intro">
            <Paragraphs items={sections.website.paragraphs} />
            <div className="website-roles">
              {websiteRoles.map((role) => (
                <article key={role.number}>
                  <span>{role.number}</span>
                  <h3>{role.label}</h3>
                  <p>{role.text}</p>
                </article>
              ))}
            </div>
          </div>
          <a
            className="browser-frame"
            href={activityWebsite}
            aria-label="打开清迈兰纳纹样活动网站"
          >
            <div className="browser-bar">
              <span />
              <span />
              <span />
              <p>lanna-museum-day-chiang-mai.vercel.app</p>
            </div>
            <img
              src="/assets/recap/article/activity-site.jpg"
              alt="清迈兰纳纹样活动网站首页"
            />
            <div className="browser-cta">
              <span>进入清迈兰纳纹样档案</span>
              <strong>OPEN THE WEBSITE ↗</strong>
            </div>
          </a>
          <div className="website-links">
            <a
              href={`${activityWebsite}#works`}
            >
              查看现场作品 <span>↗</span>
            </a>
            <a
              href={`${activityWebsite}#archive`}
            >
              浏览纹样档案 <span>↗</span>
            </a>
            <a
              href={`${activityWebsite}#museums`}
            >
              选择参观路线 <span>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="making-section shell">
        <SectionHeading
          kicker={sections.making.kicker}
          title={sections.making.title}
        />
        <div className="making-grid">
          <Paragraphs items={sections.making.paragraphs} />
          <div className="making-images">
            <figure>
              <img
                src="/assets/recap/article/participants.jpg"
                alt="参与者在玻璃窗前围桌交流"
              />
            </figure>
            <figure>
              <img
                src="/assets/recap/article/ai-making.jpg"
                alt="电脑中的 AI 创作界面与桌面手绘草图同框"
              />
              <figcaption>AI 生成界面、手绘草图与现场讨论同时发生。</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="organization-section">
        <div className="organization-grid shell">
          <div>
            <SectionHeading
              kicker={sections.organization.kicker}
              title={sections.organization.title}
            />
            <Paragraphs items={sections.organization.paragraphs} />
          </div>
          <figure>
            <img
              src="/assets/recap/article/remote-opening.jpg"
              alt="CMI Studio 的大屏幕上显示全国线上连线参与者"
            />
            <figcaption>
              线下的小桌子和远程的大屏幕，共同组成这次活动的现场。
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="studio-section shell">
        <div className="studio-copy">
          <SectionHeading
            kicker={sections.studio.kicker}
            title={sections.studio.title}
          />
          <Paragraphs items={sections.studio.paragraphs} />
        </div>
        <figure>
          <img
            src="/assets/recap/article/milan-cat.jpg"
            alt="白色小猫米兰坐在 CMI Studio 的绿植旁"
          />
          <figcaption>米兰在绿植旁边看着新空间慢慢被使用。</figcaption>
        </figure>
      </section>

      <section className="guide-section" id="museum-guide">
        <div className="shell">
          <header className="guide-heading">
            <p className="kicker">VISIT / MUSEUM ROUTES</p>
            <h2>如果你也想沿着这次活动的路线逛博物馆</h2>
            <p>
              两个入口，两种接近兰纳的方式。不要试图一次记住所有知识，先为自己选择一个观察问题。
            </p>
          </header>
          <div className="route-grid">
            {museums.map((museum) => (
              <article className="route-card" key={museum.route}>
                <figure>
                  <img src={museum.image} alt={museum.english} />
                  <span>{museum.route}</span>
                </figure>
                <div className="route-body">
                  <p className="route-english">{museum.english}</p>
                  <h3>{museum.chinese}</h3>
                  <div className="tag-list">
                    {museum.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <dl>
                    <div>
                      <dt>适合你，如果</dt>
                      <dd>{museum.suitable}</dd>
                    </div>
                    <div>
                      <dt>重点看</dt>
                      <dd>{museum.focus}</dd>
                    </div>
                    <div>
                      <dt>推荐逛法</dt>
                      <dd>{museum.method}</dd>
                    </div>
                  </dl>
                  <div className="route-info">
                    <p>{museum.hours}</p>
                    <p>{museum.address}</p>
                  </div>
                  <div className="route-links">
                    <a href={museum.website} target="_blank" rel="noreferrer">
                      官网 ↗
                    </a>
                    <a href={museum.map} target="_blank" rel="noreferrer">
                      地图 ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="guide-note">
            以上信息核验于 2026 年 7 月 29 日。开放时间、票价和临时展览可能调整，出发前请以馆方最新公告为准。两座博物馆是本次活动的推荐参观地点，并非活动联合主办方。
          </p>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-image" aria-hidden="true" />
        <div className="closing-copy">
          <SectionHeading
            kicker={sections.closing.kicker}
            title={sections.closing.title}
          />
          <Paragraphs items={sections.closing.paragraphs} />
          <a href={activityWebsite}>
            继续浏览兰纳纹样档案 <span>↗</span>
          </a>
        </div>
      </section>
    </article>
  );
}
