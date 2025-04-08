import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simple Card components (replacing the imported ones)
const Card = ({ children, className }) => (
  <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>
);

const CardHeader = ({ children, className }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

const CardContent = ({ children, className }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

function AIReceptionistROICalculator() {
  // Call volume
  const [businessHourCalls, setBusinessHourCalls] = useState(5);
  const [afterHourCalls, setAfterHourCalls] = useState(1);
  const [missedBusinessHourCalls, setMissedBusinessHourCalls] = useState(3);
  const [avgCallDuration, setAvgCallDuration] = useState(5);
  const [salesCallPercentage, setSalesCallPercentage] = useState(10);
  const [daysOpen, setDaysOpen] = useState("weekdays");
  
  // Business value metrics
  const [avgLeadValue, setAvgLeadValue] = useState(450);
  const [conversionRate, setConversionRate] = useState(10);
  const [industry, setIndustry] = useState("plumbing");
  
  // Costs
  const [totalHumanCost, setTotalHumanCost] = useState(2500);
  const [aiSetupFee, setAiSetupFee] = useState(1000);
  const [aiSubscriptionCost, setAiSubscriptionCost] = useState(500);
  const [aiPerMinuteCost, setAiPerMinuteCost] = useState(0.65);
  
  // UI state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Results
  const [results, setResults] = useState({
    totalCalls: 0,
    missedCalls: 0,
    salesMissedCalls: 0,
    totalMinutes: 0,
    aiBaseCost: 0,
    aiMinuteCost: 0,
    aiSetupFee: 1000,
    aiSetupFeeMonthly: 1000/12,
    aiTotalMonthlyCost: 0,
    aiTotalCostWithSetup: 0,
    humanCost: 0,
    potentialRevenue: 0,
    costSavings: 0,
    netBenefit: 0,
    roi: 0,
    paybackPeriod: 0,
    yearlyCostSavings: 0,
    yearlyPotentialRevenue: 0,
    yearlyNetBenefit: 0
  });

  // Industry presets for Home Services Businesses
  const industryPresets = {
    plumbing: { avgLeadValue: 450, conversionRate: 18 },
    hvac: { avgLeadValue: 600, conversionRate: 15 },
    electrician: { avgLeadValue: 350, conversionRate: 20 },
    landscaping: { avgLeadValue: 300, conversionRate: 22 },
    cleaning: { avgLeadValue: 250, conversionRate: 25 },
    roofing: { avgLeadValue: 1200, conversionRate: 12 },
    painting: { avgLeadValue: 800, conversionRate: 15 },
    carpentry: { avgLeadValue: 650, conversionRate: 18 },
    flooring: { avgLeadValue: 900, conversionRate: 15 },
    pest_control: { avgLeadValue: 200, conversionRate: 30 },
    other: { avgLeadValue: 500, conversionRate: 15 }
  };

  // Handle industry change
  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    setIndustry(selectedIndustry);
    
    if (industryPresets[selectedIndustry]) {
      setAvgLeadValue(industryPresets[selectedIndustry].avgLeadValue);
      setConversionRate(industryPresets[selectedIndustry].conversionRate);
    }
  };

  // Calculate ROI whenever inputs change
  useEffect(() => {
    // Days per month
    const daysPerMonth = 
      daysOpen === "weekdays" ? 22 : 
      daysOpen === "sixdays" ? 26 : 30;
    
    // Monthly calculations
    const totalMonthlyCalls = (businessHourCalls * daysPerMonth) + (afterHourCalls * 30);
    const monthlyMissedBusinessHourCalls = missedBusinessHourCalls * daysPerMonth;
    const monthlyAfterHourCalls = afterHourCalls * 30;
    const totalMissedCalls = monthlyMissedBusinessHourCalls + monthlyAfterHourCalls;
    const totalMinutes = totalMonthlyCalls * avgCallDuration;
    
    // Revenue & costs
    const salesMissedCalls = totalMissedCalls * (salesCallPercentage / 100);
    const valuePerCall = avgLeadValue * (conversionRate / 100);
    const potentialRevenueFromMissedCalls = salesMissedCalls * valuePerCall;
    
    const aiBaseCost = aiSubscriptionCost;
    const aiUsageCost = totalMinutes * aiPerMinuteCost;
    const aiTotalMonthlyCost = aiBaseCost + aiUsageCost;
    
    // For ROI calculations, we need to amortize the setup fee over a reasonable period (12 months)
    const aiSetupFeeMonthly = aiSetupFee / 12;
    const aiTotalCostWithSetup = aiTotalMonthlyCost + aiSetupFeeMonthly;
    
    // ROI calculation
    const costSavings = totalHumanCost - aiTotalMonthlyCost;
    const totalBenefit = costSavings + potentialRevenueFromMissedCalls;
    
    // ROI considers the setup fee
    const roi = aiTotalCostWithSetup > 0 ? (totalBenefit / aiTotalCostWithSetup) * 100 : 0;
    
    // Payback period in months (including setup fee)
    const totalInvestmentFirstYear = (aiTotalMonthlyCost * 12) + aiSetupFee;
    const annualBenefit = totalBenefit * 12;
    const paybackPeriod = annualBenefit > 0 ? totalInvestmentFirstYear / annualBenefit * 12 : 0;
    
    // Yearly calculations
    const yearlyCostSavings = costSavings * 12;
    const yearlyPotentialRevenue = potentialRevenueFromMissedCalls * 12;
    const yearlyNetBenefit = totalBenefit * 12;
    
    setResults({
      totalCalls: totalMonthlyCalls,
      missedCalls: totalMissedCalls,
      salesMissedCalls: salesMissedCalls,
      totalMinutes: totalMinutes,
      aiBaseCost: aiBaseCost,
      aiMinuteCost: aiUsageCost,
      aiSetupFee: aiSetupFee,
      aiSetupFeeMonthly: aiSetupFeeMonthly,
      aiTotalMonthlyCost: aiTotalMonthlyCost,
      aiTotalCostWithSetup: aiTotalCostWithSetup,
      humanCost: totalHumanCost,
      potentialRevenue: potentialRevenueFromMissedCalls,
      costSavings: costSavings,
      netBenefit: totalBenefit,
      roi: roi,
      paybackPeriod: paybackPeriod,
      yearlyCostSavings: yearlyCostSavings,
      yearlyPotentialRevenue: yearlyPotentialRevenue,
      yearlyNetBenefit: yearlyNetBenefit
    });
  }, [
    businessHourCalls, afterHourCalls, missedBusinessHourCalls, avgCallDuration,
    avgLeadValue, conversionRate, totalHumanCost, salesCallPercentage,
    daysOpen, aiSubscriptionCost, aiPerMinuteCost, aiSetupFee
  ]);
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <Card className="w-full">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-center">AI Receptionist ROI Calculator for Home Services</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - inputs */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Business Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <select 
                      value={industry}
                      onChange={handleIndustryChange}
                      className="w-full p-2 border rounded"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="hvac">HVAC</option>
                      <option value="electrician">Electrician</option>
                      <option value="landscaping">Landscaping & Lawn Care</option>
                      <option value="cleaning">Cleaning Services</option>
                      <option value="roofing">Roofing</option>
                      <option value="painting">Painting</option>
                      <option value="carpentry">Carpentry & Handyman</option>
                      <option value="flooring">Flooring Installation</option>
                      <option value="pest_control">Pest Control</option>
                      <option value="other">Other Home Services</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Select your home service business type to use industry-specific default values for customer value and conversion rates.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Days Open</label>
                    <select 
                      value={daysOpen}
                      onChange={(e) => setDaysOpen(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="weekdays">Monday-Friday (5 days/week)</option>
                      <option value="sixdays">Monday-Saturday (6 days/week)</option>
                      <option value="alldays">All Days (7 days/week)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Hours Calls (per day)</label>
                    <input 
                      type="number" 
                      value={businessHourCalls}
                      onChange={(e) => setBusinessHourCalls(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">After Hours Calls (per day)</label>
                    <input 
                      type="number" 
                      value={afterHourCalls}
                      onChange={(e) => setAfterHourCalls(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Missed Calls During Business Hours (per day)</label>
                    <input 
                      type="number" 
                      value={missedBusinessHourCalls}
                      onChange={(e) => setMissedBusinessHourCalls(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Average Call Duration (minutes)</label>
                    <input 
                      type="number" 
                      value={avgCallDuration}
                      onChange={(e) => setAvgCallDuration(parseInt(e.target.value) || 0)}
                      step="0.5"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              {/* Advanced Settings Toggle Button */}
              <div className="mt-4">
                <button
                  onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <span>{showAdvancedSettings ? 'Hide' : 'Show'} Advanced Settings</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAdvancedSettings ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                  </svg>
                </button>
              </div>
              
              {/* Advanced Settings Panel */}
              {showAdvancedSettings && (
                <div className="mt-4 p-4 border border-blue-200 rounded bg-blue-50">
                  <h4 className="text-md font-semibold mb-3">AI Pricing Parameters</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">One-time Setup Fee ($)</label>
                      <input 
                        type="number" 
                        value={aiSetupFee}
                        onChange={(e) => setAiSetupFee(parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Subscription Cost ($)</label>
                      <input 
                        type="number" 
                        value={aiSubscriptionCost}
                        onChange={(e) => setAiSubscriptionCost(parseInt(e.target.value) || 0)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Per-Minute Cost ($)</label>
                      <input 
                        type="number" 
                        value={aiPerMinuteCost}
                        onChange={(e) => setAiPerMinuteCost(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Revenue & Cost Data</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Sales Opportunity Calls (%)</label>
                    <input 
                      type="number" 
                      value={salesCallPercentage}
                      onChange={(e) => setSalesCallPercentage(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                
                  <div>
                    <label className="block text-sm font-medium mb-1">Average Value of New Lead ($)</label>
                    <input 
                      type="number" 
                      value={avgLeadValue}
                      onChange={(e) => setAvgLeadValue(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Conversion Rate (%)</label>
                    <input 
                      type="number" 
                      value={conversionRate}
                      onChange={(e) => setConversionRate(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Monthly Human Receptionist Total Cost ($)</label>
                    <input 
                      type="number" 
                      value={totalHumanCost}
                      onChange={(e) => setTotalHumanCost(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - results */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Call Analysis</h3>
                <div className="bg-gray-50 p-4 rounded space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Monthly Calls:</span>
                    <span className="font-medium">{results.totalCalls.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 text-xs">
                      (Business Hours Calls × Days/Month) + (After Hours Calls × 30 days)
                    </span>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">Currently Missed Calls:</span>
                    <span className="font-medium">{results.missedCalls.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 text-xs">
                      (Missed Business Hours Calls × Days/Month) + (All After Hours Calls × 30 days)
                    </span>
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">Missed Sales Opportunities:</span>
                    <span className="font-medium">{results.salesMissedCalls.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 text-xs">
                      Missed Calls × Sales Opportunity Percentage
                    </span>
                  </div>
                  
                  <div className="pt-3 mt-2 border-t">
                    <h5 className="text-sm font-semibold mb-2">AI Receptionist Cost:</h5>
                    <div className="flex justify-between">
                      <span className="text-sm">One-time Setup Fee:</span>
                      <span className="font-medium">${results.aiSetupFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Subscription:</span>
                      <span className="font-medium">${results.aiBaseCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Usage Cost:</span>
                      <span className="font-medium">${results.aiMinuteCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-1 font-medium">
                      <span className="text-sm">Total Monthly Cost:</span>
                      <span>${results.aiTotalMonthlyCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Monthly Subscription + (Total Minutes × Per-Minute Cost)
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-medium">Effective Monthly Cost (with setup):</span>
                      <span className="font-medium">${results.aiTotalCostWithSetup.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Total Monthly Cost + (Setup Fee ÷ 12 months)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-3 mt-2 border-t">
                    <span className="text-sm">Human Receptionist Cost:</span>
                    <span className="font-medium">${results.humanCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 text-xs">
                      Fixed monthly salary + benefits + overhead costs
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Financial Impact</h3>
                <div className="bg-blue-50 p-4 rounded space-y-3">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Cost Savings:</span>
                      <span className="font-medium">${results.costSavings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Human Receptionist Cost - AI Monthly Cost (excluding setup)
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Potential Added Revenue:</span>
                      <span className="font-medium">${results.potentialRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Missed Sales Calls × Lead Value × Conversion Rate
                      </span>
                    </div>
                    
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="text-sm font-semibold">Total Monthly Benefit:</span>
                      <span className="font-semibold">${results.netBenefit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Cost Savings + Potential Added Revenue
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">First Year Investment:</span>
                      <span className="font-semibold">${(results.aiTotalMonthlyCost * 12 + results.aiSetupFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        (Monthly Cost × 12) + Setup Fee
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-semibold">Total Annual Benefit:</span>
                      <span className="font-semibold">${results.yearlyNetBenefit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Total Monthly Benefit × 12 months
                      </span>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <span className="text-sm font-semibold">First Year Net Return:</span>
                      <span className="font-semibold">${(results.yearlyNetBenefit - results.aiSetupFee).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 text-xs">
                        Annual Benefit - Setup Fee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded">
                <h3 className="text-lg font-semibold mb-3">Return on Investment</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {results.roi.toFixed(0)}%
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-md font-semibold">Payback Period</div>
                    <div className="text-xl font-bold text-blue-700">
                      {results.paybackPeriod > 0 ? 
                        results.paybackPeriod > 12 ? 
                          `${(results.paybackPeriod / 12).toFixed(1)} years` : 
                          `${results.paybackPeriod.toFixed(1)} months` 
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Cost Comparison Chart */}
              <div className="mt-6 bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-3">Cost & Benefit Visualization</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Monthly',
                          'Human Cost': results.humanCost,
                          'Total AI Cost': results.aiTotalMonthlyCost + results.aiSetupFeeMonthly,
                          'Total Benefit': results.netBenefit
                        }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="Human Cost" fill="#8884d8" />
                      <Bar dataKey="Total AI Cost" fill="#82ca9d" />
                      <Bar dataKey="Total Benefit" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                <p className="font-medium mb-2 text-blue-800">Key Insights: How much better off financially will my business be by using the AI receptionist?</p>
                <div className="bg-white p-3 rounded shadow-sm">
                  <ul className="list-disc pl-5 mt-1 space-y-2">
                    {results.missedCalls > 0 && (
                      <li className="py-1">Your business is missing approximately <span className="font-semibold text-red-600">{results.missedCalls.toFixed(0)}</span> calls per month that could be captured with an AI receptionist.</li>
                    )}
                    
                    {results.costSavings > 0 && (
                      <li className="py-1 border-b pb-2">
                        <div className="font-medium">Monthly Net Return: <span className="font-semibold text-green-600">${(results.netBenefit - results.aiSetupFeeMonthly).toFixed(2)}</span></div>
                        <div className="text-sm mt-1">
                          <span className="text-gray-700">This comes from:</span>
                          <ul className="ml-4 mt-1 space-y-1 list-disc">
                            <li>Cost savings: <span className="font-semibold">${results.costSavings.toFixed(2)}</span> (Human cost ${results.humanCost} - AI monthly cost ${results.aiTotalMonthlyCost.toFixed(2)})</li>
                            <li>Added revenue: <span className="font-semibold">${results.potentialRevenue.toFixed(2)}</span> from captured missed calls</li>
                            <li>Setup fee: <span className="font-semibold">-${results.aiSetupFeeMonthly.toFixed(2)}</span> (amortized monthly)</li>
                          </ul>
                        </div>
                        <div className="mt-2">Your annual net return totals <span className="font-semibold text-green-600">${((results.netBenefit - results.aiSetupFeeMonthly) * 12).toFixed(2)}</span>.</div>
                      </li>
                    )}
                    
                    {results.netBenefit > 0 && (
                      <li className="py-1">
                        <div className="font-medium">Monthly Benefit Breakdown: <span className="font-semibold text-green-600">${results.netBenefit.toFixed(2)}</span></div>
                        <div className="text-sm mt-1">
                          This total monthly benefit of <span className="font-semibold">${results.netBenefit.toFixed(2)}</span> includes both cost savings (<span className="font-semibold">${results.costSavings.toFixed(2)}</span>) and new revenue from captured calls (<span className="font-semibold">${results.potentialRevenue.toFixed(2)}</span>), which is <span className="font-semibold text-blue-600">${(results.netBenefit - (results.humanCost - results.aiTotalCostWithSetup)).toFixed(2)}</span> more than just the cost difference between human and AI receptionists.
                        </div>
                      </li>
                    )}
                    
                    {results.paybackPeriod > 0 && (
<li className="py-1">Your investment will pay for itself in <span className="font-semibold text-blue-600">{results.paybackPeriod.toFixed(1)} months</span>, after which the solution becomes pure profit-generating compared to your current situation.</li>
                    )}
                    
                    {results.roi > 0 && (
                      <li className="py-1">Your direct ROI of <span className="font-semibold text-green-600">{results.roi.toFixed(0)}%</span> indicates that for every dollar invested in the AI receptionist solution, you'll receive ${(results.roi/100 + 1).toFixed(2)} in return.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AIReceptionistROICalculator;