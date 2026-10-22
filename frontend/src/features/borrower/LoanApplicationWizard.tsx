import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency, generateAmortizationSchedule, calculateEMI } from '../../utils/helpers';
import RepaymentChart from './RepaymentChart';
import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Briefcase,
  Shield,
  CheckCircle,
} from 'lucide-react';

// ── Zod Schema ──
const loanApplicationSchema = z.object({
  principalAmount: z.number().min(500, 'Minimum loan amount is $500').max(50000, 'Maximum loan is $50,000'),
  tenureMonths: z.number().refine((val) => [6, 12, 24, 36, 48].includes(val), {
    message: 'Invalid tenure period',
  }),
  purpose: z.string().min(5, 'Please specify a valid loan purpose'),
  monthlyIncome: z.number().min(1000, 'Minimum monthly income requirement: $1,000'),
  employmentStatus: z.string().min(1, 'Please select employment status'),
  acceptAlternativeDataConsent: z.boolean().refine((val) => val === true, {
    message: 'Consent required for alternative credit evaluation',
  }),
});

type LoanFormData = z.infer<typeof loanApplicationSchema>;

const steps = [
  { number: 1, label: 'Loan Details', icon: <DollarSign size={16} /> },
  { number: 2, label: 'Income', icon: <Briefcase size={16} /> },
  { number: 3, label: 'Consent', icon: <Shield size={16} /> },
  { number: 4, label: 'Review', icon: <CheckCircle size={16} /> },
];

const LoanApplicationWizard: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      principalAmount: 5000,
      tenureMonths: 12,
      purpose: '',
      monthlyIncome: 4500,
      employmentStatus: '',
      acceptAlternativeDataConsent: false,
    },
  });

  const watchedValues = watch();
  const estimatedRate = 8.5; // Will come from credit scoring API
  const emi = calculateEMI(watchedValues.principalAmount, estimatedRate, watchedValues.tenureMonths);
  const schedule = generateAmortizationSchedule(watchedValues.principalAmount, estimatedRate, watchedValues.tenureMonths);

  const nextStep = async () => {
    let fieldsToValidate: (keyof LoanFormData)[] = [];
    if (currentStep === 1) fieldsToValidate = ['principalAmount', 'tenureMonths', 'purpose'];
    if (currentStep === 2) fieldsToValidate = ['monthlyIncome', 'employmentStatus'];
    if (currentStep === 3) fieldsToValidate = ['acceptAlternativeDataConsent'];

    const valid = await trigger(fieldsToValidate);
    if (valid && currentStep < 4) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const onSubmit = async (_data: LoanFormData) => {
    setIsSubmitting(true);
    // TODO: Call loanService.createLoan(data) when backend is ready
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/loans');
    }, 2000);
  };

  const tenureOptions = [6, 12, 24, 36, 48];
  const purposeOptions = [
    'Debt Consolidation',
    'Home Improvement',
    'Medical Expenses',
    'Education',
    'Business',
    'Auto',
    'Other',
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>Apply for a Loan</h1>
        <p>Complete the steps below to submit your application</p>
      </div>

      {/* Wizard Stepper */}
      <div className="wizard-stepper">
        {steps.map((step, idx) => (
          <React.Fragment key={step.number}>
            <div className={`wizard-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="wizard-step-number">
                {currentStep > step.number ? <CheckCircle size={16} /> : step.number}
              </div>
              <span className="wizard-step-label">{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`wizard-connector ${currentStep > step.number ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card" style={{ minHeight: 400 }}>
          {/* Step 1: Loan Details */}
          {currentStep === 1 && (
            <div className="animate-slide-up">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                Loan Details
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="loan-amount">
                  Loan Amount
                </label>
                <input
                  id="loan-amount"
                  type="number"
                  className={`form-input ${errors.principalAmount ? 'error' : ''}`}
                  placeholder="5000"
                  {...register('principalAmount', { valueAsNumber: true })}
                />
                {errors.principalAmount && (
                  <div className="form-error">{errors.principalAmount.message}</div>
                )}
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  {[1000, 5000, 10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setValue('principalAmount', amt)}
                      style={{
                        border: watchedValues.principalAmount === amt ? '1px solid var(--color-accent)' : 'var(--border-subtle)',
                      }}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Loan Tenure</label>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {tenureOptions.map((months) => (
                    <button
                      key={months}
                      type="button"
                      className={`btn ${watchedValues.tenureMonths === months ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setValue('tenureMonths', months)}
                      style={{ flex: 1 }}
                    >
                      <Calendar size={14} /> {months}mo
                    </button>
                  ))}
                </div>
                {errors.tenureMonths && (
                  <div className="form-error">{errors.tenureMonths.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="loan-purpose">Loan Purpose</label>
                <select
                  id="loan-purpose"
                  className="form-input form-select"
                  {...register('purpose')}
                >
                  <option value="">Select purpose...</option>
                  {purposeOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {errors.purpose && <div className="form-error">{errors.purpose.message}</div>}
              </div>

              {/* Estimated EMI Preview */}
              <div
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-accent-muted)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  marginTop: 'var(--space-4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Estimated Monthly EMI</div>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-accent-hover)' }}>
                      {formatCurrency(emi)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Estimated Rate</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>{estimatedRate}% APR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Income & Employment */}
          {currentStep === 2 && (
            <div className="animate-slide-up">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                Income & Employment
              </h3>

              <div className="form-group">
                <label className="form-label" htmlFor="monthly-income">Monthly Income (USD)</label>
                <input
                  id="monthly-income"
                  type="number"
                  className={`form-input ${errors.monthlyIncome ? 'error' : ''}`}
                  placeholder="4500"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                />
                {errors.monthlyIncome && (
                  <div className="form-error">{errors.monthlyIncome.message}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="employment-status">Employment Status</label>
                <select
                  id="employment-status"
                  className={`form-input form-select ${errors.employmentStatus ? 'error' : ''}`}
                  {...register('employmentStatus')}
                >
                  <option value="">Select status...</option>
                  <option value="full-time">Full-Time Employed</option>
                  <option value="part-time">Part-Time Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="retired">Retired</option>
                </select>
                {errors.employmentStatus && (
                  <div className="form-error">{errors.employmentStatus.message}</div>
                )}
              </div>

              {/* Debt-to-Income Preview */}
              <div
                style={{
                  padding: 'var(--space-4)',
                  background: 'var(--color-surface-glass)',
                  borderRadius: 'var(--radius-lg)',
                  border: 'var(--border-subtle)',
                  marginTop: 'var(--space-4)',
                }}
              >
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  Debt-to-Income Ratio
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="progress-bar" style={{ flex: 1 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, (emi / (watchedValues.monthlyIncome || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                    {((emi / (watchedValues.monthlyIncome || 1)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                  {(emi / (watchedValues.monthlyIncome || 1)) * 100 < 30
                    ? '✅ Healthy ratio — below 30%'
                    : '⚠️ High ratio — may affect approval'}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Consent */}
          {currentStep === 3 && (
            <div className="animate-slide-up">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                Data Consent & Verification
              </h3>

              <div
                style={{
                  padding: 'var(--space-6)',
                  background: 'var(--color-surface-glass)',
                  borderRadius: 'var(--radius-lg)',
                  border: 'var(--border-subtle)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
                  Alternative Data Consent
                </h4>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.7 }}>
                  To provide you with the best possible rate, we use alternative data sources
                  alongside traditional credit bureau data. This may include utility payment history,
                  telecom records, and bank transaction patterns. This data helps us offer fairer
                  rates, especially if you have limited credit history.
                </p>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-3)',
                    cursor: 'pointer',
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    background: watchedValues.acceptAlternativeDataConsent
                      ? 'var(--color-success-muted)'
                      : 'transparent',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <input
                    type="checkbox"
                    {...register('acceptAlternativeDataConsent')}
                    style={{
                      width: 20,
                      height: 20,
                      marginTop: 2,
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                    I consent to the use of alternative data sources for my credit evaluation.
                    I understand this data will be used solely for credit assessment and handled
                    in compliance with GDPR and FCRA regulations.
                  </span>
                </label>
                {errors.acceptAlternativeDataConsent && (
                  <div className="form-error" style={{ marginTop: 'var(--space-2)' }}>
                    {errors.acceptAlternativeDataConsent.message}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-slide-up">
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-6)' }}>
                Review Your Application
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {[
                  { label: 'Loan Amount', value: formatCurrency(watchedValues.principalAmount) },
                  { label: 'Tenure', value: `${watchedValues.tenureMonths} months` },
                  { label: 'Purpose', value: watchedValues.purpose },
                  { label: 'Monthly Income', value: formatCurrency(watchedValues.monthlyIncome) },
                  { label: 'Employment', value: watchedValues.employmentStatus },
                  { label: 'Estimated EMI', value: formatCurrency(emi) },
                ].map((item) => (
                  <div key={item.label} style={{ padding: 'var(--space-3)', background: 'var(--color-surface-glass)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{item.label}</div>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginTop: 'var(--space-1)' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Amortization Preview */}
              <RepaymentChart data={schedule} />
            </div>
          )}

          {/* Navigation Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-8)',
              paddingTop: 'var(--space-6)',
              borderTop: 'var(--border-subtle)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft size={16} /> Previous
            </button>

            {currentStep < 4 ? (
              <button type="button" className="btn btn-primary" onClick={nextStep}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success btn-lg animate-pulse-glow"
                disabled={isSubmitting}
                id="submit-loan-btn"
              >
                {isSubmitting ? <span className="spinner" /> : <>Submit Application <CheckCircle size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationWizard;
