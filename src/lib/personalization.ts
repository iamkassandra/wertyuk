/**
 * AETHEROPS CUSTOMER SEGMENTATION & PERSONALIZATION ENGINE
 * ---------------------------------------------------------
 * Tracks active browser behavior, scores product interests, 
 * computes customer alignment segments, and provisions tailored UI modifications.
 */

export type SegmentId = "enterprise" | "social" | "cfo" | "value" | "general";

export interface SegmentBanner {
  title: string;
  description: string;
  badgeText: string;
  discountCode: string;
  discountPercent: number;
}

export interface SegmentDetail {
  id: SegmentId;
  label: string;
  subLabel: string;
  description: string;
  badge: string;
  pitch: string;
  banner: SegmentBanner;
  reorderedProductIds: string[];
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  action: string;
  itemCategory?: string;
  description: string;
}

export interface CustomerProfile {
  name: string;
  company: string;
  segmentId: SegmentId;
  totalSpent: number;
  lastActive: string;
  activityHistory: string[];
  loyaltyTier: "Elite Mastermind" | "Series-A Sovereign" | "Confidential Operator" | "Incubator Pioneer";
}

// 1. Immutable Definition Set of tailored personalization assets
export const SEGMENT_PROFILES: Record<SegmentId, SegmentDetail> = {
  enterprise: {
    id: "enterprise",
    label: "Enterprise Engineering Director",
    subLabel: "Mission-Critical Systems & Secure Delivery",
    description: "Focused on bulletproof defensive engineering, code completeness, secure pipelines, and compliance scorecard templates. High pricing tolerance.",
    badge: "Systems Architect",
    pitch: "Apply Rigorous Security & Build-Guardrail Protocols to Large Scale Workspace Workflows.",
    banner: {
      title: "Commercial Studio License Recommended",
      description: "Secure automated handovers with the SHIPSAFE Commercial edition, including reselling rights, editable template directories, and findings registers.",
      badgeText: "20% Corp License",
      discountCode: "CORP_SCALE_20",
      discountPercent: 20
    },
    reorderedProductIds: ["asset_commercial", "asset_solo"]
  },
  social: {
    id: "social",
    label: "Consultant & Agency Specialist",
    subLabel: "Fast Delivery Client Handover & Commercial Licensing",
    description: "Driven by fast-turn workflows, reusable client-facing templates, professional release records, and priority systems.",
    badge: "Vanguard Consultant",
    pitch: "Exceed Client Handover Standards with Premium Reusable Evaluation Materials.",
    banner: {
      title: "Agency Commercial Grant Active",
      description: "Equip your studio with commercial project resale parameters. Use this verified token to secure your copy under budget.",
      badgeText: "15% Speed License",
      discountCode: "BOOST_VIRAL_15",
      discountPercent: 15
    },
    reorderedProductIds: ["asset_commercial", "asset_solo"]
  },
  cfo: {
    id: "cfo",
    label: "Venture-Backed Product Builder",
    subLabel: "Launch Control & Technical Due Diligence",
    description: "Deeply values systematic due diligence, pre-flight checklists, investor-ready report structures, and risk mitigation profiles.",
    badge: "Technical Founder",
    pitch: "Mitigate Early Technical Release Risk with the 68-Control Scorecard Framework.",
    banner: {
      title: "Launch Readiness Audit Pack Unlocked",
      description: "Instantly audit software code integrity before push. Establish permanent AGENTS.md rulesets to bypass developer failure paths.",
      badgeText: "10% Treasury Bonus",
      discountCode: "CFO_TELEMETRY_10",
      discountPercent: 10
    },
    reorderedProductIds: ["asset_solo", "asset_commercial"]
  },
  value: {
    id: "value",
    label: "Solo Indie Hacker",
    subLabel: "Rapid Safe Deployments & Budget Safeguards",
    description: "Responds strongly to direct value statements, robust single-builder rigs, and affordable launcher tools.",
    badge: "Indie Craftsman",
    pitch: "High-Fidelity Project Guardrails to Secure Single-Builder Application Rigs.",
    banner: {
      title: "Indie Developer Grant Assigned",
      description: "Special community developer discount active. Secure the complete SHIPSAFE Solo framework with zero fiscal friction.",
      badgeText: "12% Arbitrage Special",
      discountCode: "VALUE_ARBITRAGE_12",
      discountPercent: 12
    },
    reorderedProductIds: ["asset_solo", "asset_commercial"]
  },
  general: {
    id: "general",
    label: "Standard Safe Technology Builder",
    subLabel: "Secure Launch Checklists & AI Guardrails",
    description: "Exploring standard security layouts. Aims to eliminate critical code-breaking errors and deploy into production safely.",
    badge: "Safe Builder",
    pitch: "Eliminate Code-Breaking Errors and Launch in Production with Absolute Confidence.",
    banner: {
      title: "Founding Builder Discount Code",
      description: "Pre-authorized credentials granted: utilize secure founding coupons for immediate framework dispatches.",
      badgeText: "10% Standard Entry",
      discountCode: "AETHER10",
      discountPercent: 10
    },
    reorderedProductIds: ["asset_solo", "asset_commercial"]
  }
};

// 2. Simulated Historic Customer Database for interactive analytics
export const SIMULATED_PROFILES: CustomerProfile[] = [
  {
    name: "Alexander Vance",
    company: "ScaleOps Labs",
    segmentId: "enterprise",
    totalSpent: 1245.00,
    loyaltyTier: "Elite Mastermind",
    lastActive: "Active 4m ago",
    activityHistory: ["Queried Puppeteer outbound parameters", "Viewed Account Prospector 3 times", "Added Prospector to cart"]
  },
  {
    name: "Clarissa Cho",
    company: "BubbleMedia Group",
    segmentId: "social",
    totalSpent: 489.00,
    loyaltyTier: "Confidential Operator",
    lastActive: "Active 18m ago",
    activityHistory: ["Triggered Express Social Webhook demo", "Inquired about X (Twitter) payload HMAC signatures", "Applied discount 'AETHER10'"]
  },
  {
    name: "Devon Miller",
    company: "Frontier Treasury",
    segmentId: "cfo",
    totalSpent: 1890.00,
    loyaltyTier: "Series-A Sovereign",
    lastActive: "Active 1h ago",
    activityHistory: ["Generated custom CFO layout chart", "Inspected local ledger database snapshots", "Downloaded Cashflow forecaster script"]
  },
  {
    name: "Siddharth J.",
    company: "SoloBootstraps",
    segmentId: "value",
    totalSpent: 89.00,
    loyaltyTier: "Incubator Pioneer",
    lastActive: "Active 2h ago",
    activityHistory: ["Searched for discount coupons in chat", "Compared prices across blueprints", "Claimed arbitrage coupon code"]
  },
  {
    name: "Elena Rostova",
    company: "Aetheria Venture Cohort",
    segmentId: "general",
    totalSpent: 29.00,
    loyaltyTier: "Incubator Pioneer",
    lastActive: "Active 3h ago",
    activityHistory: ["Arrived via referral link", "Inspected the index vault menu", "Initiated conversation with Aetheria AI"]
  }
];

// Helper to trigger custom window event for real-time React synchronization
const notifyPersonalizationChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aether_personalization_update"));
  }
};

/**
 * Capture interaction hits and increment corresponding segment scores
 */
export function trackUserBehavior(action: string, category: string, detail: string) {
  if (typeof window === "undefined") return;

  try {
    // 1. Append Log
    const logs: VisitorLog[] = JSON.parse(localStorage.getItem("aether_behavioral_logs") || "[]");
    const newLog: VisitorLog = {
      id: "log_" + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      action,
      itemCategory: category,
      description: detail
    };
    logs.unshift(newLog); // Prepend so latest is first
    localStorage.setItem("aether_behavioral_logs", JSON.stringify(logs.slice(0, 100))); // Cap at 100

    // 2. Increment Interest Score
    const scores: Record<string, number> = JSON.parse(
      localStorage.getItem("aether_interest_scores") || '{"enterprise":0,"social":0,"cfo":0,"value":0}'
    );

    const normCategory = category.toLowerCase();
    const normDetail = detail.toLowerCase();

    // Map keywords to scores
    if (normCategory.includes("blueprint") || normCategory.includes("prospector") || normDetail.includes("automation") || normDetail.includes("puppeteer") || normDetail.includes("outbound") || normDetail.includes("lead")) {
      scores.enterprise = (scores.enterprise || 0) + 1.5;
    }
    if (normCategory.includes("microsaas") || normCategory.includes("saas") || normCategory.includes("webhook") || normDetail.includes("webhook") || normDetail.includes("social") || normDetail.includes("tweet") || normDetail.includes("hmac")) {
      scores.social = (scores.social || 0) + 1.5;
    }
    if (normCategory.includes("controller") || normCategory.includes("cfo") || normDetail.includes("cfo") || normDetail.includes("ledger") || normDetail.includes("cashflow") || normDetail.includes("metrics") || normDetail.includes("treasury")) {
      scores.cfo = (scores.cfo || 0) + 1.5;
    }
    if (normDetail.includes("coupon") || normDetail.includes("discount") || normDetail.includes("deal") || normDetail.includes("cheap") || normDetail.includes("price") || normDetail.includes("arbitrage")) {
      scores.value = (scores.value || 0) + 2.0; // Higher weight for monetary seeking
    }

    localStorage.setItem("aether_interest_scores", JSON.stringify(scores));
    notifyPersonalizationChange();
  } catch (error) {
    console.warn("Segmentation engine tracking error:", error);
  }
}

/**
 * Returns the currently active Segment, applying admin overrides or calculating current scores
 */
export function getActiveSegmentation(): {
  segment: SegmentDetail;
  scores: Record<SegmentId, number>;
  confidence: number;
  reasons: string[];
  isOverridden: boolean;
} {
  const defaultScores = { enterprise: 0, social: 0, cfo: 0, value: 0, general: 0 };
  if (typeof window === "undefined") {
    return { segment: SEGMENT_PROFILES.general, scores: defaultScores, confidence: 100, reasons: ["Server default"], isOverridden: false };
  }

  try {
    // 1. Check Admin Override
    const override = localStorage.getItem("aether_segment_override");
    if (override && SEGMENT_PROFILES[override as SegmentId]) {
      const targetId = override as SegmentId;
      return {
        segment: SEGMENT_PROFILES[targetId],
        scores: defaultScores,
        confidence: 100,
        reasons: [`Admin Manual Override: ${SEGMENT_PROFILES[targetId].label}`],
        isOverridden: true
      };
    }

    // 2. Fetch scores and logs
    const scores: Record<string, number> = JSON.parse(
      localStorage.getItem("aether_interest_scores") || '{"enterprise":0,"social":0,"cfo":0,"value":0}'
    );
    const logs: VisitorLog[] = JSON.parse(localStorage.getItem("aether_behavioral_logs") || "[]");

    // Start scanning scores
    let highestScore = 0;
    let selectedId: SegmentId = "general";

    const keys: SegmentId[] = ["enterprise", "social", "cfo", "value"];
    for (const key of keys) {
      const sc = scores[key] || 0;
      if (sc > highestScore && sc >= 1.0) {
        highestScore = sc;
        selectedId = key;
      }
    }

    // Compute logs and build reasons list
    const reasons: string[] = [];
    if (highestScore > 0 && selectedId !== "general") {
      reasons.push(`Accumulated strong affinity score (${highestScore.toFixed(1)}) via matching triggers.`);
      const categoryHits = logs.filter(l => l.itemCategory?.toLowerCase() === selectedId || l.action.toLowerCase() === selectedId);
      if (categoryHits.length > 0) {
        const activeBadge = SEGMENT_PROFILES[selectedId]?.badge || "Architect";
        reasons.push(`Logged ${categoryHits.length} explicit activities under ${activeBadge}.`);
      }
    } else {
      reasons.push("Casual vault exploration. Displaying multi-purpose technical blueprints.");
    }

    // Confidence mapping
    let confidence = 0;
    if (highestScore === 0) {
      confidence = 100; // 100% sure it's default explorer
    } else {
      const sum = Object.values(scores).reduce((a, b) => a + b, 0);
      confidence = Math.min(100, Math.round((highestScore / (sum || 1)) * 100));
    }

    return {
      segment: SEGMENT_PROFILES[selectedId],
      scores: {
        enterprise: scores.enterprise || 0,
        social: scores.social || 0,
        cfo: scores.cfo || 0,
        value: scores.value || 0,
        general: selectedId === "general" ? 1 : 0
      },
      confidence,
      reasons,
      isOverridden: false
    };
  } catch (e) {
    return { segment: SEGMENT_PROFILES.general, scores: defaultScores, confidence: 100, reasons: ["System recovery fallback"], isOverridden: false };
  }
}

/**
 * Set a manual segment override for simulation and testing
 */
export function setSegmentOverride(overrideId: SegmentId | "none") {
  if (typeof window === "undefined") return;
  if (overrideId === "none") {
    localStorage.removeItem("aether_segment_override");
  } else {
    localStorage.setItem("aether_segment_override", overrideId);
  }
  notifyPersonalizationChange();
}

/**
 * Fully reset computed scoring and custom visitor historylogs
 */
export function clearVisitorSegmentation() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("aether_behavioral_logs");
  localStorage.removeItem("aether_interest_scores");
  localStorage.removeItem("aether_segment_override");
  notifyPersonalizationChange();
}
