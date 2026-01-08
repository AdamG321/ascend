
import React, { useState, useEffect } from 'react';
import { UserData, Message } from './types';
import Navigation from './components/Navigation';
import TheGrove from './components/TheGrove';
import { getAuraResponse } from './services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const INITIAL_USER_DATA: UserData = {
  streak: 0,
  maxStreak: 0,
  lastCheckIn: null,
  shards: 10,
  level: 1,
  exp: 0,
  ecosystem: {
    mushrooms: 0,
    bushes: 0,
    squirrels: 0,
    birds: 0,
    guardians: 0,
    streams: 0,
    flowers: 0,
    ancientStones: 0,
    sunRays: 0
  },
  history: []
};

// --- KONFIGURÁCIÓ: Itt állítsd be a titkos kódot! ---
const SECRET_PIN = "6589"; 

const App: React.FC = () => {
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [activeTab, setActiveTab] = useState<'home' | 'aura' | 'tree' | 'stats'>('home');
  const [auraMessages, setAuraMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAuraLoading, setIsAuraLoading] = useState(false);
  const [showShop, setShowShop] = useState(false);
  
  // Authorization state
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ascend_user_data_v6');
    const authStatus = sessionStorage.getItem('ascend_auth_v1');
    
    if (saved) {
      setUserData(JSON.parse(saved));
    }
    if (authStatus === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ascend_user_data_v6', JSON.stringify(userData));
  }, [userData]);

  const handleAuth = () => {
    if (pinInput === SECRET_PIN) {
      setIsAuthorized(true);
      sessionStorage.setItem('ascend_auth_v1', 'true');
    } else {
      setPinError(true);
      setPinInput('');
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (userData.lastCheckIn === todayStr) {
      alert("Mára már megőrizted a fényt. Gyere vissza holnap!");
      return;
    }
    const newStreak = userData.streak + 1;
    const newExp = userData.exp + 25;
    const newLevel = Math.floor(newExp / 100) + 1;
    setUserData(prev => ({
      ...prev,
      streak: newStreak,
      maxStreak: Math.max(prev.maxStreak, newStreak),
      lastCheckIn: todayStr,
      exp: newExp,
      level: newLevel,
      shards: prev.shards + 15,
      history: [...prev.history, { date: todayStr, success: 1 }]
    }));
  };

  const buyEcoItem = (type: keyof UserData['ecosystem'], cost: number) => {
    if (userData.shards >= cost) {
      setUserData(prev => ({
        ...prev,
        shards: prev.shards - cost,
        ecosystem: {
          ...prev.ecosystem,
          [type]: prev.ecosystem[type] + 1
        }
      }));
    } else {
      alert("Nincs elég Shard-od ehhez az életformához.");
    }
  };

  const handleRelapse = () => {
    if (window.confirm("Valóban kialudt a tűz? Ez visszaállítja a számlálódat. Az erdőd megmarad, de a fád újra csemetévé válik.")) {
      setUserData(prev => ({
        ...prev,
        streak: 0,
        history: [...prev.history, { date: new Date().toISOString().split('T')[0], success: 0 }]
      }));
    }
  };

  const sendMessageToAura = async () => {
    if (!userInput.trim()) return;
    const newMessage: Message = { role: 'user', content: userInput, timestamp: Date.now() };
    setAuraMessages(prev => [...prev, newMessage]);
    setUserInput('');
    setIsAuraLoading(true);
    const response = await getAuraResponse(userInput, userData.streak);
    setAuraMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: Date.now() }]);
    setIsAuraLoading(false);
  };

  // --- RENDERING COMPONENTS ---

  const renderGate = () => (
    <div className="fixed inset-0 z-[100] bg-[#05080a] flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-amber-600/5 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="space-y-6 relative z-10 w-full max-w-xs">
        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(245,158,11,0.3)] rotate-12 mb-8">
           <i className="fa-solid fa-fire text-white text-4xl"></i>
        </div>
        
        <h1 className="cinzel text-3xl font-black tracking-[0.3em] text-white">SZENTÉLY</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Belépés csak az Őrzőknek</p>
        
        <div className="mt-12 space-y-4">
          <input 
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
            placeholder="PIN KÓD"
            className={`w-full bg-slate-900/50 border-2 ${pinError ? 'border-red-500 animate-shake' : 'border-slate-800'} rounded-3xl py-5 px-6 text-center text-2xl tracking-[1em] text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:tracking-normal placeholder:text-xs placeholder:text-slate-700`}
          />
          <button 
            onClick={handleAuth}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-5 rounded-3xl text-[10px] uppercase tracking-[0.5em] transition-all active:scale-95 shadow-2xl"
          >
            BEAVATÁS
          </button>
        </div>

        {pinError && <p className="text-red-500/80 text-[10px] font-black uppercase tracking-widest animate-pulse">Hibás kód. A fény elhalványul...</p>}
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 space-y-12 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="cinzel text-8xl font-bold text-white tracking-widest transition-all duration-500 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
          {userData.streak}
        </h1>
        <p className="text-amber-500 uppercase tracking-[0.4em] font-black text-[10px] flex items-center justify-center">
           A TISZTASÁG TÜZE
        </p>
      </div>

      <div className="relative group flex items-center justify-center">
        <div className="absolute w-72 h-72 bg-amber-600/5 rounded-full blur-[70px] animate-pulse"></div>
        <div className="absolute w-56 h-56 bg-orange-500/10 rounded-full blur-[40px] transition-all group-hover:bg-orange-500/20"></div>
        
        <button 
          onClick={handleCheckIn}
          className="relative w-44 h-44 flex items-center justify-center bg-transparent rounded-full border-2 border-slate-800/40 hover:border-amber-500/30 transition-all duration-700 shadow-2xl active:scale-90 group outline-none focus:ring-0"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.1)_0%,transparent_70%)] pointer-events-none"></div>
          <span className="text-8xl leading-none select-none drop-shadow-[0_0_20px_rgba(245,158,11,0.8)] group-hover:scale-110 transition-transform duration-500">
            🔥
          </span>
        </button>
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl">
          <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-[0.2em]">Legjobb</p>
          <p className="text-2xl font-bold text-slate-100">{userData.maxStreak} <span className="text-xs text-slate-500">nap</span></p>
        </div>
        <div onClick={() => setShowShop(true)} className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-emerald-900/30 shadow-2xl cursor-pointer active:scale-95 transition-transform group">
          <p className="text-slate-500 text-[9px] uppercase font-black mb-1 tracking-[0.2em]">Bolt</p>
          <p className="text-2xl font-bold flex items-center text-emerald-400">
            <i className="fa-solid fa-gem text-sm mr-2 group-hover:animate-bounce"></i> {userData.shards}
          </p>
        </div>
      </div>

      <button onClick={handleRelapse} className="text-slate-700 hover:text-red-500/80 text-[10px] font-black tracking-[0.4em] transition-all duration-300 uppercase flex items-center opacity-40 hover:opacity-100">
        BEISMERTEM <i className="fa-solid fa-fire-extinguisher ml-2"></i>
      </button>

      {showShop && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-2xl">
          <div className="bg-slate-900 border border-slate-800 rounded-[3.5rem] p-10 w-full max-w-sm space-y-8 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="text-center">
              <h3 className="cinzel text-3xl text-emerald-400 font-bold tracking-widest">Édenkert</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Bővítsd az ökoszisztémát</p>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'flowers', label: 'Vadvirágok', price: 50, icon: '🌸' },
                { id: 'mushrooms', label: 'Bűvös Gombák', price: 100, icon: '🍄' },
                { id: 'bushes', label: 'Cserjék', price: 200, icon: '🌿' },
                { id: 'ancientStones', label: 'Rúnakövek', price: 400, icon: '🪨' },
                { id: 'birds', label: 'Hajnali Madarak', price: 600, icon: '🐦' },
                { id: 'streams', label: 'Kristálypatak', price: 800, icon: '💧' },
                { id: 'squirrels', label: 'Mókusok', price: 1200, icon: '🐿️' },
                { id: 'sunRays', label: 'Égi Fény', price: 2000, icon: '✨' },
                { id: 'guardians', label: 'Erdő Őrzője', price: 5000, icon: '🦌' },
              ].map(item => (
                <button 
                  key={item.id}
                  onClick={() => buyEcoItem(item.id as any, item.price)}
                  className="w-full flex justify-between items-center p-5 bg-slate-950/40 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all active:scale-95 group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <p className="text-sm font-bold text-slate-200">{item.label}</p>
                  </div>
                  <div className="flex items-center text-emerald-400 font-black text-xs bg-emerald-500/5 px-4 py-2 rounded-full border border-emerald-500/10">
                    {item.price} <i className="fa-solid fa-gem ml-2 text-[8px]"></i>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setShowShop(false)} className="w-full py-5 text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] border-t border-slate-800/50 mt-4 hover:text-slate-400 transition-colors">
              Bezárás
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="p-6 space-y-10 animate-fade-in pb-24">
      <div className="text-center">
        <h2 className="cinzel text-3xl font-bold text-white tracking-widest">CRONICA</h2>
      </div>
      <div className="h-64 w-full bg-slate-900/40 rounded-[3rem] p-8 border border-slate-800 shadow-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={userData.history.length > 0 ? userData.history.slice(-14) : [{date: '', success: 0}]}>
            <defs>
              <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis hide domain={[0, 1.2]} />
            <Area type="monotone" dataKey="success" stroke="#f59e0b" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={5} dot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col items-center p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Összesen</span>
          <span className="text-4xl font-black text-amber-500">{userData.history.filter(h => h.success === 1).length} <span className="text-sm font-normal text-slate-500">nap</span></span>
        </div>
        <div className="flex flex-col items-center p-8 bg-slate-900/60 rounded-[2.5rem] border border-slate-800">
          <span className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Aura Erő</span>
          <span className="text-4xl font-black text-indigo-500">{userData.level}</span>
        </div>
      </div>
    </div>
  );

  const renderAura = () => (
    <div className="flex flex-col h-[85vh] px-4 py-6">
      <div className="flex-1 overflow-y-auto space-y-8 pb-4 px-2 scrollbar-hide">
        {auraMessages.length === 0 && (
          <div className="text-center py-24 space-y-6">
            <div className="w-24 h-24 bg-emerald-500/5 rounded-full flex items-center justify-center mx-auto border border-emerald-500/10 animate-pulse">
              <i className="fa-solid fa-star-of-life text-4xl text-emerald-400/30"></i>
            </div>
            <h3 className="cinzel text-2xl text-white tracking-[0.2em] font-bold uppercase">Suttogások</h3>
            <p className="text-slate-500 text-xs max-w-[260px] mx-auto italic leading-relaxed tracking-wide">"Az út magányos, de a szellemed nem az. Kérdezz, és válaszolok."</p>
          </div>
        )}
        {auraMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-7 py-5 rounded-[2.2rem] text-sm leading-relaxed shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'bg-amber-600 text-white rounded-br-none' 
                : 'bg-slate-900/90 text-slate-100 rounded-bl-none border border-slate-800 backdrop-blur-md'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isAuraLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/90 px-8 py-4 rounded-full border border-slate-800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex space-x-3 p-3 bg-slate-900/90 rounded-full border border-slate-800 backdrop-blur-2xl mb-24 shadow-2xl">
        <input 
          type="text" 
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessageToAura()}
          placeholder="Oszd meg a gondolataidat..."
          className="flex-1 bg-transparent px-6 py-2 text-sm focus:outline-none text-white placeholder-slate-700"
        />
        <button onClick={sendMessageToAura} disabled={isAuraLoading} className="w-14 h-14 bg-amber-600 rounded-full flex items-center justify-center text-white shadow-xl active:scale-90 transition-all hover:bg-amber-500">
          <i className="fa-solid fa-paper-plane-top text-lg"></i>
        </button>
      </div>
    </div>
  );

  if (!isAuthorized) {
    return renderGate();
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-[#05080a] flex flex-col relative overflow-hidden selection:bg-amber-500/30">
      <div className="absolute top-[-25%] left-[-25%] w-[100%] h-[100%] bg-emerald-950/10 rounded-full blur-[180px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-25%] right-[-25%] w-[100%] h-[100%] bg-amber-950/10 rounded-full blur-[180px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <header className="flex justify-between items-center p-8 z-50 border-b border-white/5 bg-slate-950/40 backdrop-blur-2xl sticky top-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 rounded-[1.2rem] flex items-center justify-center shadow-2xl rotate-6 group">
            <i className="fa-solid fa-fire text-white text-xl drop-shadow-lg group-hover:scale-110 transition-transform"></i>
          </div>
          <span className="cinzel font-black text-2xl tracking-[0.3em] text-slate-50">ASCEND</span>
        </div>
        <div className="flex items-center bg-slate-900/80 px-5 py-2.5 rounded-full border border-slate-800/50 space-x-3 shadow-inner">
          <i className="fa-solid fa-gem text-emerald-400 text-xs"></i>
          <span className="text-sm font-black text-slate-200 tracking-wider">{userData.shards}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'tree' && <TheGrove streak={userData.streak} ecosystem={userData.ecosystem} />}
        {activeTab === 'aura' && renderAura()}
        {activeTab === 'stats' && renderStats()}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
