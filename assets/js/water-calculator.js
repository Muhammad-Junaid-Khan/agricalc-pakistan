(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const calculator = namespace.modules.calculator || {};

  const formatNumber = (value, digits = 2) => Number(value || 0).toLocaleString('en-PK', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits === 0 ? 0 : 2
  });

  const waterFactor = {
    wheat: { early: 0.75, vegetative: 1, flowering: 1.15, maturity: 0.9 },
    rice: { early: 1.1, vegetative: 1.25, flowering: 1.35, maturity: 1.05 },
    cotton: { early: 0.8, vegetative: 1.05, flowering: 1.2, maturity: 0.95 },
    maize: { early: 0.8, vegetative: 1.1, flowering: 1.15, maturity: 0.9 },
    sugarcane: { early: 0.85, vegetative: 1.1, flowering: 1.2, maturity: 1.0 }
  };

  const seasonalFactor = { kharif: 1.1, rabi: 1, summer: 1.15, autumn: 1.05 };

  calculator.registerCalculator?.({
    formId: 'water-form',
    title: 'Water requirement estimate',
    fields: [
      { name: 'crop', label: 'Crop', required: true },
      { name: 'area', label: 'Area (acres)', required: true, type: 'number', min: 0 },
      { name: 'growthStage', label: 'Growth stage', required: true },
      { name: 'season', label: 'Season', required: true }
    ],
    calculate: (payload) => {
      const areaValue = Number(payload.area || 0);
      const crop = (payload.crop || '').toLowerCase();
      const stage = (payload.growthStage || '').toLowerCase();
      const season = (payload.season || '').toLowerCase();
      const factor = waterFactor[crop]?.[stage] || 1;
      const seasonMultiplier = seasonalFactor[season] || 1;
      const depthMm = 600 * factor * seasonMultiplier;
      const waterNeeded = areaValue * 4046.86 * (depthMm / 1000);
      const weeklyRequirement = waterNeeded / 4;
      const monthlyRequirement = waterNeeded;

      return {
        title: `${payload.crop || 'Crop'} irrigation plan`,
        summary: `Water needed ${formatNumber(waterNeeded)} liters`,
        formula: 'Water = Area × Depth × Conversion factor',
        lines: [
          `Water needed: ${formatNumber(waterNeeded)} liters`,
          `Weekly requirement: ${formatNumber(weeklyRequirement)} liters`,
          `Monthly requirement: ${formatNumber(monthlyRequirement)} liters`
        ]
      };
    }
  });
})(window);
