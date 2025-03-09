"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTeam, INITIAL_BUDGET_LKR } from '@/contexts/TeamContext';
import { eventService, EVENTS } from '@/lib/event-service';

// Format number to display with commas
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-LK').format(num);
};

export default function BudgetPage() {
  const { team, remainingBudget, spentBudget } = useTeam();
  const [spentPercentage, setSpentPercentage] = useState(0);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [animateUpdate, setAnimateUpdate] = useState(false);

  useEffect(() => {
    // Calculate percentage of budget spent
    setSpentPercentage((spentBudget / INITIAL_BUDGET_LKR) * 100);
  }, [spentBudget]);

  // Subscribe to budget update events
  useEffect(() => {
    const unsubscribe = eventService.subscribe(EVENTS.BUDGET_UPDATED, (data: any) => {
      setUpdateMessage(`Budget updated! (${new Date().toLocaleTimeString()})`);
      setAnimateUpdate(true);
      setTimeout(() => {
        setUpdateMessage(null);
        setAnimateUpdate(false);
      }, 3000);
    });
    
    return () => unsubscribe();
  }, []);

  // Group players by role for better organization
  const playersByRole: Record<string, any[]> = team.reduce((acc, player) => {
    const role = player.role.toLowerCase().replace(' ', '-');
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(player);
    return acc;
  }, {});

  // Calculate budget by role
  const budgetByRole = Object.entries(playersByRole).reduce((acc, [role, players]) => {
    acc[role] = players.reduce((total, player) => {
      const playerBudget = player.budgetLkr || player.budget * 100000000;
      return total + playerBudget;
    }, 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="relative">
      {/* Real-time update notification */}
      {updateMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {updateMessage}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">Budget Management</h1>
      <p className="text-gray-600 mb-6">Track your team's spending and budget allocation.</p>
      
      {/* Budget Summary */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold">Budget Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
              <div className="text-gray-500 text-sm mb-1">Initial Budget</div>
              <div className={`text-2xl font-bold text-blue-800 ${animateUpdate ? 'animate-pulse' : ''}`}>
                Rs. {formatNumber(INITIAL_BUDGET_LKR)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
              <div className="text-gray-500 text-sm mb-1">Remaining</div>
              <div className={`text-2xl font-bold text-green-700 ${animateUpdate ? 'animate-pulse' : ''}`}>
                Rs. {formatNumber(remainingBudget)}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 text-center">
              <div className="text-gray-500 text-sm mb-1">Spent</div>
              <div className={`text-2xl font-bold text-orange-700 ${animateUpdate ? 'animate-pulse' : ''}`}>
                Rs. {formatNumber(spentBudget)}
              </div>
            </div>
          </div>
          
          {/* Budget Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-500">Budget Usage</span>
              <span className="text-sm font-medium text-gray-700">{spentPercentage.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full ${spentPercentage > 90 ? 'bg-red-500' : 'bg-green-500'} transition-all duration-500`}
                style={{ width: `${spentPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {/* Role-wise Budget Breakdown */}
          {Object.keys(budgetByRole).length > 0 ? (
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Budget by Player Role</h3>
              <div className="space-y-4">
                {Object.entries(budgetByRole).map(([role, budget]) => (
                  <div key={role} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">
                        {role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}s
                      </span>
                      <span className="text-green-600 font-bold">Rs. {formatNumber(budget)}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(budget / INITIAL_BUDGET_LKR) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-right">
                      {((budget / spentBudget) * 100).toFixed(1)}% of total spending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No players selected yet. Add players to see budget breakdown.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Players List with Budget */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Team Budget Allocation</h2>
            <span className="bg-blue-800 text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
              {team.length}/11 players
            </span>
          </div>
        </div>
        <div className="p-4">
          {team.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven&apos;t added any players to your team yet.</p>
              <Link href="/dashboard/select-team" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Select Players
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Player
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {team.map((player) => {
                    const playerBudget = player.budgetLkr || player.budget * 100000000;
                    return (
                      <tr key={player.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              <img className="h-10 w-10 rounded-full object-cover" src={player.image} alt="" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{player.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{player.university}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {player.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                          Rs. {formatNumber(playerBudget)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {((playerBudget / spentBudget) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium" colSpan={3}>
                      Total Budget Spent:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                      Rs. {formatNumber(spentBudget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
