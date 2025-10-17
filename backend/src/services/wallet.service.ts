import { ethers } from 'ethers';
import { config } from '../config/env';

export class WalletService {
  private provider: ethers.providers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(config.algorandEvmRpc);
  }

  validateAddress(address: string): boolean {
    try {
      return ethers.utils.isAddress(address);
    } catch {
      return false;
    }
  }

  async getWalletBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Get wallet balance error:', error);
      throw new Error('Failed to get wallet balance');
    }
  }

  async getTransactionReceipt(txHash: string) {
    try {
      return await this.provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Get transaction receipt error:', error);
      throw new Error('Failed to get transaction receipt');
    }
  }

  async waitForTransaction(txHash: string, confirmations: number = 1) {
    try {
      return await this.provider.waitForTransaction(txHash, confirmations);
    } catch (error) {
      console.error('Wait for transaction error:', error);
      throw new Error('Failed to wait for transaction');
    }
  }

  formatAddress(address: string): string {
    return ethers.utils.getAddress(address);
  }

  async getGasPrice(): Promise<string> {
    try {
      const gasPrice = await this.provider.getGasPrice();
      return ethers.utils.formatUnits(gasPrice, 'gwei');
    } catch (error) {
      console.error('Get gas price error:', error);
      return '0';
    }
  }

  async estimateGas(transaction: ethers.providers.TransactionRequest): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas(transaction);
      return gasEstimate.toString();
    } catch (error) {
      console.error('Estimate gas error:', error);
      throw new Error('Failed to estimate gas');
    }
  }
}

export const walletService = new WalletService();