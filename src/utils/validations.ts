// Validation utilities for Indian data

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

export const validateMobile = (mobile: string): boolean => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateIFSC = (ifsc: string): boolean => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc);
};

export const validateAccountNumber = (accountNumber: string): boolean => {
  const accountRegex = /^\d{9,18}$/;
  return accountRegex.test(accountNumber);
};

export const validatePincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

export const formatPAN = (pan: string): string => {
  return pan.toUpperCase();
};

export const formatAadhaar = (aadhaar: string): string => {
  const cleaned = aadhaar.replace(/\s/g, '');
  return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

export const formatMobile = (mobile: string): string => {
  return mobile.replace(/(\d{5})(\d{5})/, '$1 $2');
};

export const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Q-Score calculation based on multiple factors
export const calculateQScore = (data: {
  qualification: string;
  experience: number;
  age: number;
  previousInsuranceExp: boolean;
  referralSource: string;
}): number => {
  let score = 50; // Base score

  // Qualification score
  const qualScores: Record<string, number> = {
    'MBA': 20,
    'CA': 20,
    'CS': 18,
    'CFA': 18,
    'BTech': 15,
    'BE': 15,
    'MCom': 12,
    'BCom': 10,
    'MA': 10,
    'MSc': 10,
    'BA': 8,
    'BSc': 8,
  };
  
  for (const [qual, points] of Object.entries(qualScores)) {
    if (data.qualification.includes(qual)) {
      score += points;
      break;
    }
  }

  // Experience score (max 20 points)
  score += Math.min(data.experience * 2, 20);

  // Age score (optimal age 25-45)
  if (data.age >= 25 && data.age <= 35) {
    score += 10;
  } else if (data.age > 35 && data.age <= 45) {
    score += 5;
  }

  // Previous insurance experience
  if (data.previousInsuranceExp) {
    score += 15;
  }

  // Referral source
  if (data.referralSource === 'Agent Referral' || data.referralSource === 'Employee Referral') {
    score += 10;
  }

  return Math.min(score, 100); // Cap at 100
};
