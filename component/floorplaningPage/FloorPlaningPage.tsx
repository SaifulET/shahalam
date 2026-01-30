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
      { name: "Annex A", size: "194 sqm", details: ["155 sqm Financial Area", "39 sqm Roof"] },
      { name: "Annex B", size: "201 sqm", details: ["162 sqm Built-up Area", "39 sqm Roof"] },
    ],
  },
  "Riverside Residences": {
    id: "riverside-residences",
    name: "Riverside Residences",
    unitRows: [
      {
        units: [
          { label: "A", tone: "available", wide: true },
          { label: "B", tone: "available", wide: true },
          { label: "C", tone: "sold", wide: true },
        ],
      },
      {
        units: [
          { label: "D", tone: "reserved", wide: true },
          { label: "E", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "F", tone: "available" },
          { label: "G", tone: "available" },
          { label: "H", tone: "sold" },
          { label: "I", tone: "reserved" },
        ],
      },
    ],
    floorLabels: ["Penthouse", "3rd Floor", "2nd Floor", "1st Floor"],
    models: [
      { name: "River View", size: "95 sqm", note: "View" },
      { name: "Garden View", size: "110 sqm", note: "View" },
      { name: "City View", size: "85 sqm", note: "View" },
    ],
    annexInfo: [
      { name: "Annex East", size: "180 sqm", details: ["140 sqm Living Area", "40 sqm Terrace"] },
      { name: "Annex West", size: "175 sqm", details: ["135 sqm Living Area", "40 sqm Terrace"] },
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
          { label: "201", tone: "sold", wide: true },
          { label: "202", tone: "available", wide: true },
          { label: "203", tone: "available", wide: true },
          { label: "204", tone: "reserved", wide: true },
        ],
      },
      {
        units: [
          { label: "301", tone: "available", wide: true },
          { label: "302", tone: "sold", wide: true },
        ],
      },
      {
        units: [
          { label: "401", tone: "available", wide: true },
          { label: "402", tone: "reserved", wide: true },
          { label: "403", tone: "available", wide: true },
        ],
      },
    ],
    floorLabels: ["Roof Terrace", "4th Floor", "3rd Floor", "2nd Floor", "Ground Floor"],
    models: [
      { name: "Studio", size: "45 sqm", note: "Tech" },
      { name: "1-Bedroom", size: "65 sqm", note: "Tech" },
      { name: "2-Bedroom", size: "90 sqm", note: "Tech" },
      { name: "3-Bedroom", size: "120 sqm", note: "Tech" },
    ],
    annexInfo: [
      { name: "Tech Annex", size: "250 sqm", details: ["200 sqm Workspace", "50 sqm Common Area"] },
    ],
  },
  "Metro Shopping Center": {
    id: "metro-shopping-center",
    name: "Metro Shopping Center",
    unitRows: [
      {
        units: [
          { label: "S1", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "M1", tone: "available", wide: true },
          { label: "M2", tone: "sold", wide: true },
        ],
      },
      {
        units: [
          { label: "L1", tone: "reserved", wide: true },
          { label: "L2", tone: "available", wide: true },
        ],
      },
      {
        units: [
          { label: "K1", tone: "available", wide: true },
          { label: "K2", tone: "sold", wide: true },
          { label: "K3", tone: "available", wide: true },
        ],
      },
    ],
    floorLabels: ["Food Court", "Upper Level", "Main Level", "Lower Level"],
    models: [
      { name: "Small Shop", size: "50 sqm", note: "Retail" },
      { name: "Medium Shop", size: "100 sqm", note: "Retail" },
      { name: "Large Shop", size: "200 sqm", note: "Retail" },
    ],
    annexInfo: [
      { name: "Storage Annex", size: "300 sqm", details: ["250 sqm Storage", "50 sqm Office"] },
    ],
  },
};

const projects = Object.keys(floorPlans);

export default function RealEstateProject() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [selectedProject, setSelectedProject] = useState<string>("Downtown Plaza");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<"apartment" | "annex" | null>(null);
  const isArabic = lang === "ar";
  const exportRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const currentFloorPlan = floorPlans[selectedProject];

  const floorLabelsLocalized = isArabic
    ? currentFloorPlan.floorLabels.map(label => `الدور ${label}`)
    : currentFloorPlan.floorLabels;

  const floorsPanel = (
    <div
      className="flex h-full min-h-[260px] flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#1a221f]/30 px-4 py-6 text-center text-sm uppercase tracking-[0.2em] text-emerald-100 "
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
              <UnitPill key={`${unit.label}-${idx}`} unit={unit} unitCount={unitCount} />
            ))}
          </div>
        );
      })}
    </div>
  );

  const handleAdd = () => {
    setShowAddPopup(true);
    setSelectedUnitType(null);
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
          body * {
            visibility: hidden !important;
          }
          .print-export,
          .print-export * {
            visibility: visible !important;
          }
          .print-export {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
          .print-export .print-floor-layout {
            display: grid !important;
            grid-template-columns: 1fr 220px !important;
            align-items: center !important;
            gap: 24px !important;
          }
          .print-export .print-models,
          .print-export .print-models *,
          .print-export .print-annex,
          .print-export .print-annex * {
            color: #1f2937 !important;
            text-shadow: none !important;
          }
          .print-export .print-white-overlay {
            background-color: rgba(255, 255, 255, 0.35) !important;
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
                      checked={selectedUnitType === 'apartment'}
                      onChange={() => setSelectedUnitType('apartment')}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 peer-checked:border-blue-500 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">Apartment</span>
                </label>

                {/* Annex Option */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="unitType"
                      value="annex"
                      checked={selectedUnitType === 'annex'}
                      onChange={() => setSelectedUnitType('annex')}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 peer-checked:border-blue-500 peer-checked:border-[6px] transition-all"></div>
                  </div>
                  <span className="text-lg text-gray-900 dark:text-white">Annex</span>
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
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/bg.jpg"
                  alt="Building background"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="print-white-overlay absolute inset-0 bg-black/15" />

              <div className="relative flex min-h-[720px] flex-col px-8 py-10 lg:px-16">
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
                  <h1 className={`${display.className} text-3xl font-bold text-emerald-100 mb-2`}>
                    {currentFloorPlan.name}
                  </h1>
                </header>

                <div
                  className={`print-floor-layout mt-10 grid flex-1 items-center gap-6 ${
                    "md:grid-cols-[1fr_220px]"
                  }`}
                >
                  {unitsPanel}
                  {floorsPanel}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/80">
                  <LegendPill colorClass="bg-emerald-600" label="Available" />
                  <LegendPill colorClass="bg-yellow-500" label="Reserved" />
                  <LegendPill colorClass="bg-red-600" label="Sold" />
                </div>

                <div className="print-models mt-8 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm uppercase tracking-[0.16em] text-white/60 sm:grid-cols-5">
                    {currentFloorPlan.models.map((model) => (
                      <div key={model.name} className="space-y-2">
                        <div className="text-base text-emerald-100">
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
                        <div className="text-base text-emerald-100">{annex.name}</div>
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

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
                  <div className="flex items-center gap-2">
                    <span className="h-9 w-9 rounded-full bg-gradient-to-br from-[#feda75] via-[#fa7e1e] to-[#d62976]" />
                    wsl.realestate
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.35em] text-white/40">
                    2026
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
      ? "bg-emerald-700"
      : unit.tone === "reserved"
        ? "bg-yellow-500 text-black"
        : "bg-red-700";

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