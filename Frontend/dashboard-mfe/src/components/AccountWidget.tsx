import React from 'react';
import { CreditCard, PiggyBank } from 'lucide-react';
import '../styles.css';

export const AccountWidget = () => {
    return (
        <div style={{ marginBottom: '32px' }} className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#e5edeb' }}>My Accounts</h2>
                <span style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 600, cursor: 'pointer' }}>Manage All Accounts</span>
            </div>

            <div style={{ display: 'flex', gap: '24px' }}>
                {/* Savings Account */}
                <div className="card" style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Savings Account</div>
                            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>•••• 8829</div>
                        </div>
                        <div style={{ color: 'white' }}>
                            <PiggyBank size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>
                        82,000.00 <span style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>ETB</span>
                    </div>
                </div>

                {/* Checking Account */}
                <div className="card" style={{ flex: 1, padding: '24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>Checking Account</div>
                            <div style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'monospace' }}>•••• 4410</div>
                        </div>
                        <div style={{ color: 'white' }}>
                            <CreditCard size={32} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>
                        42,500.00 <span style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>ETB</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
