// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Material, AdditionalOption, CalculatorItem, ProductParams } from '@/types/Offer';
import { productTypes, expositorTypes } from '@/constants/materials';
import { materials } from '@/constants/materials';
import { additionalOptions } from '@/constants/options';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CalculatorProps {
  onAddToOffer: (item: CalculatorItem) => void;
  viewMode?: 'salesperson' | 'client';
}

export const Calculator: React.FC<CalculatorProps> = ({ onAddToOffer, viewMode = 'salesperson' }) => {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedExpositorType, setSelectedExpositorType] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [thickness, setThickness] = useState(3);
  const [dimensions, setDimensions] = useState({
    width: 300,
    height: 200,
    depth: 150,
  });
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({});

  const [productParams, setProductParams] = useState<ProductParams>({
    shelves: 3,
    partitions: 0,
    ledLength: 100,
    hookRows: 3,
    hookCols: 4,
    pockets: 3,
    kasetonType: 'plexi' as 'plexi' | 'dibond',
    bottomMaterial: '',
    bottomThickness: 3,
  });

  const [calculations, setCalculations] = useState({
    surface: 0,
    weight: 0,
    materialCost: 0,
    optionsCost: 0,
    unitPrice: 0,
    totalPrice: 0,
    piecesPerPallet: 0,
    piecesPerBox: 0,
    totalWeight: 0,
    boxDimensions: { width: 0, height: 0, depth: 0 },
    boxSurface: 0,
    boxWeight: 0,
    piecesPerBoxOptimal: 0,
    boxesTotal: 0,
    palletsTotal: 0,
    palletLayers: 0,
    boxesPerLayer: 0,
    costBreakdown: {
      materialCost: 0,
      wasteCost: 0,
      laborCost: 0,
      optionsCost: 0,
      margin: 0,
    },
  });

  // Funkcja obliczająca powierzchnię
  const calculateSurface = (): number => {
    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    switch (selectedProduct) {
      case 'formatka':
        return w * h;

      case 'pojemnik':
        const frontBack = 2 * (w * h);
        const sides = 2 * (d * h);
        let bottomArea = w * d;

        if (selectedOptions.dno_inny_material && productParams.bottomMaterial) {
          bottomArea = 0;
        }

        const lid = selectedOptions.wieko ? w * d : 0;
        const partitionArea = productParams.partitions * h * d;
        return frontBack + sides + bottomArea + lid + partitionArea;

      case 'gablota':
        return 2 * (w * h) + 2 * (d * h) + w * d + (selectedOptions.wieko ? w * d : 0);

      case 'obudowa':
        return 2 * (w * h) + 2 * (d * h) + w * d;

      case 'ekspozytor':
        return calculateExpositorSurface(w, h, d);

      case 'kaseton':
        return w * h;

      case 'ledon':
        return w * h;

      case 'impuls':
        const back = w * h;
        const impSides = 2 * (d * h);
        const shelvesArea = productParams.shelves * w * d;
        const dividers = productParams.shelves * 2 * (d * 0.05);
        return back + impSides + shelvesArea + dividers;

      default:
        return w * h;
    }
  };

  // Funkcja obliczająca powierzchnię ekspozytorów
  const calculateExpositorSurface = (w: number, h: number, d: number): number => {
    switch (selectedExpositorType) {
      case 'podstawkowy':
        const base = w * d;
        const back = w * h;
        const sides = 2 * (d * h);
        const topper = selectedOptions.topper ? w * (h * 0.2) : 0;
        return base + back + sides + topper;

      case 'schodkowy':
        const baseArea = w * d;
        const backArea = w * h;
        const sidesArea = 2 * (d * h);
        const stepArea = productParams.shelves * w * (d / productParams.shelves);
        const risers = productParams.shelves * w * 0.05;
        return baseArea + backArea + sidesArea + stepArea + risers;

      case 'z_haczykami':
        return w * d + w * h + 2 * (d * h) + (selectedOptions.topper ? w * (h * 0.2) : 0);

      case 'wiszacy':
        const backPanel = w * h;
        const pockets = productParams.pockets * w * 0.1;
        return backPanel + pockets;

      case 'stojak':
        const heavyBase = w * d * 1.5;
        const frame = 2 * (h * 0.1);
        const segments = productParams.shelves * w * 0.2;
        return heavyBase + frame + segments;

      case 'kosmetyczny':
        const kosBase = w * d;
        const kosBack = w * h;
        const kosSides = 2 * (d * h);
        const kosShelves = productParams.shelves * w * d;
        const kosDividers = productParams.shelves * productParams.partitions * d * 0.08;
        return kosBase + kosBack + kosSides + kosShelves + kosDividers;

      default:
        return w * h + 2 * (d * h) + w * d;
    }
  };

  // Funkcja obliczająca wagę
  const calculateWeight = (surface: number, material: Material | undefined, thickness: number): number => {
    const densityKgM3 = material?.density || 1190;
    const thicknessMm = thickness || 3;
    return surface * (thicknessMm / 1000) * densityKgM3;
  };

  // Funkcja obliczająca wymiary kartonu
  const calculateBoxDimensions = () => {
    const isFlat = ['formatka', 'kaseton', 'ledon'].includes(selectedProduct);

    if (isFlat) {
      return {
        width: dimensions.width + 40,
        height: dimensions.height + 40,
        depth: Math.max(thickness * quantity + 20, 50),
      };
    } else {
      return {
        width: dimensions.width + 40,
        height: dimensions.height + 40,
        depth: dimensions.depth + 40,
      };
    }
  };

  // Funkcja obliczająca ilość w kartonie zbiorczym
  const calculatePiecesPerBox = (productDims: any, _boxDims: any): number => {
    const maxBoxDims = { width: 600, height: 400, depth: 400 };

    if (['formatka', 'kaseton', 'ledon'].includes(selectedProduct)) {
      const stackHeight = Math.floor((maxBoxDims.depth - 20) / thickness);
      return Math.max(1, Math.min(stackHeight, 50));
    }

    const orientations = [
      { w: productDims.width, h: productDims.height, d: productDims.depth },
      { w: productDims.width, h: productDims.depth, d: productDims.height },
      { w: productDims.height, h: productDims.width, d: productDims.depth },
      { w: productDims.height, h: productDims.depth, d: productDims.width },
      { w: productDims.depth, h: productDims.width, d: productDims.height },
      { w: productDims.depth, h: productDims.height, d: productDims.width },
    ];

    let maxPieces = 1;

    orientations.forEach((orient) => {
      const piecesX = Math.floor(maxBoxDims.width / (orient.w + 10));
      const piecesY = Math.floor(maxBoxDims.height / (orient.h + 10));
      const piecesZ = Math.floor(maxBoxDims.depth / (orient.d + 10));
      const total = piecesX * piecesY * piecesZ;
      if (total > maxPieces) maxPieces = total;
    });

    return Math.max(1, maxPieces);
  };

  // Funkcja obliczająca układ na palecie
  const calculatePalletArrangement = (boxDims: any) => {
    const palletDims = { width: 1200, height: 800 };
    const maxHeight = 1656;

    const arrangements = [
      { w: boxDims.width, d: boxDims.depth },
      { w: boxDims.depth, d: boxDims.width },
    ];

    let bestArrangement = { boxesPerLayer: 0, layers: 0 };

    arrangements.forEach((arr) => {
      const boxesX = Math.floor(palletDims.width / arr.w);
      const boxesY = Math.floor(palletDims.height / arr.d);
      const boxesPerLayer = boxesX * boxesY;
      const layers = Math.floor(maxHeight / boxDims.height);

      if (boxesPerLayer * layers > bestArrangement.boxesPerLayer * bestArrangement.layers) {
        bestArrangement = {
          boxesPerLayer,
          layers,
        };
      }
    });

    return bestArrangement;
  };

  // Funkcja obliczająca koszt opcji
  const calculateOptionsCost = (): number => {
    let cost = 0;
    const surface = calculateSurface();
    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    Object.entries(selectedOptions).forEach(([optionId, isSelected]) => {
      if (isSelected && optionId !== 'wieko') {
        const option = additionalOptions.find((o) => o.id === optionId);
        if (option) {
          const qty = optionQuantities[optionId] || 1;

          if (option.unit === 'm²') {
            cost += option.price * surface;
          } else if (option.unit === 'mb') {
            if (optionId === 'polerowanie') {
              let edgeLength = 0;

              if (selectedProduct === 'formatka') {
                edgeLength = 2 * (w + h);
              } else if (['pojemnik', 'gablota'].includes(selectedProduct)) {
                edgeLength = 2 * (2 * w + 2 * h) + 2 * (2 * d + 2 * h) + 2 * w + 2 * d;
                if (selectedOptions.wieko) {
                  edgeLength += 2 * w + 2 * d;
                }
              } else if (selectedProduct === 'ekspozytor') {
                edgeLength = calculateExpositorEdges();
              } else if (selectedProduct === 'impuls') {
                edgeLength = 2 * (w + h) + 4 * d + productParams.shelves * 2 * w;
              }

              cost += option.price * edgeLength;
            } else if (optionId.includes('led')) {
              const ledLengthM = productParams.ledLength / 100;
              cost += option.price * ledLengthM;
            } else if (optionId === 'tasma') {
              cost += option.price * qty;
            }
          } else if (option.unit === 'szt' || option.unit === 'komplet') {
            cost += option.price * qty;
          }
        }
      }
    });

    if (selectedOptions.led_standard || selectedOptions.led_cob || selectedOptions.led_rgb) {
      if (!selectedOptions.zasilacz_led) {
        cost += 80;
      }
    }

    return cost;
  };

  // Funkcja pomocnicza do obliczania krawędzi ekspozytorów
  const calculateExpositorEdges = (): number => {
    const w = dimensions.width / 1000;
    const h = dimensions.height / 1000;
    const d = dimensions.depth / 1000;

    switch (selectedExpositorType) {
      case 'podstawkowy':
        return 2 * w + 2 * d + 2 * h + w;
      case 'schodkowy':
        return 2 * w + 2 * d + 2 * h + productParams.shelves * w;
      case 'z_haczykami':
        return 2 * w + 2 * d + 2 * h + w;
      case 'wiszacy':
        return 2 * (w + h);
      case 'stojak':
        return 2 * (w + d) + 4 * h;
      case 'kosmetyczny':
        return 2 * w + 2 * d + 2 * h + productParams.shelves * 2 * w;
      default:
        return 2 * (w + h);
    }
  };

  // Główna funkcja kalkulacyjna
  useEffect(() => {
    if (selectedProduct && (selectedProduct !== 'ekspozytor' || selectedExpositorType)) {
      if (selectedProduct === 'kaseton' && productParams.kasetonType) {
        const surface = calculateSurface();
        const basePrice = productParams.kasetonType === 'plexi' ? 1550 : 1400;
        let optionsCost = calculateOptionsCost();
        const unitPrice = basePrice * surface + optionsCost;
        const weight = productParams.kasetonType === 'plexi' ? surface * 0.003 * 1190 : surface * 0.003 * 1500;

        const boxDims = calculateBoxDimensions();
        const boxSurface = (2 * (boxDims.width * boxDims.height + boxDims.width * boxDims.depth + boxDims.height * boxDims.depth)) / 1000000;
        const boxWeight = boxSurface * 0.6;
        const piecesPerBox = calculatePiecesPerBox(dimensions, boxDims);
        const boxesTotal = Math.ceil(quantity / piecesPerBox);
        const palletInfo = calculatePalletArrangement(boxDims);
        const palletsTotal = Math.ceil(boxesTotal / (palletInfo.boxesPerLayer * palletInfo.layers));

        const materialCost = basePrice * surface * 0.4;
        const wasteCost = materialCost * 0.08;
        const laborCost = basePrice * surface * 0.2; // 20% robocizna dla kasetonów
        const margin = unitPrice - materialCost - wasteCost - laborCost - optionsCost;

        setCalculations({
          surface: surface,
          weight: weight,
          materialCost: basePrice * surface,
          optionsCost: optionsCost,
          unitPrice: unitPrice,
          totalPrice: unitPrice * quantity,
          piecesPerPallet: palletInfo.boxesPerLayer * palletInfo.layers * piecesPerBox,
          piecesPerBox: piecesPerBox,
          totalWeight: weight * quantity,
          boxDimensions: boxDims,
          boxSurface: boxSurface,
          boxWeight: boxWeight,
          piecesPerBoxOptimal: piecesPerBox,
          boxesTotal: boxesTotal,
          palletsTotal: palletsTotal,
          palletLayers: palletInfo.layers,
          boxesPerLayer: palletInfo.boxesPerLayer,
          costBreakdown: {
            materialCost,
            wasteCost,
            laborCost,
            optionsCost,
            margin,
          },
        });

        return;
      }

      const product = productTypes.find((p) => p.id === selectedProduct);
      const material = materials.find((m) => m.id === selectedMaterial);

      if (product && material) {
        const surface = calculateSurface();
        const surfaceWithWaste = surface * (1 + product.waste);

        let materialCost = material.basePrice * thickness * surfaceWithWaste;

        if (selectedMaterial === 'plexi_color') {
          materialCost *= material.colorMultiplier || 1.4;
        }

        if (selectedOptions.klejenie_uv) {
          materialCost *= 1.1;
        }

        if (selectedProduct === 'pojemnik' && selectedOptions.dno_inny_material && productParams.bottomMaterial) {
          const bottomMaterial = materials.find((m) => m.id === productParams.bottomMaterial);
          if (bottomMaterial) {
            const bottomArea = (dimensions.width / 1000) * (dimensions.depth / 1000);
            const bottomAreaWithWaste = bottomArea * (1 + product.waste);
            let bottomCost = bottomMaterial.basePrice * productParams.bottomThickness * bottomAreaWithWaste;

            if (productParams.bottomMaterial === 'plexi_color') {
              bottomCost *= bottomMaterial.colorMultiplier || 1.4;
            }

            materialCost += bottomCost;
          }
        }

        let optionsCost = calculateOptionsCost();

        if (selectedProduct === 'ledon') {
          const ledLengthM = productParams.ledLength / 100;

          if (!selectedOptions.led_standard && !selectedOptions.led_cob && !selectedOptions.led_rgb) {
            optionsCost += 30 * ledLengthM;
          }

          if (selectedOptions.wodoodpornosc) {
            const ledCost = optionsCost;
            optionsCost += ledCost * 0.15;
          }
        }

        const weight = calculateWeight(surface, material, thickness);

        const baseCost = materialCost;
        const wasteCost = baseCost * product.waste;
        const laborCost = baseCost * 0.333; // 33.3% robocizna przywrócona!
        const totalCostBeforeMargin = baseCost + laborCost;
        const unitPrice = totalCostBeforeMargin * product.multiplier + optionsCost;
        const margin = unitPrice - baseCost - wasteCost - laborCost - optionsCost;

        const boxDims = calculateBoxDimensions();
        const boxSurface = (2 * (boxDims.width * boxDims.height + boxDims.width * boxDims.depth + boxDims.height * boxDims.depth)) / 1000000;
        const boxWeight = boxSurface * 0.6;
        const piecesPerBox = calculatePiecesPerBox(dimensions, boxDims);
        const boxesTotal = Math.ceil(quantity / piecesPerBox);
        const palletInfo = calculatePalletArrangement(boxDims);
        const palletsTotal = Math.ceil(boxesTotal / (palletInfo.boxesPerLayer * palletInfo.layers));

        setCalculations({
          surface: surface,
          weight: weight,
          materialCost: materialCost,
          optionsCost: optionsCost,
          unitPrice: unitPrice,
          totalPrice: unitPrice * quantity,
          piecesPerPallet: palletInfo.boxesPerLayer * palletInfo.layers * piecesPerBox,
          piecesPerBox: piecesPerBox,
          totalWeight: weight * quantity + boxWeight * boxesTotal,
          boxDimensions: boxDims,
          boxSurface: boxSurface,
          boxWeight: boxWeight,
          piecesPerBoxOptimal: piecesPerBox,
          boxesTotal: boxesTotal,
          palletsTotal: palletsTotal,
          palletLayers: palletInfo.layers,
          boxesPerLayer: palletInfo.boxesPerLayer,
          costBreakdown: {
            materialCost: baseCost,
            wasteCost,
            laborCost,
            optionsCost,
            margin,
          },
        });
      }
    }
  }, [
    selectedProduct,
    selectedExpositorType,
    selectedMaterial,
    thickness,
    dimensions,
    quantity,
    selectedOptions,
    optionQuantities,
    productParams,
  ]);

  // Funkcje pomocnicze
  const adjustDimension = (dim: 'width' | 'height' | 'depth', delta: number) => {
    setDimensions((prev) => ({
      ...prev,
      [dim]: Math.max(10, Math.min(2000, prev[dim] + delta)),
    }));
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const adjustOptionQuantity = (optionId: string, delta: number) => {
    setOptionQuantities((prev) => ({
      ...prev,
      [optionId]: Math.max(1, (prev[optionId] || 1) + delta),
    }));
  };

  const adjustProductParam = (param: string, delta: number) => {
    setProductParams((prev) => ({
      ...prev,
      [param]: Math.max(0, (prev as any)[param] + delta),
    }));
  };

  // Filtrowanie opcji w zależności od produktu
  const getAvailableOptions = (): AdditionalOption[] => {
    let options = [...additionalOptions];

    if (selectedProduct === 'kaseton') {
      return options.filter((o) =>
        ['litery_podklejane', 'litery_zlicowane', 'litery_wystajace', 'litery_halo', 'led_standard', 'led_cob', 'led_rgb', 'zasilacz_led'].includes(o.id)
      );
    }

    if (selectedProduct === 'ledon') {
      return options.filter((o) =>
        ['led_standard', 'led_cob', 'led_rgb', 'projekt_led', 'wodoodpornosc', 'zasilacz_led'].includes(o.id)
      );
    }

    if (selectedProduct === 'ekspozytor') {
      const baseOptions = ['grafika', 'grafika_dwustronna', 'polerowanie', 'karton'];
      if (['podstawkowy', 'z_haczykami', 'kosmetyczny'].includes(selectedExpositorType)) {
        baseOptions.push('topper', 'led_standard', 'zasilacz_led');
      }
      return options.filter((o) => baseOptions.includes(o.id));
    }

    if (['pojemnik', 'gablota'].includes(selectedProduct)) {
      const baseOptions = ['grafika', 'polerowanie', 'zawiasy', 'zamek', 'karton', 'klejenie_uv', 'nozki'];
      if (selectedProduct === 'pojemnik') {
        baseOptions.push('dno_inny_material');
      }
      return options.filter((o) => baseOptions.includes(o.id));
    }

    if (selectedProduct === 'obudowa') {
      return options.filter((o) =>
        ['grafika', 'polerowanie', 'karton', 'klejenie_uv', 'tasma'].includes(o.id)
      );
    }

    if (selectedProduct === 'formatka') {
      return options.filter((o) => ['polerowanie', 'karton'].includes(o.id));
    }

    if (selectedProduct === 'impuls') {
      return options.filter((o) =>
        ['grafika', 'grafika_dwustronna', 'polerowanie'].includes(o.id)
      );
    }

    return options;
  };

  // Funkcja dodawania do oferty
  const handleAddToOffer = () => {
    if (!selectedProduct || !selectedMaterial || calculations.unitPrice === 0) {
      alert('Wypełnij wszystkie wymagane pola');
      return;
    }

    const item: CalculatorItem = {
      id: Date.now(),
      product: selectedProduct,
      productName: productTypes.find((p) => p.id === selectedProduct)?.name || '',
      expositorType: selectedExpositorType,
      material: selectedMaterial,
      materialName: materials.find((m) => m.id === selectedMaterial)?.name || '',
      thickness,
      dimensions,
      quantity,
      options: selectedOptions,
      optionQuantities,
      productParams,
      calculations,
      unitPrice: calculations.unitPrice,
      totalPrice: calculations.totalPrice,
      costBreakdown: calculations.costBreakdown,
    };

    onAddToOffer(item);

    // Reset formularza
    setSelectedProduct('');
    setSelectedExpositorType('');
    setSelectedMaterial('');
    setThickness(3);
    setDimensions({ width: 300, height: 200, depth: 150 });
    setQuantity(1);
    setSelectedOptions({});
    setOptionQuantities({});
    setProductParams({
      shelves: 3,
      partitions: 0,
      ledLength: 100,
      hookRows: 3,
      hookCols: 4,
      pockets: 3,
      kasetonType: 'plexi',
      bottomMaterial: '',
      bottomThickness: 3,
    });
  };

  return (
    <div className="space-y-8">
      {/* Wybór produktu */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-orange-500">1.</span> Wybierz produkt
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {productTypes.map((product) => (
            <Card
              key={product.id}
              icon={product.icon}
              title={product.name}
              isActive={selectedProduct === product.id}
              onClick={() => {
                setSelectedProduct(product.id);
                setSelectedExpositorType('');
              }}
            />
          ))}
        </div>
      </div>

      {/* Wybór typu kasetonu */}
      {selectedProduct === 'kaseton' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-orange-500">1.1</span> Wybierz rodzaj kasetonu
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setProductParams({ ...productParams, kasetonType: 'plexi' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                productParams.kasetonType === 'plexi'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <p className="font-medium">Kaseton z plexi</p>
              <p className="text-sm text-gray-400 mt-1">1550 zł/m²</p>
            </button>
            <button
              onClick={() => setProductParams({ ...productParams, kasetonType: 'dibond' })}
              className={`p-4 rounded-xl border-2 transition-all ${
                productParams.kasetonType === 'dibond'
                  ? 'border-orange-500 bg-orange-500/10'
                  : 'border-zinc-700 hover:border-zinc-600'
              }`}
            >
              <p className="font-medium">Kaseton z dibond</p>
              <p className="text-sm text-gray-400 mt-1">1400 zł/m²</p>
            </button>
          </div>
        </div>
      )}

      {/* Wybór typu ekspozytora */}
      {selectedProduct === 'ekspozytor' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-orange-500">1.1</span> Wybierz typ ekspozytora
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {expositorTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedExpositorType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedExpositorType === type.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <p className="font-medium">{type.name}</p>
                <p className="text-xs text-gray-400 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Materiał i grubość */}
      {selectedProduct && (selectedProduct !== 'ekspozytor' || selectedExpositorType) && selectedProduct !== 'kaseton' && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-orange-500">2.</span> Materiał i grubość
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => {
                  setSelectedMaterial(material.id);
                  if (material.fixedThickness) {
                    setThickness(material.fixedThickness[0]);
                  }
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedMaterial === material.id
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-700 hover:border-zinc-600'
                }`}
              >
                <p className="font-medium">{material.name}</p>
                <p className="text-sm text-gray-400 mt-1">{material.basePrice} zł/m²</p>
                {material.colorMultiplier && (
                  <p className="text-xs text-orange-400 mt-1">
                    +{((material.colorMultiplier - 1) * 100).toFixed(0)}% dopłata
                  </p>
                )}
              </button>
            ))}
          </div>

          {selectedMaterial && (
            <div className="bg-zinc-800 rounded-xl p-6">
              <label className="block text-sm font-medium mb-3">Grubość materiału</label>
              {materials.find((m) => m.id === selectedMaterial)?.fixedThickness ? (
                <div className="flex gap-4">
                  {(materials.find((m) => m.id === selectedMaterial)?.fixedThickness || [3]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setThickness(t)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${
                        thickness === t ? 'bg-orange-500 text-white' : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      {t} mm
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={thickness}
                    onChange={(e) => setThickness(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>1 mm</span>
                    <span className="text-lg font-bold text-orange-500">{thickness} mm</span>
                    <span>20 mm</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Wymiary i ilość */}
      {((selectedMaterial && selectedProduct !== 'kaseton') || (selectedProduct === 'kaseton' && productParams.kasetonType)) && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-orange-500">{selectedProduct === 'kaseton' ? '2' : '3'}.</span> Wymiary i ilość
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">Szerokość</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustDimension('width', -10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                />
                <button
                  onClick={() => adjustDimension('width', 10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 w-10">mm</span>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">Wysokość</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustDimension('height', -10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => setDimensions({ ...dimensions, height: Number(e.target.value) })}
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                />
                <button
                  onClick={() => adjustDimension('height', 10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 w-10">mm</span>
              </div>
            </div>

            {selectedProduct !== 'formatka' && selectedProduct !== 'kaseton' && selectedProduct !== 'ledon' && (
              <div className="bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">Głębokość</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustDimension('depth', -10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={dimensions.depth}
                    onChange={(e) => setDimensions({ ...dimensions, depth: Number(e.target.value) })}
                    className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                  />
                  <button
                    onClick={() => adjustDimension('depth', 10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 w-10">mm</span>
                </div>
              </div>
            )}

            <div className="bg-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">Ilość sztuk</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustQuantity(-1)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                />
                <button
                  onClick={() => adjustQuantity(1)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400 w-10">szt</span>
              </div>
            </div>
          </div>

          {/* Parametry specyficzne */}
          {selectedProduct === 'pojemnik' && (
            <>
              <div className="mt-4 bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Liczba przegród wewnętrznych
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustProductParam('partitions', -1)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={productParams.partitions}
                    onChange={(e) =>
                      setProductParams({
                        ...productParams,
                        partitions: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono max-w-[100px]"
                  />
                  <button
                    onClick={() => adjustProductParam('partitions', 1)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedOptions.dno_inny_material && (
                <div className="mt-4 space-y-4">
                  <div className="bg-zinc-800 rounded-xl p-4">
                    <label className="block text-sm font-medium mb-2 text-gray-400">Materiał dna</label>
                    <div className="grid grid-cols-2 gap-2">
                      {materials.map((material) => (
                        <button
                          key={material.id}
                          onClick={() =>
                            setProductParams({
                              ...productParams,
                              bottomMaterial: material.id,
                            })
                          }
                          className={`p-2 rounded-lg text-sm transition-all ${
                            productParams.bottomMaterial === material.id
                              ? 'bg-orange-500 text-white'
                              : 'bg-zinc-700 hover:bg-zinc-600'
                          }`}
                        >
                          {material.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {productParams.bottomMaterial && (
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <label className="block text-sm font-medium mb-2 text-gray-400">Grubość dna</label>
                      <div className="flex gap-2">
                        {[3, 5, 8, 10].map((t) => (
                          <button
                            key={t}
                            onClick={() =>
                              setProductParams({
                                ...productParams,
                                bottomThickness: t,
                              })
                            }
                            className={`px-4 py-2 rounded-lg transition-all ${
                              productParams.bottomThickness === t
                                ? 'bg-orange-500 text-white'
                                : 'bg-zinc-700 hover:bg-zinc-600'
                            }`}
                          >
                            {t} mm
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {selectedProduct === 'ledon' && (
            <div className="mt-4 bg-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">Długość taśmy LED (cm)</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustProductParam('ledLength', -10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={productParams.ledLength}
                  onChange={(e) =>
                    setProductParams({
                      ...productParams,
                      ledLength: Math.max(10, Number(e.target.value)),
                    })
                  }
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono max-w-[100px]"
                />
                <button
                  onClick={() => adjustProductParam('ledLength', 10)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-400">cm</span>
              </div>
            </div>
          )}

          {(selectedProduct === 'impuls' ||
            (selectedProduct === 'ekspozytor' &&
              ['schodkowy', 'kosmetyczny'].includes(selectedExpositorType))) && (
            <div className="mt-4 bg-zinc-800 rounded-xl p-4">
              <label className="block text-sm font-medium mb-2 text-gray-400">Liczba półek</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustProductParam('shelves', -1)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={productParams.shelves}
                  onChange={(e) =>
                    setProductParams({
                      ...productParams,
                      shelves: Math.max(1, Math.min(5, Number(e.target.value))),
                    })
                  }
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono max-w-[100px]"
                />
                <button
                  onClick={() => adjustProductParam('shelves', 1)}
                  className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Opcje dodatkowe */}
      {dimensions.width > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-orange-500">{selectedProduct === 'kaseton' ? '3' : '4'}.</span> Opcje dodatkowe
          </h2>

          {selectedProduct === 'kaseton' && (
            <div className="mb-4 p-4 bg-blue-500/20 rounded-lg">
              <p className="text-sm">Wybierz typ liter dla kasetonu reklamowego</p>
            </div>
          )}

          {(selectedProduct === 'ledon' ||
            selectedOptions.led_standard ||
            selectedOptions.led_cob ||
            selectedOptions.led_rgb) && (
            <div className="mb-4 p-4 bg-yellow-500/20 rounded-lg">
              <p className="text-sm">⚡ Pamiętaj o zasilaczu LED!</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {getAvailableOptions().map((option) => {
              const isSelected = selectedOptions[option.id];
              const showQuantity =
                isSelected &&
                ['szt', 'mb', 'komplet'].includes(option.unit) &&
                !['polerowanie', 'led_standard', 'led_cob'].includes(option.id);

              return (
                <div key={option.id} className="relative">
                  <Card
                    icon={option.icon}
                    title={option.name}
                    subtitle={option.price > 0 ? `${option.price} zł/${option.unit}` : option.unit === 'special' ? (option.id === 'klejenie_uv' ? '+10% do materiału' : '+15-20% do LED') : undefined}
                    isActive={isSelected}
                    onClick={() =>
                      setSelectedOptions({
                        ...selectedOptions,
                        [option.id]: !isSelected,
                      })
                    }
                  />

                  {showQuantity && (
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-zinc-800 rounded-lg px-2 py-1 border border-zinc-700">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustOptionQuantity(option.id, -1);
                        }}
                        className="p-1 hover:bg-zinc-700 rounded transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-sm font-mono">{optionQuantities[option.id] || 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustOptionQuantity(option.id, 1);
                        }}
                        className="p-1 hover:bg-zinc-700 rounded transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kalkulacja */}
      {calculations.unitPrice > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-white/80">5.</span> Kalkulacja
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Powierzchnia:</span>
                  <span className="text-xl font-mono">{calculations.surface.toFixed(3)} m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Waga 1 szt:</span>
                  <span className="text-xl font-mono">{calculations.weight.toFixed(2)} kg</span>
                </div>

                {viewMode === 'salesperson' && (
                  <>
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-sm text-white/60 mb-2">Rozbicie kosztów:</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/80">Materiał:</span>
                          <span className="font-mono">{calculations.costBreakdown.materialCost.toFixed(2)} zł</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">
                            Odpad ({((productTypes.find((p) => p.id === selectedProduct)?.waste || 0) * 100).toFixed(0)}%):
                          </span>
                          <span className="font-mono">{calculations.costBreakdown.wasteCost.toFixed(2)} zł</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/80">Robocizna (33.3%):</span>
                          <span className="font-mono">{calculations.costBreakdown.laborCost.toFixed(2)} zł</span>
                        </div>
                        {calculations.costBreakdown.optionsCost > 0 && (
                          <div className="flex justify-between">
                            <span className="text-white/80">Opcje dodatkowe:</span>
                            <span className="font-mono">{calculations.costBreakdown.optionsCost.toFixed(2)} zł</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold">
                          <span className="text-white/80">Marża:</span>
                          <span className="font-mono text-green-300">{calculations.costBreakdown.margin.toFixed(2)} zł</span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Mnożnik:</span>
                        <span className="text-lg font-mono">×{productTypes.find((p) => p.id === selectedProduct)?.multiplier || 1}</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Cena jednostkowa:</span>
                    <span className="text-2xl font-bold">{calculations.unitPrice.toFixed(2)} zł</span>
                  </div>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Wartość całkowita:</span>
                    <span className="text-3xl font-bold">{calculations.totalPrice.toFixed(2)} zł</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-700 rounded-2xl p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="text-white/80">6.</span> Logistyka
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Sztuk na palecie:</span>
                  <span className="text-xl font-mono">{calculations.piecesPerPallet} szt</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Sztuk w kartonie:</span>
                  <span className="text-xl font-mono">{calculations.piecesPerBoxOptimal} szt</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Waga całkowita:</span>
                    <span className="text-2xl font-bold">{calculations.totalWeight.toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button onClick={handleAddToOffer} variant="primary" size="lg">
              <Plus className="w-5 h-5" />
              Dodaj do oferty
            </Button>
          </div>
        </>
      )}
    </div>
  );
};