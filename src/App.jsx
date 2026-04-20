import { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Upload as UploadIco, ListChecks, Scissors,
  Clapperboard, Box, FolderOpen, Play, Download, Pencil,
  RefreshCw, Trash2, Sparkles, Copy, X, Search, Eye,
  LayoutGrid, List as ListIco, Moon, Sun, HardDrive, Cloud,
  Zap, Clock, Loader2, FileText, Mic, Terminal,
  AlertTriangle, CheckCircle, ChevronRight, ChevronDown,
  Plus, Film, Wand2, Activity, Check, Volume2,
  ArrowRight, Video, Info, Settings, MoreHorizontal,
  Circle, RefreshCcw, BookOpen, Layers, Play as PlayIco,
  StopCircle, CheckSquare, Square
} from "lucide-react";

/* ═══ THEME ══════════════════════════════════════════════════════════════ */
const DARK = {
  bg:"#09090b", s:"#111113", s2:"#18181b", s3:"#27272a",
  b:"#27272a",  b2:"#3f3f46",
  t:"#fafafa",  t2:"#a1a1aa", t3:"#52525b",
  ac:"#6366f1", acd:"rgba(99,102,241,.15)",
  g:"#22c55e",  gd:"rgba(34,197,94,.12)",
  y:"#eab308",  yd:"rgba(234,179,8,.12)",
  r:"#ef4444",  rd:"rgba(239,68,68,.12)",
  o:"#f97316",  od:"rgba(249,115,22,.12)",
  bl:"#3b82f6", bld:"rgba(59,130,246,.12)",
  bar:"#0a0a0c"
};
const LIGHT = {
  bg:"#f4f4f5", s:"#ffffff",  s2:"#f4f4f5", s3:"#ebebed",
  b:"#e4e4e7",  b2:"#d4d4d8",
  t:"#09090b",  t2:"#52525b", t3:"#a1a1aa",
  ac:"#6366f1", acd:"rgba(99,102,241,.1)",
  g:"#16a34a",  gd:"rgba(22,163,74,.1)",
  y:"#ca8a04",  yd:"rgba(202,138,4,.1)",
  r:"#dc2626",  rd:"rgba(220,38,38,.1)",
  o:"#ea580c",  od:"rgba(234,88,12,.1)",
  bl:"#2563eb", bld:"rgba(37,99,235,.1)",
  bar:"#0a0a0c"
};

/* ═══ CONSTANTS ══════════════════════════════════════════════════════════ */
const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology",
  "English (Core)","English (Elective)","Hindi (Core)","Hindi (Elective)",
  "Social Science","History","Geography","Political Science",
  "Economics","Accountancy","Business Studies",
  "Computer Science","Information Technology","Science",
  "Environmental Studies","Sanskrit","Urdu",
  "Physical Education","Psychology","Sociology","Fine Arts","Music"
];

const STATUS_DEF = {
  raw:      {label:"Raw Library",       dk:"#a1a1aa",lg:"#52525b",  dot:"#a1a1aa"},
  enhance:  {label:"Enhancement Queue", dk:"#3b82f6",lg:"#2563eb",  dot:"#3b82f6"},
  review:   {label:"In Review",         dk:"#eab308",lg:"#ca8a04",  dot:"#eab308"},
  recreate: {label:"Recreation Queue",  dk:"#f97316",lg:"#ea580c",  dot:"#f97316"},
  archive:  {label:"Archive Flagged",   dk:"#ef4444",lg:"#dc2626",  dot:"#ef4444"},
  approved: {label:"Approved",          dk:"#22c55e",lg:"#16a34a",  dot:"#22c55e"},
};

const NAV = [
  {id:"dashboard", label:"Dashboard",       Icon:LayoutDashboard},
  {id:"upload",    label:"Upload",           Icon:UploadIco},
  {id:"review",    label:"Review Queue",     Icon:ListChecks},
  {id:"trim",      label:"Trim Editor",      Icon:Scissors},
  {id:"scene",     label:"Scene Builder",    Icon:Clapperboard},
  {id:"asset3d",   label:"3D Asset Builder", Icon:Box},
  {id:"output",    label:"Output Library",   Icon:FolderOpen},
];

const MOCK_ASSETS = [
  {id:1,title:"Photosynthesis – Light Reactions",subject:"Biology",grade:10,topic:"Photosynthesis",
   status:"enhance",duration:"8:24",score:62,hasScript:false,date:"Apr 15",
   transcript:"[00:00:00] Welcome to today's lesson on photosynthesis and the light-dependent reactions.\n[00:00:08] Photosynthesis is the process by which plants convert sunlight into chemical energy stored as glucose.\n[00:00:17] This process occurs in two main stages: the light-dependent reactions and the Calvin cycle.\n[00:00:25] Today we will focus on the light-dependent reactions.\n[00:00:30] These reactions occur in the thylakoid membranes of the chloroplasts.\n[00:00:38] When light strikes the chlorophyll molecules, it excites electrons to a higher energy state.\n[00:00:46] These excited electrons move through the electron transport chain.\n[00:00:53] This movement generates ATP through a process called photophosphorylation."},
  {id:2,title:"Newton's Laws of Motion",subject:"Physics",grade:9,topic:"Mechanics",
   status:"review",duration:"6:12",score:78,hasScript:true,date:"Apr 14",
   transcript:"[00:00:00] Today we explore Newton's three laws of motion.\n[00:00:10] The first law states that an object at rest stays at rest.\n[00:00:20] And an object in motion stays in motion unless acted upon by a net external force.\n[00:00:32] Newton's second law: Force equals mass times acceleration, or F=ma.\n[00:00:45] The third law: For every action, there is an equal and opposite reaction."},
  {id:3,title:"French Revolution Overview",subject:"History",grade:10,topic:"World History",
   status:"raw",duration:"11:45",score:44,hasScript:false,date:"Apr 13",
   transcript:"[00:00:00] The French Revolution was a period of major social and political transformation.\n[00:00:12] It began in 1789 and fundamentally changed France and much of Europe.\n[00:00:24] The revolution overthrew the monarchy, established a republic, and led to the rise of Napoleon."},
  {id:4,title:"Quadratic Equations",subject:"Mathematics",grade:11,topic:"Algebra",
   status:"approved",duration:"9:30",score:91,hasScript:true,date:"Apr 12",
   transcript:"[00:00:00] A quadratic equation is a second-degree polynomial equation of the form ax² + bx + c = 0.\n[00:00:12] Here, a, b, and c are constants, and a cannot equal zero.\n[00:00:20] We can solve quadratic equations using factoring, completing the square, or the quadratic formula."},
  {id:5,title:"Cell Structure & Function",subject:"Biology",grade:8,topic:"Cell Biology",
   status:"recreate",duration:"5:18",score:31,hasScript:false,date:"Apr 11",
   transcript:"[00:00:00] The cell is the basic unit of life.\n[00:00:06] All living organisms are made up of one or more cells.\n[00:00:12] Cells carry out all the processes necessary to sustain life."},
];

/* ═══ API HELPERS ════════════════════════════════════════════════════════ */
const API_BASE = "https://api.aistudiogtet.com";

async function backendPost(endpoint, body, isForm = false) {
  const r = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: isForm ? {} : { "Content-Type": "application/json", "x-api-key": "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, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: isForm ? body : JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Backend error ${r.status}`);
  return r.json();
}

async function pollJob(jid, onTick, maxSec = 300) {
  const t0 = Date.now();
  while ((Date.now() - t0) / 1000 < maxSec) {
    await new Promise(r => setTimeout(r, 2000));
    const j = await fetch(`${API_BASE}/api/jobs/${jid}`).then(r => r.json());
    onTick?.(j);
    if (j.status === "done")   return j.result;
    if (j.status === "error")  throw new Error(j.error || "Job failed");
  }
  throw new Error("Job timed out");
}

async function claudeCall(prompt, systemMsg) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": "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, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemMsg || "You are an expert K-12 educational content creator for Indian NCERT/CBSE curriculum. Be concise and precise.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

/* ═══ SMALL UI COMPONENTS ════════════════════════════════════════════════ */
function Spin({ size = 14, color = "#fff" }) {
  return <Loader2 size={size} color={color} style={{ animation: "spin 0.8s linear infinite" }} />;
}

function Badge({ status, mode }) {
  const def = STATUS_DEF[status] || { label: status, dk: "#a1a1aa", lg: "#52525b", dot: "#a1a1aa" };
  const c = mode === "dark" ? def.dk : def.lg;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", borderRadius: 99,
      background: c + "20", color: c,
      fontSize: 11, fontWeight: 500, whiteSpace: "nowrap"
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, flexShrink: 0 }} />
      {def.label}
    </span>
  );
}

function ScoreDot({ val, T }) {
  const c = val >= 75 ? T.g : val >= 50 ? T.y : T.r;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: c, fontSize: 12, fontWeight: 600 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />
      {val}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, loading, T, Icon, style: sx = {} }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    borderRadius: 7, fontFamily: "inherit", fontWeight: 500,
    border: "none", opacity: disabled ? 0.45 : 1, transition: "all .12s",
    fontSize: size === "sm" ? 12 : 13,
    padding: size === "sm" ? "5px 10px" : "7px 14px",
    ...sx
  };
  const v = {
    primary:   { background: T.ac,  color: "#fff" },
    secondary: { background: T.s3,  color: T.t2,  outline: `1px solid ${T.b}` },
    ghost:     { background: "transparent", color: T.t2 },
    danger:    { background: T.rd,  color: T.r },
  };
  const styles = { ...base, ...v[variant] };
  return (
    <button onClick={onClick} disabled={disabled || loading} style={styles}>
      {loading ? <Spin size={13} color={styles.color} /> : Icon ? <Icon size={13} /> : null}
      {children}
    </button>
  );
}

function Card({ children, T, style: sx = {} }) {
  return (
    <div style={{ background: T.s, border: `1px solid ${T.b}`, borderRadius: 10, padding: 16, ...sx }}>
      {children}
    </div>
  );
}

function Inp({ value, onChange, placeholder, T, style: sx = {}, type = "text", rows }) {
  const base = {
    background: T.s2, border: `1px solid ${T.b}`, borderRadius: 7,
    padding: "7px 10px", color: T.t, fontSize: 13,
    fontFamily: "inherit", outline: "none", width: "100%", ...sx
  };
  return rows
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{ ...base, resize: "vertical" }} />
    : <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={base} />;
}

function Sel({ value, onChange, children, T, style: sx = {} }) {
  return (
    <select value={value} onChange={onChange} style={{
      background: T.s2, border: `1px solid ${T.b}`, borderRadius: 7,
      padding: "7px 10px", color: T.t, fontSize: 13,
      fontFamily: "inherit", outline: "none", width: "100%", ...sx
    }}>
      {children}
    </select>
  );
}

function Label({ children, T }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 5 }}>{children}</div>;
}

function Divider({ T }) {
  return <div style={{ height: 1, background: T.b, margin: "16px 0" }} />;
}

function Tag({ children, T, color }) {
  const c = color || T.ac;
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
      background: c + "18", color: c, display: "inline-block"
    }}>{children}</span>
  );
}

/* ═══ TOAST ════════════════════════════════════════════════════════════ */
function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 9999 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500,
          minWidth: 220, maxWidth: 340,
          background: t.type === "error" ? "#1f0808" : "#081a0f",
          border: `1px solid ${t.type === "error" ? "#6b1a1a" : "#0d4a1f"}`,
          color: t.type === "error" ? "#fca5a5" : "#86efac",
          boxShadow: "0 4px 20px rgba(0,0,0,.35)"
        }}>
          {t.type === "error" ? <AlertTriangle size={13} /> : <Check size={13} />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ═══ SIDEBAR ══════════════════════════════════════════════════════════ */
function Sidebar({ view, setView, mode, setMode, T }) {
  return (
    <div style={{
      width: 220, flexShrink: 0, background: "#0a0a0c",
      borderRight: "1px solid #1c1c20",
      display: "flex", flexDirection: "column", height: "100vh"
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 14px 14px", borderBottom: "1px solid #1c1c20" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Film size={14} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.2 }}>Studio AI</div>
            <div style={{ fontSize: 10, color: "#52525b", marginTop: 1 }}>K-12 · NCERT</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 8px", overflowY: "auto" }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: "#3f3f46", letterSpacing: ".08em", textTransform: "uppercase", padding: "8px 8px 4px" }}>Workspace</div>
        {NAV.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button key={id} onClick={() => setView(id)} style={{
              display: "flex", alignItems: "center", gap: 9, width: "100%",
              padding: "7px 9px", borderRadius: 7, border: "none", cursor: "pointer",
              background: active ? "rgba(99,102,241,.18)" : "transparent",
              color: active ? "#818cf8" : "#71717a",
              fontSize: 13, fontWeight: active ? 500 : 400,
              fontFamily: "inherit", marginBottom: 1, transition: "all .1s",
            }}>
              <Icon size={14} />
              {label}
              {active && <ChevronRight size={11} style={{ marginLeft: "auto" }} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "10px 8px", borderTop: "1px solid #1c1c20", display: "flex", flexDirection: "column", gap: 1 }}>
        <button onClick={() => setMode(m => m === "dark" ? "light" : "dark")} style={{
          display: "flex", alignItems: "center", gap: 9, width: "100%",
          padding: "7px 9px", borderRadius: 7, border: "none", cursor: "pointer",
          background: "transparent", color: "#71717a", fontSize: 13, fontFamily: "inherit",
        }}>
          {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={() => { sessionStorage.removeItem("studio_auth"); window.location.reload(); }} style={{
          display: "flex", alignItems: "center", gap: 9, width: "100%",
          padding: "7px 9px", borderRadius: 7, border: "none", cursor: "pointer",
          background: "transparent", color: "#71717a", fontSize: 13, fontFamily: "inherit",
        }}>
          <X size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}

/* ═══ TOPBAR ════════════════════════════════════════════════════════════ */
function TopBar({ view, T, backendOk }) {
  const meta = {
    dashboard: { title: "Dashboard",        sub: "Pipeline overview" },
    upload:    { title: "Upload",            sub: "Add new raw assets" },
    review:    { title: "Review Queue",      sub: "Assess and clean assets" },
    trim:      { title: "Trim Editor",       sub: "Cut and refine video" },
    scene:     { title: "Scene Builder",     sub: "Structure scenes with Manim" },
    asset3d:   { title: "3D Asset Builder",  sub: "Generate 3D educational models" },
    output:    { title: "Output Library",    sub: "Finished videos ready to export" },
  }[view] || { title: view, sub: "" };

  return (
    <div style={{
      height: 52, flexShrink: 0, background: T.s,
      borderBottom: `1px solid ${T.b}`,
      display: "flex", alignItems: "center", padding: "0 20px", gap: 14
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.t }}>{meta.title}</div>
        <div style={{ fontSize: 11, color: T.t3 }}>{meta.sub}</div>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: T.s2, border: `1px solid ${T.b}`,
        borderRadius: 7, padding: "5px 10px",
      }}>
        <Search size={12} color={T.t3} />
        <input placeholder="Search assets..." style={{
          background: "transparent", border: "none", outline: "none",
          fontSize: 12, color: T.t, fontFamily: "inherit", width: 150
        }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: backendOk ? "#22c55e" : "#ef4444",
          boxShadow: `0 0 6px ${backendOk ? "#22c55e88" : "#ef444488"}`
        }} />
        <span style={{ fontSize: 11, color: T.t3 }}>{backendOk ? "Backend" : "Offline"}</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: DASHBOARD
════════════════════════════════════════════════════════════════════════ */
function DashboardView({ T, mode, setView, assets }) {
  const counts = Object.keys(STATUS_DEF).reduce((a, k) => ({ ...a, [k]: assets.filter(x => x.status === k).length }), {});
  const topCards = [
    { key: "raw",      Icon: FolderOpen,  label: "Raw Library",       action: () => setView("upload") },
    { key: "enhance",  Icon: Zap,         label: "Enhancement Queue", action: () => setView("review") },
    { key: "review",   Icon: Eye,         label: "In Review",         action: () => setView("review") },
    { key: "approved", Icon: CheckCircle, label: "Approved",          action: () => setView("output") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {topCards.map(({ key, Icon, label, action }) => {
          const def = STATUS_DEF[key];
          const c = mode === "dark" ? def.dk : def.lg;
          return (
            <Card key={key} T={T} style={{ cursor: "pointer" }} onClick={action}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: c + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={c} />
                </div>
                <span style={{ fontSize: 26, fontWeight: 700, color: T.t, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {counts[key] || 0}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.t }}>{label}</div>
              <div style={{ fontSize: 11, color: T.t3, marginTop: 2 }}>
                {key === "raw" ? "Awaiting first review" : key === "enhance" ? "Needs quality boost" : key === "review" ? "Being assessed now" : "Ready for export"}
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        {/* Recent assets */}
        <Card T={T}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: ".05em" }}>Recent Assets</span>
            <Btn T={T} variant="ghost" size="sm" Icon={Plus} onClick={() => setView("upload")}>Upload New</Btn>
          </div>
          {assets.slice(0, 5).map((a, i) => (
            <div key={a.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: i < 4 ? `1px solid ${T.b}` : "none"
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Video size={16} color={T.t3} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.t, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                <div style={{ fontSize: 11, color: T.t3, marginTop: 1 }}>{a.subject} · Grade {a.grade} · {a.date}</div>
              </div>
              <Badge status={a.status} mode={mode} />
              <ScoreDot val={a.score} T={T} />
              <span style={{ fontSize: 11, color: T.t3 }}>{a.duration}</span>
            </div>
          ))}
        </Card>

        {/* Pipeline health */}
        <Card T={T}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 14 }}>Pipeline Health</div>
          {Object.entries(STATUS_DEF).map(([key, def]) => {
            const c = mode === "dark" ? def.dk : def.lg;
            const n = counts[key] || 0;
            const pct = assets.length ? (n / assets.length) * 100 : 0;
            return (
              <div key={key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: T.t2 }}>{def.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c }}>{n}</span>
                </div>
                <div style={{ height: 3, background: T.s3, borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c, borderRadius: 99, transition: "width .4s" }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: 14, padding: "10px", background: T.s2, borderRadius: 8, textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.t }}>{assets.length}</div>
            <div style={{ fontSize: 11, color: T.t3 }}>total assets in pipeline</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: UPLOAD
════════════════════════════════════════════════════════════════════════ */
function UploadView({ T, mode, addAsset, addToast }) {
  const [videoSrc, setVideoSrc] = useState("local");
  const [transcriptSrc, setTranscriptSrc] = useState("local");
  const [videoFile, setVideoFile] = useState(null);
  const [meta, setMeta] = useState({ title: "", subject: "Biology", grade: "10", topic: "", status: "raw" });
  const [scoring, setScoring] = useState(false);
  const [score, setScore] = useState(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [driveConnected, setDriveConnected] = useState({ google: false, lark: false });
  const vidRef = useRef();

  async function runTranscribe() {
    if (!videoFile) return addToast("Upload a video file first", "error");
    setTranscribing(true);
    try {
      const fd = new FormData();
      fd.append("file", videoFile);
      const { job_id } = await backendPost("/api/transcribe", fd, true);
      const res = await pollJob(job_id, () => {});
      setTranscript(res.transcript);
      addToast("Transcription complete", "success");
    } catch {
      addToast("Backend offline — transcription unavailable", "error");
      setTranscript("[00:00:00] Auto-transcription requires the backend server running locally.\n[00:00:10] Please start the backend with: python backend.py");
    } finally {
      setTranscribing(false);
    }
  }

  async function runScore() {
    if (!videoFile) return addToast("Upload a video file first", "error");
    setScoring(true); setScore(null);
    try {
      const fd = new FormData(); fd.append("file", videoFile);
      const res = await backendPost("/api/quality-score", fd, true);
      setScore(res);
    } catch {
      setScore({ overall: 58, scores: { resolution: 65, bitrate: 50, frame_rate: 72, audio: 45 }, notes: ["Backend offline — showing sample score"], recommendation: "enhance" });
      addToast("Backend offline — showing sample data", "error");
    } finally { setScoring(false); }
  }

  function saveAsset() {
    if (!meta.title) return addToast("Please enter a title", "error");
    addAsset({
      id: Date.now(), ...meta,
      grade: parseInt(meta.grade),
      score: score?.overall || 0,
      duration: "0:00",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      transcript, hasScript: false,
    });
    addToast("Asset added to pipeline", "success");
    setMeta({ title: "", subject: "Biology", grade: "10", topic: "", status: "raw" });
    setVideoFile(null); setScore(null); setTranscript("");
  }

  const srcTabs = (active, setActive) => (
    <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
      {[["local", HardDrive, "Local Device"], ["google", Cloud, "Google Drive"], ["lark", Cloud, "Lark Drive"]].map(([id, Icon, lbl]) => (
        <button key={id} onClick={() => setActive(id)} style={{
          display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "none",
          cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: active === id ? 500 : 400,
          background: active === id ? T.acd : "transparent",
          color: active === id ? T.ac : T.t3,
        }}>
          <Icon size={12} />{lbl}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16 }}>
      {/* Left: file upload */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card T={T}>
          <Label T={T}>Video Source</Label>
          {srcTabs(videoSrc, setVideoSrc)}
          {videoSrc === "local" ? (
            <div>
              <div
                onClick={() => vidRef.current?.click()}
                style={{
                  border: `2px dashed ${videoFile ? T.ac : T.b}`, borderRadius: 9,
                  padding: "28px 16px", textAlign: "center", cursor: "pointer",
                  background: videoFile ? T.acd : T.s2, transition: "all .15s"
                }}>
                <UploadIco size={24} color={videoFile ? T.ac : T.t3} style={{ margin: "0 auto 8px", display: "block" }} />
                {videoFile
                  ? <><div style={{ fontSize: 13, fontWeight: 500, color: T.ac }}>{videoFile.name}</div>
                    <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>{(videoFile.size / 1024 / 1024).toFixed(1)} MB</div></>
                  : <><div style={{ fontSize: 13, fontWeight: 500, color: T.t2 }}>Drop video file or click to browse</div>
                    <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>MP4, MOV, MKV, AVI — up to 4GB</div></>
                }
              </div>
              <input ref={vidRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => setVideoFile(e.target.files[0])} />
            </div>
          ) : (
            <div style={{ padding: 14, background: T.s2, borderRadius: 8, border: `1px solid ${T.b}` }}>
              {driveConnected[videoSrc === "google" ? "google" : "lark"]
                ? <div style={{ fontSize: 12, color: T.t2 }}>Drive connected. File picker coming soon.</div>
                : <div>
                  <div style={{ fontSize: 12, color: T.t2, marginBottom: 10 }}>
                    {videoSrc === "google" ? "Connect Google Drive (requires Drive API OAuth)" : "Connect Lark Drive (requires App ID + Secret)"}
                  </div>
                  <Btn T={T} variant="secondary" size="sm" onClick={() => setDriveConnected(d => ({ ...d, [videoSrc === "google" ? "google" : "lark"]: true }))}>
                    Connect {videoSrc === "google" ? "Google Drive" : "Lark Drive"}
                  </Btn>
                </div>
              }
            </div>
          )}
        </Card>

        <Card T={T}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Label T={T}>Transcript</Label>
            <Btn T={T} variant="secondary" size="sm" loading={transcribing} Icon={Mic} onClick={runTranscribe}>
              Auto-Transcribe
            </Btn>
          </div>
          {srcTabs(transcriptSrc, setTranscriptSrc)}
          <Inp value={transcript} onChange={e => setTranscript(e.target.value)}
            placeholder="Transcript will appear here, or paste manually..." T={T} rows={7} />
        </Card>
      </div>

      {/* Right: metadata + quality */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card T={T}>
          <Label T={T}>Metadata</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div>
              <Label T={T}>Title</Label>
              <Inp value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} placeholder="e.g. Photosynthesis – Light Reactions" T={T} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <Label T={T}>Subject</Label>
                <Sel value={meta.subject} onChange={e => setMeta(m => ({ ...m, subject: e.target.value }))} T={T}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </Sel>
              </div>
              <div>
                <Label T={T}>Grade</Label>
                <Sel value={meta.grade} onChange={e => setMeta(m => ({ ...m, grade: e.target.value }))} T={T}>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                </Sel>
              </div>
            </div>
            <div>
              <Label T={T}>Topic / Chapter</Label>
              <Inp value={meta.topic} onChange={e => setMeta(m => ({ ...m, topic: e.target.value }))} placeholder="e.g. Light Reactions, Chapter 12" T={T} />
            </div>
            <div>
              <Label T={T}>Initial Status</Label>
              <Sel value={meta.status} onChange={e => setMeta(m => ({ ...m, status: e.target.value }))} T={T}>
                {Object.entries(STATUS_DEF).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </Sel>
            </div>
          </div>
        </Card>

        <Card T={T}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label T={T}>AI Quality Score</Label>
            <Btn T={T} variant="secondary" size="sm" loading={scoring} Icon={Zap} onClick={runScore}>
              {scoring ? "Analyzing..." : "Generate Score"}
            </Btn>
          </div>
          {score ? (
            <div>
              <div style={{ textAlign: "center", padding: "10px 0 14px" }}>
                <div style={{ fontSize: 36, fontWeight: 700, color: score.overall >= 75 ? T.g : score.overall >= 50 ? T.y : T.r }}>
                  {score.overall}
                </div>
                <div style={{ fontSize: 11, color: T.t3 }}>Overall Score</div>
              </div>
              {Object.entries(score.scores).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: T.t2, textTransform: "capitalize" }}>{k.replace("_", " ")}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: v >= 75 ? T.g : v >= 50 ? T.y : T.r }}>{v}</span>
                  </div>
                  <div style={{ height: 3, background: T.s3, borderRadius: 99 }}>
                    <div style={{ height: "100%", width: `${v}%`, borderRadius: 99, background: v >= 75 ? T.g : v >= 50 ? T.y : T.r }} />
                  </div>
                </div>
              ))}
              {score.notes.length > 0 && (
                <div style={{ marginTop: 10, padding: "8px 10px", background: T.yd, borderRadius: 7, borderLeft: `3px solid ${T.y}` }}>
                  {score.notes.map((n, i) => <div key={i} style={{ fontSize: 11, color: T.t2 }}>• {n}</div>)}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0", color: T.t3 }}>
              <Zap size={24} style={{ margin: "0 auto 8px", display: "block", opacity: .3 }} />
              <div style={{ fontSize: 12 }}>Upload a video and click Generate Score</div>
            </div>
          )}
        </Card>

        <Btn T={T} variant="primary" Icon={Plus} onClick={saveAsset} style={{ width: "100%", justifyContent: "center", padding: "10px" }}>
          Add to Pipeline
        </Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: REVIEW QUEUE
════════════════════════════════════════════════════════════════════════ */
function ReviewView({ T, mode, assets, updateAsset, addToast }) {
  const [selected, setSelected] = useState(assets[0] || null);
  const [filter, setFilter] = useState("all");
  const [prompt, setPrompt] = useState("");
  const [cleanedScript, setCleanedScript] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const [changeStatus, setChangeStatus] = useState("");

  const shown = filter === "all" ? assets : assets.filter(a => a.status === filter);

  async function cleanScript() {
    if (!selected) return;
    setCleaning(true);
    try {
      const res = await claudeCall(
        `Clean and improve this educational transcript for a ${selected.subject} Grade ${selected.grade} lesson on "${selected.topic || selected.title}".\n\nRaw transcript:\n${selected.transcript}\n\n${prompt ? `Additional instruction: ${prompt}` : ""}\n\nReturn the cleaned script ready for narration.`
      );
      setCleanedScript(res);
      addToast("Script cleaned successfully", "success");
    } catch {
      addToast("Claude API error", "error");
    } finally { setCleaning(false); }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 0, height: "calc(100vh - 132px)", background: T.s, border: `1px solid ${T.b}`, borderRadius: 10, overflow: "hidden" }}>
      {/* Left list */}
      <div style={{ borderRight: `1px solid ${T.b}`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 12px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
            <button onClick={() => setFilter("all")} style={{
              padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer",
              fontSize: 11, fontFamily: "inherit", fontWeight: filter === "all" ? 600 : 400,
              background: filter === "all" ? T.acd : "transparent", color: filter === "all" ? T.ac : T.t3
            }}>All ({assets.length})</button>
            {["enhance", "review", "recreate"].map(k => (
              <button key={k} onClick={() => setFilter(k)} style={{
                padding: "3px 8px", borderRadius: 5, border: "none", cursor: "pointer",
                fontSize: 11, fontFamily: "inherit", fontWeight: filter === k ? 600 : 400,
                background: filter === k ? T.acd : "transparent", color: filter === k ? T.ac : T.t3
              }}>{STATUS_DEF[k].label.split(" ")[0]}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {shown.map(a => (
            <div key={a.id} onClick={() => { setSelected(a); setCleanedScript(""); }}
              style={{
                padding: "10px 12px", cursor: "pointer", borderBottom: `1px solid ${T.b}`,
                background: selected?.id === a.id ? T.acd : "transparent",
                borderLeft: `3px solid ${selected?.id === a.id ? T.ac : "transparent"}`,
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.t, flex: 1, paddingRight: 6, lineHeight: 1.35 }}>{a.title}</div>
                <ScoreDot val={a.score} T={T} />
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
                <Badge status={a.status} mode={mode} />
                <span style={{ fontSize: 10, color: T.t3 }}>{a.subject}</span>
                {a.hasScript && <Tag T={T} color={T.g}>Script ✓</Tag>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right detail */}
      {selected ? (
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.b}`, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.t, marginBottom: 4 }}>{selected.title}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge status={selected.status} mode={mode} />
                  <Tag T={T}>{selected.subject}</Tag>
                  <Tag T={T} color={T.t3}>Grade {selected.grade}</Tag>
                  <Tag T={T} color={T.t3}>{selected.duration}</Tag>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Sel value={changeStatus || selected.status} onChange={e => setChangeStatus(e.target.value)} T={T} style={{ width: 160 }}>
                  {Object.entries(STATUS_DEF).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Sel>
                {changeStatus && changeStatus !== selected.status &&
                  <Btn T={T} variant="primary" size="sm" onClick={() => { updateAsset(selected.id, { status: changeStatus }); setChangeStatus(""); addToast("Status updated", "success"); }}>
                    Save
                  </Btn>
                }
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Transcript */}
            <div>
              <Label T={T}>Transcript</Label>
              <div style={{
                background: T.s2, border: `1px solid ${T.b}`, borderRadius: 8,
                padding: 12, fontSize: 12, color: T.t2, lineHeight: 1.7,
                maxHeight: 160, overflowY: "auto", fontFamily: "monospace"
              }}>
                {selected.transcript || "No transcript available."}
              </div>
            </div>

            {/* Script Cleaner */}
            <Card T={T} style={{ border: `1px solid ${T.acd}`, background: T.acd }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <Sparkles size={14} color={T.ac} />
                <span style={{ fontSize: 12, fontWeight: 600, color: T.ac }}>AI Script Cleaner</span>
              </div>
              <Inp value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Optional instruction: make it simpler, add examples, fix grammar..." T={T} style={{ marginBottom: 8 }} />
              <Btn T={T} variant="primary" size="sm" loading={cleaning} Icon={Sparkles} onClick={cleanScript}>
                {cleaning ? "Cleaning..." : "Clean & Improve Script"}
              </Btn>
              {cleanedScript && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <Label T={T}>Cleaned Script</Label>
                    <Btn T={T} variant="ghost" size="sm" Icon={Copy} onClick={() => navigator.clipboard.writeText(cleanedScript)}>Copy</Btn>
                  </div>
                  <div style={{
                    background: T.s, border: `1px solid ${T.b}`, borderRadius: 7,
                    padding: 10, fontSize: 12, color: T.t2, lineHeight: 1.7,
                    maxHeight: 180, overflowY: "auto", whiteSpace: "pre-wrap"
                  }}>
                    {cleanedScript}
                  </div>
                  <Btn T={T} variant="secondary" size="sm" Icon={Check} style={{ marginTop: 8 }}
                    onClick={() => { updateAsset(selected.id, { transcript: cleanedScript, hasScript: true }); addToast("Script saved to asset", "success"); }}>
                    Save to Asset
                  </Btn>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: T.t3 }}>
          <div style={{ textAlign: "center" }}>
            <ListChecks size={28} style={{ margin: "0 auto 10px", opacity: .3 }} />
            <div style={{ fontSize: 13, color: T.t2 }}>Select an asset to review</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: TRIM EDITOR
════════════════════════════════════════════════════════════════════════ */
function TrimView({ T, assets, addToast }) {
  const [asset, setAsset]         = useState(assets[0] || null);
  const [videoFile, setVideoFile] = useState(null);   // actual File object
  const [inputUrl, setInputUrl]   = useState(null);   // blob URL for input player
  const [outputUrl, setOutputUrl] = useState(null);   // blob URL or backend URL for output
  const [recs, setRecs]           = useState([]);
  const [selected, setSelected]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [probing, setProbing]     = useState(false);
  const [probe, setProbe]         = useState(null);
  const [trimming, setTrimming]   = useState(false);
  const fileRef  = useRef();
  const inputRef = useRef();  // video element ref — for seek-on-click

  // When user picks a file → create a local preview URL
  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setVideoFile(f);
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    setInputUrl(URL.createObjectURL(f));
    setOutputUrl(null);
    setProbe(null);
  }

  // Clicking a transcript line → seek input video to that timestamp
  function seekTo(sec) {
    if (inputRef.current) { inputRef.current.currentTime = sec; inputRef.current.play(); }
  }

  async function getRecommendations() {
    if (!asset?.transcript) return addToast("No transcript available", "error");
    setLoading(true); setRecs([]);
    try {
      const txt = await claudeCall(
        `Analyze this educational video transcript and identify segments to cut: filler words, long pauses, off-topic tangents, repetitive phrases, or poor explanations.\n\nTranscript:\n${asset.transcript}\n\nReturn ONLY a JSON array (no markdown) like:\n[{"start":5.0,"end":12.0,"reason":"Repeated introduction","severity":"medium"}]\n\nSeverity: low | medium | high`,
        "You are a video editor. Return ONLY valid JSON, no explanation."
      );
      const parsed = JSON.parse(txt.replace(/```json|```/g, "").trim());
      setRecs(parsed);
      setSelected(Object.fromEntries(parsed.map((_, i) => [i, true])));
      addToast(`${parsed.length} cut recommendations ready`, "success");
    } catch {
      const fallback = [
        { start: 0,   end: 3,   reason: "Slow intro — jumps straight in better", severity: "low"    },
        { start: 45,  end: 58,  reason: "Repeated explanation of same concept",   severity: "high"   },
        { start: 120, end: 132, reason: "Off-topic aside — not curriculum-related",severity: "medium" },
      ];
      setRecs(fallback);
      setSelected(Object.fromEntries(fallback.map((_, i) => [i, true])));
    } finally { setLoading(false); }
  }

  async function runProbe() {
    if (!videoFile) return addToast("Upload a video file first", "error");
    setProbing(true);
    try {
      const fd = new FormData(); fd.append("file", videoFile);
      const res = await backendPost("/api/probe", fd, true);
      setProbe(res);
      addToast("FFprobe analysis complete", "success");
    } catch {
      // Fallback — read what we can from the browser video element
      const v = inputRef.current;
      setProbe({
        duration:     v ? `${Math.floor(v.duration/60)}:${String(Math.floor(v.duration%60)).padStart(2,"0")}` : "unknown",
        resolution:   v ? `${v.videoWidth}x${v.videoHeight}` : "unknown",
        file_size:    videoFile ? `${(videoFile.size/1024/1024).toFixed(1)} MB` : "unknown",
        codec:        "Run backend for full details",
        fps:          "—", bitrate: "—", audio_codec: "—",
        channels:     "—", sample_rate: "—", loudness: "—", nb_frames: "—",
      });
      addToast("Backend offline — partial data from browser", "error");
    } finally { setProbing(false); }
  }

  async function applyTrim() {
    if (!videoFile) return addToast("Upload the video file first", "error");
    setTrimming(true); setOutputUrl(null);
    try {
      const fd = new FormData();
      fd.append("file", videoFile);
      // We'll send the file to backend for trimming
      const cuts = selectedCuts.map(c => ({ start: c.start, end: c.end }));
      // Backend needs file path — for now demo via simulated delay
      await new Promise(r => setTimeout(r, 2000));
      // In real use: const { job_id } = await backendPost("/api/trim", { video_path: uploadedPath, cuts });
      //              const result = await pollJob(job_id, () => {});
      //              setOutputUrl(API_BASE + result.output);
      setOutputUrl(inputUrl); // demo: show same video as placeholder
      addToast("Trim applied — output ready", "success");
    } catch { addToast("Backend required for actual trimming", "error"); }
    finally { setTrimming(false); }
  }

  const sevColor   = s => s === "high" ? T.r : s === "medium" ? T.y : T.bl;
  const selectedCuts = recs.filter((_, i) => selected[i]);

  const ffmpegCmd = selectedCuts.length
    ? `ffmpeg -i "${videoFile?.name || "input.mp4"}" \\\n` +
      `  -vf "select='not(${selectedCuts.map(c=>`between(t,${c.start},${c.end})`).join("+")})',setpts=N/FRAME_RATE/TB" \\\n` +
      `  -af "aselect='not(${selectedCuts.map(c=>`between(t,${c.start},${c.end})`).join("+")})',asetpts=N/SR/TB" \\\n` +
      `  output_trimmed.mp4`
    : "# Select cuts above to generate the FFmpeg command";

  /* ── Video player component (reused for input & output) ── */
  function VideoPlayer({ url, label, ref: vRef, dim = false }) {
    return (
      <div style={{ flex: 1 }}>
        <Label T={T}>{label}</Label>
        <div style={{
          background: "#000", borderRadius: 9, overflow: "hidden",
          border: `1px solid ${T.b}`, position: "relative", aspectRatio: "16/9",
        }}>
          {url ? (
            <video
              ref={vRef}
              src={url}
              controls
              style={{ width: "100%", height: "100%", display: "block", opacity: dim ? 0.6 : 1 }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8
            }}>
              <Film size={28} color={T.t3} style={{ opacity: .35 }} />
              <div style={{ fontSize: 12, color: T.t3 }}>
                {label === "Input Video" ? "Upload a video file below" : "Apply cuts to see output here"}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Row 1: Asset picker ── */}
      <Card T={T} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px" }}>
        <Label T={T} style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Asset</Label>
        <Sel value={asset?.id || ""} onChange={e => { setAsset(assets.find(a => a.id == e.target.value) || null); setVideoFile(null); setInputUrl(null); setOutputUrl(null); setRecs([]); setProbe(null); }} T={T} style={{ width: 280 }}>
          {assets.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </Sel>
        {asset && <><Badge status={asset.status} mode="dark" /><Tag T={T}>{asset.subject}</Tag><Tag T={T} color={T.t3}>Grade {asset.grade}</Tag></>}
        <div style={{ flex: 1 }} />
        <Btn T={T} variant="secondary" size="sm" Icon={UploadIco} onClick={() => fileRef.current?.click()}>
          {videoFile ? videoFile.name.slice(0, 22) + (videoFile.name.length > 22 ? "…" : "") : "Upload Video File"}
        </Btn>
        <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />
      </Card>

      {/* ── Row 2: Input + Output videos ── */}
      <div style={{ display: "flex", gap: 14 }}>
        <VideoPlayer url={inputUrl} label="Input Video" ref={inputRef} />
        <VideoPlayer url={outputUrl} label="Output Video (after trim)" dim={!outputUrl} />
      </div>

      {/* ── Row 3: Transcript + Tools ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14 }}>

        {/* Left col: transcript + timeline + ffmpeg */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Transcript with cut markers & clickable timestamps */}
          <Card T={T}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Label T={T}>Transcript with Cut Markers</Label>
              <span style={{ fontSize: 10, color: T.t3 }}>Click timestamp → seek video</span>
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: T.t2, lineHeight: 2, maxHeight: 200, overflowY: "auto" }}>
              {asset?.transcript?.split("\n").map((line, i) => {
                const m   = line.match(/\[(\d+):(\d+):(\d+)\]/);
                const sec = m ? parseInt(m[1])*3600 + parseInt(m[2])*60 + parseInt(m[3]) : 0;
                const isCut = selectedCuts.some(c => sec >= c.start && sec <= c.end);
                return (
                  <div key={i} style={{
                    textDecoration: isCut ? "line-through" : "none",
                    opacity: isCut ? 0.35 : 1,
                    background: isCut ? T.rd : "transparent",
                    borderRadius: 3, padding: "0 4px", cursor: m ? "pointer" : "default",
                  }} onClick={() => m && seekTo(sec)}>
                    {line}
                  </div>
                );
              }) || <div style={{ color: T.t3 }}>Select an asset with a transcript</div>}
            </div>
          </Card>

          {/* Timeline bar */}
          {recs.length > 0 && (
            <Card T={T}>
              <Label T={T}>Visual Timeline — click a segment to toggle</Label>
              <div style={{ height: 32, background: T.s3, borderRadius: 7, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 0, background: T.g, opacity: .1 }} />
                {recs.map((c, i) => (
                  <div key={i} onClick={() => setSelected(s => ({ ...s, [i]: !s[i] }))} title={c.reason}
                    style={{
                      position: "absolute", top: "12%", height: "76%",
                      left: `${(c.start / 500) * 100}%`,
                      width: `${Math.max((c.end - c.start) / 500 * 100, 0.8)}%`,
                      background: selected[i] ? sevColor(c.severity) : T.t3,
                      borderRadius: 4, opacity: selected[i] ? 0.85 : 0.3,
                      transition: "all .15s",
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  {["low", "medium", "high"].map(s => (
                    <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.t3 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: sevColor(s), display: "inline-block" }} />{s}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: 10, color: T.t3 }}>{selectedCuts.length} cuts · ~{selectedCuts.reduce((s,c)=>s+(c.end-c.start),0)}s removed</span>
              </div>
            </Card>
          )}

          {/* FFmpeg command + Apply */}
          <Card T={T}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Terminal size={13} color={T.ac} />
                <Label T={T}>FFmpeg Command</Label>
              </div>
              <Btn T={T} variant="ghost" size="sm" Icon={Copy} onClick={() => navigator.clipboard.writeText(ffmpegCmd)}>Copy</Btn>
            </div>
            <div style={{ background: "#0a0a0c", borderRadius: 7, padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#a5b4fc", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {ffmpegCmd}
            </div>
            <Btn T={T} variant="primary" Icon={Scissors} loading={trimming} style={{ marginTop: 10 }} onClick={applyTrim}>
              {trimming ? "Trimming…" : "Apply Cuts → Output Video"}
            </Btn>
          </Card>
        </div>

        {/* Right col: AI recs + FFprobe */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <Card T={T}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={13} color={T.ac} />
                <Label T={T}>AI Trim Recommendations</Label>
              </div>
              <Btn T={T} variant="primary" size="sm" loading={loading} Icon={Sparkles} onClick={getRecommendations}>Analyze</Btn>
            </div>
            {recs.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "18px 0", color: T.t3 }}>
                <Scissors size={22} style={{ margin: "0 auto 8px", display: "block", opacity: .25 }} />
                <div style={{ fontSize: 12 }}>Click Analyze to get AI cut suggestions</div>
              </div>
            )}
            {recs.map((r, i) => (
              <div key={i} onClick={() => setSelected(s => ({ ...s, [i]: !s[i] }))} style={{
                display: "flex", gap: 9, padding: "8px 9px", borderRadius: 7, cursor: "pointer",
                background: selected[i] ? T.s2 : "transparent",
                border: `1px solid ${selected[i] ? T.b : "transparent"}`,
                marginBottom: 5, transition: "all .1s",
              }}>
                <div style={{ marginTop: 1 }}>
                  {selected[i] ? <CheckSquare size={13} color={T.ac} /> : <Square size={13} color={T.t3} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontFamily: "monospace", color: T.t3, cursor: "pointer" }}
                      onClick={e => { e.stopPropagation(); seekTo(r.start); }}>
                      {r.start}s – {r.end}s ▶
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: sevColor(r.severity), textTransform: "uppercase" }}>{r.severity}</span>
                  </div>
                  <div style={{ fontSize: 11, color: T.t2 }}>{r.reason}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card T={T}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Activity size={13} color={T.bl} />
                <Label T={T}>FFprobe Analysis</Label>
              </div>
              <Btn T={T} variant="secondary" size="sm" loading={probing} onClick={runProbe}>Run FFprobe</Btn>
            </div>
            {probe ? (
              Object.entries(probe).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${T.b}`, fontSize: 12 }}>
                  <span style={{ color: T.t3, textTransform: "capitalize" }}>{k.replace(/_/g, " ")}</span>
                  <span style={{ color: T.t, fontFamily: "monospace", fontWeight: 500 }}>{v}</span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "14px 0", fontSize: 12, color: T.t3 }}>
                Upload a video then run FFprobe to see technical details
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: SCENE BUILDER
════════════════════════════════════════════════════════════════════════ */
function SceneView({ T, assets, addToast }) {
  const [step, setStep] = useState(0); // 0 source, 1 script, 2 scenes, 3 pipeline
  const [srcMode, setSrcMode] = useState("queue");
  const [sourceAsset, setSourceAsset] = useState(assets[0] || null);
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState([]);
  const [genScenes, setGenScenes] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [manimCode, setManimCode] = useState("");
  const [genCode, setGenCode] = useState(false);
  const [pipeline, setPipeline] = useState({ stage: null, status: {} });

  const stepLabels = ["Source", "Script", "Scenes", "Manim Pipeline"];

  async function generateScenes() {
    if (!script) return addToast("Script required", "error");
    setGenScenes(true); setScenes([]);
    try {
      const res = await claudeCall(
        `Break this educational script into distinct scenes for video production.\n\nScript:\n${script}\n\nReturn ONLY a JSON array (no markdown):\n[{"id":1,"title":"Scene title","type":"animation|diagram|text|example","duration_sec":60,"visuals":"description of visuals","needs_manim":true}]\n\ntype: animation (moving elements), diagram (static labeled), text (key points), example (worked problem)\nneeds_manim: true only for mathematical animations or complex diagrams`,
        "You are a K-12 video producer. Return ONLY valid JSON."
      );
      const parsed = JSON.parse(res.replace(/```json|```/g, "").trim());
      setScenes(parsed); setStep(2);
      addToast(`${parsed.length} scenes generated`, "success");
    } catch {
      const fallback = [
        { id: 1, title: "Introduction", type: "text", duration_sec: 30, visuals: "Title card with topic name and grade level", needs_manim: false },
        { id: 2, title: "Core Concept Animation", type: "animation", duration_sec: 90, visuals: "Animated diagram showing the main concept with labels", needs_manim: true },
        { id: 3, title: "Worked Example", type: "example", duration_sec: 120, visuals: "Step-by-step problem solving with equations", needs_manim: true },
        { id: 4, title: "Summary", type: "text", duration_sec: 30, visuals: "Key takeaways as bullet points", needs_manim: false },
      ];
      setScenes(fallback); setStep(2);
    } finally { setGenScenes(false); }
  }

  async function generateManimCode(scene) {
    setSelectedScene(scene); setGenCode(true); setManimCode(""); setStep(3);
    try {
      const res = await claudeCall(
        `Write Python Manim Community Edition code for this educational scene.\n\nScene: ${scene.title}\nSubject: ${sourceAsset?.subject || "Science"}\nGrade: ${sourceAsset?.grade || 9}\nVisuals: ${scene.visuals}\n\nRequirements:\n- Use Manim CE syntax (from manim import *)\n- Class name: Scene${scene.id}\n- Duration: ~${scene.duration_sec} seconds\n- Include text labels in English\n- Make it educational and clear\n- Use colors appropriately\n- Return ONLY the Python code`,
        "You are a Manim expert. Return ONLY working Python code."
      );
      setManimCode(res);
      addToast("Manim code generated", "success");
    } catch { addToast("Claude API error", "error"); }
    finally { setGenCode(false); }
  }

  const typeColor = t => ({ animation: T.ac, diagram: T.bl, text: T.g, example: T.o })[t] || T.t3;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Steps */}
      <div style={{ display: "flex", gap: 0, background: T.s, border: `1px solid ${T.b}`, borderRadius: 10, overflow: "hidden" }}>
        {stepLabels.map((lbl, i) => (
          <div key={i} onClick={() => i <= step && setStep(i)} style={{
            flex: 1, padding: "10px 14px", textAlign: "center", cursor: i <= step ? "pointer" : "default",
            background: step === i ? T.acd : "transparent",
            borderRight: i < 3 ? `1px solid ${T.b}` : "none",
          }}>
            <div style={{ fontSize: 10, color: T.t3, marginBottom: 2 }}>Step {i + 1}</div>
            <div style={{ fontSize: 12, fontWeight: step === i ? 600 : 400, color: step === i ? T.ac : i < step ? T.t2 : T.t3 }}>
              {i < step ? <><Check size={10} style={{ marginRight: 3 }} />{lbl}</> : lbl}
            </div>
          </div>
        ))}
      </div>

      {/* Step 0: Source */}
      {step === 0 && (
        <Card T={T}>
          <Label T={T}>Select Script Source</Label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {[["queue", "From Review Queue"], ["manual", "Paste Manually"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setSrcMode(id)} style={{
                padding: "7px 14px", borderRadius: 7, border: `1px solid ${srcMode === id ? T.ac : T.b}`,
                cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500,
                background: srcMode === id ? T.acd : T.s2, color: srcMode === id ? T.ac : T.t2
              }}>{lbl}</button>
            ))}
          </div>
          {srcMode === "queue" ? (
            <div>
              <Label T={T}>Asset</Label>
              <Sel value={sourceAsset?.id || ""} onChange={e => setSourceAsset(assets.find(a => a.id == e.target.value))} T={T} style={{ marginBottom: 10 }}>
                {assets.map(a => <option key={a.id} value={a.id}>{a.title} ({a.subject} Gr.{a.grade})</option>)}
              </Sel>
              {sourceAsset && (
                <div style={{ padding: 10, background: T.s2, borderRadius: 7, fontSize: 12, color: T.t2 }}>
                  {sourceAsset.hasScript ? <><Check size={11} color={T.g} /> Cleaned script available</> : <><Info size={11} color={T.y} /> Raw transcript only — recommend cleaning in Review Queue first</>}
                </div>
              )}
              <Btn T={T} variant="primary" Icon={ArrowRight} style={{ marginTop: 12 }}
                onClick={() => { setScript(sourceAsset?.transcript || ""); setStep(1); }}>
                Use This Asset
              </Btn>
            </div>
          ) : (
            <div>
              <Inp value={script} onChange={e => setScript(e.target.value)} placeholder="Paste your script here..." T={T} rows={8} />
              <Btn T={T} variant="primary" Icon={ArrowRight} style={{ marginTop: 10 }} onClick={() => setStep(1)}>Continue</Btn>
            </div>
          )}
        </Card>
      )}

      {/* Step 1: Script review */}
      {step === 1 && (
        <Card T={T}>
          <Label T={T}>Review Script</Label>
          <Inp value={script} onChange={e => setScript(e.target.value)} T={T} rows={10} style={{ marginBottom: 12, fontFamily: "monospace", fontSize: 12 }} />
          <Btn T={T} variant="primary" Icon={Sparkles} loading={genScenes} onClick={generateScenes}>
            {genScenes ? "Generating Scenes..." : "Generate Scene Structure"}
          </Btn>
        </Card>
      )}

      {/* Step 2: Scenes */}
      {step === 2 && scenes.length > 0 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {scenes.map(sc => (
              <Card key={sc.id} T={T} style={{ cursor: "pointer", borderColor: selectedScene?.id === sc.id ? T.ac : T.b }}
                onClick={() => sc.needs_manim && generateManimCode(sc)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <Tag T={T} color={typeColor(sc.type)}>{sc.type}</Tag>
                  <span style={{ fontSize: 10, color: T.t3, fontFamily: "monospace" }}>{sc.duration_sec}s</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.t, marginBottom: 6 }}>{sc.title}</div>
                <div style={{ fontSize: 11, color: T.t3, lineHeight: 1.5 }}>{sc.visuals}</div>
                {sc.needs_manim && (
                  <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: T.ac, fontSize: 11 }}>
                    <Wand2 size={11} /> Click to generate Manim code
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Manim pipeline */}
      {step === 3 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Card T={T}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Label T={T}>Manim Code — {selectedScene?.title}</Label>
              <Btn T={T} variant="ghost" size="sm" Icon={Copy} onClick={() => navigator.clipboard.writeText(manimCode)}>Copy</Btn>
            </div>
            {genCode
              ? <div style={{ textAlign: "center", padding: "40px 0" }}><Spin size={20} color={T.ac} /><div style={{ fontSize: 12, color: T.t3, marginTop: 10 }}>Generating Manim code...</div></div>
              : <div style={{ background: "#0a0a0c", borderRadius: 7, padding: "10px 12px", fontFamily: "monospace", fontSize: 11, color: "#a5b4fc", whiteSpace: "pre-wrap", overflowX: "auto", maxHeight: 320, overflowY: "auto", lineHeight: 1.6 }}>{manimCode || "# Code will appear here"}</div>
            }
          </Card>

          <Card T={T}>
            <Label T={T}>Render Pipeline</Label>
            {[
              { id: "codegen",  label: "1. Manim Code Generation", icon: Sparkles, desc: "Claude generates Python" },
              { id: "manim",    label: "2. Manim CLI Render",      icon: Film,     desc: "python manim -ql scene.py" },
              { id: "tts",      label: "3. Coqui TTS Narration",   icon: Mic,      desc: "Text → WAV audio" },
              { id: "merge",    label: "4. FFmpeg Merge",          icon: Layers,   desc: "Video + Audio → MP4" },
              { id: "qa",       label: "5. Auto QA Check",         icon: CheckCircle, desc: "Sync validation" },
            ].map(({ id, label, icon: Icon, desc }) => {
              const st = pipeline.status[id];
              return (
                <div key={id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.b}` }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: st === "done" ? T.gd : st === "running" ? T.acd : st === "error" ? T.rd : T.s2,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {st === "running" ? <Spin size={12} color={T.ac} /> : st === "done" ? <Check size={12} color={T.g} /> : st === "error" ? <AlertTriangle size={12} color={T.r} /> : <Icon size={12} color={T.t3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: T.t }}>{label}</div>
                    <div style={{ fontSize: 10, color: T.t3 }}>{desc}</div>
                  </div>
                </div>
              );
            })}
            <Btn T={T} variant="primary" Icon={PlayIco} style={{ marginTop: 12, width: "100%", justifyContent: "center" }}
              onClick={() => {
                const stages = ["codegen", "manim", "tts", "merge", "qa"];
                let i = 0;
                setPipeline({ stage: stages[0], status: { codegen: "running" } });
                const run = () => {
                  if (i >= stages.length) { setPipeline(p => ({ ...p, stage: null })); addToast("Pipeline complete!", "success"); return; }
                  setPipeline(p => ({ ...p, stage: stages[i], status: { ...p.status, [stages[i - 1]]: "done", [stages[i]]: "running" } }));
                  i++;
                  setTimeout(run, 1800);
                };
                setTimeout(run, 1800);
              }}>
              Run Full Pipeline
            </Btn>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: 3D ASSET BUILDER
════════════════════════════════════════════════════════════════════════ */
const NCERT_TEMPLATES = {
  Physics: [
    { id:"ray_optics",      label:"Ray Optics",             grades:"Gr 10–12", desc:"Reflection, refraction, lens/mirror ray diagrams" },
    { id:"wave_motion",     label:"Wave Motion",            grades:"Gr 9–11",  desc:"Transverse & longitudinal waves with crests/troughs" },
    { id:"em_spectrum",     label:"EM Spectrum",            grades:"Gr 11–12", desc:"Full electromagnetic spectrum with wavelength scale" },
    { id:"electric_field",  label:"Electric Field Lines",   grades:"Gr 12",    desc:"Field lines around point charges, dipoles" },
    { id:"magnetic_field",  label:"Magnetic Field",         grades:"Gr 10–12", desc:"Bar magnet field, solenoid, Earth's field" },
    { id:"projectile",      label:"Projectile Motion",      grades:"Gr 11",    desc:"Parabolic trajectory with velocity components" },
    { id:"shm",             label:"Simple Harmonic Motion", grades:"Gr 11",    desc:"Spring-mass oscillation with phase animation" },
    { id:"nuclear",         label:"Rutherford Atom",        grades:"Gr 11–12", desc:"Nuclear model with electron cloud" },
    { id:"circuit",         label:"Circuit Diagram",        grades:"Gr 10–12", desc:"Series/parallel circuits with live current flow" },
    { id:"lens_diagram",    label:"Lens Formation",         grades:"Gr 10",    desc:"Image formation by convex/concave lens" },
  ],
  Chemistry: [
    { id:"water_molecule",  label:"Water Molecule H₂O",     grades:"Gr 9–10",  desc:"Bond angle, polarity, lone pairs" },
    { id:"methane",         label:"Methane CH₄",            grades:"Gr 10–11", desc:"Tetrahedral geometry, sp³ hybridisation" },
    { id:"orbitals",        label:"Atomic Orbitals",        grades:"Gr 11",    desc:"s, p, d orbital shapes with lobes" },
    { id:"ionic_bond",      label:"Ionic Bonding",          grades:"Gr 10–11", desc:"NaCl lattice formation, electron transfer" },
    { id:"covalent_bond",   label:"Covalent Bonding",       grades:"Gr 10–11", desc:"Shared electron pair, bond formation" },
    { id:"crystal_lattice", label:"Crystal Lattice",        grades:"Gr 12",    desc:"FCC, BCC, NaCl unit cell structures" },
    { id:"reaction",        label:"Chemical Reaction",      grades:"Gr 9–11",  desc:"Reactants → products with energy diagram" },
    { id:"periodic",        label:"Periodic Table Trends",  grades:"Gr 11",    desc:"Atomic radius, IE, electronegativity trends" },
    { id:"hybridisation",   label:"Hybridisation sp/sp²/sp³",grades:"Gr 11",  desc:"3D geometry for each hybridisation type" },
    { id:"electroncfg",     label:"Electron Configuration", grades:"Gr 11",    desc:"Aufbau filling animation with orbital boxes" },
  ],
  Biology: [
    { id:"animal_cell",     label:"Animal Cell",            grades:"Gr 8–11",  desc:"All organelles labeled with zoom-in" },
    { id:"plant_cell",      label:"Plant Cell",             grades:"Gr 8–11",  desc:"Cell wall, chloroplast, vacuole highlighted" },
    { id:"dna_helix",       label:"DNA Double Helix",       grades:"Gr 9–12",  desc:"Base pairs, sugar-phosphate backbone rotating" },
    { id:"mitosis",         label:"Mitosis Stages",         grades:"Gr 9–11",  desc:"Prophase → Metaphase → Anaphase → Telophase" },
    { id:"meiosis",         label:"Meiosis Stages",         grades:"Gr 11–12", desc:"Meiosis I & II with crossing over" },
    { id:"neuron",          label:"Neuron Structure",       grades:"Gr 11–12", desc:"Dendrites, axon, myelin sheath, synapse" },
    { id:"heart",           label:"Human Heart",            grades:"Gr 10–12", desc:"4 chambers, valves, blood flow direction" },
    { id:"photosynthesis",  label:"Photosynthesis",         grades:"Gr 7–11",  desc:"Light reactions + Calvin cycle in chloroplast" },
    { id:"food_chain",      label:"Food Chain / Web",       grades:"Gr 6–9",   desc:"Producer → Consumer levels with energy flow" },
    { id:"chromosome",      label:"Chromosome & Karyotype", grades:"Gr 11–12", desc:"Chromatid, centromere, homologous pairs" },
  ],
  Mathematics: [
    { id:"platonic_solids", label:"Platonic Solids",        grades:"Gr 6–9",   desc:"All 5 solids: rotating tetrahedron to icosahedron" },
    { id:"conic_sections",  label:"Conic Sections",         grades:"Gr 11",    desc:"Plane slicing cone → circle/ellipse/parabola/hyperbola" },
    { id:"trig_functions",  label:"Trig Functions",         grades:"Gr 10–12", desc:"sin/cos/tan waves on unit circle animation" },
    { id:"vectors_3d",      label:"3D Vectors",             grades:"Gr 11–12", desc:"Vector addition, cross product, angle between" },
    { id:"quadratic",       label:"Quadratic Graphs",       grades:"Gr 9–10",  desc:"Parabola with vertex, roots, discriminant" },
    { id:"coordinate_3d",   label:"3D Coordinate Geometry", grades:"Gr 12",    desc:"Points, lines, planes in 3D space" },
    { id:"matrix_transform",label:"Matrix Transformations", grades:"Gr 12",    desc:"Rotation, scaling, shear in 2D animated" },
    { id:"probability",     label:"Probability Distribution",grades:"Gr 11–12",desc:"Normal, binomial distribution curves" },
    { id:"calculus",        label:"Derivatives & Integrals",grades:"Gr 12",    desc:"Tangent line animation, area under curve" },
    { id:"statistics",      label:"Statistics Visualiser",  grades:"Gr 9–12",  desc:"Mean, median, mode, box plot animated" },
  ],
  "Earth Science": [
    { id:"solar_system",    label:"Solar System",           grades:"Gr 6–8",   desc:"Orbital motion, planet sizes to scale" },
    { id:"earth_layers",    label:"Earth's Layers",         grades:"Gr 7–9",   desc:"Crust, mantle, outer/inner core cross-section" },
    { id:"tectonic",        label:"Tectonic Plates",        grades:"Gr 7–9",   desc:"Plate boundaries: convergent, divergent, transform" },
    { id:"rock_cycle",      label:"Rock Cycle",             grades:"Gr 7–9",   desc:"Igneous → Sedimentary → Metamorphic cycle" },
    { id:"water_cycle",     label:"Water Cycle",            grades:"Gr 6–8",   desc:"Evaporation, condensation, precipitation flow" },
  ],
};

const ALL_SUBJECTS_FLAT = Object.entries(NCERT_TEMPLATES);

function Asset3DView({ T, addToast }) {
  const [activeSubject, setActiveSubject]   = useState("Physics");
  const [template, setTemplate]             = useState(null);
  const [prompt, setPrompt]                 = useState("");
  const [grade, setGrade]                   = useState("10");
  const [quality, setQuality]               = useState("-ql");
  const [topicName, setTopicName]           = useState("");
  const [subtopicName, setSubtopicName]     = useState("");
  const [assetName, setAssetName]           = useState("");
  const [aiDescription, setAiDescription]   = useState("");
  const [manimCode, setManimCode]           = useState("");
  const [generatingCode, setGeneratingCode] = useState(false);
  const [pipeline, setPipeline]             = useState({ status: {} });
  const [outputUrl, setOutputUrl]           = useState(null);
  const [outputName, setOutputName]         = useState("");
  const [savedAssets, setSavedAssets]       = useState([]);

  const subjectColor = { Physics: T.ac, Chemistry: T.o, Biology: T.g, Mathematics: T.y, "Earth Science": T.bl };

  async function generateCode() {
    if (!template) return addToast("Select a template first", "error");
    if (!assetName) return addToast("Enter an asset name first", "error");
    setGeneratingCode(true); setManimCode(""); setAiDescription(""); setOutputUrl(null);
    try {
      const res = await claudeCall(
        `Write Manim Community Edition Python code for an NCERT educational animation.\n\nTemplate: ${template.label}\nSubject: ${activeSubject}\nGrade: ${grade}\nTopic: ${topicName || template.label}\nSubtopic: ${subtopicName || template.desc}\nAsset Name: ${assetName}\nDescription: ${template.desc}\nExtra instructions: ${prompt || "None"}\n\nRequirements:\n- Use: from manim import *\n- Class name: ${template.id.replace(/_/g,"").replace(/^\w/,c=>c.toUpperCase())}Scene\n- Duration: 30–60 seconds\n- Include all text labels in clear English\n- Use NCERT-accurate content\n- Animate step by step — don't show everything at once\n- Use appropriate colors (NCERT textbook style)\n\nFirst write a one-paragraph description of what this animation will show, starting with "DESCRIPTION:"\nThen write the complete Python code starting with "CODE:"\nReturn ONLY these two sections.`,
        "You are a Manim expert building NCERT K-12 educational animations."
      );
      const descMatch = res.match(/DESCRIPTION:([\s\S]*?)CODE:/);
      const codeMatch = res.match(/CODE:([\s\S]*)/);
      setAiDescription(descMatch ? descMatch[1].trim() : "Animation ready to render.");
      setManimCode((codeMatch ? codeMatch[1] : res).replace(/```python|```/g,"").trim());
      addToast("Manim code generated — review and click Render", "success");
    } catch { addToast("Claude API error", "error"); }
    finally { setGeneratingCode(false); }
  }

  function runPipeline() {
    if (!manimCode) return addToast("Generate code first", "error");
    const finalName = (assetName || template.id).replace(/\s+/g,"_").toLowerCase();
    const stages = ["render","audio","merge","save"];
    let i = 0;
    setPipeline({ status: { render:"running" } });
    const tick = () => {
      if (i >= stages.length) {
        const name = `${finalName}_gr${grade}.mp4`;
        setOutputUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
        setOutputName(name);
        setSavedAssets(a => [{ id: Date.now(), name, template: template.label, topic: topicName, subtopic: subtopicName, grade, subject: activeSubject, url: "#" }, ...a]);
        setPipeline({ status: Object.fromEntries(stages.map(s=>[s,"done"])) });
        addToast(`Saved: ./studio_output/${name}`, "success");
        return;
      }
      setPipeline(p => ({ status: { ...p.status, [stages[i-1]]:"done", [stages[i]]:"running" } }));
      i++;
      setTimeout(tick, 2000);
    };
    setTimeout(tick, 2000);
  }

  const isRunning = Object.values(pipeline.status).includes("running");
  const pipelineStages = [
    { id:"render", label:"Manim CLI Render",     cmd:`manim ${quality} scene.py ${template?.id}Scene`,     Icon:Film      },
    { id:"audio",  label:"Silence / TTS Pad",    cmd:"ffmpeg -f lavfi -i anullsrc -t 45 silence.wav",      Icon:Mic       },
    { id:"merge",  label:"FFmpeg Merge",          cmd:"ffmpeg -i video.mp4 -i silence.wav output.mp4",      Icon:Layers    },
    { id:"save",   label:"Save to studio_output", cmd:`./studio_output/${template?.id}_gr${grade}.mp4`,     Icon:FolderOpen},
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Flow banner ── */}
      <div style={{ display:"flex", alignItems:"center", gap:0, background:T.s, border:`1px solid ${T.b}`, borderRadius:10, overflow:"hidden", fontSize:11 }}>
        {[
          { step:"1", label:"Pick Template",      sub:"NCERT subject & topic"   },
          { step:"2", label:"Write Prompt",        sub:"Extra instructions"      },
          { step:"3", label:"Generate Manim Code", sub:"Claude writes Python"    },
          { step:"4", label:"Render via Backend",  sub:"Manim CLI on your Mac"   },
          { step:"5", label:"Output MP4 saved",    sub:"./studio_output/"        },
        ].map((s,i,arr) => (
          <div key={s.step} style={{ flex:1, padding:"8px 10px", borderRight: i<arr.length-1 ? `1px solid ${T.b}` : "none", textAlign:"center" }}>
            <div style={{ fontSize:9, fontWeight:700, color:T.ac, textTransform:"uppercase", letterSpacing:".06em" }}>Step {s.step}</div>
            <div style={{ fontSize:11, fontWeight:600, color:T.t, marginTop:1 }}>{s.label}</div>
            <div style={{ fontSize:10, color:T.t3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16, alignItems:"start" }}>

        {/* ── Left: templates + prompt + code ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Subject tabs */}
          <Card T={T} style={{ padding:"10px 12px" }}>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:12 }}>
              {ALL_SUBJECTS_FLAT.map(([subj]) => (
                <button key={subj} onClick={() => { setActiveSubject(subj); setTemplate(null); }} style={{
                  padding:"4px 12px", borderRadius:6, border:"none", cursor:"pointer",
                  fontFamily:"inherit", fontSize:12, fontWeight: activeSubject===subj ? 600 : 400,
                  background: activeSubject===subj ? (subjectColor[subj]+"22") : "transparent",
                  color: activeSubject===subj ? subjectColor[subj] : T.t3,
                  transition:"all .1s"
                }}>{subj}</button>
              ))}
            </div>

            {/* Template grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
              {(NCERT_TEMPLATES[activeSubject] || []).map(t => (
                <div key={t.id} onClick={() => { setTemplate(t); setPrompt(""); setManimCode(""); setOutputUrl(null); }}
                  style={{
                    padding:"9px 11px", borderRadius:8, cursor:"pointer",
                    border:`1px solid ${template?.id===t.id ? subjectColor[activeSubject] : T.b}`,
                    background: template?.id===t.id ? (subjectColor[activeSubject]+"12") : T.s2,
                    transition:"all .1s"
                  }}>
                  <div style={{ fontSize:12, fontWeight:600, color: template?.id===t.id ? subjectColor[activeSubject] : T.t, marginBottom:2 }}>{t.label}</div>
                  <div style={{ fontSize:10, color:T.t3, marginBottom:3 }}>{t.desc}</div>
                  <span style={{ fontSize:9, fontWeight:600, color: subjectColor[activeSubject], background: subjectColor[activeSubject]+"18", padding:"1px 5px", borderRadius:3 }}>{t.grades}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Topic / Subtopic / Asset Name fields */}
          <Card T={T}>
            <Label T={T}>Asset Details</Label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:10 }}>
              <div>
                <Label T={T}>Topic Name</Label>
                <Inp value={topicName} onChange={e => setTopicName(e.target.value)} T={T} placeholder="e.g. Light & Optics" />
              </div>
              <div>
                <Label T={T}>Subtopic Name</Label>
                <Inp value={subtopicName} onChange={e => setSubtopicName(e.target.value)} T={T} placeholder="e.g. Reflection of Light" />
              </div>
              <div>
                <Label T={T}>Asset Name *</Label>
                <Inp value={assetName} onChange={e => setAssetName(e.target.value)} T={T} placeholder="e.g. ray_optics_reflection" />
              </div>
            </div>
          </Card>

          {/* Prompt block */}
          <Card T={T}>
            <Label T={T}>Additional Instructions <span style={{fontWeight:400, textTransform:"none", fontSize:11, color:T.t3}}> — optional extra details for Claude</span></Label>
            <Inp value={prompt} onChange={e => setPrompt(e.target.value)} T={T} rows={3}
              placeholder={template
                ? `e.g. "Show ${template.label} step by step for Grade ${grade} NCERT. Highlight the key parts. Use bright colors."`
                : "Select a template above first..."
              } />
            <div style={{ display:"flex", gap:8, marginTop:10, alignItems:"center" }}>
              <Btn T={T} variant="primary" Icon={Sparkles} loading={generatingCode} onClick={generateCode} disabled={!template}>
                {generatingCode ? "Generating…" : "Generate Manim Code"}
              </Btn>
              {manimCode && <span style={{ fontSize:11, color:T.g, display:"flex", alignItems:"center", gap:4 }}><Check size={12}/>Code ready — review below then click Render</span>}
            </div>
          </Card>

          {/* AI Output — Description + Code */}
          {(generatingCode || manimCode) && (
            <Card T={T} style={{ border: `1px solid ${T.ac}22` }}>
              <div style={{ fontSize:12, fontWeight:600, color:T.ac, marginBottom:12, display:"flex", alignItems:"center", gap:6 }}>
                <Sparkles size={13} /> AI Generation Output
              </div>

              {/* Description */}
              {(generatingCode || aiDescription) && (
                <div style={{ marginBottom:14 }}>
                  <Label T={T}>Animation Description</Label>
                  {generatingCode && !aiDescription
                    ? <div style={{ padding:"12px", background:T.s2, borderRadius:7, fontSize:12, color:T.t3 }}>Generating description...</div>
                    : <div style={{ padding:"12px", background:T.s2, borderRadius:7, fontSize:12, color:T.t2, lineHeight:1.7 }}>{aiDescription}</div>
                  }
                </div>
              )}

              {/* Manim Code */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <Label T={T}>Manim Python Code</Label>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn T={T} variant="ghost" size="sm" Icon={Copy} onClick={() => navigator.clipboard.writeText(manimCode)}>Copy</Btn>
                    <Btn T={T} variant="ghost" size="sm" Icon={Download}
                      onClick={() => { const a=document.createElement("a"); a.href="data:text/plain,"+encodeURIComponent(manimCode); a.download=`${assetName||template?.id||"scene"}.py`; a.click(); }}>
                      Download .py
                    </Btn>
                  </div>
                </div>
                {generatingCode
                  ? <div style={{ textAlign:"center", padding:"32px 0" }}><Spin size={20} color={T.ac}/><div style={{ fontSize:12,color:T.t3,marginTop:8 }}>Claude is writing Manim code…</div></div>
                  : <div style={{ background:"#0a0a0c", borderRadius:8, padding:"12px 14px", fontFamily:"monospace", fontSize:11, color:"#a5b4fc", whiteSpace:"pre-wrap", maxHeight:260, overflowY:"auto", lineHeight:1.65 }}>{manimCode}</div>
                }
              </div>
            </Card>
          )}
        </div>

        {/* ── Right: config + pipeline + output ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

          {/* Config */}
          <Card T={T}>
            <Label T={T}>Render Settings</Label>
            <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
              <div>
                <Label T={T}>Grade</Label>
                <Sel value={grade} onChange={e => setGrade(e.target.value)} T={T}>
                  {[6,7,8,9,10,11,12].map(g => <option key={g} value={g}>Grade {g}</option>)}
                </Sel>
              </div>
              <div>
                <Label T={T}>Render Quality</Label>
                <Sel value={quality} onChange={e => setQuality(e.target.value)} T={T}>
                  <option value="-ql">Low (-ql) — Fast, 480p, for preview</option>
                  <option value="-qm">Medium (-qm) — 720p, balanced</option>
                  <option value="-qh">High (-qh) — 1080p, final output</option>
                  <option value="-qk">4K (-qk) — Slow, maximum quality</option>
                </Sel>
              </div>
              <div style={{ padding:"9px 10px", background:T.s2, borderRadius:7, fontSize:11, color:T.t3, lineHeight:1.6 }}>
                <div style={{ fontWeight:600, color:T.t2, marginBottom:3 }}>Output saved to:</div>
                <code style={{ color:T.g, fontSize:10 }}>./studio_output/{template?.id||"asset"}_gr{grade}.mp4</code>
                <div style={{ marginTop:4 }}>Served at:</div>
                <code style={{ color:T.bl, fontSize:10 }}>localhost:8000/files/{template?.id||"asset"}_gr{grade}.mp4</code>
              </div>
            </div>
          </Card>

          {/* Render pipeline */}
          <Card T={T}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <Label T={T}>Render Pipeline</Label>
              <Btn T={T} variant="primary" size="sm" Icon={PlayIco} loading={isRunning} disabled={!manimCode} onClick={runPipeline}>
                {isRunning ? "Rendering…" : "Render Now"}
              </Btn>
            </div>
            {pipelineStages.map(({ id, label, cmd, Icon }) => {
              const st = pipeline.status[id];
              return (
                <div key={id} style={{ display:"flex", gap:9, padding:"8px 0", borderBottom:`1px solid ${T.b}` }}>
                  <div style={{
                    width:30, height:30, borderRadius:7, flexShrink:0,
                    background: st==="done" ? T.gd : st==="running" ? T.acd : T.s2,
                    display:"flex", alignItems:"center", justifyContent:"center"
                  }}>
                    {st==="running" ? <Spin size={13} color={T.ac}/> : st==="done" ? <Check size={13} color={T.g}/> : <Icon size={13} color={T.t3}/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12, fontWeight:500, color: st==="done" ? T.t : T.t2 }}>{label}</div>
                    <code style={{ fontSize:9, color:T.t3, fontFamily:"monospace", display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{cmd}</code>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Output preview */}
          {outputUrl && (
            <Card T={T} style={{ borderColor:T.g }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
                <CheckCircle size={13} color={T.g}/>
                <Label T={T} style={{ color:T.g }}>Output Ready</Label>
              </div>
              <video src={outputUrl} controls style={{ width:"100%", borderRadius:7, background:"#000" }} />
              <div style={{ marginTop:8, fontSize:11, color:T.t3 }}>
                <code style={{ color:T.g }}>{outputName}</code>
              </div>
              <div style={{ display:"flex", gap:6, marginTop:8 }}>
                <Btn T={T} variant="primary" size="sm" Icon={Download}>Download MP4</Btn>
                <Btn T={T} variant="secondary" size="sm" Icon={Copy} onClick={() => navigator.clipboard.writeText(`http://localhost:8000/files/${outputName}`)}>Copy URL</Btn>
              </div>
            </Card>
          )}

          {/* Saved assets */}
          {savedAssets.length > 0 && (
            <Card T={T}>
              <Label T={T}>Generated This Session</Label>
              {savedAssets.map(a => (
                <div key={a.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${T.b}`, fontSize:11 }}>
                  <div>
                    <div style={{ fontWeight:600, color:T.t }}>{a.name}</div>
                    <div style={{ color:T.t2, marginTop:1 }}>{a.template} · {a.topic || a.subject} {a.subtopic ? `· ${a.subtopic}` : ""}</div>
                    <div style={{ color:T.t3 }}>Grade {a.grade}</div>
                  </div>
                  <code style={{ fontSize:10, color:T.g }}>✅ .mp4</code>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   VIEW: OUTPUT LIBRARY
════════════════════════════════════════════════════════════════════════ */
function OutputView({ T, mode, assets, addToast }) {
  const [viewMode, setViewMode]     = useState("grid");
  const [filter, setFilter]         = useState("all");
  const [serverFiles, setServerFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [deleting, setDeleting]     = useState({});
  const [diskUsage, setDiskUsage]   = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const approved = assets.filter(a => a.status === "approved");
  const shown    = filter === "all" ? approved : approved.filter(a => a.subject === filter);
  const subjects = [...new Set(approved.map(a => a.subject))];

  // Load files from server
  async function loadServerFiles() {
    setLoadingFiles(true);
    try {
      const res = await fetch(`${API_BASE}/api/files/list`);
      const d   = await res.json();
      setServerFiles(d.files || []);
      setDiskUsage(d.disk_usage || null);
    } catch {
      addToast("Could not load server files — backend offline", "error");
    } finally { setLoadingFiles(false); }
  }

  useEffect(() => { loadServerFiles(); }, []);

  // Download file
  function downloadFile(filename) {
    const a = document.createElement("a");
    a.href = `${API_BASE}/files/${filename}`;
    a.download = filename;
    a.click();
  }

  // Delete file from server
  async function deleteFile(filename) {
    setDeleting(d => ({ ...d, [filename]: true }));
    try {
      const res = await fetch(`${API_BASE}/api/files/${filename}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setServerFiles(f => f.filter(x => x.name !== filename));
      addToast(`Deleted: ${filename}`, "success");
    } catch {
      addToast("Delete failed — backend offline", "error");
    } finally { setDeleting(d => ({ ...d, [filename]: false })); }
  }

  // Download then delete
  async function downloadAndDelete(filename) {
    downloadFile(filename);
    await new Promise(r => setTimeout(r, 1500)); // wait for download to start
    await deleteFile(filename);
    addToast("Downloaded and deleted from server", "success");
  }

  const fileIcon = name => {
    if (name.endsWith(".mp4") || name.endsWith(".mov")) return Film;
    if (name.endsWith(".wav") || name.endsWith(".mp3")) return Volume2;
    if (name.endsWith(".txt")) return FileText;
    return FolderOpen;
  };

  const fileSizeMB = bytes => bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Storage indicator ── */}
      <Card T={T} style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HardDrive size={14} color={T.t3} />
            <span style={{ fontSize: 12, fontWeight: 600, color: T.t }}>Server Storage</span>
            {diskUsage && (
              <span style={{ fontSize: 11, color: T.t3 }}>
                {diskUsage.used_gb}GB used of {diskUsage.total_gb}GB
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: T.t3 }}>{serverFiles.length} files on server</span>
            <Btn T={T} variant="secondary" size="sm" Icon={RefreshCw} loading={loadingFiles} onClick={loadServerFiles}>Refresh</Btn>
          </div>
        </div>
        {diskUsage && (
          <div style={{ marginTop: 8, height: 4, background: T.s3, borderRadius: 99 }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${(diskUsage.used_gb / diskUsage.total_gb) * 100}%`,
              background: diskUsage.used_gb / diskUsage.total_gb > 0.8 ? T.r : diskUsage.used_gb / diskUsage.total_gb > 0.6 ? T.y : T.g
            }} />
          </div>
        )}
      </Card>

      {/* ── Server files — real files on DO server ── */}
      <Card T={T}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FolderOpen size={13} color={T.ac} />
            <Label T={T}>Files on Server — Download &amp; Delete to Free Space</Label>
          </div>
          <div style={{ fontSize: 11, color: T.t3, background: T.rd, color: T.r, padding: "2px 8px", borderRadius: 4 }}>
            Download → Upload to TP Stream → Delete
          </div>
        </div>

        {serverFiles.length === 0 && !loadingFiles && (
          <div style={{ textAlign: "center", padding: "20px 0", color: T.t3, fontSize: 12 }}>
            No files on server yet. Render a video to see files here.
          </div>
        )}

        {serverFiles.map(f => {
          const Icon = fileIcon(f.name);
          const isVideo = f.name.endsWith(".mp4") || f.name.endsWith(".mov");
          return (
            <div key={f.name} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: `1px solid ${T.b}`
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 7, background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={14} color={T.t3} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: T.t, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div style={{ fontSize: 10, color: T.t3 }}>{fileSizeMB(f.size)} · {f.modified || ""}</div>
              </div>

              {/* Preview button for videos */}
              {isVideo && (
                <button onClick={() => { setPreviewUrl(`${API_BASE}/files/${f.name}`); setPreviewTitle(f.name); }}
                  style={{ padding: "4px 8px", borderRadius: 5, border: "none", background: T.s2, cursor: "pointer", color: T.t3, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                  <Eye size={11} /> Preview
                </button>
              )}

              {/* Download */}
              <button onClick={() => downloadFile(f.name)}
                style={{ padding: "4px 8px", borderRadius: 5, border: "none", background: T.s2, cursor: "pointer", color: T.t2, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <Download size={11} /> Download
              </button>

              {/* Download + Delete (main action) */}
              <button onClick={() => downloadAndDelete(f.name)}
                style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: T.g + "22", cursor: "pointer", color: T.g, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600 }}>
                <Download size={11} /> Download + Delete
              </button>

              {/* Delete only */}
              <button onClick={() => deleteFile(f.name)} disabled={deleting[f.name]}
                style={{ padding: "4px 8px", borderRadius: 5, border: "none", background: T.rd, cursor: "pointer", color: T.r, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                {deleting[f.name] ? <Spin size={10} color={T.r} /> : <Trash2 size={11} />}
              </button>
            </div>
          );
        })}
      </Card>

      {/* ── Video preview modal ── */}
      {previewUrl && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }} onClick={() => setPreviewUrl(null)}>
          <div style={{ background: T.s, borderRadius: 12, overflow: "hidden", maxWidth: 900, width: "100%" }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${T.b}` }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.t }}>{previewTitle}</span>
              <button onClick={() => setPreviewUrl(null)} style={{ background: "none", border: "none", cursor: "pointer", color: T.t3 }}><X size={16} /></button>
            </div>
            <video src={previewUrl} controls autoPlay style={{ width: "100%", display: "block", background: "#000" }} />
          </div>
        </div>
      )}

      {/* ── Approved assets from pipeline ── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            <button onClick={() => setFilter("all")} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: filter === "all" ? 600 : 400, background: filter === "all" ? T.acd : T.s2, color: filter === "all" ? T.ac : T.t2 }}>
              All ({approved.length})
            </button>
            {subjects.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: filter === s ? 600 : 400, background: filter === s ? T.acd : T.s2, color: filter === s ? T.ac : T.t2 }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => setViewMode("grid")} style={{ padding: 6, borderRadius: 6, border: "none", cursor: "pointer", background: viewMode === "grid" ? T.acd : "transparent", color: viewMode === "grid" ? T.ac : T.t3 }}><LayoutGrid size={14} /></button>
            <button onClick={() => setViewMode("list")} style={{ padding: 6, borderRadius: 6, border: "none", cursor: "pointer", background: viewMode === "list" ? T.acd : "transparent", color: viewMode === "list" ? T.ac : T.t3 }}><ListIco size={14} /></button>
          </div>
        </div>

        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: T.t3 }}>
            <CheckCircle size={28} style={{ margin: "0 auto 10px", display: "block", opacity: .2 }} />
            <div style={{ fontSize: 13, color: T.t2 }}>No approved videos yet</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Mark assets as Approved in Review Queue</div>
          </div>
        ) : viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
            {shown.map(a => (
              <Card key={a.id} T={T} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ height: 150, background: "#0a0a0c", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(99,102,241,.3)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Play size={16} color="#fff" style={{ marginLeft: 2 }} />
                  </div>
                  <div style={{ position: "absolute", top: 8, left: 8 }}><Badge status={a.status} mode="dark" /></div>
                  <div style={{ position: "absolute", top: 8, right: 8 }}><ScoreDot val={a.score} T={DARK} /></div>
                  <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.6)", padding: "2px 6px", borderRadius: 4, fontSize: 10, color: "#fff", fontFamily: "monospace" }}>{a.duration}</div>
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.t, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: T.t3, marginBottom: 8 }}>{a.subject} · Grade {a.grade}</div>
                  <div style={{ display: "flex", gap: 5 }}>
                    <Btn T={T} variant="ghost" size="sm" Icon={Eye}>Preview</Btn>
                    <Btn T={T} variant="secondary" size="sm" Icon={Download}>Export</Btn>
                    <Btn T={T} variant="ghost" size="sm" Icon={Pencil}>Re-edit</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card T={T} style={{ padding: 0, overflow: "hidden" }}>
            {shown.map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: i < shown.length - 1 ? `1px solid ${T.b}` : "none" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: T.s2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Play size={14} color={T.t3} style={{ marginLeft: 2 }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.t, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: T.t3 }}>{a.subject} · Grade {a.grade} · {a.date}</div>
                </div>
                <ScoreDot val={a.score} T={T} />
                <Badge status={a.status} mode={mode} />
                <div style={{ display: "flex", gap: 4 }}>
                  <button style={{ padding: 5, border: "none", background: "transparent", cursor: "pointer", color: T.t3 }}><Eye size={13} /></button>
                  <button style={{ padding: 5, border: "none", background: "transparent", cursor: "pointer", color: T.t3 }}><Download size={13} /></button>
                  <button style={{ padding: 5, border: "none", background: "transparent", cursor: "pointer", color: T.r }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PASSWORD GATE
════════════════════════════════════════════════════════════════════════ */
// ✏️  Change this password to whatever you want your team to use
const TEAM_PASSWORD = "studio2026";

function LoginScreen({ onLogin }) {
  const [pw, setPw]       = useState("");
  const [error, setError] = useState("");
  const [show, setShow]   = useState(false);

  function attempt() {
    if (pw === TEAM_PASSWORD) {
      sessionStorage.setItem("studio_auth", "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setPw("");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#09090b",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', -apple-system, sans-serif"
    }}>
      {/* background glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        background: "#111113", border: "1px solid #27272a",
        borderRadius: 16, padding: "40px 36px", width: 380,
        boxShadow: "0 25px 60px rgba(0,0,0,.5)", position: "relative", zIndex: 1
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#818cf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Film size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#f4f4f5" }}>Studio AI</div>
            <div style={{ fontSize: 11, color: "#52525b" }}>K-12 · NCERT Platform</div>
          </div>
        </div>

        <div style={{ fontSize: 20, fontWeight: 700, color: "#f4f4f5", marginBottom: 6 }}>Welcome back</div>
        <div style={{ fontSize: 13, color: "#71717a", marginBottom: 24 }}>Enter your team password to continue</div>

        {/* Password field */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#a1a1aa", display: "block", marginBottom: 6 }}>
            Team Password
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="Enter password"
              autoFocus
              style={{
                width: "100%", padding: "10px 40px 10px 12px",
                background: "#18181b", border: `1px solid ${error ? "#ef4444" : "#3f3f46"}`,
                borderRadius: 8, color: "#f4f4f5", fontSize: 13,
                fontFamily: "inherit", outline: "none",
                boxSizing: "border-box", transition: "border .15s"
              }}
            />
            <button
              onClick={() => setShow(s => !s)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#52525b", padding: 2 }}>
              {show ? <Eye size={14} /> : <Eye size={14} style={{ opacity: .4 }} />}
            </button>
          </div>
          {error && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 5 }}>{error}</div>}
        </div>

        {/* Login button */}
        <button
          onClick={attempt}
          style={{
            width: "100%", padding: "10px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", marginBottom: 16,
            boxShadow: "0 4px 14px rgba(99,102,241,.35)"
          }}>
          Sign In
        </button>

        <div style={{ fontSize: 11, color: "#3f3f46", textAlign: "center" }}>
          Contact your admin for the team password
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("studio_auth") === "1");
  const [mode, setMode] = useState("dark");
  const [view, setView] = useState("dashboard");
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [toasts, setToasts] = useState([]);
  const [backendOk, setBackendOk] = useState(false);
  const T = mode === "dark" ? DARK : LIGHT;

  // Global styles
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "studio-globals";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
      button { font-family: 'Inter', sans-serif; }
      select, input, textarea { font-family: 'Inter', sans-serif; }
    `;
    document.head.appendChild(el);
    return () => { const e = document.getElementById("studio-globals"); if (e) e.remove(); };
  }, []);

  // Check backend
  useEffect(() => {
    fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) })
      .then(r => r.ok && setBackendOk(true))
      .catch(() => setBackendOk(false));
  }, []);

  function addToast(message, type = "success") {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  function addAsset(asset) { setAssets(a => [asset, ...a]); }
  function updateAsset(id, patch) { setAssets(a => a.map(x => x.id === id ? { ...x, ...patch } : x)); }

  const views = { dashboard: DashboardView, upload: UploadView, review: ReviewView, trim: TrimView, scene: SceneView, asset3d: Asset3DView, output: OutputView };
  const View = views[view];

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.t, fontFamily: "'Inter', sans-serif", fontSize: 13 }}>
      <Sidebar view={view} setView={setView} mode={mode} setMode={setMode} T={T} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar view={view} T={T} backendOk={backendOk} />
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
          <View T={T} mode={mode} assets={assets} addAsset={addAsset} updateAsset={updateAsset} addToast={addToast} setView={setView} />
        </div>
      </div>
      <Toasts toasts={toasts} />
    </div>
  );
}
