const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

$("#year").textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add("visible"); });
}, {threshold:.12});
$$(".reveal").forEach(el => observer.observe(el));

$("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
$$("nav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));

$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  $("#themeToggle").textContent = document.body.classList.contains("light") ? "☀" : "◐";
});

let reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionToggle = $("#motionToggle");
function applyMotionPreference(){
  document.body.classList.toggle("reduce-motion", reducedMotion);
  if(motionToggle){ motionToggle.setAttribute("aria-pressed", String(reducedMotion)); motionToggle.textContent = reducedMotion ? "Enable motion" : "Reduce motion"; }
}
if(motionToggle) motionToggle.addEventListener("click", () => { reducedMotion = !reducedMotion; applyMotionPreference(); });
applyMotionPreference();

const viewKey = "aravind_portfolio_views";
let views = Number(localStorage.getItem(viewKey) || 0) + 1;
localStorage.setItem(viewKey, views);
$("#viewCount").textContent = views.toLocaleString();



const chatPanel = $("#chatPanel");
const chatBackdrop = $("#chatBackdrop");
function toggleChat(open) {
  chatPanel.classList.toggle("open", open);
  chatBackdrop.classList.toggle("open", open);
}
$("#openChat").addEventListener("click", () => toggleChat(true));
$("#closeChat").addEventListener("click", () => toggleChat(false));
chatBackdrop.addEventListener("click", () => toggleChat(false));

const knowledge = [
{keys:["who","about","aravind","profile"],answer:"Aravind Bommalata is a Machine Learning Engineer and Healthcare AI Researcher working across medical imaging, explainable AI, deep learning, NLP, MLOps, and embedded intelligence, with a focus on practical healthcare and early Alzheimer’s research."},
{keys:["education","educational","academic","academics","studied","study","degree","qualification","masters","master","msc"],answer:"Aravind completed an MSc with Distinction at Coventry University, United Kingdom. His earlier engineering and embedded-systems background supported his transition into machine learning and healthcare AI."},
{keys:["experience","career","worked","work","employment","professional","years","timeline","history"],answer:"Aravind’s career spans embedded systems, engineering, machine learning, and senior ML engineering. His roles include Senior ML Engineer at Quantum Techworks and Intellitech Solutions, ML Engineer at Intel TechWorks, and earlier embedded-systems training and engineering positions. The portfolio CV should be consulted for exact dates and role-by-role details."},
{keys:["research","alzheimer","healthcare","medical","imaging","explainable"],answer:"His research interests include explainable AI for early Alzheimer’s detection using multimodal MRI, deep learning, Grad-CAM, SHAP, hybrid CNN architectures, clinical decision support, and reproducible MLOps workflows."},
{keys:["project","projects","license","plate","alpr","chest","cancer"],answer:"Selected work includes Chest Disease Detection using CNN/ResNet/DenseNet, Automatic License Plate Recognition using YOLOv8 and EasyOCR, Breast Cancer Screening using Shearlet Transform and SVM, and an Integrated Healthcare Platform using DCNNs."},
{keys:["publication","publications","paper","published"],answer:"His publications include a 2024 Springer chapter on Design and Development of an Integrated Healthcare Platform Using DCNNs, plus 2018 publications on Automatic Human Defense System Using Nanoids and Advanced Home Automation and Security System Using IoT Technology."},
{keys:["skills","skill","technology","technologies","tools","stack"],answer:"His toolkit includes Python, MATLAB, Java, Embedded C/C++, TensorFlow, PyTorch, Keras, LLMs, CNNs, GNNs, OpenCV, YOLOv8, EasyOCR, Tesseract, SHAP, Grad-CAM, MLflow, Docker, cloud platforms, CI/CD, embedded platforms, and databases."},
{keys:["certification","certifications","certificate"],answer:"Listed certifications include the IBM AI Engineering Professional Certificate and AI for Medicine Specialization, both from 2020."},
{keys:["award","awards","achievement"],answer:"His CV lists Pan India Best Employee of the Year from SBI Cards in 2015, along with published-researcher recognition and industry experience across healthcare AI and embedded systems."},
{keys:["cv","resume","download"],answer:"Use the Download my CV button near the top of the portfolio or the QR code in the Contact section."}
];
const cvFacts = knowledge.map(k=>({text:k.answer, tokens:k.keys}));
function getReply(text){
 const q=String(text||"").toLowerCase().normalize("NFKD").replace(/[^\w\s]/g," ").replace(/\s+/g," ").trim();
 const words=q.split(" ").filter(w=>w.length>2);
 if(!words.length) return "Ask me anything about Aravind’s CV, research, education, career, projects, publications, skills, or certifications.";
 const scored=cvFacts.map(item=>({item,score:words.reduce((n,w)=>n+(item.tokens.some(k=>k.includes(w)||w.includes(k))?1:0),0)})).sort((a,b)=>b.score-a.score);
 if(scored[0].score>0) return scored[0].item.text;
 return "I couldn’t find a reliable answer to that in the portfolio knowledge available to me. Try asking about a specific aspect of Aravind’s education, career, research, projects, publications, skills, or certifications.";
}
function addMessage(text, type){
  const el = document.createElement("div");
  el.className = `message ${type}`;
  el.textContent = text;
  $("#chatMessages").appendChild(el);
  $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
}
function submitChat(text){
  if(!text.trim()) return;
  addMessage(text,"user");
  $("#chatInput").value = "";
  setTimeout(() => addMessage(getReply(text),"bot"), 350);
}
$("#chatForm").addEventListener("submit", e => {e.preventDefault();submitChat($("#chatInput").value);});
$$(".suggestions button").forEach(b => b.addEventListener("click", () => submitChat(b.textContent)));

const canvas = $("#neuralCanvas"), ctx = canvas.getContext("2d", {alpha:true});
let particles = [], width, height, animationFrame, pixelRatio=1;
function resize(){
  pixelRatio=Math.min(window.devicePixelRatio||1,3);
  width=innerWidth; height=innerHeight;
  canvas.width=Math.round(width*pixelRatio); canvas.height=Math.round(height*pixelRatio);
  canvas.style.width=width+"px"; canvas.style.height=height+"px";
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);
  particles=Array.from({length:Math.min(85,Math.floor(width/16))},()=>({x:Math.random()*width,y:Math.random()*height,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.7+.5}));
}
function draw(){
  if(document.body.classList.contains("reduce-motion")){ ctx.clearRect(0,0,width,height); animationFrame=null; return; }
  ctx.clearRect(0,0,width,height);
  const light=document.body.classList.contains("light");
  const color=light?"35,110,105":"109,240,198";
  particles.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>width)p.vx*=-1;if(p.y<0||p.y>height)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1.15,p.r*1.15),0,Math.PI*2);ctx.fillStyle=`rgba(${color},.98)`;ctx.fill();
    particles.forEach(q=>{
      const d=Math.hypot(p.x-q.x,p.y-q.y);
      if(d<125){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.lineWidth=0.9;ctx.strokeStyle=`rgba(${color},${.34*(1-d/125)})`;ctx.stroke();}
    });
  });
  animationFrame=requestAnimationFrame(draw);
}
resize();addEventListener("resize",resize);draw();

/* Premium motion engine: Lenis + GSAP ScrollTrigger + Three.js */
(function(){
  const progress=document.getElementById('scrollProgress');
  const lenis = window.Lenis
  ? new Lenis({
      duration: 1.15,
      smoothWheel: true,
      smoothTouch: true,
      syncTouch: true
    })
  : null;
  if(lenis){lenis.on('scroll',()=>ScrollTrigger.update());gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  if(window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if(progress) window.addEventListener('scroll',()=>progress.style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%');
  const title=document.getElementById('storyTitle'), text=document.getElementById('storyText');
  const scenes=[
    ['Understand the patient.','Create a generalizable Medical AI Foundation Model that can read multimodal clinical signals and understand disease evolution.'],
    ['Predict the trajectory.','Model how disease may progress in an individual patient-not only what is visible today, but what may happen next.'],
    ['Simulate interventions.','Construct a causal digital twin to explore possible interventions and their consequences before clinical decisions are made.'],
    ['Support better decisions.','Unify understanding, prediction, and simulation into personalized clinical decision support across multiple diseases.']
  ];
  if(title&&window.gsap){
    const vision=document.querySelector('#vision');
    const storyState={index:0,last:0,busy:false,entered:false};
    const renderScene=(i)=>{
      const s=scenes[i];
      title.textContent=s[0];
      text.textContent=s[1];
      document.querySelectorAll('.story-stepper span').forEach((n,j)=>n.classList.toggle('active',i===j));
      gsap.fromTo([title,text],{y:18,opacity:.35},{y:0,opacity:1,duration:.48,ease:'power2.out',stagger:.05});
    };
    renderScene(0);
    if (vision) {
  let touchStartY = 0;
  let touchEndY = 0;

  function changeVisionScene(direction) {
    if (storyState.busy) return;

    const atFirst =
      storyState.index === 0 && direction < 0;

    const atLast =
      storyState.index === scenes.length - 1 && direction > 0;

    // Allow normal page scrolling above the first stage
    if (atFirst) return;

    // Move to the next section after Stage 04
    if (atLast) {
      const nextSection = document.getElementById("research");

      if (nextSection) {
        storyState.busy = true;

        if (lenis) {
          lenis.scrollTo(nextSection, {
            offset: 0,
            duration: 1
          });
        } else {
          nextSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        setTimeout(() => {
          storyState.busy = false;
        }, 900);
      }

      return;
    }

    const next = Math.max(
      0,
      Math.min(
        scenes.length - 1,
        storyState.index + direction
      )
    );

    if (next === storyState.index) return;

    storyState.busy = true;
    storyState.index = next;
    renderScene(next);

    setTimeout(() => {
      storyState.busy = false;
    }, 550);
  }

  // Desktop mouse wheel support
  vision.addEventListener(
    "wheel",
    (event) => {
      const rect = vision.getBoundingClientRect();

      const inside =
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.65;

      if (!inside || Math.abs(event.deltaY) < 8) return;

      event.preventDefault();

      changeVisionScene(event.deltaY > 0 ? 1 : -1);
    },
    { passive: false }
  );

  // Mobile touch support
  vision.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) return;

      touchStartY = event.touches[0].clientY;
    },
    { passive: true }
  );

  vision.addEventListener(
    "touchend",
    (event) => {
      if (!touchStartY || storyState.busy) return;

      touchEndY = event.changedTouches[0].clientY;

      const swipeDistance = touchStartY - touchEndY;

      touchStartY = 0;

      // Ignore small finger movements
      if (Math.abs(swipeDistance) < 45) return;

      // Swipe up = next stage
      // Swipe down = previous stage
      changeVisionScene(swipeDistance > 0 ? 1 : -1);
    },
    { passive: true }
  );

  // Allow users to tap the numbered stages
  document
    .querySelectorAll(".story-stepper span")
    .forEach((step, index) => {
      step.style.cursor = "pointer";
      step.setAttribute("role", "button");
      step.setAttribute("tabindex", "0");

      step.addEventListener("click", () => {
        if (storyState.busy || index === storyState.index) return;

        storyState.busy = true;
        storyState.index = index;
        renderScene(index);

        setTimeout(() => {
          storyState.busy = false;
        }, 550);
      });

      step.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          step.click();
        }
      });
    });
}
    gsap.to('.story-core',{rotation:720,scale:1.15,ease:'none',scrollTrigger:{trigger:'#vision',start:'top top',end:'bottom bottom',scrub:1}});
    gsap.to('.story-ring',{rotation:360,ease:'none',scrollTrigger:{trigger:'#vision',start:'top top',end:'bottom bottom',scrub:1}});
  }
  const reveal=document.getElementById('emailReveal'), address=document.getElementById('emailAddress');
  if(reveal) reveal.addEventListener('click',()=>{address.hidden=false;reveal.hidden=true;window.location.href='mailto:aravi.nano@gmail.com';});
})();

/* Final interaction fixes */
document.addEventListener('DOMContentLoaded',()=>{
  const emailTrigger=document.querySelector('.email-trigger');
  const revealedEmail=document.querySelector('.revealed-email');
  if(emailTrigger&&revealedEmail){
    emailTrigger.addEventListener('click',()=>{
      const isHidden=revealedEmail.hasAttribute('hidden');
      if(isHidden) revealedEmail.removeAttribute('hidden');
      else revealedEmail.setAttribute('hidden','');
      emailTrigger.setAttribute('aria-expanded',String(isHidden));
    });
  }
  const fab=document.getElementById('chatbot-fab');
  const chatPanel=document.querySelector('.chat-panel, #chatPanel, [data-chat-panel]');
  const chatButton=document.querySelector('[aria-label*="assistant" i]:not(#chatbot-fab), .ai-assistant-btn, .chat-toggle');
  const revealFab=()=>{
    if(fab) fab.classList.toggle('is-visible',window.scrollY>window.innerHeight*.65);
  };
  window.addEventListener('scroll',revealFab,{passive:true});
  revealFab();
  if(fab){
    fab.addEventListener('click',()=>{
      if(chatButton) chatButton.click();
      else if(chatPanel) chatPanel.classList.toggle('open');
    });
  }
});

/* Compact toolkit filters and reliable NanoBot launcher */
document.addEventListener('DOMContentLoaded',()=>{
  const toolkitData={
    all:['TensorFlow','PyTorch','Keras','LLMs','Explainable AI','CNN','GNN','Python','MATLAB','Java','Embedded C/C++','OpenCV','YOLOv8','EasyOCR','Tesseract','Image Segmentation','Anomaly Detection','NLTK','TextBlob','Tokenization','Named Entity Recognition','MLflow','Docker','Git','Jira','Jenkins','Grafana','Azure','AWS','GCP','REST APIs','Microservices','FPGA','Arduino','STM32','Beaglebone Black','8052','PIC','MySQL','SQL','MongoDB','Cassandra'],
    programming:['Python','MATLAB','Java','Embedded C/C++'],
    ml:['TensorFlow','PyTorch','Keras','LLMs','Explainable AI','CNN','GNN'],
    imaging:['OpenCV','YOLOv8','EasyOCR','Tesseract','Image Segmentation','Anomaly Detection','SHAP','Grad-CAM'],
    databases:['MySQL','SQL','MongoDB','Cassandra'],
    cloud:['Azure','AWS','GCP','REST APIs','Microservices'],
    embedded:['FPGA','Arduino','STM32','Beaglebone Black','8052','PIC'],
    mlops:['MLflow','Docker','Git','Jira','Jenkins','Grafana']
  };
  const buttons=document.querySelectorAll('.toolkit-filter-btn');
  const items=document.getElementById('toolkit-items');
  const current=document.getElementById('toolkit-current');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    const key=btn.dataset.toolkit;
    buttons.forEach(b=>b.classList.toggle('active',b===btn));
    current.textContent=key.toUpperCase();
    items.innerHTML=toolkitData[key].map(item=>`<span>${item}</span>`).join('');
  }));

  const fab=document.getElementById('chatbot-fab');
  if(fab){
    const possible=document.querySelectorAll('.chat-toggle,.ai-assistant-btn,[aria-label*="assistant" i]');
    fab.addEventListener('click',()=>{
      const target=[...possible].find(el=>el!==fab);
      if(target){target.click();return;}
      const panel=document.querySelector('.chat-panel,#chatPanel,[data-chat-panel]');
      if(panel){
        panel.classList.add('open','active');
        panel.style.display='flex';
        panel.setAttribute('aria-hidden','false');
      }
    });
  }
});



document.addEventListener('DOMContentLoaded', () => {
  const toolkitData = {
    all:['Python','MATLAB','Java','Embedded C/C++','TensorFlow','PyTorch','Keras','LLMs','CNN','GNN','OpenCV','YOLOv8','EasyOCR','Tesseract','Image Segmentation','Anomaly Detection','SHAP','Grad-CAM','NLTK','TextBlob','Tokenization','Named Entity Recognition','MLflow','Docker','Git','Jira','Jenkins','Grafana','Azure','AWS','GCP','REST APIs','Microservices','FPGA','Arduino','STM32','Beaglebone Black','8052','PIC','MySQL','SQL','MongoDB','Cassandra'],
    programming:['Python','MATLAB','Java','Embedded C/C++'],
    ml:['TensorFlow','PyTorch','Keras','LLMs','CNN','GNN','Explainable AI'],
    imaging:['OpenCV','YOLOv8','EasyOCR','Tesseract','Image Segmentation','Anomaly Detection','SHAP','Grad-CAM'],
    databases:['MySQL','SQL','MongoDB','Cassandra'],
    cloud:['Azure','AWS','GCP','REST APIs','Microservices'],
    embedded:['FPGA','Arduino','STM32','Beaglebone Black','8052','PIC'],
    mlops:['MLflow','Docker','Git','Jira','Jenkins','Grafana']
  };
  const buttons=document.querySelectorAll('.toolkit-filter-btn');
  const items=document.getElementById('toolkit-items');
  const current=document.getElementById('toolkit-current');
  function renderToolkit(key){
    if(!items) return;
    current.textContent=key==='ml'?'ML / DL':key.charAt(0).toUpperCase()+key.slice(1);
    items.innerHTML=toolkitData[key].map(item=>`<span>${item}</span>`).join('');
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    buttons.forEach(b=>b.classList.toggle('active',b===btn));
    renderToolkit(btn.dataset.toolkit);
  }));
  renderToolkit('ml');

  const fab=document.getElementById('chatbot-fab');
  if(fab) fab.addEventListener('click',()=>{
    const panel=document.getElementById('chatPanel');
    const backdrop=document.getElementById('chatBackdrop');
    const opening=panel && !panel.classList.contains('open');
    if(panel){ panel.classList.toggle('open',opening); panel.setAttribute('aria-hidden',String(!opening)); }
    if(backdrop) backdrop.classList.toggle('open',opening);
    const input=document.getElementById('chatInput');
    if(opening && input) setTimeout(()=>input.focus(),180);
  });

});

document.addEventListener('DOMContentLoaded',()=>{
  const emailBtn=document.querySelector('.email-reveal-btn');
  const email=document.getElementById('contactEmail');
  if(emailBtn&&email) emailBtn.addEventListener('click',()=>{
    const show=email.hasAttribute('hidden');
    if(show) email.removeAttribute('hidden'); else email.setAttribute('hidden','');
    emailBtn.setAttribute('aria-expanded',String(show));
  });
});

/* Medical-AI neural background parallax layer */
(() => {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  let targetX=0,targetY=0,currentX=0,currentY=0,scrollTarget=0,scrollCurrent=0;
  window.addEventListener('pointermove', e => {
    targetX=(e.clientX/window.innerWidth-.5)*18;
    targetY=(e.clientY/window.innerHeight-.5)*12;
  }, {passive:true});
  window.addEventListener('scroll', () => {
    scrollTarget=window.scrollY;
  }, {passive:true});
  function parallax(){
    currentX += (targetX-currentX)*.035;
    currentY += (targetY-currentY)*.035;
    scrollCurrent += (scrollTarget-scrollCurrent)*.045;
    const depth = Math.min(scrollCurrent*.018, 24);
    canvas.style.transform=`translate3d(${currentX*.12}px,${currentY*.12-depth*.18}px,0)`;
    requestAnimationFrame(parallax);
  }
  parallax();
})();



/* Broader CV-grounded chatbot intent routing */
(function(){
 const original=window.getReply;
 if(typeof original!=='function') return;
 const cvReplies={
  bio:"Aravind Bommalata is a Machine Learning Engineer and Healthcare AI Researcher working across medical imaging, explainable AI, deep learning, NLP, MLOps, and embedded intelligence. His work focuses on building transparent, practical AI systems - especially for healthcare and early Alzheimer’s disease research.",
  experience:"Aravind has 10+ years of technology experience across machine learning, healthcare AI, embedded systems, and engineering roles, including Senior ML Engineer and ML Engineer positions.",
  education:"Aravind completed an MSc with Distinction at Coventry University in the United Kingdom. His background also includes engineering and embedded-systems training, supporting his transition into machine learning and healthcare AI.",
  birth:"I focus on research and engineering milestones rather than private biographical details. Aravind’s professional journey includes 10+ years of technology experience, an MSc with Distinction from Coventry University, and work in healthcare AI, explainable machine learning, and MLOps.",
  cv:"You can download Aravind Bommalata’s CV using the Download my CV button near the top of the portfolio or the Scan to Download CV QR code in the Contact section."
 };
 window.getReply=function(text){const q=String(text||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  if(/\b(who is|who s|tell me about|introduce|who is he|who he is)\b/.test(q)&&/aravind|he\b/.test(q))return cvReplies.bio;
  if(/\b(how many|number of|years|experience|worked|career|work history|last \d+ years)\b/.test(q))return cvReplies.experience;
  if(/\b(education|educational|studied|study|degree|qualification|academic|what did he study)\b/.test(q))return cvReplies.education;
  if(/\b(born|birth|age|how old|live|lives|location|where does he work from)\b/.test(q))return cvReplies.birth;
  if(/\b(download|access|get|show me|where is)\b/.test(q)&&/\b(cv|resume|curriculum vitae)\b/.test(q)||/\b(cv|resume)\b/.test(q)&&/\b(download|get)\b/.test(q))return cvReplies.cv;
  return original(text);
 };
})();
