"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface InventoryItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  color_shade?: string;
  unit: "ml" | "grams" | "pieces" | "bottles" | "tubes" | "packets";
  package_size: number;
  current_stock: number;
  minimum_stock: number;
  purchase_price: number;
  supplier: string;
  expiry_date: string;
  batch_number: string;
}

interface ServiceRecipe {
  id: string;
  service_name: string;
  ingredients: {
    product_name: string;
    quantity: number;
    unit: string;
  }[];
}

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Black Hair Colour 1.0",
    brand: "L'Oreal Majirel",
    category: "Hair Colour",
    color_shade: "Natural Black 1.0",
    unit: "ml",
    package_size: 50,
    current_stock: 450,
    minimum_stock: 700,
    purchase_price: 420,
    supplier: "Beauty Care Distributors",
    expiry_date: "2026-08-30",
    batch_number: "MAJ-8821",
  },
  {
    id: "inv-2",
    name: "20 Vol Oxydant Developer",
    brand: "L'Oreal Professional",
    category: "Developer",
    unit: "ml",
    package_size: 1000,
    current_stock: 1200,
    minimum_stock: 800,
    purchase_price: 650,
    supplier: "Beauty Care Distributors",
    expiry_date: "2027-02-15",
    batch_number: "DEV-1092",
  },
  {
    id: "inv-3",
    name: "Deep Cleansing Shampoo",
    brand: "Schwarzkopf Professional",
    category: "Hair Wash",
    unit: "ml",
    package_size: 1000,
    current_stock: 650,
    minimum_stock: 1000,
    purchase_price: 850,
    supplier: "North Star Salon Supplies",
    expiry_date: "2026-12-01",
    batch_number: "SHM-4321",
  },
  {
    id: "inv-4",
    name: "Intense Moisture Conditioner",
    brand: "Schwarzkopf Professional",
    category: "Conditioner",
    unit: "ml",
    package_size: 1000,
    current_stock: 1500,
    minimum_stock: 500,
    purchase_price: 900,
    supplier: "North Star Salon Supplies",
    expiry_date: "2026-11-20",
    batch_number: "CND-7711",
  },
  {
    id: "inv-5",
    name: "Disposable Cutting Capes",
    brand: "ProSalon Essentials",
    category: "Disposables",
    unit: "pieces",
    package_size: 100,
    current_stock: 35,
    minimum_stock: 50,
    purchase_price: 300,
    supplier: "Direct Hygiene India",
    expiry_date: "2029-01-01",
    batch_number: "HYG-002",
  },
  {
    id: "inv-6",
    name: "Keratin Treatment Serum",
    brand: "GK Hair Resistant",
    category: "Hair Treatment",
    unit: "ml",
    package_size: 1000,
    current_stock: 400,
    minimum_stock: 300,
    purchase_price: 4500,
    supplier: "Elite Curls & Co.",
    expiry_date: "2026-06-15",
    batch_number: "KRT-901",
  },
];

const INITIAL_RECIPES: ServiceRecipe[] = [
  {
    id: "rec-1",
    service_name: "Global Hair Colour Service",
    ingredients: [
      { product_name: "Black Hair Colour 1.0", quantity: 50, unit: "ml" },
      { product_name: "20 Vol Oxydant Developer", quantity: 75, unit: "ml" },
      { product_name: "Deep Cleansing Shampoo", quantity: 15, unit: "ml" },
      { product_name: "Intense Moisture Conditioner", quantity: 15, unit: "ml" },
    ],
  },
  {
    id: "rec-2",
    service_name: "Hair Spa Ritual",
    ingredients: [
      { product_name: "Deep Cleansing Shampoo", quantity: 20, unit: "ml" },
      { product_name: "Intense Moisture Conditioner", quantity: 30, unit: "ml" },
      { product_name: "Disposable Cutting Capes", quantity: 1, unit: "pieces" },
    ],
  },
];

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"stock" | "recipes" | "reorder" | "adjust">("stock");
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [recipes, setRecipes] = useState<ServiceRecipe[]>(INITIAL_RECIPES);

  // Manual stock adjustment form
  const [adjustProductId, setAdjustProductId] = useState(INITIAL_INVENTORY[0].id);
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState<"purchase" | "wastage" | "correction">("purchase");

  // Reorder list calculation
  const reorderItems = inventory.filter((item) => item.current_stock < item.minimum_stock);

  const handleStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(adjustQty);
    if (isNaN(qty) || qty <= 0) return;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === adjustProductId) {
          const newStock =
            adjustReason === "purchase"
              ? item.current_stock + qty
              : Math.max(0, item.current_stock - qty);
          return { ...item, current_stock: newStock };
        }
        return item;
      })
    );
    alert(`Inventory adjusted successfully for ${adjustReason}!`);
    setAdjustQty("");
  };

  return (
    <main className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Salon Inventory & Recipes</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Material usage tracking, automated recipe deductions on completed appointments, and stock alerts.
          </p>
        </div>

        {reorderItems.length > 0 && (
          <div className="bg-red-500/15 border border-red-500/30 px-3.5 py-2 rounded-xl text-xs text-red-300 font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{reorderItems.length} Products below minimum stock!</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
        {[
          { id: "stock", label: "📦 Product Stock Levels", count: inventory.length },
          { id: "recipes", label: "🧪 Service Recipes (Formulas)", count: recipes.length },
          { id: "reorder", label: "🚨 Minimum Stock & Reorder List", count: reorderItems.length },
          { id: "adjust", label: "⚖️ Stock In/Out & Wastage" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
          </button>
        ))}
      </div>

      {/* TAB 1: PRODUCT STOCK LEVELS */}
      {activeTab === "stock" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-white">Salon Supply Items</h2>
            <span className="text-xs text-zinc-400">Total tracked: {inventory.length} items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Product & Brand</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Unit</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Min Stock</th>
                  <th className="p-3.5">Unit Price</th>
                  <th className="p-3.5">Supplier</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {inventory.map((item) => {
                  const isLow = item.current_stock < item.minimum_stock;
                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="p-3.5 font-medium text-white">
                        <div>{item.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          {item.brand} • Batch: {item.batch_number}
                        </div>
                      </td>
                      <td className="p-3.5">{item.category}</td>
                      <td className="p-3.5 font-mono">{item.unit}</td>
                      <td className="p-3.5 font-bold font-mono">
                        <span className={isLow ? "text-red-400" : "text-emerald-400"}>
                          {item.current_stock} {item.unit}
                        </span>
                      </td>
                      <td className="p-3.5 text-zinc-400 font-mono">
                        {item.minimum_stock} {item.unit}
                      </td>
                      <td className="p-3.5">{formatCurrency(item.purchase_price)}</td>
                      <td className="p-3.5 text-zinc-400">{item.supplier}</td>
                      <td className="p-3.5">
                        {isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-semibold text-[10px]">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px]">
                            Sufficient
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICE RECIPES (FORMULAS) */}
      {activeTab === "recipes" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/30 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              🧪 Automatic Material Consumption Architecture
            </h3>
            <p className="text-xs text-zinc-300 mt-1">
              When an appointment status is marked <strong className="text-emerald-400">Completed</strong>, the system automatically looks up its recipe and deducts exact ingredient quantities from live inventory. No inventory is deducted when merely booked.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipes.map((rec) => (
              <div
                key={rec.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-white">{rec.service_name}</h3>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                    Recipe Configured
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Material Deductions Per Service:
                  </span>
                  {rec.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex justify-between items-center text-xs"
                    >
                      <span className="text-zinc-200">{ing.product_name}</span>
                      <span className="font-mono font-bold text-amber-400">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MINIMUM STOCK ALERTS & REORDER LIST */}
      {activeTab === "reorder" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-white">Suggested Reorder Procurement List</h2>
              <p className="text-xs text-zinc-400">
                Calculated automatically: Items where Current Stock &lt; Minimum Stock Threshold.
              </p>
            </div>
            <button
              onClick={() => alert("Reorder Purchase Order exported as PDF & sent to suppliers via WhatsApp.")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs rounded-xl shadow-md"
            >
              📥 Export Purchase Order
            </button>
          </div>

          <div className="space-y-3">
            {reorderItems.map((item) => {
              const deficit = item.minimum_stock - item.current_stock;
              const suggestedPurchaseQty = Math.ceil((deficit * 1.5) / item.package_size) * item.package_size;
              const estimatedCost = (suggestedPurchaseQty / item.package_size) * item.purchase_price;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-zinc-950 rounded-xl border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      <span className="text-xs text-zinc-400 font-mono">({item.brand})</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                      <span>
                        Available:{" "}
                        <strong className="text-red-400 font-mono">
                          {item.current_stock} {item.unit}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Min Threshold:{" "}
                        <strong className="text-zinc-200 font-mono">
                          {item.minimum_stock} {item.unit}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>Supplier: <strong className="text-zinc-200">{item.supplier}</strong></span>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <div>
                      <span className="text-xs text-zinc-500 block">Suggested Reorder</span>
                      <span className="text-sm font-bold text-amber-400 font-mono">
                        +{suggestedPurchaseQty} {item.unit}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      Est. Cost: <strong className="text-white">{formatCurrency(estimatedCost)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}

            {reorderItems.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-400">
                All inventory products are sufficiently stocked above minimum levels!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MANUAL ADJUSTMENTS & WASTAGE TRACKING */}
      {activeTab === "adjust" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 max-w-xl mx-auto space-y-4">
          <h2 className="text-base font-bold text-white">Manual Stock In / Wastage Log</h2>
          <p className="text-xs text-zinc-400">
            Record fresh purchase shipments, spillages, expired tubes, or manual stock corrections.
          </p>

          <form onSubmit={handleStockAdjustment} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Select Item</label>
              <select
                value={adjustProductId}
                onChange={(e) => setAdjustProductId(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
              >
                {inventory.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name} (Current: {i.current_stock} {i.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Adjustment Type
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full h-11 px-3 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="purchase">Fresh Purchase (+ Stock)</option>
                  <option value="wastage">Wastage / Spillage (- Stock)</option>
                  <option value="correction">Manual Correction (- Stock)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 100"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  className="w-full h-11 px-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20"
            >
              Apply Inventory Adjustment ✓
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

