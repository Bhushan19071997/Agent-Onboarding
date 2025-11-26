// Indian States and Cities Data
export const indianStates = [
  { value: 'AN', label: 'Andaman and Nicobar Islands' },
  { value: 'AP', label: 'Andhra Pradesh' },
  { value: 'AR', label: 'Arunachal Pradesh' },
  { value: 'AS', label: 'Assam' },
  { value: 'BR', label: 'Bihar' },
  { value: 'CH', label: 'Chandigarh' },
  { value: 'CT', label: 'Chhattisgarh' },
  { value: 'DN', label: 'Dadra and Nagar Haveli' },
  { value: 'DD', label: 'Daman and Diu' },
  { value: 'DL', label: 'Delhi' },
  { value: 'GA', label: 'Goa' },
  { value: 'GJ', label: 'Gujarat' },
  { value: 'HR', label: 'Haryana' },
  { value: 'HP', label: 'Himachal Pradesh' },
  { value: 'JK', label: 'Jammu and Kashmir' },
  { value: 'JH', label: 'Jharkhand' },
  { value: 'KA', label: 'Karnataka' },
  { value: 'KL', label: 'Kerala' },
  { value: 'LA', label: 'Ladakh' },
  { value: 'LD', label: 'Lakshadweep' },
  { value: 'MP', label: 'Madhya Pradesh' },
  { value: 'MH', label: 'Maharashtra' },
  { value: 'MN', label: 'Manipur' },
  { value: 'ML', label: 'Meghalaya' },
  { value: 'MZ', label: 'Mizoram' },
  { value: 'NL', label: 'Nagaland' },
  { value: 'OR', label: 'Odisha' },
  { value: 'PY', label: 'Puducherry' },
  { value: 'PB', label: 'Punjab' },
  { value: 'RJ', label: 'Rajasthan' },
  { value: 'SK', label: 'Sikkim' },
  { value: 'TN', label: 'Tamil Nadu' },
  { value: 'TG', label: 'Telangana' },
  { value: 'TR', label: 'Tripura' },
  { value: 'UP', label: 'Uttar Pradesh' },
  { value: 'UT', label: 'Uttarakhand' },
  { value: 'WB', label: 'West Bengal' },
];

export const citiesByState: Record<string, string[]> = {
  MH: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
  DL: ['New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
  KA: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum', 'Gulbarga'],
  TN: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
  TG: ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar'],
  GJ: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
  RJ: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
  UP: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Noida', 'Ghaziabad'],
  WB: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  PB: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  HR: ['Gurugram', 'Faridabad', 'Rohtak', 'Hisar', 'Panipat'],
  KL: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kannur'],
};

export const indianBanks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'IDFC First Bank',
  'Yes Bank',
  'Bank of India',
  'Central Bank of India',
  'Indian Bank',
  'UCO Bank',
  'Indian Overseas Bank',
  'Punjab & Sind Bank',
];

export const agentDesignations = [
  'Agent',
  'Senior Agent',
  'Unit Manager',
  'Branch Manager',
  'Divisional Head',
  'Regional Manager',
  'Zonal Manager',
  'Senior Zonal Manager',
];

export const agentLevels = [
  { value: 'SM', label: 'Sales Manager' },
  { value: 'BM', label: 'Branch Manager' },
  { value: 'DH', label: 'Divisional Head' },
  { value: 'RM', label: 'Regional Manager' },
  { value: 'ZM', label: 'Zonal Manager' },
  { value: 'SZM', label: 'Senior Zonal Manager' },
  { value: 'HO', label: 'Head Office' },
];

export const locationTypes = [
  { value: 'SU', label: 'Sales Unit' },
  { value: 'BO', label: 'Branch Office' },
  { value: 'RO', label: 'Regional Office' },
  { value: 'ZO', label: 'Zonal Office' },
  { value: 'SZO', label: 'Senior Zonal Office' },
  { value: 'AH', label: 'Area Hub' },
];

export const qualifications = [
  '10th Standard',
  '12th Standard',
  'Diploma',
  'Bachelor of Arts (BA)',
  'Bachelor of Science (BSc)',
  'Bachelor of Commerce (BCom)',
  'Bachelor of Engineering (BE)',
  'Bachelor of Technology (BTech)',
  'Master of Arts (MA)',
  'Master of Science (MSc)',
  'Master of Commerce (MCom)',
  'Master of Business Administration (MBA)',
  'Chartered Accountant (CA)',
  'Company Secretary (CS)',
  'Chartered Financial Analyst (CFA)',
];

export const sourceOfHiring = [
  'Direct',
  'Agent Referral',
  'Employee Referral',
  'Job Portal',
  'Walk-in',
  'Campus Recruitment',
  'Social Media',
  'Advertisement',
];

export const documentTypes = [
  'PAN Card',
  'Aadhaar Card',
  'Passport',
  'Driving License',
  'Voter ID',
  'Bank Passbook',
  'Cancelled Cheque',
  'Educational Certificate',
  'Photo',
  'Signature',
];

export const agentStatus = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'terminated', label: 'Terminated' },
  { value: 'training', label: 'In Training' },
];

export const examCenters = [
  'Mumbai - Andheri',
  'Mumbai - BKC',
  'Delhi - Connaught Place',
  'Delhi - Dwarka',
  'Bangalore - Koramangala',
  'Bangalore - Whitefield',
  'Chennai - T Nagar',
  'Hyderabad - Hitech City',
  'Pune - Shivaji Nagar',
  'Ahmedabad - SG Highway',
];

export const relationships = [
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Father-in-Law',
  'Mother-in-Law',
];
