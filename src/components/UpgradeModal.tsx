import React, { useState } from 'react';
import { X, Check, ShieldCheck, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { BillingCycle, PlanTier } from '../types';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlan: PlanTier;
  billingCycle: BillingCycle;
  activeAddons: { [key: string]: boolean };
  onConfirmUpgrade: (plan: PlanTier, seats: number, cycle: BillingCycle) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  targetPlan,
  billingCycle,
  activeAddons,
  onConfirmUpgrade,
}) => {
  const [seats, setSeats] = useState<number>(5);
  const [cycle, setCycle] = useState<BillingCycle>(billingCycle);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const isPlus = targetPlan === 'plus';
  const planName = targetPlan === 'premium' ? 'Premium' : targetPlan === 'plus' ? 'Plus' : 'Free';
  const baseMonthlyPrice = targetPlan === 'premium' ? 16 : targetPlan === 'plus' ? 12 : 0;
  const unitPrice = cycle === 'annually' ? baseMonthlyPrice * 0.8 : baseMonthlyPrice;

  const aiAddonPrice = activeAddons['ai'] ? 4 : 0;
  const workflowAddonPrice = activeAddons['workflow'] ? 2 : 0;
  const totalPerUser = unitPrice + aiAddonPrice + workflowAddonPrice;
  const monthlyTotal = totalPerUser * seats;
  const billedAmount = cycle === 'annually' ? monthlyTotal * 12 : monthlyTotal;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmUpgrade(targetPlan, seats, cycle);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              ★
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Upgrade to {planName} Plan
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Billing Cycle Switch */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900">Billing Cadence</div>
              <div className="text-[11px] text-slate-500">
                {cycle === 'annually' ? 'Includes 2 months free (Save 20%)' : 'Billed month-to-month'}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setCycle('monthly')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer ${
                  cycle === 'monthly' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setCycle('annually')}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition cursor-pointer flex items-center gap-1 ${
                  cycle === 'annually' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual</span>
                <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-bold">-20%</span>
              </button>
            </div>
          </div>

          {/* Seat Counter */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Team Seats</div>
              <div className="text-[11px] text-slate-500">Number of active workspace members</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSeats((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 text-sm cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-slate-900">{seats}</span>
              <button
                onClick={() => setSeats((prev) => prev + 1)}
                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 text-sm cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>{planName} Plan ({seats} seats × ${unitPrice.toFixed(2)}/mo)</span>
              <span className="font-semibold text-slate-900">${(unitPrice * seats).toFixed(2)}/mo</span>
            </div>

            {activeAddons['ai'] && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  AI Intelligence Add-on ({seats} seats × $4/mo)
                </span>
                <span className="font-semibold text-slate-900">${(4 * seats).toFixed(2)}/mo</span>
              </div>
            )}

            {activeAddons['workflow'] && (
              <div className="flex items-center justify-between text-slate-600">
                <span>Workflow Assistant ({seats} seats × $2/mo)</span>
                <span className="font-semibold text-slate-900">${(2 * seats).toFixed(2)}/mo</span>
              </div>
            )}

            <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-900">
              <span>
                {cycle === 'annually' ? 'Total Due Today (1 Year)' : 'Total Due Today'}
              </span>
              <span className="text-blue-600">
                ${billedAmount.toFixed(2)}
                <span className="text-[11px] font-normal text-slate-500 ml-1">
                  {cycle === 'annually' ? '/ yr' : '/ mo'}
                </span>
              </span>
            </div>
          </div>

          {/* Security Guarantee Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted checkout. Cancel or change plan anytime from settings.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isProcessing ? (
              <span>Updating plan...</span>
            ) : (
              <>
                <span>Confirm & Upgrade</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
