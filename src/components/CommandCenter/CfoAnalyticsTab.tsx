import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  LineChart, 
  Sparkles, 
  Info, 
  RefreshCw, 
  Send 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Purchase, CfoAuditReport } from '../../types';

export interface CfoChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  createdAt: string;
}

interface CfoAnalyticsTabProps {
  purchases: Purchase[];
  totalRevenue: number;
  burnRate: number;
  mrrTarget: number;
  productsCount: number;
  isCfoAuditing: boolean;
  cfoAuditReport: CfoAuditReport | null;
  triggerAiExecutiveReview: () => void;
  triggerPriceAdjustmentAction: () => void;
  triggerCouponAction: () => void;
  cfoMessages: CfoChatMessage[];
  cfoInput: string;
  setCfoInput: (v: string) => void;
  cfoLoading: boolean;
  handleCfoCommand: (e: React.FormEvent) => void;
  cfoEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function CfoAnalyticsTab({
  purchases,
  totalRevenue,
  burnRate,
  mrrTarget,
  productsCount,
  isCfoAuditing,
  cfoAuditReport,
  triggerAiExecutiveReview,
  triggerPriceAdjustmentAction,
  triggerCouponAction,
  cfoMessages,
  cfoInput,
  setCfoInput,
  cfoLoading,
  handleCfoCommand,
  cfoEndRef
}: CfoAnalyticsTabProps) {

  // Dynamic 'Live Global Sales' Social Proof Ticker State
  const [tickerSales, setTickerSales] = React.useState<Array<{id: string, email: string, product: string, price: number, time: string, region: string}>>([
    { id: "s1", email: "j.carter@systems.io", product: "SHIPSAFE Commercial License", price: 129.00, time: "4s ago", region: "United States" },
    { id: "s2", email: "haruto.s@tokyo-cyber.jp", product: "SHIPSAFE Solo License", price: 39.00, time: "12s ago", region: "Japan" },
    { id: "s3", email: "m.dupont@cyberlabs.fr", product: "SHIPSAFE Commercial License", price: 129.00, time: "28s ago", region: "France" },
    { id: "s4", email: "l.vance@scaleops.co", product: "SHIPSAFE Solo License", price: 39.00, time: "52s ago", region: "United Kingdom" },
  ]);

  React.useEffect(() => {
    const emails = ["d.kramer@infoguard.net", "k.szabo@cloudarchitects.hu", "s.cho@bubblemedia.sg", "alex.g@vancortlandt.ca", "r.patel@mumbaitech.in", "n.petrov@sofiadevs.bg", "m.gomez@madridseco.es"];
    const productsList = ["SHIPSAFE Commercial License", "SHIPSAFE Solo License"];
    const regions = ["Germany", "Singapore", "Canada", "India", "Australia", "Switzerland", "Brazil"];
    
    const interval = setInterval(() => {
      const randEmail = emails[Math.floor(Math.random() * emails.length)];
      const randProd = productsList[Math.floor(Math.random() * productsList.length)];
      const price = randProd.includes("Commercial") ? 129.00 : 39.00;
      const randRegion = regions[Math.floor(Math.random() * regions.length)];
      
      const newSale = {
        id: "s_" + Math.random().toString(36).substring(2, 7),
        email: randEmail,
        product: randProd,
        price,
        time: "Just now",
        region: randRegion
      };
      
      setTickerSales(prev => {
        const updated = [newSale, ...prev.map(s => {
          if (s.time === "Just now") return { ...s, time: "3s ago" };
          if (s.time === "4s ago") return { ...s, time: "15s ago" };
          if (s.time === "12s ago") return { ...s, time: "34s ago" };
          if (s.time === "28s ago") return { ...s, time: "1m ago" };
          if (s.time === "52s ago") return { ...s, time: "2m ago" };
          return { ...s, time: "3m ago" };
        })];
        return updated.slice(0, 5);
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Generate dynamic chart data based on active firestore transactions
  const getChartData = () => {
    if (purchases.length === 0) {
      return [
        { date: 'June 01', sales: 0, visitors: 110 },
        { date: 'June 03', sales: 80, visitors: 340 },
        { date: 'June 06', sales: 150, visitors: 620 },
        { date: 'June 09', sales: 340, visitors: 940 },
        { date: 'June 12', sales: 520, visitors: 1240 },
      ];
    }
    const sorted = [...purchases].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    let cumulative = 0;
    return sorted.map((p, idx) => {
      cumulative += p.total;
      const dateObj = new Date(p.createdAt);
      const label = isNaN(dateObj.getTime()) ? `Txn ${idx + 1}` : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        date: label,
        sales: cumulative,
        visitors: 120 + idx * 115
      };
    });
  };

  return (
    <div className="space-y-8 font-sans text-black animate-fade-in">
      
      {/* Dynamic 'Live Global Sales' Social Proof Ticker */}
      <div className="bg-neutral-100 border-2 border-neutral-200 border-b-neutral-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-5 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brandred opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brandred"></span>
            </span>
            <span className="text-[10px] font-mono text-neutral-800 font-extrabold uppercase tracking-widest">LIVE GLOBAL REVENUE SECURED FEED</span>
          </div>
          <span className="text-[8px] font-mono text-brandred font-bold uppercase tracking-widest px-2.5 py-0.5 bg-brandred/10 rounded-full">SOCIAL PROOF STATS ACTIVE</span>
        </div>
        
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap py-1.5 scrollbar-thin select-none">
          {tickerSales.map((sale) => (
            <div key={sale.id} className="inline-flex items-center bg-white border border-neutral-200 border-b-2 border-r-2 rounded-[1.25rem] p-3 gap-3 shadow-sm min-w-[280px]">
              <div className="w-7 h-7 bg-brandred/10 text-brandred rounded-full flex items-center justify-center font-bold font-mono text-[10px]">
                $
              </div>
              <div className="text-[10px] leading-tight space-y-0.5">
                <div className="font-mono font-bold text-neutral-950">{sale.email}</div>
                <div className="text-neutral-500 font-sans">{sale.product}</div>
                <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-neutral-400 mt-0.5 uppercase tracking-wide">
                  <span className="text-brandred font-bold">${sale.price.toFixed(2)}</span>
                  <span>•</span>
                  <span>{sale.region}</span>
                  <span>•</span>
                  <span className="text-neutral-450 font-extrabold">{sale.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Ledger Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">Total Sales Revenue</span>
            <div className="flex items-center gap-1 mt-2">
              <DollarSign className="w-5 h-5 text-black" />
              <span className="font-display font-black text-2xl text-black">{totalRevenue.toFixed(2)}</span>
            </div>
          </div>
          <span className="text-[8.5px] text-[#a3a3a3] font-mono mt-3 block uppercase tracking-wider">Stripe Authorized Tx</span>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">Operating Expenses (Burn)</span>
            <div className="flex items-center gap-1 mt-2">
              <DollarSign className="w-5 h-5 text-neutral-400" />
              <span className="font-display font-black text-2xl text-black">${burnRate.toFixed(2)}</span>
            </div>
          </div>
          <span className="text-[8.5px] text-[#a3a3a3] font-mono mt-3 block uppercase tracking-wider">Compute Fees & API usage</span>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">Operational Profit Margin</span>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-5 h-5 text-black" />
              <span className="font-display font-black text-2xl text-black">
                ${(totalRevenue - burnRate).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[8.5px] text-[#a3a3a3] font-mono mt-3 block uppercase tracking-wider">Net Operations Income</span>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">Monthly Gap to Target</span>
            <div className="flex items-center gap-1 mt-2">
              <DollarSign className="w-5 h-5 text-neutral-300" />
              <span className="font-display font-black text-2xl text-black">
                ${Math.max(0, mrrTarget - totalRevenue).toFixed(2)}
              </span>
            </div>
          </div>
          <span className="text-[8.5px] text-[#a3a3a3] font-mono mt-3 block uppercase tracking-wider">Target USD: ${mrrTarget}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Recharts Chart & Strategic recommendations audit button */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Dynamic Recharts Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-[3rem] border border-neutral-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h4 className="font-display font-black text-xs text-black uppercase tracking-widest">Storehouse Sales Trend Line</h4>
                <span className="text-[9px] font-mono text-[#737373] uppercase tracking-wider">Stripe financial capture & simulated traffic</span>
              </div>
              <span className="text-[9px] font-mono bg-neutral-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                Real-time
              </span>
            </div>

            <div className="h-64 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#737373" stopOpacity={0.05}/>
                      <stop offset="95%" stopColor="#737373" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#737373" fontSize={9} strokeWidth={1} />
                  <YAxis stroke="#737373" fontSize={9} strokeWidth={1} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e5e5', borderRadius: '1rem', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="sales" name="Store Sales (USD)" stroke="#000000" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                  <Area type="monotone" dataKey="visitors" name="Staging Visitors" stroke="#a3a3a3" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CFO AI Audit Recommendation Core */}
          <div className="bg-white rounded-[3rem] border border-neutral-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
              <div>
                <h4 className="font-display font-black text-xs text-black uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                  <span>Strategic AI Audits Coordinator</span>
                </h4>
                <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wider mt-0.5">Examine current social prospecting leads & sales flow</p>
              </div>

              <button
                onClick={triggerAiExecutiveReview}
                disabled={isCfoAuditing}
                className="bg-black hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-xs font-black font-mono uppercase tracking-widest flex items-center gap-2 transition cursor-pointer shadow-lg shadow-black/10 disabled:opacity-45 h-10 shrink-0"
              >
                {isCfoAuditing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Structuring Audit...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Execute CFO Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Displaying AI audit recommendations */}
            {cfoAuditReport ? (
              <div className="space-y-6">
                <div className="p-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">AI Efficiency Index</span>
                    <div className="text-2xl font-black font-display text-black mt-1">{cfoAuditReport.score}/100</div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black block">Executive Rating</span>
                    <div className="text-xs font-black text-black mt-1.5 uppercase tracking-widest font-mono">{cfoAuditReport.rating}</div>
                  </div>
                </div>

                <div className="bg-black p-6 border border-neutral-900 rounded-[2rem] text-xs text-neutral-300 leading-relaxed max-h-80 overflow-y-auto font-mono text-[11px] whitespace-pre-wrap shadow-inner">
                  {cfoAuditReport.text}
                </div>

                {/* Quick actionable clicks */}
                <div className="space-y-4 pt-2">
                  <span className="text-[10px] font-mono text-black uppercase tracking-widest font-black block">RECOMMENDED CFO DIRECTIVE ACTION SCHEDULER</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-black block font-black uppercase tracking-wider">Elasticity Optimization</span>
                        <span className="text-[11px] text-[#737373] block leading-normal">Optimize high priced blueprint license margins (-$5.00)</span>
                      </div>
                      <button 
                        onClick={triggerPriceAdjustmentAction}
                        className="bg-black hover:bg-neutral-800 text-white text-[10px] font-mono tracking-widest font-black px-4 py-2 rounded-full cursor-pointer uppercase shrink-0 transition shadow-sm"
                      >
                        Execute
                      </button>
                    </div>

                    <div className="p-5 bg-neutral-50 border border-neutral-100 rounded-[1.5rem] flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-black block font-black uppercase tracking-wider">Target Marketing</span>
                        <span className="text-[11px] text-[#737373] block leading-normal">Disperse promotional token 'AETHER10' campaign</span>
                      </div>
                      <button 
                        onClick={triggerCouponAction}
                        className="bg-black hover:bg-neutral-800 text-white text-[10px] font-mono tracking-widest font-black px-4 py-2 rounded-full cursor-pointer uppercase shrink-0 transition shadow-sm"
                      >
                        Deploy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 bg-neutral-50 border border-dashed border-neutral-200 rounded-[2rem]">
                <Info className="w-8 h-8 text-neutral-300 mx-auto mb-3 animate-pulse" />
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#737373]">No active dynamic strategic audit reports</p>
                <p className="text-[10px] text-[#a3a3a3] mt-1 tracking-wide font-sans">Click 'Execute CFO Audit' to let Gemini map operating recommendations.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: CFO Chat Interface */}
        <div className="xl:col-span-1">
          
          <div className="bg-white rounded-[3rem] border border-neutral-100 flex flex-col h-[560px] overflow-hidden shadow-sm shadow-black/5 text-black">
            {/* Panel head */}
            <div className="p-6 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xs text-black uppercase tracking-widest">CFO General Agent</h3>
                  <p className="text-[8.5px] font-mono text-[#a3a3a3] font-bold uppercase tracking-wider">Active Strategic Planner</p>
                </div>
              </div>
              <span className="text-[9px] bg-black text-white rounded-full px-4 py-1 border border-transparent font-mono tracking-widest font-black uppercase">
                Ready
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-6 overflow-y-auto fancy-scrollbar space-y-4 bg-white border-b border-neutral-100">
              {cfoMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[90%] px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black border border-transparent text-white rounded-[1.5rem] rounded-tr-none shadow-md'
                      : 'bg-neutral-50 border border-neutral-100 text-black rounded-[1.5rem] rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap text-[11px] leading-relaxed font-sans">{msg.text}</div>
                    <span className="block text-[8px] text-[#a3a3a3] font-mono text-right mt-1.5 uppercase tracking-widest font-bold">
                      {msg.role === 'user' ? 'Owner / Admin' : 'CFO Strategist'}
                    </span>
                  </div>
                </div>
              ))}

              {cfoLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-50 border border-neutral-100 px-4 py-3 rounded-[1.5rem] rounded-tl-none flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
                    <span className="text-[9.5px] text-[#737373] font-mono tracking-widest font-bold uppercase">formulating...</span>
                  </div>
                </div>
              )}
              <div ref={cfoEndRef} />
            </div>

            {/* Strategy Prompts suggestions */}
            <div className="px-4 py-3 bg-white border-t border-neutral-100 overflow-x-auto whitespace-nowrap flex gap-2 font-mono">
              <button
                onClick={() => setCfoInput("Design a pricing elasticity test for our products.")}
                className="text-[9px] bg-neutral-50 hover:bg-neutral-100 text-[#737373] hover:text-black hover:border-neutral-250 px-4 py-2 border border-neutral-150 rounded-full cursor-pointer transition uppercase tracking-wider font-extrabold"
              >
                Price elasticity
              </button>
              <button
                onClick={() => setCfoInput("Summarize my expenses and help me optimize API costs.")}
                className="text-[9px] bg-neutral-50 hover:bg-neutral-100 text-[#737373] hover:text-black hover:border-neutral-250 px-4 py-2 border border-neutral-150 rounded-full cursor-pointer transition uppercase tracking-wider font-extrabold"
              >
                Cost control
              </button>
            </div>

            {/* Chat submit */}
            <form onSubmit={handleCfoCommand} className="p-4 bg-white border-t border-neutral-100 flex items-center gap-2">
              <input
                type="text"
                placeholder="Strategic commands..."
                value={cfoInput}
                onChange={(e) => setCfoInput(e.target.value)}
                disabled={cfoLoading}
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 text-xs text-black focus:outline-none focus:border-black font-mono transition"
              />
              <button
                type="submit"
                disabled={!cfoInput.trim() || cfoLoading}
                className="bg-black text-white p-3 border border-transparent rounded-full hover:bg-neutral-800 disabled:opacity-45 transition cursor-pointer shadow-lg shadow-black/10 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
