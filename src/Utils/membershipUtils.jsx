export function isMembershipExpired(ownerData) {
  if(ownerData === null) {
    return false; // No data available, so not expired  
  } 
    const today = new Date().toISOString().split('T')[0]; // "2025-05-09"
    const trialEnd = ownerData.trialEndDate;
    const membershipEnd = ownerData.membershipEndDate;
 
    if (membershipEnd === null) {
      // Trial user
      const isExpired = trialEnd && trialEnd < today;
      return isExpired;
    } else {
      // Paid user
      const isExpired = membershipEnd < today;
      return isExpired;
    }
  }
  