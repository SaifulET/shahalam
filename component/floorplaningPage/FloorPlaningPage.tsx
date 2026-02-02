"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

type UnitTone = "available" | "reserved" | "sold";

type Unit = {
  label: string;
  tone: UnitTone;
  wide?: boolean;
};

type UnitRow = {
  units: Unit[];
};

type FloorPlan = {
  id: string;
  name: string;
  unitRows: UnitRow[];
  floorLabels: string[];
  models: Array<{ name: string; size: string; note: string }>;
  annexInfo: Array<{ name: string; size: string; details: string[] }>;
};

// Different floor plans for each project
const floorPlans: Record<string, FloorPlan> = {
  "Downtown Plaza": {
    id: "downtown-plaza",
    name: "Downtown Plaza",
    unitRows: [
      {
        units: [
          { label: "B", tone: "available", wide: true },
          { label: "A", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "E", tone: "sold", wide: true },
          { label: "D", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "A", tone: "available" },
          { label: "C", tone: "reserved" },
          { label: "E", tone: "available" },
          { label: "A", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "B", tone: "reserved", wide: true },
          { label: "C", tone: "available" },
          { label: "D", tone: "available" },
        ],
      },
      {
        units: [
          { label: "A", tone: "available" },
          { label: "C", tone: "available" },
          { label: "B", tone: "sold" },
          { label: "D", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "88 sqm", note: "Front" },
      { name: "Model B", size: "83 sqm", note: "Front" },
      { name: "Model C", size: "102 sqm", note: "Front" },
      { name: "Model D", size: "80.8 sqm", note: "Front" },
      { name: "Model E", size: "83 sqm", note: "Front" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "194 sqm",
        details: ["155 sqm Financial Area", "39 sqm Roof"],
      },
      {
        name: "Annex B",
        size: "201 sqm",
        details: ["162 sqm Built-up Area", "39 sqm Roof"],
      },
    ],
  },
  "Riverside Residences": {
    id: "riverside-residences",
    name: "Riverside Residences",
    unitRows: [
      {
        units: [
          { label: "A", tone: "available", wide: true },
          { label: "B", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "C", tone: "sold", wide: true },
          { label: "D", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "A", tone: "available" },
          { label: "B", tone: "reserved" },
          { label: "C", tone: "available" },
          { label: "D", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "A", tone: "reserved", wide: true },
          { label: "B", tone: "available" },
          { label: "C", tone: "available" },
        ],
      },
      {
        units: [
          { label: "A", tone: "available" },
          { label: "B", tone: "available" },
          { label: "C", tone: "sold" },
          { label: "D", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "95 sqm", note: "River" },
      { name: "Model B", size: "110 sqm", note: "Garden" },
      { name: "Model C", size: "85 sqm", note: "City" },
      { name: "Model D", size: "120 sqm", note: "Lake" },
      { name: "Model E", size: "90 sqm", note: "Park" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "220 sqm",
        details: ["180 sqm Living Area", "40 sqm Balcony"],
      },
      {
        name: "Annex B",
        size: "210 sqm",
        details: ["170 sqm Living Area", "40 sqm Terrace"],
      },
    ],
  },
  "Tech Hub Campus": {
    id: "tech-hub-campus",
    name: "Tech Hub Campus",
    unitRows: [
      {
        units: [
          { label: "101", tone: "available", wide: true },
          { label: "102", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "103", tone: "sold", wide: true },
          { label: "104", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "201", tone: "available" },
          { label: "202", tone: "reserved" },
          { label: "203", tone: "available" },
          { label: "204", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "301", tone: "reserved", wide: true },
          { label: "302", tone: "available" },
          { label: "303", tone: "available" },
        ],
      },
      {
        units: [
          { label: "401", tone: "available" },
          { label: "402", tone: "available" },
          { label: "403", tone: "sold" },
          { label: "404", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "45 sqm", note: "Tech" },
      { name: "Model B", size: "65 sqm", note: "Tech" },
      { name: "Model C", size: "90 sqm", note: "Tech" },
      { name: "Model D", size: "120 sqm", note: "Tech" },
      { name: "Model E", size: "150 sqm", note: "Tech" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "280 sqm",
        details: ["230 sqm Workspace", "50 sqm Lab"],
      },
      {
        name: "Annex B",
        size: "260 sqm",
        details: ["210 sqm Office", "50 sqm Meeting"],
      },
    ],
  },
  "Metro Shopping Center": {
    id: "metro-shopping-center",
    name: "Metro Shopping Center",
    unitRows: [
      {
        units: [
          { label: "S1", tone: "available", wide: true },
          { label: "S2", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "M1", tone: "sold", wide: true },
          { label: "M2", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "L1", tone: "available" },
          { label: "L2", tone: "reserved" },
          { label: "L3", tone: "available" },
          { label: "L4", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "K1", tone: "reserved", wide: true },
          { label: "K2", tone: "available" },
          { label: "K3", tone: "available" },
        ],
      },
      {
        units: [
          { label: "P1", tone: "available" },
          { label: "P2", tone: "available" },
          { label: "P3", tone: "sold" },
          { label: "P4", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "50 sqm", note: "Retail" },
      { name: "Model B", size: "100 sqm", note: "Retail" },
      { name: "Model C", size: "150 sqm", note: "Retail" },
      { name: "Model D", size: "200 sqm", note: "Retail" },
      { name: "Model E", size: "250 sqm", note: "Retail" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "350 sqm",
        details: ["300 sqm Storage", "50 sqm Office"],
      },
      {
        name: "Annex B",
        size: "320 sqm",
        details: ["270 sqm Service", "50 sqm Utility"],
      },
    ],
  },
  "Grand Hotel Renovation": {
    id: "grand-hotel-renovation",
    name: "Grand Hotel Renovation",
    unitRows: [
      {
        units: [
          { label: "Suite A", tone: "available", wide: true },
          { label: "Suite B", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "Suite C", tone: "sold", wide: true },
          { label: "Suite D", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "Room 301", tone: "available" },
          { label: "Room 302", tone: "reserved" },
          { label: "Room 303", tone: "available" },
          { label: "Room 304", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "Suite E", tone: "reserved", wide: true },
          { label: "Room 401", tone: "available" },
          { label: "Room 402", tone: "available" },
        ],
      },
      {
        units: [
          { label: "Room 501", tone: "available" },
          { label: "Room 502", tone: "available" },
          { label: "Room 503", tone: "sold" },
          { label: "Room 504", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "40 sqm", note: "Hotel" },
      { name: "Model B", size: "60 sqm", note: "Hotel" },
      { name: "Model C", size: "80 sqm", note: "Hotel" },
      { name: "Model D", size: "100 sqm", note: "Hotel" },
      { name: "Model E", size: "150 sqm", note: "Hotel" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "280 sqm",
        details: ["230 sqm Service", "50 sqm Staff"],
      },
      {
        name: "Annex B",
        size: "300 sqm",
        details: ["250 sqm Meeting", "50 sqm Lounge"],
      },
    ],
  },
  "Innovation Academy": {
    id: "innovation-academy",
    name: "Innovation Academy",
    unitRows: [
      {
        units: [
          { label: "Lab A", tone: "available", wide: true },
          { label: "Lab B", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "Studio A", tone: "sold", wide: true },
          { label: "Studio B", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "Class 101", tone: "available" },
          { label: "Class 102", tone: "reserved" },
          { label: "Class 103", tone: "available" },
          { label: "Class 104", tone: "sold" },
        ],
      },
      {
        units: [
          { label: "Library", tone: "reserved", wide: true },
          { label: "Lab C", tone: "available" },
          { label: "Lab D", tone: "available" },
        ],
      },
      {
        units: [
          { label: "Office 201", tone: "available" },
          { label: "Office 202", tone: "available" },
          { label: "Office 203", tone: "sold" },
          { label: "Office 204", tone: "available" },
        ],
      },
    ],
    floorLabels: ["Annex", "4th Floor", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "Model A", size: "80 sqm", note: "Academy" },
      { name: "Model B", size: "100 sqm", note: "Academy" },
      { name: "Model C", size: "120 sqm", note: "Academy" },
      { name: "Model D", size: "50 sqm", note: "Academy" },
      { name: "Model E", size: "150 sqm", note: "Academy" },
    ],
    annexInfo: [
      {
        name: "Annex A",
        size: "320 sqm",
        details: ["270 sqm Research", "50 sqm Storage"],
      },
      {
        name: "Annex B",
        size: "290 sqm",
        details: ["240 sqm Study", "50 sqm Common"],
      },
    ],
  },
};

const projects = Object.keys(floorPlans);

export default function RealEstateProject() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [selectedProject, setSelectedProject] =
    useState<string>("Downtown Plaza");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<
    "apartment" | "annex" | null
  >(null);
  const isArabic = lang === "ar";
  const exportRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const currentFloorPlan = floorPlans[selectedProject];

  const floorLabelsLocalized = isArabic
    ? currentFloorPlan.floorLabels.map((label) => `الدور ${label}`)
    : currentFloorPlan.floorLabels;

  const floorsPanel = (
    <div
      className="flex h-full min-h-[260px] flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#1a221f]/30 px-4 py-6 text-center text-sm uppercase tracking-[0.2em] text-[#F2DFA7] sf-pro"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {floorLabelsLocalized.map((label) => (
        <span key={label} className="leading-6">
          {label}
        </span>
      ))}
    </div>
  );

  const unitsPanel = (
    <div className="space-y-5">
      {currentFloorPlan.unitRows.map((row, index) => {
        // Calculate the appropriate width for each unit based on the number of units in the row
        const unitCount = row.units.length;
        let gridCols = "grid-cols-4"; // Default for 4 units

        if (unitCount === 1) {
          gridCols = "grid-cols-1";
        } else if (unitCount === 2) {
          gridCols = "grid-cols-2";
        } else if (unitCount === 3) {
          gridCols = "grid-cols-3";
        } else if (unitCount === 5) {
          gridCols = "grid-cols-5";
        }

        return (
          <div key={`row-${index}`} className={`grid ${gridCols} gap-3`}>
            {row.units.map((unit, idx) => (
              <UnitPill
                key={`${unit.label}-${idx}`}
                unit={unit}
                unitCount={unitCount}
              />
            ))}
          </div>
        );
      })}
    </div>
  );

  const handleAdd = () => {
    // setShowAddPopup(true);
    // setSelectedUnitType(null);
    router.push("/addunit")
  };

  const handleEdit = () => {
    router.push(`/dashboard/${currentFloorPlan.id}`);
  };

  const handleContinue = () => {
    if (!selectedUnitType) return;

    setShowAddPopup(false);
    if (selectedUnitType === "annex") {
      router.push(`/addmodel`);
    } else {
      router.push(`/addunit`);
    }
  };

  const handleCancel = () => {
    setShowAddPopup(false);
    setSelectedUnitType(null);
  };

  const handleExportPdf = () => {
    if (!exportRef.current) return;
    exportRef.current.classList.add("print-export");
    const cleanup = () => {
      exportRef.current?.classList.remove("print-export");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  };

  return (
    <main
      className={`${body.className} min-h-screen bg-white dark:bg-[#0b1110] text-white`}
      lang={lang}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html,
          body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          body * {
            visibility: hidden !important;
          }
          .print-export,
          .print-export * {
            visibility: visible !important;
          }
          .print-export,
          .print-export * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-export {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            padding: 8mm !important;
            page-break-after: avoid !important;
            break-after: avoid-page !important;
          }
          .print-export .print-floor-layout {
            display: grid !important;
            grid-template-columns: 1fr 220px !important;
            align-items: center !important;
            gap: 24px !important;
            margin-top: 16px !important;
          }
          .print-export .print-scale {
            transform: scale(0.9) !important;
            transform-origin: top left !important;
            width: calc((210mm - 16mm) / 0.86) !important;
            min-height: 0 !important;
            height: 100% !important;
          }
          .print-export .print-models {
            margin-top: 10px !important;
            padding-top: 12px !important;
          }
          .print-export .print-annex {
            margin-top: 10px !important;
            padding-top: 12px !important;
          }
          .print-export .print-footer {
            margin-top: 12px !important;
          }
          .print-export .print-models,
          .print-export .print-models *,
          .print-export .print-annex,
          .print-export .print-annex * {
            color: #ffffff !important;
            text-shadow: none !important;
          }
          .print-export .print-pill {
            display: inline-flex !important;
            padding: 0.25rem 0.75rem !important;
            color: #374151 !important;
          }
          .print-export .print-white-overlay {
            background-color: rgba(0, 0, 0, 0.05) !important;
          }
          .print-export .print-bg {
            opacity: 0.9 !important;
          }
        }
      `}</style>

      {/* Add Unit Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className=" flex items-center justify-center bg-white p-6 rounded dark:bg-black transition-colors">
            <div className="w-full max-w-md px-6 ">
              {/* Title */}
              <h1 className="text-2xl font-semibold text-center mb-8 text-gray-900 dark:text-white">
                Unit Type
              </h1>

              {/* Radio Options */}
              <div className="flex gap-6 mb-8 justify-center">
                {/* Apartment Option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="unitType"
                      value="apartment"
                      checked={selectedUnitType === "apartment"}
                      onChange={() => setSelectedUnitType("apartment")}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 peer-checked:border-blue-500 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">
                    Apartment
                  </span>
                </label>

                {/* Annex Option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="unitType"
                      value="annex"
                      checked={selectedUnitType === "annex"}
                      onChange={() => setSelectedUnitType("annex")}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 peer-checked:border-blue-500 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">
                    Annex
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-white bg-white dark:bg-black text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  Cancel
                </button>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!selectedUnitType}
                  className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <div className="grid grid-cols-[240px_1fr] p-6" dir="ltr">
          <aside className="border-r border-white/10 dark:bg-[#0f1513] bg-[#E5E7EB] px-4 py-6 rounded-2xl">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#111827] dark:text-white/40">
              Project Name
            </div>
            <nav className="space-y-2 text-sm">
              {projects.map((project) => (
                <button
                  key={project}
                  onClick={() => setSelectedProject(project)}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-left text-[#1F2937] dark:text-white/70 transition",
                    project === selectedProject
                      ? "darK:bg-emerald-500/20 bg-[#0088FF33] text-[#1F2937] dark:text-white ring-1 ring-emerald-500/40"
                      : "dark:hover:bg-white/10 hover:bg-[#1F2937] hover:text-white dark:hover:text-white",
                  ].join(" ")}
                >
                  {project}
                </button>
              ))}
            </nav>
          </aside>

          <section className="flex flex-col items-center justify-center px-6">
            <div className="mb-6 flex w-full flex-wrap items-center justify-end gap-2">
              <button
                onClick={handleEdit}
                className="rounded-xl border border-[#D1D5DB] dark:border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 text-[#374151] text-md dark:text-[#D3D7DE]"
              >
                ✎ Edit
              </button>
              <button
                onClick={handleAdd}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0088FF] text-lg font-semibold text-[#FFFFFF]"
              >
                +
              </button>
              <button
                onClick={handleExportPdf}
                className="rounded-xl bg-[#0088FF] px-3 py-2 font-semibold text-[#FFFFFF] flex"
              >
                <Download className="w-6 h-6 pr-1" /> Export PDF
              </button>
            </div>
            <div
              className="relative w-full overflow-hidden rounded-md border border-white/10 "
              dir="ltr"
              ref={exportRef}
              data-export="true"
              data-lang={lang}
            >
              <div className="print-bg absolute inset-0 opacity-40">
                <Image
                  src="/bg.jpg"
                  alt="Building background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="print-white-overlay absolute inset-0 bg-black/15" />

              <div className="print-scale relative flex min-h-[720px] flex-col px-8 py-10 lg:px-16">
                <header className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-[32px]">
                    <Image
                      src="/logo.svg"
                      alt="WSL logo"
                      width={160}
                      height={160}
                      className="h-[160px] w-[160px]"
                    />
                  </div>
                </header>

                <div
                  className={`print-floor-layout mt-10 grid flex-1 items-center gap-6 ${"md:grid-cols-[1fr_220px]"}`}
                >
                  {unitsPanel}
                  {floorsPanel}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-[#F2DFA7]">
                  <LegendPill colorClass="bg-[#006400]" label="Available" />
                  <LegendPill colorClass="bg-[#D5B60A]" label="Reserved" />
                  <LegendPill colorClass="bg-[#6F0000]" label="Sold" />
                </div>

                <div className="print-models mt-8 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm uppercase tracking-[0.16em] text-white/60 sm:grid-cols-5">
                    {currentFloorPlan.models.map((model) => (
                      <div key={model.name} className="space-y-2">
                        <div className="print-pill inline-flex px-3 py-1 text-base bg-amber-100/70 rounded-full text-[#1B1B1F] sf-pro">
                          {model.name}
                        </div>
                        <div className="text-white/70">{model.size}</div>
                        <div className="text-white/40">{model.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="print-annex mt-6 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm uppercase tracking-[0.16em] text-white/60 sm:grid-cols-2">
                    {currentFloorPlan.annexInfo.map((annex) => (
                      <div key={annex.name} className="space-y-2">
                        <div className="print-pill inline-flex px-3 py-1 text-base bg-amber-100/70 rounded-full text-gray-700 sf-pro">
                          {annex.name}
                        </div>
                        <div className="text-white/70">{annex.size}</div>
                        {annex.details.map((detail, index) => (
                          <div key={index} className="text-white/40">
                            {detail}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-[70px] flex flex-wrap items-center justify-between gap-4 text-xs text-white sf-pro">
                  <div className="flex items-center gap-2  font-bold text-[32px] leading-none tracking-normal text-center">
                    <div>
                      <Image
                        src="/instagram.svg"
                        alt="instagram"
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <Image
                        src="/alart.svg"
                        alt="instagram"
                        width={60}
                        height={60}
                      />
                    </div>
                    wsl.realestate
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function UnitPill({ unit, unitCount = 4 }: { unit: Unit; unitCount?: number }) {
  const toneClass =
    unit.tone === "available"
      ? "bg-[#014d01]"
      : unit.tone === "reserved"
        ? "bg-[#D5B60A] text-black"
        : "bg-[#6F0000]";

  // Calculate column span based on number of units in the row
  let colSpan = "col-span-1";
  if (unitCount === 1) {
    colSpan = "col-span-1";
  } else if (unitCount === 2) {
    colSpan = unit.wide ? "col-span-1" : "col-span-1";
  } else if (unitCount === 3) {
    colSpan = "col-span-1";
  } else if (unitCount === 4) {
    colSpan = unit.wide ? "col-span-2" : "col-span-1";
  } else if (unitCount === 5) {
    colSpan = "col-span-1";
  }

  return (
    <div
      className={[
        "flex h-14 items-center justify-center rounded-2xl text-lg font-semibold md:h-16 md:text-xl",
        "shadow-[0_12px_24px_rgba(0,0,0,0.25)]",
        colSpan,
        toneClass,
      ].join(" ")}
    >
      {unit.label}
    </div>
  );
}

function LegendPill({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
      <span className={`h-3 w-6 rounded-full ${colorClass}`} />
      {label}
    </span>
  );
}
