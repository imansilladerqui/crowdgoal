/**
 * Campaign Status Utility
 * 
 * Problem: Expired campaigns show as "Active" on-chain until someone pays gas to update status.
 * Solution: Compute the actual status client-side based on expiration date and funding.
 */

/**
 * Checks if a campaign has expired based on its expiration date
 * @param expiringDate - Campaign expiration timestamp (in seconds)
 * @returns True if campaign has expired
 */
export const isCampaignExpired = (expiringDate: number): boolean => {
  const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  return now >= expiringDate;
};

/**
 * Gets the computed status of a campaign considering expiration date
 * This solves the gas fee problem by computing status client-side
 * @param onChainStatus - The status from the blockchain (0-3)
 * @param expiringDate - Campaign expiration timestamp (in seconds)
 * @param raised - Amount raised in wei
 * @param goal - Campaign goal in wei
 * @returns The actual status (considering expiration)
 */
export const getComputedCampaignStatus = (
  onChainStatus: number,
  expiringDate: number,
  raised: number,
  goal: number
): number => {
  if (onChainStatus === 3) return 3;
  
  const hasExpired = isCampaignExpired(expiringDate);
  
  if (hasExpired) {
    if (raised >= goal) {
      return 1; 
    } else {
      return 2; 
    }
  }
  
  return onChainStatus;
};

/**
 * Checks if a campaign allows refund claims
 * This is computed client-side to show the correct status
 */
export const canClaimRefundComputed = (
  onChainStatus: number,
  expiringDate: number,
  raised: number,
  goal: number
): boolean => {
  const computedStatus = getComputedCampaignStatus(onChainStatus, expiringDate, raised, goal);
  return computedStatus === 2;
};

