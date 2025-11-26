import { useEffect, useState } from 'react';
import { getAgents, getApprovals, getBatches, Agent, ApprovalRequest, BatchJob } from '../utils/mockData';
import { Users, UserCheck, UserX, Clock, TrendingUp, FileCheck, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [batches, setBatches] = useState<BatchJob[]>([]);

  useEffect(() => {
    setAgents(getAgents());
    setApprovals(getApprovals());
    setBatches(getBatches());
  }, []);

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    pendingApprovals: approvals.filter(a => a.status === 'pending').length,
    inTraining: agents.filter(a => a.status === 'training').length,
    suspended: agents.filter(a => a.status === 'suspended').length,
    avgQScore: agents.length > 0 
      ? Math.round(agents.reduce((sum, a) => sum + a.qScore, 0) / agents.length) 
      : 0,
  };

  const recentAgents = agents
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  const pendingApprovalsList = approvals
    .filter(a => a.status === 'pending')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of agent onboarding and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Agents</p>
              <p className="text-3xl mt-2">{stats.totalAgents}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Agents</p>
              <p className="text-3xl mt-2">{stats.activeAgents}</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Approvals</p>
              <p className="text-3xl mt-2">{stats.pendingApprovals}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Training</p>
              <p className="text-3xl mt-2">{stats.inTraining}</p>
            </div>
            <FileCheck className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Suspended</p>
              <p className="text-3xl mt-2">{stats.suspended}</p>
            </div>
            <UserX className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Q-Score</p>
              <p className="text-3xl mt-2">{stats.avgQScore}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-indigo-600 opacity-20" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Agents */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg mb-4">Recent Agent Registrations</h3>
          <div className="space-y-3">
            {recentAgents.length > 0 ? (
              recentAgents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{agent.firstName} {agent.lastName}</p>
                    <p className="text-xs text-gray-600">{agent.agentCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{agent.createdDate}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      agent.status === 'active' ? 'bg-green-100 text-green-800' :
                      agent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      agent.status === 'training' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No agents registered yet</p>
            )}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            {pendingApprovalsList.length > 0 ? (
              pendingApprovalsList.map(approval => (
                <div key={approval.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm">{approval.agentName}</p>
                      <p className="text-xs text-gray-600 capitalize">{approval.requestType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{approval.requestDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">No pending approvals</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats by State */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg mb-4">Agents by State (Top 5)</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(
            agents.reduce((acc, agent) => {
              acc[agent.state] = (acc[agent.state] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([state, count]) => (
              <div key={state} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg text-center">
                <p className="text-gray-600 text-sm">{state}</p>
                <p className="text-2xl mt-2">{count}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
