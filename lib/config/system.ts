export enum TierId {
    VIBE_CODER = 'VIBE_CODER',
    DEVELOPER = 'DEVELOPER',
    TEAMS = 'TEAMS',
    ENTERPRISE = 'ENTERPRISE'
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
    retentionHours?: number;
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
        vibe_coder: {
            primary: "gemini-2.0-flash",
            fallback: "groq-llama-3.3-70b-versatile"
        },
        developer: {
            standard: "gemini-2.0-flash",
            security: "gemini-1.5-pro",
            orchestrator: "gemini-1.5-pro"
        },
        teams: {
            standard: "gemini-2.0-flash",
            security: "claude-3-5-haiku-latest",
            architecture: "gemini-1.5-pro",
            orchestrator: "claude-3-5-sonnet-latest"
        },
        enterprise: {
            critical: "claude-3-opus-latest",
            orchestrator: "gpt-4o"
        }
    },

    // ==========================================
    // 🛡️ THE 4 ACCESS TIERS (LIMITS & PRICING)
    // ==========================================
    tiers: {
        [TierId.VIBE_CODER]: {
            id: "vibe_coder",
            name: "VIBE CODERS",
            priceMonthly: 0,
            priceAnnual: 0,
            limits: {
                maxScansPerMonth: 5,
                maxRepositories: 3,
                maxFilesPerScan: 1500, // Increased from 100
                retentionHours: 24,
                teamSeats: 1
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
        [TierId.DEVELOPER]: {
            id: "developer",
            name: "DEVELOPERS",
            priceMonthly: 9,
            priceAnnual: 90,
            limits: {
                maxScansPerMonth: 25,
                maxRepositories: 10,
                maxFilesPerScan: 10000, // Increased from 500
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
        [TierId.TEAMS]: {
            id: "teams",
            name: "TEAMS",
            priceMonthly: 49,
            priceAnnual: 490,
            limits: {
                maxScansPerMonth: 100,
                maxRepositories: 50,
                maxFilesPerScan: 50000, // Increased from 2000
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
        [TierId.ENTERPRISE]: {
            id: "enterprise",
            name: "ENTERPRISE",
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
