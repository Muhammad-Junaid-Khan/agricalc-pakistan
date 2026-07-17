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
    formId: 'crop-form',
    title: 'Crop planning summary',
    fields: [
      { name: 'crop', label: 'Crop', required: true },
      { name: 'area', label: 'Area (acres)', required: true, type: 'number', min: 0 },
      { name: 'expectedYield', label: 'Expected yield (kg/acre)', required: true, type: 'number', min: 0 },
      { name: 'marketPrice', label: 'Market price (PKR/kg)', required: true, type: 'number', min: 0 },
      { name: 'harvestCost', label: 'Harvest cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'transportCost', label: 'Transport cost (PKR)', required: true, type: 'number', min: 0 },
      { name: 'otherExpenses', label: 'Other expenses (PKR)', required: true, type: 'number', min: 0 }
    ],
    calculate: (payload) => {
      const areaValue = Number(payload.area || 0);
      const expectedYield = Number(payload.expectedYield || 0);
      const marketPrice = Number(payload.marketPrice || 0);
      const harvestCost = Number(payload.harvestCost || 0);
      const transportCost = Number(payload.transportCost || 0);
      const otherExpenses = Number(payload.otherExpenses || 0);

      const totalProduction = areaValue * expectedYield;
      const grossIncome = totalProduction * marketPrice;
      const totalExpenses = harvestCost + transportCost + otherExpenses;
      const netProfit = grossIncome - totalExpenses;
      const profitPerAcre = areaValue ? netProfit / areaValue : 0;
      const breakEven = marketPrice > 0 ? totalExpenses / marketPrice : 0;

      return {
        title: `${payload.crop || 'Crop'} performance estimate`,
        summary: `Production ${formatNumber(totalProduction)} kg · Net profit ${formatCurrency(netProfit)}`,
        formula: 'Production = Area × Expected yield',
        lines: [
          `Total production: ${formatNumber(totalProduction)} kg`,
          `Gross income: ${formatCurrency(grossIncome)}`,
          `Net profit: ${formatCurrency(netProfit)}`,
          `Profit per acre: ${formatCurrency(profitPerAcre)}`,
          `Break-even point: ${formatNumber(breakEven)} kg`
        ]
      };
    }
  });
})(window);
