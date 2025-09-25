export const getWalletAddress = () => localStorage.getItem("walletAddress");
export const setWalletAddress = (address: string | null) => {
  if (address) localStorage.setItem("walletAddress", address);
  else localStorage.removeItem("walletAddress");
};
