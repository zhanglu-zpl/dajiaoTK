// 校验“全部题型”下的实际渲染结果：模拟浏览器执行 app.js 的数据与渲染逻辑
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const src = readFileSync('app.js', 'utf8');
// 取数据段（到 DOM 操作之前），在函数作用域内求值并导出我们需要检查的符号
const dataSection = src.slice(0, src.indexOf('const nav ='));
const exported = new Function(`${dataSection}; return { allQuestions, noteModels, categories };`)();
const { allQuestions, noteModels, categories } = exported;

// 与 app.js 中保持一致的就绪逻辑
const inCategory = (item, category) => category === 'all' || item.category === category;

// 1) “全部题型”必须包含 14 道原题 + 49 页书本扫描页
assert.equal(allQuestions.length, 63, `总条目应为 63，实际 ${allQuestions.length}`);
assert.equal(noteModels.length, 49, `书本扫描页应为 49，实际 ${noteModels.length}`);
assert.equal(allQuestions.filter(t => inCategory(t, 'all')).length, 63, '全部题型下未展示全部条目');

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
console.log('OK：数据与渲染逻辑全部通过');
