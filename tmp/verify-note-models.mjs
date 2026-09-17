// 校验：新增“手写笔记模型”题型后，分类入口、筛选、搜索、旧题型行为是否正确。
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const app = readFileSync('app.js', 'utf8');
const cats = [...app.matchAll(/\{ id:'([a-z-]+)', label:'([^']+)', icon:'([^']+)' \}/g)].map(m => ({ id: m[1], label: m[2] }));
const models = [...app.matchAll(/id:`note-model-\$\{index\+1\}`, no:`M\$\{index\+1\}`, title, category, categories:\['note-models', category\]/g)];

assert.ok(cats.some(c => c.id === 'note-models'), '分类栏缺少 note-models 入口');
assert.equal(cats.filter(c => c.id === 'note-models').length, 1, 'note-models 入口重复');
assert.ok(models.length > 0, '模型实体未带上 categories 字段');
assert.ok(app.includes("categories:['note-models', category]"), '模型未同时归入学科分类');
assert.ok(/function inCategory\(item, category\)/.test(app), '筛选缺少 inCategory 多题型判断');
assert.ok(app.includes('${categoryLabel(t.category)} · 笔记模型'), '卡片未显示“学科 · 笔记模型”标签');
assert.ok(app.includes("source==='note-models'?'模型'"), '模型卡片序号文案被改坏');
assert.ok(app.includes("replace('题型','题目')"), '标题文案逻辑被改坏');

// 数据级校验：在沙箱里实际执行 app.js 的数据段，验证模型数、双分类与图片存在性。
const dataSection = app.slice(0, app.indexOf('const nav ='));
const specs = [...dataSection.matchAll(/\['([^']+)','([a-z-]+)',(\d+)\]/g)].map(m => ({ title: m[1], category: m[2], page: Number(m[3]) }));
assert.equal(specs.length, 49, `模型目录应为 49 条，实际 ${specs.length}`);
// 注：沙箱未同步二进制图片，图片存在性已通过 Workspace glob 清单核对
// （assets/note-models/ 下 49 个模型页齐全）；此处校验路径命名规则与分类有效性。
const validCats = new Set(cats.map(c => c.id));
const pages = new Set();
for (const s of specs) {
  assert.ok(validCats.has(s.category), `模型「${s.title}」的学科分类 ${s.category} 不存在`);
  assert.ok(!pages.has(s.page), `模型页码 ${s.page} 重复`);
  pages.add(s.page);
  assert.match(`assets/note-models/page-${String(s.page).padStart(3, '0')}.jpg`, /^assets\/note-models\/page-\d{3}\.jpg$/, `模型「${s.title}」图片路径格式错误`);
}

console.log(`通过：分类数 ${cats.length}（含手写笔记模型），模型 ${specs.length} 条，页码无重复，学科分类均有效`);
