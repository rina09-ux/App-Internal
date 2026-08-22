import React from 'react';
import { Gem, Check, Sparkles } from 'lucide-react';
import { BillingCycle, PlanTier } from '../types';

interface BillingViewProps {
  billingCycle: BillingCycle;
  onToggleBillingCycle: (cycle: BillingCycle) => void;
  currentPlan: PlanTier;
  onUpgradePlan: (plan: PlanTier) => void;
  onOpenTryAI: () => void;
  activeAddons: { [key: string]: boolean };
  onToggleAddon: (addonId: string) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  billingCycle,
  onToggleBillingCycle,
  currentPlan,
  onUpgradePlan,
  onOpenTryAI,
  activeAddons,
  onToggleAddon,
}) => {
  const isAnnual = billingCycle === 'annually';

  const freeFeatures = [
    'Free plan features',
    '1 GB storage',
    'One workspace',
    '1:1 audio and video meetings',
    'Time tracking',
    'AI compatible',
    'Two-factor authentication',
    'Data exports for all messages',
    'SMS 2-factor authentication',
  ];

  const plusFeatures = [
    'Everything in free plan',
    'Unlimited timeline views',
    'Unlimited teams',
    'Private docs',
    'Google single sign-on (SSO)',
    'Custom workflow steps',
    'Custom user groups',
    'Premium workflows',
    'Custom templates',
  ];

  const premiumFeatures = [
    'Everything in plus plan',
    'Priority support',
    'Custom terms of service',
    'Data loss prevention',
    'Workflow builder',
    'Custom analytics data set',
    'Conditional logic in forms',
    'Custom permissions (ACL)',
    'Advanced capacity planning',
  ];

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center shadow-2xs">
              <Gem className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Billing & Plan
            </h1>
          </div>

          <button
            onClick={onOpenTryAI}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer group"
          >
            <span>Try our AI</span>
            {/* Multi-dot colorful AI icon */}
            <div className="relative w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute -top-0.5 -left-0.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute -top-0.5 -right-0.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute -bottom-0.5 -left-0.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute -bottom-0.5 -right-0.5" />
            </div>
          </button>
        </div>

        {/* Section Header & Billing Switcher */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 tracking-wider">
            <span className="text-slate-900 font-black">•</span>
            <span>CHOOSE YOUR PLANS</span>
          </div>

          <div className="flex items-center gap-2.5 select-none">
            <span
              className={`text-xs font-medium cursor-pointer transition ${
                !isAnnual ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
              onClick={() => onToggleBillingCycle('monthly')}
            >
              Monthly
            </span>

            <button
              role="switch"
              aria-checked={isAnnual}
              onClick={() =>
                onToggleBillingCycle(isAnnual ? 'monthly' : 'annually')
              }
              className={`w-10 h-5.5 rounded-full transition-colors relative p-0.5 flex items-center cursor-pointer ${
                isAnnual ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transition-transform transform ${
                  isAnnual ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-xs font-medium cursor-pointer transition ${
                isAnnual ? 'text-slate-900 font-semibold' : 'text-slate-500'
              }`}
              onClick={() => onToggleBillingCycle('annually')}
            >
              Annually
            </span>

            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-wide">
              -20%
            </span>
          </div>
        </div>

        {/* Free 2-month Trial Banner */}
        <div className="border border-slate-200/90 rounded-2xl p-4.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                Free 2-month plus trial available
              </span>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                Save 20%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Upgrade to any annually plan today and get the first 2 months free trial.
            </p>
          </div>

          <button
            onClick={() => onToggleBillingCycle('annually')}
            className="shrink-0 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-900 font-semibold text-xs hover:bg-slate-50 transition shadow-2xs cursor-pointer text-center"
          >
            Switch to annually
          </button>
        </div>

        {/* 3 Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 items-stretch">
          {/* 1. Free Card */}
          <div className="border border-slate-200/90 rounded-2xl p-5 bg-white flex flex-col justify-between shadow-2xs hover:border-slate-300 transition">
            <div>
              <div className="h-7 flex items-center">
                <h3 className="text-base font-bold text-slate-900">Free</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Everything free</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">$0</span>
                <span className="text-xs text-slate-500 font-normal">
                  / user / month
                </span>
              </div>

              <div className="mt-4">
                {currentPlan === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-xs cursor-default text-center shadow-2xs"
                  >
                    Your current plan
                  </button>
                ) : (
                  <button
                    onClick={() => onUpgradePlan('free')}
                    className="w-full py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer text-center"
                  >
                    Downgrade to Free
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {freeFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-800 font-normal leading-tight">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Plus Card */}
          <div className="border border-slate-200/90 rounded-2xl p-5 bg-white flex flex-col justify-between shadow-2xs hover:border-slate-300 transition">
            <div>
              <div className="h-7 flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Plus</h3>
                <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  Most Popular
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Everything you needed</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  ${isAnnual ? '9.60' : '12'}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  / user / month
                </span>
                {isAnnual && (
                  <span className="text-[11px] text-slate-400 line-through ml-1">
                    $12
                  </span>
                )}
              </div>

              <div className="mt-4">
                {currentPlan === 'plus' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-xs cursor-default text-center shadow-2xs"
                  >
                    Your current plan
                  </button>
                ) : (
                  <button
                    onClick={() => onUpgradePlan('plus')}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:shadow transition cursor-pointer text-center"
                  >
                    Upgrade now
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {plusFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-800 font-normal leading-tight">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Premium Card */}
          <div className="border border-slate-200/90 rounded-2xl p-5 bg-white flex flex-col justify-between shadow-2xs hover:border-slate-300 transition">
            <div>
              <div className="h-7 flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Premium</h3>
                <span className="bg-slate-100 text-slate-700 border border-slate-200/80 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                  Most Valuable
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Power team with scale</p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  ${isAnnual ? '12.80' : '16'}
                </span>
                <span className="text-xs text-slate-500 font-normal">
                  / user / month
                </span>
                {isAnnual && (
                  <span className="text-[11px] text-slate-400 line-through ml-1">
                    $16
                  </span>
                )}
              </div>

              <div className="mt-4">
                {currentPlan === 'premium' ? (
                  <button
                    disabled
                    className="w-full py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-xs cursor-default text-center shadow-2xs"
                  >
                    Your current plan
                  </button>
                ) : (
                  <button
                    onClick={() => onUpgradePlan('premium')}
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs hover:shadow transition cursor-pointer text-center"
                  >
                    Upgrade now
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {premiumFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-slate-800 font-normal leading-tight">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: ADD-ONS */}
        <div className="pt-2 space-y-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 tracking-wider">
            <span className="text-slate-900 font-black">•</span>
            <span>ADD-ONS</span>
          </div>

          {/* Addon 1: AI */}
          <div className="border border-slate-200/90 rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition">
            <div className="flex items-center gap-3.5">
              {/* Gemini / AI dots icon */}
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-0 left-1.5" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 absolute top-1.5 right-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute bottom-0 left-1.5" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 left-0" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">
                    Add AI to your paid plan for just $4
                  </h4>
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    New
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get instant answers to your questions, pull insights from hundreds of pages at once.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <span className="text-xs font-semibold text-slate-700">
                +$4 <span className="text-slate-500 font-normal">/ user / month</span>
              </span>
              <button
                onClick={() => onToggleAddon('ai')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs ${
                  activeAddons['ai']
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {activeAddons['ai'] ? 'Added ✓' : 'Add to plan'}
              </button>
            </div>
          </div>

          {/* Addon 2: Workflow Assistant */}
          <div className="border border-slate-200/90 rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-slate-300 transition">
            <div className="flex items-center gap-3.5">
              {/* Question mark / workflow logo */}
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 font-bold text-base shadow-2xs">
                ?
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Personalized workflow assistant for $2
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get instant workflow assistant, pull insights from hundreds of members.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <span className="text-xs font-semibold text-slate-700">
                +$2 <span className="text-slate-500 font-normal">/ user / month</span>
              </span>
              <button
                onClick={() => onToggleAddon('workflow')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs ${
                  activeAddons['workflow']
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {activeAddons['workflow'] ? 'Added ✓' : 'Add to plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
