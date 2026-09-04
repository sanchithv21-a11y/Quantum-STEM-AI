import React from "react";
import { QuantumThemeMode, AIModel, SubscriptionTier } from "../types";

export interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetModel?: AIModel | null;
  currentTier?: SubscriptionTier;
  onSelectTier?: (tier: SubscriptionTier) => void;
  themeMode?: QuantumThemeMode;
}

/**
 * All subscriptions & upgrade requirements have been completely removed.
 * Quantum STEM AI is 100% free and unrestricted for all users.
 */
export const SubscriptionModal: React.FC<SubscriptionModalProps> = () => {
  return null;
};
