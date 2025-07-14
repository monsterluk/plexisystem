import { MaterialType, ProductType } from './types';
import { roundToTwoDecimals } from './utils';

interface CalculationInput {
  width: number;
  height: number;
  depth: number;
  thickness: number;
  quantity: number;
  materialPrice: number;
  wastePercentage: number;
  profitMultiplier: number;
  extraOptionsCost: number;
  materialDensity: number;
}

interface CalculationResult {
  area: number;
  weightPerPiece: number;
  totalWeight: number;
  materialCost: number;
  wasteCost: number;
  extrasCost: number;
  costWithoutMargin: number;
  finalPrice: number;
}

export function calculateCosts({
  width,
  height,
  depth,
  thickness,
  quantity,
  materialPrice,
  wastePercentage,
  profitMultiplier,
  extraOptionsCost,
  materialDensity,
}: CalculationInput): CalculationResult {
  const area = ((width * height) + (width * depth) + (height * depth)) * 2 / 1_000_000; // m²
  const volume = (width / 1000) * (height / 1000) * (depth / 1000); // m³
  const weightPerPiece = roundToTwoDecimals(area * thickness * materialDensity); // kg/szt.
  const totalWeight = roundToTwoDecimals(weightPerPiece * quantity);

  const materialCost = roundToTwoDecimals(area * thickness * materialPrice);
  const wasteCost = roundToTwoDecimals(materialCost * (wastePercentage / 100));
  const extrasCost = roundToTwoDecimals(extraOptionsCost);

  const costWithoutMargin = materialCost + wasteCost + extrasCost;
  const finalPrice = roundToTwoDecimals(costWithoutMargin * profitMultiplier);

  return {
    area: roundToTwoDecimals(area),
    weightPerPiece,
    totalWeight,
    materialCost,
    wasteCost,
    extrasCost,
    costWithoutMargin: roundToTwoDecimals(costWithoutMargin),
    finalPrice,
  };
}