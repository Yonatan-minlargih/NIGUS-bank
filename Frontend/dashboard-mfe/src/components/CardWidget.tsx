import React from 'react';
import { Eye, EyeOff, TrendingUp, PlusCircle, ArrowUpRight, ArrowDownRight, ChevronRight, Plus, Wallet, Send } from 'lucide-react';
import '../styles.css';

interface CardProps {
    showBalance: boolean;
    setShowBalance: (val: boolean) => void;
}

export const CardWidget = ({ showBalance, setShowBalance }: CardProps) => {
    return (
        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
            {/* Total Balance Card */}
            <div className="card fade-in" style={{ flex: '7', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '1px', opacity: 0.8 }}>TOTAL BALANCE</span>
                    <div onClick={() => setShowBalance(!showBalance)} style={{ cursor: 'pointer' }}>
                        {showBalance ? <Eye size={24} color="white" /> : <EyeOff size={24} color="white" />}
                    </div>
                </div>
                <div style={{ fontSize: '48px', fontWeight: 700, marginBottom: '24px', letterSpacing: '-1px' }}>
                    {showBalance ? '124,500.00' : '••••••••'} <span style={{ fontSize: '24px', fontWeight: 500, opacity: 0.9 }}>ETB</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 16px', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
                        <TrendingUp size={16} />
                        <span>+2.4% this month</span>
                    </div>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>Last updated: Just now</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ flex: '3', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: 'var(--card-radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', display: 'flex' }}><Plus size={20} color="white" /></div>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>Deposit Funds</span>
                    </div>
                    <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                </div>
                <div className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: 'var(--card-radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', display: 'flex' }}><Wallet size={20} color="white" /></div>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>Withdraw</span>
                    </div>
                    <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                </div>
                <div className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderRadius: 'var(--card-radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', display: 'flex' }}><Send size={20} color="white" /></div>
                        <span style={{ fontWeight: 600, fontSize: '15px' }}>Transfer Money</span>
                    </div>
                    <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
                </div>
            </div>
        </div>
    );
};
