
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Auth from './screens/Auth';
import Dashboard from './screens/Dashboard';
import TransactionsScreen from './screens/Transactions';
import SMSParserScreen from './screens/SMSParser';
import GoalsScreen from './screens/Goals';
import EMIScreen from './screens/EMI';
import SettingsScreen from './screens/Settings';
import GroupsScreen from './screens/Groups';
import GroupDetail from './screens/GroupDetail';
import ProfileScreen from './screens/Profile';
import { AppScreen, Group, User, Branding, Transaction } from './types';
import { loadData, saveData, getAuthUser, setAuthUser } from './store/appStore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getAuthUser());
  const [activeScreen, setActiveScreen] = useState<AppScreen>('DASHBOARD');
  const [data, setData] = useState(loadData());
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  // Deep-link logic for group invites
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('joinGroup');
    if (code) {
      setPendingJoinCode(code);
      // Remove params from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Process join request once authenticated
  useEffect(() => {
    if (user && pendingJoinCode) {
      const groupToJoin = data.groups.find(g => g.inviteCode === pendingJoinCode);
      if (groupToJoin) {
        const alreadyMember = groupToJoin.members.some(m => m.contact === user.email);
        if (!alreadyMember) {
          const updatedGroup = {
            ...groupToJoin,
            members: [...groupToJoin.members, { id: user.id, name: user.name, contact: user.email, isUser: true }]
          };
          const newGroups = data.groups.map(g => g.id === groupToJoin.id ? updatedGroup : g);
          updateData({ groups: newGroups });
          setSelectedGroup(updatedGroup);
          setActiveScreen('GROUP_DETAIL');
          alert(`Successfully joined ${groupToJoin.name}!`);
        } else {
          setSelectedGroup(groupToJoin);
          setActiveScreen('GROUP_DETAIL');
        }
      } else if (pendingJoinCode.startsWith('SMART-')) {
        alert("Invite code not found. It may have expired.");
      }
      setPendingJoinCode(null);
    }
  }, [user, pendingJoinCode, data.groups]);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const handleNavigate = useCallback((screen: AppScreen) => {
    setActiveScreen(screen);
    if (screen !== 'GROUP_DETAIL') {
      setSelectedGroup(null);
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setAuthUser(newUser);
    setActiveScreen('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setAuthUser(null);
    setActiveScreen('AUTH');
  };

  const updateData = (newData: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setAuthUser(updatedUser);
  };

  const handleFactoryReset = () => {
    if (window.confirm("WARNING: This will permanently delete ALL data, groups, and account settings. This cannot be undone. Proceed?")) {
      localStorage.clear();
      // Force hard redirect to base URL to clear any memory states and query params
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} branding={data.branding} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'DASHBOARD':
        return <Dashboard 
          data={data} 
          onNavigate={handleNavigate} 
          onUpdateTransactions={(t) => updateData({ transactions: t })}
        />;
      case 'TRANSACTIONS':
        return <TransactionsScreen 
          transactions={data.transactions} 
          onUpdate={(t) => updateData({ transactions: t })} 
        />;
      case 'GROUPS':
        return <GroupsScreen 
          groups={data.groups} 
          onSelectGroup={(g) => { setSelectedGroup(g); setActiveScreen('GROUP_DETAIL'); }}
          onCreateGroup={(g) => updateData({ groups: [g, ...data.groups] })}
        />;
      case 'GROUP_DETAIL':
        return selectedGroup ? (
          <GroupDetail 
            group={selectedGroup} 
            onBack={() => handleNavigate('GROUPS')} 
            onUpdateGroup={(updated) => {
              const newGroups = data.groups.map(g => g.id === updated.id ? updated : g);
              updateData({ groups: newGroups });
              setSelectedGroup(updated);
            }}
          />
        ) : null;
      case 'SMS_PARSER':
        return <SMSParserScreen 
          onTransactionParsed={(t) => {
            updateData({ transactions: [t, ...data.transactions] });
            setActiveScreen('TRANSACTIONS');
          }} 
        />;
      case 'GOALS':
        return <GoalsScreen 
          goals={data.goals} 
          onUpdate={(goals) => updateData({ goals })} 
        />;
      case 'EMI':
        return <EMIScreen 
          emis={data.emis} 
          onUpdate={(emis) => updateData({ emis })} 
        />;
      case 'PROFILE':
        return <ProfileScreen 
          user={user} 
          onUpdate={handleUpdateUser} 
          onBack={() => handleNavigate('SETTINGS')} 
        />;
      case 'SETTINGS':
        return <SettingsScreen 
          data={data} 
          user={user} 
          onLogout={handleLogout} 
          onDataReset={handleFactoryReset}
          onUpdateBranding={(b) => updateData({ branding: b })}
        />;
      default:
        return <Dashboard 
          data={data} 
          onNavigate={handleNavigate} 
          onUpdateTransactions={(t) => updateData({ transactions: t })}
        />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} onNavigate={handleNavigate} user={user} branding={data.branding}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
