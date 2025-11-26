import { useState, useEffect } from 'react';
import { ApprovalRequest, getApprovals, saveApprovals, getAgents, saveAgents } from '../../utils/mockData';
import { CheckCircle, XCircle, Clock, MessageSquare, Filter } from 'lucide-react';

interface ApprovalWorkflowProps {
  currentUser: any;
}

export function ApprovalWorkflow({ currentUser }: ApprovalWorkflowProps) {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [filteredApprovals, setFilteredApprovals] = useState<ApprovalRequest[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [comments, setComments] = useState('');

  useEffect(() => {
    loadApprovals();
  }, []);

  useEffect(() => {
    filterApprovals();
  }, [filterType, filterStatus, approvals]);

  const loadApprovals = () => {
    const approvalData = getApprovals();
    setApprovals(approvalData);
  };

  const filterApprovals = () => {
    let filtered = [...approvals];

    if (filterType !== 'all') {
      filtered = filtered.filter(a => a.requestType === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    setFilteredApprovals(filtered);
  };

  const handleApprove = (approval: ApprovalRequest) => {
    const updatedApprovals = approvals.map(a =>
      a.id === approval.id
        ? {
            ...a,
            status: 'approved' as const,
            approvedBy: currentUser.name,
            approvedDate: new Date().toISOString().split('T')[0],
            comments: comments || undefined,
          }
        : a
    );
    saveApprovals(updatedApprovals);

    // Update agent status if it's an onboarding request
    if (approval.requestType === 'onboarding') {
      const agents = getAgents();
      const updatedAgents = agents.map(agent =>
        agent.id === approval.agentId
          ? { ...agent, status: 'active' as const, approvedDate: new Date().toISOString().split('T')[0] }
          : agent
      );
      saveAgents(updatedAgents);
    }

    setApprovals(updatedApprovals);
    setSelectedApproval(null);
    setComments('');
  };

  const handleReject = (approval: ApprovalRequest) => {
    const updatedApprovals = approvals.map(a =>
      a.id === approval.id
        ? {
            ...a,
            status: 'rejected' as const,
            approvedBy: currentUser.name,
            approvedDate: new Date().toISOString().split('T')[0],
            comments: comments || 'Rejected',
          }
        : a
    );
    saveApprovals(updatedApprovals);

    // Update agent status if it's an onboarding request
    if (approval.requestType === 'onboarding') {
      const agents = getAgents();
      const updatedAgents = agents.map(agent =>
        agent.id === approval.agentId
          ? { ...agent, status: 'terminated' as const }
          : agent
      );
      saveAgents(updatedAgents);
    }

    setApprovals(updatedApprovals);
    setSelectedApproval(null);
    setComments('');
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'onboarding':
        return 'bg-blue-100 text-blue-800';
      case 'movement':
        return 'bg-purple-100 text-purple-800';
      case 'termination':
        return 'bg-red-100 text-red-800';
      case 'suspension':
        return 'bg-orange-100 text-orange-800';
      case 'reinstatement':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const stats = {
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Approval Workflow</h2>
        <p className="text-gray-600">Review and approve agent requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Approvals</p>
              <p className="text-3xl mt-2">{stats.pending}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-3xl mt-2">{stats.approved}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rejected</p>
              <p className="text-3xl mt-2">{stats.rejected}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Request Types</option>
                <option value="onboarding">Onboarding</option>
                <option value="movement">Movement</option>
                <option value="termination">Termination</option>
                <option value="suspension">Suspension</option>
                <option value="reinstatement">Reinstatement</option>
              </select>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Request ID</th>
                <th className="px-4 py-3 text-left text-sm">Agent Name</th>
                <th className="px-4 py-3 text-left text-sm">Agent ID</th>
                <th className="px-4 py-3 text-left text-sm">Request Type</th>
                <th className="px-4 py-3 text-left text-sm">Requested By</th>
                <th className="px-4 py-3 text-left text-sm">Request Date</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApprovals.length > 0 ? (
                filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{approval.id}</td>
                    <td className="px-4 py-3 text-sm">{approval.agentName}</td>
                    <td className="px-4 py-3 text-sm">{approval.agentId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${getRequestTypeColor(approval.requestType)}`}>
                        {approval.requestType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{approval.requestedBy}</td>
                    <td className="px-4 py-3 text-sm">{approval.requestDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(approval.status)}
                        <span className="capitalize">{approval.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {approval.status === 'pending' ? (
                        <button
                          onClick={() => setSelectedApproval(approval)}
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                        >
                          Review
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedApproval(approval)}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-xs"
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No approval requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl">Approval Request Details</h3>
                  <p className="text-sm text-blue-100">{selectedApproval.id}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedApproval(null);
                    setComments('');
                  }}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Agent Name</p>
                  <p className="text-sm">{selectedApproval.agentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agent ID</p>
                  <p className="text-sm">{selectedApproval.agentId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request Type</p>
                  <p className="text-sm capitalize">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRequestTypeColor(selectedApproval.requestType)}`}>
                      {selectedApproval.requestType}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm capitalize flex items-center gap-2">
                    {getStatusIcon(selectedApproval.status)}
                    {selectedApproval.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Requested By</p>
                  <p className="text-sm">{selectedApproval.requestedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Request Date</p>
                  <p className="text-sm">{selectedApproval.requestDate}</p>
                </div>
                {selectedApproval.approvedBy && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedApproval.status === 'approved' ? 'Approved By' : 'Rejected By'}
                      </p>
                      <p className="text-sm">{selectedApproval.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedApproval.status === 'approved' ? 'Approved Date' : 'Rejected Date'}
                      </p>
                      <p className="text-sm">{selectedApproval.approvedDate}</p>
                    </div>
                  </>
                )}
              </div>

              {selectedApproval.comments && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Comments</p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedApproval.comments}</p>
                  </div>
                </div>
              )}

              {selectedApproval.status === 'pending' && (
                <>
                  <div>
                    <label className="block text-sm mb-2">
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Comments (Optional)
                    </label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={3}
                      placeholder="Add your comments here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApproval)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedApproval)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
