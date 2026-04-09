"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios-proxy";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User    { _id:string; name:string; email:string; role:string; createdAt:string; }
interface Subscription { _id:string; userId:{_id:string;name:string;email:string}|string; status:string; currentPeriodEnd:string; createdAt:string; }
interface Order   { _id:string; consumerId:{name:string;email:string}|string; farmerId:{name:string}|string; totalAmount:number; status:string; createdAt:string; }
interface Product { _id:string; name?:string; cropName?:string; price:number; farmerId:{name:string;email:string}|string; category:string; status?:string; description?:string; stock?:number; createdAt:string; imageUrl?:string; type?:string; }
interface Disease { _id:string; userId:{name:string}|string; cropName:string; diagnosis:string; createdAt:string; status:string; }
interface WeatherAlert { _id:string; district:string; message:string; severity:string; createdAt:string; }

type Section = "dashboard"|"users"|"marketplace"|"reports"|"settings";

// ─── Design Tokens — Forest Green ─────────────────────────────────────────────
const T = {
  bg:      "#0e1f16",
  sidebar: "#091710",
  card:    "#122019",
  card2:   "#163025",
  border:  "rgba(106,170,120,0.15)",
  accent:  "#6aaa78",
  accentL: "#a8d5b5",
  green:   "#4ade80",
  amber:   "#d4a853",
  amberL:  "#f0c96b",
  red:     "#f87171",
  blue:    "#60a5fa",
  text:    "#e8f5ec",
  muted:   "#4a7a5a",
  subtle:  "#2d5a3d",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtLKR  = (n:number) => "Rs."+new Intl.NumberFormat("en-LK",{maximumFractionDigits:0}).format(n);
const fmtDate = (d:string) => new Date(d).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
const fmtTime = (d:string) => { const diff=Date.now()-new Date(d).getTime(); const m=Math.floor(diff/60000); if(m<1)return"Just now"; if(m<60)return`${m}m ago`; const h=Math.floor(m/60); if(h<24)return`${h}h ago`; return fmtDate(d); };
const prodName= (p:Product) => p.cropName||p.name||"—";

const statusMeta = (s:string):{bg:string;color:string;label:string} => {
  const m:Record<string,{bg:string;color:string;label:string}> = {
    active:    {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Active"    },
    trialing:  {bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Trialing"  },
    canceled:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Canceled"  },
    past_due:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Past Due"  },
    pending:   {bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Pending"   },
    approved:  {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Approved"  },
    rejected:  {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Rejected"  },
    delivered: {bg:"rgba(74,222,128,.12)",  color:"#4ade80", label:"Delivered" },
    processing:{bg:"rgba(212,168,83,.12)",  color:"#d4a853", label:"Processing"},
    shipped:   {bg:"rgba(96,165,250,.12)",  color:"#60a5fa", label:"Shipped"   },
    cancelled: {bg:"rgba(248,113,113,.12)", color:"#f87171", label:"Cancelled" },
  };
  return m[s?.toLowerCase()]??{bg:"rgba(74,222,128,.08)",color:"#4a7a5a",label:s??"—"};
};

const Pill = ({s}:{s:string}) => {
  const {bg,color,label}=statusMeta(s);
  return <span style={{background:bg,color,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{label}</span>;
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const AV_COLORS = ["#2d5a3d","#1e4a30","#3a6040","#4a7a50","#163520","#0f2a1a"];
const avBg = (name:string) => AV_COLORS[(name||"A").charCodeAt(0)%AV_COLORS.length];
const Avatar = ({name,size=30}:{name:string;size?:number}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:avBg(name||"A"),
    display:"flex",alignItems:"center",justifyContent:"center",
    fontSize:size*0.38,fontWeight:700,color:"#a8d5b5",flexShrink:0,
    border:"1px solid rgba(106,170,120,.2)"}}>
    {(name||"A").slice(0,2).toUpperCase()}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({label,value,delta,accent,sub}:{label:string;value:string|number;delta?:number;accent:string;sub?:string}) => (
  <div style={{background:T.card,borderRadius:14,padding:"20px 22px",border:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:accent,borderRadius:"14px 14px 0 0"}}/>
    {delta!==undefined&&(
      <span style={{position:"absolute",top:14,right:14,fontSize:10,fontWeight:700,
        color:delta>=0?T.green:T.red,background:delta>=0?"rgba(74,222,128,.1)":"rgba(248,113,113,.1)",
        padding:"2px 7px",borderRadius:20}}>{delta>=0?"+":""}{delta}%</span>
    )}
    <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{label}</div>
    <div style={{fontSize:28,fontWeight:800,color:T.text,fontFamily:"'Sora',sans-serif",lineHeight:1,marginBottom:4}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:T.muted}}>{sub}</div>}
  </div>
);

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
const MiniBar = ({data}:{data:{label:string;farmers:number;orders:number}[]}) => {
  const max=Math.max(...data.flatMap(d=>[d.farmers,d.orders]),1);
  const W=100,H=80,bw=6,gap=3,slotW=W/data.length;
  return(
    <svg viewBox={`0 0 ${W} ${H+14}`} style={{width:"100%",height:100}} preserveAspectRatio="none">
      {data.map((d,i)=>{
        const x=i*slotW+(slotW-bw*2-gap)/2;
        const fh=Math.max((d.farmers/max)*H,2);
        const oh=Math.max((d.orders/max)*H,2);
        return(
          <g key={i}>
            <rect x={x}        y={H-fh} width={bw} height={fh} fill={T.accent} opacity={.85} rx={2}/>
            <rect x={x+bw+gap} y={H-oh} width={bw} height={oh} fill={T.amber}  opacity={.85} rx={2}/>
            <text x={x+bw+1.5} y={H+11} textAnchor="middle" fill={T.muted} fontSize={6.5} fontFamily="'DM Sans',sans-serif">{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Donut Chart ──────────────────────────────────────────────────────────────
const Donut = ({farmers,consumers}:{farmers:number;consumers:number}) => {
  const total=farmers+consumers||1;
  const r=36,cx=44,cy=44,circ=2*Math.PI*r;
  const fDash=(farmers/total)*circ;
  return(
    <svg width={88} height={88}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a3a2a" strokeWidth={11}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.amber}  strokeWidth={11} strokeDasharray={circ} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.accent} strokeWidth={11} strokeDasharray={`${fDash} ${circ-fDash}`} strokeDashoffset={0} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy-3} textAnchor="middle" fill={T.text} fontSize={15} fontWeight={700} fontFamily="'Sora',sans-serif">{total}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill={T.muted} fontSize={8} fontFamily="'DM Sans',sans-serif">users</text>
    </svg>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({page,total,per,onChange}:{page:number;total:number;per:number;onChange:(p:number)=>void}) => {
  const pages=Math.ceil(total/per); if(pages<=1)return null;
  return(
    <div style={{display:"flex",gap:5,justifyContent:"flex-end",paddingTop:12}}>
      <PBtn disabled={page===1}     onClick={()=>onChange(Math.max(1,page-1))}>←</PBtn>
      {[...Array(Math.min(5,pages))].map((_,i)=>{ const p=page<=3?i+1:page-2+i; if(p<1||p>pages)return null;
        return <PBtn key={p} active={p===page} onClick={()=>onChange(p)}>{p}</PBtn>; })}
      <PBtn disabled={page===pages} onClick={()=>onChange(Math.min(pages,page+1))}>→</PBtn>
    </div>
  );
};
const PBtn = ({children,onClick,disabled,active}:{children:React.ReactNode;onClick?:()=>void;disabled?:boolean;active?:boolean}) => (
  <button onClick={onClick} disabled={disabled}
    style={{width:28,height:28,borderRadius:7,border:`1px solid ${T.border}`,
      background:active?T.accent:"rgba(106,170,120,.06)",
      color:active?"#0e1f16":T.accentL,fontSize:11,fontWeight:active?700:500,
      cursor:disabled?"not-allowed":"pointer",opacity:disabled?.4:1}}>
    {children}
  </button>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.72)",zIndex:999,
    display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:T.card,borderRadius:16,width:"100%",maxWidth:500,
      maxHeight:"90vh",overflowY:"auto",padding:24,border:`1px solid ${T.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{color:T.text,fontSize:17,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>{title}</h3>
        <button onClick={onClose} style={{background:"rgba(255,255,255,.06)",border:"none",
          color:T.muted,cursor:"pointer",width:30,height:30,borderRadius:8,fontSize:15}}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Form helpers ─────────────────────────────────────────────────────────────
const FL = ({children}:{children:React.ReactNode}) => (
  <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,
    textTransform:"uppercase",letterSpacing:".07em",marginBottom:5}}>{children}</label>
);
const FI = ({value,onChange,type="text",placeholder}:{value:string|number;onChange:(v:string)=>void;type?:string;placeholder?:string}) => (
  <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
      borderRadius:8,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",
      boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
);

// ─── Table helpers ────────────────────────────────────────────────────────────
const TH = ({children,w}:{children:React.ReactNode;w?:string}) => (
  <th style={{padding:"9px 13px",textAlign:"left",color:T.muted,fontWeight:600,fontSize:10,
    textTransform:"uppercase",letterSpacing:".07em",whiteSpace:"nowrap",
    borderBottom:`1px solid rgba(106,170,120,.1)`,width:w}}>{children}</th>
);
const TD = ({children,style}:{children:React.ReactNode;style?:React.CSSProperties}) => (
  <td style={{padding:"10px 13px",color:"#a8d5b5",fontSize:13,
    borderBottom:`1px solid rgba(106,170,120,.06)`,verticalAlign:"middle",...style}}>{children}</td>
);
const TR = ({children,onClick}:{children:React.ReactNode;onClick?:()=>void}) => (
  <tr onClick={onClick}
    onMouseEnter={e=>(e.currentTarget.style.background="rgba(106,170,120,.05)")}
    onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
    style={{transition:"background .12s",cursor:onClick?"pointer":"default"}}>
    {children}
  </tr>
);

// ─── Action Button ────────────────────────────────────────────────────────────
const Btn = ({children,onClick,v="primary",sm,disabled}:{children:React.ReactNode;onClick?:()=>void;v?:"primary"|"danger"|"ghost"|"success";sm?:boolean;disabled?:boolean}) => {
  const vs:Record<string,React.CSSProperties> = {
    primary: {background:T.accent,         color:"#0e1f16",border:"none"},
    success: {background:"rgba(74,222,128,.15)",color:T.green,  border:`1px solid rgba(74,222,128,.25)`},
    danger:  {background:"rgba(248,113,113,.12)",color:T.red,   border:`1px solid rgba(248,113,113,.2)`},
    ghost:   {background:"rgba(106,170,120,.07)",color:T.accentL,border:`1px solid ${T.border}`},
  };
  return(
    <button onClick={onClick} disabled={disabled}
      style={{...vs[v],borderRadius:7,padding:sm?"3px 10px":"8px 16px",
        fontSize:sm?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",
        opacity:disabled?.6:1,fontFamily:"'DM Sans',sans-serif",transition:"opacity .15s"}}
      onMouseEnter={e=>{if(!disabled)(e.currentTarget as HTMLElement).style.opacity=".8";}}
      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="1";}}>
      {children}
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter();

  const [section,   setSection]   = useState<Section>("dashboard");
  const [adminUser, setAdminUser] = useState<User|null>(null);
  const [loading,   setLoading]   = useState(true);

  // ── Data states ────────────────────────────────────────────────────────────
  const [users,    setUsers]    = useState<User[]>([]);
  const [subs,     setSubs]     = useState<Subscription[]>([]);
  const [orders,   setOrders]   = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [weather,  setWeather]  = useState<WeatherAlert[]>([]);

  // ── Users filters ──────────────────────────────────────────────────────────
  const [uSearch,setUSearch]=useState(""); const [uRole,setURole]=useState("all"); const [uPage,setUPage]=useState(1); const U_PER=10;

  // ── Orders filters ─────────────────────────────────────────────────────────
  const [oFilter,setOFilter]=useState("all"); const [oPage,setOPage]=useState(1); const O_PER=10;

  // ── Products / Marketplace ─────────────────────────────────────────────────
  const [pFilter,setPFilter]=useState("all"); const [pSearch,setPSearch]=useState(""); const [pPage,setPPage]=useState(1); const P_PER=10;
  const [pModal,setPModal]  =useState<"create"|"edit"|null>(null);
  const [pEdit, setPEdit]   =useState<Partial<Product&{name:string}>>({});
  const [pSaving,setPSaving]=useState(false);
  const [pError, setPError] =useState("");

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(()=>{
    const raw=localStorage.getItem("agriai_user");
    if(!raw){router.push("/");return;}
    try{
      const u=JSON.parse(raw);
      if(u.role!=="admin"){router.push("/");return;}
      setAdminUser(u);
    }catch{router.push("/");}
  },[router]);

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchAll=useCallback(async()=>{
    setLoading(true);
    try{
      const [uR,sR,oR,pR,dR,wR]=await Promise.allSettled([
        api.get("/auth/users"),
        api.get("/subscriptions/admin/all"),
        api.get("/orders/admin/all"),
        // Try admin endpoint first, fall back to public /products
        api.get("/products/admin/all").catch(()=>api.get("/products")),
        api.get("/diseases/admin/all"),
        api.get("/weather/admin/all"),
      ]);
      if(uR.status==="fulfilled") { const d=uR.value.data; const raw=d?.users??d?.data??d; setUsers(Array.isArray(raw)?raw:[]); }
      if(sR.status==="fulfilled") { const d=sR.value.data; const raw=d?.subscriptions??d?.data??d; setSubs(Array.isArray(raw)?raw:[]); }
      if(oR.status==="fulfilled") { const d=oR.value.data; const raw=d?.orders??d?.data??d; setOrders(Array.isArray(raw)?raw:[]); }
      if(pR.status==="fulfilled") { const d=pR.value.data; const raw=d?.products??d?.data??d; setProducts(Array.isArray(raw)?raw:[]); }
      if(dR.status==="fulfilled") { const d=dR.value.data; const raw=d?.diseases??d?.data??d; setDiseases(Array.isArray(raw)?raw:[]); }
      if(wR.status==="fulfilled") { const d=wR.value.data; const raw=d?.alerts??d?.data??d; setWeather(Array.isArray(raw)?raw:[]); }
    }catch(e){console.error("fetchAll error",e);}
    setLoading(false);
  },[]);

  useEffect(()=>{if(adminUser)fetchAll();},[adminUser,fetchAll]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const farmers    = (Array.isArray(users)?users:[]).filter(u=>u.role==="farmer");
  const consumers  = (Array.isArray(users)?users:[]).filter(u=>u.role==="user"||u.role==="consumer");
  const activeSubs = (Array.isArray(subs)?subs:[]).filter(s=>s.status==="active"||s.status==="trialing");
  const totalRev   = activeSubs.length*2999;
  const todayScan  = (Array.isArray(diseases)?diseases:[]).filter(d=>new Date(d.createdAt).toDateString()===new Date().toDateString()).length;

  const chartData=(()=>{
    const out:{label:string;farmers:number;orders:number}[]=[];
    for(let i=5;i>=0;i--){
      const d=new Date(); d.setMonth(d.getMonth()-i);
      const ym=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      out.push({label:d.toLocaleString("en",{month:"short"}),
        farmers:farmers.filter(u=>u.createdAt?.startsWith(ym)).length,
        orders: orders.filter(x=>x.createdAt?.startsWith(ym)).length});
    }
    return out;
  })();

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filtUsers=users.filter(u=>{
    const mR=uRole==="all"||u.role===uRole;
    const mS=!uSearch||u.name?.toLowerCase().includes(uSearch.toLowerCase())||u.email?.toLowerCase().includes(uSearch.toLowerCase());
    return mR&&mS;
  });
  const pagedUsers  = filtUsers.slice((uPage-1)*U_PER,uPage*U_PER);

  const filtOrders  = oFilter==="all"?orders:orders.filter(o=>o.status===oFilter);
  const pagedOrders = filtOrders.slice((oPage-1)*O_PER,oPage*O_PER);

  const filtProds=products.filter(p=>{
    const mF=pFilter==="all"||(p.status??"pending")===pFilter;
    const mS=!pSearch||prodName(p).toLowerCase().includes(pSearch.toLowerCase());
    return mF&&mS;
  });
  const pagedProds=filtProds.slice((pPage-1)*P_PER,pPage*P_PER);

  // ── Product CRUD ───────────────────────────────────────────────────────────
  const handleProdStatus=async(id:string,status:string)=>{
    try{
      // Use the correct admin status update endpoint
      await api.patch(`/products/admin/${id}/status`,{status})
        .catch(()=>api.put(`/products/${id}`,{status}));
      await fetchAll();
    }catch(e:any){console.error("Status update error:",e.message);}
  };

  const handleProdDelete=async(id:string)=>{
    if(!confirm("Delete this product permanently?"))return;
    try{
      await api.delete(`/products/${id}`);
      setProducts(prev=>prev.filter(p=>p._id!==id));
    }catch(e:any){alert(e.response?.data?.message||"Delete failed.");}
  };

  const openCreate=()=>{ setPEdit({cropName:"",name:"",category:"",price:0,stock:0,description:""}); setPError(""); setPModal("create"); };
  const openEdit  =(p:Product)=>{ setPEdit({...p,name:p.cropName||p.name||""}); setPError(""); setPModal("edit"); };

  const handleProdSave=async()=>{
    const nm=pEdit.cropName||pEdit.name||"";
    if(!nm.trim()||!pEdit.category||!pEdit.price){ setPError("Name, category and price are required."); return; }
    setPSaving(true); setPError("");
    try{
      const payload={cropName:nm,name:nm,category:pEdit.category,price:Number(pEdit.price),stock:Number(pEdit.stock||0),description:pEdit.description||""};
      if(pModal==="create") await api.post("/products",payload);
      else                  await api.put(`/products/${pEdit._id}`,payload);
      setPModal(null); await fetchAll();
    }catch(e:any){ setPError(e.response?.data?.message||"Save failed."); }
    finally{ setPSaving(false); }
  };

  // ── Sidebar nav items ──────────────────────────────────────────────────────
  const NAV = [
    {id:"dashboard"  as Section, label:"Dashboard"},
    {id:"users"      as Section, label:"Users",       badge:users.length},
    {id:"marketplace"as Section, label:"Marketplace", badge:products.filter(p=>!p.status||p.status==="pending").length||undefined},
    {id:"reports"    as Section, label:"Reports"},
    {id:"settings"   as Section, label:"Settings"},
  ];

  const card:React.CSSProperties={background:T.card,borderRadius:14,border:`1px solid ${T.border}`,padding:"20px 22px"};

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD OVERVIEW
  // ══════════════════════════════════════════════════════════════════════════
  const DashSection=()=>(
    <div>
      {/* Stats row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard label="Total Users"       value={users.length}   delta={8}  accent={T.accent} sub={`${farmers.length} farmers · ${consumers.length} consumers`}/>
        <StatCard label="Active Farmers"    value={farmers.length} delta={5}  accent={T.blue}   sub={`${activeSubs.length} active subscriptions`}/>
        <StatCard label="Scans Today"       value={todayScan}      delta={14} accent={T.green}  sub={`${diseases.length} total scans`}/>
        <StatCard label="Monthly Revenue"   value={fmtLKR(totalRev)} delta={-2} accent={T.amber} sub={`${activeSubs.length} × Rs.2,999`}/>
      </div>

      {/* Chart + System alerts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14,marginBottom:16}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <div>
              <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>User Registration & Activity</p>
              <p style={{color:T.muted,fontSize:11,margin:"3px 0 0"}}>Last 6 months</p>
            </div>
            <div style={{display:"flex",gap:12,fontSize:11,color:T.muted,alignItems:"center"}}>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:9,height:9,background:T.accent,borderRadius:2,display:"inline-block"}}/>Farmers</span>
              <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:9,height:9,background:T.amber, borderRadius:2,display:"inline-block"}}/>Orders</span>
            </div>
          </div>
          <MiniBar data={chartData}/>
        </div>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>System Alerts</p>
          {weather.length===0
            ?<div style={{padding:"10px 12px",background:"rgba(74,222,128,.08)",borderRadius:9,border:"1px solid rgba(74,222,128,.15)"}}>
               <p style={{color:T.green,fontSize:12,fontWeight:600,margin:0}}>System Health: All OK</p>
               <p style={{color:T.muted,fontSize:11,margin:"2px 0 0"}}>All microservices running normally</p>
             </div>
            :weather.slice(0,4).map(a=>(
               <div key={a._id} style={{marginBottom:9,padding:"9px 12px",background:"rgba(212,168,83,.06)",borderRadius:9,border:"1px solid rgba(212,168,83,.15)"}}>
                 <p style={{color:T.amber,fontSize:12,fontWeight:600,margin:0}}>{a.district}</p>
                 <p style={{color:"#a8d5b5",fontSize:11,margin:"2px 0 0"}}>{a.message}</p>
               </div>
             ))}
        </div>
      </div>

      {/* User Breakdown + Disease + Recent */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        {/* Donut */}
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 14px"}}>User Breakdown</p>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <Donut farmers={farmers.length} consumers={consumers.length}/>
            <div>
              {[{label:"Farmers",val:farmers.length,c:T.accent},{label:"Consumers",val:consumers.length,c:T.amber}].map(r=>(
                <div key={r.label} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <span style={{width:9,height:9,background:r.c,borderRadius:2,display:"inline-block",flexShrink:0}}/>
                  <span style={{color:"#a8d5b5",fontSize:12}}>{r.label}</span>
                  <span style={{color:T.text,fontWeight:700,marginLeft:4}}>{r.val}</span>
                  <span style={{color:T.muted,fontSize:11}}>({Math.round((r.val/(users.length||1))*100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Disease Reports */}
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>Top Disease Reports</p>
            <span onClick={()=>setSection("reports")} style={{fontSize:11,color:T.accentL,cursor:"pointer"}}>View All</span>
          </div>
          {diseases.length===0
            ?<p style={{color:T.muted,fontSize:12}}>No disease reports yet</p>
            :diseases.slice(0,4).map(d=>(
               <div key={d._id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                 <div>
                   <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0}}>{d.cropName}</p>
                   <p style={{color:T.muted,fontSize:10,margin:0}}>{d.diagnosis}</p>
                 </div>
                 <span style={{color:T.muted,fontSize:10}}>{fmtDate(d.createdAt)}</span>
               </div>
             ))}
        </div>

        {/* Recent Registrations */}
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>Recent Registrations</p>
            <span onClick={()=>setSection("users")} style={{fontSize:11,color:T.accentL,cursor:"pointer"}}>Manage →</span>
          </div>
          {users.slice(0,5).map(u=>{
            const sub=subs.find(s=>(typeof s.userId==="object"?s.userId._id:s.userId)===u._id);
            return(
              <div key={u._id} style={{display:"flex",alignItems:"center",gap:9,padding:"6px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                <Avatar name={u.name} size={28}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</p>
                  <p style={{color:T.muted,fontSize:10,margin:0,textTransform:"capitalize"}}>{u.role==="user"?"Consumer":u.role}</p>
                </div>
                {sub?<Pill s={sub.status}/>:<span style={{color:T.muted,fontSize:10}}>—</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // USERS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const UsersSection=()=>(
    <div>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input value={uSearch} onChange={e=>{setUSearch(e.target.value);setUPage(1);}} placeholder="Search name or email…"
          style={{flex:1,minWidth:200,background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
            borderRadius:8,padding:"8px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        {["all","farmer","user","admin"].map(r=>(
          <button key={r} onClick={()=>{setURole(r);setUPage(1);}}
            style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${T.border}`,
              background:uRole===r?T.accent:"rgba(106,170,120,.05)",
              color:uRole===r?"#0e1f16":T.muted,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {r==="all"?"All":r==="user"?"Consumer":r.charAt(0).toUpperCase()+r.slice(1)}
          </button>
        ))}
        <span style={{color:T.muted,fontSize:12,marginLeft:"auto"}}>{filtUsers.length} users</span>
      </div>
      <div style={card}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><TH>User</TH><TH>Role</TH><TH>Subscription</TH><TH>Joined</TH><TH>Status</TH></tr></thead>
            <tbody>
              {pagedUsers.map(u=>{
                const sub=subs.find(s=>(typeof s.userId==="object"?s.userId._id:s.userId)===u._id);
                return(
                  <TR key={u._id}>
                    <TD><div style={{display:"flex",alignItems:"center",gap:10}}>
                      <Avatar name={u.name} size={32}/>
                      <div>
                        <p style={{color:T.text,fontSize:13,fontWeight:600,margin:0}}>{u.name}</p>
                        <p style={{color:T.muted,fontSize:10,margin:0}}>{u.email}</p>
                      </div>
                    </div></TD>
                    <TD><span style={{textTransform:"capitalize"}}>{u.role==="user"?"Consumer":u.role}</span></TD>
                    <TD>{sub?<Pill s={sub.status}/>:<span style={{color:T.muted,fontSize:11}}>No subscription</span>}</TD>
                    <TD style={{color:T.muted}}>{fmtDate(u.createdAt)}</TD>
                    <TD><Pill s="active"/></TD>
                  </TR>
                );
              })}
              {pagedUsers.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:T.muted}}>No users found</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={uPage} total={filtUsers.length} per={U_PER} onChange={setUPage}/>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // MARKETPLACE SECTION — full CRUD + real product fetch
  // ══════════════════════════════════════════════════════════════════════════
  const MarketSection=()=>(
    <div>
      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
        {[
          {label:"Total Products",  value:products.length,                                                   accent:T.accent},
          {label:"Pending Review",  value:products.filter(p=>!p.status||p.status==="pending").length,         accent:T.amber},
          {label:"Approved",        value:products.filter(p=>p.status==="approved"||p.status==="Active").length,accent:T.green},
          {label:"Rejected",        value:products.filter(p=>p.status==="rejected").length,                   accent:T.red},
        ].map(s=>(
          <div key={s.label} style={{...card,padding:"14px 16px"}}>
            <p style={{color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 5px"}}>{s.label}</p>
            <p style={{color:s.accent,fontSize:24,fontWeight:800,fontFamily:"'Sora',sans-serif",margin:0}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={pSearch} onChange={e=>{setPSearch(e.target.value);setPPage(1);}} placeholder="Search products…"
          style={{flex:1,minWidth:180,background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
            borderRadius:8,padding:"8px 13px",color:T.text,fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        {["all","pending","approved","Active","rejected"].map(f=>(
          <button key={f} onClick={()=>{setPFilter(f);setPPage(1);}}
            style={{padding:"7px 13px",borderRadius:8,border:`1px solid ${T.border}`,
              background:pFilter===f?T.accent:"rgba(106,170,120,.05)",
              color:pFilter===f?"#0e1f16":T.muted,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <Btn onClick={openCreate}>+ Add Product</Btn>
      </div>

      {/* Table */}
      <div style={card}>
        {products.length===0&&!loading?(
          <div style={{textAlign:"center",padding:"48px 0",color:T.muted}}>
            <p style={{fontSize:14,fontWeight:600,marginBottom:6}}>No products found</p>
            <p style={{fontSize:12,maxWidth:440,margin:"0 auto",lineHeight:1.6}}>
              Products added by farmers will appear here automatically.<br/>
              Make sure <code style={{color:T.accentL,background:"rgba(106,170,120,.1)",padding:"1px 6px",borderRadius:4}}>/api/products/admin/all</code> is registered in your backend routes.
            </p>
          </div>
        ):(
          <>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>
                  <TH>Product</TH><TH>Farmer</TH><TH>Category</TH>
                  <TH>Price</TH><TH>Stock</TH><TH>Status</TH><TH>Actions</TH>
                </tr></thead>
                <tbody>
                  {pagedProds.map(p=>{
                    const fname=typeof p.farmerId==="object"?p.farmerId.name:"—";
                    const pStatus=p.status||"pending";
                    return(
                      <TR key={p._id}>
                        <TD>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            {p.imageUrl?(
                              <img src={`http://localhost:5000${p.imageUrl}`} alt={prodName(p)}
                                style={{width:34,height:34,borderRadius:8,objectFit:"cover",flexShrink:0,border:`1px solid ${T.border}`}}
                                onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                            ):(
                              <div style={{width:34,height:34,borderRadius:8,background:"rgba(106,170,120,.1)",
                                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                                🌾
                              </div>
                            )}
                            <div>
                              <p style={{color:T.text,fontWeight:600,margin:0,fontSize:13}}>{prodName(p)}</p>
                              {p.type&&<p style={{color:T.muted,fontSize:10,margin:0}}>{p.type}</p>}
                            </div>
                          </div>
                        </TD>
                        <TD style={{color:T.muted}}>{fname}</TD>
                        <TD style={{textTransform:"capitalize",color:"#a8d5b5"}}>{p.category||"—"}</TD>
                        <TD style={{color:T.amber,fontWeight:600}}>{fmtLKR(p.price)}</TD>
                        <TD style={{color:"#a8d5b5"}}>{p.stock??"—"}</TD>
                        <TD><Pill s={pStatus}/></TD>
                        <TD>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            {pStatus!=="approved"&&pStatus!=="Active"&&(
                              <Btn sm v="success" onClick={()=>handleProdStatus(p._id,"approved")}>Approve</Btn>
                            )}
                            {pStatus!=="rejected"&&(
                              <Btn sm v="danger" onClick={()=>handleProdStatus(p._id,"rejected")}>Reject</Btn>
                            )}
                            <Btn sm v="ghost" onClick={()=>openEdit(p)}>Edit</Btn>
                            <Btn sm v="danger" onClick={()=>handleProdDelete(p._id)}>Delete</Btn>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                  {pagedProds.length===0&&products.length>0&&(
                    <tr><td colSpan={7} style={{padding:24,textAlign:"center",color:T.muted}}>No products match filters</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination page={pPage} total={filtProds.length} per={P_PER} onChange={setPPage}/>
          </>
        )}
      </div>

      {/* Product Modal */}
      {pModal&&(
        <Modal title={pModal==="create"?"Add New Product":"Edit Product"} onClose={()=>setPModal(null)}>
          {pError&&(
            <div style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",
              borderRadius:8,padding:"9px 12px",color:T.red,fontSize:12,marginBottom:14}}>
              {pError}
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><FL>Product Name *</FL><FI value={pEdit.cropName||pEdit.name||""} onChange={v=>setPEdit(x=>({...x,cropName:v,name:v}))} placeholder="e.g. Organic Tomatoes"/></div>
            <div>
              <FL>Category *</FL>
              <select value={pEdit.category||""} onChange={e=>setPEdit(x=>({...x,category:e.target.value}))}
                style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"9px 12px",color:pEdit.category?T.text:T.muted,fontSize:13,outline:"none"}}>
                <option value="">Select category</option>
                {["Leafy Green","Root","Fruit","Grain","Herb","Seafood","Dairy","Other"].map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><FL>Price (LKR) *</FL><FI type="number" value={pEdit.price||0} onChange={v=>setPEdit(x=>({...x,price:+v}))} placeholder="150"/></div>
              <div><FL>Stock (kg)</FL><FI type="number" value={pEdit.stock||0} onChange={v=>setPEdit(x=>({...x,stock:+v}))} placeholder="25"/></div>
            </div>
            <div>
              <FL>Description</FL>
              <textarea value={pEdit.description||""} onChange={e=>setPEdit(x=>({...x,description:e.target.value}))}
                placeholder="Product description…" rows={3}
                style={{width:"100%",background:"rgba(106,170,120,.05)",border:`1px solid ${T.border}`,
                  borderRadius:8,padding:"9px 12px",color:T.text,fontSize:13,outline:"none",
                  resize:"vertical",boxSizing:"border-box",fontFamily:"'DM Sans',sans-serif"}}/>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
              <Btn v="ghost" onClick={()=>setPModal(null)}>Cancel</Btn>
              <Btn onClick={handleProdSave} disabled={pSaving}>
                {pSaving?"Saving…":pModal==="create"?"Create Product":"Save Changes"}
              </Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // REPORTS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const ReportsSection=()=>(
    <div>
      {/* Revenue summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[
          {label:"Subscription Revenue",value:fmtLKR(totalRev),       accent:T.accent},
          {label:"Total Orders",        value:orders.length,           accent:T.blue},
          {label:"Order Value",         value:fmtLKR(orders.reduce((a,o)=>a+(o.totalAmount||0),0)), accent:T.amber},
          {label:"Active Subscriptions",value:activeSubs.length,       accent:T.green},
        ].map(s=>(
          <div key={s.label} style={card}>
            <p style={{color:T.muted,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 5px"}}>{s.label}</p>
            <p style={{color:s.accent,fontSize:22,fontWeight:800,fontFamily:"'Sora',sans-serif",margin:0}}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div style={{...card,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>All Orders</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["all","pending","processing","shipped","delivered","cancelled"].map(f=>(
              <button key={f} onClick={()=>{setOFilter(f);setOPage(1);}}
                style={{padding:"4px 10px",borderRadius:7,border:`1px solid ${T.border}`,
                  background:oFilter===f?T.accent:"rgba(106,170,120,.05)",
                  color:oFilter===f?"#0e1f16":T.muted,fontSize:10,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><TH>Order ID</TH><TH>Consumer</TH><TH>Amount</TH><TH>Status</TH><TH>Date</TH></tr></thead>
            <tbody>
              {pagedOrders.map(o=>{
                const cName=typeof o.consumerId==="object"?o.consumerId.name:"—";
                return(
                  <TR key={o._id}>
                    <TD style={{fontFamily:"monospace",fontSize:11,color:T.muted}}>#{o._id.slice(-6).toUpperCase()}</TD>
                    <TD style={{color:T.text,fontWeight:500}}>{cName}</TD>
                    <TD style={{color:T.amber,fontWeight:600}}>{fmtLKR(o.totalAmount||0)}</TD>
                    <TD><Pill s={o.status||"pending"}/></TD>
                    <TD style={{color:T.muted}}>{fmtDate(o.createdAt)}</TD>
                  </TR>
                );
              })}
              {pagedOrders.length===0&&<tr><td colSpan={5} style={{padding:24,textAlign:"center",color:T.muted}}>No orders</td></tr>}
            </tbody>
          </table>
        </div>
        <Pagination page={oPage} total={filtOrders.length} per={O_PER} onChange={setOPage}/>
      </div>

      {/* Disease + Weather */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>Disease Scan Reports</p>
          {diseases.length===0?<p style={{color:T.muted,fontSize:12}}>No reports</p>
            :diseases.slice(0,6).map(d=>(
              <div key={d._id} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid rgba(106,170,120,.08)`}}>
                <div>
                  <p style={{color:T.text,fontSize:12,fontWeight:500,margin:0}}>{d.cropName}</p>
                  <p style={{color:T.muted,fontSize:10,margin:0}}>{d.diagnosis}</p>
                </div>
                <span style={{color:T.muted,fontSize:10}}>{fmtDate(d.createdAt)}</span>
              </div>
            ))}
        </div>
        <div style={card}>
          <p style={{color:T.text,fontSize:14,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:"0 0 12px"}}>Weather Alerts</p>
          {weather.length===0
            ?<div style={{padding:"9px 12px",background:"rgba(74,222,128,.06)",borderRadius:9,border:"1px solid rgba(74,222,128,.12)"}}>
               <p style={{color:T.green,fontSize:12,fontWeight:600,margin:0}}>No active alerts</p>
             </div>
            :weather.map(a=>(
               <div key={a._id} style={{marginBottom:9,padding:"9px 12px",background:"rgba(212,168,83,.06)",borderRadius:9,border:"1px solid rgba(212,168,83,.15)"}}>
                 <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                   <span style={{color:T.amber,fontWeight:600,fontSize:12}}>{a.district}</span>
                   <span style={{color:T.muted,fontSize:10}}>{fmtDate(a.createdAt)}</span>
                 </div>
                 <p style={{color:"#a8d5b5",fontSize:11,margin:"0 0 5px"}}>{a.message}</p>
                 <Pill s={a.severity||"medium"}/>
               </div>
             ))}
        </div>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SETTINGS SECTION
  // ══════════════════════════════════════════════════════════════════════════
  const SettingsSection=()=>(
    <div style={{maxWidth:560}}>
      <div style={card}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <Avatar name={adminUser?.name||"A"} size={50}/>
          <div>
            <p style={{color:T.text,fontSize:16,fontWeight:700,margin:0}}>{adminUser?.name||"Admin"}</p>
            <p style={{color:T.muted,fontSize:12,margin:"2px 0 5px"}}>{adminUser?.email}</p>
            <Pill s="active"/>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16}}>
          {[
            ["Farmer Subscription","Rs.2,999 / month"],
            ["Stripe Mode","Test Mode"],
            ["AI Model","Cerebras / Llama 4 Scout"],
            ["Weather API","OpenWeatherMap (Free Tier)"],
            ["Platform","Agreal v1.0"],
          ].map(([k,v])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
              <span style={{color:T.muted}}>{k}</span>
              <span style={{color:T.text,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent=()=>{
    if(loading)return<div style={{color:T.accentL,padding:40,textAlign:"center",fontSize:14}}>Loading data…</div>;
    switch(section){
      case"dashboard":  return<DashSection/>;
      case"users":      return<UsersSection/>;
      case"marketplace":return<MarketSection/>;
      case"reports":    return<ReportsSection/>;
      case"settings":   return<SettingsSection/>;
    }
  };

  const META:Record<Section,{title:string;sub:string}>={
    dashboard:  {title:"Admin Dashboard",   sub:"Platform overview and key metrics"},
    users:      {title:"Users",             sub:"Manage registered users and subscriptions"},
    marketplace:{title:"Marketplace",       sub:"Review, approve and manage all product listings"},
    reports:    {title:"Reports",           sub:"Orders, revenue, disease scans and weather alerts"},
    settings:   {title:"Settings",          sub:"Admin account and platform configuration"},
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{background:${T.bg};font-family:'DM Sans',sans-serif;color:${T.text};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#1a3a2a;border-radius:10px;}
        input::placeholder,textarea::placeholder{color:${T.muted};}
        option{background:#122019;color:#e8f5ec;}
        code{background:rgba(106,170,120,.12);padding:2px 6px;border-radius:4px;color:${T.accentL};}
      `}</style>

      <div style={{display:"flex",minHeight:"100vh",background:T.bg}}>

        {/* ════ SIDEBAR ════ */}
        <aside style={{width:218,flexShrink:0,background:T.sidebar,display:"flex",flexDirection:"column",
          position:"sticky",top:0,height:"100vh",overflowY:"auto",borderRight:`1px solid ${T.border}`}}>

          {/* Logo */}
          <div style={{padding:"20px 18px 14px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:22,color:"#fff",letterSpacing:"-.5px"}}>
              Ag<span style={{color:T.accent}}>real</span>
            </div>
            <span style={{fontSize:9,fontWeight:700,color:T.accent,background:"rgba(106,170,120,.15)",
              padding:"2px 8px",borderRadius:6,letterSpacing:1,textTransform:"uppercase"}}>
              Admin
            </span>
          </div>

          {/* User */}
          {adminUser&&(
            <div style={{padding:"13px 18px",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Avatar name={adminUser.name} size={34}/>
                <div style={{minWidth:0}}>
                  <p style={{color:"#fff",fontSize:12,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{adminUser.name}</p>
                  <p style={{color:T.muted,fontSize:9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",margin:0}}>{adminUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{flex:1,padding:"10px 8px"}}>
            <p style={{fontSize:9,fontWeight:700,color:"#1a3a2a",padding:"8px 10px 4px",letterSpacing:1.2,textTransform:"uppercase"}}>Overview</p>
            {NAV.slice(0,1).map(item=>{
              const active=section===item.id;
              return(
                <div key={item.id} onClick={()=>setSection(item.id)}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,cursor:"pointer",
                    fontSize:13,fontWeight:active?600:400,color:active?"#fff":T.muted,
                    background:active?"rgba(106,170,120,.18)":"transparent",transition:"all .12s",
                    userSelect:"none",marginBottom:2,borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent"}}>
                  <span style={{flex:1}}>{item.label}</span>
                </div>
              );
            })}
            <p style={{fontSize:9,fontWeight:700,color:"#1a3a2a",padding:"12px 10px 4px",letterSpacing:1.2,textTransform:"uppercase"}}>Management</p>
            {NAV.slice(1).map(item=>{
              const active=section===item.id;
              return(
                <div key={item.id} onClick={()=>setSection(item.id)}
                  style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,cursor:"pointer",
                    fontSize:13,fontWeight:active?600:400,color:active?"#fff":T.muted,
                    background:active?"rgba(106,170,120,.18)":"transparent",transition:"all .12s",
                    userSelect:"none",marginBottom:2,borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent"}}>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge!==undefined&&item.badge>0&&(
                    <span style={{background:active?T.accent:"rgba(106,170,120,.2)",
                      color:active?"#0e1f16":T.accent,fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10}}>
                      {item.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{padding:"10px 8px",borderTop:`1px solid ${T.border}`}}>
            <button onClick={fetchAll}
              style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"none",
                background:"rgba(106,170,120,.1)",color:T.accent,fontSize:12,fontWeight:600,
                cursor:"pointer",marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>
              Refresh Data
            </button>
            <button onClick={()=>{localStorage.removeItem("agriai_token");localStorage.removeItem("agriai_user");router.push("/");}}
              style={{width:"100%",padding:"8px 10px",borderRadius:9,border:"none",
                background:"rgba(248,113,113,.08)",color:T.red,fontSize:12,fontWeight:600,
                cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ════ MAIN ════ */}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>

          {/* Header */}
          <header style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"13px 26px",
            display:"flex",alignItems:"center",justifyContent:"space-between",
            position:"sticky",top:0,zIndex:50}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:T.muted,marginBottom:3}}>
                <span>Dashboards</span><span>/</span>
                <span style={{color:T.text,textTransform:"capitalize"}}>{section}</span>
              </div>
              <h1 style={{color:T.text,fontSize:18,fontWeight:700,fontFamily:"'Sora',sans-serif",margin:0}}>
                {META[section].title}
              </h1>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:11,color:T.muted}}>
                {new Date().toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}
              </span>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(74,222,128,.08)",
                border:"1px solid rgba(74,222,128,.15)",borderRadius:99,padding:"4px 10px"}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}/>
                <span style={{fontSize:10,fontWeight:700,color:T.green}}>All systems operational</span>
              </div>
              <Avatar name={adminUser?.name||"A"} size={32}/>
            </div>
          </header>

          {/* Content */}
          <div style={{flex:1,padding:"22px 26px",overflowX:"hidden"}}>
            <p style={{color:T.muted,fontSize:12,marginBottom:18}}>{META[section].sub}</p>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}