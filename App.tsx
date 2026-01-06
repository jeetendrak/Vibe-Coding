
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
import { AppScreen, Group, User, Branding } from './types';
import { loadData, saveData, getAuthUser, setAuthUser } from './store/appStore';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(getAuthUser());
  const [activeScreen, setActiveScreen] = useState<AppScreen>('DASHBOARD');
  const [data, setData] = useState(loadData());
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

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
    setActiveScreen('DASHBOARD');
  };

  const updateData = (newData: Partial<typeof data>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setActiveScreen('GROUP_DETAIL');
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    const newGroups = data.groups.map(g => g.id === updatedGroup.id ? updatedGroup : g);
    updateData({ groups: newGroups });
    setSelectedGroup(updatedGroup);
  };

  const handleUpdateBranding = (newBranding: Branding) => {
    updateData({ branding: newBranding });
  };

  if (!user) {
    return <Auth onLogin={handleLogin} branding={data.branding} />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'DASHBOARD':
        return <Dashboard data={data} onNavigate={handleNavigate} branding={data.branding} />;
      case 'TRANSACTIONS':
        return <TransactionsScreen 
          transactions={data.transactions} 
          onAdd={(t) => updateData({ transactions: [t, ...data.transactions] })} 
        />;
      case 'GROUPS':
        return <GroupsScreen 
          groups={data.groups} 
          onSelectGroup={handleGroupSelect}
          onCreateGroup={(g) => updateData({ groups: [g, ...data.groups] })}
        />;
      case 'GROUP_DETAIL':
        return selectedGroup ? (
          <GroupDetail 
            group={selectedGroup} 
            onBack={() => handleNavigate('GROUPS')} 
            onUpdateGroup={handleUpdateGroup}
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
      case 'SETTINGS':
        return <SettingsScreen 
          data={data} 
          user={user} 
          onLogout={handleLogout} 
          onDataReset={() => setData(loadData())}
          onUpdateBranding={handleUpdateBranding}
        />;
      default:
        return <Dashboard data={data} onNavigate={handleNavigate} branding={data.branding} />;
    }
  };

  return (
    <Layout activeScreen={activeScreen} onNavigate={handleNavigate} user={user} branding={data.branding}>
      {renderScreen()}
    </Layout>
  );
};

export default App;
