import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CommandCenter from './components/CommandCenter';
import CustomerServiceChat from './components/CustomerServiceChat';
import { Product } from './types';

// Core default high-tech blueprints to ensure zero-cold-start gorgeous interface
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "asset_prospector",
    name: "Account Prospector Automation Blueprint",
    description: "Autonomous lead finder and parser. Headlessly sweeps Hacker News, social tech channels, and recruiter aggregates to identify corporate hiring budgets, isolates AI-oriented slots, and compiles strategic outreach rosters.",
    price: 29.00,
    fileUrl: "asset_prospector",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80",
    category: "Blueprints",
    features: [
      "Headless Puppeteer scraping queues",
      "Dynamic lead metadata structuring",
      "Interactive command logs console compiler",
      "Auto-filtering key technology terms"
    ]
  },
  {
    id: "asset_webhook",
    name: "Express Social Webhook Queue",
    description: "Multi-channel automated social publisher. Constructs secure post buffers with cryptographic HMACS, enabling sole orchestrators to dispatch parallel growth queues to X (Twitter), LinkedIn, and Slack simultaneously.",
    price: 19.00,
    fileUrl: "asset_webhook",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    category: "Micro-SaaS",
    features: [
      "Parallel social multi-post adapters",
      "HMAC SHA256 cryptographic handshakes",
      "Interval queues with custom post-delay timers",
      "Client webhook authentication middleware"
    ]
  },
  {
    id: "asset_cfo",
    name: "Agentic Cashflow CFO Controller",
    description: "The supreme financial planning dashboard widget. Collects store orders from database snapshots, dynamically compiles MRR growth, measures active cloud burn-rates, and structures strategic forecast ledgers.",
    price: 39.00,
    fileUrl: "asset_cfo",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    category: "Controller",
    features: [
      "Dynamic MRR velocity calculator",
      "Ledger compilation and cash flow forecaster",
      "Interactive target telemetry graphs module",
      "Full offline fallback state support"
    ]
  }
];

export default function App() {
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [addedProductId, setAddedProductId] = useState<string | undefined>(undefined);

  // Load local state helpers
  const getMergedProducts = (liveList: Product[]) => {
    let merged = [...liveList];
    try {
      const local = localStorage.getItem('aether_local_products');
      if (local) {
        const parsed: Product[] = JSON.parse(local);
        parsed.forEach((lp) => {
          const idx = merged.findIndex(p => p.id === lp.id);
          if (idx > -1) {
            merged[idx] = lp;
          } else {
            merged.push(lp);
          }
        });
      } else {
        // First-time seed of local product storage for seamless offline persistence
        localStorage.setItem('aether_local_products', JSON.stringify(liveList));
      }
    } catch (e) {
      console.warn("Error reading local products:", e);
    }
    return merged;
  };

  // Sync products list locally on mount and register live changes
  useEffect(() => {
    const finalProds = getMergedProducts(DEFAULT_PRODUCTS);
    setProducts(finalProds);

    // Listen to administrative additions / updates via local persistence event
    const handleSync = () => {
      const updated = getMergedProducts(DEFAULT_PRODUCTS);
      setProducts(updated);
    };

    window.addEventListener("aether_personalization_update", handleSync);
    return () => window.removeEventListener("aether_personalization_update", handleSync);
  }, []);

  const handleAddProductLocal = (newProd: Product) => {
    try {
      const local = localStorage.getItem('aether_local_products');
      const parsed: Product[] = local ? JSON.parse(local) : [];
      if (!parsed.some(p => p.id === newProd.id)) {
        parsed.push(newProd);
        localStorage.setItem('aether_local_products', JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn("Error saving product locally:", e);
    }

    setProducts(prev => {
      if (prev.some(item => item.id === newProd.id)) return prev;
      return [...prev, newProd];
    });
  };

  const handleUpdateProductLocal = (updatedProd: Product) => {
    try {
      const local = localStorage.getItem('aether_local_products');
      const parsed: Product[] = local ? JSON.parse(local) : [];
      const idx = parsed.findIndex(p => p.id === updatedProd.id);
      if (idx > -1) {
        parsed[idx] = updatedProd;
      } else {
        parsed.push(updatedProd);
      }
      localStorage.setItem('aether_local_products', JSON.stringify(parsed));
    } catch (e) {
      console.warn("Error updating product locally:", e);
    }

    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProductLocal = (deletedId: string) => {
    try {
      const local = localStorage.getItem('aether_local_products');
      if (local) {
        const parsed: Product[] = JSON.parse(local);
        const filtered = parsed.filter(p => p.id !== deletedId);
        localStorage.setItem('aether_local_products', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("Error deleting product locally:", e);
    }

    setProducts(prev => prev.filter(p => p.id !== deletedId));
  };

  const selectAddToCartFromChat = (productId: string) => {
    setAddedProductId(productId);
  };

  return (
    <div className="min-h-screen bg-[#030712] relative select-none">
      
      {/* Dynamic View switching */}
      {view === 'store' ? (
        <>
          <LandingPage 
            products={products}
            onAdminToggle={() => setView('admin')}
            addedProductId={addedProductId}
            clearAddedProduct={() => setAddedProductId(undefined)}
          />
          {/* Chat widget layer */}
          <CustomerServiceChat 
            onAddToCart={selectAddToCartFromChat}
          />
        </>
      ) : (
        <CommandCenter 
          products={products}
          onBackToStore={() => setView('store')}
          onAddProduct={handleAddProductLocal}
          onUpdateProduct={handleUpdateProductLocal}
          onDeleteProduct={handleDeleteProductLocal}
        />
      )}
    </div>
  );
}
