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
    formId: 'seed-form',
    title: 'Seed requirement estimate',
    fields: [
      { name: 'crop', label: 'Crop', required: true },
      { name: 'area', label: 'Area (acres)', required: true, type: 'number', min: 0 },
      { name: 'seedRate', label: 'Seed rate (kg/acre)', required: true, type: 'number', min: 0 },
      { name: 'seedCost', label: 'Seed cost (PKR/kg)', required: true, type: 'number', min: 0 }
    ],
    calculate: (payload) => {
      const areaValue = Number(payload.area || 0);
      const seedRate = Number(payload.seedRate || 0);
      const seedCost = Number(payload.seedCost || 0);
      const requiredSeed = areaValue * seedRate;
      const estimatedCost = requiredSeed * seedCost;

      return {
        title: `${payload.crop || 'Seed'} plan`,
        summary: `Need ${formatNumber(requiredSeed)} kg · ${formatCurrency(estimatedCost)}`,
        formula: 'Required seed = Area × Seed rate',
        lines: [
          `Required seed: ${formatNumber(requiredSeed)} kg`,
          `Estimated cost: ${formatCurrency(estimatedCost)}`
        ]
      };
    }
  });
})(window);
