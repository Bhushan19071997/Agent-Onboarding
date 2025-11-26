import { useState, useEffect } from 'react';
import { Agent, generateAgentCode, getAgents, saveAgents, getApprovals, saveApprovals, ApprovalRequest } from '../../utils/mockData';
import { 
  indianStates, 
  citiesByState, 
  indianBanks, 
  qualifications, 
  sourceOfHiring,
  agentDesignations,
  agentLevels,
  locationTypes,
  relationships,
  examCenters,
  documentTypes
} from '../../utils/indianData';
import { 
  validatePAN, 
  validateAadhaar, 
  validateMobile, 
  validateEmail,
  validateIFSC,
  validateAccountNumber,
  validatePincode,
  calculateQScore,
  calculateAge,
  formatPAN,
  formatAadhaar
} from '../../utils/validations';
import { Save, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

interface AgentFormProps {
  onBack: () => void;
  editAgent?: Agent;
  currentUser: any;
}

export function AgentForm({ onBack, editAgent, currentUser }: AgentFormProps) {
  const [formData, setFormData] = useState<Partial<Agent>>({
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    mobile: '',
    panCard: '',
    aadhaarCard: '',
    qualification: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    designation: '',
    level: '',
    location: '',
    locationType: '',
    sourceOfHiring: '',
    referredBy: '',
    qScore: 0,
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({ pan: false, aadhaar: false, email: false, mobile: false });
  const [calculatedQScore, setCalculatedQScore] = useState(0);

  useEffect(() => {
    if (editAgent) {
      setFormData(editAgent);
      if (editAgent.state) {
        setAvailableCities(citiesByState[editAgent.state] || []);
      }
    }
  }, [editAgent]);

  useEffect(() => {
    if (formData.state) {
      setAvailableCities(citiesByState[formData.state] || []);
    }
  }, [formData.state]);

  // Auto-calculate Q-Score when relevant fields change
  useEffect(() => {
    if (formData.qualification && formData.dateOfBirth && formData.sourceOfHiring) {
      const age = calculateAge(formData.dateOfBirth);
      const qScore = calculateQScore({
        qualification: formData.qualification,
        experience: 0, // Can be added as a field
        age: age,
        previousInsuranceExp: false, // Can be added as a field
        referralSource: formData.sourceOfHiring,
      });
      setCalculatedQScore(qScore);
      setFormData(prev => ({ ...prev, qScore }));
    }
  }, [formData.qualification, formData.dateOfBirth, formData.sourceOfHiring]);

  const checkDuplicates = (field: 'pan' | 'aadhaar' | 'email' | 'mobile', value: string) => {
    if (!value) return;
    
    const agents = getAgents();
    const fieldMap = {
      pan: 'panCard',
      aadhaar: 'aadhaarCard',
      email: 'email',
      mobile: 'mobile',
    };
    
    const isDuplicate = agents.some(agent => 
      agent.id !== editAgent?.id && 
      agent[fieldMap[field] as keyof Agent] === value
    );
    
    setDuplicateCheck(prev => ({ ...prev, [field]: isDuplicate }));
    
    if (isDuplicate) {
      setErrors(prev => ({ ...prev, [field]: `This ${field} is already registered` }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (field: keyof Agent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'panCard':
        if (value && !validatePAN(value)) {
          error = 'Invalid PAN format (e.g., ABCPS1234D)';
        } else if (value) {
          checkDuplicates('pan', value);
        }
        break;
      case 'aadhaarCard':
        if (value && !validateAadhaar(value)) {
          error = 'Invalid Aadhaar format (12 digits)';
        } else if (value) {
          checkDuplicates('aadhaar', value);
        }
        break;
      case 'mobile':
        if (value && !validateMobile(value)) {
          error = 'Invalid mobile number (10 digits starting with 6-9)';
        } else if (value) {
          checkDuplicates('mobile', value);
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'Invalid email format';
        } else if (value) {
          checkDuplicates('email', value);
        }
        break;
      case 'ifscCode':
        if (value && !validateIFSC(value)) {
          error = 'Invalid IFSC code';
        }
        break;
      case 'accountNumber':
        if (value && !validateAccountNumber(value)) {
          error = 'Invalid account number';
        }
        break;
      case 'pincode':
        if (value && !validatePincode(value)) {
          error = 'Invalid pincode';
        }
        break;
    }
    
    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.mobile) newErrors.mobile = 'Mobile is required';
    if (!formData.panCard) newErrors.panCard = 'PAN card is required';
    if (!formData.aadhaarCard) newErrors.aadhaarCard = 'Aadhaar card is required';
    if (!formData.qualification) newErrors.qualification = 'Qualification is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.bankName) newErrors.bankName = 'Bank name is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.sourceOfHiring) newErrors.sourceOfHiring = 'Source of hiring is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const agents = getAgents();
    
    if (editAgent) {
      // Update existing agent
      const updatedAgents = agents.map(a => 
        a.id === editAgent.id ? { ...editAgent, ...formData } : a
      );
      saveAgents(updatedAgents);
    } else {
      // Create new agent
      const newAgent: Agent = {
        id: `AGT${String(agents.length + 1).padStart(3, '0')}`,
        agentCode: generateAgentCode(),
        ...formData,
        createdDate: new Date().toISOString().split('T')[0],
        documents: [],
      } as Agent;
      
      saveAgents([...agents, newAgent]);
      
      // Create approval request
      const approvals = getApprovals();
      const newApproval: ApprovalRequest = {
        id: `APR${String(approvals.length + 1).padStart(3, '0')}`,
        agentId: newAgent.id,
        agentName: `${newAgent.firstName} ${newAgent.lastName}`,
        requestType: 'onboarding',
        requestedBy: currentUser.name,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      saveApprovals([...approvals, newApproval]);
    }
    
    setShowSuccess(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl mb-2">Success!</h3>
          <p className="text-gray-600">
            {editAgent ? 'Agent updated successfully' : 'Agent registered successfully and sent for approval'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">{editAgent ? 'Edit Agent' : 'New Agent Onboarding'}</h2>
          <p className="text-gray-600">Fill in the agent details</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Personal Details */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Middle Name</label>
              <input
                type="text"
                value={formData.middleName}
                onChange={(e) => handleChange('middleName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              {formData.dateOfBirth && (
                <p className="text-xs text-gray-600 mt-1">Age: {calculateAge(formData.dateOfBirth)} years</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as 'Male' | 'Female' | 'Other')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Qualification *</label>
              <select
                value={formData.qualification}
                onChange={(e) => handleChange('qualification', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.qualification ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Qualification</option>
                {qualifications.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Mobile *</label>
              <input
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                onBlur={(e) => handleBlur('mobile', e.target.value)}
                placeholder="10-digit mobile number"
                className={`w-full px-3 py-2 border rounded-lg ${errors.mobile ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">State *</label>
              <select
                value={formData.state}
                onChange={(e) => {
                  handleChange('state', e.target.value);
                  handleChange('city', '');
                }}
                className={`w-full px-3 py-2 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select State</option>
                {indianStates.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">City *</label>
              <select
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                disabled={!formData.state}
                className={`w-full px-3 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'} ${!formData.state ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select City</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Pincode *</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                onBlur={(e) => handleBlur('pincode', e.target.value)}
                placeholder="6-digit pincode"
                maxLength={6}
                className={`w-full px-3 py-2 border rounded-lg ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* KYC Details */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">KYC Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">PAN Card *</label>
              <input
                type="text"
                value={formData.panCard}
                onChange={(e) => handleChange('panCard', formatPAN(e.target.value))}
                onBlur={(e) => handleBlur('panCard', e.target.value)}
                placeholder="ABCPS1234D"
                maxLength={10}
                className={`w-full px-3 py-2 border rounded-lg ${errors.panCard ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.panCard && <p className="text-red-500 text-xs mt-1">{errors.panCard}</p>}
              {duplicateCheck.pan && !errors.panCard && (
                <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Duplicate PAN detected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">Aadhaar Card *</label>
              <input
                type="text"
                value={formData.aadhaarCard}
                onChange={(e) => handleChange('aadhaarCard', formatAadhaar(e.target.value))}
                onBlur={(e) => handleBlur('aadhaarCard', e.target.value)}
                placeholder="1234 5678 9012"
                maxLength={14}
                className={`w-full px-3 py-2 border rounded-lg ${errors.aadhaarCard ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.aadhaarCard && <p className="text-red-500 text-xs mt-1">{errors.aadhaarCard}</p>}
              {duplicateCheck.aadhaar && !errors.aadhaarCard && (
                <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Duplicate Aadhaar detected
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Bank Name *</label>
              <select
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Bank</option>
                {indianBanks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Account Number *</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                onBlur={(e) => handleBlur('accountNumber', e.target.value)}
                placeholder="9-18 digit account number"
                className={`w-full px-3 py-2 border rounded-lg ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">IFSC Code *</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
                onBlur={(e) => handleBlur('ifscCode', e.target.value)}
                placeholder="SBIN0001234"
                maxLength={11}
                className={`w-full px-3 py-2 border rounded-lg ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ifscCode && <p className="text-red-500 text-xs mt-1">{errors.ifscCode}</p>}
            </div>
          </div>
        </div>

        {/* Agent Hierarchy */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">Agent Hierarchy & Designation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Designation *</label>
              <select
                value={formData.designation}
                onChange={(e) => handleChange('designation', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.designation ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Designation</option>
                {agentDesignations.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
            </div>

            <div>
              <label className="block text-sm mb-2">Level</label>
              <select
                value={formData.level}
                onChange={(e) => handleChange('level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Level</option>
                {agentLevels.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Location Type</label>
              <select
                value={formData.locationType}
                onChange={(e) => handleChange('locationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select Location Type</option>
                {locationTypes.map(l => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm mb-2">Location/Office</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Mumbai West Branch"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Source of Hiring */}
        <div>
          <h3 className="text-lg mb-4 pb-2 border-b">Source of Hiring</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Source *</label>
              <select
                value={formData.sourceOfHiring}
                onChange={(e) => handleChange('sourceOfHiring', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${errors.sourceOfHiring ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Source</option>
                {sourceOfHiring.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.sourceOfHiring && <p className="text-red-500 text-xs mt-1">{errors.sourceOfHiring}</p>}
            </div>

            {formData.sourceOfHiring === 'Agent Referral' && (
              <div>
                <label className="block text-sm mb-2">Referred By (Agent Code)</label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => handleChange('referredBy', e.target.value)}
                  placeholder="AFLI001234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Q-Score Display */}
        {calculatedQScore > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Calculated Q-Score</p>
                <p className="text-xs text-gray-600">Based on qualification, age, and source</p>
              </div>
              <div className="text-3xl text-blue-600">{calculatedQScore}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Save className="w-4 h-4" />
            {editAgent ? 'Update Agent' : 'Submit for Approval'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
