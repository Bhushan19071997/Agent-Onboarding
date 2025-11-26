import { useState, useEffect } from 'react';
import { Agent, getAgents, saveAgents } from '../../utils/mockData';
import { Search, Edit, Trash2, Eye, Filter, Download, UserPlus } from 'lucide-react';

interface AgentListProps {
  onEdit: (agent: Agent) => void;
  onNewAgent: () => void;
}

export function AgentList({ onEdit, onNewAgent }: AgentListProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    filterAgents();
  }, [searchTerm, filterStatus, filterState, agents]);

  const loadAgents = () => {
    const agentData = getAgents();
    setAgents(agentData);
  };

  const filterAgents = () => {
    let filtered = [...agents];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.agentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.mobile.includes(searchTerm)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(agent => agent.status === filterStatus);
    }

    // State filter
    if (filterState !== 'all') {
      filtered = filtered.filter(agent => agent.state === filterState);
    }

    setFilteredAgents(filtered);
  };

  const handleDelete = (id: string) => {
    const updatedAgents = agents.filter(a => a.id !== id);
    saveAgents(updatedAgents);
    setAgents(updatedAgents);
    setShowDeleteConfirm(null);
  };

  const handleStatusChange = (id: string, newStatus: Agent['status']) => {
    const updatedAgents = agents.map(a =>
      a.id === id ? { ...a, status: newStatus } : a
    );
    saveAgents(updatedAgents);
    setAgents(updatedAgents);
  };

  const exportToCSV = () => {
    const headers = ['Agent Code', 'Name', 'Email', 'Mobile', 'PAN', 'State', 'City', 'Designation', 'Q-Score', 'Status'];
    const rows = filteredAgents.map(agent => [
      agent.agentCode,
      `${agent.firstName} ${agent.lastName}`,
      agent.email,
      agent.mobile,
      agent.panCard,
      agent.state,
      agent.city,
      agent.designation,
      agent.qScore,
      agent.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniqueStates = Array.from(new Set(agents.map(a => a.state))).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Agent Management</h2>
          <p className="text-gray-600">View and manage all agents</p>
        </div>
        <button
          onClick={onNewAgent}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          New Agent
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, code, email, mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="training">Training</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div>
            <select
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All States</option>
              {uniqueStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            Showing {filteredAgents.length} of {agents.length} agents
          </p>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Agent Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Agent Code</th>
                <th className="px-4 py-3 text-left text-sm">Name</th>
                <th className="px-4 py-3 text-left text-sm">Email</th>
                <th className="px-4 py-3 text-left text-sm">Mobile</th>
                <th className="px-4 py-3 text-left text-sm">Location</th>
                <th className="px-4 py-3 text-left text-sm">Designation</th>
                <th className="px-4 py-3 text-left text-sm">Q-Score</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{agent.agentCode}</td>
                    <td className="px-4 py-3 text-sm">
                      {agent.firstName} {agent.middleName} {agent.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm">{agent.email}</td>
                    <td className="px-4 py-3 text-sm">{agent.mobile}</td>
                    <td className="px-4 py-3 text-sm">{agent.city}, {agent.state}</td>
                    <td className="px-4 py-3 text-sm">{agent.designation}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        agent.qScore >= 80 ? 'bg-green-100 text-green-800' :
                        agent.qScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.qScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={agent.status}
                        onChange={(e) => handleStatusChange(agent.id, e.target.value as Agent['status'])}
                        className={`px-2 py-1 rounded text-xs border-0 ${
                          agent.status === 'active' ? 'bg-green-100 text-green-800' :
                          agent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          agent.status === 'training' ? 'bg-blue-100 text-blue-800' :
                          agent.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="training">Training</option>
                        <option value="suspended">Suspended</option>
                        <option value="terminated">Terminated</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedAgent(agent)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(agent)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(agent.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No agents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl">Agent Details</h3>
                  <p className="text-sm text-blue-100">{selectedAgent.agentCode}</p>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Details */}
              <div>
                <h4 className="text-lg mb-3 pb-2 border-b">Personal Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-sm">
                      {selectedAgent.firstName} {selectedAgent.middleName} {selectedAgent.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="text-sm">{selectedAgent.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="text-sm">{selectedAgent.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Qualification</p>
                    <p className="text-sm">{selectedAgent.qualification}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="text-lg mb-3 pb-2 border-b">Contact Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm">{selectedAgent.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="text-sm">{selectedAgent.mobile}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-sm">
                      {selectedAgent.address}, {selectedAgent.city}, {selectedAgent.state} - {selectedAgent.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* KYC Details */}
              <div>
                <h4 className="text-lg mb-3 pb-2 border-b">KYC Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">PAN Card</p>
                    <p className="text-sm">{selectedAgent.panCard}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Aadhaar Card</p>
                    <p className="text-sm">{selectedAgent.aadhaarCard}</p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h4 className="text-lg mb-3 pb-2 border-b">Bank Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="text-sm">{selectedAgent.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="text-sm">{selectedAgent.accountNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="text-sm">{selectedAgent.ifscCode}</p>
                  </div>
                </div>
              </div>

              {/* Agent Details */}
              <div>
                <h4 className="text-lg mb-3 pb-2 border-b">Agent Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Designation</p>
                    <p className="text-sm">{selectedAgent.designation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="text-sm">{selectedAgent.level || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-sm">{selectedAgent.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Source of Hiring</p>
                    <p className="text-sm">{selectedAgent.sourceOfHiring}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Q-Score</p>
                    <p className="text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full ${
                        selectedAgent.qScore >= 80 ? 'bg-green-100 text-green-800' :
                        selectedAgent.qScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedAgent.qScore}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-sm capitalize">{selectedAgent.status}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedAgent.documents && selectedAgent.documents.length > 0 && (
                <div>
                  <h4 className="text-lg mb-3 pb-2 border-b">Documents</h4>
                  <div className="space-y-2">
                    {selectedAgent.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm">{doc.type}</p>
                          <p className="text-xs text-gray-600">Uploaded: {doc.uploadDate}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Details */}
              {selectedAgent.examDetails && (
                <div>
                  <h4 className="text-lg mb-3 pb-2 border-b">Exam Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Exam Date</p>
                      <p className="text-sm">{selectedAgent.examDetails.examDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Exam Center</p>
                      <p className="text-sm">{selectedAgent.examDetails.examCenter}</p>
                    </div>
                    {selectedAgent.examDetails.score && (
                      <div>
                        <p className="text-sm text-gray-600">Score</p>
                        <p className="text-sm">{selectedAgent.examDetails.score}</p>
                      </div>
                    )}
                    {selectedAgent.examDetails.result && (
                      <div>
                        <p className="text-sm text-gray-600">Result</p>
                        <p className="text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full ${
                            selectedAgent.examDetails.result === 'Pass' ? 'bg-green-100 text-green-800' :
                            selectedAgent.examDetails.result === 'Fail' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedAgent.examDetails.result}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this agent? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
