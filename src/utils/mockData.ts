// Mock data and localStorage utilities

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'operator';
  name: string;
  email: string;
}

export interface Agent {
  id: string;
  agentCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  mobile: string;
  panCard: string;
  aadhaarCard: string;
  qualification: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  designation: string;
  level?: string;
  location?: string;
  locationType?: string;
  sourceOfHiring: string;
  referredBy?: string;
  qScore: number;
  status: 'active' | 'pending' | 'suspended' | 'terminated' | 'training';
  createdDate: string;
  approvedDate?: string;
  nomineeDetails?: {
    name: string;
    relationship: string;
    dateOfBirth: string;
    mobile: string;
  };
  documents: {
    type: string;
    uploadDate: string;
    verified: boolean;
  }[];
  examDetails?: {
    examDate: string;
    examCenter: string;
    score?: number;
    result?: 'Pass' | 'Fail' | 'Pending';
  };
}

export interface ApprovalRequest {
  id: string;
  agentId: string;
  agentName: string;
  requestType: 'onboarding' | 'movement' | 'termination' | 'suspension' | 'reinstatement';
  requestedBy: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

export interface BatchJob {
  id: string;
  batchName: string;
  type: 'termination' | 'suspension' | 'reinstatement' | 'transfer';
  agentCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdBy: string;
  createdDate: string;
  completedDate?: string;
}

// Default users
export const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator',
    email: 'admin@ageasfederal.com',
  },
  {
    id: '2',
    username: 'manager',
    password: 'manager123',
    role: 'manager',
    name: 'Operations Manager',
    email: 'manager@ageasfederal.com',
  },
  {
    id: '3',
    username: 'operator',
    password: 'operator123',
    role: 'operator',
    name: 'Data Operator',
    email: 'operator@ageasfederal.com',
  },
];

// Sample agents
export const sampleAgents: Agent[] = [
  {
    id: 'AGT001',
    agentCode: 'AFLI001234',
    firstName: 'Rajesh',
    middleName: 'Kumar',
    lastName: 'Sharma',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    email: 'rajesh.sharma@example.com',
    mobile: '9876543210',
    panCard: 'ABCPS1234D',
    aadhaarCard: '1234 5678 9012',
    qualification: 'Bachelor of Commerce (BCom)',
    address: '123, MG Road, Andheri West',
    city: 'Mumbai',
    state: 'MH',
    pincode: '400058',
    bankName: 'HDFC Bank',
    accountNumber: '12345678901234',
    ifscCode: 'HDFC0001234',
    designation: 'Senior Agent',
    level: 'SM',
    location: 'Mumbai West',
    locationType: 'BO',
    sourceOfHiring: 'Direct',
    qScore: 75,
    status: 'active',
    createdDate: '2024-01-15',
    approvedDate: '2024-01-20',
    nomineeDetails: {
      name: 'Priya Sharma',
      relationship: 'Spouse',
      dateOfBirth: '1987-08-20',
      mobile: '9876543211',
    },
    documents: [
      { type: 'PAN Card', uploadDate: '2024-01-15', verified: true },
      { type: 'Aadhaar Card', uploadDate: '2024-01-15', verified: true },
      { type: 'Bank Passbook', uploadDate: '2024-01-15', verified: true },
    ],
    examDetails: {
      examDate: '2024-01-18',
      examCenter: 'Mumbai - Andheri',
      score: 85,
      result: 'Pass',
    },
  },
  {
    id: 'AGT002',
    agentCode: 'AFLI001235',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: '1990-03-22',
    gender: 'Female',
    email: 'priya.patel@example.com',
    mobile: '9876543220',
    panCard: 'DEFPT5678E',
    aadhaarCard: '2345 6789 0123',
    qualification: 'Master of Business Administration (MBA)',
    address: '45, SG Highway, Satellite',
    city: 'Ahmedabad',
    state: 'GJ',
    pincode: '380015',
    bankName: 'ICICI Bank',
    accountNumber: '23456789012345',
    ifscCode: 'ICIC0002345',
    designation: 'Unit Manager',
    level: 'BM',
    location: 'Ahmedabad Central',
    locationType: 'BO',
    sourceOfHiring: 'Agent Referral',
    referredBy: 'AGT001',
    qScore: 88,
    status: 'active',
    createdDate: '2024-02-10',
    approvedDate: '2024-02-15',
    documents: [
      { type: 'PAN Card', uploadDate: '2024-02-10', verified: true },
      { type: 'Aadhaar Card', uploadDate: '2024-02-10', verified: true },
    ],
    examDetails: {
      examDate: '2024-02-13',
      examCenter: 'Ahmedabad - SG Highway',
      score: 92,
      result: 'Pass',
    },
  },
  {
    id: 'AGT003',
    agentCode: 'AFLI001236',
    firstName: 'Amit',
    lastName: 'Singh',
    dateOfBirth: '1988-11-10',
    gender: 'Male',
    email: 'amit.singh@example.com',
    mobile: '9876543230',
    panCard: 'GHISG9012F',
    aadhaarCard: '3456 7890 1234',
    qualification: 'Bachelor of Technology (BTech)',
    address: '78, Sector 18, Noida',
    city: 'Noida',
    state: 'UP',
    pincode: '201301',
    bankName: 'State Bank of India',
    accountNumber: '34567890123456',
    ifscCode: 'SBIN0003456',
    designation: 'Agent',
    level: 'SM',
    location: 'Delhi NCR',
    locationType: 'RO',
    sourceOfHiring: 'Job Portal',
    qScore: 70,
    status: 'pending',
    createdDate: '2024-11-20',
    documents: [
      { type: 'PAN Card', uploadDate: '2024-11-20', verified: true },
      { type: 'Aadhaar Card', uploadDate: '2024-11-20', verified: false },
    ],
    examDetails: {
      examDate: '2024-11-28',
      examCenter: 'Delhi - Connaught Place',
      result: 'Pending',
    },
  },
];

// Initialize localStorage
export const initializeStorage = () => {
  if (!localStorage.getItem('afli_users')) {
    localStorage.setItem('afli_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('afli_agents')) {
    localStorage.setItem('afli_agents', JSON.stringify(sampleAgents));
  }
  if (!localStorage.getItem('afli_approvals')) {
    localStorage.setItem('afli_approvals', JSON.stringify([]));
  }
  if (!localStorage.getItem('afli_batches')) {
    localStorage.setItem('afli_batches', JSON.stringify([]));
  }
};

// Storage utilities
export const getUsers = (): User[] => {
  const users = localStorage.getItem('afli_users');
  return users ? JSON.parse(users) : defaultUsers;
};

export const getAgents = (): Agent[] => {
  const agents = localStorage.getItem('afli_agents');
  return agents ? JSON.parse(agents) : sampleAgents;
};

export const saveAgents = (agents: Agent[]) => {
  localStorage.setItem('afli_agents', JSON.stringify(agents));
};

export const getApprovals = (): ApprovalRequest[] => {
  const approvals = localStorage.getItem('afli_approvals');
  return approvals ? JSON.parse(approvals) : [];
};

export const saveApprovals = (approvals: ApprovalRequest[]) => {
  localStorage.setItem('afli_approvals', JSON.stringify(approvals));
};

export const getBatches = (): BatchJob[] => {
  const batches = localStorage.getItem('afli_batches');
  return batches ? JSON.parse(batches) : [];
};

export const saveBatches = (batches: BatchJob[]) => {
  localStorage.setItem('afli_batches', JSON.stringify(batches));
};

export const generateAgentCode = (): string => {
  const agents = getAgents();
  const lastCode = agents.length > 0 
    ? Math.max(...agents.map(a => parseInt(a.agentCode.replace('AFLI', '')))) 
    : 1233;
  return `AFLI${String(lastCode + 1).padStart(6, '0')}`;
};
