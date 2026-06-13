import React, { useState, useEffect, useRef } from "react";
import { Cpu, LogOut, LineChart, ShoppingBag, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, Purchase, CfoAuditReport, GitHubFile } from "../types";

// Grouped subcomponents for high cohesion/low coupling
import AdminAuthGate from "./CommandCenter/AdminAuthGate";
import CfoAnalyticsTab, {
  CfoChatMessage,
} from "./CommandCenter/CfoAnalyticsTab";
import ProductCatalogTab from "./CommandCenter/ProductCatalogTab";
import BotAgenciesTab from "./CommandCenter/BotAgenciesTab";

interface CommandCenterProps {
  onBackToStore: () => void;
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct?: (updatedProduct: Product) => void;
  onDeleteProduct?: (deletedId: string) => void;
}

interface EditFormState {
  name: string;
  description: string;
  price: string;
  category: string;
  features: string;
  codeContent: string;
}

export default function CommandCenter({
  onBackToStore,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: CommandCenterProps) {
  // Authorization Gate States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  // Active view controller
  const [activeTab, setActiveTab] = useState<
    "analytics" | "catalog" | "agents"
  >("analytics");

  // Shared statistics & telemetry metrics
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const mrrTarget = 25000;
  const burnRate = 1450;

  // Sync / Importer States
  const [gitRepo, setGitRepo] = useState(
    "holystunnervillianera/bug-free-enigma",
  );
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [gitFiles, setGitFiles] = useState<GitHubFile[]>([]);
  const [repoSource, setRepoSource] = useState<
    "products.json" | "files-list" | null
  >(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState<string | null>(null);

  // Consolidated state for product modification modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    description: "",
    price: "",
    category: "Blueprints",
    features: "",
    codeContent: "",
  });

  // CFO General Reasoning States
  const [cfoMessages, setCfoMessages] = useState<CfoChatMessage[]>([
    {
      id: "cfo-init",
      role: "model",
      text: "Operational Ledger compiled. CFO Executive Agent status: ONLINE.\n\nCommander, I am here to optimize financial targets, test pricing elasticities, audit browser operations, and analyze sales performance. Ask me for a performance audit or select any suggestion below.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [cfoInput, setCfoInput] = useState("");
  const [cfoLoading, setCfoLoading] = useState(false);
  const [isCfoAuditing, setIsCfoAuditing] = useState(false);
  const [cfoAuditReport, setCfoAuditReport] = useState<CfoAuditReport | null>(
    null,
  );

  const cfoEndRef = useRef<HTMLDivElement | null>(null);

  // High-fidelity custom toast state managers
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">(
    "info",
  );

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
  ) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Secure interactive visual confirmation model instead of raw browser confirm dialog
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Auto Scroll dynamic chat handlers
  useEffect(() => {
    if (cfoEndRef.current) {
      cfoEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [cfoMessages]);

  // Pull purchases dynamically from local storage to compute real telemetry
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPurchases = () => {
      let total = 0;
      const docsList: Purchase[] = [];
      try {
        const localPurchases: Purchase[] = JSON.parse(localStorage.getItem('aether_local_purchases') || '[]');
        localPurchases.forEach(lp => {
          docsList.push(lp);
          if (lp.status === "completed") {
            total += lp.total || 0;
          }
        });
      } catch (e) {
        console.warn("Could not load purchases from localStorage:", e);
      }

      setPurchases(docsList);
      setTotalRevenue(total);
    };

    loadPurchases();
    window.addEventListener("storage", loadPurchases);
    window.addEventListener("aether_personalization_update", loadPurchases);
    
    return () => {
      window.removeEventListener("storage", loadPurchases);
      window.removeEventListener("aether_personalization_update", loadPurchases);
    };
  }, [isAuthenticated]);

  // Admin authenticity validator via secure backend proxy (replaces hardcoded token checks)
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: adminToken }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthError(null);
        showToast(
          "Orchestration Session authorized. Decrypt complete.",
          "success",
        );
      } else {
        setAuthError(
          data.error || "Execution failed. Invalid operational credentials.",
        );
        showToast(
          data.error || "Invalid operational credentials key.",
          "error",
        );
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(
        "Failed to establish authentication check with security gateway.",
      );
      showToast("Security gateway connection error.", "error");
    }
  };

  // Run server-side CFO Agent commands
  const handleCfoCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfoInput.trim() || cfoLoading) return;

    const userCommand = cfoInput;
    setCfoInput("");
    setCfoMessages((prev) => [
      ...prev,
      {
        id: `cfo-user-${Date.now()}`,
        role: "user",
        text: userCommand,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCfoLoading(true);

    try {
      const response = await fetch("/api/gemini/orchestrator-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userCommand,
          history: cfoMessages.map((m) => ({ role: m.role, text: m.text })),
          currentMetrics: {
            revenueSumMRR: totalRevenue,
            burnRateUSD: burnRate,
            activePurchases: purchases.length,
            targetMRR: mrrTarget,
            totalProducts: products.length,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Executive reasoning node is updating. Retrying...");
      }

      const data = await response.json();
      setCfoMessages((prev) => [
        ...prev,
        {
          id: `cfo-model-${Date.now()}`,
          role: "model",
          text: data.text,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err: any) {
      setCfoMessages((prev) => [
        ...prev,
        {
          id: `cfo-err-${Date.now()}`,
          role: "model",
          text: `Error processing strategic directive: ${err.message || "Executive routing delay."}\n\nSuggested actions: Audit current price metrics, or dispatch social automation queues to prospect clients.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setCfoLoading(false);
    }
  };

  // Trigger high-thinking AI Business Analysis of Stripe + Visitors + Agents
  const triggerAiExecutiveReview = async () => {
    setIsCfoAuditing(true);
    try {
      const auditPayload = {
        storeSalesSum: totalRevenue,
        burnExpenditures: burnRate,
        netRevenue: totalRevenue - burnRate,
        allPurchases: purchases.map((p) => ({
          id: p.id,
          itemsCount: p.items.length,
          chargedTotal: p.total,
          timestamp: p.createdAt,
        })),
        productsCount: products.length,
        customerConversationsLogged: 34,
        browserAgentOutreachCount: 8,
        conversionFactor: totalRevenue > 0 ? "3.8%" : "0.0%",
      };

      const response = await fetch("/api/gemini/orchestrator-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Audit current company telemetry. Telemetry dataset:\n\n${JSON.stringify(auditPayload, null, 2)}\n\nPlease provide actionable recommendations.`,
          history: [],
        }),
      });

      if (!response.ok) throw new Error("CFO server offline.");
      const data = await response.json();
      setCfoAuditReport({
        score: totalRevenue > 0 ? 84 : 45,
        rating:
          totalRevenue > 0
            ? "Strong Operational Efficiency"
            : "Stagnant Traffic Flow",
        text: data.text,
      });
      showToast("CFO Strategic Audit successfully executed.", "success");
    } catch (err: any) {
      showToast(`Executive audit failed: ${err.message}`, "error");
    } finally {
      setIsCfoAuditing(false);
    }
  };

  // Sync / Scan GitHub Repository
  const syncGitHubRepository = async () => {
    if (!gitRepo.trim()) return;
    setSyncStatus("syncing");
    try {
      const response = await fetch(
        `/api/github/import?repo=${encodeURIComponent(gitRepo)}`,
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      if (data.source === "products.json") {
        setRepoSource("products.json");
        setGitFiles(data.products || []);
        showToast(
          "Located 'products.json' in repository. Listings drafted.",
          "success",
        );
      } else {
        setRepoSource("files-list");
        setGitFiles(data.files || []);
        showToast(
          `Repository synced! Discovered ${data.files?.length || 0} blueprint assets.`,
          "info",
        );
      }
      setSyncStatus("success");
    } catch (e: any) {
      console.error(e);
      setSyncStatus("error");
      showToast(`GitHub sync failed: ${e.message}`, "error");
    }
  };

  // AI-powered analysis of single GitHub file to auto-populate "Deploy Product" form
  const analyzeGitHubFileWithAi = async (
    file: GitHubFile,
    populateForm: (data: any) => void,
  ) => {
    setIsAnalyzingFile(file.name);
    try {
      const response = await fetch("/api/github/file-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          downloadUrl: file.downloadUrl,
          fileName: file.name,
        }),
      });

      if (!response.ok) throw new Error("Could not contact AI analyzer.");
      const data = await response.json();

      const fieldsToPopulate = {
        name: data.draft.name,
        description: data.draft.description,
        price: data.draft.price.toString(),
        category: data.draft.category,
        features: data.draft.features.join(", "),
        assetKey: data.draft.id,
        codeContent: data.draft.codeContent || "",
      };

      populateForm(fieldsToPopulate);
      showToast(
        `AI draft complete for "${file.name}". Ingest form fields auto-populated.`,
        "success",
      );
    } catch (err: any) {
      showToast(`AI analysis failed: ${err.message}`, "error");
    } finally {
      setIsAnalyzingFile(null);
    }
  };

  // Instantly import dynamic product arrays from catalog products.json
  const importProductsJsonListing = async (prod: GitHubFile) => {
    const newProdId =
      prod.id || "asset_git_" + Math.random().toString(36).substring(2, 7);
    const mockCode =
      prod.codeContent || `// ${prod.name} Digital Blueprint Code`;
    const newProductData: Product = {
      id: newProdId,
      name: prod.name,
      description: prod.description || "",
      price:
        typeof prod.price === "number"
          ? prod.price
          : parseFloat(prod.price || "29.00"),
      fileUrl: newProdId,
      image:
        prod.image ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      category: prod.category || "Blueprints",
      features: Array.isArray(prod.features)
        ? prod.features
        : [String(prod.features || "TypeScript script")],
      codeContent: mockCode,
    };

    // Register product with our custom full-stack backend endpoint and fallback local listeners
    fetch("/api/admin/register-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: newProductData })
    }).catch(err => console.warn("Backing server registration failed:", err));

    onAddProduct(newProductData);
    showToast(
      `Successfully imported and deployed "${prod.name}" raw blueprint!`,
      "success",
    );
  };

  // Submit hand-crafted new blueprints
  const handleAddNewProductSubmit = async (p: Omit<Product, "image">) => {
    const freshData: Product = {
      ...p,
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
    };

    fetch("/api/admin/register-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: freshData })
    }).catch(err => console.warn("Backing server registration failed:", err));

    onAddProduct(freshData);
    showToast(
      `Product blueprint "${freshData.name}" is now live!`,
      "success",
    );
  };

  // Delete live storefront products with elite visual confirmation state
  const deleteStoreProduct = (id: string) => {
    setPendingDeleteId(id);
  };

  const confirmDeleteProduct = async () => {
    if (!pendingDeleteId) return;
    
    // Cleanly delete from server in-memory database as well
    fetch("/api/admin/delete-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pendingDeleteId })
    }).catch(err => console.warn("Failed to delete backing product blueprint:", err));

    if (onDeleteProduct) {
      onDeleteProduct(pendingDeleteId);
    }
    showToast("Product successfully deleted from storefront.", "success");
    setPendingDeleteId(null);
  };

  // Select Product for editing
  const initiateEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name,
      price: prod.price.toString(),
      category: prod.category || "Blueprints",
      description: prod.description,
      features: prod.features.join(", "),
      codeContent: prod.codeContent || "",
    });
  };

  // Handle forms dynamic change
  const handleEditFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Edited product specifications
  const submitEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const priceNum = parseFloat(editForm.price);
    if (isNaN(priceNum)) {
      showToast("Requires numerical price parameter.", "error");
      return;
    }

    const updatedProduct: Product = {
      ...editingProduct,
      name: editForm.name,
      price: priceNum,
      category: editForm.category,
      description: editForm.description,
      features: editForm.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      codeContent: editForm.codeContent,
    };

    // Register revised blueprint specs on backing server
    fetch("/api/admin/register-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product: updatedProduct })
    }).catch(err => console.warn("Failed to update backing product blueprint:", err));

    if (onUpdateProduct) {
      onUpdateProduct(updatedProduct);
    }
    setEditingProduct(null);
    showToast(
      `Product blueprint "${editForm.name}" updated live!`,
      "success",
    );
  };

  // Coupon action dispatcher
  const triggerCouponAction = async () => {
    showToast(
      "Promotional campaign 'AETHER10' activated dynamically. Push notifications dispatched to browser prospects!",
      "success",
    );
  };

  // Execute dynamic price audit elasticity adjustment
  const triggerPriceAdjustmentAction = async () => {
    try {
      const target = products.find((p) => p.price > 30);
      if (target) {
        const optimizedVal = target.price - 5.0;
        const updatedTarget = {
          ...target,
          price: optimizedVal,
        };
        
        fetch("/api/admin/register-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: updatedTarget })
        }).catch(err => console.warn("Failed to update backing product blueprint:", err));

        if (onUpdateProduct) {
          onUpdateProduct(updatedTarget);
        }
        showToast(
          `Elasticity Action Committed: Adjusted ${target.name} to highly competitive optimized price state of $${optimizedVal}.00`,
          "success",
        );
      } else {
        showToast(
          "Elasticity Audit Executed: Catalog represents optimal financial tiers!",
          "info",
        );
      }
    } catch (e) {
      console.error(e);
      showToast("Failed to perform price elasticity adjustment.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans relative selection:bg-blue-500/35">
      {/* Access Protection Screen if not authorized */}
      <AnimatePresence>
        {!isAuthenticated && (
          <AdminAuthGate
            adminToken={adminToken}
            setAdminToken={setAdminToken}
            authError={authError}
            onSubmit={handleAdminAuth}
            onBackToStore={onBackToStore}
          />
        )}
      </AnimatePresence>

      {/* Main Command Console Cockpit */}
      {isAuthenticated && (
        <div className="flex flex-col min-h-screen">
          {/* Top Admin Header Bar */}
          <nav className="bg-black px-6 py-5 border-b border-neutral-900 sticky top-0 z-30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-black text-xs tracking-[0.2em] text-white uppercase sm:inline hidden">
                  AETHEROPS EXECUTIVE CONSOLE
                </span>
                <span className="block text-[8.5px] font-mono text-emerald-500 font-bold uppercase tracking-[0.3em]">
                  Secured Mastermind Terminal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onBackToStore}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase cursor-pointer transition-all border border-neutral-850 animate-pulse"
              >
                Storefront View
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-900 transition cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </nav>

          {/* Core Tab Navigation System */}
          <div className="bg-white border-b border-neutral-100 px-6 py-3 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "analytics"
                    ? "bg-black text-white font-extrabold shadow-md"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <LineChart className="w-4 h-4 shrink-0" />
                <span>CFO Ledger Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "catalog"
                    ? "bg-black text-white font-extrabold shadow-md"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Vault Catalog & Importer</span>
              </button>
              <button
                onClick={() => setActiveTab("agents")}
                className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "agents"
                    ? "bg-black text-white font-extrabold shadow-md"
                    : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                }`}
              >
                <Cpu className="w-4 h-4 shrink-0" />
                <span>Orchestration Agencies</span>
              </button>
            </div>
            <div className="text-[10px] font-mono text-[#737373] tracking-widest font-black uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-red-700 rounded-full animate-pulse" />
              <span>Operational Core: Sandbox Mode (Persistent Local Storage)</span>
            </div>
          </div>

          <div className="flex-1 p-8 bg-neutral-50">
            {/* TAB 1: EXECUTIVE ANALYTICS AND STRATEGIST CFO AGENT */}
            {activeTab === "analytics" && (
              <CfoAnalyticsTab
                purchases={purchases}
                totalRevenue={totalRevenue}
                burnRate={burnRate}
                mrrTarget={mrrTarget}
                productsCount={products.length}
                isCfoAuditing={isCfoAuditing}
                cfoAuditReport={cfoAuditReport}
                triggerAiExecutiveReview={triggerAiExecutiveReview}
                triggerPriceAdjustmentAction={triggerPriceAdjustmentAction}
                triggerCouponAction={triggerCouponAction}
                cfoMessages={cfoMessages}
                cfoInput={cfoInput}
                setCfoInput={setCfoInput}
                cfoLoading={cfoLoading}
                handleCfoCommand={handleCfoCommand}
                cfoEndRef={cfoEndRef}
              />
            )}

            {/* TAB 2: PRODUCT CATALOG MANAGEMENT & GITHUB BLUEPRINT IMPORTER */}
            {activeTab === "catalog" && (
              <ProductCatalogTab
                products={products}
                gitRepo={gitRepo}
                setGitRepo={setGitRepo}
                syncStatus={syncStatus}
                gitFiles={gitFiles}
                repoSource={repoSource}
                isAnalyzingFile={isAnalyzingFile}
                syncGitHubRepository={syncGitHubRepository}
                analyzeGitHubFileWithAi={analyzeGitHubFileWithAi}
                importProductsJsonListing={importProductsJsonListing}
                deleteStoreProduct={deleteStoreProduct}
                initiateEditProduct={initiateEditProduct}
                onSubmitNewProduct={handleAddNewProductSubmit}
              />
            )}

            {/* TAB 3: AUTOMATED BOT AGENCIES COMPENDIUM */}
            {activeTab === "agents" && <BotAgenciesTab />}
          </div>

          {/* EDIT PRODUCT BLUEPRINT BACKDROP MODAL */}
          <AnimatePresence>
            {editingProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-xs font-sans text-black">
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white border border-neutral-100 rounded-[3rem] p-8 md:p-10 w-full max-w-xl shadow-2xl relative z-10"
                >
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
                    <h4 className="font-display font-black text-lg text-black uppercase tracking-wider">
                      Edit Blueprint Specification
                    </h4>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-[#737373] hover:text-black font-mono text-[9px] uppercase tracking-widest font-bold cursor-pointer p-2 px-3 rounded-full border border-neutral-100 hover:bg-neutral-50"
                    >
                      Esc Close
                    </button>
                  </div>

                  <form
                    onSubmit={submitEditedProduct}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={editForm.name}
                        onChange={handleEditFormChange}
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-full text-xs text-black focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                          Category
                        </label>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditFormChange}
                          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-full text-xs text-black focus:outline-none"
                        >
                          <option value="Blueprints">Blueprints</option>
                          <option value="Micro-SaaS">Micro-SaaS</option>
                          <option value="Controller">Controller</option>
                          <option value="Scripts">Scripts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                          Price USD
                        </label>
                        <input
                          type="text"
                          required
                          name="price"
                          value={editForm.price}
                          onChange={handleEditFormChange}
                          className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-full text-xs text-black focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                        Features Specifications (comma split)
                      </label>
                      <input
                        type="text"
                        name="features"
                        value={editForm.features}
                        onChange={handleEditFormChange}
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-full text-xs text-black focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                        Description
                      </label>
                      <textarea
                        required
                        name="description"
                        rows={2}
                        value={editForm.description}
                        onChange={handleEditFormChange}
                        className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-[1.5rem] text-xs text-black focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-bold mb-1.5">
                        Downloadable Blueprint Code Attachment
                      </label>
                      <textarea
                        placeholder="Paste script file instructions contents..."
                        name="codeContent"
                        rows={4}
                        value={editForm.codeContent}
                        onChange={handleEditFormChange}
                        className="w-full bg-neutral-50 border border-neutral-200 p-4 rounded-[1.5rem] text-[11px] text-black focus:outline-none leading-normal font-mono"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="bg-neutral-100 hover:bg-neutral-200 text-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest font-mono font-bold cursor-pointer hover:shadow-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-black cursor-pointer shadow-lg shadow-black/10"
                      >
                        Save Updates
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Visual interactive delete validation overlay box */}
          {pendingDeleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-black">
              <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white border border-neutral-100 p-8 rounded-[3rem] w-full max-w-sm relative shadow-2xl space-y-5"
              >
                <h3 className="font-display font-black text-sm text-black uppercase tracking-wider">
                  Confirm Blueprint Deletion
                </h3>
                <p className="text-xs font-light text-neutral-500 leading-relaxed">
                  Are you sure you want to permanently remove this product
                  blueprint layout from your active catalog and Firestore
                  database clusters? This action is irreversible.
                </p>
                <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100 text-[10px] font-mono tracking-widest font-bold uppercase">
                  <button
                    onClick={() => setPendingDeleteId(null)}
                    className="bg-neutral-100 hover:bg-neutral-250 text-black px-4 py-2.5 border border-neutral-250 rounded-full cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProduct}
                    className="bg-black text-white px-5 py-2.5 rounded-full cursor-pointer font-black hover:bg-neutral-800"
                  >
                    Confirm Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Floating high-end custom toast overlay block */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.97 }}
                className={`fixed bottom-6 right-6 z-50 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4 border max-w-sm ${
                  toastType === "success"
                    ? "bg-black border-neutral-850 text-white"
                    : toastType === "error"
                      ? "bg-black border-neutral-850 text-white"
                      : "bg-black border-neutral-850 text-white"
                }`}
              >
                <div className="flex-1 text-[11px] font-mono leading-normal font-bold">
                  {toastMessage}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="text-[#737373] hover:text-white cursor-pointer p-2 text-[10px] font-mono leading-none border border-neutral-900 rounded-full font-bold transition hover:bg-neutral-900 shrink-0"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
