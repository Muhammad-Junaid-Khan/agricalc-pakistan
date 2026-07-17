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

  const getSchedule = (crop, fertilizerType) => {
    const scheduleMap = {
      wheat: 'Apply in 2 split doses, with the first at sowing and second at tillering.',
      cotton: 'Apply in 3 split doses, with the first at planting, second at flowering, and third at boll formation.',
      rice: 'Apply in 3 doses with basal, tillering, and panicle initiation stages.',
      maize: 'Use a 2-dose plan at sowing and knee-high stage.',
      sugarcane: 'Use a 4-part schedule with basal, tillering, grand growth, and maturity stages.'
    };
    if (fertilizerType?.toLowerCase().includes('urea')) {
      return 'Use a split application to reduce losses and improve nutrient efficiency.';
    }
    return scheduleMap[crop?.toLowerCase()] || 'Follow local agronomy guidance for split applications and soil testing.';
  };

  calculator.registerCalculator?.({
    formId: 'fertilizer-form',
    title: 'Fertilizer requirement estimate',
    fields: [
      { name: 'crop', label: 'Crop', required: true },
      { name: 'area', label: 'Area (acres)', required: true, type: 'number', min: 0 },
      { name: 'fertilizerType', label: 'Fertilizer type', required: true },
      { name: 'recommendedDose', label: 'Recommended dose (kg/acre)', required: true, type: 'number', min: 0 },
      { name: 'bagSize', label: 'Bag size (kg)', required: true, type: 'number', min: 0 },
      { name: 'costPerBag', label: 'Cost per bag (PKR)', required: true, type: 'number', min: 0 }
    ],
    calculate: (payload) => {
      const areaValue = Number(payload.area || 0);
      const dose = Number(payload.recommendedDose || 0);
      const bagSize = Number(payload.bagSize || 50);
      const costPerBag = Number(payload.costPerBag || 0);
      const totalWeight = areaValue * dose;
      const totalBags = bagSize > 0 ? totalWeight / bagSize : 0;
      const estimatedCost = totalBags * costPerBag;

      return {
        title: `${payload.fertilizerType || 'Fertilizer'} plan`,
        summary: `Need ${formatNumber(totalBags)} bags · ${formatNumber(totalWeight)} kg · ${formatCurrency(estimatedCost)}`,
        formula: 'Total weight = Area × Recommended dose',
        lines: [
          `Total bags required: ${formatNumber(totalBags, 0)}`,
          `Total weight: ${formatNumber(totalWeight)} kg`,
          `Estimated cost: ${formatCurrency(estimatedCost)}`,
          `Application schedule: ${getSchedule(payload.crop, payload.fertilizerType)}`
        ]
      };
    }
  });
})(window);
