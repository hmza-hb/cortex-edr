'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Lock,
    ArrowRight,
    Shield,
    User,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { checkEmail, initiateRegistration, completeRegistration, requestPasswordReset, resendVerificationCode } from '@/app/actions/auth';
import { MarketingScroller } from '@/components/ui/marketing-scroller';

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const FloatingLabelInput = ({
    label,
    type = 'text',
    value,
    onChange,
    id,
    placeholder = '',
    required = false,
    icon: Icon,
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword,
    className = ""
}: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.length > 0;

    return (
        <div className={`relative group w-full ${className}`}>
            <div className={`
                relative h-14 w-full bg-zinc-950/50 rounded-full border transition-all duration-300 flex items-center px-6
                ${isFocused ? 'border-white/40 bg-zinc-900/50 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'border-white/10'}
            `}>
                {Icon && (
                    <Icon className={`w-4 h-4 mr-4 transition-colors duration-300 ${isFocused || hasValue ? 'text-white' : 'text-zinc-500'}`} />
                )}

                <div className="relative flex-1 h-full flex items-center">
                    <motion.label
                        htmlFor={id}
                        initial={false}
                        animate={{
                            y: (isFocused || hasValue) ? -28 : 0,
                            scale: (isFocused || hasValue) ? 0.85 : 1,
                            x: (isFocused || hasValue) ? -6 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`
                            absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none font-medium transition-colors duration-300 z-50 px-3
                            ${(isFocused || hasValue)
                                ? 'text-white bg-black md:bg-[#050505] font-semibold text-xs tracking-normal'
                                : 'text-zinc-500 text-sm'}
                        `}
                    >
                        {label}
                    </motion.label>

                    <input
                        id={id}
                        type={showPassword ? 'text' : type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={isFocused ? placeholder : ""}
                        required={required}
                        className="w-full h-full bg-transparent border-none outline-none text-white text-sm placeholder:text-zinc-600"
                    />
                </div>

                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="ml-2 p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};

function AuthPageContent() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();

    const mode = searchParams ? searchParams.get('mode') : null;

    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [state, setState] = useState<'FORM' | 'VERIFY' | 'SUCCESS' | 'RECOVER'>('FORM');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Sync query parameter mode to local activeTab
    useEffect(() => {
        if (mode === 'signup') {
            setActiveTab('signup');
        } else {
            setActiveTab('signin');
        }
    }, [mode]);

    // Client-side session redirect
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    // Auto-focus OTP inputs
    useEffect(() => {
        if (state === 'VERIFY') {
            const firstInput = document.getElementById('otp-0');
            if (firstInput) firstInput.focus();
        }
    }, [state]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials. Please verify your email and password.");
            setIsLoading(false);
        } else {
            setState('SUCCESS');
            setTimeout(() => router.push('/dashboard'), 1500);
        }
    };

    const handleInitiateSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // First verify if email already exists
            const { exists } = await checkEmail(email);
            if (exists) {
                setError("An account with this email already exists. Please Sign In instead.");
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('email', email);
            formData.append('name', name);
            formData.append('password', password);

            const result = await initiateRegistration(formData);

            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                setState('VERIFY');
                setIsLoading(false);
            }
        } catch (err) {
            setError("Failed to initialize registration. Please try again.");
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (codeString?: string) => {
        const verificationCode = codeString || otp.join('');
        if (verificationCode.length !== 6) return;

        setIsLoading(true);
        setError(null);

        const result = await completeRegistration(email, verificationCode, { name, password });

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            // Success! Now sign in
            const loginResult = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (loginResult?.error) {
                setError("Account created successfully, but auto sign-in failed. Please sign in manually.");
                setState('FORM');
                setActiveTab('signin');
                setIsLoading(false);
            } else {
                setState('SUCCESS');
                setTimeout(() => router.push('/dashboard'), 1500);
            }
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }

        if (newOtp.every(digit => digit !== '') && newOtp.length === 6) {
            handleVerifyOtp(newOtp.join(''));
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;

        setIsLoading(true);
        const result = await resendVerificationCode(email);

        if (result.error) {
            setError(result.error);
        } else {
            setResendCooldown(60); // 1 minute cooldown
            const timer = setInterval(() => {
                setResendCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        setIsLoading(false);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const result = await requestPasswordReset(email);

        if (result.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            setState('VERIFY'); // Reuse verification state for reset too
            setIsLoading(false);
        }
    };

    const handleSocialSignIn = (provider: string) => {
        // Use absolute URL to ensure the redirect lands on the correct domain (app.cortex-edr.com),
        // not the marketing site. A relative path can be misresolved if NEXTAUTH_URL ever differs.
        const callbackUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/dashboard`
            : '/dashboard';
        signIn(provider, { callbackUrl });
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-black overflow-hidden relative font-outfit">
            {/* Left Side: Cinematic Background */}
            <div className="hidden md:flex md:w-1/2 relative overflow-hidden group">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/assets/bg-hero.png')" }}
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />

                <div className="absolute bottom-16 left-16 z-20 max-w-md">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] bg-white/5 border border-white/10 overflow-hidden">
                            <Image
                                src="/assets/logo.png"
                                alt="CortexEDR"
                                width={56}
                                height={56}
                                className="h-full w-full object-cover p-2"
                                priority
                            />
                        </div>
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter text-white font-outfit uppercase">
                                CORTEX<span className="opacity-50"> </span>
                            </h2>
                            <p className="text-xs text-white/60 mt-1 font-medium">Codebase Defense Platform</p>
                        </div>
                    </div>
                    <div className="w-full text-left">
                        <MarketingScroller className="!justify-start !text-left !h-auto !p-0" />
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Center */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative z-10 md:bg-[#050505] border-l border-white/5">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none" />

                <a
                    href="https://cortex-edr.com"
                    className="absolute left-8 top-8 text-xs font-semibold text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 group z-50 p-2"
                >
                    <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    Back
                </a>

                <div className="w-full max-w-[400px] relative z-20">
                    <AnimatePresence mode="wait">
                        {state === 'FORM' && (
                            <motion.div
                                key="auth-form"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2 text-center">
                                    <h1 className="text-3xl font-bold tracking-tight text-white">
                                        {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account'}
                                    </h1>
                                    <p className="text-zinc-400 text-sm">
                                        {activeTab === 'signin'
                                            ? 'Enter your details below to access the secure dashboard.'
                                            : 'Sign up to get started with Cortex.'}
                                    </p>
                                </div>

                                {/* Tab Selector */}
                                <div className="grid grid-cols-2 p-1 bg-zinc-950/80 border border-white/5 rounded-full mb-8">
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('signin'); setError(null); }}
                                        className={`py-2.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === 'signin' ? 'bg-white text-black shadow-md font-bold' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setActiveTab('signup'); setError(null); }}
                                        className={`py-2.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === 'signup' ? 'bg-white text-black shadow-md font-bold' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        Create Account
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {activeTab === 'signin' ? (
                                        <form onSubmit={handleSignIn} className="space-y-6">
                                            <div className="space-y-4">
                                                <FloatingLabelInput
                                                    label="Email Address"
                                                    value={email}
                                                    onChange={setEmail}
                                                    id="email"
                                                    type="email"
                                                    icon={Mail}
                                                    placeholder="name@example.com"
                                                    required
                                                />

                                                <FloatingLabelInput
                                                    label="Password"
                                                    value={password}
                                                    onChange={setPassword}
                                                    id="password"
                                                    type="password"
                                                    icon={Lock}
                                                    placeholder="Enter your password"
                                                    required
                                                    showPasswordToggle
                                                    showPassword={showPassword}
                                                    onTogglePassword={() => setShowPassword(!showPassword)}
                                                />

                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setState('RECOVER'); setError(null); }}
                                                        className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        Forgot your password?
                                                    </button>
                                                </div>
                                            </div>

                                            {error && (
                                                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs justify-center transition-all animate-in fade-in slide-in-from-top-2">
                                                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                    <p className="font-medium">{error}</p>
                                                </div>
                                            )}

                                            <button
                                                disabled={isLoading}
                                                className="w-full h-14 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
                                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleInitiateSignup} className="space-y-4">
                                            <FloatingLabelInput
                                                label="Full Name"
                                                value={name}
                                                onChange={setName}
                                                id="name"
                                                icon={User}
                                                placeholder="John Doe"
                                                required
                                            />

                                            <FloatingLabelInput
                                                label="Email Address"
                                                value={email}
                                                onChange={setEmail}
                                                id="signup-email"
                                                type="email"
                                                icon={Mail}
                                                placeholder="name@example.com"
                                                required
                                            />

                                            <FloatingLabelInput
                                                label="Password"
                                                value={password}
                                                onChange={setPassword}
                                                id="signup-password"
                                                type="password"
                                                icon={Lock}
                                                placeholder="Enter password (min. 8 characters)"
                                                required
                                                showPasswordToggle
                                                showPassword={showPassword}
                                                onTogglePassword={() => setShowPassword(!showPassword)}
                                            />

                                            <FloatingLabelInput
                                                label="Confirm Password"
                                                value={confirmPassword}
                                                onChange={setConfirmPassword}
                                                id="confirm-password"
                                                type="password"
                                                icon={CheckCircle2}
                                                placeholder="Confirm your password"
                                                required
                                                showPasswordToggle
                                                showPassword={showPassword}
                                                onTogglePassword={() => setShowPassword(!showPassword)}
                                            />

                                            {error && (
                                                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                    <p className="font-medium">{error}</p>
                                                </div>
                                            )}

                                            <button
                                                disabled={isLoading}
                                                className="w-full h-14 bg-white text-black font-semibold rounded-full flex items-center justify-center gap-2 transition-all hover:bg-zinc-300 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_rgba(255,255,255,0.1)] mt-4"
                                            >
                                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create account'}
                                                {!isLoading && <ArrowRight className="w-5 h-5" />}
                                            </button>
                                        </form>
                                    )}

                                    <div className="relative py-4">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                                        <div className="relative flex justify-center text-xs font-medium"><span className="bg-black md:bg-[#050505] px-4 text-zinc-400">Or continue with</span></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleSocialSignIn('google')}
                                            className="flex items-center justify-center gap-3 h-14 bg-zinc-950 border border-white/10 rounded-full text-xs font-bold text-white hover:bg-zinc-900 hover:border-white/20 transition-all"
                                        >
                                            <GoogleIcon />
                                            Google
                                        </button>
                                        <button
                                            onClick={() => handleSocialSignIn('github')}
                                            className="flex items-center justify-center gap-3 h-14 bg-zinc-950 border border-white/10 rounded-full text-xs font-bold text-white hover:bg-zinc-900 hover:border-white/20 transition-all"
                                        >
                                            <GitHubIcon />
                                            Github
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* OTP VERIFICATION */}
                        {state === 'VERIFY' && (
                            <motion.div
                                key="verify"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8 text-center"
                            >
                                <div className="space-y-2">
                                    <button onClick={() => setState('FORM')} className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 mx-auto transition-colors">
                                        <ChevronLeft className="w-3.5 h-3.5" /> Back to forms
                                    </button>
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                                        <Shield className="w-10 h-10 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tighter text-white">Verify your email</h1>
                                    <p className="text-zinc-400 text-sm max-w-[280px] mx-auto">
                                        We sent a 6-digit verification code to <span className="text-white font-semibold">{email}</span>.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between gap-3 max-w-[340px] mx-auto">
                                        {otp.map((digit, idx) => (
                                            <input
                                                key={idx}
                                                id={`otp-${idx}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !digit && idx > 0) {
                                                        document.getElementById(`otp-${idx - 1}`)?.focus();
                                                    }
                                                }}
                                                className="w-12 h-16 bg-zinc-950 border border-white/10 rounded-2xl text-center text-xl font-bold text-white focus:border-white/40 focus:bg-zinc-900 outline-none transition-all shadow-[0_4px_20px_rgba(255,255,255,0.02)]"
                                            />
                                        ))}
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] justify-center transition-all animate-in fade-in slide-in-from-top-2">
                                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                            <p className="font-medium">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <button
                                            disabled={isLoading || resendCooldown > 0}
                                            onClick={() => handleResendOtp()}
                                            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors block w-full disabled:opacity-30"
                                        >
                                            {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend verification code'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* RECOVER PASSWORD */}
                        {state === 'RECOVER' && (
                            <motion.div
                                key="recover"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2 text-center">
                                    <button onClick={() => setState('FORM')} className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 mx-auto transition-colors">
                                        <ChevronLeft className="w-3.5 h-3.5" /> Back to sign in
                                    </button>
                                    <h1 className="text-3xl font-bold tracking-tighter text-white">Reset password</h1>
                                    <p className="text-zinc-400 text-sm">Enter your email address below to receive a password reset link.</p>
                                </div>

                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div className="space-y-4">
                                        <FloatingLabelInput
                                            label="Email Address"
                                            value={email}
                                            onChange={setEmail}
                                            id="recover-email"
                                            type="email"
                                            icon={Mail}
                                            placeholder="Enter your email"
                                            required
                                        />

                                        {error && (
                                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-[11px] justify-center transition-all animate-in fade-in slide-in-from-top-2">
                                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                                <p className="font-medium">{error}</p>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        disabled={isLoading}
                                        className="w-full h-14 bg-white text-black font-bold rounded-full flex items-center justify-center gap-2 transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send reset link'}
                                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* SUCCESS */}
                        {state === 'SUCCESS' && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8"
                            >
                                <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter text-white">Welcome to Cortex</h1>
                                    <p className="text-zinc-400 text-sm">Verification successful. Redirecting you to the dashboard...</p>
                                </div>
                                <div className="pt-8">
                                    <div className="flex items-center justify-center gap-2 text-xs font-medium text-zinc-400">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Loading your dashboard...
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-8 text-center text-xs text-zinc-300 opacity-60 select-none hidden md:block">
                    © {new Date().getFullYear()} Cortex. All rights reserved.
                </div>
            </div>

            {/* Background Blobs for Mobile */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-800/20 blur-[120px] rounded-full pointer-events-none md:hidden"></div>
        </div>
    );
}

export default function UnifiedAuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <AuthPageContent />
        </Suspense>
    );
}
