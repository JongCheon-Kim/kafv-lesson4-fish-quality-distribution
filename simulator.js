(()=>{'use strict';
const $=id=>document.getElementById(id);
const q=(sel,el=document)=>Array.from(el.querySelectorAll(sel));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const sceneUrl=id=>window.KAFV_SCENE_MAP?.[id]||'scene/'+id+'.webp';
const thumbUrl=id=>window.KAFV_SCENE_THUMB?.[id]||'scene/'+id+'_thumb.webp';
const cutUrl=n=>window.KAFV_IMAGE_MAP?.[n]||'assets/'+pad(n)+'.webp';
const taskThumb=id=>window.KAFV_MISSION_THUMBS?.[id]||'scene/mission_'+id+'.webp';
const rooms=[
 {id:'receiving',name:'입고·검수장',icon:'🚚',subtitle:'하역·온도·상품 검수',desc:'실측온도와 거래증빙을 확인하고, 이상 로트를 보류합니다.',image:'scene/receiving.webp'},
 {id:'lab',name:'선도·품질평가실',icon:'🔬',subtitle:'관능·성적서·QIM',desc:'눈으로 확인한 정보와 검사자료의 의미를 함께 판단합니다.',image:'scene/lab.webp'},
 {id:'cold',name:'냉장·냉동창고',icon:'❄️',subtitle:'저온·구획·재고이력',desc:'품종별 보관, FEFO, 온도이력을 관리합니다.',image:'scene/cold.webp'},
 {id:'display',name:'진열·판매점포',icon:'🐟',subtitle:'빙장·냉기·표시',desc:'진열품의 상태와 판매표시를 함께 확인합니다.',image:'scene/display.webp'},
 {id:'dispatch',name:'포장·출고실',icon:'📦',subtitle:'보냉·밀봉·인계',desc:'보냉포장의 역할과 상품별 포장조건을 점검합니다.',image:'scene/dispatch.webp'},
 {id:'outdoor',name:'외부·운송차량',icon:'🚛',subtitle:'상차·운송·고객 인도',desc:'냉장차부터 최종 인도까지 저온유통 연결을 관리합니다.',image:'scene/outdoor.webp'},
 {id:'office',name:'관제·관리기록실',icon:'📊',subtitle:'경보·보류·서식 33~35',desc:'상황별 대응과 점포·공용시설의 책임을 기록합니다.',image:'scene/office.webp'}
];
const missions=[
 {id:'L1',room:'lab',part:1,cut:6,title:'겉모습이 좋으면 안전할까?',icon:'👀',x:29,y:58,lead:'선어가 윤기 있고 냄새도 심하지 않습니다. 그러나 운송 중 온도기록이 누락되었습니다.',q:'가장 적절한 다음 행동은?',choices:['외관만으로 안전하다고 확정하고 판매한다.','외관은 참고하되 온도·이력과 필요한 위해 확인 전까지 판단을 보류한다.','품질이 좋아 보이므로 가격만 높여 판매한다.'],correct:1,explain:'관능상 선도와 위해에 대한 안전성은 다릅니다. 제품이력을 확인하지 않은 상태에서 안전성을 보증할 수 없습니다.',act:'제품정보와 기록의 누락사유를 확인하고 해당 로트의 판단을 보류합니다.'},
 {id:'L2',room:'lab',part:1,cut:5,title:'K값·VBN 검사결과 읽기',icon:'🧪',x:53,y:40,lead:'두 어종의 K값과 VBN(휘발성염기질소) 결과를 받았습니다. 시험법과 제품 특성은 서로 다릅니다.',q:'어떤 해석이 적절합니까?',choices:['모든 어종에 한 가지 수치로 동일한 판매가능 기간을 부여한다.','K값 하나로 미생물 위해와 안전성을 최종 판단한다.','시험조건·품목별 기준을 확인하고 관능·온도·이력정보를 함께 검토한다.'],correct:2,explain:'K값은 ATP 분해에 따른 선도 관련 지표, VBN은 휘발성 염기질소 지표입니다. 단독 수치로 모든 제품의 식품안전을 확정할 수 없습니다.',act:'성적서의 품목·시험항목·단위·적용기준을 대조한 뒤 기록합니다.'},
 {id:'L3',room:'lab',part:1,cut:8,title:'QIM 관찰기록 표준화',icon:'📝',x:72,y:63,lead:'현장 담당자가 청어와 냉동 필렛에 똑같은 눈·아가미 관찰표를 사용하려고 합니다.',q:'어떤 기록 방식이 맞습니까?',choices:['상품 형태·어종에 맞는 관찰항목을 나누고, 같은 상품군 안에서 일관된 기준으로 기록한다.','모든 수산물은 눈·아가미 점수로만 평가한다.','관찰자마다 기준을 달리하고 기억으로만 남긴다.'],correct:0,explain:'QIM(Quality Index Method)은 품종별 관능결점 항목과 척도가 다릅니다. 냉동 필렛에는 원형 어류와 동일한 검사항목을 그대로 적용하기 어렵습니다.',act:'품목군별 점검항목을 선택해 관찰한 사실과 평가결과를 구분하여 적습니다.'},
 {id:'R1',room:'receiving',part:2,cut:9,title:'입고검수 다섯 가지 확인',icon:'📋',x:28,y:60,lead:'새벽 차량이 선어를 납품합니다. 납품서에는 품명과 수량만 있고 제품온도 확인 기록이 없습니다.',q:'입고 담당자가 해야 할 일은?',choices:['차량 내부 온도계만 확인하고 제품온도는 생략한다.','품목·원산지/규격·수량·포장·제품온도·이력 등을 확인하고 기록한다.','입고가 바쁘면 확인하지 않고 바로 진열한다.'],correct:1,explain:'입고 시 실제 제품온도, 거래정보, 외관·포장, 운송 이력을 함께 확인해야 합니다. 차량 설정온도가 제품상태를 대신하지 않습니다.',act:'실제 입고기록의 빈칸을 확인하고 미확인 사항은 담당자에게 알립니다.',form:33},
 {id:'R2',room:'receiving',part:2,cut:11,title:'주문상품·규격 불일치',icon:'⚖️',x:53,y:40,lead:'주문서는 국내산 선어 10kg 규격인데 입고품의 포장표시는 냉동 8kg으로 되어 있습니다.',q:'가장 합리적인 조치는?',choices:['동일 품목이라면 규격·상태 차이를 무시하고 수령한다.','구두로만 확인하고 발주서 내용을 삭제한다.','입고품을 분리하고 주문·표시·거래명세를 대조하여 확인 전 수령판정을 보류한다.'],correct:2,explain:'같은 어종이라도 냉장/냉동 상태, 규격, 중량, 원산지 및 거래단위가 달라지면 거래품질과 가격기준이 달라집니다.',act:'불일치 항목을 입고검수서에 남기고 공급업체와 확인합니다.',form:33},
 {id:'R3',room:'receiving',part:2,cut:10,title:'입고판정: 수령·보류·후속처리',icon:'⛔',x:75,y:66,lead:'상자 일부가 파손됐고 이취 여부가 의심되며 운송 이력도 미확인입니다.',q:'이 상황에서 먼저 실행할 원칙은?',choices:['의심 로트를 다른 적합 제품과 분리하고 판매보류·재확인 후 책임자 판단을 받는다.','가격을 낮추어 의심품을 먼저 판매한다.','냉장고에 잠시 넣으면 문제는 자동 해결된다.'],correct:0,explain:'판단정보가 부족하거나 이상 징후가 있으면 먼저 분리·보류하고 근거를 확인해야 합니다. 할인판매가 안전관리 조치가 될 수는 없습니다.',act:'보류 사유·발견 시점·로트·확인자·추가 조치를 기록합니다.',form:33},
 {id:'C1',room:'cold',part:2,cut:12,title:'상품별 보관구획 나누기',icon:'🧊',x:28,y:56,lead:'한 보관실에 선어·냉동 필렛·활패류가 입고되었습니다. 설비구획을 정해야 합니다.',q:'어떤 구성이 타당합니까?',choices:['편의를 위해 모두 같은 물탱크에 보관한다.','냉장·냉동·활어/활패류 특성에 따라 수온·산소·온도·오염예방을 나눠 설계한다.','다른 상품이더라도 가장 낮은 온도로 전부 동일하게 보관한다.'],correct:1,explain:'선어, 냉동품, 활어·활패류는 적절한 저장조건이 다릅니다. 활어·활패류는 온도 외에도 산소와 수질 관리가 중요합니다.',act:'상품군별 보관구획·책임자·점검항목을 관리표에 작성합니다.',form:35},
 {id:'C2',room:'cold',part:2,cut:13,title:'FIFO와 FEFO의 차이',icon:'📆',x:52,y:43,lead:'같은 상품군의 적합한 재고 A는 먼저 입고됐지만, 재고 B는 적용 기한이 더 먼저 도래합니다.',q:'기한 정보가 있는 적합 재고의 출고 우선순위를 정하려면?',choices:['입고시점만 확인하므로 언제나 A를 출고한다.','두 상자를 섞어 하나의 새 로트로 만든다.','FEFO 원칙에 따라 기한이 빠른 B를 우선하되, 이상 재고는 먼저 판매보류한다.'],correct:2,explain:'FIFO는 선입선출, FEFO는 선기한선출입니다. 적용기한이 있는 적합 재고에서는 FEFO가 유용하지만 의심·이상 제품은 순환대상에서 제외해야 합니다.',act:'입고일·적용 기한·로트·보류상태를 함께 확인합니다.',form:35},
 {id:'C3',room:'cold',part:3,cut:17,title:'법정 온도와 품질목표 구별',icon:'🌡️',x:75,y:62,lead:'한 교육자료에 냉장 0~10℃, 신선 어류는 0℃ 가까이, 소매 냉장 수산물 4℃ 이하가 함께 표시됩니다.',q:'이 세 수치의 관계를 어떻게 설명합니까?',choices:['국내 일반 보존·유통 기준, 국제 기술권고, 상품별 운영목표는 성격이 달라 구분한다.','4℃가 모든 수산물에 적용되는 국내 일률 법정 기준이다.','온도기록이 있으면 품목별 별도 기준은 볼 필요 없다.'],correct:0,explain:'자료상 국내 식품공전 일반 냉장 0~10℃·냉동 −18℃ 이하와 Codex의 더 엄격한 품질유지 권고를 구별해야 하며, 품목별 별도 규정이 우선입니다.',act:'법령·고시, 국제권고, 내부 운영목표를 점검표에 별도로 표시합니다.'},
 {id:'D1',room:'display',part:2,cut:14,title:'빙장대의 얼음과 배수',icon:'💧',x:31,y:61,lead:'얼음 위에 놓인 선어의 아래쪽에 녹은 물이 고여 있습니다.',q:'어떤 작업이 맞습니까?',choices:['녹은 물을 남겨 두면 제품이 더 오래 신선하다.','얼음을 충분히 보충하고 녹은 물이 배수되어 제품에 계속 접촉하지 않도록 한다.','물기를 닦기보다 제품을 더 많이 겹쳐 둔다.'],correct:1,explain:'빙장은 저온 유지와 적절한 배수가 함께 중요합니다. 오염된 얼음물이나 드립의 재접촉을 피하도록 설비·청소상태를 점검합니다.',act:'배수구 막힘과 얼음 상태를 확인하고 점검표에 기록합니다.',form:35},
 {id:'D2',room:'display',part:2,cut:15,title:'진열대 적재와 냉기 흐름',icon:'🌀',x:54,y:40,lead:'냉장 진열대의 냉기 토출구 위로 어상자를 높이 쌓았습니다.',q:'상품 품질을 지키기 위한 조치는?',choices:['다른 상자를 더 쌓아 외부공기를 차단한다.','설비 표시온도만 정상이라면 과적재는 무관하다.','적재한계와 냉기순환을 확보하고 제품온도·진열시간을 점검한다.'],correct:2,explain:'과적재는 냉기 흐름을 막아 진열대 내부 온도 편차를 유발할 수 있습니다. 설비 공기온도와 제품온도를 함께 확인해야 합니다.',act:'과적재 구역을 조정하고 온도 편차·보충시간을 기록합니다.',form:35},
 {id:'D3',room:'display',part:2,cut:16,title:'판매 직전 상품정보 검증',icon:'🏷️',x:78,y:63,lead:'판매대 가격표에는 ‘고등어 1마리’라고만 적혀 있고 원산지와 냉동·해동 상태가 빠져 있습니다.',q:'구매자의 판단을 돕는 정보표시는?',choices:['품명·원산지·상태·규격·수량 또는 중량·가격단위를 함께 확인한다.','가격만 크게 표시하고 나머지는 질문하면 알려준다.','냉동·해동 상태는 구두로만 관리한다.'],correct:0,explain:'같은 어종이라도 원산지, 제품상태, 규격, 중량·마릿수와 가격단위에 따라 상품가치가 달라집니다. 현행 표시의무는 품목·영업유형별로 확인합니다.',act:'판매표시와 거래명세의 일치 여부를 재검수합니다.',form:35},
 {id:'P1',room:'dispatch',part:4,cut:25,title:'보냉포장의 구성과 역할',icon:'🧰',x:30,y:59,lead:'배송할 냉장 수산물을 포장하고 있습니다. 외부 충격과 온도상승·누수 위험이 있습니다.',q:'바람직한 포장 설계는?',choices:['상자 겉면 디자인만 화려하게 만든다.','상품 특성에 맞게 보냉재·단열·밀봉·누수방지·고정요소를 조합하고 검증한다.','얼음만 많이 넣으면 배송시간과 관계없이 안전이 보장된다.'],correct:1,explain:'포장재별 역할이 다르며 포장은 저온유통을 보조하는 수단입니다. 실제 배송조건에서 제품온도·유지시간과 포장상태를 확인해야 합니다.',act:'보냉재 위치·포장 누수·완충·인계 기준을 확인합니다.'},
 {id:'P2',room:'dispatch',part:4,cut:26,title:'진공·MAP 포장과 저온 유지',icon:'🫧',x:53,y:41,lead:'판매자가 진공포장 또는 MAP(가스치환포장)를 적용하면 냉장관리 없이 장시간 안전하다고 설명합니다.',q:'이 설명에 대한 올바른 대응은?',choices:['진공포장은 모든 부패균과 위해를 즉시 없앤다.','가스치환포장은 제품온도와 관계가 없다.','포장은 일부 품질변화를 늦출 수 있으나 제품별 위해관리와 저온유통은 계속 필요하다.'],correct:2,explain:'진공·MAP는 품질유지 기술이며 식품안전 자체를 보증하는 수단이 아닙니다. 제품유형과 포장방식에 따른 별도 위해요소를 검토해야 합니다.',act:'포장방식, 표시, 보관조건, 배송시간을 검토합니다.'},
 {id:'P3',room:'outdoor',part:4,cut:27,title:'차량에서 고객 인도까지',icon:'🚛',x:77,y:64,lead:'냉장 수산물을 포장한 뒤 배송차량의 출발이 지연되고, 인도 예정 시각도 바뀌었습니다.',q:'현장 담당자의 우선 조치는?',choices:['실제 제품온도·대기시간·보냉조건과 인계기록을 확인하고 필요한 조치를 취한다.','출발만 하면 문제가 없어지므로 기록하지 않는다.','고객에게 온도정보 대신 할인만 안내한다.'],correct:0,explain:'포장부터 차량 상·하차, 대기, 인도까지 저온관리 연결이 끊길 수 있습니다. 연속 기록과 책임 있는 인계가 중요합니다.',act:'출발·도착 시각, 온도이력 및 이상 시 보고사항을 기록합니다.'},
 {id:'O1',room:'office',part:3,cut:22,title:'순간온도와 온도이력',icon:'📈',x:28,y:58,lead:'교육용 그래프에서 냉장설비 온도가 08:00 2℃, 10:00 8℃, 11:00 3℃로 기록됐습니다.',q:'11:00의 3℃ 수치 하나로 무엇을 알 수 있습니까?',choices:['현재 수치가 낮으니 과거 온도이탈이 없었다고 확정한다.','기록된 상승구간의 시간·원인·제품온도를 추가 확인해야 한다.','온도 그래프 대신 장비의 설정값만 확인한다.'],correct:1,explain:'현재 온도와 과거 온도이력은 다릅니다. 본 예시의 숫자는 교육용 가상값이며 실제 제품 안전성 판정값이 아닙니다.',act:'상승 시각·지속시간·제품 상태·조치기록을 확인합니다.',form:34},
 {id:'O2',room:'office',part:3,cut:23,title:'히스타민 위해 예방',icon:'⚠️',x:52,y:39,lead:'고등어 로트가 상온에 오래 노출된 기록이 확인되었습니다. 이후 다시 냉동 보관했습니다.',q:'이 로트의 취급 원칙은?',choices:['재냉동만 하면 이미 만들어진 히스타민이 없어졌다고 본다.','가열하면 히스타민이 완전히 제거되므로 그대로 판매한다.','판매를 보류하고 온도이력·품목별 위해를 확인한 뒤 근거 있는 후속 판단을 한다.'],correct:2,explain:'일부 어종의 히스타민은 생성 후 냉동이나 일반적인 가열로 제거되지 않습니다. 예방적 시간·온도관리와 기록이 중요합니다.',act:'관련 로트를 격리하고 담당자에게 보고하며 적절한 확인절차를 진행합니다.',form:34},
 {id:'C4',room:'cold',part:3,cut:19,title:'빙결정과 해동 드립 확인',icon:'🧬',x:36,y:80,lead:'교육용 비교실험에서 냉동 저장 중 온도가 여러 번 변한 필렛이 해동 후 많은 드립을 보였습니다.',q:'관찰 결과를 어떻게 해석하는 것이 적절합니까?',choices:['드립이 있으므로 모든 식중독균이 제거된 것이다.','냉동했다가 해동하면 조직손상은 저절로 회복된다.','온도변동·빙결정 재결정화·조직손상 가능성을 검토하고 제품상태·온도이력을 함께 기록한다.'],correct:2,explain:'냉동품도 온도변동에 따른 재결정화·수분이동·산화 등으로 품질이 변할 수 있습니다. 드립만으로 위해나 안전성을 단정하지 않습니다.',act:'해동 전후 상태·시간·제품온도·드립을 함께 기록하고 이상 의심 로트는 보류합니다.',form:34},
 {id:'C5',room:'cold',part:3,cut:20,title:'해동은 관리공정입니다',icon:'⏱️',x:83,y:29,lead:'냉동 연어를 해동하여 판매용으로 전환하려고 합니다. 해동 시작 시각과 제품 상태기록이 없습니다.',q:'가장 먼저 보완할 절차는?',choices:['해동한 제품을 아무 표시 없이 신선 선어로 전환한다.','해당 제품의 적용기준을 확인하고 해동 조건·시간·온도·표시·이력을 관리한다.','얼음이 다 녹았으면 검사와 기록은 생략해도 된다.'],correct:1,explain:'해동은 단순 대기가 아닌 온도·시간·표시가 연계된 관리공정입니다. 제품별 별도 기준과 재냉동·표시 규정은 현행 적용법규로 확인해야 합니다.',act:'해동 시작·완료 시각과 제품온도, 판매상태·담당자를 기록합니다.',form:35},
 {id:'P4',room:'outdoor',part:3,cut:21,title:'콜드체인의 약한 연결',icon:'🔗',x:21,y:28,lead:'냉장 차량이 정상 운행됐지만 상차 전 대기와 고객 인도 대기구간의 온도기록이 누락돼 있습니다.',q:'어떤 개선이 적절합니까?',choices:['생산·상차·운송·인도 전 구간의 기록을 연결하고 취약한 인계 지점을 우선 점검한다.','차량 온도센서가 있으면 상차·인도구간은 확인할 필요가 없다.','냉장차가 한 번 운행되면 콜드체인이 자동으로 완성된다.'],correct:0,explain:'콜드체인은 단일 냉장설비가 아니라 모든 인계지점에서 저온이 연속 유지되는 과정입니다. 평균온도만으로 이탈이력을 대체할 수 없습니다.',act:'대기 시작·종료 시각과 담당자, 제품상태 확인기록을 연결합니다.'},
 {id:'P5',room:'dispatch',part:4,cut:28,title:'기업사례를 장목에 적용하기',icon:'🔄',x:76,y:26,lead:'컬리 공개자료의 풀콜드체인 운영원리를 장목의 소규모 점포·공동시설에 적용하려 합니다.',q:'제도와 설비를 확인하기 전 가장 합리적인 실행은?',choices:['기업 설비·운영방식을 모두 동일하게 구매한다.','사례의 운영방식을 장목의 확정 운영규정이라고 표시한다.','기록표·역할분담·점검주기부터 시험 적용하고 실측·규모에 맞춰 고도화한다.'],correct:2,explain:'기업 공개사례는 벤치마킹 자료이지 장목시설의 실측 성능이나 확정 운영조건이 아닙니다. 현장 규모와 비용·책임구조를 검토해야 합니다.',act:'우선순위·책임·기록항목·개선지표를 관리표에 제안합니다.',form:35},
 {id:'O4',room:'office',part:4,cut:29,title:'이상징후: 사실과 추정 분리',icon:'✍️',x:24,y:83,lead:'담당자가 “어제 냉장고가 고장 나서 고등어가 상했을 것”이라고 말하지만 실제 센서기록을 아직 보지 못했습니다.',q:'올바른 사고·품질기록 방법은?',choices:['확인된 경보시각·제품 상태·영향로트를 먼저 기록하고 원인추정은 별도 칸에 남긴다.','원인이 불확실해도 고장이라고 단정하고 기록을 닫는다.','구두로 전달했으므로 로트나 사진은 남기지 않는다.'],correct:0,explain:'실제로 관찰한 사실, 확인된 데이터, 가능한 원인에 대한 추론을 구분해야 책임자 판단과 이후 재검증이 가능합니다.',act:'발견자·시각·위치·상품·온도이력·초기 조치를 기록합니다.',form:34},
 {id:'O5',room:'office',part:4,cut:32,title:'로트기록에서 고객신뢰로',icon:'🧾',x:83,y:28,lead:'고객이 구매한 수산물의 원산지·상태·보관·인도 과정에 대해 문의했습니다.',q:'점포와 운영주체가 제공할 설명의 근거는?',choices:['담당자 기억만으로 단정하고 상세 기록을 생략한다.','상품명·원산지·상태·로트·입고·온도·판매·인계 기록을 확인해 사실에 근거해 설명한다.','판매 후 상품은 더 이상 점포의 기록과 무관하다.'],correct:1,explain:'기록은 오류 대응뿐 아니라 고객에게 설명할 수 있는 근거입니다. 다만 민감한 거래정보는 공개범위를 구분해야 합니다.',act:'기록의 일관성과 점포·공용시설의 인계 관계를 검토합니다.',form:35},
 {id:'O3',room:'office',part:4,cut:30,title:'이상대응과 공용시설 책임',icon:'🧭',x:76,y:63,lead:'공용 냉장설비에서 경보가 발생해 여러 점포의 상품이 영향을 받았을 수 있습니다.',q:'점포와 운영법인이 협력할 적절한 흐름은?',choices:['영향 로트 판매보류 → 설비·제품 확인 → 점포/운영주체 공유 → 조치·승인 기록', '점포마다 임의로 정상이라고 정한 뒤 다음 날 기록', '공용시설 담당자가 고장만 수리하면 상품상태 확인은 생략'],correct:0,explain:'이상 대응은 설비 조치로 끝나지 않습니다. 점포의 상품판정 책임과 공용설비 운영자의 관리책임을 구분하고 연결해야 합니다.',act:'발견시각·영향범위·로트·담당자·처리결과를 이상 대응서에 남깁니다.',form:34}
];
const rid=id=>rooms.find(r=>r.id===id),mid=id=>missions.find(m=>m.id===id);
const STORE='kafv_quality_sim_v02';
const memStore={};const settingGet=k=>{try{return localStorage.getItem(k)}catch{return memStore[k]||null}};const settingSet=(k,v)=>{try{localStorage.setItem(k,String(v))}catch{memStore[k]=String(v)}};
function load(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return {}}}
const old=load();let done=new Set(Array.isArray(old.done)?old.done.filter(x=>!!mid(x)):[]);let logs=Array.isArray(old.logs)?old.logs.filter(Boolean):[];
const state={room:'receiving',active:null,choice:null,storyOpen:false,pipOpen:false,lastLecture:1,actorX:13,actorY:79,actorScale:1.0,coldDepth:'outer',coldFocus:null,coldBusy:false};
const audio={on:settingGet('kafv_q4_audio_on')!=='0',volume:Math.min(1,Math.max(0,+(settingGet('kafv_q4_audio_vol')||'.55')))};
function save(){try{localStorage.setItem(STORE,JSON.stringify({done:[...done],logs}))}catch{}}
// Auditable audio engine: resume on direct user gesture, decode cache and media fallback.
let audioCtx=null;const decodedClips=new Map();const soundLog=[];
const SOUND_GAIN={temp_alarm:.68,alarm:.68,footstep:1,steps_path:.95,truck_idle:.7,cold_room:.7,probe_scan:.75};
function audioNote(msg,error=false){const t=$('sim-audio-state');if(t){t.textContent=msg;t.dataset.error=error?'1':'0'};soundLog.push({at:Date.now(),msg});if(soundLog.length>90)soundLog.shift()}
function audioSource(name){return window.KAFV_FOLEY_MAP?.[name]||'foley/'+name+'.wav'}
function getAudioContext(){if(!audioCtx){const Cls=window.AudioContext||window.webkitAudioContext;if(!Cls)return null;audioCtx=new Cls();window.KAFV_AUDIO_CTX=audioCtx;}if(audioCtx.state==='suspended')audioCtx.resume().catch(e=>audioNote('소리 재생 허용이 필요합니다: '+e.name,true));return audioCtx;}
function decodeWav(name){if(decodedClips.has(name))return decodedClips.get(name);const ctx=getAudioContext();if(!ctx)return Promise.reject(Error('AudioContext unavailable'));const url=audioSource(name);
const p=(async()=>{let bytes;if(url.startsWith('data:')){const b64=url.substring(url.indexOf(',')+1),text=atob(b64),u8=new Uint8Array(text.length);for(let i=0;i<text.length;i++)u8[i]=text.charCodeAt(i);bytes=u8.buffer;}else{const res=await fetch(url);if(!res.ok)throw Error('HTTP '+res.status);bytes=await res.arrayBuffer();}return await ctx.decodeAudioData(bytes.slice(0));})();decodedClips.set(name,p);p.catch(()=>decodedClips.delete(name));return p;}
function mediaFallback(name){const a=new Audio(audioSource(name));a.volume=Math.min(1,audio.volume*(SOUND_GAIN[name]||.86));a.play().then(()=>audioNote('재생: '+name+' (미디어)')).catch(e=>audioNote('재생 실패: '+name+' ('+e.name+')',true));a.addEventListener('ended',()=>{a.removeAttribute('src');a.load()},{once:true})}
function sound(name){if(!audio.on||audio.volume<=0)return;const ctx=getAudioContext();if(!ctx){mediaFallback(name);return}decodeWav(name).then(buffer=>{const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=buffer;gain.gain.value=Math.min(1,audio.volume*(SOUND_GAIN[name]||.86));source.connect(gain);gain.connect(ctx.destination);source.start();audioNote('재생: '+name)}).catch(()=>mediaFallback(name));}
window.KAFV_SOUND_DEBUG={events:soundLog,test:(name='truck_idle')=>sound(name),getContext:()=>audioCtx};
function beep(kind='scan') {if(!audio.on||!audio.volume)return;try{let ctx=window.KAFV_AUDIO_CTX;if(!ctx){ctx=new (window.AudioContext||window.webkitAudioContext)();window.KAFV_AUDIO_CTX=ctx;}if(ctx.state==='suspended')ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind==='alarm'?'triangle':'sine';const now=ctx.currentTime;osc.frequency.setValueAtTime(kind==='alarm'?440:720,now);osc.frequency.exponentialRampToValueAtTime(kind==='alarm'?330:980,now+.2);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.055*audio.volume,now+.015);gain.gain.exponentialRampToValueAtTime(.0001,now+.25);osc.connect(gain);gain.connect(ctx.destination);osc.start(now);osc.stop(now+.27)}catch{}}

// Original in-app 2-/3-tone acknowledgement; deliberately distinct from physical Foley.
function feedbackTone(correct){
 if(!audio.on||audio.volume<=0)return;
 const ctx=getAudioContext();if(!ctx)return;
 const now=ctx.currentTime+.018;const notes=correct?[659.25,783.99,1046.50]:[523.25,392.00];
 notes.forEach((hz,i)=>{const t=now+i*.155;const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(audio.volume*.11,t+.025);gain.gain.exponentialRampToValueAtTime(.0001,t+.38);osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.40)});
 audioNote(correct?'정답: 딩동댕':'재확인: 딩동');
}

const roomSounds={lab:'paper_flip',receiving:'unload',cold:'cold_room',display:'aquarium',dispatch:'crate_slide',outdoor:'truck_idle',office:'paper_pen'};
// v0.4.2 photographed-object hit regions; percentages mapped to the supplied crop's real objects.
// [center x,center y,width,height] -- selection is available from both left card and image region.
const PHOTO_OBJECTS={
 R1:[19,32,18,29],R2:[89,36,19,23],R3:[47,66,31,29],
 L1:[15,52,24,40],L2:[46,44,39,54],L3:[90,30,19,29],
 C1:[30,27,42,32],C2:[79,27,31,42],C3:[84,10,28,20],C4:[36,48,22,28],C5:[24,76,40,40],
 D1:[71,86,26,19],D2:[52,26,48,35],D3:[84,41,24,24],
 P1:[25,33,35,32],P2:[50,56,29,24],P3:[80,67,28,28],
 P4:[24,30,35,35],P5:[80,40,30,31],
 O1:[24,33,36,38],O2:[60,41,30,35],O3:[82,70,30,32],O4:[27,70,36,25],O5:[79,23,32,29]
};
/* v0.4.5: each lab prop has a manually mapped photographic contour.
   Explicit SVG paths are pixel coordinates in the ORIGINAL 1672×941 photo, not bounding rectangles.
   Never infer a mask by stretching a generic rectangle over an arbitrary scene. */
const LAB_OBJECTS=[
 {id:'fish',name:'선어 외관 확인',mission:'L1',label:[18,77],to:[28,85],path:'M91 735 Q102 713 153 687 L439 610 Q492 600 538 620 L558 642 Q534 657 473 674 L229 761 Q138 792 100 761 Z'},
 {id:'fillets',name:'필렛 상태 확인',mission:'L1',label:[53,66],to:[59,86],path:'M684 659 L895 605 Q938 606 959 639 L1019 711 Q997 739 931 739 L774 779 L667 729 Z'},
 {id:'probe',name:'제품온도계',mission:'L2',label:[33,73],to:[39,90],path:'M493 824 L519 803 L540 746 Q557 724 568 714 L604 703 Q629 706 638 730 Q624 749 605 775 L559 829 L522 839 Z'},
 {id:'microscope',name:'검사 현미경',mission:'L2',label:[87,32],to:[90,56],path:'M1502 280 L1526 284 L1546 323 L1578 344 L1581 369 L1553 384 L1540 409 L1555 447 L1538 487 L1487 491 L1474 465 L1444 439 L1440 392 L1459 370 L1456 339 Z'},
 {id:'colorchart',name:'관능 색도표',mission:'L3',label:[57,32],to:[59,50],path:'M896 349 L1002 326 L1008 393 L891 426 L879 409 Z'},
 {id:'clipboard',name:'관찰기록표',mission:'L3',label:[88,61],to:[86,79],path:'M1408 547 L1621 598 L1555 699 L1291 651 L1300 615 Z'},
 {id:'chiller',name:'시료 보관 냉장고',mission:'L3',label:[25,18],to:[34,54],path:'M243 121 L281 116 L588 142 L584 462 L264 465 L245 445 Z'}
];

/* v0.4.6 full-room integration: 1·4·5·6·7 use independent 1672×941 game assets.
   Each path is traced around a photographed object, not a rectangular hitbox.
   'to' anchors the paper worker at the object's service/approach position. */
const ROOM_OBJECTS={
 receiving:[
 {id:'r-temperature',mission:'R1',name:'제품온도·입고상태 검사',label:[56,76],to:[54,82],path:'M335 640 L422 595 L1088 565 L1140 623 L1109 805 L1065 833 L473 864 L346 811 Z'},
 {id:'r-weight',mission:'R2',name:'저울·규격 확인',label:[66,55],to:[67,70],path:'M941 518 L1035 463 L1157 470 L1237 544 L1227 588 L1122 614 L992 607 L927 571 Z'},
 {id:'r-hold',mission:'R3',name:'보류 상자 분리',label:[90,77],to:[86,89],path:'M1302 680 L1598 658 L1670 706 L1670 926 L1342 931 L1304 872 Z'},
 ],
 display:[
 {id:'d-drain',mission:'D1',name:'빙장대·얼음·배수 확인',label:[61,74],to:[61,84],path:'M520 506 L639 426 L1200 419 L1408 496 L1371 743 L1289 786 L536 796 L510 739 Z'},
 {id:'d-cooling',mission:'D2',name:'냉장 쇼케이스·냉기순환',label:[22,52],to:[29,76],path:'M0 331 L71 316 L309 346 L466 411 L479 577 L429 706 L15 720 L0 676 Z'},
 {id:'d-marking',mission:'D3',name:'가격·중량·상품정보 확인',label:[89,39],to:[85,66],path:'M1350 295 L1390 259 L1551 263 L1589 320 L1568 388 L1554 496 L1447 505 L1367 463 Z'},
 ],
 dispatch:[
 {id:'p-cooler',mission:'P1',name:'단열상자·보냉재 구성',label:[17,66],to:[31,85],path:'M1 440 L181 386 L506 425 L588 515 L599 826 L471 906 L24 933 L0 864 Z'},
 {id:'p-vacuum',mission:'P2',name:'진공 포장기 · 밀봉 상태',label:[75,43],to:[77,69],path:'M1078 276 L1182 230 L1335 247 L1392 341 L1395 475 L1307 591 L1026 581 L1008 463 Z'},
 {id:'p-logging',mission:'P5',name:'포장·인계 점검표',label:[75,74],to:[77,84],path:'M1147 648 L1329 625 L1439 736 L1366 810 L1175 800 Z'},
 ],
 outdoor:[
 {id:'o-transport',mission:'P3',name:'차량·운송기록 확인',label:[88,73],to:[83,87],path:'M1199 684 L1316 577 L1457 603 L1539 728 L1500 842 L1330 869 L1209 834 Z'},
 {id:'o-loading',mission:'P4',name:'저온 상차·인계구간',label:[53,38],to:[61,72],path:'M495 28 L772 16 L1198 52 L1273 103 L1255 548 L1131 597 L552 597 L497 536 Z'},
 ],
 office:[
 {id:'o-history',mission:'O1',name:'온도이력 그래프',label:[18,28],to:[29,54],path:'M67 24 L364 54 L365 235 L69 232 Z M362 58 L666 95 L661 259 L362 235 Z'},
 {id:'o-histamine',mission:'O2',name:'경보·보류 확인',label:[45,35],to:[47,65],path:'M713 227 L769 231 L771 522 L688 531 L683 254 Z'},
 {id:'o-joint',mission:'O3',name:'이상대응·공용시설 책임',label:[88,72],to:[81,85],path:'M1293 579 L1541 542 L1608 613 L1548 847 L1290 792 Z'},
 {id:'o-fact',mission:'O4',name:'사실·추정 분리 기록',label:[31,80],to:[39,85],path:'M291 730 L514 691 L672 739 L628 896 L383 915 L266 824 Z'},
 {id:'o-lot',mission:'O5',name:'로트·인계 이력 조회',label:[73,45],to:[72,66],path:'M1090 348 L1353 336 L1373 492 L1081 504 Z'},
 ]
};
let roomFocusId=null;
function sortedRoomMissions(id){return missions.filter(m=>m.room===id).sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));}
function renderRoomObjectContours(host){
 const shapes=ROOM_OBJECTS[state.room];if(!shapes)return;
 host.classList.add('paper-real');host.dataset.room=state.room;
 host.querySelectorAll('.scene-photo-target').forEach(el=>el.remove());
 const ns='http://www.w3.org/2000/svg',map=document.createElementNS(ns,'svg');
 map.setAttribute('viewBox','0 0 1672 941');map.setAttribute('preserveAspectRatio','xMidYMid meet');
 map.setAttribute('aria-label','사진 속 작업 설비 윤곽');map.classList.add('real-object-map');
 const ordered=sortedRoomMissions(state.room);
 for(const obj of shapes){
  const path=document.createElementNS(ns,'path');path.setAttribute('d',obj.path);path.classList.add('real-object-path');
  path.dataset.object=obj.id;path.dataset.mission=obj.mission;
  path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',obj.name);
  const ordinal=pad(ordered.findIndex(m=>m.id===obj.mission)+1);
  const dot=document.createElement('button');dot.type='button';dot.className='real-object-dot';dot.dataset.object=obj.id;
  dot.textContent=ordinal;dot.title=obj.name;dot.setAttribute('aria-label',`${ordinal} ${obj.name}`);
  dot.style.left=obj.label[0]+'%';dot.style.top=obj.label[1]+'%';
  const tag=document.createElement('span');tag.className='real-object-tag';tag.textContent=obj.name;tag.style.left=obj.label[0]+'%';tag.style.top=obj.label[1]+'%';
  const sync=on=>{path.classList.toggle('hovered',on);dot.classList.toggle('hovered',on);tag.classList.toggle('hovered',on)};
  path.addEventListener('pointerenter',()=>sync(true));path.addEventListener('pointerleave',()=>sync(false));
  path.addEventListener('focus',()=>sync(true));path.addEventListener('blur',()=>sync(false));
  dot.addEventListener('pointerenter',()=>sync(true));dot.addEventListener('pointerleave',()=>sync(false));
  const run=()=>{roomFocusId=obj.id;selectMission(obj.mission)};
  path.addEventListener('click',run);dot.addEventListener('click',run);
  path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run()}});
  if(roomFocusId===obj.id||(!roomFocusId&&state.active===obj.mission)){path.classList.add('selected');tag.classList.add('selected');dot.classList.add('selected')}
  map.append(path);host.append(dot,tag);
 }
 host.append(map);
}
window.KAFV_ROOM_OBJECT_DEBUG={get:(id)=>ROOM_OBJECTS[id]||[],focus:()=>roomFocusId};

let labFocusId=null;
function renderLabInteractive(host){
 host.classList.add('paper-lab');
 const visual=host.querySelector('.scene-visual');
 visual.innerHTML='<div class="scene-photo"></div>';
 host.querySelectorAll('.scene-photo-target').forEach(el=>el.remove());
 const ns='http://www.w3.org/2000/svg', map=document.createElementNS(ns,'svg');
 map.setAttribute('viewBox','0 0 1672 941');map.setAttribute('preserveAspectRatio','xMidYMid meet');
 map.classList.add('lab-selection-map');map.setAttribute('aria-label','실제 객체 윤곽 선택');
 LAB_OBJECTS.forEach((o,objectIndex)=>{
  const path=document.createElementNS(ns,'path');path.setAttribute('d',o.path);
  path.classList.add('lab-selection-shape');path.dataset.object=o.id;path.dataset.mission=o.mission;
  path.setAttribute('tabindex','0');path.setAttribute('role','button');path.setAttribute('aria-label',o.name+' 선택');
  const tag=document.createElement('button');tag.type='button';tag.className='lab-object-label';
  tag.textContent=pad(objectIndex+1)+' · '+o.name;tag.style.left=o.label[0]+'%';tag.style.top=o.label[1]+'%';tag.dataset.object=o.id;
  const dot=document.createElement('button');dot.type='button';dot.className='object-step-dot';dot.textContent=pad(objectIndex+1);dot.setAttribute('aria-label',pad(objectIndex+1)+'번 '+o.name+' 선택');dot.style.left=o.label[0]+'%';dot.style.top=o.label[1]+'%';dot.dataset.object=o.id;
  const sync=hover=>{path.classList.toggle('hovered',hover);tag.classList.toggle('hovered',hover)};
  path.addEventListener('pointerenter',()=>sync(true));path.addEventListener('pointerleave',()=>sync(false));
  path.addEventListener('focus',()=>sync(true));path.addEventListener('blur',()=>sync(false));
  tag.addEventListener('pointerenter',()=>sync(true));tag.addEventListener('pointerleave',()=>sync(false));dot.addEventListener('pointerenter',()=>sync(true));dot.addEventListener('pointerleave',()=>sync(false));dot.addEventListener('focus',()=>sync(true));dot.addEventListener('blur',()=>sync(false));
  const execute=()=>{labFocusId=o.id;selectMission(o.mission)};
  path.addEventListener('click',execute);tag.addEventListener('click',execute);dot.addEventListener('click',execute);
  path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();execute()}});
  if(o.id===labFocusId||(!labFocusId&&state.active===o.mission)){path.classList.add('selected');tag.classList.add('selected')}
  map.append(path);host.append(tag,dot);
 });
 host.append(map);
}
window.KAFV_CONTOUR_DEBUG={labObjects:()=>LAB_OBJECTS.map(({id,mission,path})=>({id,mission,path})),focus:()=>labFocusId};

function photoPoint(m){const p=PHOTO_OBJECTS[m.id];return p?{x:p[0],y:p[1],w:p[2],h:p[3]}:{x:m.x,y:m.y,w:18,h:18}}
const taskSound=m=>{if(['O2','O3','O4'].includes(m.id))return 'temp_alarm';if(m.id==='C3'||m.id==='R1'||m.id==='O1')return 'probe_scan';if(m.room==='cold')return 'latch_cold';if(m.id==='P1'||m.id==='P2')return 'package_seal';if(m.room==='receiving')return 'crate_slide';if(m.room==='display')return 'ice_pour';if(m.room==='office')return 'paper_pen';return roomSounds[m.room]||'probe_scan'};
function renderAudio(){const b=$('sim-audio-toggle'),v=$('sim-audio-vol');if(b)b.textContent=audio.on?'🔊 효과음 켜짐':'🔇 효과음 꺼짐';if(b)b.setAttribute('aria-pressed',String(audio.on));if(v)v.value=Math.round(audio.volume*100)}
function initAudio(){const b=$('sim-audio-toggle'),v=$('sim-audio-vol');b.addEventListener('click',()=>{audio.on=!audio.on;settingSet('kafv_q4_audio_on',audio.on?'1':'0');renderAudio();if(audio.on){getAudioContext();sound('probe_scan')}else audioNote('효과음 꺼짐')});v.addEventListener('input',()=>{audio.volume=+v.value/100;settingSet('kafv_q4_audio_vol',String(audio.volume));if(!audio.volume)audioNote('음량 0%')});$('sim-audio-test')?.addEventListener('click',()=>{if(!audio.on){audio.on=true;settingSet('kafv_q4_audio_on','1');renderAudio()};getAudioContext();sound(state.room==='cold'?'latch_cold':'truck_idle');setTimeout(()=>sound(state.room==='cold'?'cold_room':'probe_scan'),1150);audioNote((state.room==='cold'?'냉장창고 문·냉기':'차량·계측')+' 효과음 테스트 중')});renderAudio();}
function setRoom(id){if(!rid(id))return;roomFocusId=null;labFocusId=null;state.coldDepth='outer';state.coldFocus=null;state.coldBusy=false;state.room=id;state.active=null;state.choice=null;state.storyOpen=false;state.actorX=13;state.actorY=79;state.actorScale=1.0;motionToken++;render();sound(roomSounds[id]);showBubble('현장 안내',rid(id).name+'에 도착했습니다. 왼쪽 작업 카드 또는 현장 객체를 선택하세요.');}
function doneInRoom(r){return missions.filter(m=>m.room===r&&done.has(m.id)).length}
function renderRooms(){const h=$('sim-rooms');h.replaceChildren();for(const [roomIndex,r] of rooms.entries()){const ms=missions.filter(x=>x.room===r.id),b=document.createElement('button');b.type='button';b.className='sim-room'+(r.id===state.room?' selected':'');b.setAttribute('aria-pressed',String(r.id===state.room));b.innerHTML=`<img src="${thumbUrl(r.id)}" alt=""><span class="r-label"><b><span class="sim-room-ordinal">${pad(roomIndex+1)}</span> ${esc(r.icon)} ${esc(r.name)}</b><small>${esc(r.subtitle)}</small></span><span class="meter">${doneInRoom(r.id)}/${ms.length}</span>`;b.addEventListener('click',()=>setRoom(r.id));h.append(b)}}
function renderCommands(){const h=$('sim-commands');h.replaceChildren();for(const [missionIndex,m] of sortedRoomMissions(state.room).entries()){const b=document.createElement('button');b.type='button';b.className='sim-cmd'+(state.active===m.id?' active':'')+(done.has(m.id)?' done':'');b.innerHTML=`<span><small><span class="sim-mission-ordinal">${pad(missionIndex+1)}</span> ${esc(m.id)} · ${pad(m.cut)}컷 연계</small><b>${esc(m.title)}</b></span><span class="cmd-state">${done.has(m.id)?'✓':'›'}</span>`;b.addEventListener('click',()=>state.room==='cold'?runColdByMission(m.id):selectMission(m.id));h.append(b)}}
function bubbleHost(){return $('sim-bubble')}
function showBubble(speaker,words){const b=bubbleHost();b.innerHTML=`<strong>${esc(speaker)}</strong><span>${esc(words)}</span>`;b.classList.remove('hidden')}
let motionToken=0;
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
/* A photographic room is a perspective plane: near foot positions are larger,
   far floor positions are smaller. The feet, not the head, anchor to the floor. */
function workerDepth(y){return clamp(.37+(y-47)*.020,.38,1.28)}
function workerStyle(actor,x,y){
 actor.style.left=x+'%';actor.style.top=y+'%';
 actor.style.setProperty('--worker-depth',workerDepth(y).toFixed(4));
 actor.style.transform='translate(-50%,-90%) scale('+workerDepth(y).toFixed(4)+')';
}
/* Routed floor paths avoid cutting across equipment in foreground photographs. */
const LAB_ROUTES={
 chiller:[[23,84],[30,68]],
 microscope:[[35,83],[64,73],[84,62]],
 colorchart:[[28,82],[45,69]],
 clipboard:[[43,86],[66,82]],
 fish:[[20,85]],probe:[[34,88]],fillets:[[46,87]]
};
function moveActorTo(x,y,doneFn,via=[]){
 const actor=$('sim-actor');if(!actor)return;
 const token=++motionToken,points=[{x:state.actorX,y:state.actorY},...via.map(p=>({x:p[0],y:p[1]})),{x,y}];
 const segments=[];let total=0;
 for(let i=1;i<points.length;i++){
   const a=points[i-1],b=points[i],len=Math.hypot((b.x-a.x)*1.3,b.y-a.y);
   segments.push({a,b,len});total+=len;
 }
 const duration=clamp(total*34,850,2750);
 let t0=null,prior=points[0].x;
 actor.classList.remove('working','celebrate','alert-worker');actor.classList.add('walking');
 actor.style.transition='none';actor.style.willChange='left,top,transform';
 function step(now){
   if(token!==motionToken||!actor.isConnected||state.room!==walkRoom)return;
   if(t0===null)t0=now;
   const fraction=clamp((now-t0)/duration,0,1),dist=fraction*total;
   let walked=0,p={x,y};
   for(const seg of segments){if(dist<=walked+seg.len||seg===segments[segments.length-1]){
      const u=seg.len?clamp((dist-walked)/seg.len,0,1):1;
      p={x:seg.a.x+(seg.b.x-seg.a.x)*u,y:seg.a.y+(seg.b.y-seg.a.y)*u};break;
     }walked+=seg.len;
   }
   actor.classList.toggle('facing-left',p.x<prior-.03);prior=p.x;
   state.actorX=p.x;state.actorY=p.y;state.actorScale=workerDepth(p.y);
   workerStyle(actor,p.x,p.y);
   if(fraction<1){requestAnimationFrame(step);return}
   actor.classList.remove('walking');actor.classList.add('working');
   actor.style.willChange='auto';
   if(state.room!=='cold')sound(taskSound(mid(state.active)||{id:'R1',room:state.room}));
   setTimeout(()=>{if(token!==motionToken||!actor.isConnected)return;
      actor.classList.remove('working');if(doneFn)doneFn()},380);
 }
 const walkRoom=state.room;
 requestAnimationFrame(step);
}
function selectMission(id){const m=mid(id);if(!m)return;if(m.room==='lab'&&!LAB_OBJECTS.some(o=>o.id===labFocusId&&o.mission===m.id))labFocusId=LAB_OBJECTS.find(o=>o.mission===m.id)?.id||null;const switched=state.room!==m.room;if(switched){state.room=m.room;state.actorX=13;state.actorY=79;state.actorScale=1.0;}state.active=m.id;state.choice=null;state.storyOpen=true;render();sound('steps_path');showBubble('현장 담당자','“'+m.title+'” 작업 위치로 이동 중입니다.');const labSpot=m.room==='lab'?LAB_OBJECTS.find(o=>o.id===labFocusId):null;const realSpot=ROOM_OBJECTS[m.room]?.find(o=>o.id===roomFocusId&&o.mission===m.id)||ROOM_OBJECTS[m.room]?.find(o=>o.mission===m.id);const pos=labSpot?{x:labSpot.to[0],y:labSpot.to[1]}:realSpot?{x:realSpot.to[0],y:realSpot.to[1]}:(()=>{const a=photoPoint(m);return{x:a.x,y:clamp(a.y+a.h*.46+2,14,91)}})(),x=Math.min(92,Math.max(8,pos.x)),y=Math.min(91,Math.max(12,pos.y));moveActorTo(x,y,()=>showBubble('현장 담당자','작업 위치에 도착했습니다. 상황을 확인하고 대응을 선택하세요.'),[]);}
function renderScene(){document.getElementById('cold-process-strip')?.remove();const r=rid(state.room),h=$('sim-scene');h.replaceChildren();h.style.setProperty('--stage-photo',`url('${sceneUrl(r.id)}')`);
 const visual=document.createElement('div');visual.className='scene-visual';visual.innerHTML=`<div class="scene-photo"></div><div class="scene-dim"></div>`;h.append(visual);
 // Photo-targeted, dotted outlines are bound to photographed equipment; left command and on-photo target share one mission.
 const spots=missions.filter(m=>m.room===r.id);
 spots.forEach((m,i)=>{const loc=photoPoint(m),b=document.createElement('button');
  b.className='scene-object scene-photo-target'+(done.has(m.id)?' done':'')+(state.active===m.id?' active':'');b.type='button';
  Object.assign(b.style,{left:loc.x+'%',top:loc.y+'%',width:loc.w+'%',height:loc.h+'%'});
  b.dataset.mission=m.id;b.setAttribute('aria-label',m.title+' 실제 사진 객체 선택');b.title=m.title;
  b.innerHTML=`<span class="photo-target-num">${pad(i+1)}</span><span class="photo-target-label">${esc(m.title)}</span>`;
  b.addEventListener('click',()=>selectMission(m.id));h.append(b)
 });
 // 33-35 record forms remain in the persistent upper toolbar.
 // Avoid duplicate photo thumbnails overlapping the control-room objects.
 const actor=document.createElement('div');actor.className='sim-actor';actor.id='sim-actor';actor.setAttribute('aria-hidden','true');actor.innerHTML=`<span class="worker-shadow"></span><img class="worker-photo" src="scene/worker.webp" alt=""><span class="paper-feet" aria-hidden="true"></span><span class="worker-label">현장 작업자</span>`;h.append(actor);workerStyle(actor,state.actorX,state.actorY);
 const bubble=document.createElement('div');bubble.id='sim-bubble';bubble.className='sim-bubble';bubble.innerHTML='<strong>현장 안내</strong><span>작업할 객체를 선택하세요.</span>';h.append(bubble);
 if(r.id==='lab')renderLabInteractive(h);
 if(r.id==='cold')renderColdInteractive(h);
 if(ROOM_OBJECTS[r.id])renderRoomObjectContours(h);
 $('sim-room-title').textContent=r.name+(r.id==='cold'&&state.coldDepth==='inner'?' · 냉동구획 내부':'');$('sim-scene-caption').textContent=r.desc;$('sim-scene-status').textContent=`${doneInRoom(r.id)}/${spots.length}개 작업 완료`;
}

/* v0.4.3 paper-diorama test cell: cold storage. All paths share image coordinate system 1260 x 760. */
const COLD_SHAPES={
 outer:[
  {id:'exit',name:'출입문',label:[14,17],to:[17,75],s:'door_open',path:'M147 112 L245 113 L249 377 L151 382 Z'},
  {id:'freezer',name:'냉동창고 · 내부 진입',label:[48,15],to:[47,79],s:'latch_cold',path:'M430 114 L798 105 L809 448 L429 449 Z'},
  {id:'control',name:'온도계 · 이력 확인',label:[70,15],to:[70,64],s:'probe_scan',path:'M848 140 L955 135 L963 294 L846 294 Z'},
  {id:'stock',name:'보관선반 · 재고 확인',label:[91,16],to:[85,78],s:'crate_slide',path:'M1094 8 L1294 5 L1294 393 L1091 394 Z'},
  {id:'ice',name:'얼음함 · 얼음 보충',label:[91,68],to:[85,87],s:'ice_pour',path:'M1050 367 L1292 347 L1294 540 L1031 540 Z'},
  {id:'packages',name:'수산물 포장상자',label:[69,74],to:[67,85],s:'box',path:'M727 406 L1085 394 L1057 540 L710 540 Z'},
  {id:'crates',name:'입고 상자',label:[11,76],to:[19,87],s:'crate_slide',path:'M0 384 L203 369 L211 542 L1 541 Z'}
 ],
 inner:[
  {id:'exit',name:'외부 구획으로 나가기',label:[9,22],to:[16,84],s:'door_open',path:'M49 100 L207 77 L204 717 L47 724 Z'},
  {id:'packages',name:'냉동재고 상자',label:[61,75],to:[61,87],s:'box',path:'M218 166 L728 185 L1235 221 L1230 736 L232 739 Z'},
  {id:'thermo',name:'제품온도 확인',label:[81,10],to:[76,52],s:'probe_scan',path:'M950 33 L1194 40 L1196 115 L946 110 Z'},
  {id:'lot',name:'로트·재고이력',label:[54,51],to:[51,79],s:'paper_flip',path:'M587 369 L1152 398 L1150 600 L594 580 Z'},
  {id:'fans',name:'냉기 순환팬',label:[48,8],to:[53,47],s:'cold_room',path:'M361 7 L1050 6 L1055 165 L358 164 Z'}
 ]
};
let coldMotionToken=0;

function renderColdProcessStrip(inside){
 const old=document.getElementById('cold-process-strip');if(old)old.remove();
 return; // User-approved: remove the duplicate bottom row of images, not theory slides.
 const host=$('sim-scene');const strip=document.createElement('div');strip.id='cold-process-strip';strip.className='cold-process-strip';
 const steps=[['냉동창고 선택','cold_step_1.webp'],['내부 공간 진입','cold_step_2.webp'],['온도·재고 확인','cold_step_3.webp'],['얼음 보충','cold_step_4.webp'],['교육 피드백','cold_step_5.webp']];
 let current=inside?2:0;
 strip.innerHTML=steps.map((step,i)=>`<div class="cold-process-step ${current===i?'current':''}" aria-label="${step[0]}"><img src="${window.KAFV_SCENE_MAP?.[step[1].slice(0,-5)] || 'scene/'+step[1]}" alt=""><span>${String(i+1).padStart(2,'0')} · ${step[0]}</span></div>`).join('');
 host.insertAdjacentElement('afterend',strip);
}

function renderColdInteractive(host){
 host.classList.remove('cold-enter-zoom','cold-exit-zoom');host.classList.add('paper-cold');host.dataset.depth=state.coldDepth;
 const inside=state.coldDepth==='inner';
 host.style.setProperty('--stage-photo',`url('${inside?(window.KAFV_SCENE_MAP?.cold_inside||'scene/cold_inside.webp'):sceneUrl('cold')}')`);
 const v=host.querySelector('.scene-visual');
 v.innerHTML=`<div class="scene-photo"></div><div class="cold-light"></div><div class="cold-paper-note" aria-hidden="true">${inside?'냉동구획 내부 · 실습':'냉동창고 · 실사형 현장'} </div>`;
 host.querySelectorAll('.scene-photo-target').forEach(node=>node.remove());
 // All focus outlines are exact photo-space SVG paths (rather than oversized rectangles).
 const popout=document.createElement('div');popout.className='cold-paper-popout';host.append(popout);
 if(!inside){const door=document.createElement('div');door.className='cold-door-stage';door.setAttribute('aria-hidden','true');door.innerHTML='<div class="door-chamber"></div><div class="door-panel left"></div><div class="door-panel right"></div>';host.append(door)}
 renderColdProcessStrip(inside);
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox',inside?'0 0 1260 760':'0 0 1295 543');svg.setAttribute('preserveAspectRatio','none');svg.classList.add('cold-selection-map');
 COLD_SHAPES[inside?'inner':'outer'].forEach((obj,i)=>{
  const path=document.createElementNS(ns,'path');path.setAttribute('d',obj.path);path.setAttribute('class','cold-selection-shape'+(state.coldFocus===obj.id?' selected':''));path.dataset.object=obj.id;path.setAttribute('tabindex','0');path.setAttribute('role','button');path.setAttribute('aria-label',obj.name);
  const label=document.createElement('button');label.type='button';label.className='cold-object-label';label.dataset.object=obj.id;label.style.left=obj.label[0]+'%';label.style.top=obj.label[1]+'%';label.textContent=(inside?'내부 · ':pad(i+1)+' · ')+obj.name;
  const dot=document.createElement('button');dot.type='button';dot.className='object-step-dot cold-step-dot';dot.textContent=pad(i+1);dot.style.left=obj.label[0]+'%';dot.style.top=obj.label[1]+'%';dot.dataset.object=obj.id;dot.setAttribute('aria-label',(inside?'내부 ':'외부 ')+pad(i+1)+'번 '+obj.name+' 선택');
  const sync=(active)=>{path.classList.toggle('hovered',active);label.classList.toggle('hovered',active);if(active){applyColdPopout(popout,obj)}else if(state.coldFocus!==obj.id)popout.classList.remove('visible')};
  path.addEventListener('pointerenter',()=>sync(true));path.addEventListener('pointerleave',()=>sync(false));path.addEventListener('focus',()=>sync(true));path.addEventListener('blur',()=>sync(false));
  label.addEventListener('pointerenter',()=>sync(true));label.addEventListener('pointerleave',()=>sync(false));dot.addEventListener('pointerenter',()=>sync(true));dot.addEventListener('pointerleave',()=>sync(false));dot.addEventListener('focus',()=>sync(true));dot.addEventListener('blur',()=>sync(false));
  const run=()=>runColdObject(obj.id);path.addEventListener('click',run);label.addEventListener('click',run);dot.addEventListener('click',run);
  path.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run()}});
  svg.append(path);host.append(label);if(!inside)host.append(dot); // 내부는 외부 번호 재사용으로 오인되지 않도록 번호표 제거, 윤곽/객체명 호버 유지
 });
 host.append(svg);
 // Put selection SVG below small labels but above the photo; buttons remain accessible.
 if(inside){
  const meter=document.createElement('div');meter.className='cold-meter';meter.innerHTML='<span>가상 계측 표시</span><strong>−18°C</strong><small>실측값 아님 · 온도이력 확인</small>';
  meter.addEventListener('click',()=>runColdObject('thermo'));meter.setAttribute('role','button');meter.tabIndex=0;meter.addEventListener('keydown',e=>{if(e.key==='Enter')runColdObject('thermo')});host.append(meter);
  const back=document.createElement('button');back.className='cold-back';back.textContent='↶ 외부 구획으로 나가기';back.onclick=()=>runColdObject('exit');host.append(back);
 }else{
  const hint=document.createElement('div');hint.className='cold-hover-hint';hint.textContent='냉동구획에 마우스를 올려 윤곽을 확인하고 선택하세요.';host.append(hint);
 }
}
function applyColdPopout(el,obj){const clip=COLD_CLIPS[obj.id];if(clip)el.style.clipPath=clip;el.classList.add('visible')}
const COLD_CLIPS={
 freezer:'polygon(33.2% 21%,61.6% 19.4%,62.5% 82.5%,33.1% 82.6%)',
 exit:'polygon(11.3% 21%,19% 21%,19.2% 70%,11.6% 71%)',
 control:'polygon(65.5% 25.8%,74% 25%,74.4% 54.1%,65.4% 54.1%)',
 stock:'polygon(84.4% 1.4%,99.9% 1%,99.9% 72%,84.2% 73%)',
 ice:'polygon(81% 68%,99.8% 64%,99.9% 99%,79.6% 99%)',
 packages:'polygon(56% 74.7%,83.8% 72.5%,81.6% 99%,54.8% 99%)',
 crates:'polygon(0% 70.7%,15.7% 68%,16.3% 99%,0% 99%)',
 thermo:'polygon(75% 4%,95% 5%,95% 15%,75% 14%)',
 lot:'polygon(46.5% 49%,91% 52%,91% 79%,47% 76%)',
 fans:'polygon(28% 1%,84% 1%,84% 22%,28% 22%)'
};
function markColdSelection(id){const host=$('sim-scene');host.querySelectorAll('.cold-selection-shape').forEach(el=>el.classList.toggle('selected',el.dataset.object===id));host.querySelectorAll('.cold-object-label').forEach(el=>el.classList.toggle('selected',el.dataset.object===id));state.coldFocus=id;const obj=COLD_SHAPES[state.coldDepth==='inner'?'inner':'outer'].find(o=>o.id===id);const popout=host.querySelector('.cold-paper-popout');if(obj&&popout)applyColdPopout(popout,obj);}
function setColdStory(id){const m=mid(id);if(!m)return;state.active=id;state.choice=null;renderStory();renderCommands();}
function runColdByMission(id){
 if(state.coldDepth==='inner'){
  const obj={C1:'packages',C2:'lot',C3:'thermo',C4:'packages',C5:'packages'}[id]||'packages';return runColdObject(obj,id);
 }
 const obj={C1:'freezer',C2:'stock',C3:'control',C4:'packages',C5:'freezer'}[id]||'freezer';return runColdObject(obj,id);
}
function runColdObject(id,missionOverride){
 if(state.room!=='cold'||state.coldBusy)return;
 const inside=state.coldDepth==='inner',obj=COLD_SHAPES[inside?'inner':'outer'].find(o=>o.id===id);if(!obj)return;
 getAudioContext();markColdSelection(id);
 coldMotionToken++;const token=coldMotionToken;
 showBubble('현장 작업자',`${obj.name} 위치로 이동하겠습니다.`);
 // start physical footsteps on the actual selection gesture
 sound('steps_path');
 const actor=$('sim-actor');if(actor){actor.style.opacity='1';actor.classList.add('walking')}
 const targetX=obj.to[0],targetY=obj.to[1];
 moveActorTo(targetX,targetY,()=>{
  if(token!==coldMotionToken||state.room!=='cold')return;
  if(id==='freezer'&&!inside){return coldEnterFreezer(missionOverride)}
  if(id==='exit'&&!inside){showBubble('현장 작업자','출입문을 점검했습니다. 냉동창고 내부 진입은 중앙 냉동구획을 선택하세요.');return}
  if(id==='exit'&&inside){return coldExitFreezer()}
  sound(obj.s);
  if(id==='ice'){const steps=document.querySelectorAll('#cold-process-strip .cold-process-step');steps.forEach((el,i)=>el.classList.toggle('current',i===3));coldIceEffect();showBubble('현장 작업자','얼음을 보충했습니다. 녹은 물의 배수와 위생상태도 점검합니다.');}
  else if(id==='thermo'||id==='control'){const steps=document.querySelectorAll('#cold-process-strip .cold-process-step');steps.forEach((el,i)=>el.classList.toggle('current',i===2));showBubble('현장 작업자','설정값과 제품온도·과거 이력은 별개입니다. 점검기록을 확인하세요.');}
  else if(id==='lot'||id==='stock'||id==='packages'){coldInventoryEffect();showBubble('현장 작업자','입고일·기한·로트·보류 여부를 확인합니다.');}
  else if(id==='fans'){showBubble('현장 작업자','냉기순환을 확인합니다. 제품과 설비의 기록은 함께 살펴야 합니다.');}
  else {showBubble('현장 작업자','수조의 수질·산소·품목별 저장조건을 확인합니다.');}
  const mission=missionOverride||({stock:'C2',control:'C3',packages:'C4',crates:'C1',lot:'C2',thermo:'C3',fans:'C3',ice:'C1'}[id]);
  if(mission)setColdStory(mission);
 },(!inside&&id==='freezer')?[[30,87],[43,83]]:[]);
}
function coldEnterFreezer(missionOverride){
 state.coldBusy=true;
 sound('latch_cold');sound('door_open');
 showBubble('현장 작업자','문을 열고 냉동구획 안으로 들어갑니다.');
 const host=$('sim-scene');host.classList.add('cold-door-opening');
 setTimeout(()=>{if(state.room==='cold')host.classList.add('cold-enter-zoom')},510);
 setTimeout(()=>{if(state.room!=='cold')return;state.coldDepth='inner';state.coldBusy=false;state.actorX=16;state.actorY=85;state.actorScale=workerDepth(85);renderScene();renderCommands();sound('cold_room');showBubble('현장 담당자','안쪽의 온도계·재고상자·냉기순환팬을 각각 눌러보세요.');if(missionOverride)setColdStory(missionOverride);},1190);
}
function coldExitFreezer(){
 state.coldBusy=true;sound('door_open');showBubble('현장 작업자','냉동구획에서 나갑니다.');
 $('sim-scene').classList.add('cold-exit-zoom');
 setTimeout(()=>{if(state.room!=='cold')return;state.coldDepth='outer';state.coldBusy=false;state.actorX=61;state.actorY=72;state.actorScale=workerDepth(72);renderScene();renderCommands();sound('door_close');showBubble('현장 담당자','외부 보관구획으로 돌아왔습니다. 다른 객체도 자유롭게 선택하세요.');},650);
}
function coldIceEffect(){const host=$('sim-scene');if(!host)return;const ice=document.createElement('div');ice.className='cold-ice-pour new-game-ice';ice.setAttribute('aria-hidden','true');
 for(let i=0;i<32;i++){const bit=document.createElement('i');bit.style.setProperty('--x',`${i*6%100}%`);bit.style.setProperty('--delay',`${i*19%400}ms`);ice.append(bit)}host.append(ice);setTimeout(()=>ice.remove(),2100)}
function coldInventoryEffect(){const steps=document.querySelectorAll('#cold-process-strip .cold-process-step');steps.forEach((el,i)=>el.classList.toggle('current',i===2));const host=$('sim-scene');if(!host)return;host.querySelector('.cold-stock-peek')?.remove();const p=document.createElement('div');p.className='cold-stock-peek';p.innerHTML='<strong>📋 재고관리 현황 · 교육용</strong><p>로트 / 입고일 / 적용 기한 / 보류 상태를 확인하세요.</p><small>실제 상품 정보는 각 포장표시·입고기록과 대조합니다.</small>';host.append(p);setTimeout(()=>p.remove(),4200)}
window.KAFV_ACTOR_DEBUG={actor:()=>({x:state.actorX,y:state.actorY,scale:state.actorScale,room:state.room,active:state.active}),lab:()=>LAB_OBJECTS.map(o=>({id:o.id,to:o.to,mission:o.mission}))};
window.KAFV_PAPERLAB_DEBUG={depth:()=>state.coldDepth,run:runColdObject,getShapes:()=>COLD_SHAPES,focus:()=>state.coldFocus};

function renderStory(){const host=$('sim-case-body');host.replaceChildren();const m=mid(state.active);
 if(!m){host.innerHTML=`<div class="story-placeholder"><span>🎮</span><b>현장을 탐색하세요</b><p>왼쪽 명령 카드나 오른쪽 사진형 객체를 누르면 상황 나레이션이 열립니다. 선택에 따라 상태와 피드백이 바뀝니다.</p></div>`;return;}
 const tag=document.createElement('div');tag.className='sim-tag';tag.textContent=`SCENE ${m.id} · PART ${pad(m.part)} · ${pad(m.cut)}컷`;host.append(tag);
 const title=document.createElement('h3');title.textContent=m.title;host.append(title);
 const scene=document.createElement('div');scene.className='story-lead';scene.innerHTML='<span class="story-mark">❝</span><p></p>';scene.querySelector('p').textContent=m.lead;host.append(scene);
 const q=document.createElement('div');q.className='question';q.textContent=m.q;host.append(q);
 const choices=document.createElement('div');choices.className='sim-choices';host.append(choices);
 m.choices.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='sim-choice'+(state.choice===i?(i===m.correct?' correct':' wrong'):'');/* v0.4.3: every answer remains selectable for comparison learning */b.innerHTML=`<span class="choice-num">${i+1}</span><span>${esc(s)}</span>`;b.addEventListener('click',()=>answer(m,i));choices.append(b)});
 if(state.choice!==null){const correct=state.choice===m.correct;const f=document.createElement('div');f.className='sim-feedback '+(correct?'good':'bad');f.innerHTML=`<strong>${correct?'✅ 적절한 대응':'⚠️ 다른 선택이 필요합니다'}</strong><p>${esc(correct?m.act:'확인되지 않은 정보와 위험을 다시 살펴보세요. 교육 해설을 참고해 재선택할 수 있습니다.')}</p>`;host.append(f)}
 const btns=document.createElement('div');btns.className='sim-case-buttons';host.append(btns);
 const button=(label,fn,cls='')=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=label;b.addEventListener('click',fn);btns.append(b)};
 button('📖 교육 해설',()=>showExplanation(m),'secondary');button('🖼 관련 이론 PIP',()=>showPIP(m.cut),'secondary');
 if(m.form)button('📝 '+m.form+'번 기록서',()=>window.KAFV_APP.openPractice(m.form));
 button('↺ 다시 선택',()=>{state.choice=null;renderStory()},'secondary');
}
function showExplanation(m){const overlay=$('sim-explain-overlay');overlay.hidden=false;$('sim-explain-title').textContent=m.title+' · 교육 해설';$('sim-explain-scene').textContent=m.lead;$('sim-explain-judge').textContent=m.explain;$('sim-explain-action').textContent=m.act;$('sim-explain-point').textContent=`관련 강의 ${pad(m.cut)}컷 · ${m.q}`;sound('paper_flip')}
function showPIP(n){const p=$('sim-pip');p.hidden=false;$('sim-pip-img').src=cutUrl(n);$('sim-pip-cap').textContent=pad(n)+'컷 · 관련 이론';sound('paper')}
function answer(m,i){const ok=i===m.correct;state.choice=i;if(ok)done.add(m.id);logs.push({at:new Date().toISOString(),mission:m.id,part:m.part,room:m.room,cut:m.cut,result:ok?'완료':'오답',selected:i+1});if(logs.length>600)logs=logs.slice(-600);save();feedbackTone(ok);renderStats();renderRooms();renderCommands();renderStory();
 document.querySelectorAll('.scene-photo-target').forEach(node=>node.classList.toggle('done',done.has(node.dataset.mission)));
 $('sim-scene-status').textContent=`${doneInRoom(state.room)}/${missions.filter(q=>q.room===state.room).length}개 작업 완료`;
 const worker=$('sim-actor');if(worker){worker.classList.add(ok?'celebrate':'alert-worker');setTimeout(()=>worker.classList.remove('celebrate','alert-worker'),1000)}showBubble(ok?'현장 판정 ✓':'재검토 안내',ok?'선택한 조치를 기록했습니다. 완료 표시를 확인하세요.':'위험 정보와 판단근거를 확인하고 다시 선택하세요.');}
function renderStats(){$('sim-count').textContent=`${done.size} / ${missions.length}`;$('sim-progress-fill').style.width=(100*done.size/missions.length)+'%'}
function render(){renderRooms();renderCommands();renderScene();renderStory();renderStats()}
function csvExport(){const heads=['기록시각','미션ID','공간','컷','판단결과','선택지번호'];const rows=[heads,...logs.map(x=>[x.at,x.mission,rid(x.room)?.name||x.room,pad(x.cut),x.result,x.selected])];const csv='\ufeff'+rows.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'}).join(',')).join('\r\n');let a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='KAFV_Q4_실습기록.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function onSlide(n){state.lastLecture=n;const b=$('lecture-sim-link'),note=$('no-practice-note');if(!b||!note)return;const m=missions.find(x=>x.cut===n);const form=n>=33&&n<=35?n:null;b.hidden=!(m||form);note.hidden=!!(m||form);if(form){b.textContent='📝 이 이미지 실습하기 ▶';b.onclick=()=>{sound('paper_flip');window.KAFV_APP.openPractice(form)};}else if(m){b.textContent='🎮 이 이미지 실습하기 ▶';b.onclick=()=>startMission(m.id)}else b.onclick=null}
function onView(view){if(view==='simulator')render()}
function startMission(id){const m=mid(id);if(!m)return false;state.room=m.room;if(m.room==='cold'){state.coldDepth='outer';state.coldBusy=false;state.actorX=13;state.actorY=74;}window.KAFV_APP.setView('simulator');if(m.room==='cold')runColdByMission(id);else selectMission(id);return true}
function init(){initAudio();$('sim-csv').addEventListener('click',csvExport);$('sim-reset').addEventListener('click',()=>{if(!confirm('24개 현장 미션 수행기록을 초기화하시겠습니까? 33~35번 서식은 보존됩니다.'))return;done.clear();logs=[];save();state.active=null;state.choice=null;render()});
 [33,34,35].forEach(n=>$('open-form'+n)?.addEventListener('click',()=>{sound('paper_flip');window.KAFV_APP.openPractice(n)}));
 $('sim-explain-close').addEventListener('click',()=>{$('sim-explain-overlay').hidden=true});$('sim-explain-overlay').addEventListener('click',e=>{if(e.target===$('sim-explain-overlay'))e.target.hidden=true});
 $('sim-pip-close').addEventListener('click',()=>{$('sim-pip').hidden=true});
 $('sim-sub-theory')?.addEventListener('click',()=>{window.KAFV_APP.setSlide(state.lastLecture||1)});
 $('sim-sub-game')?.addEventListener('click',()=>{window.KAFV_APP.setView('simulator')});
 $('sim-to-theory').addEventListener('click',()=>{sound('door_close');window.KAFV_APP.setSlide(state.lastLecture||1)});
 // 관리·기록실 이동은 공간 선택 07번으로 통일 (중복 버튼 없음).
 render();onSlide(window.KAFV_APP.getSlideNum());
}
window.KAFV_SIM={onSlide,onView,rooms,missions,getState:()=>({done:[...done],logs:[...logs],room:state.room}),startMission,showPIP};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();