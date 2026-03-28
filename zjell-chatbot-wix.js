/*!
 * ZJELL 3-Way Triage Chatbot
 * Wix-ready · Self-contained · No dependencies
 * Install: Wix Dashboard → Settings → Custom Code → Body - end → All pages
 * v2.0 | zjell.com
 */
(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────
  //  INJECT GOOGLE FONT
  // ─────────────────────────────────────────────────────────────
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@400;500&display=swap';
  document.head.appendChild(fontLink);

  // ─────────────────────────────────────────────────────────────
  //  STYLES
  // ─────────────────────────────────────────────────────────────
  const css = `
    #zjell-bubble {
      position:fixed;bottom:24px;right:24px;z-index:2147483647;
      width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;
      background:linear-gradient(145deg,#1a1f2e,#232940);
      box-shadow:0 0 0 1px rgba(99,179,237,.25),0 8px 32px rgba(0,0,0,.55),0 0 40px rgba(99,179,237,.08);
      display:flex;align-items:center;justify-content:center;
      transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;
      outline:none;font-family:'DM Sans',sans-serif;
    }
    #zjell-bubble:hover{transform:scale(1.1);box-shadow:0 0 0 1px rgba(99,179,237,.45),0 12px 40px rgba(0,0,0,.65),0 0 60px rgba(99,179,237,.15);}
    #zjell-bubble svg{position:absolute;transition:opacity .2s,transform .2s;}
    #zjell-bubble .zjb-open{opacity:1;transform:scale(1) rotate(0);}
    #zjell-bubble .zjb-close{opacity:0;transform:scale(.6) rotate(-45deg);}
    #zjell-bubble.zjopen .zjb-open{opacity:0;transform:scale(.6) rotate(45deg);}
    #zjell-bubble.zjopen .zjb-close{opacity:1;transform:scale(1) rotate(0);}
    #zjell-notif{
      position:absolute;top:-2px;right:-2px;
      width:17px;height:17px;border-radius:50%;
      background:linear-gradient(135deg,#f6ad55,#ed8936);
      border:2px solid #0b0e14;
      font-size:9px;font-weight:700;color:#fff;
      display:none;align-items:center;justify-content:center;
      animation:zjpulse 2s infinite;font-family:'DM Sans',sans-serif;
    }
    @keyframes zjpulse{0%,100%{box-shadow:0 0 0 0 rgba(246,173,85,.6)}50%{box-shadow:0 0 0 5px rgba(246,173,85,0)}}

    #zjell-win{
      position:fixed;bottom:96px;right:24px;z-index:2147483646;
      width:370px;max-height:610px;
      background:#12161f;
      border:1px solid rgba(255,255,255,.07);
      border-radius:20px;
      box-shadow:0 32px 80px rgba(0,0,0,.7);
      display:flex;flex-direction:column;overflow:hidden;
      transform:scale(.9) translateY(16px);
      opacity:0;pointer-events:none;
      transition:transform .28s cubic-bezier(.34,1.56,.64,1),opacity .2s;
      font-family:'DM Sans',sans-serif;
    }
    #zjell-win.zjopen{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}
    @media(max-width:480px){
      #zjell-win{width:calc(100vw - 14px);right:7px;bottom:90px;border-radius:16px;max-height:calc(100vh - 110px);}
      #zjell-bubble{bottom:16px;right:16px;}
    }

    /* Header */
    #zjell-hdr{
      padding:14px 16px 12px;flex-shrink:0;
      background:linear-gradient(135deg,#151a27 0%,#1a2035 100%);
      border-bottom:1px solid rgba(255,255,255,.06);
    }
    .zjhrow{display:flex;align-items:center;gap:10px;}
    .zjlogo{
      width:36px;height:36px;border-radius:9px;flex-shrink:0;
      background:linear-gradient(135deg,#1a5276,#2471a3);
      border:1px solid rgba(99,179,237,.3);
      display:flex;align-items:center;justify-content:center;
      font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#bee3f8;
      position:relative;
    }
    .zjlogo::after{content:'';position:absolute;bottom:-1px;right:-1px;width:9px;height:9px;border-radius:50%;background:#68d391;border:2px solid #151a27;}
    .zjhname{font-family:'Syne',sans-serif;font-size:13.5px;font-weight:600;color:#e2e8f0;letter-spacing:-.01em;}
    .zjhsub{font-size:11px;color:#718096;margin-top:1px;}
    .zjtag{
      margin-left:auto;font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;
      padding:3px 9px;border-radius:20px;transition:all .3s;white-space:nowrap;
      background:rgba(99,179,237,.1);color:#63b3ed;border:1px solid rgba(99,179,237,.2);
    }
    .zjtag.m{background:rgba(246,173,85,.12);color:#f6ad55;border-color:rgba(246,173,85,.25);}
    .zjtag.e{background:rgba(104,211,145,.1);color:#68d391;border-color:rgba(104,211,145,.2);}
    .zjtag.a{background:rgba(159,122,234,.1);color:#b794f4;border-color:rgba(159,122,234,.2);}
    .zjprog{height:2px;background:rgba(255,255,255,.06);margin-top:10px;border-radius:2px;overflow:hidden;display:none;}
    .zjpfill{height:100%;border-radius:2px;width:0%;transition:width .5s;}

    /* Messages */
    #zjell-msgs{flex:1;overflow-y:auto;padding:14px 13px;display:flex;flex-direction:column;gap:9px;scroll-behavior:smooth;background:#12161f;}
    #zjell-msgs::-webkit-scrollbar{width:3px;}
    #zjell-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,.07);border-radius:2px;}
    .zjmsg{display:flex;flex-direction:column;max-width:88%;animation:zjin .2s ease;}
    @keyframes zjin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .zjmsg.bot{align-self:flex-start;}
    .zjmsg.usr{align-self:flex-end;}
    .zjbub{padding:10px 13px;font-size:13px;line-height:1.58;border-radius:16px;}
    .zjmsg.bot .zjbub{background:#1c2235;color:#cbd5e0;border:1px solid rgba(255,255,255,.07);border-bottom-left-radius:4px;}
    .zjmsg.usr .zjbub{background:linear-gradient(135deg,#1a4a6e,#1e5a87);color:#bee3f8;border:1px solid rgba(99,179,237,.2);border-bottom-right-radius:4px;}
    .zjtime{font-size:10px;color:#4a5568;margin-top:3px;padding:0 3px;}
    .zjmsg.usr .zjtime{text-align:right;}
    .zjbub a{color:#63b3ed;text-decoration:underline;text-decoration-color:rgba(99,179,237,.4);text-underline-offset:2px;}
    .zjbub a:hover{color:#90cdf4;}

    /* Quick buttons */
    .zjqrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px;}
    .zjq{
      font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;
      padding:6px 12px;border-radius:20px;cursor:pointer;
      transition:all .15s;line-height:1;background:transparent;
    }
    .zjq.d{border:1px solid rgba(99,179,237,.35);color:#63b3ed;}
    .zjq.d:hover{background:rgba(99,179,237,.1);border-color:rgba(99,179,237,.6);transform:translateY(-1px);}
    .zjq.m{border:1px solid rgba(246,173,85,.35);color:#f6ad55;}
    .zjq.m:hover{background:rgba(246,173,85,.1);border-color:rgba(246,173,85,.6);transform:translateY(-1px);}
    .zjq.e{border:1px solid rgba(104,211,145,.35);color:#68d391;}
    .zjq.e:hover{background:rgba(104,211,145,.1);border-color:rgba(104,211,145,.6);transform:translateY(-1px);}
    .zjq.a{border:1px solid rgba(159,122,234,.35);color:#b794f4;}
    .zjq.a:hover{background:rgba(159,122,234,.1);border-color:rgba(159,122,234,.6);transform:translateY(-1px);}
    .zjq:active{transform:scale(.97)!important;}
    .zjq:disabled{opacity:.3;cursor:default;transform:none!important;}

    /* Typing */
    .zjtyping{background:#1c2235;border:1px solid rgba(255,255,255,.07);border-radius:16px;border-bottom-left-radius:4px;padding:11px 15px;display:flex;align-items:center;gap:4px;width:fit-content;}
    .zjtyping span{width:6px;height:6px;border-radius:50%;background:#4a5568;animation:zjdot 1.3s infinite;}
    .zjtyping span:nth-child(2){animation-delay:.18s;}
    .zjtyping span:nth-child(3){animation-delay:.36s;}
    @keyframes zjdot{0%,60%,100%{transform:scale(1);opacity:.5}30%{transform:scale(1.4);opacity:1}}

    /* Cards */
    .zjcard{background:#1a1f2e;border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:13px;margin-top:5px;}
    .zjcard-title{font-family:'Syne',sans-serif;font-size:12.5px;font-weight:600;color:#e2e8f0;margin-bottom:10px;}
    .zjcard input,.zjcard select{
      width:100%;font-size:12.5px;font-family:'DM Sans',sans-serif;
      padding:8px 11px;border-radius:8px;
      border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
      color:#e2e8f0;outline:none;margin-bottom:7px;
      transition:border-color .15s;-webkit-appearance:none;appearance:none;
      box-sizing:border-box;
    }
    .zjcard input::placeholder{color:#4a5568;}
    .zjcard input:focus,.zjcard select:focus{border-color:rgba(99,179,237,.5);background:rgba(99,179,237,.04);}
    .zjcard input.zjerr{border-color:rgba(252,129,129,.6);}
    .zjcard select{color:#e2e8f0;}
    .zjcard select option{background:#1a1f2e;color:#e2e8f0;}
    .zjr2{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
    .zjr2 input{margin-bottom:0;}

    /* Photo upload */
    .zjupload{border:1.5px dashed rgba(246,173,85,.3);border-radius:8px;padding:13px;text-align:center;cursor:pointer;margin-bottom:9px;transition:all .2s;background:rgba(246,173,85,.03);}
    .zjupload:hover{border-color:rgba(246,173,85,.6);background:rgba(246,173,85,.06);}
    .zjupload-text{font-size:11.5px;color:#a0aec0;line-height:1.4;margin-top:4px;}
    .zjupload-text strong{color:#f6ad55;}
    .zjprev{display:flex;gap:5px;flex-wrap:wrap;margin-top:7px;}
    .zjprev img{width:56px;height:56px;object-fit:cover;border-radius:6px;border:1px solid rgba(246,173,85,.3);}

    /* CTA buttons */
    .zjcta{
      width:100%;padding:10px;font-size:12.5px;font-weight:600;
      font-family:'Syne',sans-serif;border:none;border-radius:9px;
      cursor:pointer;transition:all .2s;letter-spacing:.01em;
      display:flex;align-items:center;justify-content:center;gap:6px;
      box-sizing:border-box;text-decoration:none;
    }
    .zjcta.mc{background:linear-gradient(135deg,#b7791f,#d69e2e);color:#fff8e1;box-shadow:0 4px 14px rgba(214,158,46,.3);}
    .zjcta.ec{background:linear-gradient(135deg,#276749,#38a169);color:#f0fff4;box-shadow:0 4px 14px rgba(56,161,105,.3);}
    .zjcta.ac{background:linear-gradient(135deg,#553c9a,#805ad5);color:#faf5ff;box-shadow:0 4px 14px rgba(128,90,213,.3);}
    .zjcta:hover{transform:translateY(-1px);filter:brightness(1.08);}
    .zjcta:active{transform:scale(.98);}
    .zjcta:disabled{opacity:.5;cursor:default;transform:none;}

    /* Success blocks */
    .zjok{border-radius:9px;padding:11px 13px;font-size:12.5px;line-height:1.55;}
    .zjok.m{background:rgba(246,173,85,.08);border:1px solid rgba(246,173,85,.2);color:#fbd38d;}
    .zjok.e{background:rgba(104,211,145,.08);border:1px solid rgba(104,211,145,.2);color:#9ae6b4;}
    .zjok.a{background:rgba(159,122,234,.08);border:1px solid rgba(159,122,234,.2);color:#d6bcfa;}
    .zjok strong{display:block;font-weight:600;margin-bottom:3px;font-size:13px;}
    .zjok a{color:inherit;text-decoration:underline;text-underline-offset:2px;}
    .zjnote{font-size:11px;color:#4a5568;text-align:center;margin-top:7px;line-height:1.5;}

    /* Input area */
    #zjell-inp-area{padding:9px 11px 11px;border-top:1px solid rgba(255,255,255,.05);background:#12161f;display:flex;align-items:flex-end;gap:7px;flex-shrink:0;}
    #zjell-inp{
      flex:1;resize:none;font-size:13px;font-family:'DM Sans',sans-serif;
      padding:8px 13px;border-radius:22px;max-height:88px;
      border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);
      color:#e2e8f0;outline:none;line-height:1.45;
      transition:border-color .15s;box-sizing:border-box;
    }
    #zjell-inp::placeholder{color:#4a5568;}
    #zjell-inp:focus{border-color:rgba(99,179,237,.4);background:rgba(99,179,237,.03);}
    #zjell-send{
      width:36px;height:36px;border-radius:50%;border:none;
      background:linear-gradient(135deg,#1a4a6e,#2b6cb0);
      border:1px solid rgba(99,179,237,.25);
      cursor:pointer;flex-shrink:0;
      display:flex;align-items:center;justify-content:center;
      transition:all .2s;
    }
    #zjell-send:hover{transform:scale(1.08);box-shadow:0 0 14px rgba(99,179,237,.25);}
    #zjell-send svg{width:15px;height:15px;fill:#bee3f8;}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ─────────────────────────────────────────────────────────────
  //  HTML STRUCTURE
  // ─────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.id = 'zjell-root';
  wrap.innerHTML = `
    <button id="zjell-bubble" aria-label="Open ZJELL chat">
      <svg class="zjb-open" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg class="zjb-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#63b3ed" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      <div id="zjell-notif">1</div>
    </button>

    <div id="zjell-win">
      <div id="zjell-hdr">
        <div class="zjhrow">
          <div class="zjlogo">Z</div>
          <div style="flex:1">
            <div class="zjhname">ZJELL Assistant</div>
            <div class="zjhsub">zjell.com · Online now</div>
          </div>
          <div class="zjtag" id="zjell-tag">ZJELL</div>
        </div>
        <div class="zjprog" id="zjell-prog"><div class="zjpfill" id="zjell-pfill"></div></div>
      </div>
      <div id="zjell-msgs"></div>
      <div id="zjell-inp-area">
        <textarea id="zjell-inp" placeholder="Type a message…" rows="1"></textarea>
        <button id="zjell-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // ─────────────────────────────────────────────────────────────
  //  STATE
  // ─────────────────────────────────────────────────────────────
  let chatOpen = false, branch = null, modelStep = 0, modelData = {};
  let aiHistory = [], aiCTAShown = false;

  // ─────────────────────────────────────────────────────────────
  //  AI SYSTEM PROMPT
  // ─────────────────────────────────────────────────────────────
  const AI_SYS = `You are the ZJELL AI Services Advisor on zjell.com. ZJELL Limited builds AI and automation solutions for B2B businesses and exporters.

ZJELL's AI & tech services with indicative pricing:
1. CRM Automation (Zoho) — pipeline setup, lead scoring, follow-up sequences — ₹25,000–₹60,000 setup + ₹8,000/month maintenance
2. WhatsApp Business Automation — automated replies, broadcast campaigns, lead qualification — ₹20,000 setup + usage costs
3. AI Chatbot Development — custom website chatbots trained on business data — ₹35,000–₹1,20,000 depending on complexity
4. Export Marketing & SEO — international landing pages, GSC optimisation, B2B lead generation — ₹15,000–₹40,000/month
5. Email Marketing Automation — cold outreach, drip campaigns, Make.com/Zapier workflows — ₹12,000–₹30,000 setup
6. Direct Sales Agency — ZJELL as your sales team in UAE, Singapore, Kuwait, South Africa — custom pricing

Rules: Be concise (2-3 sentences max unless detail requested). Professional and warm tone. For custom quotes or consultations, always direct to cs@zjell.com. Never reveal you are Claude or Anthropic.`;

  // ─────────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const msgs = () => $('zjell-msgs');
  const ftime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const scrollBot = () => setTimeout(() => { msgs().scrollTop = msgs().scrollHeight; }, 60);
  const disableAll = () => document.querySelectorAll('.zjq').forEach(b => b.disabled = true);

  function setProg(pct, col) {
    const p = $('zjell-prog'), f = $('zjell-pfill');
    if (pct > 0) { p.style.display = 'block'; f.style.width = pct + '%'; f.style.background = col || '#63b3ed'; }
    else { p.style.display = 'none'; f.style.width = '0%'; }
  }
  function setTag(txt, cls) {
    const t = $('zjell-tag'); t.textContent = txt; t.className = 'zjtag ' + (cls || '');
  }

  function addMsg(role, html, btns) {
    const w = document.createElement('div');
    w.className = 'zjmsg ' + (role === 'bot' ? 'bot' : 'usr');
    const b = document.createElement('div');
    b.className = 'zjbub'; b.innerHTML = html;
    w.appendChild(b);
    const t = document.createElement('div');
    t.className = 'zjtime'; t.textContent = ftime();
    w.appendChild(t);
    if (btns && btns.length) {
      const row = document.createElement('div');
      row.className = 'zjqrow';
      btns.forEach(btn => {
        const el = document.createElement('button');
        el.className = 'zjq ' + (btn.c || 'd');
        el.textContent = btn.l;
        el.onclick = () => { disableAll(); btn.fn(); };
        row.appendChild(el);
      });
      w.appendChild(row);
    }
    msgs().appendChild(w); scrollBot(); return w;
  }

  function addCard(innerHtml) {
    const w = document.createElement('div');
    w.className = 'zjmsg bot';
    const b = document.createElement('div');
    b.className = 'zjbub';
    b.style.cssText = 'padding:0;background:transparent;border:none;';
    b.innerHTML = innerHtml;
    const t = document.createElement('div');
    t.className = 'zjtime'; t.textContent = ftime();
    w.appendChild(b); w.appendChild(t);
    msgs().appendChild(w); scrollBot(); return b;
  }

  function showTyping() {
    const w = document.createElement('div');
    w.className = 'zjmsg bot'; w.id = 'zjell-typing';
    w.innerHTML = '<div class="zjtyping"><span></span><span></span><span></span></div>';
    msgs().appendChild(w); scrollBot();
  }
  function removeTyping() { const t = $('zjell-typing'); if (t) t.remove(); }

  // ─────────────────────────────────────────────────────────────
  //  TOGGLE
  // ─────────────────────────────────────────────────────────────
  function toggleChat() {
    chatOpen = !chatOpen;
    $('zjell-win').classList.toggle('zjopen', chatOpen);
    $('zjell-bubble').classList.toggle('zjopen', chatOpen);
    $('zjell-notif').style.display = 'none';
    if (chatOpen && !msgs().children.length) welcome();
  }
  $('zjell-bubble').addEventListener('click', toggleChat);

  // ─────────────────────────────────────────────────────────────
  //  WELCOME
  // ─────────────────────────────────────────────────────────────
  function welcome() {
    setTimeout(() => {
      addMsg('bot', `👋 Welcome to <strong style="color:#e2e8f0">ZJELL</strong>!<br>How can we help you today?`, [
        { l: '🎭 Model Registration', c: 'm', fn: () => { addMsg('usr','🎭 Model Registration'); startModel(); } },
        { l: '🌍 Export Consulting',  c: 'e', fn: () => { addMsg('usr','🌍 Export Consulting');  startExport(); } },
        { l: '🤖 AI & Tech Services', c: 'a', fn: () => { addMsg('usr','🤖 AI & Tech Services'); startAI(); } },
      ]);
    }, 350);
  }

  // ─────────────────────────────────────────────────────────────
  //  BRANCH 1 — MODEL REGISTRATION (rule-based)
  // ─────────────────────────────────────────────────────────────
  function startModel() {
    branch = 'model'; modelStep = 0; modelData = {};
    setTag('Model Registration', 'm'); setProg(10, '#d69e2e');
    setTimeout(() => {
      addMsg('bot', `Great! Let's get you registered with ZJELL's modeling network. I'll collect a few details, then send you to our <strong style="color:#f6ad55">free registration form</strong>. 🌟`);
      setTimeout(askCity, 600);
    }, 450);
  }

  function askCity() {
    setProg(18, '#d69e2e'); modelStep = 1;
    addMsg('bot', `Which <strong style="color:#f6ad55">city</strong> are you based in?`, [
      { l:'Mumbai',      c:'m', fn: () => saveField('city','Mumbai') },
      { l:'Delhi',       c:'m', fn: () => saveField('city','Delhi') },
      { l:'London',      c:'m', fn: () => saveField('city','London') },
      { l:'Guangzhou',     c:'m', fn: () => saveField('city','Guangzhou') },
      { l:'Nairobi',     c:'m', fn: () => saveField('city','Nairobi') },
      { l:'Dubai',       c:'m', fn: () => saveField('city','Dubai') },
      { l:'Other city…', c:'m', fn: () => addMsg('bot','Type your city below and press Enter.') },
    ]);
  }

  function saveField(f, v) {
    modelData[f] = v; addMsg('usr', v);
    if (f === 'city')   { setProg(32,'#d69e2e'); askAge(); }
    else if (f === 'age')    { setProg(48,'#d69e2e'); askGender(); }
    else if (f === 'gender') { setProg(62,'#d69e2e'); askMobile(); }
  }

  function askAge() {
    modelStep = 2;
    addMsg('bot', `Your <strong style="color:#f6ad55">age</strong>?`, [
      { l:'16–18', c:'m', fn: () => saveField('age','16–18') },
      { l:'19–22', c:'m', fn: () => saveField('age','19–22') },
      { l:'23–27', c:'m', fn: () => saveField('age','23–27') },
      { l:'28–35', c:'m', fn: () => saveField('age','28–35') },
    ]);
  }
  function askGender() {
    modelStep = 3;
    addMsg('bot', `Your <strong style="color:#f6ad55">gender</strong>?`, [
      { l:'Female',           c:'m', fn: () => saveField('gender','Female') },
      { l:'Male',             c:'m', fn: () => saveField('gender','Male') },
      { l:'Non-binary/Other', c:'m', fn: () => saveField('gender','Non-binary/Other') },
    ]);
  }
  function askMobile() {
    modelStep = 4;
    addMsg('bot', `Your <strong style="color:#f6ad55">WhatsApp / mobile number</strong>?<br><span style="font-size:11.5px;color:#718096">Include country code e.g. +91 98765 43210</span>`);
  }
  function askEmail() {
    modelStep = 5; setProg(75,'#d69e2e');
    addMsg('bot', `Your <strong style="color:#f6ad55">email address</strong>?`);
  }
  function askPhotos() {
    modelStep = 6; setProg(88,'#d69e2e');
    addCard(`
      <div class="zjcard">
        <div class="zjcard-title">📸 Upload 1–2 photos (optional)</div>
        <div style="font-size:11.5px;color:#718096;margin-bottom:9px;line-height:1.5">A clear face photo + one full-length photo.<br><em>You can also upload on the registration form.</em></div>
        <label class="zjupload" for="zjell-file">
          <input type="file" id="zjell-file" accept="image/*" multiple style="display:none" onchange="window._zjPhoto(event)">
          <div style="font-size:20px">🖼️</div>
          <div class="zjupload-text"><strong>Tap to select photos</strong><br>JPG or PNG · max 5MB each</div>
          <div class="zjprev" id="zjell-prev"></div>
        </label>
        <button class="zjcta mc" id="zjell-next" onclick="window._zjPhotoNext()">Continue → Complete Registration</button>
      </div>`);
  }

  window._zjPhoto = function(e) {
    const files = Array.from(e.target.files).slice(0,2);
    const prev = $('zjell-prev'); if (!prev) return;
    prev.innerHTML = '';
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => { const img = document.createElement('img'); img.src = ev.target.result; prev.appendChild(img); };
      r.readAsDataURL(f);
    });
    modelData.photos = files.length;
  };

  window._zjPhotoNext = function() {
    const btn = $('zjell-next'); if (btn) btn.disabled = true;
    setProg(100,'#d69e2e'); modelStep = 7;
    setTimeout(() => {
      setProg(0);
      addMsg('bot', `✅ <strong style="color:#f6ad55">Details saved!</strong><br><span style="color:#718096;font-size:12px">📍 ${modelData.city||'—'} · 🎂 ${modelData.age||'—'} · ${modelData.gender||'—'}<br>📱 ${modelData.mobile||'—'} · ✉️ ${modelData.email||'—'}</span>`);
      setTimeout(showModelCTA, 500);
    }, 700);
  };

  function showModelCTA() {
    addCard(`
      <div class="zjok m"><strong>🌟 One last step — complete your free registration!</strong>
        Click below to open the official ZJELL registration form. It's <strong>100% free</strong> — no charges ever.</div>
      <div style="height:7px"></div>
      <a href="https://www.zjell.com/services/modeling-agency-join" target="_blank" class="zjcta mc" style="margin-top:0;display:flex;text-decoration:none">
        🔗 Open Free Registration Form ↗
      </a>
      <div class="zjnote">zjell.com/services/modeling-agency-join<br>Fill your details &amp; photos on the form.</div>`);
  }

  // ─────────────────────────────────────────────────────────────
  //  BRANCH 2 — EXPORT CONSULTING (direct to form)
  // ─────────────────────────────────────────────────────────────
  function startExport() {
    branch = 'export'; setTag('Export Consulting','e'); setProg(50,'#38a169');
    setTimeout(() => {
      addMsg('bot', `You're in the right place. ZJELL has helped businesses break into <strong style="color:#9ae6b4">58+ countries</strong> across Gulf, UK, Africa &amp; SE Asia.<br><br>Please submit your enquiry through our dedicated form — our team responds within <strong>1 business day</strong>.`);
      setTimeout(showExportCTA, 600);
    }, 450);
  }

  function showExportCTA() {
    setProg(0);
    addCard(`
      <div class="zjok e"><strong>🌍 Submit your export enquiry</strong>
        Our form captures your product, target market and timeline so the right consultant handles your case.</div>
      <div style="height:7px"></div>
      <a href="https://www.zjell.com/services/import-export-consultant" target="_blank" class="zjcta ec" style="display:flex;text-decoration:none">
        📋 Open Enquiry Form ↗
      </a>
      <div class="zjnote">zjell.com/services/import-export-consultant</div>`);
    setTimeout(() => {
      addMsg('bot', `Have a quick question first?`, [
        { l:'What services do you offer?', c:'e', fn: () => exportFAQ('services') },
        { l:'How much does it cost?',       c:'e', fn: () => exportFAQ('cost') },
        { l:'Which markets do you cover?',  c:'e', fn: () => exportFAQ('markets') },
      ]);
    }, 600);
  }

  const exportAnswers = {
    services: `ZJELL covers four areas:<br><br>
      <strong style="color:#9ae6b4">1. Documentation</strong> — IEC, DGFT, HS codes, Certificates of Origin, LC advisory<br>
      <strong style="color:#9ae6b4">2. Market Entry &amp; Buyers</strong> — verified importers in UAE, UK, Saudi, Kenya, Singapore &amp; more<br>
      <strong style="color:#9ae6b4">3. Logistics &amp; Finance</strong> — Incoterms, freight, trade finance instruments<br>
      <strong style="color:#9ae6b4">4. International Marketing</strong> — export landing pages, B2B lead generation`,
    cost: `Our packages start at:<br><br>
      <strong style="color:#9ae6b4">Starter</strong> — Documentation only: ₹15,000–₹30,000 one-time<br>
      <strong style="color:#9ae6b4">Growth</strong> — Market entry + buyer ID: ₹40,000–₹80,000/month<br>
      <strong style="color:#9ae6b4">Enterprise</strong> — Full setup + ongoing support: custom pricing<br><br>
      <em style="color:#718096">Exact pricing depends on product, market &amp; volume. Submit the form for a tailored quote.</em>`,
    markets: `Our strongest markets:<br><br>
      🇦🇪 <strong style="color:#9ae6b4">Gulf</strong> — UAE, Saudi, Qatar, Kuwait<br>
      🇬🇧 <strong style="color:#9ae6b4">UK &amp; Europe</strong> — ZJELL has a UK entity (Wedge Group Ltd)<br>
      🌍 <strong style="color:#9ae6b4">Africa</strong> — Kenya, Nigeria, South Africa, Ghana<br>
      🌏 <strong style="color:#9ae6b4">SE Asia</strong> — Singapore, Malaysia, Philippines<br>
      🇺🇸 <strong style="color:#9ae6b4">USA &amp; Canada</strong> — growing pipeline`
  };

  function exportFAQ(key) {
    const label = { services:'What services do you offer?', cost:'How much does it cost?', markets:'Which markets do you cover?' };
    addMsg('usr', label[key]);
    setTimeout(() => addMsg('bot', exportAnswers[key]), 400);
  }

  // ─────────────────────────────────────────────────────────────
  //  BRANCH 3 — AI SERVICES (Claude-powered hybrid)
  // ─────────────────────────────────────────────────────────────
  function startAI() {
    branch = 'ai'; setTag('AI & Tech Services','a'); setProg(30,'#805ad5');
    setTimeout(() => {
      addMsg('bot', `ZJELL builds AI and automation solutions for exporters and B2B businesses.<br><br>Which area interests you?`, [
        { l:'CRM Automation',         c:'a', fn: () => aiQ('I want CRM automation with Zoho for my business') },
        { l:'WhatsApp Automation',    c:'a', fn: () => aiQ('I want to automate WhatsApp for lead generation') },
        { l:'AI Chatbot for website', c:'a', fn: () => aiQ('I want to build an AI chatbot for my website') },
        { l:'Export SEO & Marketing', c:'a', fn: () => aiQ('I want export digital marketing and SEO to get more international enquiries') },
        { l:'Something else…',        c:'a', fn: () => addMsg('bot','Tell me what you need and I\'ll explain what ZJELL can do.') },
      ]);
    }, 450);
  }

  function aiQ(msg) { addMsg('usr', msg); callAI(msg); }

  async function callAI(msg) {
    aiHistory.push({ role:'user', content: msg });
    setProg(60,'#805ad5'); showTyping();
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system: AI_SYS,
          messages: aiHistory
        })
      });
      const data = await res.json();
      removeTyping();
      const reply = data.content?.find(b => b.type==='text')?.text || 'Brief issue — please email cs@zjell.com directly.';
      aiHistory.push({ role:'assistant', content: reply });
      setProg(100,'#805ad5'); setTimeout(() => setProg(0), 800);
      addMsg('bot', reply.replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>'));
      if (!aiCTAShown) {
        aiCTAShown = true;
        setTimeout(showAICTA, 500);
      }
    } catch(err) {
      removeTyping(); setProg(0);
      addMsg('bot', `Brief connectivity issue. Email us at <a href="mailto:cs@zjell.com">cs@zjell.com</a> — we respond within 4 hours.`);
    }
  }

  function showAICTA() {
    addCard(`
      <div class="zjok a"><strong>✉️ Get a custom quote</strong>
        Email our tech team at <a href="mailto:cs@zjell.com"><strong>cs@zjell.com</strong></a> with a brief description of what you need. We'll respond within 1 business day with a scoped proposal.</div>
      <div style="height:7px"></div>
      <a href="mailto:cs@zjell.com?subject=AI%20Services%20Enquiry%20%E2%80%94%20ZJELL&body=Hi%20ZJELL%20team%2C%0A%0AI%27m%20interested%20in%20your%20AI%20services.%20Here%27s%20what%20I%20need%3A%0A%0A%5BDescribe%20your%20requirement%5D%0A%0AThank%20you" class="zjcta ac" style="display:flex;text-decoration:none">
        ✉️ Email cs@zjell.com ↗
      </a>
      <div class="zjnote">Opens your email app with a pre-filled subject line.</div>`);
  }

  // ─────────────────────────────────────────────────────────────
  //  FREE-TEXT ROUTER
  // ─────────────────────────────────────────────────────────────
  function handleText() {
    const el = $('zjell-inp');
    const txt = el.value.trim(); if (!txt) return;
    el.value = ''; el.style.height = 'auto';
    disableAll(); addMsg('usr', txt);

    if (branch === 'model') {
      if (modelStep === 1)      { modelData.city = txt;   setProg(32,'#d69e2e'); askAge(); }
      else if (modelStep === 2) { modelData.age = txt;    setProg(48,'#d69e2e'); askGender(); }
      else if (modelStep === 3) { modelData.gender = txt; setProg(62,'#d69e2e'); askMobile(); }
      else if (modelStep === 4) { modelData.mobile = txt; askEmail(); }
      else if (modelStep === 5) { modelData.email = txt;  askPhotos(); }
      else addMsg('bot','Your details are collected! Tap the registration form button above. 🌟');
      return;
    }

    if (branch === 'export') {
      const l = txt.toLowerCase();
      if (/service|offer|what do/i.test(l))       exportFAQ('services');
      else if (/cost|fee|price|how much/i.test(l)) exportFAQ('cost');
      else if (/market|country|where|cover/i.test(l)) exportFAQ('markets');
      else addMsg('bot', `For detailed answers our consultants are best placed to help. Please <a href="https://www.zjell.com/services/import-export-consultant" target="_blank">submit the enquiry form ↗</a> — response within 1 business day.`);
      return;
    }

    if (branch === 'ai') { callAI(txt); return; }

    // No branch — auto-detect
    if (/model|talent|casting|fashion|ramp|face.?model/i.test(txt))         startModel();
    else if (/export|import|dgft|iec|hs.?code|trade|buyer|consult/i.test(txt)) startExport();
    else if (/ai|chatbot|crm|whatsapp.*auto|automation|seo|digital/i.test(txt)) startAI();
    else addMsg('bot', `I can help with one of these — which applies to you?`, [
      { l:'🎭 Model Registration', c:'m', fn: () => { disableAll(); startModel(); } },
      { l:'🌍 Export Consulting',  c:'e', fn: () => { disableAll(); startExport(); } },
      { l:'🤖 AI & Tech Services', c:'a', fn: () => { disableAll(); startAI(); } },
    ]);
  }

  $('zjell-send').addEventListener('click', handleText);
  $('zjell-inp').addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleText(); } });
  $('zjell-inp').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 88) + 'px';
  });

  // ─────────────────────────────────────────────────────────────
  //  NOTIFICATION BADGE (appears after 3s if chat not opened)
  // ─────────────────────────────────────────────────────────────
  setTimeout(() => {
    if (!chatOpen) {
      const n = $('zjell-notif');
      n.style.display = 'flex';
    }
  }, 3000);

})();
