import React, { useState } from 'react';
import { Home, ArrowRightLeft, CreditCard, LayoutGrid, Settings, HelpCircle, Bell, Search } from 'lucide-react';
import '../styles.css';

interface NavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const UserWidget = ({ activeTab, setActiveTab }: NavProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '260px', backgroundColor: 'var(--primary-green)', color: 'white', padding: '0', justifyContent: 'space-between' }}>
            <div>
                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '24px', height: '80px' }}>
                    <div style={{ padding: '0', borderRadius: '8px' }}>
                        <Home size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>NIGUS Bank</h1>
                </div>

                {/* Navigation */}
                <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', marginTop: '20px' }}>
                    <div className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
                        <LayoutGrid size={20} />
                        <span style={{ fontWeight: activeTab === 'Dashboard' ? 600 : 500 }}>Dashboard</span>
                    </div>
                    <div className={`nav-item ${activeTab === 'Transactions' ? 'active' : ''}`} onClick={() => setActiveTab('Transactions')}>
                        <ArrowRightLeft size={20} />
                        <span style={{ fontWeight: activeTab === 'Transactions' ? 600 : 500 }}>Transactions</span>
                    </div>
                    <div className={`nav-item ${activeTab === 'Accounts' ? 'active' : ''}`} onClick={() => setActiveTab('Accounts')}>
                        <CreditCard size={20} />
                        <span style={{ fontWeight: activeTab === 'Accounts' ? 600 : 500 }}>Accounts</span>
                    </div>
                    <div className={`nav-item ${activeTab === 'Cards' ? 'active' : ''}`} onClick={() => setActiveTab('Cards')}>
                        <CreditCard size={20} />
                        <span style={{ fontWeight: activeTab === 'Cards' ? 600 : 500 }}>Cards</span>
                    </div>
                </nav>
            </div>

            {/* Footer Nav */}
            <div style={{ display: 'flex', flexDirection: 'column', padding: '0 16px', marginBottom: '32px' }}>
                <div className="nav-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </div>
                <div className="nav-item">
                    <HelpCircle size={20} />
                    <span>Support</span>
                </div>
            </div>
        </div>
    );
};

export const HeaderWidget = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px', height: '80px', backgroundColor: 'var(--header-green)' }}>
            <div style={{ position: 'relative' }}>
                <Search size={18} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: '14px', top: '10px' }} />
                <input type="text" className="search-bar" placeholder="Search transactions, accounts..." />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={24} color="white" />
                    <div style={{ position: 'absolute', top: -2, right: 0, width: '10px', height: '10px', backgroundColor: 'var(--negative-red)', borderRadius: '50%', border: '2px solid var(--header-green)' }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: 'white' }}>Eyob Habtie</div>
                        <div style={{ fontSize: '10px', color: 'var(--gold-accent)', fontWeight: 800, letterSpacing: '0.5px' }}>PREMIUM CUSTOMER</div>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e2ab7b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', overflow: 'hidden' }}>
                        {/* Using a placeholder avatar color block to mimic image */}
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#e8aa78', border: '2px solid white', borderRadius: '50%' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
