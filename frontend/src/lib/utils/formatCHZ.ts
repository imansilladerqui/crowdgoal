/**
 * Formats a wei amount to CHZ with appropriate decimal places
 * @param amount - Amount in wei (as number or BigInt)
 * @returns Formatted CHZ amount as string
 */
export const formatCHZ = (amount: number | bigint): string => {
  // Convert BigInt to number if needed
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  
  // Convert wei to CHZ (divide by 10^18)
  const chzAmount = numericAmount / Math.pow(10, 18);
  
  // Format with appropriate decimal places
  if (chzAmount >= 1000000) {
    return `${(chzAmount / 1000000).toFixed(1)}M`;
  } else if (chzAmount >= 1000) {
    return `${(chzAmount / 1000).toFixed(1)}K`;
  } else if (chzAmount >= 1) {
    return chzAmount.toFixed(2);
  } else {
    return chzAmount.toFixed(4);
  }
};

/**
 * Formats a wei amount to CHZ with fixed decimal places
 * @param amount - Amount in wei (as number or BigInt)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted CHZ amount as string
 */
export const formatCHZFixed = (amount: number | bigint, decimals: number = 2): string => {
  // Convert BigInt to number if needed
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  
  // Convert wei to CHZ (divide by 10^18)
  const chzAmount = numericAmount / Math.pow(10, 18);
  
  return chzAmount.toFixed(decimals);
};

/**
 * Converts CHZ amount to wei
 * @param chzAmount - Amount in CHZ
 * @returns Amount in wei as BigInt
 */
export const chzToWei = (chzAmount: number): bigint => {
  return BigInt(Math.floor(chzAmount * Math.pow(10, 18)));
};

/**
 * Converts wei amount to CHZ as number
 * @param weiAmount - Amount in wei
 * @returns Amount in CHZ as number
 */
export const weiToCHZ = (weiAmount: number | bigint): number => {
  const numericAmount = typeof weiAmount === 'bigint' ? Number(weiAmount) : weiAmount;
  return numericAmount / Math.pow(10, 18);
};

