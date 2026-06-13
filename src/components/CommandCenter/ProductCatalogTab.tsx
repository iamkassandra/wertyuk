import React, { useState } from "react";
import {
  ShoppingBag,
  Settings,
  Trash2,
  Globe,
  RefreshCw,
  CheckCircle,
  Plus,
} from "lucide-react";
import { Product, GitHubFile } from "../../types";

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  features: string;
  assetKey: string;
  codeContent: string;
}

const initialFormState: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Blueprints",
  features: "",
  assetKey: "",
  codeContent: "",
};

interface ProductCatalogTabProps {
  products: Product[];
  gitRepo: string;
  setGitRepo: (v: string) => void;
  syncStatus: "idle" | "syncing" | "success" | "error";
  gitFiles: GitHubFile[];
  repoSource: "products.json" | "files-list" | null;
  isAnalyzingFile: string | null;
  syncGitHubRepository: () => void;
  analyzeGitHubFileWithAi: (
    file: GitHubFile,
    populateForm: (data: Partial<ProductForm>) => void,
  ) => void;
  importProductsJsonListing: (prod: GitHubFile) => void;
  deleteStoreProduct: (id: string) => void;
  initiateEditProduct: (p: Product) => void;
  onSubmitNewProduct: (newProductData: Omit<Product, "image">) => void;
}

export default function ProductCatalogTab({
  products,
  gitRepo,
  setGitRepo,
  syncStatus,
  gitFiles,
  repoSource,
  isAnalyzingFile,
  syncGitHubRepository,
  analyzeGitHubFileWithAi,
  importProductsJsonListing,
  deleteStoreProduct,
  initiateEditProduct,
  onSubmitNewProduct,
}: ProductCatalogTabProps) {
  // Single consolidated state object for product creation form
  const [form, setForm] = useState<ProductForm>(initialFormState);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setValidationError(null); // clear alert when writing
  };

  const handleAiPopulation = (data: Partial<ProductForm>) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
    setValidationError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.description) {
      setValidationError(
        "Missing required attributes (Title, Price, or Description).",
      );
      return;
    }

    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum)) {
      setValidationError(
        "Pricing requires a valid numerical currency decimal.",
      );
      return;
    }

    const finalId =
      form.assetKey.trim() ||
      "asset_custom_" + Math.random().toString(36).substring(2, 7);
    const newProductData: Omit<Product, "image"> = {
      id: finalId,
      name: form.name,
      description: form.description,
      price: priceNum,
      fileUrl: finalId,
      category: form.category,
      features: form.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      codeContent:
        form.codeContent ||
        `// ${form.name} Blueprint source code attached successfully`,
    };

    onSubmitNewProduct(newProductData);
    setForm(initialFormState); // Reset to blank cleanly
    setValidationError(null);
  };

  return (
    <div className="space-y-8 font-sans text-black">
      {/* Advanced Grid: Catalog table & GitHub sync, Right contains Add product spec form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left block (Span 2): Live catalog table & GitHub syncer */}
        <div className="xl:col-span-2 space-y-8">
          {/* Live catalog list */}
          <div className="bg-white rounded-[3rem] border border-neutral-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h4 className="font-display font-black text-xs text-black uppercase tracking-widest">
                  Storefront Catalog Ledger
                </h4>
                <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wider mt-0.5">
                  Live products and downloadable script archives synced in
                  real-time
                </p>
              </div>
              <span className="text-[9px] text-[#737373] font-mono bg-neutral-50 px-3 py-1 border border-neutral-150 rounded-full font-extrabold uppercase tracking-widest">
                {products.length} Blueprints Live
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-500 font-mono text-[9px] uppercase tracking-widest font-black">
                    <th className="py-3 px-3">Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Asset key / Associated File</th>
                    <th className="py-3 px-3 text-right">
                      Operational Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-neutral-50/75 transition-colors text-black"
                    >
                      <td className="py-4 px-3 font-semibold text-black">
                        <div className="font-sans font-extrabold text-[12px]">{p.name}</div>
                        <span className="text-[9px] text-[#737373] font-mono block max-w-xs truncate mt-1">
                          {p.description}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className="bg-neutral-100 text-black border border-transparent rounded-full px-2.5 py-0.5 text-[8.5px] font-mono tracking-widest font-black uppercase">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-black font-mono text-black text-xs">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-3 font-mono text-[10px] text-neutral-600">
                        <div className="font-black text-black">{p.fileUrl}</div>
                        {p.codeContent ? (
                          <span className="text-[9.5px] text-[#1a1a1a] flex items-center gap-1 mt-1 font-bold uppercase tracking-wider">
                            <CheckCircle className="w-2.5 h-2.5" />
                            <span>
                              Custom code ({p.codeContent.length}{" "}
                              bytes)
                            </span>
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#a3a3a3] block mt-1 uppercase tracking-wider">
                            Static server file mapping
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-3 text-right space-x-2">
                        <button
                          onClick={() => initiateEditProduct(p)}
                          className="p-2 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-black transition border border-neutral-150 cursor-pointer shadow-sm"
                          title="Edit Product"
                        >
                          <Settings className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStoreProduct(p.id)}
                          className="p-2 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-rose-600 transition border border-neutral-150 cursor-pointer shadow-sm"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* GitHub Blueprint Synchronizer */}
          <div className="bg-white rounded-[3rem] border border-neutral-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h4 className="font-display font-black text-xs text-black uppercase tracking-widest flex items-center gap-2">
                  <Globe className="w-4 h-4 text-black animate-pulse" />
                  <span>GitHub Blueprint Repository Synchronizer</span>
                </h4>
                <p className="text-[9px] font-mono text-[#737373] uppercase tracking-wider mt-0.5">
                  Query and dynamically ingest digital catalog scripts and
                  products.json listings
                </p>
              </div>
              <span className="text-[9px] font-mono bg-[#1a1a1a] text-white px-3 py-1 rounded-full uppercase tracking-widest font-black font-mono">
                Sync Engine Ready
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={gitRepo}
                onChange={(e) => setGitRepo(e.target.value)}
                placeholder="e.g. user/repository-name"
                className="flex-1 bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 text-xs text-black focus:outline-none focus:border-black font-mono transition"
              />
              <button
                onClick={syncGitHubRepository}
                className="bg-black hover:bg-neutral-800 text-white rounded-full px-6 py-3 text-xs font-black font-mono uppercase tracking-widest transition cursor-pointer shrink-0 shadow-lg shadow-black/10"
              >
                Sync Repository Content
              </button>
            </div>

            {/* Display of synced assets lists */}
            {syncStatus === "syncing" && (
              <div className="flex items-center gap-2 text-xs text-[#737373] font-mono p-5 bg-neutral-50 border border-neutral-100 rounded-[2rem]">
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span className="uppercase tracking-widest font-black text-[10px]">
                  Establishing network handshake and scanning tree indexes...
                </span>
              </div>
            )}

            {syncStatus === "success" && gitFiles.length > 0 && (
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-mono text-black uppercase tracking-widest font-black block">
                  Discovered GitHub Resources ({gitFiles.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-80 overflow-y-auto fancy-scrollbar">
                  {repoSource === "products.json"
                    ? gitFiles.map((pf, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-neutral-50 border border-neutral-100 rounded-[2rem] flex flex-col justify-between space-y-3 text-xs"
                        >
                          <div>
                            <span className="text-[9px] font-mono text-black font-black uppercase tracking-widest bg-neutral-200 px-2.5 py-0.5 rounded-full">
                              products.json metadata
                            </span>
                            <h5 className="font-extrabold text-black mt-2 text-xs">
                              {pf.name}
                            </h5>
                            <p className="text-[10px] text-[#737373] truncate mt-1">
                              {pf.description}
                            </p>
                            <strong className="text-black block mt-2 font-mono text-xs font-black">
                              ${pf.price}
                            </strong>
                          </div>
                          <button
                            onClick={() => importProductsJsonListing(pf)}
                            className="w-full bg-black hover:bg-neutral-800 text-white text-[10px] font-mono py-2 rounded-full uppercase block cursor-pointer transition text-center font-black tracking-widest"
                          >
                            Deploy Instantly Live
                          </button>
                        </div>
                      ))
                    : gitFiles.map((gf, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-neutral-50 border border-neutral-100 rounded-[2rem] flex items-center justify-between text-xs font-mono"
                        >
                          <div className="max-w-[70%]">
                            <span
                              className="text-black block font-black truncate text-[11px]"
                              title={gf.name}
                            >
                              {gf.name}
                            </span>
                            <span className="text-[9.5px] text-[#737373] block mt-1 uppercase font-bold tracking-wider">
                              {(gf.size / 1024).toFixed(1)} KB SPEC
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              analyzeGitHubFileWithAi(gf, handleAiPopulation)
                            }
                            disabled={!!isAnalyzingFile}
                            className="bg-black hover:bg-neutral-800 text-white text-[9px] px-4 py-2.5 rounded-full uppercase cursor-pointer block transition shrink-0 font-black tracking-widest"
                          >
                            {isAnalyzingFile === gf.name
                              ? "Analyzing..."
                              : "AI Draft Spec"}
                          </button>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right block: Add product specification manually */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-[3rem] border border-neutral-100 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b border-neutral-100 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-black" />
              <h3 className="font-display font-black text-xs text-black uppercase tracking-widest">
                Ingest New Blueprint Asset
              </h3>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-5 text-xs font-mono"
            >
              <div>
                <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Telegram Lead Prospector SaaS"
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder-neutral-400 font-mono transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black font-mono transition"
                  >
                    <option value="Blueprints">Blueprints</option>
                    <option value="Micro-SaaS">Micro-SaaS</option>
                    <option value="Controller">Controller</option>
                    <option value="Scripts">Scripts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                    Price USD
                  </label>
                  <input
                    type="text"
                    required
                    name="price"
                    placeholder="29.00"
                    value={form.price}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder-neutral-400 font-mono transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                  Dynamic Asset ID / FileUrl
                </label>
                <input
                  type="text"
                  name="assetKey"
                  placeholder="telegram_prospector_code"
                  value={form.assetKey}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder-neutral-400 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                  Key Features (comma split)
                </label>
                <input
                  type="text"
                  name="features"
                  placeholder="Headless Chrome threads, Regex lead extractor"
                  value={form.features}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-black focus:outline-none focus:border-black placeholder-neutral-400 font-mono transition"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                  Brief Sales Description
                </label>
                <textarea
                  required
                  name="description"
                  placeholder="Explain the commercial value of this automation blueprint..."
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-[1.5rem] px-4 py-3 text-xs text-black focus:outline-none focus:border-black placeholder-neutral-400 leading-relaxed font-mono transition"
                />
              </div>

              <div>
                <label className="block text-[9px] text-[#737373] uppercase tracking-widest font-black mb-1.5">
                  Associated Downloadable Code Content
                </label>
                <textarea
                  name="codeContent"
                  placeholder="Paste actual compiled automation script or blueprint configuration code layout here... (This content will fetch dynamically on checkout for instant purchaser download!)"
                  value={form.codeContent}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-[2rem] px-4 py-3 text-[10.5px] text-[#1a1a1a] focus:outline-none focus:border-black placeholder-neutral-400 leading-normal font-mono transition"
                />
              </div>

              {validationError && (
                <div className="bg-neutral-50 border border-neutral-200 text-black px-4 py-3 rounded-[1.5rem] font-mono text-[10px] tracking-wider leading-relaxed">
                  ⚠ {validationError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-800 text-white font-black text-xs py-3.5 rounded-full transition uppercase flex items-center justify-center gap-1.5 cursor-pointer font-mono tracking-widest shadow-lg shadow-black/15"
              >
                <Plus className="w-4 h-4" />
                <span>Ingest Product Live</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
