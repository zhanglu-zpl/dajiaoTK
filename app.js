const categories = [
  { id:'all', label:'全部题型', icon:'◈' },
  { id:'point-line', label:'点与线', icon:'·' },
  { id:'angle', label:'角', icon:'∠' },
  { id:'triangle', label:'三角形', icon:'△' },
  { id:'quadrilateral', label:'四边形', icon:'▱' },
  { id:'circle', label:'圆', icon:'○' },
  { id:'auxiliary', label:'辅助线', icon:'╱' },
  { id:'comprehensive', label:'综合模型', icon:'✦' },
];
const topics = [
  {id:'collinear',category:'point-line',title:'点、线、面的位置关系',desc:'共线、相交、平行与垂直：先读图，再锁定不变量。',count:'基础 · 12 组',color:'#e6f2ff',icon:'·'},
  {id:'parallel',category:'point-line',title:'平行线与截线',desc:'同位角、内错角、同旁内角，串起证明的第一条线索。',count:'基础 · 18 组',color:'#e7f7f2',icon:'∥'},
  {id:'angle-bisector',category:'angle',title:'角平分线与倍角',desc:'角平分线、补角、余角，适合建立等角与等腰三角形。',count:'方法 · 16 组',color:'#fff1dc',icon:'∠'},
  {id:'triangle-congruence',category:'triangle',title:'三角形全等',desc:'SSS、SAS、ASA、AAS：把“相等”翻译成可用的边角关系。',count:'核心 · 24 组',color:'#f0eaff',icon:'△'},
  {id:'triangle-similarity',category:'triangle',title:'三角形相似',desc:'平行线、AA、比例线段与面积比，是综合题的高频入口。',count:'核心 · 28 组',color:'#e6f2ff',icon:'△'},
  {id:'special-lines',category:'triangle',title:'中线、高线、角平分线',desc:'三线共性与差异，识别“等分”“垂直”“等距”的证据。',count:'方法 · 14 组',color:'#fff0ee',icon:'╱'},
  {id:'parallelogram',category:'quadrilateral',title:'平行四边形',desc:'对边平行且相等、对角线互相平分：移动与补形的母模型。',count:'模型 · 20 组',color:'#e7f7f2',icon:'▱'},
  {id:'rectangle-rhombus',category:'quadrilateral',title:'矩形、菱形、正方形',desc:'从一个直角或一组等边出发，追踪四边形的升级条件。',count:'模型 · 19 组',color:'#f0eaff',icon:'◇'},
  {id:'trapezoid',category:'quadrilateral',title:'梯形与中位线',desc:'辅助线补成平行四边形，处理长度、面积与比例。',count:'方法 · 15 组',color:'#fff1dc',icon:'⏢'},
  {id:'circle-basics',category:'circle',title:'圆的基本性质',desc:'半径、弦、弧、圆心角与圆周角，先建立同圆语言。',count:'基础 · 17 组',color:'#e6f2ff',icon:'○'},
  {id:'tangent',category:'circle',title:'切线与切点',desc:'半径垂切线、切线长相等：圆题证明的两把钥匙。',count:'核心 · 18 组',color:'#e7f7f2',icon:'⊙'},
  {id:'cyclic',category:'circle',title:'圆内接与四点共圆',desc:'对角互补、同弧等角，把角度关系搬进圆中。',count:'综合 · 21 组',color:'#fff0ee',icon:'◌'},
  {id:'translate',category:'auxiliary',title:'平移与补形',desc:'把分散的线段搬到同一直线上，制造全等、平行与比例。',count:'作法 · 13 组',color:'#e7f7f2',icon:'→'},
  {id:'rotate',category:'auxiliary',title:'旋转构造等腰/等边',desc:'围绕一个顶点旋转，快速生成 60°、90° 与等距关系。',count:'作法 · 11 组',color:'#f0eaff',icon:'↻'},
  {id:'extend',category:'auxiliary',title:'延长、截长补短',desc:'把折线变直线，把差转成和：处理角平分线与最值。',count:'作法 · 16 组',color:'#fff1dc',icon:'↗'},
  {id:'extremum',category:'comprehensive',title:'最值与路径模型',desc:'两点之间线段最短、反射展开、将军饮马，图形化表达最值。',count:'压轴 · 12 组',color:'#fff0ee',icon:'⌁'},
  {id:'dynamic',category:'comprehensive',title:'动点与存在性',desc:'用参数、相似与面积函数，读懂“运动中的不变”。',count:'压轴 · 18 组',color:'#e6f2ff',icon:'✦'},
  {id:'six-models',category:'comprehensive',title:'考前必看六类模型',desc:'把高频结构压缩成六张模型卡，考前快速复盘。',count:'冲刺 · 6 类',color:'#fff1dc',icon:'★'},
];
// 首批题目来自《几何辅助线·辅助线作法综合练》中的 14 道原题。
// 每道题保留原页图像，并用“图形结构 + 解题动作”标注，避免对扫描文字做不可靠的伪 OCR。
// 答案页支持两种写法：
// 1) answerPage + answer（单页）；2) answerPages: [{page, image}, ...]（一题多页）。
// answerPage/answer 也可以直接填写数组；同一页图片路径可被多个题目复用。
const questions = [
  {id:'aux-01',no:1,title:'等腰三角形中的垂线与平行线',category:'triangle',shape:'等腰三角形',method:'作垂线 · 平行线 · 相似',source:'aux-practice',page:4,answerPage:20,thumb:'assets/questions/aux-practice/page-04.jpg',answer:'assets/answers/aux-practice/page-20.jpg',note:'识别等腰结构，先利用垂线构造直角，再用 DE ∥ AC 建立相似。'},
  {id:'aux-02',no:2,title:'平行四边形中的对角线与等角',category:'quadrilateral',shape:'平行四边形',method:'连对角线 · 全等',source:'aux-practice',page:5,answerPage:21,thumb:'assets/questions/aux-practice/page-05.jpg',answer:'assets/answers/aux-practice/page-21.jpg',note:'平行四边形提供平行线角关系；连接对角线后，优先寻找一组全等三角形。'},
  {id:'aux-03',no:3,title:'平行线截三角形的比例线段',category:'triangle',shape:'三角形',method:'平行线 · 相似',source:'aux-practice',page:6,answerPage:22,thumb:'assets/questions/aux-practice/page-06.jpg',answer:'assets/answers/aux-practice/page-22.jpg',note:'题目连续出现平行条件，主线是 AA 相似与对应边比例。'},
  {id:'aux-04',no:4,title:'平行线背景下的折线与垂线',category:'point-line',shape:'平行线',method:'延长 · 等角',source:'aux-practice',page:7,answerPage:23,thumb:'assets/questions/aux-practice/page-07.jpg',answer:'assets/answers/aux-practice/page-23.jpg',note:'先把折线放回两条平行线的角度体系，再处理垂线带来的直角。'},
  {id:'aux-05',no:5,title:'直角三角形中的旋转与相似',category:'triangle',shape:'直角三角形',method:'旋转 · 相似 · 比例',source:'aux-practice',page:8,answerPage:24,thumb:'assets/questions/aux-practice/page-08.jpg',answer:'assets/answers/aux-practice/page-24.jpg',note:'含 90° 与固定角，适合通过旋转/补形把线段关系转成相似。'},
  {id:'aux-06',no:6,title:'矩形中的动点与面积比',category:'quadrilateral',shape:'矩形',method:'作平行线 · 面积比',source:'aux-practice',page:9,answerPage:25,thumb:'assets/questions/aux-practice/page-09.jpg',answer:'assets/answers/aux-practice/page-25.jpg',note:'矩形的平行与垂直是稳定骨架，面积问题转化为同高三角形比。'},
  {id:'aux-07',no:7,title:'梯形中的辅助线与等腰三角形',category:'quadrilateral',shape:'梯形',method:'平移补形 · 全等',source:'aux-practice',page:10,answerPage:26,thumb:'assets/questions/aux-practice/page-10.jpg',answer:'assets/answers/aux-practice/page-26.jpg',note:'梯形优先考虑平移一腰或作平行线补成平行四边形。'},
  {id:'aux-08',no:8,title:'四边形中的角平分线',category:'angle',shape:'角平分线',method:'角平分线 · 等腰',source:'aux-practice',page:11,answerPage:27,thumb:'assets/questions/aux-practice/page-11.jpg',answer:'assets/answers/aux-practice/page-27.jpg',note:'角平分线制造等角，结合已知边关系寻找等腰三角形。'},
  {id:'aux-09',no:9,title:'平行四边形中的截长补短',category:'auxiliary',shape:'平行四边形',method:'截长补短 · 全等',source:'aux-practice',page:12,answerPage:28,thumb:'assets/questions/aux-practice/page-12.jpg',answer:'assets/answers/aux-practice/page-28.jpg',note:'将不在同一直线上的线段通过截长补短转化为可比较的边。'},
  {id:'aux-10',no:10,title:'等腰三角形的延长线构造',category:'auxiliary',shape:'等腰三角形',method:'延长 · 等腰',source:'aux-practice',page:13,answerPage:29,thumb:'assets/questions/aux-practice/page-13.jpg',answer:'assets/answers/aux-practice/page-29.jpg',note:'外角与底角关系明显，延长一边可把角度关系集中到一个三角形。'},
  {id:'aux-11',no:11,title:'平行线与梯形的角度转化',category:'point-line',shape:'平行线',method:'平行线 · 角度追踪',source:'aux-practice',page:14,answerPage:30,thumb:'assets/questions/aux-practice/page-14.jpg',answer:'assets/answers/aux-practice/page-30.jpg',note:'用同位角、内错角逐层追角，再结合等腰或直角完成收束。'},
  {id:'aux-12',no:12,title:'梯形中的中点与面积',category:'quadrilateral',shape:'梯形',method:'中点 · 中位线 · 面积',source:'aux-practice',page:15,answerPage:31,thumb:'assets/questions/aux-practice/page-15.jpg',answer:'assets/answers/aux-practice/page-31.jpg',note:'出现两腰中点时优先联想到梯形中位线，面积随之转成底边和。'},
  {id:'aux-13',no:13,title:'最短距离与反射展开',category:'comprehensive',shape:'最值模型',method:'反射 · 两点间线段最短',source:'aux-practice',page:16,answerPage:32,thumb:'assets/questions/aux-practice/page-16.jpg',answer:'assets/answers/aux-practice/page-32.jpg',note:'把折线路径反射展开为直线距离，再用两点之间线段最短。'},
  {id:'aux-14',no:14,title:'矩形与中点构造全等',category:'quadrilateral',shape:'矩形',method:'中点 · 全等',source:'aux-practice',page:17,answerPage:33,thumb:'assets/questions/aux-practice/page-17.jpg',answer:'assets/answers/aux-practice/page-33.jpg',note:'矩形给出直角与对边相等，结合中点条件寻找 SAS/ASA 全等。'},
];
// 《中考几何满分冲刺》书本扫描件中的几何模型页（共 49 页，页码来自原书目录）。
// 已按模型内容做简单题型分类（第二字段为学科题型），每页同时展示在“全部题型”与所属学科题型下；
// 后续如果拆出单题，可继续沿用 answerPages 多页结构。
const noteModelSpecs = [
  ['射影定理','triangle',1],['中线定理','triangle',5],['相交弦定理','circle',7],['弦切角定理','circle',8],['割线/切割线定理','circle',10],['平行线与角平分线相遇','angle',12],['“12345”模型','angle',13],['正方形十字架','quadrilateral',18],['矩形十字架','quadrilateral',22],['将军饮马','comprehensive',25],['选桥选址','comprehensive',32],['将军遛马','comprehensive',36],['一线三等角/一线三垂直','triangle',40],['锐角、钝角三等角','triangle',45],['中点型三等角','triangle',46],['三等角构造','triangle',47],['点圆、线圆最值','circle',54],['胡不归','comprehensive',59],['阿氏圆','circle',64],['手拉手全等型','triangle',71],['手拉手相似型','triangle',75],['鸡爪模型','triangle',78],['逆序脚拉脚','auxiliary',84],['顺序脚拉脚','auxiliary',89],['任意角互补型脚拉脚','auxiliary',91],['脚拉脚变形','auxiliary',95],['对角互补模型','angle',97],['婆罗摩多模型','quadrilateral',107],['半角模型','angle',109],['隐形圆定点定长','circle',118],['定弦定角','circle',122],['定角定高','triangle',128],['最大张角（米勒圆）','circle',132],['四点共圆','circle',135],['托勒密定理','circle',148],['托勒密不等式','circle',152],['直线生直线型','point-line',156],['圆生圆型','circle',168],['双瓜豆型','comprehensive',177],['蝴蝶模型','quadrilateral',180],['费马点','comprehensive',182],['“加权”费马点','comprehensive',186],['逆等线模型','auxiliary',194],['“加权”逆等线','auxiliary',198],['逆等线最值','comprehensive',201],['垂美四边形','quadrilateral',205],['铅垂法','auxiliary',207],['建系法','auxiliary',210],['相似模型','triangle',225]
];
const noteModels = noteModelSpecs.map(([title, category, page], index) => ({
  id:`note-model-${index+1}`, no:`M${index+1}`, title, category, shape:'书本模型页', method:'整页扫描', source:'model-scan', page, answerPages:[{page, image:`assets/note-models/page-${String(page).padStart(3,'0')}.jpg`}], thumb:`assets/note-models/page-${String(page).padStart(3,'0')}.jpg`, note:'《中考几何满分冲刺》书本扫描页，模型讲解与例题在同一页。'
}));
// 书本扫描页排在前面，打开“全部题型”即可看到；其后是 14 道辅助线原题。
const allQuestions = noteModels.concat(questions);
const sources = [
  {id:'guide-answers',title:'中考几何一本通参考答案',type:'答案',pages:64,path:'D:/办公/大角几何/中考几何一本通参考答案.pdf',tags:'答案解析 · 一本通'},
  {id:'guide-aux',title:'中考几何一本通上册 · 辅助线意识',type:'题册',pages:104,path:'D:/办公/大角几何/中考几何一本通上册辅助线意识.pdf',tags:'辅助线 · 题型训练'},
  {id:'guide-combine',title:'中考几何一本通下册 · 综合题型方法',type:'题册',pages:173,path:'D:/办公/大角几何/中考几何一本通下册综合题型方法.pdf',tags:'综合题 · 方法'},
  {id:'model-book',title:'2024版初中《几何模型》',type:'题册',pages:192,path:'D:/办公/大角几何/2024版中考《几何模型》/2024版 初中《几何模型》.pdf',tags:'几何模型 · 主册'},
  {id:'model-six',title:'《几何模型》· 考前必看六类模型',type:'冲刺',pages:8,path:'D:/办公/大角几何/2024版中考《几何模型》/2024版《几何模型》-考前必看六类模型.pdf',tags:'六类模型 · 冲刺'},
  {id:'model-answers',title:'2024版初中《几何模型》· 答案解析',type:'答案',pages:113,path:'D:/办公/大角几何/2024版中考《几何模型》/2024版初中《几何模型》：答案解析.pdf',tags:'答案解析 · 模型'},
  {id:'aux-book',title:'2024版初中《几何辅助线》',type:'题册',pages:145,path:'D:/办公/大角几何/2024版中考数学几何辅助线/2024版 初中《几何辅助线》.pdf',tags:'辅助线 · 主册'},
  {id:'aux-answers',title:'2024版初中《几何辅助线》· 答案详解',type:'答案',pages:115,path:'D:/办公/大角几何/2024版中考数学几何辅助线/2024版 初中《几何辅助线》：答案详解.pdf',tags:'答案详解 · 辅助线'},
  {id:'aux-practice',title:'《几何辅助线》· 辅助线作法综合练',type:'练习',pages:33,path:'D:/办公/大角几何/2024版中考数学几何辅助线/2024版 初中《几何辅助线》：辅助线作法综合练.pdf',tags:'综合练 · 作法'},
];

const nav = document.querySelector('#categoryNav'); const grid = document.querySelector('#topicGrid'); const search = document.querySelector('#searchInput'); let activeCategory = 'all';
// 题型归属：每个条目只有一个学科题型（category），“全部题型”展示所有条目。
function inCategory(item, category){ return category === 'all' || item.category === category; }
function categoryLabel(id){ const hit = categories.find(category => category.id === id); return hit ? hit.label : id; }
nav.innerHTML = categories.map(category => `<button class="category-btn ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}"><span class="category-icon">${category.icon}</span>${category.label}</button>`).join('');
function renderTopics(){ const q=search.value.trim().toLowerCase(); const list=allQuestions.filter(t=>inCategory(t,activeCategory)&&(!q||(t.title+t.shape+t.method+t.note).toLowerCase().includes(q))); grid.innerHTML=list.length?list.map(t=>`<article class="question-card" data-question="${t.id}"><div class="question-thumb"><img src="${t.thumb}" alt="${t.title}" loading="lazy"/><span class="question-no">${String(t.no).padStart(2,'0')}</span></div><div class="question-card-content"><div class="topic-top"><span class="shape-label">${t.source==='model-scan'?`${categoryLabel(t.category)} · 模型`:t.shape}</span><span class="topic-count">${t.source==='model-scan'?'扫描页':'第 '+t.no+' 题'}</span></div><h3>${t.title}</h3><p>${t.source==='model-scan'?'点击查看书本模型页（扫描件）':'点击查看题目与解析答案'}</p><div class="topic-footer"><span>查看详情</span><span class="topic-arrow">→</span></div></div></article>`).join(''):`<div class="empty-reader" style="position:relative;grid-column:1/-1;padding:60px 0"><h4>没有找到匹配题目</h4><p>请换一个关键词搜索。</p></div>`; document.querySelector('#sectionTitle').textContent=categories.find(category=>category.id===activeCategory).label.replace('题型','题目'); }
nav.addEventListener('click', event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;nav.querySelectorAll('.category-btn').forEach(item=>item.classList.toggle('active',item===button));renderTopics();}); search.addEventListener('input',renderTopics); document.querySelectorAll('.view-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');grid.classList.toggle('list-view',b.dataset.view==='list');}));
const questionModal=document.querySelector('#questionModal'), questionImage=document.querySelector('#questionImage'), answerImage=document.querySelector('#answerImage'), questionTitle=document.querySelector('#questionTitle'), questionMeta=document.querySelector('#questionMeta'), questionSource=document.querySelector('#questionSource'), showAnswer=document.querySelector('#showAnswer'), previousAnswer=document.querySelector('#previousAnswer'), nextAnswer=document.querySelector('#nextAnswer'), answerPageInput=document.querySelector('#answerPageInput'), jumpAnswer=document.querySelector('#jumpAnswer'); let currentQuestion; let answerIndex=0;
// 只有已核对过解析页码的资料（如手写笔记模型）返回真实解析页；
// 《辅助线作法综合练》的答案页无法逐题核对，返回空数组，改用“页码框 + 上下按钮 + 答案页+3跳转”自由翻找。
function answerPages(question) { if (question.source === 'aux-practice') return []; return question.answerPages || []; }
function renderAnswerPage(){const answers=answerPages(currentQuestion); if (!answers.length) { const page=Math.max(20,Math.min(33,Number(answerPageInput.value)||20)); answerPageInput.value=page; answerImage.src=`assets/answers/aux-practice/page-${String(page).padStart(2,'0')}.jpg`; answerImage.alt=`解析参考第 ${page} 页`; previousAnswer.disabled=page<=20; nextAnswer.disabled=page>=33; return; } const answer=answers[answerIndex];answerImage.src=answer.image;answerImage.alt=`第 ${currentQuestion.no} 题解析第 ${answer.page} 页`;answerPageInput.value=answer.page;previousAnswer.disabled=answerIndex===0;nextAnswer.disabled=answerIndex===answers.length-1;}
function openQuestion(q){currentQuestion=q;answerIndex=0;const answers=answerPages(q);const isScan=q.source==='model-scan';questionTitle.textContent=isScan?q.title:`第 ${q.no} 题 · ${q.title}`;const metaText=isScan?`《中考几何满分冲刺》书本扫描页 · 原书第 ${q.page} 页`:answers.length?`原题第 ${q.page} 页 · 已配置解析 ${answers.map(answer=>answer.page).join('、')} 页`:`原题第 ${q.page} 页 · 解析第 20-33 页，请自行翻找`;questionMeta.textContent=metaText;questionSource.textContent=isScan?'模型讲解与例题在同一页，可直接翻看':answers.length?'可使用页码框和上下按钮查找解析':metaText;questionImage.src=q.thumb;questionImage.classList.remove('hidden-answer');answerImage.classList.add('hidden-answer');showAnswer.textContent='查看解析答案';answerPageInput.value=answers.length?(answers[0].page):20;renderAnswerPage();questionModal.classList.remove('hidden');questionModal.setAttribute('aria-hidden','false');}
function closeQuestion(){questionModal.classList.add('hidden'); questionModal.setAttribute('aria-hidden','true');}
grid.addEventListener('click',e=>{const card=e.target.closest('[data-question]');if(card)openQuestion(allQuestions.find(q=>q.id===card.dataset.question));}); document.querySelector('#closeQuestion').addEventListener('click',closeQuestion); questionModal.addEventListener('click',e=>{if(e.target.dataset.questionClose)closeQuestion();}); function setAnswerView(showing){questionImage.classList.toggle('hidden-answer',showing);answerImage.classList.toggle('hidden-answer',!showing);showAnswer.textContent=showing?'返回题目页':'查看解析答案';} showAnswer.addEventListener('click',()=>setAnswerView(answerImage.classList.contains('hidden-answer'))); jumpAnswer.addEventListener('click',()=>{const answers=answerPages(currentQuestion);if(answers.length){answerIndex=Math.min(answers.length-1,answerIndex+3);renderAnswerPage();}else{answerPageInput.value=Math.min(33,(Number(answerPageInput.value)||20)+3);renderAnswerPage();}setAnswerView(true);});previousAnswer.addEventListener('click',()=>{const answers=answerPages(currentQuestion);if(answers.length){if(answerIndex>0){answerIndex-=1;renderAnswerPage();}}else{answerPageInput.value=Math.max(20,(Number(answerPageInput.value)||20)-1);renderAnswerPage();}});nextAnswer.addEventListener('click',()=>{const answers=answerPages(currentQuestion);if(answers.length){if(answerIndex<answers.length-1){answerIndex+=1;renderAnswerPage();}}else{answerPageInput.value=Math.min(33,(Number(answerPageInput.value)||20)+1);renderAnswerPage();}});answerPageInput.addEventListener('change',renderAnswerPage);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuestion();});
renderTopics();
