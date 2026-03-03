import React from 'react';
import { Filter, Banknote, Landmark } from 'lucide-react';
import '../styles.css';

export const TransactionWidget = () => {
    const transactions = [
        {
            id: 1,
            title: 'Deposit',
            date: 'Aug 28, 2023 • 09:45 AM',
            amount: '+15,000.00 ETB',
            type: 'credit',
        },
        {
            id: 2,
            title: 'Withdrawal',
            date: 'Aug 27, 2023 • 01:20 PM',
            amount: '-15.00 ETB',
            type: 'debit',
        },
    ];

    return (
        <div className="card fade-in" style={{ backgroundColor: 'var(--card-green)', color: 'white', padding: '24px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>Recent Transactions</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    <span>Filter</span>
                    <Filter size={16} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {transactions.map((tx, index) => (
                    <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: index !== transactions.length - 1 ? '24px' : '0', borderBottom: index !== transactions.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '0', color: 'white' }}>
                                {tx.type === 'credit' ? <Banknote size={24} strokeWidth={1.5} /> : <Landmark size={24} strokeWidth={1.5} />}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '15px', margin: 0 }}>{tx.title}</div>
                                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{tx.date}</div>
                            </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '16px', color: tx.type === 'credit' ? 'var(--positive-green)' : 'var(--negative-red)' }}>
                            {tx.amount}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                    View All Transaction History
                </button>
            </div>
        </div>
    );
};
