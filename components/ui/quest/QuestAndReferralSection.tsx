'use client';

import React, { useState } from 'react';
import { Account } from '@/lib/firebase/firebase-types';
import { QuestService } from '@/lib/services/quest-service';
import { ReferralService } from '@/lib/services/referral-service';
import { QuestSystem } from './QuestSystem';
import { ReferralSystem } from '../referral/ReferralSystem';
import { BadgeEmblem } from '@/components/ui/badges/BadgeEmblem';

interface QuestAndReferralSectionProps {
  account: Account | null;
  onQuestComplete?: (questId: string, rewards: any) => void;
  onReferralComplete?: (referralData: any) => void;
  refreshAccountData?: () => Promise<void>;
}

export const QuestAndReferralSection: React.FC<QuestAndReferralSectionProps> = ({
  account,
  onQuestComplete,
  onReferralComplete,
  refreshAccountData,
}) => {
  const [activeTab, setActiveTab] = useState<'quest' | 'referral'>('quest');

  if (!account) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-white/70">Connect your Stellar wallet to access quests and referrals</p>
      </div>
    );
  }

  const isQuestSystemUnlocked = QuestService.isQuestSystemUnlocked(account);
  const isReferralSystemUnlocked = ReferralService.isReferralSystemUnlocked(account);

  if (!isQuestSystemUnlocked && !isReferralSystemUnlocked) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-6">🔒</div>
        <h3 className="text-2xl font-bold text-white mb-4">Quest & Referral System Locked</h3>
        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
          Complete the main demos and earn the top 5 badges to unlock the quest and referral systems!
        </p>
        
        {/* Progress Indicator */}
        <div className="bg-white/10 rounded-xl p-6 max-w-md mx-auto">
          <h4 className="text-lg font-semibold text-white mb-4">Required Badges</h4>
          <div className="space-y-3">
            {[
              { id: 'welcome_explorer', name: 'Welcome Explorer' },
              { id: 'escrow_expert', name: 'Escrow Expert' },
              { id: 'trust_guardian', name: 'Trust Guardian' },
              { id: 'stellar_champion', name: 'Stellar Champion' },
              { id: 'nexus_master', name: 'Nexus Master' },
            ].map((badge) => {
              // Handle both array and object formats for badgesEarned
              let badgesEarnedArray: string[] = [];
              if (Array.isArray(account.badgesEarned)) {
                badgesEarnedArray = account.badgesEarned;
              } else if (account.badgesEarned && typeof account.badgesEarned === 'object') {
                badgesEarnedArray = Object.values(account.badgesEarned);
              }
              
              const hasBadge = badgesEarnedArray.includes(badge.id);
              
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    hasBadge ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    <BadgeEmblem id={badge.id} size="sm" className={hasBadge ? 'text-green-400' : 'text-white/50'} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${hasBadge ? 'text-green-300' : 'text-white/70'}`}>
                      {badge.name}
                    </div>
                  </div>
                  <div className={`text-2xl ${hasBadge ? 'text-green-400' : 'text-white/30'}`}>
                    {hasBadge ? '✅' : '⏳'}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-sm text-white/60 text-center">
              Progress: {[
                'welcome_explorer',
                'escrow_expert',
                'trust_guardian', 
                'stellar_champion',
                'nexus_master'
              ].filter(badgeId => {
                let badgesEarnedArray: string[] = [];
                if (Array.isArray(account.badgesEarned)) {
                  badgesEarnedArray = account.badgesEarned;
                } else if (account.badgesEarned && typeof account.badgesEarned === 'object') {
                  badgesEarnedArray = Object.values(account.badgesEarned);
                }
                return badgesEarnedArray.includes(badgeId);
              }).length}/5 badges earned
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-white/10 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('quest')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'quest'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🎯 Quests
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'referral'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            👥 Referrals
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'quest' ? (
        <QuestSystem
          account={account}
          onQuestComplete={onQuestComplete}
          refreshAccountData={refreshAccountData}
        />
      ) : (
        <ReferralSystem
          account={account}
          onReferralComplete={onReferralComplete}
          onAccountRefresh={refreshAccountData}
        />
      )}
    </div>
  );
};
