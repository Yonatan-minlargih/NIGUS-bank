import React, { useState } from 'react';
import { UserWidget, HeaderWidget } from './UserWidget';
import { CardWidget } from './CardWidget';
import { AccountWidget } from './AccountWidget';
import { TransactionWidget } from './TransactionWidget';
import '../styles.css';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [showBalance, setShowBalance] = useState(true);

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-color)' }}>
            <UserWidget activeTab={activeTab} setActiveTab={setActiveTab} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <HeaderWidget />

                <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        {activeTab === 'Dashboard' && (
                            <>
                                <CardWidget showBalance={showBalance} setShowBalance={setShowBalance} />
                                <AccountWidget />
                                <TransactionWidget />
                            </>
                        )}
                        {activeTab !== 'Dashboard' && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-dark)' }}>
                                <h2>{activeTab} Feature is under development.</h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
