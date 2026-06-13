import React, { useState, useRef, useEffect } from "react";
import {
  Image as ImageIcon,
  RefreshCw,
  Download,
  Globe,
  Terminal,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MarketingAsset } from "../../types";

interface BotAgenciesTabProps {
  onAddMarketingLog?: (log: string) => void;
}

export default function BotAgenciesTab({
  onAddMarketingLog,
}: BotAgenciesTabProps) {
  // Image Generation States
  const [imagePrompt, setImagePrompt] = useState(
    "High end minimal modern cyber workstation workspace",
  );
  const [imageRatio, setImageRatio] = useState("16:9");
  const [generatedAssets, setGeneratedAssets] = useState<MarketingAsset[]>([]);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [compilationError, setCompilationError] = useState<string | null>(null);

  // Puppeteer Automator States
  const [puppeteerQuery, setPuppeteerQuery] = useState(
    "Scrape california enterprise tech positions needing AI developers",
  );
  const [puppeteerLogs, setPuppeteerLogs] = useState<string[]>([
    "[Social Automator] Pipeline scheduler active. Awaiting manual trigger instructions...",
  ]);
  const [puppeteerBusy, setPuppeteerBusy] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [puppeteerLogs]);

  // Real Marketing Image Asset generation using backend endpoint
  const generateMarketingImage = async () => {
    if (!imagePrompt.trim() || generatingImage) return;

    setGeneratingImage(true);
    setCompilationError(null);
    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: imageRatio,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact image render stream.");
      }

      const data = await response.json();

      const newAsset: MarketingAsset = {
        id: `asset-${Date.now()}`,
        prompt: data.prompt,
        imageUrl: data.imageUrl,
        aspectRatio: data.aspectRatio,
        createdTime: data.time,
      };

      setGeneratedAssets((prev) => [newAsset, ...prev]);
    } catch (err: any) {
      setCompilationError(`Asset compilation failed: ${err.message}`);
    } finally {
      setGeneratingImage(false);
    }
  };

  // Run Headless social search / scraping pipelines
  const handlePuppeteerRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puppeteerQuery.trim() || puppeteerBusy) return;

    setPuppeteerBusy(true);
    setPuppeteerLogs((prev) => [
      ...prev,
      `[Social Ops] Instantiating browser-use thread for instruction: "${puppeteerQuery}"`,
      `[Social Ops] Launching headless browser with viewport width=1280...`,
    ]);

    setTimeout(() => {
      setPuppeteerLogs((prev) => [
        ...prev,
        `[Social Ops] Evaluating DOM tree at target social profiles...`,
        `[Social Ops] Discovered 8 active recruiting and enterprise contract nodes!`,
      ]);
    }, 1000);

    setTimeout(() => {
      setPuppeteerLogs((prev) => [
        ...prev,
        `[Social Ops] [PROSPECT MATCH] Scraped lead: 'Alexander Vance, Director of Operations @ NextGen Tech'`,
        `[Social Ops] Custom message queued utilizing product catalogs...`,
        `[Social Ops] Dispatching conversion webhooks. Prospect converted successfully!`,
      ]);
      setPuppeteerBusy(false);
    }, 2500);
  };

  const getAspectStyle = (ratio: string) => {
    switch (ratio) {
      case "16:9":
        return "aspect-video";
      case "9:16":
        return "w-32 aspect-[9/16]";
      case "3:4":
        return "w-40 aspect-[3/4]";
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 text-black font-sans">
      {/* Visual Image Marketing Asset engine */}
      <div className="bg-white rounded-[3rem] border border-neutral-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-250 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-xs text-black uppercase tracking-widest">
              AI Marketing Asset Engine
            </h3>
            <p className="text-[8.5px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
              Model: Gemini-2.5 Flash Image
            </p>
          </div>
        </div>

        <div className="space-y-5 font-mono text-xs">
          <div className="space-y-1.5">
            <label className="block text-[8.5px] text-[#737373] uppercase tracking-widest font-black">
              Select Aspect Ratio Layout
            </label>
            <select
              value={imageRatio}
              onChange={(e) => setImageRatio(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-full text-xs text-black focus:outline-none focus:border-black transition"
            >
              <option value="1:1">1:1 (Square Standard)</option>
              <option value="3:4">3:4 (Portrait Feed)</option>
              <option value="4:3">4:3 (Landscape Grid)</option>
              <option value="9:16">9:16 (Tik-Tok, Shorts, Reel)</option>
              <option value="16:9">16:9 (X, LinkedIn Post)</option>
              <option value="2:3">2:3 (Pinterest Ratio)</option>
              <option value="3:2">3:2 (Camera Frame)</option>
              <option value="21:9">21:9 (Widescreen Banner)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[8.5px] text-[#737373] uppercase tracking-widest font-black">
              Creative Vector Prompts
            </label>
            <textarea
              placeholder="e.g. Sleek abstract cyber grid workstation vector banner, isometric layout..."
              rows={3}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-[1.5rem] text-xs text-black focus:outline-none focus:border-black leading-relaxed transition"
            />
          </div>

          {compilationError && (
            <div className="bg-rose-50 border border-rose-100 p-3 rounded-[1.5rem] text-rose-600 text-xs font-mono leading-normal font-bold">
              ⚠ {compilationError}
            </div>
          )}

          <button
            onClick={generateMarketingImage}
            disabled={generatingImage}
            className="w-full bg-black hover:bg-neutral-800 text-white disabled:opacity-45 font-black text-xs py-3.5 rounded-full transition flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-widest shadow-lg shadow-black/5"
          >
            {generatingImage ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating AI design layer...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Ingest Visual Design</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Render Display */}
        <AnimatePresence>
          {generatedAssets.length > 0 && (
            <div className="border-t border-neutral-150 pt-5 space-y-3">
              <span className="text-[9px] font-mono text-[#737373] font-black block uppercase tracking-widest">
                Generated Promoshot
              </span>
              <div
                className={`overflow-hidden rounded-[2rem] border border-neutral-100 bg-neutral-50 flex items-center justify-center shadow-lg ${getAspectStyle(generatedAssets[0].aspectRatio)}`}
              >
                <img
                  src={generatedAssets[0].imageUrl}
                  alt="AI Output"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <a
                href={generatedAssets[0].imageUrl}
                download={`aether_promo_${Date.now()}.png`}
                className="text-[9px] text-black hover:text-neutral-700 font-mono flex items-center gap-1 cursor-pointer uppercase tracking-widest font-black"
              >
                <Download className="w-3 h-3" />
                <span>Download Asset Frame</span>
              </a>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulated Social Browser Puppeteer scrapper agency */}
      <div className="bg-white rounded-[3rem] border border-neutral-100 flex flex-col h-[540px] overflow-hidden shadow-sm">
        <div className="p-6 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200/50 flex items-center justify-center">
              <Globe
                className="w-5 h-5 text-black animate-spin"
                style={{ animationDuration: "6s" }}
              />
            </div>
            <div>
              <h3 className="font-display font-black text-xs text-black uppercase tracking-widest">
                Browser Automator (Sales Ops)
              </h3>
              <p className="text-[8.5px] font-mono text-[#737373] font-black uppercase tracking-wider">
                Headless Puppeteer Session
              </p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>

        {/* Simulated console output */}
        <div className="flex-1 p-6 overflow-y-auto fancy-scrollbar bg-black text-neutral-300 font-mono text-[10px] space-y-2 border-b border-neutral-150">
          {puppeteerLogs.map((log, idx) => (
            <div key={idx} className="flex gap-1.5 leading-relaxed">
              <span className="text-[#737373] select-none font-bold">[{idx + 1}]</span>
              <span className="whitespace-pre-wrap">{log}</span>
            </div>
          ))}
          {puppeteerBusy && (
            <div className="flex items-center gap-1.5 text-teal-400 animate-pulse mt-3 font-mono font-bold">
              <Terminal className="w-4 h-4" />
              <span>
                [Puppeteer] Processing headless DOM page structures...
              </span>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>

        {/* Form client trigger */}
        <form
          onSubmit={handlePuppeteerRun}
          className="p-6 bg-white space-y-3"
        >
          <label className="block text-[8.5px] font-mono text-[#737373] tracking-widest uppercase font-black">
            Dispatch Automator Scraper Script
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Scrape target recruitment pipelines..."
              value={puppeteerQuery}
              onChange={(e) => setPuppeteerQuery(e.target.value)}
              disabled={puppeteerBusy}
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-2.5 text-[10px] text-black focus:outline-none focus:border-black font-mono transition"
            />
            <button
              type="submit"
              disabled={!puppeteerQuery.trim() || puppeteerBusy}
              className="bg-black hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-[10px] font-black uppercase transition flex items-center gap-1.5 cursor-pointer disabled:opacity-45 font-mono shadow-lg shadow-black/10"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
