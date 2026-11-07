/* KAFV quality-and-distribution education app v0.1. Master UI: approved Bukangi prototype.
   No AI API, no external requests. All chat responses are selected from the approved instructor material.
   Original sanitation source archive is unchanged. */
(()=>{'use strict';
const L=window.KAFV_LECTURES, KB=window.KAFV_KB;
if(!L || !KB){document.body.textContent='교육 데이터 로딩에 실패했습니다. ZIP을 압축 해제한 후 index.html을 실행하세요.';return;}
const slides=[...L.slides,...[
 {num:33,part:4,title:'실습 1 · 입고검수 기록서 작성',core:'입고 제품의 품목, 로트, 공급자, 원산지, 실제 제품온도, 포장상태, 거래정보를 기록합니다. 확인되지 않은 정보가 있다면 보류하고 후속 판단을 요청합니다.',question:'입고서에 기록해야 할 사실과 확인이 필요한 정보는 무엇입니까?',answer:'상품정보와 제품온도를 확인하고, 미확인·이상 항목은 보류로 남깁니다.',image:'33번 인포그래픽은 입고검수에 대한 직접 입력 실습을 안내합니다.',deep:'실제 상품에 관한 적합·부적합 판단을 교육용 예시만으로 확정하지 않습니다.',case:'입고된 고등어 포장의 중량 표기가 발주서와 다르면 주문·규격을 대조합니다.',caution:'시설과 제품에 적용되는 실제 기준은 별도 확인해야 합니다.',next:'실습 2 이상 대응서로 이동합니다.',img:(window.KAFV_IMAGE_MAP?.[33]||'assets/33.webp')},
 {num:34,part:4,title:'실습 2 · 이상 대응서 작성',core:'온도이탈·포장파손·해동 의심 등 이상 징후가 발견되면 해당 로트를 분리·보류하고 관찰 사실, 이력, 보고 및 책임자 결정을 기록합니다.',question:'현재 확인된 사실과 아직 추정인 내용을 어떻게 구분합니까?',answer:'발견시각·로트·설비/제품온도·조치를 사실로 기록하고 추정은 별도로 표시합니다.',image:'34번 인포그래픽을 보고 이상 대응 기록서를 직접 작성합니다.',deep:'의심 제품의 판매 재개는 관련 기준과 책임자 확인 전에는 확정하지 않습니다.',case:'냉동창고 경보가 있었다면 이탈시간과 제품온도 자료부터 확인합니다.',caution:'실습의 온도는 모의 예시이며 실제 판매 가능 여부를 판정하지 않습니다.',next:'실습 3 점포 관리표로 이동합니다.',img:(window.KAFV_IMAGE_MAP?.[34]||'assets/34.webp')},
 {num:35,part:4,title:'실습 3 · 우리 점포 관리표 작성',core:'점포의 입고·보관·진열·판매 및 공용시설 인수인계 기준을 점검하고 담당자, 기록 방법, 개선할 과제를 직접 정합니다.',question:'우리 점포에서 내일부터 바로 고칠 수 있는 품질·유통관리 절차는 무엇입니까?',answer:'기록 누락·보관구획·온도이력·표시정보 중 한 가지를 선정해 담당자와 실행 절차를 정합니다.',image:'35번 인포그래픽을 참고하여 우리 점포 관리표를 작성합니다.',deep:'실제 설비·운영상황·법적 기준은 현장점검 후 확정합니다.',case:'각 점포와 공용 냉장설비 운영주체의 책임을 구분하여 기록합니다.',caution:'교육용 예시값을 시설의 확정 기준으로 표시하지 않습니다.',next:'학습과 실습 기록을 확인합니다.',img:(window.KAFV_IMAGE_MAP?.[35]||'assets/35.webp')}
].map(x=>({...x,image:x.image||'',terms:[]}))];const terms=KB.terms, qa=KB.qa;
const $=id=>document.getElementById(id), $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const norm=t=>String(t||'').normalize('NFKC').toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
let n=1,view='theory',chatInitialized=false;
const getSlide=i=>slides.find(x=>x.num===i),termForSlide=i=>terms.filter(x=>x.slide===i), el=(tag,className,text)=>{const x=document.createElement(tag);if(className)x.className=className;if(text!==undefined)x.textContent=text;return x;};
function cutNum(i){return String(i).padStart(2,'0')}
function setView(which){if(!['theory','practice','simulator'].includes(which))which='theory';view=which;for(const section of ['theory','practice','simulator']){$(section+'-screen').hidden=(section!==which)}$('parts-nav').hidden=which!=='theory';$('theory-tab').classList.toggle('selected',which==='theory');$('practice-tab').classList.toggle('selected',which!=='theory');window.KAFV_SIM?.onView(which)}
function setSlide(i){n=Math.min(35,Math.max(1,i));const s=getSlide(n);setView('theory');$('part-name').textContent=`PART ${cutNum(s.part)} · ${L.parts[s.part-1]}`;$('lecture-title').textContent=`${cutNum(n)}컷 · ${s.title}`;$('lecture-text').textContent=s.core;
$('image-guide').textContent=s.image;
$('slide-image').src=s.img;$('slide-image').alt=`${cutNum(n)}컷 · ${s.title}`;$('slide-foot').textContent=`${cutNum(n)}컷`; $('image-title').textContent=s.title;
const chips=$('term-chips');chips.replaceChildren();for(const t of termForSlide(n)){const b=el('button','pill',t.name);b.type='button';b.title='부캉이에게 이 용어 질문하기';b.addEventListener('click',()=>{openChat();sendMessage(t.name+'이란?')});chips.appendChild(b)}
$('slide-select').value=String(n);$('slide-foot-head').textContent=`${cutNum(n)} / 35`;$('prev-slide').disabled=n===1;$('next-slide').disabled=n===35;$$('.part').forEach(x=>x.classList.toggle('active',Number(x.dataset.part)===s.part));renderSuggestions();
$('lecture-scroll').scrollTop=0;window.KAFV_SIM?.onSlide(n);
// Remember only the selected slide, not personal details.
try{localStorage.setItem('kafv_quality_v01_slide',String(n))}catch{}
}
function createNavigation(){
const container=$('slide-select');for(let i=1;i<=35;i++){const op=el('option','',cutNum(i)+' · '+getSlide(i).title);op.value=String(i);container.appendChild(op)}container.addEventListener('change',()=>setSlide(Number(container.value)));
$$('.part').forEach((b,j)=>{b.dataset.part=String(j+1);b.addEventListener('click',()=>setSlide(1+j*8))});
$('prev-slide').addEventListener('click',()=>setSlide(n-1));$('next-slide').addEventListener('click',()=>setSlide(n+1));
$('theory-tab').addEventListener('click',()=>setView('theory'));
$('practice-tab').addEventListener('click',()=>setView('simulator'));
$('slide-image').addEventListener('click',()=>openZoom());$('zoom-slide').addEventListener('click',openZoom);$('close-zoom').addEventListener('click',()=>{$('zoom-overlay').hidden=true});
$('zoom-overlay').addEventListener('click',e=>{if(e.target===$('zoom-overlay'))$('zoom-overlay').hidden=true});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('zoom-overlay').hidden=true}else if(view==='theory'&&!$('chat').classList.contains('open')&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)){if(e.key==='ArrowRight')setSlide(n===35?1:n+1);if(e.key==='ArrowLeft')setSlide(n===1?32:n-1)}});
}
function openZoom(){$('zoom-image').src=getSlide(n).img;$('zoom-image').alt=getSlide(n).title;$('zoom-overlay').hidden=false}
/* Q&A resolver. It does not synthesize unsupported facts. */
function ngrams(s,len=2){s=norm(s);return new Set(Array.from({length:Math.max(0,s.length-len+1)},(_,i)=>s.slice(i,i+len)))}
function similarity(a,b){const na=ngrams(a),nb=ngrams(b);if(!na.size||!nb.size)return 0;let k=0;for(const x of na)if(nb.has(x))k++;return 2*k/(na.size+nb.size)}
const aliasList=terms.flatMap((t,ti)=>t.aliases.map(a=>({ti,raw:a,s:norm(a)}))).filter(x=>x.s.length>=2).sort((a,b)=>b.s.length-a.s.length);
function identifyTerms(q){const nq=norm(q),hits=[];
for(const a of aliasList){if(!a.s)continue;
 // Exact alias or a clearly contained term. Avoid single-letter acronym matches.
 if(nq===a.s || (a.s.length>=2 && nq.includes(a.s))){const term=terms[a.ti];let score=(nq===a.s?120:Math.min(80,a.s.length*6))+(term.slide===n?10:0);if(!hits.some(h=>h.term.name===term.name))hits.push({term,score});}}
return hits.sort((a,b)=>b.score-a.score);
}
function shortDef(t){const eng=t.english&&!norm(t.name).includes(norm(t.english))?` (${t.english})`:'';
const d=t.definition.replace(/^\s+/,'').replace(/\s+$/,'');return `${t.name}${eng}: ${d}`;
}
function resolve(q){const nq=norm(q);if(!nq)return {answer:'용어나 질문을 입력해 주세요.',refs:[]};
const hits=identifyTerms(q);
const comparing=(nq.includes('fifo')&&nq.includes('fefo'))||(nq.includes('선입선출')&&nq.includes('기한우선'));
if(comparing)return {answer:'FIFO는 먼저 들어온 적합 재고부터, FEFO는 적용 기한이 먼저 도래하는 적합 재고부터 출고합니다. 의심·이상 상품은 먼저 판매보류해야 합니다.',refs:[13]};
// The instructor's 32 model Q&A answers. High-confidence matching only.
const ranked=qa.map(item=>({item,score:similarity(q,item.question)+(item.slide===n?0.08:0)})).sort((a,b)=>b.score-a.score);
if(ranked[0]?.score>=0.72 && (!hits.length || ranked[0].score>=0.89))return {answer:ranked[0].item.answer,refs:[ranked[0].item.slide]};
if(hits.length){const t=hits[0].term;return {answer:shortDef(t),refs:t.slide?[t.slide]:[]};}
if(ranked[0]?.score>=0.72)return {answer:ranked[0].item.answer,refs:[ranked[0].item.slide]};
return {answer:'현재 등록된 강의 용어·예상질문에서 정확한 답을 찾지 못했습니다. 용어를 짧게 입력하거나 현재 컷의 추천 질문을 선택해 주세요.',refs:[]};}
function addMessage(body,type,refs){const msg=el('div',`msg ${type}`,body);if(refs&&refs.length){const refsEl=el('div','msg-ref','관련 강의: '+[...new Set(refs)].map(cutNum).join('·')+'컷');msg.appendChild(refsEl);for(const ref of [...new Set(refs)]){if(ref<1||ref>35)continue;const b=el('button','ref-btn',`${cutNum(ref)}컷 보기`);b.type='button';b.addEventListener('click',()=>setSlide(ref));msg.appendChild(b)}}$('msgs').append(msg);$('msgs').scrollTop=$('msgs').scrollHeight;}

const bukkangiHelpTopics = [["01 이론", "오른쪽 승인 이미지를 보면서 왼쪽 강사 나레이션을 읽습니다. 왼쪽 아래 이전·다음 페이지로 이동하며, 컷 선택에서 01~32번을 바로 열 수 있습니다."], ["이 이미지 실습하기", "현장미션이 연결된 이미지에서만 녹색 단추가 표시됩니다. 누르면 02 실습의 해당 업무상황으로 이동합니다."], ["02 실습", "7개 가상 작업공간의 24개 품질·유통 미션을 수행하거나 화면 위의 33·34·35번 기록서 단추를 눌러 작성합니다. 기록서는 CSV로 저장할 수 있습니다."], ["부캉이", "흑상어 캐릭터를 눌러 노란 상담창을 열고, 용어·약어를 물어봅니다. 아이콘과 창은 이동할 수 있습니다."], ["중요 안내", "교육용 시나리오이며 실제 상품의 법적 적합 여부나 안전성을 자동 판정하지 않습니다."]];
function showBukkangiHelp(){
 const msg=el('article','msg bot help-content');
 msg.setAttribute('aria-label','부캉이 사용방법');
 msg.appendChild(el('strong','help-title','📖 부캉이 사용방법 안내'));
 for(const [topic,description] of bukkangiHelpTopics){
  const group=el('section','help-topic');
  group.appendChild(el('strong','',topic));
  group.appendChild(el('p','',description));
  msg.appendChild(group);
 }
 $('msgs').appendChild(msg);
 $('msgs').scrollTop=$('msgs').scrollHeight;
}
function sendMessage(q){const text=String(q||'').trim();if(!text)return;addMessage(text,'user');if(['도움말','사용법','사용방법','help','헬프'].includes(norm(text))){showBukkangiHelp()}else{const reply=resolve(text);addMessage(reply.answer,'bot',reply.refs)}$('ask').value='';}
function renderSuggestions(){const node=$('suggest-chips');if(!node)return;node.replaceChildren();const ts=termForSlide(n).slice(0,4);for(const t of ts){const b=el('button','pill',t.name+'?');b.type='button';b.addEventListener('click',()=>sendMessage(t.name+'이란?'));node.appendChild(b)}const s=getSlide(n);if(s?.question){const b=el('button','pill','현장 질문');b.type='button';b.title=s.question;b.addEventListener('click',()=>sendMessage(s.question));node.appendChild(b)}}
function initChat(){const fab=$('shark-fab'),chat=$('chat'),hdr=$('chat-head'),grip=$('resize-grip');
$('chat-form').addEventListener('submit',e=>{e.preventDefault();sendMessage($('ask').value);$('ask').focus()});
$('bukangi-help').addEventListener('click',()=>{showBukkangiHelp();});
$('close-chat').addEventListener('click',()=>{chat.classList.remove('open');fab.classList.remove('chat-is-open');fab.focus()});
function keepInside(node){const b=node.getBoundingClientRect();const left=Number.isFinite(parseFloat(node.style.left))?parseFloat(node.style.left):b.left,top=Number.isFinite(parseFloat(node.style.top))?parseFloat(node.style.top):b.top;node.style.left=Math.min(Math.max(6,left),Math.max(6,innerWidth-b.width-6))+'px';node.style.top=Math.min(Math.max(6,top),Math.max(6,innerHeight-b.height-6))+'px';node.style.right='auto';node.style.bottom='auto'}
function openChat(){chat.classList.add('open');fab.classList.add('chat-is-open');if(!chatInitialized){const b=fab.getBoundingClientRect(),w=Math.min(350,innerWidth-14),h=Math.min(490,innerHeight-14);chat.style.width=w+'px';chat.style.height=h+'px';chat.style.left=Math.max(6,Math.min(innerWidth-w-6,b.right-w))+'px';chat.style.top=Math.max(6,Math.min(innerHeight-h-6,b.top-h-12))+'px';chatInitialized=true}keepInside(chat);renderSuggestions();$('ask').focus()}
window.KAFV_BUKANGI={resolve,open:openChat,send:sendMessage,terms:terms.length};
// Floating round shark: pointer drag + click if stationary
let drag=null;fab.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=fab.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,ox:r.left,oy:r.top,moved:false};fab.setPointerCapture(e.pointerId);fab.classList.add('dragging');fab.classList.remove('fab-wave');e.preventDefault()});fab.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>5)drag.moved=true;if(drag.moved){fab.style.left=Math.max(4,Math.min(innerWidth-fab.offsetWidth-4,drag.ox+dx))+'px';fab.style.top=Math.max(4,Math.min(innerHeight-fab.offsetHeight-4,drag.oy+dy))+'px';fab.style.right='auto';fab.style.bottom='auto'}});fab.addEventListener('pointerup',e=>{if(!drag)return;const moved=drag.moved;drag=null;fab.classList.remove('dragging');if(!moved)openChat()});fab.addEventListener('pointercancel',()=>{drag=null;fab.classList.remove('dragging')});fab.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openChat()}});
// Movable yellow chat header, except control buttons
let paneDrag=null;hdr.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.button!==0)return;const r=chat.getBoundingClientRect();paneDrag={x:e.clientX,y:e.clientY,left:r.left,top:r.top};hdr.setPointerCapture(e.pointerId);e.preventDefault()});hdr.addEventListener('pointermove',e=>{if(!paneDrag)return;chat.style.left=(paneDrag.left+e.clientX-paneDrag.x)+'px';chat.style.top=(paneDrag.top+e.clientY-paneDrag.y)+'px';chat.style.right='auto';chat.style.bottom='auto';keepInside(chat)});hdr.addEventListener('pointerup',()=>paneDrag=null);hdr.addEventListener('pointercancel',()=>paneDrag=null);
// Optional resize grip (mobile and desktop), with an explicit reset button
let sizing=null;grip.addEventListener('pointerdown',e=>{if(e.button!==0)return;const r=chat.getBoundingClientRect();sizing={x:e.clientX,y:e.clientY,w:r.width,h:r.height};grip.setPointerCapture(e.pointerId);e.preventDefault()});grip.addEventListener('pointermove',e=>{if(!sizing)return;chat.style.width=Math.min(innerWidth-12,Math.max(Math.min(270,innerWidth-12),sizing.w+e.clientX-sizing.x))+'px';chat.style.height=Math.min(innerHeight-12,Math.max(Math.min(330,innerHeight-12),sizing.h+e.clientY-sizing.y))+'px';keepInside(chat)});grip.addEventListener('pointerup',()=>sizing=null);grip.addEventListener('pointercancel',()=>sizing=null);
window.addEventListener('resize',()=>{const b=fab.getBoundingClientRect();if(fab.style.left){fab.style.left=Math.min(innerWidth-b.width-4,Math.max(4,b.left))+'px';fab.style.top=Math.min(innerHeight-b.height-4,Math.max(4,b.top))+'px'}if(chat.classList.contains('open')){chat.style.width=Math.min(chat.offsetWidth,innerWidth-12)+'px';chat.style.height=Math.min(chat.offsetHeight,innerHeight-12)+'px';keepInside(chat)}});
}
/* Three usable field forms. Their images are supplied approved practice images, not fake in-image forms. */
const forms=[
 {num:33,title:'실습 1 · 입고검수 기록서',lead:'입고 제품의 사실을 기록하고, 수령·판매보류·후속처리 여부를 구분합니다.',fields:[['entry_time','입고일시','datetime-local'],['product','품목','text'],['lot','로트번호','text'],['supplier','거래처·공급자','text'],['origin','원산지','text'],['type','제품상태','select','선어|냉동|활어|패류|기타'],['spec','규격·거래단위','text'],['quantity','수량','text'],['temp','제품 실측온도(℃)','number'],['package','포장상태','select','정상|파손|누수|확인 필요'],['sense','관능상태','select','이상 없음|이상 의심|확인 필요'],['history','운송·취급이력','select','확인|미확인|자료 누락'],['decision','검수 결과','select','수령|판매보류|반품 등 후속판단 요청'],['action','조치·확인사항','textarea'],['person','확인자','text']]},
 {num:34,title:'실습 2 · 이상 대응서',lead:'발견 사실과 추정을 구분하고, 해당 로트의 보류·재확인·승인 과정을 기록합니다.',fields:[['detected','발견일시','datetime-local'],['place','발견 위치·설비','text'],['product','품목','text'],['lot','영향 로트','text'],['issue','관찰한 이상징후','select','온도경보|포장파손|누수|이취|해동 흔적|기타'],['airtemp','설비 표시온도(℃)','number'],['prodtemp','실제 제품온도(℃)','number'],['record','온도이력·관련 기록','textarea'],['hold','판매·출고 보류','select','보류 실시|추가 확인 중'],['action','분리·확인·후속조치','textarea'],['notify','보고·공유 대상','text'],['approval','책임자 판단·승인 상황','select','승인 대기|추가 확인|반품 등 처리 승인|근거 확인 후 판매재개 승인'],['person','담당자','text']]},
 {num:35,title:'실습 3 · 우리 점포 관리표',lead:'점포와 공동시설의 구역별 관리기준, 점검자, 개선과제를 정합니다.',fields:[['store','점포명 또는 실습팀','text'],['checked','점검일시','datetime-local'],['products','취급 상품군','text'],['storage','상품별 보관구획','textarea'],['temp','냉장·냉동·수조 관리계획','textarea'],['display','빙장·배수·진열 점검','textarea'],['inventory','재고순서 원칙','select','FIFO|FEFO|품목별 병행·선별'],['label','표시정보 점검','select','상품·원산지·상태·단위 확인|확인 필요'],['handover','공용시설·점포 인수인계','textarea'],['responsible','점포 관리담당자','text'],['improve','내일부터 실행할 한 가지 개선','textarea']]}
];
let activeForm=33;const memoryForms={};let practiceReturn={view:'simulator',slide:1};
function renderForm(num){activeForm=num;const schema=forms.find(f=>f.num===num);$('practice-title').textContent=schema.title;$('practice-lead').textContent=schema.lead;$('practice-image').src=(window.KAFV_IMAGE_MAP&&window.KAFV_IMAGE_MAP[num])||`assets/${num}.webp`;$('practice-image').alt=schema.title+' 교육자료';
$$('[data-practice]').forEach(x=>x.classList.toggle('active',Number(x.dataset.practice)===num));
const host=$('practice-fields');host.replaceChildren();let saved=memoryForms[num]||{};if(!memoryForms[num]){try{saved=JSON.parse(localStorage.getItem('kafv_quality_v01_form_'+num)||'{}')}catch{}}
for(const [key,label,type,optionStr] of schema.fields){const field=el('label','form-field');const title=el('span','form-label',label);field.appendChild(title);let input;
if(type==='textarea'){input=el('textarea');input.rows=2}else if(type==='select'){input=el('select');const op=el('option','', '선택하세요');op.value='';input.appendChild(op);for(const v of optionStr.split('|')){const o=el('option','',v);o.value=v;input.appendChild(o)}}else{input=el('input');input.type=type;if(type==='number')input.step='any'}
input.name=key;input.value=saved[key]||'';input.id='form-'+key;field.appendChild(input);host.appendChild(field)}
$('practice-notice').textContent='교육용 실습서식입니다. 실제 적용 기준과 점포 운영규정은 별도로 확인하십시오.';
}
function readForm(){const out={};for(const i of $$('#practice-fields input,#practice-fields select,#practice-fields textarea'))out[i.name]=i.value;return out}
function saveForm(){const value=readForm();memoryForms[activeForm]=value;try{localStorage.setItem('kafv_quality_v01_form_'+activeForm,JSON.stringify(value));$('practice-notice').textContent='이 기기의 브라우저에 저장했습니다. 서버로 전송하지 않습니다.'}catch{$('practice-notice').textContent='현재 창에 임시 저장했습니다. 창을 닫기 전에 CSV로 내보내세요.'}}
function downloadForm(){const schema=forms.find(f=>f.num===activeForm),value=readForm(),escape=v=>{let raw=String(v??'');if(/^[=+@\-\t\r]/.test(raw))raw="'"+raw;return '"'+raw.replaceAll('"','""')+'"'},rows=[['기록항목','기록내용'],...schema.fields.map(f=>[f[1],value[f[0]]||''])];const csv='\ufeff'+rows.map(r=>r.map(escape).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob),a=el('a');a.href=u;a.download='KAFV_실습'+activeForm+'_기록서.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function initForms(){const btns=$('practice-switch');for(const f of forms){const b=el('button','practice-tab',f.title);b.dataset.practice=String(f.num);b.addEventListener('click',()=>renderForm(f.num));btns.appendChild(b)}$('practice-save').addEventListener('click',saveForm);$('practice-download').addEventListener('click',downloadForm);$('practice-reset').addEventListener('click',()=>{if(!confirm('현재 서식을 초기화할까요?'))return;delete memoryForms[activeForm];try{localStorage.removeItem('kafv_quality_v01_form_'+activeForm)}catch{}renderForm(activeForm)});$('practice-back').addEventListener('click',()=>{if(practiceReturn.view==='theory')setSlide(practiceReturn.slide);else setView('simulator')});renderForm(33)}
window.KAFV_APP={setView,setSlide,getSlide,getSlideNum:()=>n,openChat:()=>window.KAFV_BUKANGI?.open(),openPractice:(num,seed={})=>{if(num>=33&&num<=35){if(view!=='practice')practiceReturn={view,slide:n};$('practice-back').textContent=practiceReturn.view==='theory'?'← 원래 이론 페이지로':'← 공간형 게임으로';if(seed&&Object.keys(seed).length){let prior=memoryForms[num];if(!prior){try{prior=JSON.parse(localStorage.getItem('kafv_quality_v01_form_'+num)||'{}')}catch{prior={}}}memoryForms[num]={...(prior||{}),...seed}}renderForm(num);setView('practice')}}};createNavigation();initChat();initForms();let remembered=1;try{remembered=Number(localStorage.getItem('kafv_quality_v01_slide'))||1}catch{};setSlide(remembered);
})();
