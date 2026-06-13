import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import CommandCenter from './components/CommandCenter';
import CustomerServiceChat from './components/CustomerServiceChat';
import { Product } from './types';

// Core default high-tech blueprints to ensure zero-cold-start gorgeous interface
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "asset_solo",
    name: "SHIPSAFE Solo License",
    description: "Personal project license for builders applying SHIPSAFE AI guardrails to applications they own or operate. Includes persistent coding-agent guardrails, test matrices, and the 68-control Launch Readiness Scorecard.",
    price: 39.00,
    fileUrl: "asset_solo",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80",
    category: "Blueprints",
    features: [
      "Operating Manual & Quickstart Checklist",
      "AGENTS.md, CLAUDE.md, GEMINI.md templates",
      "Security Preflight & Authorization Test Matrix",
      "68-control Launch Readiness Scorecard"
    ]
  },
  {
    id: "asset_commercial",
    name: "SHIPSAFE Commercial License",
    description: "Commercial project license for freelancers, consultants, agencies, and studios applying SHIPSAFE during paid client work. Includes editable templates, client assessment assets, handover reports, and priority systems.",
    price: 129.00,
    fileUrl: "asset_commercial",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    category: "Enterprise",
    features: [
      "Includes EVERYTHING in SHIPSAFE Solo Package",
      "Resale handovers & commercial project reuse rights",
      "Editable premium templates",
      "Handover reports & Findings register"
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
