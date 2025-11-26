import { useState, useEffect } from 'react';
import { BatchJob, getBatches, saveBatches, getAgents, Agent, saveAgents } from '../../utils/mockData';
import { Upload, Download, FileText, Play, CheckCircle, XCircle, Loader } from 'lucide-react';

interface BatchManagementProps {
  currentUser: any;
}

export function BatchManagement({ currentUser }: BatchManagementProps) {
  const [batches, setBatches] = useState<BatchJob[]>([]);
  const [showNewBatch, setShowNewBatch] = useState(false);
  const [batchType, setBatchType] = useState<'termination' | 'suspension' | 'reinstatement' | 'transfer'>('termination');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [batchName, setBatchName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBatches(getBatches());
    setAgents(getAgents());
  };

  const handleCreateBatch = () => {
    if (!batchName || selectedAgents.length === 0) {
      alert('Please provide batch name and select agents');
      return;
    }

    const newBatch: BatchJob = {
      id: `BATCH${String(batches.length + 1).padStart(3, '0')}`,
      batchName,
      type: batchType,
      agentCount: selectedAgents.length,
      status: 'pending',
      createdBy: currentUser.name,
      createdDate: new Date().toISOString().split('T')[0],
    };

    saveBatches([...batches, newBatch]);
    setBatches([...batches, newBatch]);
    
    // Reset form
    setBatchName('');
    setSelectedAgents([]);
    setShowNewBatch(false);
  };

  const handleExecuteBatch = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    // Update batch status
    const updatedBatches = batches.map(b =>
      b.id === batchId
        ? { ...b, status: 'processing' as const }
        : b
    );
    saveBatches(updatedBatches);
    setBatches(updatedBatches);

    // Simulate processing
    setTimeout(() => {
      const finalBatches = updatedBatches.map(b =>
        b.id === batchId
          ? { ...b, status: 'completed' as const, completedDate: new Date().toISOString().split('T')[0] }
          : b
      );
      saveBatches(finalBatches);
      setBatches(finalBatches);

      // Update agent statuses based on batch type
      const agentData = getAgents();
      const updatedAgents = agentData.map(agent => {
        if (selectedAgents.includes(agent.id)) {
          const statusMap: Record<string, Agent['status']> = {
            termination: 'terminated',
            suspension: 'suspended',
            reinstatement: 'active',
            transfer: 'active',
          };
          return { ...agent, status: statusMap[batch.type] };
        }
        return agent;
      });
      saveAgents(updatedAgents);
    }, 2000);
  };

  const handleBulkUpload = () => {
    // Simulated bulk upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`File "${file.name}" uploaded successfully. In production, this would process the file.`);
      }
    };
    input.click();
  };

  const downloadTemplate = () => {
    const template = 'Agent Code,Action,Effective Date\nAFLI001234,termination,2024-11-26\nAFLI001235,suspension,2024-11-26';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'batch_template.csv';
    a.click();
  };

  const filteredAgents = agents.filter(agent =>
    agent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.agentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FileText className="w-5 h-5 text-gray-600" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Batch Operations</h2>
          <p className="text-gray-600">Manage bulk agent movements and updates</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Template
          </button>
          <button
            onClick={handleBulkUpload}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Bulk Upload
          </button>
          <button
            onClick={() => setShowNewBatch(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <FileText className="w-4 h-4" />
            New Batch
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-600">
          <p className="text-gray-600 text-sm">Total Batches</p>
          <p className="text-3xl mt-2">{batches.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-3xl mt-2">{batches.filter(b => b.status === 'processing').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-sm">Completed</p>
          <p className="text-3xl mt-2">{batches.filter(b => b.status === 'completed').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
          <p className="text-gray-600 text-sm">Failed</p>
          <p className="text-3xl mt-2">{batches.filter(b => b.status === 'failed').length}</p>
        </div>
      </div>

      {/* Batch List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg">Batch Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm">Batch ID</th>
                <th className="px-4 py-3 text-left text-sm">Batch Name</th>
                <th className="px-4 py-3 text-left text-sm">Type</th>
                <th className="px-4 py-3 text-left text-sm">Agent Count</th>
                <th className="px-4 py-3 text-left text-sm">Created By</th>
                <th className="px-4 py-3 text-left text-sm">Created Date</th>
                <th className="px-4 py-3 text-left text-sm">Status</th>
                <th className="px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">{batch.id}</td>
                    <td className="px-4 py-3 text-sm">{batch.batchName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-block px-2 py-1 rounded-full text-xs capitalize bg-purple-100 text-purple-800">
                        {batch.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{batch.agentCount}</td>
                    <td className="px-4 py-3 text-sm">{batch.createdBy}</td>
                    <td className="px-4 py-3 text-sm">{batch.createdDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(batch.status)}
                        <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {batch.status === 'pending' && (
                        <button
                          onClick={() => handleExecuteBatch(batch.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                        >
                          <Play className="w-3 h-3" />
                          Execute
                        </button>
                      )}
                      {batch.status === 'completed' && batch.completedDate && (
                        <span className="text-xs text-gray-600">
                          {batch.completedDate}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No batch jobs created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Batch Modal */}
      {showNewBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl">Create New Batch</h3>
                  <p className="text-sm text-blue-100">Select agents and action type</p>
                </div>
                <button
                  onClick={() => {
                    setShowNewBatch(false);
                    setBatchName('');
                    setSelectedAgents([]);
                  }}
                  className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Batch Name</label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="e.g., November 2024 Terminations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Action Type</label>
                  <select
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="termination">Termination</option>
                    <option value="suspension">Suspension</option>
                    <option value="reinstatement">Reinstatement</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Search Agents</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or agent code..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                <p className="text-sm mb-3">
                  Selected: {selectedAgents.length} agent(s)
                </p>
                <div className="space-y-2">
                  {filteredAgents.map(agent => (
                    <label
                      key={agent.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(agent.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgents([...selectedAgents, agent.id]);
                          } else {
                            setSelectedAgents(selectedAgents.filter(id => id !== agent.id));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="text-sm">
                          {agent.firstName} {agent.lastName}
                        </p>
                        <p className="text-xs text-gray-600">{agent.agentCode}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.status === 'active' ? 'bg-green-100 text-green-800' :
                        agent.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agent.status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleCreateBatch}
                  disabled={!batchName || selectedAgents.length === 0}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Batch
                </button>
                <button
                  onClick={() => {
                    setShowNewBatch(false);
                    setBatchName('');
                    setSelectedAgents([]);
                  }}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
