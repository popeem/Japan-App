let data = [];
let grammarLesson = [];
let grammarExercise = [];
let loaded = false;

let current = null;

// ================= LOAD (โหลดครั้งเดียว)
async function loadData(){
  if(loaded) return;

  try{
    data = await fetch("data.json").then(r=>r.json());
    grammarLesson = await fetch("grammar_lesson.json").then(r=>r.json());
    grammarExercise = await fetch("grammar_exercise.json").then(r=>r.json());
    loaded = true;
  }catch(e){
    alert("โหลดข้อมูลไม่ได้");
  }
}

// ================= VOCAB
async function startGame(){
  await loadData();
  nextVocab();
}

function nextVocab(){
  current = data[Math.floor(Math.random()*data.length)];
  document.getElementById("question").innerText = current.kanji;

  renderChoices(getChoices(data,"hira",current.hira),(c)=>{
    if(c===current.hira){
      setStatus("✅ ถูก");
      setTimeout(nextVocab,500);
    }else{
      setStatus("❌ ผิด ("+current.hira+")");
    }
  });
}

// ================= LESSON
let lIndex=0;

async function startGrammarLesson(){
  await loadData();
  lIndex=0;
  showLesson();
}

function showLesson(){
  let g = grammarLesson[lIndex];
  if(!g) return;

  document.getElementById("question").innerText = g.pattern;
  document.getElementById("choices").innerHTML =
    `<p>${g.meaning}</p>
     <p>${g.structure}</p>
     <p>${g.example}</p>
     <button onclick="nextLesson()">➡ ต่อไป</button>`;
}

function nextLesson(){
  lIndex++;
  showLesson();
}

// ================= EXERCISE
async function startGrammarExercise(){
  await loadData();
  nextExercise();
}

function nextExercise(){
  current = grammarExercise[Math.floor(Math.random()*grammarExercise.length)];

  document.getElementById("question").innerText = current.question;

  renderChoices(current.choices,(c)=>{
    if(c===current.answer){
      setStatus("✅ ถูก");
    }else{
      setStatus("❌ ผิด ("+current.answer+")");
    }
    setTimeout(nextExercise,500);
  });
}

// ================= UTIL
function renderChoices(arr,cb){
  let div=document.getElementById("choices");
  div.innerHTML="";
  arr.forEach(c=>{
    let b=document.createElement("button");
    b.innerText=c;
    b.onclick=()=>cb(c);
    div.appendChild(b);
  });
}

function getChoices(data,key,correct){
  let arr=[correct];
  while(arr.length<4){
    let r=data[Math.floor(Math.random()*data.length)][key];
    if(!arr.includes(r)) arr.push(r);
  }
  return arr.sort(()=>Math.random()-0.5);
}

function setStatus(t){
  let s=document.getElementById("status");
  if(s) s.innerText=t;
}
