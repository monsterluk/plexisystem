import React, { useState, useEffect } from "react";
import {
  Package,
  Square,
  Box,
  Lightbulb,
  Shield,
  Megaphone,
  ShoppingCart,
  Store,
  Plus,
  Minus,
  Printer,
  Lock,
  X,
  Palette,
  Sparkles,
  PackageCheck,
  Magnet,
  Layers,
  Grid3X3,
  Menu,
  Search,
  Copy,
  Send,
  Bell,
  Calendar,
  User,
  FileText,
  Download,
  Mail,
  Clock,
  Check,
  AlertCircle,
  Trash2,
  Edit,
  Eye,
  History,
  Circle,
  Truck,
  Calculator,
  Settings,
  Link,
  ExternalLink,
  Percent,
  Package2,
  Weight,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

const PlexiSystemApp = () => {
  // Typy produktów
  const productTypes = [
    {
      id: "formatka",
      name: "Formatka / Płyta",
      icon: Square,
      multiplier: 1.7,
      waste: 0.05,
    },
    {
      id: "pojemnik",
      name: "Pojemnik / Organizer",
      icon: Package,
      multiplier: 1.85,
      waste: 0.08,
    },
    {
      id: "ekspozytor",
      name: "Ekspozytory",
      icon: Store,
      multiplier: 2.2,
      waste: 0.12,
    },
    {
      id: "kaseton",
      name: "Kaseton reklamowy",
      icon: Megaphone,
      multiplier: 2.0,
      waste: 0.08,
    },
    {
      id: "ledon",
      name: "LEDON (neon LED)",
      icon: Lightbulb,
      multiplier: 1.8,
      waste: 0.08,
    },
    {
      id: "gablota",
      name: "Gablota",
      icon: Box,
      multiplier: 1.85,
      waste: 0.08,
    },
    {
      id: "obudowa",
      name: "Obudowa / Osłona",
      icon: Shield,
      multiplier: 1.85,
      waste: 0.08,
    },
    {
      id: "impuls",
      name: "Impuls kasowy",
      icon: ShoppingCart,
      multiplier: 1.8,
      waste: 0.08,
    },
  ];

  // Podtypy ekspozytorów
  const expositorTypes = [
    {
      id: "podstawkowy",
      name: "Podstawkowy",
      description: "Podstawa + plecy + boki + opcjonalny topper",
    },
    {
      id: "schodkowy",
      name: "Schodkowy",
      description: "3-5 półek stopniowanych",
    },
    {
      id: "z_haczykami",
      name: "Z haczykami",
      description: "Płyta perforowana pod haczyki",
    },
    { id: "wiszacy", name: "Wiszący", description: "Montowany na ścianie" },
    {
      id: "stojak",
      name: "Stojak reklamowy",
      description: "Wolnostojący z podstawą",
    },
    {
      id: "kosmetyczny",
      name: "Kosmetyczny",
      description: "Półki z ogranicznikami",
    },
  ];

  // Materiały z cenami bazowymi
  const materials = [
    {
      id: "plexi_clear",
      name: "Plexi bezbarwna",
      basePrice: 30,
      density: 1190,
    },
    { id: "plexi_white", name: "Plexi mleczna", basePrice: 33, density: 1190 },
    {
      id: "plexi_color",
      name: "Plexi kolorowa",
      basePrice: 40,
      density: 1190,
      fixedThickness: [3, 5],
      colorMultiplier: 1.4,
    },
    { id: "petg", name: "PET-G", basePrice: 30, density: 1270 },
    { id: "hips", name: "HIPS", basePrice: 20, density: 1050 },
    {
      id: "dibond",
      name: "Dibond",
      basePrice: 80,
      density: 1500,
      fixedThickness: [3],
    },
    { id: "pc", name: "Poliwęglan", basePrice: 38, density: 1200 },
    { id: "pcv", name: "PCV spienione", basePrice: 180, density: 1400 },
  ];

  // Opcje dodatkowe
  const additionalOptions = [
    {
      id: "grafika",
      name: "Grafika jednostronna",
      icon: Palette,
      price: 75,
      unit: "m²",
    },
    {
      id: "grafika_dwustronna",
      name: "Grafika dwustronna",
      icon: Palette,
      price: 150,
      unit: "m²",
    },
    {
      id: "polerowanie",
      name: "Polerowanie krawędzi",
      icon: Sparkles,
      price: 5,
      unit: "mb",
    },
    { id: "zawiasy", name: "Zawiasy", icon: Lock, price: 6, unit: "szt" },
    { id: "zamek", name: "Zamek", icon: Lock, price: 12, unit: "szt" },
    {
      id: "karton",
      name: "Karton jednostkowy",
      icon: PackageCheck,
      price: 8,
      unit: "m²",
    },
    {
      id: "tasma",
      name: "Taśma magnetyczna",
      icon: Magnet,
      price: 6,
      unit: "mb",
    },
    {
      id: "led_standard",
      name: "LED Standard",
      icon: Lightbulb,
      price: 30,
      unit: "mb",
    },
    {
      id: "led_cob",
      name: "LED Neonflex COB",
      icon: Lightbulb,
      price: 45,
      unit: "mb",
    },
    {
      id: "led_rgb",
      name: "LED RGB",
      icon: Lightbulb,
      price: 100,
      unit: "komplet",
    },
    {
      id: "projekt_led",
      name: "Projekt graficzny LED",
      icon: Lightbulb,
      price: 300,
      unit: "szt",
    },
    {
      id: "topper",
      name: "Topper reklamowy",
      icon: Square,
      price: 150,
      unit: "szt",
    },
    {
      id: "klejenie_uv",
      name: "Klejenie UV",
      icon: Sparkles,
      price: 0,
      unit: "special",
    },
    {
      id: "wodoodpornosc",
      name: "Wodoodporność LED",
      icon: Shield,
      price: 0,
      unit: "special",
    },
    {
      id: "litery_podklejane",
      name: "Litery podklejane",
      icon: FileText,
      price: 0,
      unit: "m²",
    },
    {
      id: "litery_zlicowane",
      name: "Litery zlicowane",
      icon: FileText,
      price: 150,
      unit: "m²",
    },
    {
      id: "litery_wystajace",
      name: "Litery wystające",
      icon: FileText,
      price: 400,
      unit: "m²",
    },
    {
      id: "litery_halo",
      name: "Litery z efektem Halo",
      icon: FileText,
      price: 300,
      unit: "m²",
    },
    {
      id: "dno_inny_material",
      name: "Dno z innego materiału",
      icon: Layers,
      price: 0,
      unit: "special",
    },
    { id: "nozki", name: "Nóżki", icon: Circle, price: 8, unit: "szt" },
    {
      id: "zasilacz_led",
      name: "Zasilacz LED",
      icon: Lightbulb,
      price: 80,
      unit: "szt",
    },
  ];

  // Handlowcy
  const salespeople = [
    {
      id: "DB",
      name: "Dorota Będkowska",
      phone: "884042109",
      email: "dorota@plexisystem.pl",
    },
    {
      id: "LS",
      name: "Łukasz Sikorra",
      phone: "884042107",
      email: "lukasz@plexisystem.pl",
    },
  ];

  // Warunki handlowe
  const defaultTerms = {
    deliveryTime: "3-10 dni roboczych",
    deliveryMethod: "Kurier / odbiór osobisty",
    paymentTerms: "Przelew 7 dni",
    warranty: "Produkty niestandardowe nie podlegają zwrotowi",
    validity: "7 dni",
  };

  // Regiony dostawy
  const deliveryRegions = [
    {
      id: "Trojmiasto",
      name: "Trojmiasto i okolice (do 50km)",
      pricePerKg: 0.5,
      minPrice: 30,
    },
    { id: "pomorskie", name: "Pomorskie", pricePerKg: 0.8, minPrice: 50 },
    {
      id: "polska_polnocna",
      name: "Polska polnocna",
      pricePerKg: 1.2,
      minPrice: 80,
    },
    {
      id: "polska_pozostala",
      name: "Pozostałe regiony",
      pricePerKg: 1.5,
      minPrice: 100,
    },
    { id: "odbior", name: "Odbiór osobisty", pricePerKg: 0, minPrice: 0 },
  ];

  // Stan główny
  const [view, setView] = useState("offers");
  const [viewMode, setViewMode] = useState("salesperson"); // 'salesperson' lub 'client'
  const [currentUser, setCurrentUser] = useState(salespeople[0]);
  const [offers, setOffers] = useState([
    // Przykładowe oferty do demonstracji
    {
      id: 1,
      number: "DB-2025-0001",
      date: "2025-01-02",
      client: {
        nip: "5882396272",
        name: "PlexiSystem s.c.",
        address: "Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski",
        email: "biuro@plexisystem.pl",
        phone: "884042109",
        regon: "221645384",
      },
      items: [
        {
          id: 1,
          productName: "Pojemnik / Organizer",
          materialName: "Plexi bezbarwna",
          thickness: 3,
          dimensions: { width: 300, height: 200, depth: 150 },
          quantity: 10,
          unitPrice: 89.5,
          totalPrice: 895.0,
          costBreakdown: {
            materialCost: 45.2,
            wasteCost: 3.62,
            laborCost: 15.0,
            optionsCost: 0,
            margin: 25.68,
          },
        },
      ],
      terms: { ...defaultTerms },
      status: "sent",
      salesperson: salespeople[0],
      comment: "",
      internalNotes: "Stały klient, możliwy większy rabat",
      totalNet: 895.0,
      discount: 10,
      discountValue: 99.44,
      totalNetAfterDiscount: 805.5,
      version: 1,
      projectName: "Organizery biurowe Q1 2025",
      validUntil: "2025-01-09",
      deliveryRegion: "odbior",
      deliveryCost: 0,
      shareLink: "https://plexisystem.pl/oferta/DB-2025-0001-x7k9m",
    },
    {
      id: 2,
      number: "LS-2025-0001",
      date: "2025-01-05",
      client: {
        nip: "1234567890",
        name: "Przykładowa Firma Sp. z o.o.",
        address: "ul. Testowa 123, 00-001 Warszawa",
        email: "kontakt@przyklad.pl",
        phone: "987654321",
        regon: "987654321",
      },
      items: [
        {
          id: 2,
          productName: "Ekspozytor",
          materialName: "PET-G",
          thickness: 5,
          dimensions: { width: 400, height: 300, depth: 200 },
          quantity: 5,
          unitPrice: 250.0,
          totalPrice: 1250.0,
          costBreakdown: {
            materialCost: 80.0,
            wasteCost: 9.6,
            laborCost: 25.0,
            optionsCost: 0,
            margin: 135.4,
          },
        },
      ],
      terms: { ...defaultTerms },
      status: "accepted",
      salesperson: salespeople[1],
      comment: "Pilne zamówienie",
      internalNotes: "Klient VIP - priorytet produkcji",
      totalNet: 1250.0,
      discount: 0,
      discountValue: 0,
      totalNetAfterDiscount: 1250.0,
      version: 1,
      projectName: "Ekspozytory targowe 2025",
      validUntil: "2025-01-12",
      deliveryRegion: "polska_polnocna",
      deliveryCost: 80,
      shareLink: "https://plexisystem.pl/oferta/LS-2025-0001-m3n8p",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      message: "👋 Witaj w systemie PlexiSystem!",
      date: new Date().toISOString(),
    },
  ]);

  // Stan dla nowej oferty
  const [currentOffer, setCurrentOffer] = useState({
    id: null,
    number: "",
    date: new Date().toISOString().split("T")[0],
    client: {
      nip: "",
      name: "",
      address: "",
      email: "",
      phone: "",
      regon: "",
    },
    items: [],
    terms: { ...defaultTerms },
    status: "draft",
    salesperson: currentUser,
    comment: "",
    internalNotes: "",
    totalNet: 0,
    discount: 10,
    discountValue: 0,
    totalNetAfterDiscount: 0,
    version: 1,
    projectName: "",
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    deliveryRegion: "odbior",
    deliveryCost: 0,
    shareLink: "",
  });

  // Generowanie numeru oferty
  const generateOfferNumber = () => {
    const year = new Date().getFullYear();
    const userPrefix = currentUser.id;
    const existingOffers = offers.filter((o) =>
      o.number.startsWith(`${userPrefix}-${year}`)
    );
    const nextNumber = existingOffers.length + 1;
    return `${userPrefix}-${year}-${String(nextNumber).padStart(4, "0")}`;
  };

  // Generowanie linku do oferty
  const generateShareLink = (offerNumber) => {
    const randomId = Math.random().toString(36).substring(2, 9);
    return `https://plexisystem.pl/oferta/${offerNumber}-${randomId}`;
  };

  // Symulacja pobierania danych z GUS
  const fetchGUSData = async (nip) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData = {
      "5882396272": {
        name: "PlexiSystem s.c.",
        address: "Ks. Dr. Leona Heyke 11, 84-206 Nowy Dwór Wejherowski",
        regon: "221645384",
      },
      "1234567890": {
        name: "Przykładowa Firma Sp. z o.o.",
        address: "ul. Testowa 123, 00-001 Warszawa",
        regon: "987654321",
      },
    };

    return mockData[nip] || null;
  };

  // Komponent kalkulatora
  const CalculatorView = ({ onAddToOffer }) => {
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedExpositorType, setSelectedExpositorType] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [thickness, setThickness] = useState(3);
    const [dimensions, setDimensions] = useState({
      width: 300,
      height: 200,
      depth: 150,
    });
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [optionQuantities, setOptionQuantities] = useState({});

    // Parametry specyficzne dla produktów
    const [productParams, setProductParams] = useState({
      shelves: 3,
      partitions: 0,
      ledLength: 100,
      hookRows: 3,
      hookCols: 4,
      pockets: 3,
      kasetonType: "plexi",
      bottomMaterial: "",
      bottomThickness: 3,
    });

    // Obliczenia
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
      // Nowe pola dla logistyki
      boxDimensions: { width: 0, height: 0, depth: 0 },
      boxSurface: 0,
      boxWeight: 0,
      piecesPerBoxOptimal: 0,
      boxesTotal: 0,
      palletsTotal: 0,
      palletLayers: 0,
      boxesPerLayer: 0,
      // Rozbicie kosztów
      costBreakdown: {
        materialCost: 0,
        wasteCost: 0,
        laborCost: 0,
        optionsCost: 0,
        margin: 0,
      },
    });

    // Funkcja obliczająca powierzchnię
    const calculateSurface = () => {
      const w = dimensions.width / 1000;
      const h = dimensions.height / 1000;
      const d = dimensions.depth / 1000;

      switch (selectedProduct) {
        case "formatka":
          return w * h;

        case "pojemnik":
          const frontBack = 2 * (w * h);
          const sides = 2 * (d * h);
          let bottomArea = w * d;

          if (
            selectedOptions.dno_inny_material &&
            productParams.bottomMaterial
          ) {
            bottomArea = 0;
          }

          const lid = selectedOptions.wieko ? w * d : 0;
          const partitionArea = productParams.partitions * h * d;
          return frontBack + sides + bottomArea + lid + partitionArea;

        case "gablota":
          return (
            2 * (w * h) +
            2 * (d * h) +
            w * d +
            (selectedOptions.wieko ? w * d : 0)
          );

        case "obudowa":
          return 2 * (w * h) + 2 * (d * h) + w * d;

        case "ekspozytor":
          return calculateExpositorSurface(w, h, d);

        case "kaseton":
          return w * h;

        case "ledon":
          return w * h;

        case "impuls":
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
    const calculateExpositorSurface = (w, h, d) => {
      switch (selectedExpositorType) {
        case "podstawkowy":
          const base = w * d;
          const back = w * h;
          const sides = 2 * (d * h);
          const topper = selectedOptions.topper ? w * (h * 0.2) : 0;
          return base + back + sides + topper;

        case "schodkowy":
          const baseArea = w * d;
          const backArea = w * h;
          const sidesArea = 2 * (d * h);
          const stepArea =
            productParams.shelves * w * (d / productParams.shelves);
          const risers = productParams.shelves * w * 0.05;
          return baseArea + backArea + sidesArea + stepArea + risers;

        case "z_haczykami":
          return (
            w * d +
            w * h +
            2 * (d * h) +
            (selectedOptions.topper ? w * (h * 0.2) : 0)
          );

        case "wiszacy":
          const backPanel = w * h;
          const pockets = productParams.pockets * w * 0.1;
          return backPanel + pockets;

        case "stojak":
          const heavyBase = w * d * 1.5;
          const frame = 2 * (h * 0.1);
          const segments = productParams.shelves * w * 0.2;
          return heavyBase + frame + segments;

        case "kosmetyczny":
          const kosBase = w * d;
          const kosBack = w * h;
          const kosSides = 2 * (d * h);
          const kosShelves = productParams.shelves * w * d;
          const kosDividers =
            productParams.shelves * productParams.partitions * d * 0.08;
          return kosBase + kosBack + kosSides + kosShelves + kosDividers;

        default:
          return w * h + 2 * (d * h) + w * d;
      }
    };

    // Funkcja obliczająca wagę
    const calculateWeight = (surface, material, thickness) => {
      const densityKgM3 = material?.density || 1190;
      const thicknessMm = thickness || 3;
      return surface * (thicknessMm / 1000) * densityKgM3;
    };

    // Funkcja obliczająca wymiary kartonu
    const calculateBoxDimensions = () => {
      const isFlat = ["formatka", "kaseton", "ledon"].includes(selectedProduct);

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
    const calculatePiecesPerBox = (productDims, boxDims) => {
      const maxBoxDims = { width: 600, height: 400, depth: 400 };

      // Dla produktów płaskich
      if (["formatka", "kaseton", "ledon"].includes(selectedProduct)) {
        const stackHeight = Math.floor((maxBoxDims.depth - 20) / thickness);
        return Math.max(1, Math.min(stackHeight, 50));
      }

      // Dla produktów 3D - próbuj różne orientacje
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
    const calculatePalletArrangement = (boxDims) => {
      const palletDims = { width: 1200, height: 800 };
      const maxHeight = 1656; // 1800mm - 144mm palety

      // Próbuj różne orientacje kartonu
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

        if (
          boxesPerLayer * layers >
          bestArrangement.boxesPerLayer * bestArrangement.layers
        ) {
          bestArrangement = {
            boxesPerLayer,
            layers,
            arrangement: `${boxesX}×${boxesY}`,
          };
        }
      });

      return bestArrangement;
    };

    // Funkcja obliczająca koszt opcji
    const calculateOptionsCost = () => {
      let cost = 0;
      const surface = calculateSurface();
      const w = dimensions.width / 1000;
      const h = dimensions.height / 1000;
      const d = dimensions.depth / 1000;

      Object.entries(selectedOptions).forEach(([optionId, isSelected]) => {
        if (isSelected && optionId !== "wieko") {
          const option = additionalOptions.find((o) => o.id === optionId);
          if (option) {
            const qty = optionQuantities[optionId] || 1;

            if (option.unit === "m²") {
              cost += option.price * surface;
            } else if (option.unit === "mb") {
              if (optionId === "polerowanie") {
                let edgeLength = 0;

                if (selectedProduct === "formatka") {
                  edgeLength = 2 * (w + h);
                } else if (
                  selectedProduct === "pojemnik" ||
                  selectedProduct === "gablota"
                ) {
                  edgeLength =
                    2 * (2 * w + 2 * h) + 2 * (2 * d + 2 * h) + 2 * w + 2 * d;
                  if (selectedOptions.wieko) {
                    edgeLength += 2 * w + 2 * d;
                  }
                } else if (selectedProduct === "ekspozytor") {
                  edgeLength = calculateExpositorEdges();
                } else if (selectedProduct === "impuls") {
                  edgeLength =
                    2 * (w + h) + 4 * d + productParams.shelves * 2 * w;
                }

                cost += option.price * edgeLength;
              } else if (optionId.includes("led")) {
                const ledLengthM = productParams.ledLength / 100;
                cost += option.price * ledLengthM;
              } else if (optionId === "tasma") {
                cost += option.price * qty;
              }
            } else if (option.unit === "szt" || option.unit === "komplet") {
              cost += option.price * qty;
            }
          }
        }
      });

      // Dodaj koszt zasilacza LED jeśli są LED-y
      if (
        selectedOptions.led_standard ||
        selectedOptions.led_cob ||
        selectedOptions.led_rgb
      ) {
        if (!selectedOptions.zasilacz_led) {
          cost += 80; // Automatycznie dodaj zasilacz
        }
      }

      return cost;
    };

    // Funkcja pomocnicza do obliczania krawędzi ekspozytorów
    const calculateExpositorEdges = () => {
      const w = dimensions.width / 1000;
      const h = dimensions.height / 1000;
      const d = dimensions.depth / 1000;

      switch (selectedExpositorType) {
        case "podstawkowy":
          return 2 * w + 2 * d + 2 * h + w;
        case "schodkowy":
          return 2 * w + 2 * d + 2 * h + productParams.shelves * w;
        case "z_haczykami":
          return 2 * w + 2 * d + 2 * h + w;
        case "wiszacy":
          return 2 * (w + h);
        case "stojak":
          return 2 * (w + d) + 4 * h;
        case "kosmetyczny":
          return 2 * w + 2 * d + 2 * h + productParams.shelves * 2 * w;
        default:
          return 2 * (w + h);
      }
    };

    // Główna funkcja kalkulacyjna
    useEffect(() => {
      if (
        selectedProduct &&
        (selectedProduct !== "ekspozytor" || selectedExpositorType)
      ) {
        if (selectedProduct === "kaseton" && productParams.kasetonType) {
          const surface = calculateSurface();
          const surfaceWithWaste = surface * 1.08;
          const basePrice = productParams.kasetonType === "plexi" ? 1550 : 1400;
          let optionsCost = calculateOptionsCost();
          const unitPrice = basePrice * surface + optionsCost;
          const weight =
            productParams.kasetonType === "plexi"
              ? surface * 0.003 * 1190
              : surface * 0.003 * 1500;

          // Obliczenia logistyczne
          const boxDims = calculateBoxDimensions();
          const boxSurface =
            (2 *
              (boxDims.width * boxDims.height +
                boxDims.width * boxDims.depth +
                boxDims.height * boxDims.depth)) /
            1000000;
          const boxWeight = boxSurface * 0.6;
          const piecesPerBox = calculatePiecesPerBox(dimensions, boxDims);
          const boxesTotal = Math.ceil(quantity / piecesPerBox);
          const palletInfo = calculatePalletArrangement(boxDims);
          const palletsTotal = Math.ceil(
            boxesTotal / (palletInfo.boxesPerLayer * palletInfo.layers)
          );

          // Rozbicie kosztów
          const materialCost = basePrice * surface * 0.4; // 40% to materiał
          const wasteCost = materialCost * 0.08;
          const laborCost = basePrice * surface * 0.2; // 20% to robocizna
          const margin =
            unitPrice - materialCost - wasteCost - laborCost - optionsCost;

          setCalculations({
            surface: surface,
            weight: weight,
            materialCost: basePrice * surface,
            optionsCost: optionsCost,
            unitPrice: unitPrice,
            totalPrice: unitPrice * quantity,
            piecesPerPallet:
              palletInfo.boxesPerLayer * palletInfo.layers * piecesPerBox,
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

          // Dopłata za kolorową plexi
          if (selectedMaterial === "plexi_color") {
            materialCost *= material.colorMultiplier || 1.4;
          }

          if (selectedOptions.klejenie_uv) {
            materialCost *= 1.1;
          }

          if (
            selectedProduct === "pojemnik" &&
            selectedOptions.dno_inny_material &&
            productParams.bottomMaterial
          ) {
            const bottomMaterial = materials.find(
              (m) => m.id === productParams.bottomMaterial
            );
            if (bottomMaterial) {
              const bottomArea =
                (dimensions.width / 1000) * (dimensions.depth / 1000);
              const bottomAreaWithWaste = bottomArea * (1 + product.waste);
              let bottomCost =
                bottomMaterial.basePrice *
                productParams.bottomThickness *
                bottomAreaWithWaste;

              if (productParams.bottomMaterial === "plexi_color") {
                bottomCost *= bottomMaterial.colorMultiplier || 1.4;
              }

              materialCost += bottomCost;
            }
          }

          let optionsCost = calculateOptionsCost();

          if (selectedProduct === "ledon") {
            const ledLengthM = productParams.ledLength / 100;

            if (
              !selectedOptions.led_standard &&
              !selectedOptions.led_cob &&
              !selectedOptions.led_rgb
            ) {
              optionsCost += 30 * ledLengthM;
            }

            if (selectedOptions.wodoodpornosc) {
              const ledCost = optionsCost;
              optionsCost += ledCost * 0.15;
            }
          }

          const weight = calculateWeight(surface, material, thickness);

          // Kalkulacja z uwzględnieniem mnożnika
          const baseCost = materialCost;
          const wasteCost = baseCost * product.waste;
          const laborCost = baseCost * 0.01; // 1% robocizna
          const totalCostBeforeMargin = baseCost + laborCost;
          const unitPrice =
            totalCostBeforeMargin * product.multiplier + optionsCost;
          const margin =
            unitPrice - baseCost - wasteCost - laborCost - optionsCost;

          // Obliczenia logistyczne
          const boxDims = calculateBoxDimensions();
          const boxSurface =
            (2 *
              (boxDims.width * boxDims.height +
                boxDims.width * boxDims.depth +
                boxDims.height * boxDims.depth)) /
            1000000;
          const boxWeight = boxSurface * 0.6;
          const piecesPerBox = calculatePiecesPerBox(dimensions, boxDims);
          const boxesTotal = Math.ceil(quantity / piecesPerBox);
          const palletInfo = calculatePalletArrangement(boxDims);
          const palletsTotal = Math.ceil(
            boxesTotal / (palletInfo.boxesPerLayer * palletInfo.layers)
          );

          setCalculations({
            surface: surface,
            weight: weight,
            materialCost: materialCost,
            optionsCost: optionsCost,
            unitPrice: unitPrice,
            totalPrice: unitPrice * quantity,
            piecesPerPallet:
              palletInfo.boxesPerLayer * palletInfo.layers * piecesPerBox,
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
    const adjustDimension = (dim, delta) => {
      setDimensions((prev) => ({
        ...prev,
        [dim]: Math.max(10, Math.min(2000, prev[dim] + delta)),
      }));
    };

    const adjustQuantity = (delta) => {
      setQuantity(Math.max(1, quantity + delta));
    };

    const adjustOptionQuantity = (optionId, delta) => {
      setOptionQuantities((prev) => ({
        ...prev,
        [optionId]: Math.max(1, (prev[optionId] || 1) + delta),
      }));
    };

    const adjustProductParam = (param, delta) => {
      setProductParams((prev) => ({
        ...prev,
        [param]: Math.max(0, prev[param] + delta),
      }));
    };

    // Filtrowanie opcji w zależności od produktu
    const getAvailableOptions = () => {
      let options = [...additionalOptions];

      if (selectedProduct === "kaseton") {
        return options.filter((o) =>
          [
            "litery_podklejane",
            "litery_zlicowane",
            "litery_wystajace",
            "litery_halo",
            "led_standard",
            "led_cob",
            "led_rgb",
            "zasilacz_led",
          ].includes(o.id)
        );
      }

      if (selectedProduct === "ledon") {
        return options.filter((o) =>
          [
            "led_standard",
            "led_cob",
            "led_rgb",
            "projekt_led",
            "wodoodpornosc",
            "zasilacz_led",
          ].includes(o.id)
        );
      }

      if (selectedProduct === "ekspozytor") {
        const baseOptions = [
          "grafika",
          "grafika_dwustronna",
          "polerowanie",
          "karton",
        ];
        if (
          ["podstawkowy", "z_haczykami", "kosmetyczny"].includes(
            selectedExpositorType
          )
        ) {
          baseOptions.push("topper", "led_standard", "zasilacz_led");
        }
        return options.filter((o) => baseOptions.includes(o.id));
      }

      if (["pojemnik", "gablota"].includes(selectedProduct)) {
        const baseOptions = [
          "grafika",
          "polerowanie",
          "zawiasy",
          "zamek",
          "karton",
          "klejenie_uv",
          "nozki",
        ];
        if (selectedProduct === "pojemnik") {
          baseOptions.push("dno_inny_material");
        }
        return options.filter((o) => baseOptions.includes(o.id));
      }

      if (selectedProduct === "obudowa") {
        return options.filter((o) =>
          ["grafika", "polerowanie", "karton", "klejenie_uv", "tasma"].includes(
            o.id
          )
        );
      }

      if (selectedProduct === "formatka") {
        return options.filter((o) => ["polerowanie", "karton"].includes(o.id));
      }

      if (selectedProduct === "impuls") {
        return options.filter((o) =>
          ["grafika", "grafika_dwustronna", "polerowanie"].includes(o.id)
        );
      }

      return options;
    };

    // Funkcja dodawania do oferty
    const handleAddToOffer = () => {
      if (
        !selectedProduct ||
        !selectedMaterial ||
        calculations.unitPrice === 0
      ) {
        alert("Wypełnij wszystkie wymagane pola");
        return;
      }

      const item = {
        id: Date.now(),
        product: selectedProduct,
        productName:
          productTypes.find((p) => p.id === selectedProduct)?.name || "",
        expositorType: selectedExpositorType,
        material: selectedMaterial,
        materialName:
          materials.find((m) => m.id === selectedMaterial)?.name || "",
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
      setSelectedProduct("");
      setSelectedExpositorType("");
      setSelectedMaterial("");
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
        kasetonType: "plexi",
        bottomMaterial: "",
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
            {productTypes.map((product) => {
              const Icon = product.icon;
              return (
                <button
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product.id);
                    setSelectedExpositorType("");
                  }}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedProduct === product.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <Icon className="w-12 h-12 mx-auto mb-3 text-orange-500" />
                  <p className="text-sm font-medium">{product.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Wybór typu kasetonu */}
        {selectedProduct === "kaseton" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-orange-500">1.1</span> Wybierz rodzaj
              kasetonu
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  setProductParams({ ...productParams, kasetonType: "plexi" })
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  productParams.kasetonType === "plexi"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <p className="font-medium">Kaseton z plexi</p>
                <p className="text-sm text-gray-400 mt-1">1550 zł/m²</p>
              </button>
              <button
                onClick={() =>
                  setProductParams({ ...productParams, kasetonType: "dibond" })
                }
                className={`p-4 rounded-xl border-2 transition-all ${
                  productParams.kasetonType === "dibond"
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <p className="font-medium">Kaseton z dibond</p>
                <p className="text-sm text-gray-400 mt-1">1400 zł/m²</p>
              </button>
            </div>
          </div>
        )}

        {/* Wybór typu ekspozytora */}
        {selectedProduct === "ekspozytor" && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-orange-500">1.1</span> Wybierz typ
              ekspozytora
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {expositorTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedExpositorType(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedExpositorType === type.id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <p className="font-medium">{type.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Materiał i grubość */}
        {selectedProduct &&
          (selectedProduct !== "ekspozytor" || selectedExpositorType) &&
          selectedProduct !== "kaseton" && (
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
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <p className="font-medium">{material.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {material.basePrice} zł/m²
                    </p>
                    {material.colorMultiplier && (
                      <p className="text-xs text-orange-400 mt-1">
                        +{((material.colorMultiplier - 1) * 100).toFixed(0)}%
                        dopłata
                      </p>
                    )}
                  </button>
                ))}
              </div>

              {selectedMaterial && (
                <div className="bg-zinc-800 rounded-xl p-6">
                  <label className="block text-sm font-medium mb-3">
                    Grubość materiału
                  </label>
                  {materials.find((m) => m.id === selectedMaterial)
                    ?.fixedThickness ? (
                    <div className="flex gap-4">
                      {(
                        materials.find((m) => m.id === selectedMaterial)
                          ?.fixedThickness || [3]
                      ).map((t) => (
                        <button
                          key={t}
                          onClick={() => setThickness(t)}
                          className={`px-6 py-3 rounded-lg font-medium transition-all ${
                            thickness === t
                              ? "bg-orange-500 text-white"
                              : "bg-zinc-700 hover:bg-zinc-600"
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
                        <span className="text-lg font-bold text-orange-500">
                          {thickness} mm
                        </span>
                        <span>20 mm</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Wymiary i ilość */}
        {((selectedMaterial && selectedProduct !== "kaseton") ||
          (selectedProduct === "kaseton" && productParams.kasetonType)) && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-orange-500">
                {selectedProduct === "kaseton" ? "2" : "3"}.
              </span>{" "}
              Wymiary i ilość
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Szerokość
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustDimension("width", -10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        width: Number(e.target.value),
                      })
                    }
                    className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                  />
                  <button
                    onClick={() => adjustDimension("width", 10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 w-10">mm</span>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Wysokość
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustDimension("height", -10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) =>
                      setDimensions({
                        ...dimensions,
                        height: Number(e.target.value),
                      })
                    }
                    className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                  />
                  <button
                    onClick={() => adjustDimension("height", 10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400 w-10">mm</span>
                </div>
              </div>

              {selectedProduct !== "formatka" &&
                selectedProduct !== "kaseton" &&
                selectedProduct !== "ledon" && (
                  <div className="bg-zinc-800 rounded-xl p-4">
                    <label className="block text-sm font-medium mb-2 text-gray-400">
                      Głębokość
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustDimension("depth", -10)}
                        className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={dimensions.depth}
                        onChange={(e) =>
                          setDimensions({
                            ...dimensions,
                            depth: Number(e.target.value),
                          })
                        }
                        className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono"
                      />
                      <button
                        onClick={() => adjustDimension("depth", 10)}
                        className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-400 w-10">mm</span>
                    </div>
                  </div>
                )}

              <div className="bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Ilość sztuk
                </label>
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
                    onChange={(e) =>
                      setQuantity(Math.max(1, Number(e.target.value)))
                    }
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
            {selectedProduct === "pojemnik" && (
              <>
                <div className="mt-4 bg-zinc-800 rounded-xl p-4">
                  <label className="block text-sm font-medium mb-2 text-gray-400">
                    Liczba przegród wewnętrznych
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => adjustProductParam("partitions", -1)}
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
                      onClick={() => adjustProductParam("partitions", 1)}
                      className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {selectedOptions.dno_inny_material && (
                  <div className="mt-4 space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4">
                      <label className="block text-sm font-medium mb-2 text-gray-400">
                        Materiał dna
                      </label>
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
                                ? "bg-orange-500 text-white"
                                : "bg-zinc-700 hover:bg-zinc-600"
                            }`}
                          >
                            {material.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {productParams.bottomMaterial && (
                      <div className="bg-zinc-800 rounded-xl p-4">
                        <label className="block text-sm font-medium mb-2 text-gray-400">
                          Grubość dna
                        </label>
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
                                  ? "bg-orange-500 text-white"
                                  : "bg-zinc-700 hover:bg-zinc-600"
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

            {selectedProduct === "ledon" && (
              <div className="mt-4 bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Długość taśmy LED (cm)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustProductParam("ledLength", -10)}
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
                    onClick={() => adjustProductParam("ledLength", 10)}
                    className="p-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-400">cm</span>
                </div>
              </div>
            )}

            {(selectedProduct === "impuls" ||
              (selectedProduct === "ekspozytor" &&
                ["schodkowy", "kosmetyczny"].includes(
                  selectedExpositorType
                ))) && (
              <div className="mt-4 bg-zinc-800 rounded-xl p-4">
                <label className="block text-sm font-medium mb-2 text-gray-400">
                  Liczba półek
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustProductParam("shelves", -1)}
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
                        shelves: Math.max(
                          1,
                          Math.min(5, Number(e.target.value))
                        ),
                      })
                    }
                    className="flex-1 bg-zinc-700 rounded-lg px-3 py-2 text-center font-mono max-w-[100px]"
                  />
                  <button
                    onClick={() => adjustProductParam("shelves", 1)}
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
              <span className="text-orange-500">
                {selectedProduct === "kaseton" ? "3" : "4"}.
              </span>{" "}
              Opcje dodatkowe
            </h2>

            {selectedProduct === "kaseton" && (
              <div className="mb-4 p-4 bg-blue-500/20 rounded-lg">
                <p className="text-sm">
                  Wybierz typ liter dla kasetonu reklamowego
                </p>
              </div>
            )}

            {(selectedProduct === "ledon" ||
              selectedOptions.led_standard ||
              selectedOptions.led_cob ||
              selectedOptions.led_rgb) && (
              <div className="mb-4 p-4 bg-yellow-500/20 rounded-lg">
                <p className="text-sm">⚡ Pamiętaj o zasilaczu LED!</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["pojemnik", "gablota"].includes(selectedProduct) && (
                <button
                  onClick={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      wieko: !selectedOptions.wieko,
                    })
                  }
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedOptions.wieko
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <Box className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="font-medium">Wieko</p>
                </button>
              )}

              {getAvailableOptions().map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOptions[option.id];
                const showQuantity =
                  isSelected &&
                  ["szt", "mb", "komplet"].includes(option.unit) &&
                  !["polerowanie", "led_standard", "led_cob"].includes(
                    option.id
                  );

                return (
                  <div key={option.id} className="relative">
                    <button
                      onClick={() =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [option.id]: !isSelected,
                        })
                      }
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-orange-500 bg-orange-500/10"
                          : "border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <p className="font-medium">{option.name}</p>
                      {option.price > 0 && (
                        <p className="text-sm text-gray-400 mt-1">
                          {option.price} zł/{option.unit}
                        </p>
                      )}
                      {option.unit === "special" && (
                        <p className="text-sm text-gray-400 mt-1">
                          {option.id === "klejenie_uv"
                            ? "+10% do materiału"
                            : "+15-20% do LED"}
                        </p>
                      )}
                    </button>

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
                        <span className="px-2 text-sm font-mono">
                          {optionQuantities[option.id] || 1}
                        </span>
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

        {/* Kalkulacja, Logistyka i Pakowanie */}
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
                    <span className="text-xl font-mono">
                      {calculations.surface.toFixed(3)} m²
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Waga 1 szt:</span>
                    <span className="text-xl font-mono">
                      {calculations.weight.toFixed(2)} kg
                    </span>
                  </div>

                  {viewMode === "salesperson" && (
                    <>
                      <div className="border-t border-white/20 pt-3">
                        <p className="text-sm text-white/60 mb-2">
                          Rozbicie kosztów:
                        </p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-white/80">Materiał:</span>
                            <span className="font-mono">
                              {calculations.costBreakdown.materialCost.toFixed(
                                2
                              )}{" "}
                              zł
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">
                              Odpad (
                              {(
                                (productTypes.find(
                                  (p) => p.id === selectedProduct
                                )?.waste || 0) * 100
                              ).toFixed(0)}
                              %):
                            </span>
                            <span className="font-mono">
                              {calculations.costBreakdown.wasteCost.toFixed(2)}{" "}
                              zł
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">Robocizna:</span>
                            <span className="font-mono">
                              {calculations.costBreakdown.laborCost.toFixed(2)}{" "}
                              zł
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/80">
                              Opcje dodatkowe:
                            </span>
                            <span className="font-mono">
                              {calculations.costBreakdown.optionsCost.toFixed(
                                2
                              )}{" "}
                              zł
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span className="text-white/80">Marża:</span>
                            <span className="font-mono text-green-300">
                              {calculations.costBreakdown.margin.toFixed(2)} zł
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-white/20 pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Mnożnik:</span>
                          <span className="text-lg font-mono">
                            ×
                            {productTypes.find((p) => p.id === selectedProduct)
                              ?.multiplier || 1}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Cena jednostkowa:</span>
                      <span className="text-2xl font-bold">
                        {calculations.unitPrice.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Wartość całkowita:</span>
                      <span className="text-3xl font-bold">
                        {calculations.totalPrice.toFixed(2)} zł
                      </span>
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
                    <span className="text-xl font-mono">
                      {calculations.piecesPerPallet} szt
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Sztuk w kartonie:</span>
                    <span className="text-xl font-mono">
                      {calculations.piecesPerBoxOptimal} szt
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Waga całkowita:</span>
                      <span className="text-2xl font-bold">
                        {calculations.totalWeight.toFixed(2)} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sekcja Pakowanie */}
            <div className="bg-green-700 rounded-2xl p-6 mt-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package2 className="w-8 h-8" />
                <span>Pakowanie i transport</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-200">
                    Karton jednostkowy
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Wymiary kartonu:</span>
                      <span className="font-mono">
                        {calculations.boxDimensions.width} ×{" "}
                        {calculations.boxDimensions.height} ×{" "}
                        {calculations.boxDimensions.depth} mm
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">
                        Powierzchnia kartonu:
                      </span>
                      <span className="font-mono">
                        {calculations.boxSurface.toFixed(3)} m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Waga kartonu:</span>
                      <span className="font-mono">
                        {calculations.boxWeight.toFixed(2)} kg
                      </span>
                    </div>
                    {selectedOptions.karton && (
                      <div className="flex justify-between text-orange-300">
                        <span>Koszt kartonu:</span>
                        <span className="font-mono">
                          {(calculations.boxSurface * 8).toFixed(2)} zł
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-green-200">
                    Paletyzacja
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Kartonów ogółem:</span>
                      <span className="font-mono">
                        {calculations.boxesTotal} szt
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">
                        Kartonów na warstwie:
                      </span>
                      <span className="font-mono">
                        {calculations.boxesPerLayer} szt
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Warstw na palecie:</span>
                      <span className="font-mono">
                        {calculations.palletLayers}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-white/80">Palet ogółem:</span>
                      <span className="font-mono text-xl">
                        {calculations.palletsTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wizualizacja układu palet */}
              <div className="mt-4 p-4 bg-green-800/50 rounded-lg">
                <p className="text-sm text-green-200 mb-2">
                  Układ na europalecie (1200×800mm):
                </p>
                <div className="font-mono text-xs">
                  {Array.from({
                    length: Math.min(3, calculations.palletLayers),
                  }).map((_, i) => (
                    <div key={i} className="mb-1">
                      Warstwa {i + 1}:{" "}
                      {Array.from({
                        length: Math.min(8, calculations.boxesPerLayer),
                      })
                        .map(() => "📦")
                        .join(" ")}
                    </div>
                  ))}
                  {calculations.palletLayers > 3 && (
                    <div>
                      ... i {calculations.palletLayers - 3} warstw więcej
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleAddToOffer}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Dodaj do oferty
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Lista ofert
  const OffersListView = () => {
    const filteredOffers = offers.filter((offer) => {
      const query = searchQuery.toLowerCase();
      return (
        offer.number.toLowerCase().includes(query) ||
        offer.client.name.toLowerCase().includes(query) ||
        offer.client.nip.includes(query) ||
        offer.salesperson.name.toLowerCase().includes(query) ||
        offer.projectName.toLowerCase().includes(query)
      );
    });

    const getStatusColor = (status) => {
      switch (status) {
        case "draft":
          return "bg-gray-500";
        case "sent":
          return "bg-blue-500";
        case "accepted":
          return "bg-green-500";
        case "rejected":
          return "bg-red-500";
        default:
          return "bg-gray-500";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "draft":
          return "Szkic";
        case "sent":
          return "Wysłana";
        case "accepted":
          return "Zaakceptowana";
        case "rejected":
          return "Odrzucona";
        default:
          return status;
      }
    };

    const duplicateOffer = (offer) => {
      const baseNumber = offer.number.split("-v")[0];
      const existingVersions = offers.filter((o) =>
        o.number.startsWith(baseNumber)
      );
      const nextVersion =
        Math.max(...existingVersions.map((o) => o.version || 1)) + 1;

      const duplicatedOffer = {
        ...offer,
        id: Date.now(),
        number: `${baseNumber}-v${nextVersion}`,
        date: new Date().toISOString().split("T")[0],
        status: "draft",
        version: nextVersion,
        items: offer.items.map((item) => ({
          ...item,
          id: Date.now() + Math.random(),
        })),
        shareLink: generateShareLink(`${baseNumber}-v${nextVersion}`),
      };

      setOffers([...offers, duplicatedOffer]);

      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          type: "success",
          message: `✅ Utworzono wersję ${nextVersion} oferty ${baseNumber}`,
          date: new Date().toISOString(),
        },
      ]);
    };

    const handlePrintPDF = (offer) => {
      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(generatePDFHTML(offer));
      printWindow.document.close();
      printWindow.print();
    };

    const handleSendEmail = async (offer) => {
      if (!offer.client.email) {
        alert("Brak adresu e-mail klienta");
        return;
      }

      alert(
        `Oferta ${offer.number} zostanie wysłana na adres: ${offer.client.email}`
      );

      const updatedOffers = offers.map((o) =>
        o.id === offer.id ? { ...o, status: "sent" } : o
      );
      setOffers(updatedOffers);

      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          type: "success",
          message: `📧 Oferta ${offer.number} została wysłana do ${offer.client.name}`,
          date: new Date().toISOString(),
        },
      ]);
    };

    const handleShareLink = (offer) => {
      navigator.clipboard.writeText(offer.shareLink);
      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          type: "info",
          message: `🔗 Link do oferty ${offer.number} skopiowany do schowka`,
          date: new Date().toISOString(),
        },
      ]);
    };

    const exportToCSV = () => {
      const headers = [
        "Numer",
        "Data",
        "Klient",
        "NIP",
        "Wartość netto",
        "Rabat %",
        "Po rabacie",
        "Status",
        "Handlowiec",
        "Projekt",
      ];
      const rows = filteredOffers.map((offer) => [
        offer.number,
        offer.date,
        offer.client.name,
        offer.client.nip,
        offer.totalNet.toFixed(2),
        offer.discount,
        offer.totalNetAfterDiscount.toFixed(2),
        getStatusText(offer.status),
        offer.salesperson.name,
        offer.projectName,
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `oferty_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Historia ofert</h2>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Eksport CSV
            </button>
            <button
              onClick={() => {
                setCurrentOffer({
                  ...currentOffer,
                  number: generateOfferNumber(),
                  items: [],
                });
                setView("new-offer");
              }}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nowa oferta
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj po numerze, kliencie, NIP, projekcie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 rounded-lg pl-10 pr-4 py-3"
            />
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left p-4">Numer</th>
                <th className="text-left p-4">Data</th>
                <th className="text-left p-4">Klient / Projekt</th>
                <th className="text-left p-4">Wartość</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Handlowiec</th>
                <th className="text-left p-4">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => {
                const daysUntilExpiry = Math.ceil(
                  (new Date(offer.validUntil) - new Date()) /
                    (1000 * 60 * 60 * 24)
                );
                const isExpiringSoon =
                  daysUntilExpiry <= 2 &&
                  daysUntilExpiry > 0 &&
                  offer.status === "sent";

                return (
                  <tr
                    key={offer.id}
                    className={`border-b border-zinc-700 hover:bg-zinc-700/50 ${
                      isExpiringSoon ? "bg-yellow-900/20" : ""
                    }`}
                  >
                    <td className="p-4 font-mono">
                      {offer.number}
                      {offer.version > 1 && (
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          v{offer.version}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {offer.date}
                      {isExpiringSoon && (
                        <div className="text-xs text-yellow-400 mt-1">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Wygasa za {daysUntilExpiry} dni
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{offer.client.name}</p>
                        <p className="text-sm text-gray-400">
                          NIP: {offer.client.nip}
                        </p>
                        {offer.projectName && (
                          <p className="text-xs text-blue-400 mt-1">
                            📁 {offer.projectName}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-mono">
                          {offer.totalNet.toFixed(2)} zł
                        </p>
                        {offer.discount > 0 && (
                          <>
                            <p className="text-sm text-orange-400">
                              -{offer.discount}%
                            </p>
                            <p className="text-sm font-mono font-semibold">
                              {offer.totalNetAfterDiscount.toFixed(2)} zł
                            </p>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <select
                        value={offer.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const updatedOffers = offers.map((o) =>
                            o.id === offer.id ? { ...o, status: newStatus } : o
                          );
                          setOffers(updatedOffers);

                          const statusText = getStatusText(newStatus);
                          const emoji =
                            newStatus === "accepted"
                              ? "✅"
                              : newStatus === "rejected"
                              ? "❌"
                              : "📧";
                          setNotifications((prev) => [
                            ...prev,
                            {
                              id: Date.now(),
                              type:
                                newStatus === "accepted"
                                  ? "success"
                                  : newStatus === "rejected"
                                  ? "error"
                                  : "info",
                              message: `${emoji} Status oferty ${offer.number} zmieniony na: ${statusText}`,
                              date: new Date().toISOString(),
                            },
                          ]);
                        }}
                        className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${getStatusColor(
                          offer.status
                        )} text-white border-0`}
                      >
                        <option value="draft">Szkic</option>
                        <option value="sent">Wysłana</option>
                        <option value="accepted">Zaakceptowana</option>
                        <option value="rejected">Odrzucona</option>
                      </select>
                    </td>
                    <td className="p-4">{offer.salesperson.name}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentOffer(offer);
                            setView("view-offer");
                          }}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                          title="Podgląd oferty"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateOffer(offer)}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                          title="Powiel ofertę"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareLink(offer)}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                          title="Kopiuj link"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendEmail(offer)}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                          title="Wyślij e-mail"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintPDF(offer)}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                          title="Drukuj PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Główny widok oferty
  const OfferView = () => {
    const [nipLoading, setNipLoading] = useState(false);

    const handleNipSearch = async () => {
      if (currentOffer.client.nip.length < 10) {
        alert("Wprowadź poprawny numer NIP");
        return;
      }

      setNipLoading(true);
      try {
        const data = await fetchGUSData(currentOffer.client.nip);
        if (data) {
          setCurrentOffer({
            ...currentOffer,
            client: {
              ...currentOffer.client,
              name: data.name,
              address: data.address,
              regon: data.regon,
            },
          });
        } else {
          alert("Nie znaleziono firmy o podanym NIP");
        }
      } catch (error) {
        alert("Błąd podczas pobierania danych z GUS");
      } finally {
        setNipLoading(false);
      }
    };

    const handleAddItem = (item) => {
      setCurrentOffer((prev) => {
        const newTotal = prev.totalNet + item.totalPrice;
        const discountValue = (newTotal * prev.discount) / 100;
        return {
          ...prev,
          items: [...prev.items, item],
          totalNet: newTotal,
          discountValue: discountValue,
          totalNetAfterDiscount: newTotal - discountValue,
        };
      });
    };

    const handleRemoveItem = (itemId) => {
      const item = currentOffer.items.find((i) => i.id === itemId);
      if (item) {
        setCurrentOffer((prev) => {
          const newTotal = prev.totalNet - item.totalPrice;
          const discountValue = (newTotal * prev.discount) / 100;
          return {
            ...prev,
            items: prev.items.filter((i) => i.id !== itemId),
            totalNet: newTotal,
            discountValue: discountValue,
            totalNetAfterDiscount: newTotal - discountValue,
          };
        });
      }
    };

    const updateDiscount = (discount) => {
      const discountValue = (currentOffer.totalNet * discount) / 100;
      setCurrentOffer({
        ...currentOffer,
        discount,
        discountValue,
        totalNetAfterDiscount: currentOffer.totalNet - discountValue,
      });
    };

    const updateDelivery = (regionId) => {
      const region = deliveryRegions.find((r) => r.id === regionId);
      if (region) {
        const totalWeight = currentOffer.items.reduce(
          (sum, item) => sum + (item.calculations?.totalWeight || 0),
          0
        );
        const deliveryCost = Math.max(
          region.pricePerKg * totalWeight,
          region.minPrice
        );

        setCurrentOffer({
          ...currentOffer,
          deliveryRegion: regionId,
          deliveryCost: regionId === "odbior" ? 0 : deliveryCost,
        });
      }
    };

    const handleSaveOffer = () => {
      const newOffer = {
        ...currentOffer,
        id: Date.now(),
        status: "draft",
        shareLink: generateShareLink(currentOffer.number),
      };
      setOffers([...offers, newOffer]);
      setView("offers");

      setNotifications([
        ...notifications,
        {
          id: Date.now(),
          type: "success",
          message: `💾 Oferta ${newOffer.number} została zapisana`,
          date: new Date().toISOString(),
        },
      ]);
    };

    return (
      <div className="space-y-8">
        <div className="bg-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Nowa oferta</h2>
              <p className="text-gray-400">Numer: {currentOffer.number}</p>
              <p className="text-gray-400">Data: {currentOffer.date}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">Handlowiec</p>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm text-gray-400">{currentUser.phone}</p>
            </div>
          </div>

          {/* Nazwa projektu */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Nazwa projektu
            </label>
            <input
              type="text"
              value={currentOffer.projectName}
              onChange={(e) =>
                setCurrentOffer({
                  ...currentOffer,
                  projectName: e.target.value,
                })
              }
              className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              placeholder="np. Ekspozytory targowe 2025"
            />
          </div>
        </div>

        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Dane klienta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                NIP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentOffer.client.nip}
                  onChange={(e) =>
                    setCurrentOffer({
                      ...currentOffer,
                      client: { ...currentOffer.client, nip: e.target.value },
                    })
                  }
                  className="flex-1 bg-zinc-700 rounded-lg px-3 py-2"
                  placeholder="Wprowadź NIP"
                />
                <button
                  onClick={handleNipSearch}
                  disabled={nipLoading}
                  className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                  {nipLoading ? "Pobieranie..." : "Pobierz z GUS"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Nazwa firmy
              </label>
              <input
                type="text"
                value={currentOffer.client.name}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    client: { ...currentOffer.client, name: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Adres
              </label>
              <input
                type="text"
                value={currentOffer.client.address}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    client: { ...currentOffer.client, address: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                E-mail
              </label>
              <input
                type="email"
                value={currentOffer.client.email}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    client: { ...currentOffer.client, email: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Telefon
              </label>
              <input
                type="tel"
                value={currentOffer.client.phone}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    client: { ...currentOffer.client, phone: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                REGON
              </label>
              <input
                type="text"
                value={currentOffer.client.regon}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    client: { ...currentOffer.client, regon: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {currentOffer.items.length > 0 && (
          <div className="bg-zinc-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Pozycje oferty</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left p-2">Produkt</th>
                    <th className="text-left p-2">Materiał</th>
                    <th className="text-left p-2">Wymiary</th>
                    <th className="text-right p-2">Ilość</th>
                    <th className="text-right p-2">Cena jedn.</th>
                    <th className="text-right p-2">Wartość</th>
                    <th className="text-center p-2">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOffer.items.map((item) => (
                    <tr key={item.id} className="border-b border-zinc-700">
                      <td className="p-2">
                        <p className="font-medium">{item.productName}</p>
                        {item.expositorType && (
                          <p className="text-sm text-gray-400">
                            {
                              expositorTypes.find(
                                (t) => t.id === item.expositorType
                              )?.name
                            }
                          </p>
                        )}
                      </td>
                      <td className="p-2">
                        <p>{item.materialName}</p>
                        <p className="text-sm text-gray-400">
                          {item.thickness} mm
                        </p>
                      </td>
                      <td className="p-2 text-sm">
                        {item.dimensions.width} × {item.dimensions.height}
                        {item.dimensions.depth > 0 &&
                          ` × ${item.dimensions.depth}`}{" "}
                        mm
                      </td>
                      <td className="p-2 text-right">{item.quantity} szt</td>
                      <td className="p-2 text-right font-mono">
                        {item.unitPrice.toFixed(2)} zł
                      </td>
                      <td className="p-2 text-right font-mono font-bold">
                        {item.totalPrice.toFixed(2)} zł
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 hover:bg-zinc-600 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-600">
                    <td colSpan="5" className="p-2 text-right font-semibold">
                      Wartość netto:
                    </td>
                    <td className="p-2 text-right font-mono font-bold text-xl">
                      {currentOffer.totalNet.toFixed(2)} zł
                    </td>
                    <td></td>
                  </tr>
                  {/* Rabat */}
                  <tr>
                    <td colSpan="5" className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>Rabat:</span>
                        <input
                          type="number"
                          value={currentOffer.discount}
                          onChange={(e) =>
                            updateDiscount(
                              Math.max(0, Math.min(100, Number(e.target.value)))
                            )
                          }
                          className="w-16 bg-zinc-700 rounded px-2 py-1 text-center"
                          min="0"
                          max="100"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono text-orange-400">
                      -{currentOffer.discountValue.toFixed(2)} zł
                    </td>
                    <td></td>
                  </tr>
                  {/* Dostawa */}
                  <tr>
                    <td colSpan="5" className="p-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span>Region dostawy:</span>
                        <select
                          value={currentOffer.deliveryRegion}
                          onChange={(e) => updateDelivery(e.target.value)}
                          className="bg-zinc-700 rounded px-2 py-1"
                        >
                          {deliveryRegions.map((region) => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-2 text-right font-mono">
                      {currentOffer.deliveryCost > 0
                        ? `+${currentOffer.deliveryCost.toFixed(2)} zł`
                        : "Gratis"}
                    </td>
                    <td></td>
                  </tr>
                  {/* Suma końcowa */}
                  <tr className="border-t-2 border-orange-500 bg-orange-500/10">
                    <td
                      colSpan="5"
                      className="p-3 text-right font-bold text-lg"
                    >
                      DO ZAPŁATY:
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-2xl text-orange-500">
                      {(
                        currentOffer.totalNetAfterDiscount +
                        currentOffer.deliveryCost
                      ).toFixed(2)}{" "}
                      zł
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">
            Dodaj pozycję do oferty
          </h3>
          <CalculatorView onAddToOffer={handleAddItem} />
        </div>

        <div className="bg-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">
            Warunki handlowe i uwagi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Czas realizacji
              </label>
              <input
                type="text"
                value={currentOffer.terms.deliveryTime}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    terms: {
                      ...currentOffer.terms,
                      deliveryTime: e.target.value,
                    },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Sposób dostawy
              </label>
              <input
                type="text"
                value={currentOffer.terms.deliveryMethod}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    terms: {
                      ...currentOffer.terms,
                      deliveryMethod: e.target.value,
                    },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Warunki płatności
              </label>
              <input
                type="text"
                value={currentOffer.terms.paymentTerms}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    terms: {
                      ...currentOffer.terms,
                      paymentTerms: e.target.value,
                    },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-400">
                Ważność oferty
              </label>
              <input
                type="text"
                value={currentOffer.terms.validity}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    terms: { ...currentOffer.terms, validity: e.target.value },
                  })
                }
                className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-400">
              Uwagi do oferty (widoczne dla klienta)
            </label>
            <textarea
              value={currentOffer.comment}
              onChange={(e) =>
                setCurrentOffer({ ...currentOffer, comment: e.target.value })
              }
              rows="3"
              className="w-full bg-zinc-700 rounded-lg px-3 py-2"
              placeholder="Dodatkowe informacje dla klienta..."
            />
          </div>

          {viewMode === "salesperson" && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-yellow-400">
                <Lock className="w-4 h-4 inline mr-1" />
                Notatki wewnętrzne (niewidoczne dla klienta)
              </label>
              <textarea
                value={currentOffer.internalNotes}
                onChange={(e) =>
                  setCurrentOffer({
                    ...currentOffer,
                    internalNotes: e.target.value,
                  })
                }
                rows="3"
                className="w-full bg-zinc-700 rounded-lg px-3 py-2 border border-yellow-600/30"
                placeholder="Notatki dla zespołu sprzedaży..."
              />
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setView("offers")}
            className="px-6 py-3 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-all"
          >
            Anuluj
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleSaveOffer}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Zapisz szkic
            </button>

            <button
              onClick={() => {
                handleSaveOffer();
                setTimeout(() => handlePrintPDF(currentOffer), 100);
              }}
              className="px-6 py-3 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Generuj PDF
            </button>

            <button
              onClick={() => {
                handleSaveOffer();
                setTimeout(() => {
                  navigator.clipboard.writeText(currentOffer.shareLink);
                  alert(
                    `Link do oferty skopiowany!\n\n${currentOffer.shareLink}\n\nKlient może zaakceptować ofertę online.`
                  );
                }, 100);
              }}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Generuj link
            </button>

            <button
              onClick={() => {
                handleSaveOffer();
                setTimeout(() => handleSendEmail(currentOffer), 100);
              }}
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Wyślij ofertę
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Widok podglądu oferty
  const OfferPreview = () => {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Podgląd oferty {currentOffer.number}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView("offers")}
              className="px-4 py-2 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-all"
            >
              Powrót
            </button>
            <button
              onClick={() => handlePrintPDF(currentOffer)}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Drukuj PDF
            </button>
          </div>
        </div>

        <div className="bg-white text-black rounded-xl p-8 shadow-xl">
          <div className="flex justify-between mb-8 pb-6 border-b-2 border-orange-500">
            <div>
              <h1 className="text-3xl font-bold text-orange-500 mb-2">
                PlexiSystem
              </h1>
              <div className="text-sm text-gray-600">
                Ks. Dr. Leona Heyke 11
                <br />
                84-206 Nowy Dwór Wejherowski
                <br />
                NIP: 588-196-72-31
                <br />
                Tel: 884 042 107
                <br />
                www.plexisystem.pl
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold mb-2">Oferta dla:</div>
              <div className="font-bold">{currentOffer.client.name}</div>
              <div className="text-sm">{currentOffer.client.address}</div>
              <div className="text-sm">NIP: {currentOffer.client.nip}</div>
              {currentOffer.client.email && (
                <div className="text-sm">
                  Email: {currentOffer.client.email}
                </div>
              )}
              {currentOffer.client.phone && (
                <div className="text-sm">Tel: {currentOffer.client.phone}</div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Oferta nr {currentOffer.number}
            </h2>
            <div>Data wystawienia: {currentOffer.date}</div>
            <div>Ważna do: {currentOffer.validUntil}</div>
            {currentOffer.projectName && (
              <div className="mt-2 font-semibold">
                Projekt: {currentOffer.projectName}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Handlowiec</div>
              <div className="font-bold">{currentOffer.salesperson.name}</div>
              <div className="text-sm mt-2">
                Tel: {currentOffer.salesperson.phone}
                <br />
                Email: {currentOffer.salesperson.email}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Warunki handlowe</div>
              <div className="text-sm">
                <strong>Termin realizacji:</strong>{" "}
                {currentOffer.terms.deliveryTime}
                <br />
                <strong>Płatność:</strong> {currentOffer.terms.paymentTerms}
                <br />
                <strong>Dostawa:</strong>{" "}
                {
                  deliveryRegions.find(
                    (r) => r.id === currentOffer.deliveryRegion
                  )?.name
                }
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-bold text-orange-500 mb-4">
              Specyfikacja produktów
            </h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="border p-2 text-left">Lp.</th>
                  <th className="border p-2 text-left">Produkt</th>
                  <th className="border p-2 text-left">Wymiary</th>
                  <th className="border p-2 text-left">Materiał</th>
                  <th className="border p-2 text-left">Opcje dodatkowe</th>
                  <th className="border p-2 text-center">Ilość</th>
                  <th className="border p-2 text-right">Cena jedn.</th>
                  <th className="border p-2 text-right">Wartość</th>
                </tr>
              </thead>
              <tbody>
                {currentOffer.items.map((item, index) => {
                  const options = Object.entries(item.options || {})
                    .filter(([key, value]) => value && key !== "wieko")
                    .map(([key]) => {
                      const option = additionalOptions.find(
                        (o) => o.id === key
                      );
                      const qty = item.optionQuantities?.[key];
                      return option
                        ? `${option.name}${qty > 1 ? ` (${qty}x)` : ""}`
                        : null;
                    })
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <tr key={item.id}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">
                        {item.productName}
                        {item.expositorType && (
                          <div className="text-sm text-gray-600">
                            {
                              expositorTypes.find(
                                (t) => t.id === item.expositorType
                              )?.name
                            }
                          </div>
                        )}
                        {item.options?.wieko && (
                          <div className="text-sm text-gray-600">+ Wieko</div>
                        )}
                      </td>
                      <td className="border p-2">
                        {item.dimensions.width} × {item.dimensions.height}
                        {item.dimensions.depth > 0 &&
                          ` × ${item.dimensions.depth}`}{" "}
                        mm
                      </td>
                      <td className="border p-2">
                        {item.materialName}
                        <br />
                        {item.thickness} mm
                      </td>
                      <td className="border p-2 text-sm">{options || "-"}</td>
                      <td className="border p-2 text-center">
                        {item.quantity}
                      </td>
                      <td className="border p-2 text-right">
                        {item.unitPrice.toFixed(2)} zł
                      </td>
                      <td className="border p-2 text-right font-bold">
                        {item.totalPrice.toFixed(2)} zł
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td
                    colSpan="7"
                    className="border p-2 text-right font-semibold"
                  >
                    Wartość netto:
                  </td>
                  <td className="border p-2 text-right font-bold">
                    {currentOffer.totalNet.toFixed(2)} zł
                  </td>
                </tr>
                {currentOffer.discount > 0 && (
                  <tr>
                    <td colSpan="7" className="border p-2 text-right">
                      Rabat {currentOffer.discount}%:
                    </td>
                    <td className="border p-2 text-right text-orange-600">
                      -{currentOffer.discountValue.toFixed(2)} zł
                    </td>
                  </tr>
                )}
                {currentOffer.deliveryCost > 0 && (
                  <tr>
                    <td colSpan="7" className="border p-2 text-right">
                      Koszt dostawy:
                    </td>
                    <td className="border p-2 text-right">
                      {currentOffer.deliveryCost.toFixed(2)} zł
                    </td>
                  </tr>
                )}
                <tr className="bg-yellow-100 font-bold">
                  <td colSpan="7" className="border p-3 text-right">
                    RAZEM NETTO:
                  </td>
                  <td className="border p-3 text-right text-xl">
                    {(
                      currentOffer.totalNetAfterDiscount +
                      currentOffer.deliveryCost
                    ).toFixed(2)}{" "}
                    zł
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-orange-500 mb-4">
              Warunki realizacji
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Czas realizacji:</strong>{" "}
                {currentOffer.terms.deliveryTime}
              </li>
              <li>
                <strong>Dostawa:</strong> {currentOffer.terms.deliveryMethod}
              </li>
              <li>
                <strong>Płatność:</strong> {currentOffer.terms.paymentTerms}
              </li>
              <li>
                <strong>Gwarancja:</strong> {currentOffer.terms.warranty}
              </li>
              <li>
                <strong>Ważność oferty:</strong> {currentOffer.terms.validity}
              </li>
            </ul>
            {currentOffer.comment && (
              <div className="mt-4">
                <strong>Uwagi:</strong> {currentOffer.comment}
              </div>
            )}
          </div>

          {viewMode === "salesperson" && currentOffer.internalNotes && (
            <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg mt-4">
              <p className="text-sm font-semibold text-yellow-800 mb-1">
                <Lock className="w-4 h-4 inline mr-1" />
                Notatki wewnętrzne (niewidoczne w PDF dla klienta):
              </p>
              <p className="text-sm">{currentOffer.internalNotes}</p>
            </div>
          )}

          <div className="text-center mt-12 pt-6 border-t text-sm text-gray-600">
            <p className="mb-2">Dziękujemy za zainteresowanie naszą ofertą!</p>
            <p>
              PlexiSystem - Twój partner w produkcji z plexi i tworzyw
              sztucznych
            </p>
            {currentOffer.shareLink && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold mb-1">
                  Akceptacja online:
                </p>
                <a
                  href={currentOffer.shareLink}
                  className="text-blue-600 underline text-xs break-all"
                >
                  {currentOffer.shareLink}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Generowanie HTML dla PDF
  const generatePDFHTML = (offer) => {
    const itemsHTML = offer.items
      .map((item, index) => {
        const options = Object.entries(item.options || {})
          .filter(([key, value]) => value && key !== "wieko")
          .map(([key]) => {
            const option = additionalOptions.find((o) => o.id === key);
            const qty = item.optionQuantities?.[key];
            return option
              ? `${option.name}${qty > 1 ? ` (${qty}x)` : ""}`
              : null;
          })
          .filter(Boolean)
          .join(", ");

        return `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${item.productName}
            ${
              item.expositorType
                ? `<br><small>${
                    expositorTypes.find((t) => t.id === item.expositorType)
                      ?.name
                  }</small>`
                : ""
            }
            ${item.options?.wieko ? "<br><small>+ Wieko</small>" : ""}
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${item.dimensions.width} × ${item.dimensions.height}${
          item.dimensions.depth > 0 ? ` × ${item.dimensions.depth}` : ""
        } mm
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            ${item.materialName}<br>${item.thickness} mm
          </td>
          <td style="padding: 8px; border: 1px solid #ddd;">${
            options || "-"
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${
            item.quantity
          }</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.unitPrice.toFixed(
            2
          )} zł</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${item.totalPrice.toFixed(
            2
          )} zł</td>
        </tr>
      `;
      })
      .join("");

    const showInternalData = viewMode === "salesperson";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Oferta ${offer.number}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f97316;
          }
          .logo {
            font-size: 28px;
            font-weight: 700;
            color: #f97316;
          }
          .company-info {
            text-align: right;
            font-size: 12px;
            color: #666;
          }
          .offer-info {
            background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .offer-number {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            color: #f97316;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .info-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
          }
          .info-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }
          .info-value {
            font-weight: 600;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background: #f97316;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
          }
          .total-row {
            background: #fef3c7;
            font-weight: 700;
            font-size: 18px;
          }
          .terms {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .internal-note {
            background: #fef3c7;
            border: 2px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .internal-note-header {
            font-weight: 600;
            color: #92400e;
            margin-bottom: 5px;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .header { margin-bottom: 20px; }
            .offer-info { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            ${!showInternalData ? ".internal-note { display: none; }" : ""}
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PlexiSystem</div>
            <div style="font-size: 12px; color: #666; margin-top: 10px;">
              Ks. Dr. Leona Heyke 11<br>
              84-206 Nowy Dwór Wejherowski<br>
              NIP: 588-196-72-31<br>
              Tel: 884 042 107<br>
              www.plexisystem.pl
            </div>
          </div>
          <div class="company-info">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 10px;">Oferta dla:</div>
            <div><strong>${offer.client.name || "Nazwa klienta"}</strong></div>
            <div>${offer.client.address || "Adres"}</div>
            <div>NIP: ${offer.client.nip || "Brak"}</div>
            ${
              offer.client.email
                ? `<div>Email: ${offer.client.email}</div>`
                : ""
            }
            ${offer.client.phone ? `<div>Tel: ${offer.client.phone}</div>` : ""}
          </div>
        </div>

        <div class="offer-info">
          <div class="offer-number">Oferta nr ${offer.number}</div>
          <div>Data wystawienia: ${offer.date}</div>
          <div>Ważna do: ${offer.validUntil}</div>
          ${
            offer.projectName
              ? `<div style="margin-top: 10px; font-weight: 600;">Projekt: ${offer.projectName}</div>`
              : ""
          }
        </div>

        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Handlowiec</div>
            <div class="info-value">${offer.salesperson.name}</div>
            <div style="font-size: 14px; margin-top: 5px;">
              Tel: ${offer.salesperson.phone}<br>
              Email: ${offer.salesperson.email}
            </div>
          </div>
          <div class="info-box">
            <div class="info-label">Warunki handlowe</div>
            <div style="font-size: 14px;">
              <strong>Termin realizacji:</strong> ${
                offer.terms.deliveryTime
              }<br>
              <strong>Płatność:</strong> ${offer.terms.paymentTerms}<br>
              <strong>Dostawa:</strong> ${
                deliveryRegions.find((r) => r.id === offer.deliveryRegion)
                  ?.name || "Do ustalenia"
              }
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Specyfikacja produktów</div>
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">Lp.</th>
                <th style="width: 20%;">Produkt</th>
                <th style="width: 15%;">Wymiary</th>
                <th style="width: 15%;">Materiał</th>
                <th style="width: 20%;">Opcje dodatkowe</th>
                <th style="width: 8%;">Ilość</th>
                <th style="width: 10%;">Cena jedn.</th>
                <th style="width: 12%;">Wartość</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
              <tr>
                <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 600;">
                  Wartość netto:
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: 700;">
                  ${offer.totalNet.toFixed(2)} zł
                </td>
              </tr>
              ${
                offer.discount > 0
                  ? `
              <tr>
                <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                  Rabat ${offer.discount}%:
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: #f97316;">
                  -${offer.discountValue.toFixed(2)} zł
                </td>
              </tr>
              `
                  : ""
              }
              ${
                offer.deliveryCost > 0
                  ? `
              <tr>
                <td colspan="7" style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                  Koszt dostawy:
                </td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">
                  ${offer.deliveryCost.toFixed(2)} zł
                </td>
              </tr>
              `
                  : ""
              }
              <tr class="total-row">
                <td colspan="7" style="padding: 12px; border: 2px solid #f97316; text-align: right;">
                  RAZEM NETTO:
                </td>
                <td style="padding: 12px; border: 2px solid #f97316; text-align: right;">
                  ${(offer.totalNetAfterDiscount + offer.deliveryCost).toFixed(
                    2
                  )} zł
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="terms">
          <div class="section-title">Warunki realizacji</div>
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>Czas realizacji:</strong> ${
              offer.terms.deliveryTime
            }</li>
            <li><strong>Dostawa:</strong> ${offer.terms.deliveryMethod}</li>
            <li><strong>Płatność:</strong> ${offer.terms.paymentTerms}</li>
            <li><strong>Gwarancja:</strong> ${offer.terms.warranty}</li>
            <li><strong>Ważność oferty:</strong> ${offer.terms.validity}</li>
          </ul>
          ${
            offer.comment
              ? `<div style="margin-top: 15px;"><strong>Uwagi:</strong> ${offer.comment}</div>`
              : ""
          }
        </div>

        ${
          showInternalData && offer.internalNotes
            ? `
        <div class="internal-note">
          <div class="internal-note-header">⚠️ NOTATKI WEWNĘTRZNE (nie drukować dla klienta):</div>
          <div>${offer.internalNotes}</div>
        </div>
        `
            : ""
        }

        <div class="footer">
          <p>Dziękujemy za zainteresowanie naszą ofertą!</p>
          <p>PlexiSystem - Twój partner w produkcji z plexi i tworzyw sztucznych</p>
          ${
            offer.shareLink
              ? `
          <div style="margin-top: 15px; padding: 10px; background: #d1fae5; border-radius: 8px;">
            <p style="font-weight: 600; color: #065f46; margin-bottom: 5px;">Akceptacja online:</p>
            <p style="font-size: 11px; color: #047857;">
              <a href="${offer.shareLink}" style="color: #047857;">${offer.shareLink}</a>
            </p>
          </div>
          `
              : ""
          }
        </div>
      </body>
      </html>
    `;
  };

  // Funkcje pomocnicze
  const handlePrintPDF = (offer) => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(generatePDFHTML(offer));
    iframeDoc.close();

    iframe.onload = function () {
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 100);
      }, 500);
    };
  };

  const handleSendEmail = async (offer) => {
    if (!offer.client.email) {
      alert("Brak adresu e-mail klienta");
      return;
    }

    alert(
      `Oferta ${offer.number} zostanie wysłana na adres: ${offer.client.email}\n\nLink do akceptacji online:\n${offer.shareLink}`
    );

    const updatedOffers = offers.map((o) =>
      o.id === offer.id ? { ...o, status: "sent" } : o
    );
    setOffers(updatedOffers);

    setNotifications([
      ...notifications,
      {
        id: Date.now(),
        type: "success",
        message: `📧 Oferta ${offer.number} została wysłana do ${offer.client.name}`,
        date: new Date().toISOString(),
      },
    ]);
  };

  // Efekt dla przypomnień - sprawdzanie co minutę
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      offers.forEach((offer) => {
        if (offer.status === "sent") {
          const validUntil = new Date(offer.validUntil);
          const daysUntilExpiry = Math.ceil(
            (validUntil - now) / (1000 * 60 * 60 * 24)
          );

          if (daysUntilExpiry <= 2 && daysUntilExpiry > 0) {
            const existingNotification = notifications.find(
              (n) => n.message.includes(offer.number) && n.type === "warning"
            );

            if (!existingNotification) {
              setNotifications((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  type: "warning",
                  message: `⚠️ Oferta ${offer.number} dla ${offer.client.name} wygasa za ${daysUntilExpiry} dni!`,
                  date: now.toISOString(),
                },
              ]);
            }
          } else if (daysUntilExpiry < 0 && offer.status === "sent") {
            // Automatyczna zmiana statusu na odrzuconą po wygaśnięciu
            const updatedOffers = offers.map((o) =>
              o.id === offer.id ? { ...o, status: "rejected" } : o
            );
            setOffers(updatedOffers);

            setNotifications((prev) => [
              ...prev,
              {
                id: Date.now() + Math.random(),
                type: "error",
                message: `❌ Oferta ${offer.number} wygasła i została oznaczona jako odrzucona`,
                date: now.toISOString(),
              },
            ]);
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Co minutę

    return () => clearInterval(interval);
  }, [offers, notifications]);

  // Aktualizuj currentOffer gdy zmienia się currentUser
  useEffect(() => {
    setCurrentOffer((prev) => ({
      ...prev,
      salesperson: currentUser,
      number: generateOfferNumber(),
    }));
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 border-b border-zinc-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-orange-500">
                PlexiSystem
              </h1>
              <nav className="flex gap-4">
                <button
                  onClick={() => setView("calculator")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    view === "calculator"
                      ? "bg-orange-500"
                      : "hover:bg-zinc-700"
                  }`}
                >
                  <Calculator className="w-4 h-4 inline mr-2" />
                  Kalkulator
                </button>
                <button
                  onClick={() => setView("offers")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    view === "offers" ||
                    view === "new-offer" ||
                    view === "view-offer"
                      ? "bg-orange-500"
                      : "hover:bg-zinc-700"
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  Oferty
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Przełącznik trybu widoku */}
              <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-2">
                <button
                  onClick={() => setViewMode("salesperson")}
                  className={`px-3 py-1 rounded transition-all ${
                    viewMode === "salesperson"
                      ? "bg-orange-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Tryb handlowca - pełne dane"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("client")}
                  className={`px-3 py-1 rounded transition-all ${
                    viewMode === "client"
                      ? "bg-blue-500 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Tryb klienta - widok publiczny"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Tryb:{" "}
                  <span className="font-semibold">
                    {viewMode === "salesperson" ? "Handlowiec" : "Klient"}
                  </span>
                </p>
                <p className="font-semibold">{currentUser.name}</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-zinc-700 rounded-lg transition-all relative"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full px-1.5 py-0.5 text-xs">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-12 w-96 bg-zinc-800 rounded-lg shadow-xl border border-zinc-700 max-h-96 overflow-y-auto z-50">
                    <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
                      <h3 className="font-semibold">Powiadomienia</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => setNotifications([])}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          Wyczyść wszystkie
                        </button>
                      )}
                    </div>
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">
                          Brak powiadomień
                        </p>
                      ) : (
                        notifications
                          .slice()
                          .reverse()
                          .map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 hover:bg-zinc-700 rounded-lg mb-2 border-l-4 ${
                                notification.type === "success"
                                  ? "border-green-500"
                                  : notification.type === "error"
                                  ? "border-red-500"
                                  : notification.type === "warning"
                                  ? "border-yellow-500"
                                  : "border-blue-500"
                              }`}
                            >
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.date).toLocaleString(
                                  "pl-PL"
                                )}
                              </p>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 bg-zinc-700 rounded-lg px-3 py-2">
                <User className="w-4 h-4" />
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const newUser = salespeople.find(
                      (s) => s.id === e.target.value
                    );
                    setCurrentUser(newUser);
                    setNotifications((prev) => [
                      ...prev,
                      {
                        id: Date.now(),
                        type: "info",
                        message: `👤 Przełączono na użytkownika: ${newUser.name}`,
                        date: new Date().toISOString(),
                      },
                    ]);
                  }}
                  className="bg-transparent text-sm"
                >
                  {salespeople.map((sp) => (
                    <option key={sp.id} value={sp.id} className="bg-zinc-800">
                      {sp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === "calculator" && (
          <CalculatorView
            onAddToOffer={(item) => {
              setCurrentOffer((prev) => ({
                ...prev,
                number: generateOfferNumber(),
                items: [item],
                totalNet: item.totalPrice,
                discountValue: (item.totalPrice * prev.discount) / 100,
                totalNetAfterDiscount:
                  item.totalPrice - (item.totalPrice * prev.discount) / 100,
              }));
              setView("new-offer");

              setNotifications((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  type: "info",
                  message:
                    "📦 Produkt dodany do nowej oferty. Uzupełnij dane klienta.",
                  date: new Date().toISOString(),
                },
              ]);
            }}
          />
        )}

        {view === "offers" && <OffersListView />}
        {view === "new-offer" && <OfferView />}
        {view === "view-offer" && <OfferPreview />}
      </main>
    </div>
  );
};

export default PlexiSystemApp;
