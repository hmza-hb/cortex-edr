export enum TierId {
    SCOUT = 'SCOUT',
    SENTINEL = 'SENTINEL',
    GUARDIAN = 'GUARDIAN',
    FORTRESS = 'FORTRESS'
}

export interface TierFeatures {
    watermarkedPdf: boolean;
    aiPromptType: string;
    prioritySupport: boolean;
    apiAccess: boolean;
    detailedExplanations: boolean;
    fixSuggestions: boolean;
    executionReadyPrompts: boolean;
    apiCallsPerMonth?: number | "Unlimited";
}

export interface TierLimits {
    maxScansPerMonth: number | "Unlimited";
    maxRepositories: number | "Unlimited";
    maxFilesPerScan: number | "Unlimited";
    retentionHours?: number | "Unlimited";
    retentionDays?: number | "Unlimited";
    teamSeats: number | "Unlimited";
}

export interface TierConfig {
    id: string;
    name: string;
    priceMonthly: number;
    priceAnnual: number;
    limits: TierLimits;
    features: TierFeatures;
}

export const SYSTEM_CONFIG: {
    ai: any;
    tiers: Record<TierId, TierConfig>;
    promotions: any;
} = {
    // ==========================================
    // 🧠 AI MODEL ROUTING BY TIER
    // ==========================================
    ai: {
        scout: {
            primary: "gpt-4o-mini",
            fallback: "gpt-4o"
        },
        sentinel: {
            standard: "gpt-4o-mini",
            security: "gpt-4o",
            orchestrator: "gpt-4o"
        },
        guardian: {
            standard: "gpt-4o",
            security: "gpt-4o",
            architecture: "gpt-4o",
            orchestrator: "gpt-4o"
        },
        fortress: {
            critical: "gpt-4o",
            orchestrator: "gpt-4o"
        }
    },

    // ==========================================
    // 🛡️ THE 4 ACCESS TIERS (LIMITS & PRICING)
    // ==========================================
    tiers: {
        [TierId.SCOUT]: {
            id: "scout",
            name: "SCOUT",
            priceMonthly: 0,
            priceAnnual: 0,
            limits: {
                maxScansPerMonth: 20,
                maxRepositories: "Unlimited",
                maxFilesPerScan: "Unlimited", 
                retentionHours: "Unlimited",
                teamSeats: "Unlimited"
            },
            features: {
                watermarkedPdf: true,
                aiPromptType: "basic",
                prioritySupport: false,
                apiAccess: false,
                detailedExplanations: true,
                fixSuggestions: false,
                executionReadyPrompts: false
            }
        },
        [TierId.SENTINEL]: {
            id: "sentinel",
            name: "SENTINEL",
            priceMonthly: 9,
            priceAnnual: 90,
            limits: {
                maxScansPerMonth: 15,
                maxRepositories: 5,
                maxFilesPerScan: 1000, // Increased from 500
                retentionDays: 30,
                teamSeats: 1
            },
            features: {
                watermarkedPdf: false,
                aiPromptType: "advanced",
                prioritySupport: false,
                apiAccess: false,
                detailedExplanations: true,
                fixSuggestions: true,
                executionReadyPrompts: false
            }
        },
        [TierId.GUARDIAN]: {
            id: "guardian",
            name: "GUARDIAN",
            priceMonthly: 49,
            priceAnnual: 490,
            limits: {
                maxScansPerMonth: 50,
                maxRepositories: 15,
                maxFilesPerScan: 5000, // Increased from 2000
                retentionDays: 90,
                teamSeats: 5
            },
            features: {
                watermarkedPdf: false,
                aiPromptType: "premium",
                prioritySupport: true,
                apiAccess: true,
                detailedExplanations: true,
                fixSuggestions: true,
                executionReadyPrompts: true,
                apiCallsPerMonth: 1000
            }
        },
        [TierId.FORTRESS]: {
            id: "fortress",
            name: "FORTRESS",
            priceMonthly: 299,
            priceAnnual: 2990,
            limits: {
                maxScansPerMonth: 500,
                maxRepositories: "Unlimited",
                maxFilesPerScan: "Unlimited",
                retentionDays: "Unlimited",
                teamSeats: "Unlimited"
            },
            features: {
                watermarkedPdf: false,
                aiPromptType: "ultra-premium",
                prioritySupport: true,
                apiAccess: true,
                detailedExplanations: true,
                fixSuggestions: true,
                executionReadyPrompts: true,
                apiCallsPerMonth: "Unlimited"
            }
        }
    },

    // ==========================================
    // 🎁 PROMOTIONS & EQUITABLE DISCOUNTS
    // ==========================================
    promotions: {
        founders: {
            developerPrice: 4.50,
            teamsPrice: 24.50,
        },
        students: {
            verificationRequired: "edu_email_or_id",
            developerPrice: 3.00,
            teamsPrice: 15.00,
        },
        emergingEconomies: {
            verificationRequired: "geo_ip_or_billing",
            discountPercentage: 50
        },
        womenInTech: {
            verificationRequired: "manual_verification",
            discountPercentage: 5
        },
        referral: {
            creditAmount: 4.50,
            rewardAmount: "1_month_free"
        }
    }
};
