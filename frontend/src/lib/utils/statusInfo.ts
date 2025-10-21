import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

export interface StatusInfo {
  text: string;
  variant: "default" | "success" | "destructive" | "secondary" | "outline";
  icon: React.ComponentType<any> | null;
  color: string;
}

/**
 * Gets status information for campaign status codes
 * @param status - Campaign status number (0-3)
 * @returns StatusInfo object with text, variant, icon, and color
 */
export const getCampaignStatusInfo = (status: number): StatusInfo => {
  switch (status) {
    case 0: // Active
      return { 
        text: "Active", 
        variant: "default" as const, 
        icon: null,
        color: "text-orange-600"
      };
    case 1: // Successful
      return { 
        text: "Successful", 
        variant: "success" as const, 
        icon: CheckCircle,
        color: "text-green-600"
      };
    case 2: // Failed
      return { 
        text: "Failed - Refund Available", 
        variant: "destructive" as const, 
        icon: XCircle,
        color: "text-red-600"
      };
    case 3: // Finalized
      return { 
        text: "Completed", 
        variant: "secondary" as const, 
        icon: CheckCircle,
        color: "text-gray-600"
      };
    default:
      return { 
        text: "Unknown", 
        variant: "outline" as const, 
        icon: AlertCircle,
        color: "text-gray-600"
      };
  }
};

/**
 * Gets status information for campaign status codes (for My Campaigns page)
 * @param status - Campaign status number (0-3)
 * @param fundsWithdrawn - Whether funds have been withdrawn
 * @returns StatusInfo object with text, variant, icon, and color
 */
export const getMyCampaignStatusInfo = (status: number, fundsWithdrawn: boolean): StatusInfo => {
  switch (status) {
    case 0: // Active
      return { 
        text: "Active", 
        variant: "default" as const, 
        icon: Clock,
        color: "text-blue-600"
      };
    case 1: // Successful
      return { 
        text: fundsWithdrawn ? "Completed" : "Ready to Withdraw", 
        variant: fundsWithdrawn ? "secondary" as const : "success" as const, 
        icon: fundsWithdrawn ? CheckCircle : CheckCircle,
        color: fundsWithdrawn ? "text-gray-600" : "text-green-600"
      };
    case 2: // Failed
      return { 
        text: "Failed", 
        variant: "destructive" as const, 
        icon: XCircle,
        color: "text-red-600"
      };
    case 3: // Finalized
      return { 
        text: "Finalized", 
        variant: "secondary" as const, 
        icon: CheckCircle,
        color: "text-gray-600"
      };
    default:
      return { 
        text: "Unknown", 
        variant: "outline" as const, 
        icon: AlertCircle,
        color: "text-gray-600"
      };
  }
};

/**
 * Gets status information for donation status codes
 * @param status - Campaign status number (0-3)
 * @returns StatusInfo object with text, variant, icon, and color
 */
export const getDonationStatusInfo = (status: number): StatusInfo => {
  switch (status) {
    case 0: // Active
      return { 
        text: "Active", 
        variant: "default" as const, 
        icon: null,
        color: "text-orange-600"
      };
    case 1: // Successful
      return { 
        text: "Successful", 
        variant: "success" as const, 
        icon: CheckCircle,
        color: "text-green-600"
      };
    case 2: // Failed
      return { 
        text: "Failed - Refund Available", 
        variant: "destructive" as const, 
        icon: XCircle,
        color: "text-red-600"
      };
    case 3: // Finalized
      return { 
        text: "Completed", 
        variant: "secondary" as const, 
        icon: CheckCircle,
        color: "text-gray-600"
      };
    default:
      return { 
        text: "Unknown", 
        variant: "outline" as const, 
        icon: AlertCircle,
        color: "text-gray-600"
      };
  }
};

/**
 * Checks if a campaign status allows fund withdrawal
 * @param status - Campaign status number
 * @param fundsWithdrawn - Whether funds have been withdrawn
 * @returns True if funds can be withdrawn
 */
export const canWithdrawFunds = (status: number, fundsWithdrawn: boolean): boolean => {
  return status === 1 && !fundsWithdrawn;
};

/**
 * Checks if a donation status allows refund claim
 * @param status - Campaign status number
 * @returns True if refund can be claimed
 */
export const canClaimRefund = (status: number): boolean => {
  return status === 2;
};

/**
 * Gets the status text for display purposes
 * @param status - Campaign status number
 * @returns Human-readable status text
 */
export const getStatusText = (status: number): string => {
  const statusInfo = getCampaignStatusInfo(status);
  return statusInfo.text;
};

