let data=[], grammarData=[];
let current=null;

// ================= LOAD
async function load(){
  data = await fetch("data.json").then(r=>r.json());
  grammarData = await fetch("grammar.json").then(r=>r.json());
}

// ================= VOCAB
function startGame(){
  load().then(nextVocab);
}

function nextVocab(){
  current = data[Math.floor(Math.random()*data.length)];
  document.getElementById("question").innerText = current.kanji;

  let choices = getChoices(data,"hira",current.hira);
  renderChoices(choices,(c)=>{
    if(c===current.hira){
      document.getElementById("status").innerText="✅";
      setTimeout(nextVocab,500);
    }else{
      document.getElementById("status").innerText="❌";
    }
  });
}

// ================= GRAMMAR LESSON
let gIndex=0;

function startGrammarLesson(){
  load().then(()=>{
    gIndex=0;
    showLesson();
  });
}

function showLesson(){
  let g = grammarData[gIndex];
  if(!g) return;

  document.getElementById("question").innerText = g.pattern;
  document.getElementById("choices").innerHTML =
    `<p>${g.meaning}</p>
     <p>${g.structure}</p>
     <p>${g.example}</p>
     <button onclick="nextLesson()">➡ ต่อไป</button>`;
}

function nextLesson(){
  gIndex++;
  showLesson();
}

// ================= EXERCISE
function startGrammarExercise(){
  load().then(nextExercise);
}

function nextExercise(){
  current = grammarData[Math.floor(Math.random()*grammarData.length)];

  document.getElementById("question").innerText = current.question;

  renderChoices(current.choices,(c)=>{
    if(c===current.answer){
      document.getElementById("status").innerText="✅";
    }else{
      document.getElementById("status").innerText="❌";
    }
    setTimeout(nextExercise,500);
  });
}

// ================= UTIL
function renderChoices(arr,callback){
  let div=document.getElementById("choices");
  div.innerHTML="";
  arr.forEach(c=>{
    let b=document.createElement("button");
    b.innerText=c;
    b.onclick=()=>callback(c);
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
