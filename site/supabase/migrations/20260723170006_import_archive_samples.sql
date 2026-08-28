insert into public.pattern_submissions (
  archive_number, museum, source_title, source_location, observation,
  verified_information, open_question, carrier_tags, position_tags,
  structure_tags, material_tags, detail_image_urls, context_image_urls,
  label_image_urls, collector_name, status, created_at, published_at
)
values
  ('CMI-LN-0044', 'lanna_folklife', '金漆卷草神兽 · 预览样本', '漆器与佛教艺术展区', '藤蔓绕过神兽轮廓后继续生长，让局部图案像一条没有断点的叙事线。', '此图片为网站体验预览素材；正式档案将以现场来源记录为准。', '卷草与神兽在同一画面中的位置是否有固定规则？', array['器物', '漆绘']::text[], '{}'::text[], array['环绕', '延伸']::text[], array['漆', '金']::text[], array['/assets/patterns/gold-lacquer-panel.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T20:44:00+07:00'::timestamptz, '2026-07-23T20:44:00+07:00'::timestamptz),
  ('CMI-LN-0043', 'fam', '镜像莲瓣光环 · 预览样本', '当代视觉展区', '莲瓣从中心向外放射，镜像表面把观者和展厅也叠进了纹样。', '此图片为网站体验预览素材。', '反光材料改变了传统莲纹的观看方式吗？', array['装置', '当代艺术']::text[], '{}'::text[], array['对称', '放射']::text[], array['金属', '颜料']::text[], array['/assets/patterns/purple-mirror.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T20:11:00+07:00'::timestamptz, '2026-07-23T20:11:00+07:00'::timestamptz),
  ('CMI-LN-0042', 'lanna_folklife', '竹编六角星孔 · 预览样本', '生活器物与编织展区', '竹篾彼此压住时留下六角星状空隙，结构和装饰在这里是同一件事。', '此图片为网站体验预览素材。', '不同尺寸的空隙是否对应不同器物用途？', array['编织结构', '器物']::text[], '{}'::text[], array['交织', '重复']::text[], array['竹']::text[], array['/assets/patterns/bamboo-weave.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T19:46:00+07:00'::timestamptz, '2026-07-23T19:46:00+07:00'::timestamptz),
  ('CMI-LN-0041', 'fam', '朱红织带金点 · 预览样本', '服饰与织物展区', '高饱和朱红建立连续节奏，金色只在菱形节点上短暂闪现。', '此图片为网站体验预览素材。', '金线的位置是否会随着服饰部位改变？', array['织物', '服饰']::text[], '{}'::text[], array['重复', '延伸']::text[], array['织物', '金线']::text[], array['/assets/patterns/red-gold-textile.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T19:20:00+07:00'::timestamptz, '2026-07-23T19:20:00+07:00'::timestamptz),
  ('CMI-LN-0040', 'lanna_folklife', '靛蓝阶梯菱纹 · 预览样本', '兰纳织物展区', '每个菱形由更小的阶梯边缘构成，远看整齐，靠近后能看见手工差异。', '此图片为网站体验预览素材。', '阶梯边缘来自织机结构还是图案设计？', array['织物']::text[], '{}'::text[], array['重复', '层叠']::text[], array['织物']::text[], array['/assets/patterns/indigo-woven-diamonds.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T18:58:00+07:00'::timestamptz, '2026-07-23T18:58:00+07:00'::timestamptz),
  ('CMI-LN-0039', 'fam', '青瓷水波莲线 · 预览样本', '当代兰纳器物展区', '浅刻线随着器面弧度时隐时现，必须移动视线才能看完整个莲纹。', '此图片为网站体验预览素材。', '光线是否是这类浅刻纹样的一部分？', array['器物']::text[], '{}'::text[], array['环绕', '重复']::text[], array['陶', '釉']::text[], array['/assets/patterns/celadon-lotus.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T18:31:00+07:00'::timestamptz, '2026-07-23T18:31:00+07:00'::timestamptz),
  ('CMI-LN-0038', 'lanna_folklife', '壁画花边行列 · 预览样本', '壁画与生活场景展区', '人物叙事被一条连续花边框住，边饰像是画面中的时间刻度。', '此图片为网站体验预览素材。', '边饰的重复次数是否跟故事段落有关？', array['壁画']::text[], '{}'::text[], array['重复', '延伸']::text[], array['颜料', '灰泥']::text[], array['/assets/patterns/terracotta-mural.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T18:02:00+07:00'::timestamptz, '2026-07-23T18:02:00+07:00'::timestamptz),
  ('CMI-LN-0037', 'lanna_folklife', '柚木双层火焰纹 · 预览样本', '木雕与建筑构件展区', '内外两层尖瓣朝同一方向上扬，让静止的木雕显得正在生长。', '此图片为网站体验预览素材。', '火焰纹的方向会不会提示构件原本的安装位置？', array['建筑', '雕塑']::text[], '{}'::text[], array['层叠', '放射']::text[], array['木']::text[], array['/assets/patterns/carved-teak.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T17:36:00+07:00'::timestamptz, '2026-07-23T17:36:00+07:00'::timestamptz),
  ('CMI-LN-0036', 'fam', '紫金花心矩阵 · 预览样本', '数字与影像展区', '传统花心被拆成等距单元，重复之后产生像素化的当代节奏。', '此图片为网站体验预览素材。', '单元被数字化以后，哪些比例必须保留才能被认出？', array['装置', '当代艺术']::text[], '{}'::text[], array['重复', '对称']::text[], array['金属', '颜料']::text[], array['/assets/patterns/purple-mirror.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T17:04:00+07:00'::timestamptz, '2026-07-23T17:04:00+07:00'::timestamptz),
  ('CMI-LN-0035', 'lanna_folklife', '黑漆金叶回旋 · 预览样本', '漆器与装饰艺术展区', '叶片沿着回旋曲线一正一反排列，密集但仍然保留清楚的方向。', '此图片为网站体验预览素材。', '叶片的正反节奏是否来自绘制顺序？', array['器物', '漆绘']::text[], '{}'::text[], array['环绕', '交织']::text[], array['漆', '木']::text[], array['/assets/patterns/gold-lacquer-panel.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T16:40:00+07:00'::timestamptz, '2026-07-23T16:40:00+07:00'::timestamptz),
  ('CMI-LN-0034', 'lanna_folklife', '黑金漆绘板饰 · 预览样本', '漆器与装饰艺术展区', '金色藤蔓在黑色漆面上连续转折，花叶与神兽共用同一条生长路径。', '此图片为网站体验预览素材；正式档案将保留参与者拍摄的展签与来源。', '这种连续卷草结构与载体边缘之间有什么使用关系？', array['器物', '漆绘']::text[], '{}'::text[], array['交织', '延伸']::text[], array['漆', '木']::text[], array['/assets/patterns/gold-lacquer-panel.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T10:30:00+07:00'::timestamptz, '2026-07-23T10:30:00+07:00'::timestamptz),
  ('CMI-LN-0033', 'lanna_folklife', '靛蓝菱形织纹 · 预览样本', '织物展区', '菱形单元在细小偏差中重复，手工织造留下了有节奏的不规则。', '此图片为网站体验预览素材；正式记录以现场展签和馆方资料为准。', '颜色和菱形层级是否对应具体织造技法？', array['织物']::text[], '{}'::text[], array['重复', '层叠']::text[], array['织物']::text[], array['/assets/patterns/indigo-woven-diamonds.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-23T09:12:00+07:00'::timestamptz, '2026-07-23T09:12:00+07:00'::timestamptz),
  ('CMI-LN-0032', 'lanna_folklife', '寺庙壁画人物带 · 预览样本', '壁画与生活场景展区', '人物沿着一条横向节奏展开，花叶边饰把叙事场景包裹起来。', '此图片为网站体验预览素材。', '人物排列是否来自特定故事或仪式顺序？', array['壁画']::text[], '{}'::text[], array['重复', '延伸']::text[], array['颜料', '灰泥']::text[], array['/assets/patterns/terracotta-mural.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-22T17:45:00+07:00'::timestamptz, '2026-07-22T17:45:00+07:00'::timestamptz),
  ('CMI-LN-0031', 'lanna_folklife', '柚木火焰莲纹 · 预览样本', '木雕与建筑构件展区', '莲瓣和火焰形层层抬起，光线让纹样的方向比颜色更明显。', '此图片为网站体验预览素材。', '这种形态在建筑的哪个位置最常出现？', array['建筑', '雕塑']::text[], '{}'::text[], array['放射', '层叠']::text[], array['木']::text[], array['/assets/patterns/carved-teak.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-22T15:20:00+07:00'::timestamptz, '2026-07-22T15:20:00+07:00'::timestamptz),
  ('CMI-LN-0030', 'fam', '青瓷莲云刻纹 · 预览样本', '当代兰纳器物展区', '浅刻线在青绿色釉面下若隐若现，重复结构依靠光而不是强烈颜色出现。', '此图片为网站体验预览素材。', '釉色和刻纹的先后顺序如何影响最终视觉？', array['器物']::text[], '{}'::text[], array['环绕', '重复']::text[], array['陶', '釉']::text[], array['/assets/patterns/celadon-lotus.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-22T13:50:00+07:00'::timestamptz, '2026-07-22T13:50:00+07:00'::timestamptz),
  ('CMI-LN-0029', 'fam', '朱红金线织带 · 预览样本', '服饰与织物展区', '细窄织带使用高对比色建立方向，金线只在转折处出现。', '此图片为网站体验预览素材。', '这种织带原本连接或强调服饰的哪个部位？', array['织物', '服饰']::text[], '{}'::text[], array['重复', '延伸']::text[], array['织物', '金线']::text[], array['/assets/patterns/red-gold-textile.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-21T16:28:00+07:00'::timestamptz, '2026-07-21T16:28:00+07:00'::timestamptz),
  ('CMI-LN-0028', 'lanna_folklife', '竹篾星形编织 · 预览样本', '生活与编织展区', '单根竹篾并不显眼，交错之后才出现连续的星形空隙。', '此图片为网站体验预览素材。', '编织密度是否由器物的承重需求决定？', array['编织结构', '器物']::text[], '{}'::text[], array['交织', '重复']::text[], array['竹']::text[], array['/assets/patterns/bamboo-weave.jpg']::text[], array['/assets/museums/lanna-folklife-centre.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-21T11:05:00+07:00'::timestamptz, '2026-07-21T11:05:00+07:00'::timestamptz),
  ('CMI-LN-0027', 'fam', '紫金镜面花纹 · 预览样本', '当代视觉展区', '传统花形被拆成镜像单元，紫色和金属反光让它产生数字界面的感觉。', '此图片为网站体验预览素材。', '传统单元被重新排列后，还保留了哪些识别特征？', array['装置', '当代艺术']::text[], '{}'::text[], array['对称', '放射']::text[], array['金属', '颜料']::text[], array['/assets/patterns/purple-mirror.jpg']::text[], array['/assets/museums/fahlanna-art-museum.jpg']::text[], '{}'::text[], 'CMI', 'published', '2026-07-20T18:02:00+07:00'::timestamptz, '2026-07-20T18:02:00+07:00'::timestamptz)
on conflict (archive_number) do update
set
  museum = excluded.museum,
  source_title = excluded.source_title,
  source_location = excluded.source_location,
  observation = excluded.observation,
  verified_information = excluded.verified_information,
  open_question = excluded.open_question,
  carrier_tags = excluded.carrier_tags,
  position_tags = excluded.position_tags,
  structure_tags = excluded.structure_tags,
  material_tags = excluded.material_tags,
  detail_image_urls = excluded.detail_image_urls,
  context_image_urls = excluded.context_image_urls,
  label_image_urls = excluded.label_image_urls,
  collector_name = excluded.collector_name,
  status = excluded.status,
  created_at = excluded.created_at,
  published_at = excluded.published_at;

select setval(
  'public.pattern_archive_number_seq',
  greatest(
    (select coalesce(max((substring(archive_number from '[0-9]+$'))::bigint), 0) from public.pattern_submissions),
    (select last_value from public.pattern_archive_number_seq)
  ),
  true
);
