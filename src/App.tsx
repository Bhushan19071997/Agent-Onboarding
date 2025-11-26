import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AgentList } from './components/agents/AgentList';
import { AgentForm } from './components/agents/AgentForm';
import { ApprovalWorkflow } from './components/workflow/ApprovalWorkflow';
import { BatchManagement } from './components/admin/BatchManagement';
import { AdminSettings } from './components/admin/AdminSettings';
import { User, Agent, initializeStorage } from './utils/mockData';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  useEffect(() => {
    // Initialize localStorage with default data
    initializeStorage();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setEditingAgent(null);
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setEditingAgent(null);
  };

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setCurrentPage('onboarding');
  };

  const handleNewAgent = () => {
    setEditingAgent(null);
    setCurrentPage('onboarding');
  };

  const handleBackToAgents = () => {
    setEditingAgent(null);
    setCurrentPage('agents');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentUser={currentUser}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      onLogout={handleLogout}
    >
      {currentPage === 'dashboard' && <Dashboard />}
      
      {currentPage === 'agents' && (
        <AgentList
          onEdit={handleEditAgent}
          onNewAgent={handleNewAgent}
        />
      )}
      
      {currentPage === 'onboarding' && (
        <AgentForm
          onBack={handleBackToAgents}
          editAgent={editingAgent || undefined}
          currentUser={currentUser}
        />
      )}
      
      {currentPage === 'approvals' && (
        <ApprovalWorkflow currentUser={currentUser} />
      )}
      
      {currentPage === 'batch' && (
        <BatchManagement currentUser={currentUser} />
      )}
      
      {currentPage === 'admin' && (
        <AdminSettings />
      )}
    </Layout>
  );
}
