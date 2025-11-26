import { useState, useEffect } from 'react';
import { User, getUsers } from '../../utils/mockData';
import { Users, Database, Bell, Shield, Download } from 'lucide-react';

export function AdminSettings() {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'master' | 'notifications' | 'security' | 'reports'>('users');

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const tabs = [
    { id: 'users' as const, label: 'User Management', icon: Users },
    { id: 'master' as const, label: 'Master Data', icon: Database },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'reports' as const, label: 'Reports', icon: Download },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Admin Settings</h2>
        <p className="text-gray-600">Manage system configuration and settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg">System Users</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Add User
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm">Username</th>
                      <th className="px-4 py-3 text-left text-sm">Name</th>
                      <th className="px-4 py-3 text-left text-sm">Email</th>
                      <th className="px-4 py-3 text-left text-sm">Role</th>
                      <th className="px-4 py-3 text-left text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{user.username}</td>
                        <td className="px-4 py-3 text-sm">{user.name}</td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs capitalize ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button className="text-blue-600 hover:underline text-xs">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'master' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Master Data Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Designation Master</p>
                    <p className="text-xs text-gray-600 mt-1">Manage agent designations</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Location Master</p>
                    <p className="text-xs text-gray-600 mt-1">Manage office locations</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Hierarchy Master</p>
                    <p className="text-xs text-gray-600 mt-1">Manage organizational hierarchy</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Qualification Master</p>
                    <p className="text-xs text-gray-600 mt-1">Manage qualification types</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Exam Centers</p>
                    <p className="text-xs text-gray-600 mt-1">Manage exam center locations</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm">Document Types</p>
                    <p className="text-xs text-gray-600 mt-1">Manage required documents</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Notification Templates</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Agent Onboarding Welcome</p>
                      <button className="text-blue-600 hover:underline text-xs">Edit</button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sent when a new agent is successfully onboarded
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Approval Request</p>
                      <button className="text-blue-600 hover:underline text-xs">Edit</button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sent to approvers when a new request is pending
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Exam Reminder</p>
                      <button className="text-blue-600 hover:underline text-xs">Edit</button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sent to agents before their exam date
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Document Verification</p>
                      <button className="text-blue-600 hover:underline text-xs">Edit</button>
                    </div>
                    <p className="text-xs text-gray-600">
                      Sent when documents are verified or require resubmission
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Security Configuration</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-600">Require 2FA for all users</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4" />
                    </label>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Password Expiry</p>
                        <p className="text-xs text-gray-600">Passwords expire after 90 days</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Session Timeout</p>
                        <p className="text-xs text-gray-600">Auto-logout after 30 minutes of inactivity</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <label className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Audit Logging</p>
                        <p className="text-xs text-gray-600">Log all user actions</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Usage Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Agent Onboarding Report</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Complete report of all onboarded agents
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Approval Workflow Report</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Report of all approval requests and their status
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Batch Operations Report</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Report of all batch operations executed
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">User Activity Report</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Report of user login and activity
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Q-Score Analysis</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Analysis of agent quality scores
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm">Regional Performance</p>
                      <Download className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600">
                      Agent distribution by region and state
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
