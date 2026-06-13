import React from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminAuthGateProps {
  adminToken: string;
  setAdminToken: (val: string) => void;
  authError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onBackToStore: () => void;
}

export default function AdminAuthGate({
  adminToken,
  setAdminToken,
  authError,
  onSubmit,
  onBackToStore
}: AdminAuthGateProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#070707] p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
      
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white border border-neutral-100 rounded-[3rem] p-8 sm:p-12 w-full max-w-md relative z-10 shadow-2xl space-y-8 text-black"
      >
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-6 h-6 text-black" />
          </div>
          <h2 className="font-display font-black text-xl tracking-widest text-black uppercase">AetherOps Mastermind</h2>
          <p className="text-xs text-[#737373] leading-relaxed font-sans font-light">
            Enter private passkey token below to access the **AETHEROPS** secure executive ledger desk.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[9px] font-mono text-[#737373] uppercase tracking-widest font-black">
              Executive Operational Key
            </label>
            <input
              type="password"
              placeholder="Private credential key..."
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-full px-5 py-3 text-xs text-black focus:outline-none focus:border-black font-mono transition"
              id="admin-security-pass"
            />
            <span className="block text-[9px] text-[#a3a3a3] mt-1 font-mono">
              * Staging bypass allowed with an empty passcode.
            </span>
          </div>

          {authError && (
            <div className="flex items-center gap-2 text-rose-600 text-xs py-2 px-4 bg-rose-50 rounded-full border border-rose-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-[10px] font-bold">{authError}</span>
            </div>
          )}

          <button
            type="submit"
            id="admin-login-submit"
            className="w-full bg-black hover:bg-neutral-800 text-white font-black text-xs py-4 rounded-full transition tracking-widest uppercase cursor-pointer border border-transparent font-mono shadow-lg shadow-black/10"
          >
            Authenticate Console
          </button>
        </form>

        <button
          onClick={onBackToStore}
          className="w-full text-center text-xs text-[#737373] hover:text-black font-black uppercase tracking-widest font-mono cursor-pointer block hover:underline"
        >
          Return to storefront
        </button>
      </motion.div>
    </div>
  );
}
