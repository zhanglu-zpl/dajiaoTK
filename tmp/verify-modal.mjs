// 最小 DOM 桩：加载真实 app.js，验证弹窗中“页码行文字”与“答案页+3跳转”的实际行为。
import { readFileSync } from 'node:fs';
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

let failures = 0;
function check(label, actual, expected) {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${label} | 实际=${JSON.stringify(actual)}${ok ? '' : ` 期望=${JSON.stringify(expected)}`}`);
}

// ---- 场景 1：辅助线综合练第 13 题（原题第 16 页，解析第 20-33 页需自行翻找）----
const q13 = ctx.allQuestions.find(q => q.id === 'aux-13');
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
const model = ctx.allQuestions.find(q => q.id === 'note-model-3');
ctx.openQuestion(model);
check('模型题页码行文案', get('#questionSource').textContent, '可使用页码框和上下按钮查找解析');
check('模型题头部保留已配置解析页', get('#questionMeta').textContent, `原题第 ${model.page} 页 · 已配置解析 ${model.page} 页`);
check('模型题直接定位到解析页', get('#answerImage').src, model.answerPages[0].image);

// ---- 场景 5：解析页图片资源完整性（第 20-33 页）----
const missing = [];
for (let p = 20; p <= 33; p += 1) {
  const rel = `assets/answers/aux-practice/page-${p}.jpg`;
  try { readFileSync(new URL(`../${rel}`, import.meta.url)); } catch { missing.push(rel); }
}
check('第 20-33 页解析图全部存在', missing.length === 0 ? 'ok' : missing.join(','), 'ok');

console.log(failures === 0 ? '\n全部通过' : `\n${failures} 项失败`);
process.exit(failures === 0 ? 0 : 1);
