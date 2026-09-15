// 最小 DOM 桩：加载真实 app.js，验证弹窗中“页码行文字”与“答案页+3跳转”的实际行为。
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

function makeClassList() {
  const set = new Set();
  return {
    add: (...c) => c.forEach(x => set.add(x)),
    remove: (...c) => c.forEach(x => set.delete(x)),
    contains: c => set.has(c),
    toggle: (c, force) => (force ? set.add(c) : set.delete(c)),
  };
}
function makeEl(selector) {
  const handlers = {};
  return {
    selector,
    handlers,
    textContent: '',
    innerHTML: '',
    value: '',
    src: '',
    alt: '',
    disabled: false,
    classList: makeClassList(),
    dataset: {},
    attributes: {},
    setAttribute: (k, v) => { handlers.attrs = handlers.attrs || {}; handlers.attrs[k] = v; },
    getAttribute: k => (handlers.attrs || {})[k],
    addEventListener: (type, fn) => { handlers[type] = fn; },
    querySelectorAll: () => [],
    click: () => handlers.click && handlers.click({ target: {} }),
  };
}
const registry = new Map();
const document = {
  querySelector: sel => {
    if (!registry.has(sel)) registry.set(sel, makeEl(sel));
    return registry.get(sel);
  },
  querySelectorAll: () => [],
  addEventListener: () => {},
};

const code = readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const ctx = vm.createContext({ document, console });
vm.runInContext(code, ctx);

const $ = sel => document.querySelector(sel);
const get = id => $(id);
// vm 中顶层 const 不会成为 context 对象的属性，需在同一 context 内再求值一次取回。
const allQuestions = vm.runInContext('allQuestions', ctx);

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${label} | 实际=${JSON.stringify(actual)}${ok ? '' : ` 期望=${JSON.stringify(expected)}`}`);
}

// ---- 场景 1：辅助线综合练第 13 题（原题第 16 页，解析第 20-33 页需自行翻找）----
const q13 = allQuestions.find(q => q.id === 'aux-13');
ctx.openQuestion(q13);
check('页码行显示原题/解析页提示', get('#questionSource').textContent, '原题第 16 页 · 解析第 20-33 页，请自行翻找');
check('标题头不再重复该行', get('#questionMeta').textContent, '');
check('解析页码框初始值', Number(get('#answerPageInput').value), 20);
check('解析图默认渲染第 20 页', get('#answerImage').src, 'assets/answers/aux-practice/page-20.jpg');
check('解析图 alt 带页码', get('#answerImage').alt, '解析参考第 20 页');
check('起始时上一页禁用', get('#previousAnswer').disabled, true);

// ---- 场景 2：答案页+3跳转 ----
const jumpSeq = [];
for (let i = 0; i < 5; i += 1) {
  get('#jumpAnswer').click();
  jumpSeq.push(Number(get('#answerPageInput').value));
}
check('+3跳转序列（并在 33 页封顶）', jumpSeq.join(','), '23,26,29,32,33');
check('+3跳转后图片同步', get('#answerImage').src, 'assets/answers/aux-practice/page-33.jpg');
check('+3跳转后自动切到解析图', get('#answerImage').classList.contains('hidden-answer'), false);
check('+3跳转后按钮文案', get('#showAnswer').textContent, '返回题目页');
check('到达末页时下一页禁用', get('#nextAnswer').disabled, true);

// ---- 场景 3：上一页 / 下一页 ----
get('#previousAnswer').click();
check('上一页回到第 32 页', Number(get('#answerPageInput').value), 32);
get('#answerPageInput').value = '20';
get('#previousAnswer').click();
check('下限封顶在第 20 页', Number(get('#answerPageInput').value), 20);

// ---- 场景 4：已核对解析页码的资料（手写笔记模型）不受影响 ----
const model = allQuestions.find(q => q.id === 'note-model-3');
ctx.openQuestion(model);
check('模型题页码行文案', get('#questionSource').textContent, '可使用页码框和上下按钮查找解析');
check('模型题头部保留已配置解析页', get('#questionMeta').textContent, `原题第 ${model.page} 页 · 已配置解析 ${model.page} 页`);
check('模型题直接定位到解析页', get('#answerImage').src, model.answerPages[0].image);

// ---- 场景 5：解析页路径规范（与运行环境无关，任何沙箱都能校验）----
const PAD = (n, w) => String(n).padStart(w, '0');
const auxQuestions = allQuestions.filter(q => q.source === 'aux-practice');
const pathIssues = [];
for (const q of auxQuestions) {
  const expectThumb = `assets/questions/aux-practice/page-${PAD(q.page, 2)}.jpg`;
  if (q.thumb !== expectThumb) pathIssues.push(`${q.id}.thumb=${q.thumb}`);
  if (!Number.isInteger(q.answerPage)) pathIssues.push(`${q.id} 缺少 answerPage`);
}
check('综合练题量与题目页路径规范', auxQuestions.length === 14 && pathIssues.length === 0 ? 'ok' : `count=${auxQuestions.length} ${pathIssues.join(';')}`, 'ok');
check('解析页编号为 20-33 连续递增', auxQuestions.map(q => q.answerPage).join(','), Array.from({ length: 14 }, (_, i) => 20 + i).join(','));

// 弹窗实际渲染出的解析图路径，必须与题库声明的 answerPage 一致（逐题覆盖）
const renderedMismatch = [];
for (const q of auxQuestions) {
  ctx.openQuestion(q);
  const expect = `assets/answers/aux-practice/page-${PAD(q.answerPage, 2)}.jpg`;
  if (get('#answerImage').src !== expect) renderedMismatch.push(`${q.id}:${get('#answerImage').src}`);
}
check('弹窗渲染的解析图路径逐题一致', renderedMismatch.length ? renderedMismatch.join(';') : 'ok', 'ok');

// 手写笔记模型：thumb / answerPages 路径规范
const noteIssues = [];
for (const m of allQuestions.filter(q => q.source === 'note-models')) {
  if (m.thumb !== `assets/note-models/page-${PAD(m.page, 3)}.jpg`) noteIssues.push(`${m.id}.thumb`);
  if (!m.answerPages.every(a => a.image === `assets/note-models/page-${PAD(a.page, 3)}.jpg`)) noteIssues.push(`${m.id}.answerPages`);
}
check('笔记模型路径规范', noteIssues.length ? noteIssues.join(';') : 'ok', 'ok');

// ---- 场景 6：图片资源存在性（环境感知）----
// 注意：运行时沙箱不挂载二进制资源（assets/**.jpg 不会出现在其文件系统中），
// 若直接判定失败会把“环境限制”误报成“代码缺陷”。故此处：
//   - 能读到 assets 目录（本机 / ASSET_ROOT 指向）时执行硬校验；
//   - 读不到时输出 SKIP 并列出待核对清单，不计入失败。
const assetRoot = process.env.ASSET_ROOT ? pathToFileURL(`${process.env.ASSET_ROOT.replace(/[\\/]$/, '')}/`) : new URL('../', import.meta.url);
const answerFiles = Array.from({ length: 14 }, (_, i) => `assets/answers/aux-practice/page-${PAD(20 + i, 2)}.jpg`);
let assetDirReadable = false;
try { readdirSync(new URL('assets/answers/aux-practice/', assetRoot)); assetDirReadable = true; } catch { assetDirReadable = false; }
if (assetDirReadable) {
  const missing = answerFiles.filter(f => !existsSync(new URL(f, assetRoot)));
  check('第 20-33 页解析图全部存在', missing.length === 0 ? 'ok' : missing.join(','), 'ok');
} else {
  console.log('SKIP | 第 20-33 页解析图存在性 | 原因=当前运行环境未挂载二进制资源，assets 目录不可读（非代码问题）');
  console.log(`     需核对的 ${answerFiles.length} 个文件：` + answerFiles.map(f => f.replace('assets/answers/aux-practice/', '')).join(' '));
  console.log('     在本机核对：ASSET_ROOT=<含 assets 的目录> node tmp/verify-modal.mjs');
}

console.log(failures === 0 ? '\n全部通过' : `\n${failures} 项失败`);
process.exit(failures === 0 ? 0 : 1);
