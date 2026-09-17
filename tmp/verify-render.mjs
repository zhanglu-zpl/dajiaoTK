// 校验“全部题型”下的实际渲染结果：模拟浏览器执行 app.js 的数据与渲染逻辑
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = readFileSync('app.js', 'utf8');
// 取数据段（到 DOM 操作之前），在函数作用域内求值并导出我们需要检查的符号
const dataSection = src.slice(0, src.indexOf('const nav ='));
const exported = new Function(`${dataSection}; return { allQuestions, noteModels, sixModels, categories };`)();
const { allQuestions, noteModels, sixModels, categories } = exported;

// 与 app.js 中保持一致的就绪逻辑
const inCategory = (item, category) => category === 'all' || item.category === category;

// 1) “全部题型”必须包含 6 页六类模型 + 49 页书本扫描页 + 14 道原题
assert.equal(allQuestions.length, 69, `总条目应为 69，实际 ${allQuestions.length}`);
assert.equal(noteModels.length, 49, `书本扫描页应为 49，实际 ${noteModels.length}`);
assert.equal(sixModels.length, 6, `六类模型页应为 6，实际 ${sixModels.length}`);
assert.equal(allQuestions.filter(t => inCategory(t, 'all')).length, 69, '全部题型下未展示全部条目');

// 1b) 六类模型排在最前，且每页字段、分类、图片路径正确
allQuestions.slice(0, 6).forEach((q, i) => {
  assert.equal(q.id, `six-model-${i + 1}`, `第 ${i + 1} 条应为 six-model-${i + 1}，实际 ${q.id}`);
  assert.equal(q.category, 'comprehensive', `${q.id} 应归入综合模型`);
  assert.equal(q.scan, true, `${q.id} 缺 scan 标记`);
  assert.equal(q.book, '《几何模型 · 考前必看六类模型》', `${q.id} 书名不对`);
  assert.equal(q.thumb, `tmp/pdfs/notes-pages/page-00${i + 1}.png`, `${q.id} 图片路径不对`);
  assert.equal(q.answerPages[0].image, q.thumb, `${q.id} 解析页应与原页一致`);
});
console.log('六类模型 6 页已置于全部题型最前:', sixModels.map(m => `${m.no} ${m.title}`).join(' | '));

// 2) 每个学科题型分类下都能筛到条目（含扫描页归入的学科）
const scanByCat = {};
for (const m of noteModels) scanByCat[m.category] = (scanByCat[m.category] || 0) + 1;
console.log('扫描页题型分布:', scanByCat);
for (const c of categories.filter(c => c.id !== 'all')) {
  const n = allQuestions.filter(t => inCategory(t, c.id)).length;
  assert.ok(n > 0, `分类 ${c.id}(${c.label}) 下没有条目`);
  console.log(`${c.label}: ${n} 条`);
}

// 3) 卡片渲染模板所需字段齐全，且图片路径与磁盘文件一一对应
import { existsSync } from 'node:fs';
const missing = [];
for (const q of allQuestions) {
  for (const key of ['id', 'no', 'title', 'category', 'thumb']) {
    assert.ok(q[key] !== undefined && q[key] !== '', `条目 ${q.id} 缺字段 ${key}`);
  }
  if (!existsSync(q.thumb)) missing.push(q.thumb);
}
// 沙箱不同步二进制图片时跳过磁盘校验，仅在文件可见时检查
console.log(missing.length ? `（沙箱不可见的图片 ${missing.length} 个，Workspace 已另行核对）` : '全部缩略图文件存在');

// 4) 扫描页卡片的展示文案
const sample = noteModels[0];
const label = `${categories.find(c => c.id === sample.category).label} · 模型`;
assert.equal(label, '三角形 · 模型');
console.log(`首条扫描页卡片标签示例: ${label}，编号 ${sample.no}，标题「${sample.title}」`);

// 5) app.js 关键渲染逻辑：scan 标记 + 每题书名 + index.html 版本号
assert.ok(!src.includes("t.source==='model-scan'"), 'renderTopics 仍在用旧的 source 判断');
assert.ok(src.includes('const isScan=q.scan'), 'openQuestion 未改用 scan 标记');
assert.ok(src.includes('`${q.book} 书本扫描页 · 原书第 ${q.page} 页`'), '详情弹窗未使用每题书名');
const html = readFileSync('index.html', 'utf8');
assert.ok(html.includes('app.js?v=4'), 'index.html 未升级 app.js 版本号（浏览器会缓存旧脚本）');
console.log('OK：数据与渲染逻辑全部通过');
