(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const calculator = namespace.modules.calculator || {};

  const formatNumber = (value, digits = 2) => Number(value || 0).toLocaleString('en-PK', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits === 0 ? 0 : 2
  });

  const formatCurrency = (value) => new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));

  calculator.registerCalculator?.({
    formId: 'profit-form',
    title: 'Profitability summary',
    fields: [
      { name: 'seedCost', label: 'Seed cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'fertilizerCost', label: 'Fertilizer cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'pesticideCost', label: 'Pesticide cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'labour', label: 'Labour cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'transport', label: 'Transport cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'miscellaneous', label: 'Miscellaneous cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'sellingPrice', label: 'Selling price (PKR/kg)', required: true, type: 'number', min: 0 },
      { name: 'production', label: 'Production (kg)', required: true, type: 'number', min: 0 }
    ],
    calculate: (payload) => {
      const seedCost = Number(payload.seedCost || 0);
      const fertilizerCost = Number(payload.fertilizerCost || 0);
      const pesticideCost = Number(payload.pesticideCost || 0);
      const labour = Number(payload.labour || 0);
      const transport = Number(payload.transport || 0);
      const miscellaneous = Number(payload.miscellaneous || 0);
      const sellingPrice = Number(payload.sellingPrice || 0);
      const production = Number(payload.production || 0);

      const revenue = production * sellingPrice;
      const expenses = seedCost + fertilizerCost + pesticideCost + labour + transport + miscellaneous;
      const netProfit = revenue - expenses;
      const roi = expenses ? (netProfit / expenses) * 100 : 0;
      const profitPercentage = revenue ? (netProfit / revenue) * 100 : 0;

      return {
        title: 'Farm profitability result',
        summary: `Revenue ${formatCurrency(revenue)} · Net profit ${formatCurrency(netProfit)}`,
        formula: 'Revenue = Production × Selling price',
        lines: [
          `Revenue: ${formatCurrency(revenue)}`,
          `Expenses: ${formatCurrency(expenses)}`,
          `Net profit: ${formatCurrency(netProfit)}`,
          `ROI: ${formatNumber(roi)}%`,
          `Profit percentage: ${formatNumber(profitPercentage)}%`
        ]
      };
    }
  });
})(window);
