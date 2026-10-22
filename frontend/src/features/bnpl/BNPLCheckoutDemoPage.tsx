import React, { useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
  ShoppingBag,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Clock,
  Code,
  ArrowRight,
  Package,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
}

const mockCart: CartItem[] = [
  {
    id: 'prod_1',
    name: 'Apex Studio Pro Wireless ANC Headphones',
    category: 'Spatial Audio • Hi-Res 96kHz',
    price: 199.99,
    quantity: 1,
    image: '🎧',
  },
  {
    id: 'prod_2',
    name: 'UltraWide 34" Curved OLED Creator Display',
    category: '144Hz • HDR1000 • USB-C Hub',
    price: 349.99,
    quantity: 1,
    image: '🖥️',
  },
];

type BNPLPlanType = 'PAY_IN_4' | 'PAY_IN_6' | 'PAY_IN_12';

const BNPLCheckoutDemoPage: React.FC = () => {
  const [cart] = useState<CartItem[]>(mockCart);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'CARD' | 'BNPL'>('BNPL');
  const [selectedPlan, setSelectedPlan] = useState<BNPLPlanType>('PAY_IN_4');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const [activeTab, setActiveTab] = useState<'CHECKOUT' | 'SDK_DOCS'>('CHECKOUT');

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0.00; // Free express shipping
  const salesTax = Math.round(subtotal * 0.0825 * 100) / 100;
  const total = Math.round((subtotal + shipping + salesTax) * 100) / 100;

  // BNPL Plan Calculations
  const plans = {
    PAY_IN_4: {
      name: 'Pay in 4 (Bi-weekly)',
      installments: 4,
      amountPerInstallment: Math.round((total / 4) * 100) / 100,
      apr: 0,
      period: 'every 2 weeks',
      schedule: [
        { label: 'Due Today (At checkout)', amount: Math.round((total / 4) * 100) / 100, date: 'Today' },
        { label: 'Installment 2', amount: Math.round((total / 4) * 100) / 100, date: 'In 2 weeks' },
        { label: 'Installment 3', amount: Math.round((total / 4) * 100) / 100, date: 'In 4 weeks' },
        { label: 'Installment 4', amount: Math.round((total / 4) * 100) / 100, date: 'In 6 weeks' },
      ],
    },
    PAY_IN_6: {
      name: 'Pay in 6 (Monthly)',
      installments: 6,
      amountPerInstallment: Math.round((total / 6) * 100) / 100,
      apr: 0,
      period: 'per month',
      schedule: [
        { label: 'Due Today (At checkout)', amount: Math.round((total / 6) * 100) / 100, date: 'Today' },
        { label: 'Month 2', amount: Math.round((total / 6) * 100) / 100, date: 'In 30 days' },
        { label: 'Month 3', amount: Math.round((total / 6) * 100) / 100, date: 'In 60 days' },
        { label: 'Month 4', amount: Math.round((total / 6) * 100) / 100, date: 'In 90 days' },
        { label: 'Month 5', amount: Math.round((total / 6) * 100) / 100, date: 'In 120 days' },
        { label: 'Month 6', amount: Math.round((total / 6) * 100) / 100, date: 'In 150 days' },
      ],
    },
    PAY_IN_12: {
      name: 'Pay in 12 (Low APR)',
      installments: 12,
      amountPerInstallment: Math.round(((total * 1.045) / 12) * 100) / 100,
      apr: 7.5,
      period: 'per month',
      schedule: [
        { label: 'First Payment', amount: Math.round(((total * 1.045) / 12) * 100) / 100, date: 'In 30 days' },
        { label: '11 Monthly Payments', amount: Math.round(((total * 1.045) / 12) * 100) / 100, date: 'Months 2–12' },
      ],
    },
  };

  const currentPlan = plans[selectedPlan];

  const handleCompleteCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setConfirmedOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`);
      setOrderConfirmed(true);
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1>Embedded Finance: BNPL Checkout SDK Simulation</h1>
          <p>Experience how third-party e-commerce stores embed NexFin checkout financing seamlessly</p>
        </div>

        <div className="tab-nav" style={{ margin: 0 }}>
          <button
            className={`tab-btn ${activeTab === 'CHECKOUT' ? 'active' : ''}`}
            onClick={() => setActiveTab('CHECKOUT')}
          >
            <ShoppingBag size={14} style={{ display: 'inline', marginRight: 4 }} /> Store Checkout Experience
          </button>
          <button
            className={`tab-btn ${activeTab === 'SDK_DOCS' ? 'active' : ''}`}
            onClick={() => setActiveTab('SDK_DOCS')}
          >
            <Code size={14} style={{ display: 'inline', marginRight: 4 }} /> Merchant SDK Code Integration
          </button>
        </div>
      </div>

      {activeTab === 'SDK_DOCS' ? (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
            <Code size={20} color="var(--color-accent-hover)" />
            <h3>NexFin Embedded Finance JavaScript SDK (Drop-In Integration)</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
            Merchants can integrate NexFin Point-of-Sale BNPL financing in fewer than 10 lines of code. It dispatches an iframe modal with biometric prequalification and postMessage callbacks.
          </p>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-5)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', lineHeight: 1.7, marginBottom: 'var(--space-6)', overflowX: 'auto' }}>
            <div style={{ color: 'var(--color-text-muted)' }}>&lt;!-- 1. Include NexFin SDK script --&gt;</div>
            <div style={{ color: '#06b6d4' }}>&lt;script src="https://sdk.nexfin.io/v1/checkout.js" async&gt;&lt;/script&gt;</div>
            <br />
            <div style={{ color: 'var(--color-text-muted)' }}>&lt;!-- 2. Mount Container in Merchant Checkout --&gt;</div>
            <div style={{ color: '#06b6d4' }}>&lt;div id="nexfin-bnpl-widget"&gt;&lt;/div&gt;</div>
            <br />
            <div style={{ color: 'var(--color-text-muted)' }}>&lt;!-- 3. Initialize with Merchant API Key & Cart Context --&gt;</div>
            <div>&lt;script&gt;</div>
            <div>&nbsp;&nbsp;NexFin.init({'{'}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;apiKey: <span style={{ color: '#10b981' }}>"pk_live_merch_apex99120"</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;amount: <span style={{ color: '#f59e0b' }}>{total}</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;currency: <span style={{ color: '#10b981' }}>"USD"</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;container: <span style={{ color: '#10b981' }}>"#nexfin-bnpl-widget"</span>,</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;onApproved: <span style={{ color: '#a855f7' }}>function</span>(response) {'{'}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;console.log(<span style={{ color: '#10b981' }}>"Disbursement authorized to merchant account: "</span>, response.disbursementId);</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;window.location.href = <span style={{ color: '#10b981' }}>"/orders/confirmed?id="</span> + response.orderId;</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{'}'},</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;onDeclined: <span style={{ color: '#a855f7' }}>function</span>(reason) {'{'}</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;alert(<span style={{ color: '#10b981' }}>"Alternative payment required: "</span> + reason.message);</div>
            <div>&nbsp;&nbsp;&nbsp;&nbsp;{'}'}</div>
            <div>&nbsp;&nbsp;{'}'});</div>
            <div>&lt;/script&gt;</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', marginBottom: 'var(--space-1)' }}>
                Instant Merchant Settlement
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                NexFin disburses 100% of the cart value (minus merchant discount rate) directly into the merchant's <code>CASH_WALLET</code> immediately upon checkout.
              </p>
            </div>

            <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-info)', marginBottom: 'var(--space-1)' }}>
                Zero Merchant Credit Risk
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Underwriting and borrower default risk is assumed entirely by the NexFin balance sheet and syndicated peer lenders.
              </p>
            </div>
          </div>
        </div>
      ) : orderConfirmed ? (
        /* Order Confirmed Screen */
        <div className="card" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: 'var(--space-8)' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--color-success-muted)',
              color: 'var(--color-success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-5)',
            }}
          >
            <CheckCircle size={44} />
          </div>

          <h2>Order Successfully Placed!</h2>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)', marginBottom: 'var(--space-4)' }}>
            Merchant Order ID: <strong style={{ color: 'var(--color-text-primary)' }}>{confirmedOrderId}</strong>
          </div>

          <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Financing Selected:</span>
              <strong style={{ color: 'var(--color-accent-hover)' }}>{currentPlan.name}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>First Payment Settled:</span>
              <strong style={{ color: 'var(--color-success)' }}>{formatCurrency(currentPlan.schedule[0].amount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Merchant Disbursement:</span>
              <span>{formatCurrency(total)} (Settled via Ledger)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Next Installment:</span>
              <span>{formatCurrency(currentPlan.amountPerInstallment)} (Due {currentPlan.schedule[1]?.date || 'in 30 days'})</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setOrderConfirmed(false);
                setConfirmedOrderId('');
              }}
            >
              Simulate Another Checkout
            </button>
          </div>
        </div>
      ) : (
        /* Store Checkout View */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
          {/* Left: Merchant Checkout Flow */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <span className="badge badge-info" style={{ marginBottom: 'var(--space-1)' }}>Apex Audio & Display Store</span>
                <h2>Checkout</h2>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Encrypted 256-bit SSL
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label" style={{ marginBottom: 'var(--space-3)' }}>
                Select Payment Method
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {/* NexFin BNPL Option (Highlighted) */}
                <div
                  onClick={() => setSelectedPaymentMethod('BNPL')}
                  style={{
                    padding: 'var(--space-4)',
                    background: selectedPaymentMethod === 'BNPL' ? 'rgba(99, 102, 241, 0.08)' : 'var(--color-bg-secondary)',
                    border: selectedPaymentMethod === 'BNPL' ? '2px solid var(--color-accent)' : 'var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <input
                        type="radio"
                        checked={selectedPaymentMethod === 'BNPL'}
                        onChange={() => setSelectedPaymentMethod('BNPL')}
                        style={{ accentColor: 'var(--color-accent)' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <strong style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                          NexFin Embedded BNPL
                        </strong>
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                          0% APR Available
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-accent-hover)' }}>
                      {formatCurrency(plans.PAY_IN_4.amountPerInstallment)} / 2 wks
                    </span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', paddingLeft: '24px' }}>
                    Split your purchase into interest-free installments. Instant approval with zero impact on credit score.
                  </div>
                </div>

                {/* Credit Card Option */}
                <div
                  onClick={() => setSelectedPaymentMethod('CARD')}
                  style={{
                    padding: 'var(--space-4)',
                    background: selectedPaymentMethod === 'CARD' ? 'var(--color-bg-elevated)' : 'var(--color-bg-secondary)',
                    border: selectedPaymentMethod === 'CARD' ? '2px solid var(--color-accent)' : 'var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    opacity: selectedPaymentMethod === 'CARD' ? 1 : 0.7,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <input
                      type="radio"
                      checked={selectedPaymentMethod === 'CARD'}
                      onChange={() => setSelectedPaymentMethod('CARD')}
                      style={{ accentColor: 'var(--color-accent)' }}
                    />
                    <CreditCard size={18} />
                    <span style={{ fontWeight: 600 }}>Standard Credit / Debit Card (Pay Full ${total})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* If BNPL Selected: Embedded Widget Body */}
            {selectedPaymentMethod === 'BNPL' && (
              <div
                className="animate-fade-in"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  marginBottom: 'var(--space-6)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                  <Sparkles size={18} color="var(--color-accent)" />
                  <h4 style={{ fontSize: 'var(--text-base)' }}>Choose Installment Plan</h4>
                </div>

                {/* Plan Options Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
                  {(['PAY_IN_4', 'PAY_IN_6', 'PAY_IN_12'] as BNPLPlanType[]).map((planKey) => {
                    const p = plans[planKey];
                    const isSelected = selectedPlan === planKey;
                    return (
                      <div
                        key={planKey}
                        onClick={() => setSelectedPlan(planKey)}
                        style={{
                          padding: 'var(--space-3)',
                          background: isSelected ? 'var(--color-bg-tertiary)' : 'var(--color-bg-card)',
                          border: isSelected ? '2px solid var(--color-accent)' : 'var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'var(--transition-fast)',
                        }}
                      >
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{p.name}</div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: 'var(--space-1)' }}>
                          {formatCurrency(p.amountPerInstallment)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: p.apr === 0 ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
                          {p.apr === 0 ? '0% APR Fee' : `${p.apr}% APR`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Installment Timeline Schedule */}
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase' }}>
                    Payment Schedule:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    {currentPlan.schedule.map((step, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 'var(--space-2) var(--space-3)',
                          background: 'var(--color-bg-card)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <span style={{ width: 18, height: 18, borderRadius: '50%', background: i === 0 ? 'var(--color-accent)' : 'var(--color-bg-tertiary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                            {i + 1}
                          </span>
                          <span>{step.label}</span>
                        </div>
                        <strong style={{ color: i === 0 ? 'var(--color-accent-hover)' : 'var(--color-text-primary)' }}>
                          {formatCurrency(step.amount)}
                        </strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-success)' }}>
                  <ShieldCheck size={14} />
                  <span>Soft Credit Check: Prequalified with zero impact on credit score.</span>
                </div>
              </div>
            )}

            {/* Complete Purchase Button */}
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              onClick={handleCompleteCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="spinner" />
              ) : selectedPaymentMethod === 'BNPL' ? (
                <>
                  Pay {formatCurrency(currentPlan.schedule[0].amount)} Now & Confirm Order <ArrowRight size={18} />
                </>
              ) : (
                <>
                  Pay {formatCurrency(total)} & Complete Order <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {/* Right: Cart Order Summary */}
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Order Summary ({cart.length} items)</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                    {item.image}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      Qty: {item.quantity} • {item.category}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: 'var(--border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Sales Tax</span>
                <span>{formatCurrency(salesTax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Shipping</span>
                <span style={{ color: 'var(--color-success)' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: 'var(--border-default)', paddingTop: 'var(--space-3)', fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                <span>Total Due</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BNPLCheckoutDemoPage;
