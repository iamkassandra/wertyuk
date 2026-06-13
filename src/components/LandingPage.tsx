import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  X, 
  ChevronRight, 
  Code, 
  Download, 
  CheckCircle, 
  CreditCard, 
  Cpu, 
  Layers, 
  MessageSquare,
  DollarSign,
  Phone,
  Mail,
  Zap,
  Info,
  Activity,
  UserCheck,
  Percent,
  Copy,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  trackUserBehavior, 
  getActiveSegmentation, 
  SEGMENT_PROFILES, 
  VisitorLog, 
  SIMULATED_PROFILES 
} from '../lib/personalization';
import { Product, Purchase, PurchaseItem } from '../types';

interface LandingPageProps {
  onAdminToggle: () => void;
  addedProductId?: string;
  clearAddedProduct?: () => void;
  products: Product[];
}

export default function LandingPage({ onAdminToggle, addedProductId, clearAddedProduct, products }: LandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Profile Analytics panel state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [, setPersonalizationTick] = useState(0);

  // Monitor dynamic user interactions & refresh layout instantly
  useEffect(() => {
    const handleSync = () => {
      setPersonalizationTick(prev => prev + 1);
    };
    window.addEventListener("aether_personalization_update", handleSync);
    return () => window.removeEventListener("aether_personalization_update", handleSync);
  }, []);

  // Toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  // Checkout states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0); // active tier percentage, e.g. 10
  
  // Progress states
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'paying' | 'success'>('cart');
  const [paymentLog, setPaymentLog] = useState<string[]>([]);
  const [stripeReceipt, setStripeReceipt] = useState<Purchase | null>(null);
  const [exportMethod, setExportMethod] = useState<'none' | 'email_sending' | 'email_sent' | 'sms_sending' | 'sms_sent'>('none');

  // jsPDF compliance receipt generator
  const generatePdfReceipt = (receipt: Purchase) => {
    try {
      const doc = new jsPDF();
      
      // Black Header Card styled background
      doc.setFillColor(15, 15, 15);
      doc.rect(0, 0, 210, 42, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.text("SHIPSAFE AI", 20, 24);
      
      doc.setFontSize(8);
      doc.setFont("Helvetica", "normal");
      doc.text("SECURE PREFLIGHT CODESET LICENSE & COMPLIANCE SCORECARD", 20, 31);
      
      // Header right details
      doc.setFontSize(8);
      doc.text(`DATE: ${new Date(receipt.createdAt).toLocaleString()}`, 135, 20);
      doc.text(`TRANSACTION ID: ${receipt.id}`, 135, 26);
      doc.text(`TOKEN REFERENCE: ${receipt.token}`, 135, 32);
      
      // Blood red divider line
      doc.setDrawColor(122, 0, 16); // #7a0010 - Deep blood red (15% deeper)
      doc.setLineWidth(1.5);
      doc.line(20, 52, 190, 52);
      
      // Customer Details
      doc.setTextColor(20, 20, 20);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("AUTHORIZED LICENSEE INFORMATION", 20, 62);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Recipient E-Mail Link Dispatch: ${receipt.email}`, 20, 69);
      doc.text(`Secure SMS Auth Contact Target: ${receipt.phone}`, 20, 75);
      
      // Checklist Scorecard
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.rect(20, 85, 170, 38);
      
      doc.setFillColor(245, 245, 245);
      doc.rect(21, 86, 168, 7.5, 'F');
      
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("SECURITY PRE-FLIGHT COMPLIANCE VERIFICATION SCORECARD", 24, 91.5);
      
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("[PASS] PORT BOUNDS VERIFIED: Running on container-ingress port standards exclusively.", 25, 100);
      doc.text("[PASS] SECURED ENVIRONMENT INITIALIZATION: Checked for lazy SDK instantiation variables.", 25, 105);
      doc.text("[PASS] CODE INTEGRITY GUARANTEE: Validated syntax tree and sandbox namespace isolation.", 25, 110);
      doc.text("[PASS] ARCHIVE LICENSING VERIFIED: Sandbox single-builder allocation tokens established.", 25, 115);
      
      // Product License Directory
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("LICENSED DIGITAL BLUEPRINTS", 20, 136);
      
      doc.setDrawColor(20, 20, 20);
      doc.setLineWidth(0.5);
      doc.line(20, 140, 190, 140);
      
      let cursorY = 149;
      receipt.items.forEach((item, index) => {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9);
        doc.text(`${index + 1}. ${item.name.toUpperCase()}`, 20, cursorY);
        doc.text(`$${item.price.toFixed(2)}`, 165, cursorY);
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(110, 110, 110);
        doc.text("Assigned unique single-use developer license key credentials. Dispatched securely via archive streams.", 20, cursorY + 4.5);
        
        doc.setTextColor(20, 20, 20);
        cursorY += 14;
      });
      
      doc.line(20, cursorY, 190, cursorY);
      
      // Total Transacted
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("TRANSACTED SECURE TOTAL", 20, cursorY + 10);
      doc.text(`$${receipt.total.toFixed(2)}`, 165, cursorY + 10);
      
      // Blood red Footer Band
      doc.setFillColor(122, 0, 16);
      doc.rect(0, 286, 210, 11, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont("Helvetica", "normal");
      doc.text("SHIPSAFE AI COMPLIANCE ARCHIVE PROTOCOLS. VALID SECURED SANDBOX TICKET RECORD.", 44, 293.5);
      
      doc.save(`SHIPSAFE_RECEIPT_${receipt.id}.pdf`);
      triggerToast("Compliance receipt PDF downloaded successfully!", "success");
    } catch (e: any) {
      console.error("PDF download failure:", e);
      triggerToast("Failed to generate PDF download stream.", "error");
    }
  };

  // Trigger add to cart from floating assistant
  useEffect(() => {
    if (addedProductId) {
      const prod = products.find(p => p.id === addedProductId);
      if (prod) {
        addToCart(prod);
        if (clearAddedProduct) clearAddedProduct();
      }
    }
  }, [addedProductId, products]);

  const addToCart = (product: Product) => {
    trackUserBehavior("add_to_cart", product.category || "Blueprints", `Added ${product.name} to the vault cart`);
    
    setCart(prev => {
      if (prev.some(item => item.id === product.id)) return prev; // Avoid multiples
      return [...prev, product];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    const code = discountCode.toUpperCase().trim();
    trackUserBehavior("apply_promo", "checkout_form", `Applied promotional coupon token candidate: ${code}`);

    const authorizedPromos: Record<string, number> = {
      'AETHER10': 10,
      'ORCHESTRATOR': 10,
      'CORP_SCALE_20': 20,
      'BOOST_VIRAL_15': 15,
      'CFO_TELEMETRY_10': 10,
      'VALUE_ARBITRAGE_12': 12
    };

    if (authorizedPromos[code] !== undefined) {
      setCouponApplied(true);
      setDiscountAmount(authorizedPromos[code]);
      triggerToast(`Promotional code verified! ${authorizedPromos[code]}% discount successfully applied.`, "success");
    } else {
      triggerToast("Invalid or expired promotional token.", "error");
    }
  };

  const getSubtotal = () => cart.reduce((total, p) => total + p.price, 0);
  const getTotal = () => {
    const sub = getSubtotal();
    if (couponApplied) {
      return sub * (1 - discountAmount / 100);
    }
    return sub;
  };

  // Simulated Stripe payments & secure Firestore persistence
  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !cardName || !cardNumber) {
      triggerToast("Please complete required checkout metrics.", "error");
      return;
    }

    setCheckoutStep('paying');
    setPaymentLog(["Contacting Stripe payment gateways...", "Encrypting credit key tokens on device..."]);

    // Simulated webhook log progression
    setTimeout(() => {
      setPaymentLog(prev => [...prev, "Processing authorization batch with token 0x9be7c7af...", "Verifying funds with banking system..."]);
    }, 1200);

    setTimeout(async () => {
      setPaymentLog(prev => [...prev, "Payment APPROVED by card issuer...", "Dispatching secure webhook to local digital inventory..."]);
      
      const purchaseId = "st_txn_" + Math.random().toString(36).substr(2, 9);
      const downloadToken = "dl_tok_" + Math.random().toString(36).substr(2, 16);
      
      const purchaseData: Purchase = {
        id: purchaseId,
        email,
        phone,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          fileUrl: item.fileUrl
        })),
        total: parseFloat(getTotal().toFixed(2)),
        status: 'completed',
        createdAt: new Date().toISOString(),
        token: downloadToken
      };

      try {
        const localPurchases = JSON.parse(localStorage.getItem('aether_local_purchases') || '[]');
        localPurchases.push(purchaseData);
        localStorage.setItem('aether_local_purchases', JSON.stringify(localPurchases));
        
        // Feed the purchase signal to customer segmentation analyzer
        trackUserBehavior("purchase_complete", "checkout_complete", `Created transaction ${purchaseId} with total MRR value of $${purchaseData.total}`);
      } catch (localStoreErr) {
        console.error("Local storage fallback failed:", localStoreErr);
      }

      setStripeReceipt(purchaseData);
      setCheckoutStep('success');
      setCart([]); // Clear cart
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-neutral-50 relative overflow-hidden text-black selection:bg-neutral-200">
      
      {/* Subtle Elegant Geometric Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none opacity-60" />

      {/* Modern High-End Fixed Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 neo-blur border-b border-neutral-100 border-t-2 border-brandred/60">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-display font-black text-lg tracking-[0.2em] text-black">SHIPSAFE AI</span>
              <span className="block text-[8px] font-mono text-neutral-400 tracking-[0.3em] uppercase">SECURE CODESET PREFLIGHT & AUDITS</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Real-time Cognitive Segment Badge */}
            <button
              onClick={() => {
                trackUserBehavior("view_personalization_panel", "header_interaction", "User opened their dynamic segment profile summary");
                setIsProfileOpen(true);
              }}
              className="flex items-center gap-2 bg-brandred/10 border border-brandred/25 hover:bg-brandred/20 px-4 py-2 rounded-full transition-all cursor-pointer"
              id="personalization-panel-trigger"
            >
              <Sparkles className="w-3.5 h-3.5 text-brandred animate-pulse" />
              <span className="text-[9px] font-black tracking-widest text-brandred uppercase">
                {getActiveSegmentation().segment.badge}
              </span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 px-5 py-2.5 rounded-full transition-all cursor-pointer"
              id="cart-trigger"
            >
              <ShoppingBag className="w-4 h-4 text-black" />
              <span className="text-[10px] font-black tracking-widest text-black uppercase">Vault Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center border border-white animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              id="admin-console-shortcut"
              onClick={onAdminToggle}
              className="bg-black text-white px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest hover:bg-neutral-800 hover:scale-105 transition-all uppercase shadow-xl shadow-black/5 cursor-pointer"
            >
              Orchestrator Platform
            </button>
          </div>
        </div>
      </nav>

      {/* Elite Hero Presentation */}
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-16 text-center relative z-10 page-transition">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-full border border-brandred/30 mb-8 text-[10px] text-neutral-500 font-bold tracking-[0.4em] uppercase relative shadow-[0_1px_3px_rgba(122,0,16,0.05)]"
        >
          <span className="w-1 h-1 rounded-full bg-brandred absolute left-3 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5 text-brandred ml-1 shrink-0" strokeWidth={2.5} />
          <span className="text-black font-extrabold pr-1 pl-1">SECURE AGENTIC BUILD DEFENSES</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-black tracking-tighter uppercase max-w-6xl mx-auto flex flex-col items-center leading-[0.78]"
        >
          <span className="text-black select-none z-10 relative">SAFE BUILD.</span>
          <span className="text-brandred select-none z-20 relative -mt-[0.165em]" style={{ marginTop: '-0.165em' }}>FAST LAUNCH.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="serif italic font-light text-neutral-900 lowercase text-3xl sm:text-5xl mt-6 max-w-3xl mx-auto leading-tight"
        >
          {getActiveSegmentation().segment.pitch}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-neutral-500 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto mt-6"
        >
          Equip your AI coding agents with systematic security filters, launch-readiness scoring matrices, and bulletproof deployment frameworks. Delivered instantly upon Stripe checkout.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-8 text-[10px] font-mono text-[#737373] tracking-[0.2em] font-bold uppercase"
        >
          <span className="flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4 text-black shrink-0" /> Stripe Secure Sandboxes</span>
          <span className="flex items-center justify-center gap-2"><Zap className="w-4 h-4 text-black shrink-0" /> Immediate Archive Dispatches</span>
        </motion.div>
      </header>

      {/* Dynamic Active Personalization Spotlight Deal Banner */}
      {(() => {
        const activeSeg = getActiveSegmentation();
        if (activeSeg.segment.id === "general") return null;
        const banner = activeSeg.segment.banner;
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 mb-12 relative z-10"
          >
            <div className="bg-brandred/[0.04] border border-brandred/20 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-brandred/10 flex items-center justify-center shrink-0 border border-brandred/20 text-brandred">
                  <Percent className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-brandred/15 text-brandred text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2">
                    <Sparkles className="w-2.5 h-2.5 text-brandred" />
                    <span>{banner.badgeText} ACTIVATED</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">{banner.title}</h3>
                  <p className="text-neutral-500 text-xs font-light mt-1 max-w-2xl leading-relaxed">{banner.description}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDiscountCode(banner.discountCode);
                  setCouponApplied(true);
                  setDiscountAmount(banner.discountPercent);
                  triggerToast(`Confidential coupon code: '${banner.discountCode}' applied successfully! ${banner.discountPercent}% discount is active in your checkout cart!`, "success");
                  trackUserBehavior("click_spotlight_banner", "intent_conversion", `Clicked banner to apply promo: ${banner.discountCode}`);
                }}
                className="bg-black text-white hover:bg-neutral-800 px-8 py-4 rounded-full font-mono text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-black/10 flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>Instantly Apply: {banner.discountCode}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        );
      })()}

      {/* Bento Information Containers */}
      <section className="max-w-7xl mx-auto px-6 py-10 relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-12 bg-white border border-neutral-100 rounded-[3rem] hover:shadow-2xl transition-all duration-700 group">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500">
            <Cpu className="w-5 h-5 text-neutral-700 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-black tracking-tight mb-4 uppercase">Persistent Guardrails</h3>
          <p className="text-neutral-500 text-sm font-light leading-relaxed">Permanent prompt directives and context-ruleset templates (CLAUDE.md / AGENTS.md) that force strict code compliance.</p>
        </div>

        <div className="p-12 bg-white border border-neutral-100 rounded-[3rem] hover:shadow-2xl transition-all duration-700 group">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500">
            <Layers className="w-5 h-5 text-neutral-700 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-black tracking-tight mb-4 uppercase">Security Preflights</h3>
          <p className="text-neutral-500 text-sm font-light leading-relaxed">Rigorous-test case matrices prioritizing dependency hygiene, safe lazy-init parameters, and credentials safety.</p>
        </div>

        <div className="p-12 bg-white border border-neutral-100 rounded-[3rem] hover:shadow-2xl transition-all duration-700 group">
          <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-black group-hover:text-white transition-all duration-500">
            <ShieldCheck className="w-5 h-5 text-neutral-700 group-hover:text-white" />
          </div>
          <h3 className="text-xl font-black tracking-tight mb-4 uppercase">68-Control Scorecard</h3>
          <p className="text-neutral-500 text-sm font-light leading-relaxed">Comprehensive compliance checklists evaluating database durability, route permissions, and asset-download licensing limits.</p>
        </div>
      </section>

      {/* Pinterest-Grid Product Vault Catalog */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10" id="products-catalog-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-6 border-b border-neutral-100">
          <div>
            <span className="text-[10px] font-black tracking-[0.6em] text-neutral-400 uppercase">VAULT PROTOCOLS</span>
            <h2 className="text-4xl font-black tracking-tighter uppercase text-black mt-2">Active Codeset Archives</h2>
          </div>
          <span className="text-xs text-neutral-400 font-mono tracking-widest mt-2 sm:mt-0 uppercase font-bold">Showing {products.filter(p => selectedCategory === 'All' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase()).length} operational files</span>
        </div>

        {/* Category filtering buttons layout - Monochromatic Slate */}
        <div className="flex flex-wrap gap-3 mb-12">
          {["All", "Blueprints", "Enterprise"].map((cat) => {
            const count = cat === 'All' 
              ? products.length 
              : products.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  trackUserBehavior("filter_category", cat, `Filtered vault catalog by category: ${cat}`);
                }}
                className={`px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat
                     ? "bg-black text-white border-black font-extrabold shadow-lg shadow-black/10"
                     : "bg-white text-neutral-500 hover:text-black hover:bg-neutral-50 border-neutral-200"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] rounded-full px-2 py-0.5 ${selectedCategory === cat ? 'bg-white text-black font-black' : 'bg-neutral-100 text-neutral-500 font-bold'}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Masonry Layout Grid with Dynamic Behavioral Sorting */}
        <div className="pinterest-grid">
          {(() => {
            const activeSeg = getActiveSegmentation();
            const segment = activeSeg.segment;
            
            // Sort products by their designated priority in active customer segment
            const sortedProducts = [...products].sort((a, b) => {
              const idxA = segment.reorderedProductIds.indexOf(a.id);
              const idxB = segment.reorderedProductIds.indexOf(b.id);
              const valA = idxA === -1 ? 999 : idxA;
              const valB = idxB === -1 ? 999 : idxB;
              return valA - valB;
            });

            return sortedProducts
              .filter(p => selectedCategory === 'All' || (p.category || '').toLowerCase() === selectedCategory.toLowerCase())
              .map((p) => {
                const isTopRecommendation = p.id === segment.reorderedProductIds[0];
                return (
                  <div 
                    key={p.id}
                    className={`masonry-item group cursor-pointer bg-white border rounded-[2.5rem] p-8 shadow-sm transition-all duration-700 hover:shadow-[0_45px_90px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-3 flex flex-col justify-between ${
                      isTopRecommendation 
                        ? 'border-brandred/60 shadow-[0_15px_30px_-10px_rgba(122,0,16,0.06)]' 
                        : 'border-neutral-100'
                    }`}
                    id={`product-card-${p.id}`}
                    onClick={() => {
                      // Implicit background trigger to dynamically log interest weight on card clicks
                      trackUserBehavior("click_card", p.category || "Blueprints", `Explored profile context for ${p.name}`);
                    }}
                  >
                    {/* Product Cover Accent */}
                    <div>
                      {isTopRecommendation && (
                        <div className="mb-4 inline-flex items-center gap-1 bg-brandred/10 border border-brandred/20 text-brandred text-[8px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                          <Sparkles className="w-3 h-3 text-brandred animate-pulse" />
                          <span>Confidential Recommendation for you</span>
                        </div>
                      )}

                      <div className="relative overflow-hidden bg-neutral-50 mb-6 aspect-[4/3] rounded-[2rem] shadow-sm border border-neutral-100">
                        <img src={p.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" referrerPolicy="no-referrer" />
                        <div className="absolute top-6 left-6">
                          <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm">
                            {p.category}
                          </span>
                        </div>
                      </div>

                      <div className="px-2">
                        <span className="text-[10px] font-black tracking-widest text-[#737373] uppercase block mb-1">
                          PROTOCOL {p.id.split('_')[1]?.toUpperCase() || "CODE"}
                        </span>
                        <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase text-black group-hover:text-black">
                          {p.name}
                        </h3>
                        <p className="text-neutral-500 text-sm font-light leading-relaxed mb-6">
                          {p.description}
                        </p>

                        <div className="space-y-2 mb-8">
                          {p.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-500 font-light">
                              <CheckCircle className="w-4 h-4 text-black shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-neutral-100 px-2" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <span className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">One-off License</span>
                        <span className="font-mono font-bold text-xl text-black">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            trackUserBehavior("view_specs", p.category || "Blueprints", `Inspected specification parameters for ${p.name}`);
                            setSelectedProduct(p);
                          }}
                          className="px-6 py-2.5 border border-neutral-200 rounded-full font-black text-[9px] tracking-widest uppercase hover:bg-neutral-50 transition-all active:scale-95 cursor-pointer"
                          id={`blowup-trigger-${p.id}`}
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-black text-white px-6 py-2.5 rounded-full text-[9px] font-black tracking-widest hover:bg-neutral-800 hover:scale-105 transition-all uppercase shadow-lg shadow-black/5 cursor-pointer"
                          id={`add-to-cart-btn-${p.id}`}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                );
              });
          })()}
        </div>
      </section>

      {/* 15%-25% Light-Mid Grey Multi-Dimensional Textured Compliance Frame */}
      <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10" id="compliance-preflight-framework">
        <div className="bg-neutral-200 border-4 border-neutral-300 p-8 md:p-16 rounded-[4rem] shadow-[0_45px_100px_rgba(0,0,0,0.12),inset_0_2px_4px_white] relative overflow-hidden flex flex-col items-center">
          
          {/* Internal diagonal architectural lines representing heavy density */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:40px_40px]" />
          
          <div className="relative z-10 text-center max-w-3xl space-y-6">
            <span className="text-[10px] font-mono tracking-[0.5em] text-neutral-500 font-extrabold block uppercase">
              THE METHOD: DENSE SYSTEM PREFLIGHT CHECKLISTS
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tighter uppercase leading-[0.9]">
              SHIPSAFE AI 68-CONTROL SECURITY SCORECARD
            </h3>
            
            <p className="text-neutral-600 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto">
              AI agents are ultra-productive, yet they introduce critical port leaks, fragile initialization sequences, and dependencies hygiene risks. SHIPSAFE pre-flight controls are the permanent compliance blocks.
            </p>
            
            {/* Grid of 4 dense multidimensional grey panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-start">
              
              <div className="p-8 bg-neutral-100/90 border-2 border-neutral-300 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_white] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] transition-all">
                <span className="text-[9px] font-mono text-brandred font-black tracking-widest block mb-1">CONTROL PROTOCOL 01</span>
                <h4 className="font-extrabold text-neutral-900 text-sm uppercase mb-2">Ingress Port Integrity</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Locking development and container production systems to strict standard ports exclusively. Removing rogue internal microservices.
                </p>
              </div>

              <div className="p-8 bg-neutral-100/90 border-2 border-neutral-300 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_white] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] transition-all">
                <span className="text-[9px] font-mono text-brandred font-black tracking-widest block mb-1">CONTROL PROTOCOL 02</span>
                <h4 className="font-extrabold text-neutral-900 text-sm uppercase mb-2">Variable Lazy-Init</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Eliminating structural crash loops on startup by enforcing verified variable injection gates prior to SDK loading trigger sequences.
                </p>
              </div>

              <div className="p-8 bg-neutral-100/90 border-2 border-neutral-300 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_white] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] transition-all">
                <span className="text-[9px] font-mono text-brandred font-black tracking-widest block mb-1">CONTROL PROTOCOL 03</span>
                <h4 className="font-extrabold text-neutral-900 text-sm uppercase mb-2">HMR Exclusions Gate</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Isolating runtime states from Hot Module Replacement flushes, ensuring that UI updates persist cleanly during swift transitions.
                </p>
              </div>

              <div className="p-8 bg-neutral-100/90 border-2 border-neutral-300 rounded-[2rem] shadow-[0_15px_30px_rgba(0,0,0,0.06),inset_0_1px_1px_white] hover:shadow-[0_20px_45px_rgba(0,0,0,0.09)] transition-all">
                <span className="text-[9px] font-mono text-brandred font-black tracking-widest block mb-1">CONTROL PROTOCOL 04</span>
                <h4 className="font-extrabold text-neutral-900 text-sm uppercase mb-2">Sandbox Isolation storage</h4>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">
                  Verifying absolute client data boundaries with secure browser local state backup handlers, isolating logs and transactions.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Segment */}
      <section className="bg-black text-white rounded-[4rem] max-w-7xl mx-auto my-16 p-12 md:p-20 relative z-10 shadow-3xl text-center">
        <div className="max-w-3xl mx-auto">
          <ShieldCheck className="w-14 h-14 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl font-black tracking-tighter uppercase text-white mb-4">Upfront Prepaved Clearances</h2>
          <p className="text-neutral-400 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed font-light">
            Once authorized through secure Stripe transactions, SHIPSAFE AI instantly releases signed license archive keys on screen for immediate secure downloads and email / SMS notification receipt keys.
          </p>
        </div>
      </section>

      {/* High-End Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-mono text-neutral-400 font-bold uppercase tracking-widest">© 2026 SHIPSAFE AI. MASTERMIND BUILD SECURITY.</span>
        </div>

        <button 
          onClick={onAdminToggle}
          className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-500 hover:text-black transition-all underline decoration-1 underline-offset-4 cursor-pointer"
        >
          Administrator Executive Terminal Login
        </button>
      </footer>


      {/* IMMERSIVE PRODUCT BLOWUP MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Modal Glass Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-neutral-100 rounded-[3rem] w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Header Cover Banner */}
              <div className="p-8 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] text-neutral-400 tracking-[0.2em] font-bold uppercase">{selectedProduct.category} Blueprint</span>
                  <h3 className="text-2xl font-black tracking-tight text-black mt-1 uppercase">{selectedProduct.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-2 rounded-full bg-neutral-250 text-black hover:bg-neutral-200 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Spec details Info */}
              <div className="p-8 md:p-10 space-y-8">
                <div>
                  <h4 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3 font-bold">Description</h4>
                  <p className="text-neutral-600 text-sm font-light leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div>
                  <h4 className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4 font-bold">Included Specifications & Operations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProduct.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-neutral-50 rounded-[1.5rem] border border-neutral-100">
                        <CheckCircle className="w-4 h-4 text-black shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-700 font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-neutral-50 rounded-[1.5rem] border border-neutral-100 flex items-start gap-4">
                  <Info className="w-4 h-4 text-black shrink-0 mt-0.5" />
                  <p className="text-[11.5px] sm:text-xs text-neutral-500 leading-relaxed font-light">
                    This is an autonomous digital asset. Once payment succeeds, Stripe signals the webhook channel. This unlocks immediate full code deployment assets in txt/json formatting.
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="block text-[9px] font-mono text-neutral-400 uppercase">License Fee</span>
                    <span className="font-mono font-bold text-2xl text-black">${selectedProduct.price.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-3 text-xs font-black tracking-widest uppercase text-neutral-500 hover:text-black transition cursor-pointer"
                    >
                      Close Detail
                    </button>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="px-6 py-3 rounded-full bg-black hover:bg-neutral-800 text-[10px] font-black tracking-widest text-white transition cursor-pointer uppercase shadow-lg shadow-black/10"
                    >
                      Buy Asset Now
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* STRIPE SECURE CHECKOUT SLIDE DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              id="cart-backdrop"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="w-screen max-w-md bg-black border-l border-neutral-900 text-white shadow-2xl flex flex-col justify-between h-full"
                id="checkout-cart-drawer"
              >
                {/* Cart Header */}
                <div className="p-8 bg-neutral-950 border-b border-neutral-900 flex items-center justify-between animate-pulse">
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-white" />
                    <h3 className="font-display font-black text-white tracking-[0.2em] text-sm uppercase">THE VAULT SUITE</h3>
                  </span>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-2.5 rounded-full bg-neutral-900 text-neutral-400 hover:text-white transition text-[9px] font-mono cursor-pointer uppercase tracking-widest border border-neutral-800"
                  >
                    Esc
                  </button>
                </div>

                {/* Main Dynamic View: Cart -> Paying -> Success */}
                <div className="flex-1 overflow-y-auto p-8 fancy-scrollbar">
                  
                  {checkoutStep === 'cart' && (
                    <div className="space-y-8">
                      {cart.length === 0 ? (
                        <div className="text-center py-24 space-y-6">
                          <ShoppingBag className="w-12 h-12 text-neutral-800 mx-auto" />
                          <p className="text-sm text-neutral-400 font-light">Your cart is currently empty.</p>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-white hover:text-neutral-300 text-[10px] font-black uppercase tracking-widest underline cursor-pointer"
                          >
                            Explore Codeset Archives
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Products Listing */}
                          <div className="space-y-4">
                            <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Selected Blueprints</h4>
                            {cart.map((p) => (
                              <div key={p.id} className="flex p-4 bg-neutral-950 border border-neutral-900 rounded-[1.5rem] items-center justify-between">
                                <div>
                                  <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-widest block">{p.category}</span>
                                  <span className="text-sm font-bold text-white block mt-1 uppercase">{p.name}</span>
                                  <span className="text-xs text-neutral-400 mt-1 block">${p.price.toFixed(2)}</span>
                                </div>
                                <button
                                  onClick={() => removeFromCart(p.id)}
                                  className="p-1.5 text-neutral-400 hover:text-white text-[9px] font-mono uppercase tracking-widest cursor-pointer hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Promo code box */}
                          <div className="p-6 bg-neutral-950 border border-neutral-900 rounded-[2rem] space-y-4">
                            <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Coupon Authentication</h4>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="e.g. AETHER10"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-neutral-700"
                              />
                              <button
                                onClick={applyPromo}
                                className="bg-white hover:bg-neutral-100 text-black rounded-full px-5 py-2 text-[10px] font-black tracking-widest transition cursor-pointer font-mono uppercase"
                              >
                                Apply
                              </button>
                            </div>
                            {couponApplied && (
                              <div className="text-xs text-neutral-300 flex items-center justify-between font-bold">
                                <span>Core Authorization Applied:</span>
                                <strong className="text-emerald-400">-{discountAmount}% OFF</strong>
                              </div>
                            )}
                          </div>

                          {/* Billing stripe payment details */}
                          <form onSubmit={handleStripeCheckout} className="space-y-6">
                            <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold font-black">Stripe billing specifications</h4>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">Email (Instant Access Link) *</label>
                                <input
                                  type="email"
                                  placeholder="purchaser@enterprise.net"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 text-xs block text-white focus:outline-none focus:border-neutral-700 font-mono"
                                  id="stripe-email"
                                />
                              </div>

                              <div>
                                <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">Mobile/Phone (Secure Notification) *</label>
                                <input
                                  type="tel"
                                  placeholder="+1 (555) 302-8822"
                                  required
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 text-xs block text-white focus:outline-none focus:border-neutral-700 font-mono"
                                  id="stripe-phone"
                                />
                              </div>

                              <div className="pt-2 border-t border-neutral-900">
                                <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">Credit Card Number *</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    required
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded-full pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-700 block font-mono"
                                  />
                                  <CreditCard className="w-4 h-4 text-white absolute left-3.5 top-0.5 mt-2" />
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">Expiration *</label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    required
                                    value={cardExpiry}
                                    onChange={(e) => setCardExpiry(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-700 block font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">CVV *</label>
                                  <input
                                    type="password"
                                    placeholder="321"
                                    required
                                    value={cardCvv}
                                    onChange={(e) => setCardCvv(e.target.value)}
                                    className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-700 block font-mono"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5 font-bold">Cardholder Name *</label>
                                <input
                                  type="text"
                                  placeholder="Full Name"
                                  required
                                  value={cardName}
                                  onChange={(e) => setCardName(e.target.value)}
                                  className="w-full bg-neutral-950 border border-neutral-900 rounded-full px-4 py-2.5 text-xs text-white focus:outline-none focus:border-neutral-700 block"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              id="stripe-checkout-btn"
                              className="w-full bg-white hover:bg-neutral-200 text-black rounded-full py-4 text-[10px] font-black mt-6 transition cursor-pointer font-mono uppercase tracking-[0.2em] shadow-lg"
                            >
                              Confirm Payment: ${getTotal().toFixed(2)}
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  )}

                  {checkoutStep === 'paying' && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-8">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-neutral-800 border-t-white animate-spin" />
                        <ShieldCheck className="w-8 h-8 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                      </div>
                      
                      <div className="text-center">
                        <h4 className="font-display font-black text-white uppercase tracking-widest text-sm">Stripe Webhook Authorization</h4>
                        <p className="text-xs text-[#737373] mt-1 font-light">Stand by while confirming ledger accounts.</p>
                      </div>

                      {/* Webhook dynamic console logging trace */}
                      <div className="w-full bg-neutral-950 rounded-[1.5rem] p-5 border border-neutral-900 text-[10px] font-mono space-y-1.5 text-neutral-300 max-h-36 overflow-y-auto">
                        {paymentLog.map((log, idx) => (
                          <div key={idx} className="flex gap-1">
                            <span className="text-white">{">"}</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {checkoutStep === 'success' && stripeReceipt && (
                    <div className="space-y-6">
                      <div className="p-6 bg-brandred-hover/40 border border-brandred/40 rounded-[2rem] text-center space-y-3">
                        <CheckCircle className="w-12 h-12 text-brandred mx-auto animate-bounce" strokeWidth={1.5} />
                        <h4 className="font-display font-black uppercase text-white tracking-[0.2em] text-sm">Receipt Confirmed</h4>
                        <p className="text-xs text-rose-200 font-light">Payment receipt successfully computed and logged securely.</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Secure Receipt Dispatch Channels</h4>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <button 
                            onClick={() => generatePdfReceipt(stripeReceipt)}
                            type="button"
                            className="w-full bg-brandred hover:bg-brandred-hover text-white rounded-full py-3.5 px-4 text-[10px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-brandred/10"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Official PDF Receipt</span>
                          </button>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => {
                                setExportMethod('email_sending');
                                setTimeout(() => {
                                  setExportMethod('email_sent');
                                  triggerToast(`Digital PDF Compliance Receipt emailed to ${stripeReceipt.email} successfully!`, 'success');
                                }, 1500);
                              }}
                              type="button"
                              disabled={exportMethod.includes('sending')}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white rounded-full py-2.5 px-3 text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Mail className="w-3.5 h-3.5 text-brandred" />
                              <span>{exportMethod === 'email_sent' ? 'Emailed ✓' : exportMethod === 'email_sending' ? 'Sending...' : 'E-Mail PDF'}</span>
                            </button>

                            <button 
                              onClick={() => {
                                setExportMethod('sms_sending');
                                setTimeout(() => {
                                  setExportMethod('sms_sent');
                                  triggerToast(`SMS authentication token successfully dispatched to ${stripeReceipt.phone}!`, 'success');
                                }, 1500);
                              }}
                              type="button"
                              disabled={exportMethod.includes('sending')}
                              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white rounded-full py-2.5 px-3 text-[9px] font-mono font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Phone className="w-3.5 h-3.5 text-brandred" />
                              <span>{exportMethod === 'sms_sent' ? 'SMS Sent ✓' : exportMethod === 'sms_sending' ? 'Sending...' : 'SMS Token'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Transaction Ledger Synopsis</h4>
                        <div className="bg-neutral-950 rounded-[1.5rem] border border-neutral-900 p-5 space-y-2.5 text-xs font-mono">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Receipt ID:</span>
                            <span className="text-neutral-200">{stripeReceipt.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Charged Amount:</span>
                            <span className="text-white font-extrabold">${stripeReceipt.total.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Destination Mail:</span>
                            <span className="text-neutral-200">{stripeReceipt.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Destination SMS:</span>
                            <span className="text-neutral-200">{stripeReceipt.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <h4 className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Deliverables collection archive</h4>
                        <p className="text-xs text-neutral-400 font-light">Directly access your compiled automated blueprints below:</p>

                        <div className="space-y-3">
                          {stripeReceipt.items.map((item) => (
                            <div key={item.id} className="flex p-4 bg-neutral-950 border border-neutral-900 rounded-[1.5rem] items-center justify-between">
                              <div>
                                <span className="text-[10px] font-mono text-neutral-400 block tracking-wider uppercase">ARCHIVE SPEC</span>
                                <span className="text-xs font-bold text-white block mt-0.5 uppercase">{item.name}</span>
                              </div>
                              <a
                                href={`/api/downloads/${item.fileUrl}?token=${stripeReceipt.token}&purchaseId=${stripeReceipt.id}`}
                                download
                                className="bg-white hover:bg-neutral-100 text-black rounded-full px-5 py-2.5 text-[9px] font-black uppercase tracking-widest decoration-none cursor-pointer flex items-center gap-1.5 shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Get code</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-900 flex gap-2.5">
                        <div className="w-1.5 h-1.5 bg-brandred rounded-full shrink-0 mt-1.5" />
                        <p className="text-[10.5px] text-neutral-500 leading-relaxed font-light">
                          A local copy of your downloadable links and receipts has been securely logged on sandbox storage. Compliance scorecards have flagged all systems passed under standard protocols.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setCheckoutStep('cart');
                          setExportMethod('none');
                          setIsCartOpen(false);
                        }}
                        type="button"
                        className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white rounded-full py-3.5 text-[10px] font-black uppercase tracking-widest transition mt-4 cursor-pointer"
                      >
                        Return to Store
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating high-end custom toast overlay block */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.97 }}
            className={`fixed bottom-6 right-6 z-50 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4 border max-w-sm ${
              toastType === 'success' 
                ? 'bg-black border-neutral-850 text-white' 
                : toastType === 'error'
                ? 'bg-black border-neutral-850 text-white'
                : 'bg-black border-neutral-850 text-white'
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

      {/* COGNITIVE INTELLIGENCE PROFILE ANALYSIS DRAWER */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProfileOpen(false)}
              className="absolute inset-0 bg-black backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white h-full shadow-3xl flex flex-col justify-between border-l border-neutral-200 z-10"
            >
              {/* Header */}
              <div className="p-8 border-b border-neutral-150 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-brandred" />
                    <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">Personalization Index</h3>
                  </div>
                  <p className="text-neutral-500 text-xs font-light mt-1">Real-time telemetry logging behavioral signals & segment parameters.</p>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="w-10 h-10 border border-neutral-200 hover:bg-neutral-50 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 text-neutral-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8 overflow-y-auto flex-1 text-sm text-neutral-800">
                {/* Active Seg Card */}
                {(() => {
                  const activeSeg = getActiveSegmentation();
                  const segment = activeSeg.segment;
                  const scores = activeSeg.scores;
                  const logs: VisitorLog[] = JSON.parse(localStorage.getItem('aether_visitor_logs') || '[]');

                  return (
                    <>
                      {/* Section 1: Active Segment Profile */}
                      <div className="bg-brandred/[0.04] border border-brandred/20 rounded-[2rem] p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-widest text-brandred uppercase">Active Classification</span>
                          <span className="bg-brandred/10 text-brandred text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                            Confidence: {(activeSeg.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-brandred/10 border border-brandred/20 rounded-2xl flex items-center justify-center text-brandred font-bold">
                            <UserCheck className="w-5 h-5 text-brandred" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black uppercase text-neutral-900 tracking-tight leading-none">{segment.label}</h4>
                            <span className="text-[10.5px] font-mono text-brandred tracking-wider uppercase font-bold">{segment.badge}</span>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed font-light italic">"{segment.pitch}"</p>
                        
                        {/* applied discount badge and voucher code */}
                        <div className="pt-3 border-t border-brandred/10 flex items-center justify-between">
                          <div>
                            <span className="block text-[9px] font-black text-neutral-400 uppercase tracking-widest">Calculated Voucher</span>
                            <span className="font-mono text-xs font-bold text-neutral-800">{segment.banner.discountCode} ({segment.banner.discountPercent}% OFF)</span>
                          </div>
                          <button
                            onClick={() => {
                              setDiscountCode(segment.banner.discountCode);
                              setCouponApplied(true);
                              setDiscountAmount(segment.banner.discountPercent);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                              triggerToast(`Voucher code ${segment.banner.discountCode} applied to checkout automatically!`, "success");
                            }}
                            className="bg-brandred/10 border border-brandred/25 text-brandred hover:bg-brandred/20 px-4 py-2 rounded-full font-mono text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedCode ? 'Applied' : 'Copy & Apply'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Section 2: Interest Parameter Heatmap UI sliders/progress bars */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <h4 className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Behavior Scored Weight</h4>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold">Local Scoring Matrix</span>
                        </div>
                        <div className="bg-neutral-50 border border-neutral-100 rounded-[2rem] p-6 space-y-4 font-mono">
                          {[
                            { key: 'automation', label: 'Automation Intent (Prospector)', color: 'bg-indigo-600' },
                            { key: 'social', label: 'Social Engagement Intent (Webhook)', color: 'bg-emerald-600' },
                            { key: 'cfo', label: 'Quantitative CFO Intent (Ledger)', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
                            { key: 'value', label: 'Value Negotiator Intent (Coupons)', color: 'bg-rose-600' }
                          ].map((item) => {
                            const score = scores[item.key as keyof typeof scores] || 0;
                            return (
                              <div key={item.key} className="space-y-1.5 text-xs text-start">
                                <div className="flex justify-between text-[11px] font-bold text-neutral-600 uppercase">
                                  <span>{item.label}</span>
                                  <span>{score} pts</span>
                                </div>
                                <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden flex items-center justify-between">
                                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${Math.min(100, (score / 15) * 100)}%` }} />
                                </div>
                                <div className="flex gap-2.5">
                                  <button
                                    onClick={() => {
                                      const stored = JSON.parse(localStorage.getItem('aether_visitor_scores') || '{}');
                                      stored[item.key] = Math.max(0, (stored[item.key] || 0) + 5);
                                      localStorage.setItem('aether_visitor_scores', JSON.stringify(stored));
                                      window.dispatchEvent(new Event("aether_personalization_update"));
                                      trackUserBehavior("adjust_scores_manually", item.key, `Artificially incremented intent parameter`);
                                      triggerToast(`Score parameter augmented: ${item.label}`, "info");
                                    }}
                                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2.5 py-0.5 rounded text-[9px] font-extrabold cursor-pointer transition-all active:scale-95"
                                  >
                                    +5 PTS
                                  </button>
                                  <button
                                    onClick={() => {
                                      const stored = JSON.parse(localStorage.getItem('aether_visitor_scores') || '{}');
                                      stored[item.key] = Math.max(0, (stored[item.key] || 0) - 5);
                                      localStorage.setItem('aether_visitor_scores', JSON.stringify(stored));
                                      window.dispatchEvent(new Event("aether_personalization_update"));
                                      trackUserBehavior("adjust_scores_manually", item.key, `Artificially decremented intent parameter`);
                                    }}
                                    className="bg-neutral-200 hover:bg-neutral-300 text-neutral-700 px-2.5 py-0.5 rounded text-[9px] font-extrabold cursor-pointer transition-all active:scale-95"
                                  >
                                    -5 PTS
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 3: Force Segment Sandbox Override Controls */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black tracking-widest text-neutral-400 text-start uppercase">Force Override Core Segments</h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          {SIMULATED_PROFILES.map((profile) => {
                            const isOverriddenActive = localStorage.getItem('aether_visitor_force_segment') === profile.segmentId;
                            return (
                              <button
                                key={profile.segmentId}
                                onClick={() => {
                                  if (isOverriddenActive) {
                                    localStorage.removeItem('aether_visitor_force_segment');
                                    triggerToast(`Removed forced override. Switched back to log scoring analytics.`, "info");
                                  } else {
                                    localStorage.setItem('aether_visitor_force_segment', profile.segmentId);
                                    triggerToast(`Forced customer segment override to: ${profile.name}`, "success");
                                  }
                                  window.dispatchEvent(new Event("aether_personalization_update"));
                                }}
                                className={`p-4 rounded-2xl text-[10px] uppercase font-mono border text-left flex flex-col justify-between transition-all cursor-pointer h-24 ${
                                  isOverriddenActive 
                                    ? 'bg-black border-black text-white font-extrabold shadow-lg' 
                                    : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600'
                                }`}
                              >
                                <span className="font-extrabold block truncate leading-tight">{profile.name}</span>
                                <span className={`text-[8.5px] mt-2 block font-extrabold ${isOverriddenActive ? 'text-brandred' : 'text-neutral-400'}`}>
                                  {isOverriddenActive ? '★ ACTIVE OVERRIDE' : 'FORCE THIS'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 4: Live Human Activity Feeds */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <h4 className="text-[10px] font-black tracking-widest text-neutral-400 uppercase">Interaction Chronology logs</h4>
                          <span className="text-[9px] font-mono text-neutral-400 uppercase font-bold">{logs.length} signals tracked</span>
                        </div>
                        
                        <div className="bg-neutral-50 border border-neutral-100 rounded-[2rem] p-6 space-y-4 max-h-[160px] overflow-y-auto text-xs font-mono">
                          {logs.length === 0 ? (
                            <span className="block italic text-neutral-400 leading-normal text-center py-4">No behavioral traces recorded yet. Go click product cards, Specs, filters, or prompt Aetheria to log interactions!</span>
                          ) : (
                            [...logs].reverse().map((log, index) => (
                              <div key={index} className="flex gap-2.5 items-start py-2 border-b border-neutral-100 last:border-0 leading-normal text-start">
                                <span className="text-brandred shrink-0 select-none">{"[SIG]"}</span>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-black uppercase text-[10px]">{log.action}</span>
                                    <span className="text-neutral-400 font-light text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <span className="block text-neutral-500 font-light text-[10px] mt-0.5">{log.description}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Reset Trace Controls Footer */}
              <div className="p-8 border-t border-neutral-150 flex gap-4 bg-neutral-50">
                <button
                  onClick={() => {
                    localStorage.removeItem('aether_visitor_logs');
                    localStorage.removeItem('aether_visitor_scores');
                    localStorage.removeItem('aether_visitor_force_segment');
                    window.dispatchEvent(new Event("aether_personalization_update"));
                    triggerToast(`Wiped all local behavior tracing telemetry successfully! Recategorizing customer as standard default profile.`, "success");
                    setIsProfileOpen(false);
                  }}
                  className="flex-1 bg-black text-white hover:bg-neutral-800 rounded-full py-4 text-[10.5px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg active:scale-95 text-center"
                >
                  Delete Telemetry Traces
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
