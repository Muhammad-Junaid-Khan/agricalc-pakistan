(function (root) {
  'use strict';

  const namespace = root.AgriCalc || (root.AgriCalc = {});
  namespace.modules = namespace.modules || {};
  const calculator = namespace.modules.calculator || {};

  const formatNumber = (value, digits = 2) => Number(value || 0).toLocaleString('en-PK', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits === 0 ? 0 : 2
  });

  const landConversions = {
    acre: { acre: 1, kanal: 20, marla: 160, squareFeet: 43560, squareMeter: 4046.86, hectare: 0.404686 },
    kanal: { acre: 0.05, kanal: 1, marla: 20, squareFeet: 2178, squareMeter: 202.34, hectare: 0.02023 },
    marla: { acre: 0.00625, kanal: 0.05, marla: 1, squareFeet: 225, squareMeter: 20.234, hectare: 0.002023 },
    squareFeet: { acre: 0.00002296, kanal: 0.000459, marla: 0.004444, squareFeet: 1, squareMeter: 0.092903, hectare: 0.0000929 },
    squareMeter: { acre: 0.0002471, kanal: 0.004941, marla: 0.04939, squareFeet: 10.7639, squareMeter: 1, hectare: 0.0001 },
    hectare: { acre: 2.47105, kanal: 49.421, marla: 494.21, squareFeet: 107639, squareMeter: 10000, hectare: 1 }
  };

  const weightConversions = {
    gram: { gram: 1, kilogram: 0.001, maund: 0.000025, metricTon: 0.000001 },
    kilogram: { gram: 1000, kilogram: 1, maund: 0.025, metricTon: 0.001 },
    maund: { gram: 40000, kilogram: 40, maund: 1, metricTon: 0.04 },
    metricTon: { gram: 1000000, kilogram: 1000, maund: 25, metricTon: 1 }
  };

  calculator.registerCalculator?.({
    formId: 'land-form',
    title: 'Area conversion',
    fields: [
      { name: 'value', label: 'Value', required: true, type: 'number', min: 0 },
      { name: 'fromUnit', label: 'From unit', required: true }
    ],
    calculate: (payload) => {
      const value = Number(payload.value || 0);
      const fromUnit = payload.fromUnit || 'acre';
      const converted = landConversions[fromUnit] || landConversions.acre;
      const lines = [
        `Acre: ${formatNumber(converted.acre * value)}`,
        `Kanal: ${formatNumber(converted.kanal * value)}`,
        `Marla: ${formatNumber(converted.marla * value)}`,
        `Square feet: ${formatNumber(converted.squareFeet * value)}`,
        `Square meter: ${formatNumber(converted.squareMeter * value)}`,
        `Hectare: ${formatNumber(converted.hectare * value)}`
      ];
      return {
        title: 'Land area conversion',
        summary: `${formatNumber(value)} ${fromUnit} converted`,
        formula: 'Multi-unit conversion',
        lines
      };
    }
  });

  calculator.registerCalculator?.({
    formId: 'weight-form',
    title: 'Weight conversion',
    fields: [
      { name: 'value', label: 'Value', required: true, type: 'number', min: 0 },
      { name: 'fromUnit', label: 'From unit', required: true }
    ],
    calculate: (payload) => {
      const value = Number(payload.value || 0);
      const fromUnit = payload.fromUnit || 'kilogram';
      const converted = weightConversions[fromUnit] || weightConversions.kilogram;
      const lines = [
        `Gram: ${formatNumber(converted.gram * value)}`,
        `Kilogram: ${formatNumber(converted.kilogram * value)}`,
        `Maund: ${formatNumber(converted.maund * value)}`,
        `Metric ton: ${formatNumber(converted.metricTon * value)}`
      ];
      return {
        title: 'Weight conversion',
        summary: `${formatNumber(value)} ${fromUnit} converted`,
        formula: 'Multi-unit conversion',
        lines
      };
    }
  });
})(window);
