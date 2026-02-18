"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore } from "@/store/projectStore";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "700"],
});
const body = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

type UnitTone = "available" | "reserved" | "sold";

interface UnitPillProps {
  unit: {
    label: string;
    tone: UnitTone;
    wide?: boolean;
  };
  unitCount: number;
}

interface FloorData {
  _id: string;
  name: string;
  units: Array<{
    _id: string;
    name: string;
    status: UnitTone;
  }>;
}

interface ModelData {
  _id: string;
  name: string;
  area: string;
  face: string;
}

export default function RealEstateProject() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState<
    "apartment" | "annex" | null
  >(null);
  const isArabic = lang === "ar";
  const exportRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const user = useAuthStore().user;
  const {
    projects,
    floors,
    models,
    selectedProjectId,
    fetchProjects,
    fetchFloors,
    fetchModels,
    setSelectedProject,
  } = useProjectStore();

  // Fetch projects
  useEffect(() => {
    if (user?.id) {
      fetchProjects(user.id);
    }
  }, [user]);

  // Auto select first project
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProject(projects[0]._id);
    }
  }, [projects]);

  // Fetch floors & models when project changes
  useEffect(() => {
    if (selectedProjectId) {
      fetchFloors(selectedProjectId);
      fetchModels(selectedProjectId);
    }
  }, [selectedProjectId]);

  // Transform floors data to match the unitRows structure
  const unitRows = floors.map((floor: FloorData) => ({
    units: floor.units.map((unit) => ({
      label: unit.name,
      tone: unit.status,
      wide: false, // You might want to add a `wide` field to your unit schema if needed
    })),
  }));

  // Transform floor names for the floor labels panel
 // Transform floor names for the floor labels panel - REVERSE THE ORDER to match the visual layout
const floorLabels = [...floors.map((floor: FloorData) => floor.name)];

const floorLabelsLocalized = isArabic
  ? floorLabels.map((label) => `الدور ${label}`)
  : floorLabels;

const floorsPanel = (
  <div
    className="flex h-full min-h-[260px] flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#1a221f]/30 px-4 py-6 text-center text-sm uppercase tracking-[0.2em] text-[#F2DFA7] sf-pro"
    dir={isArabic ? "rtl" : "ltr"}
  >
    {/* Map in reverse order so first floor (1st) appears at bottom */}
    {floorLabelsLocalized.slice().reverse().map((label) => (
      <span key={label} className="leading-6">
        {label}
      </span>
    ))}
  </div>
);

const unitsPanel = (
  <div className="space-y-5">
    {unitRows.map((row, index) => {
      const unitCount = row.units.length;
      let gridCols = "grid-cols-4";

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
    router.push("/addunit");
  };

  const handleEdit = () => {
    const selectedProject = projects.find(p => p._id === selectedProjectId);
    if (selectedProject) {
      router.push(`/dashboard/${selectedProjectId}`);
    }
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

  const currentProjectName = projects.find(p => p._id === selectedProjectId)?.name || "Select a project";

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
                  key={project._id}
                  onClick={() => setSelectedProject(project._id)}
                  className={[
                    "w-full rounded-xl px-3 py-2 text-left text-[#1F2937] dark:text-white/70 transition",
                    project._id === selectedProjectId
                      ? "darK:bg-emerald-500/20 bg-[#0088FF33] text-[#1F2937] dark:text-white ring-1 ring-emerald-500/40"
                      : "dark:hover:bg-white/10 hover:bg-[#1F2937] hover:text-white dark:hover:text-white",
                  ].join(" ")}
                >
                  {project.name}
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
                  <h1 className="text-2xl font-bold text-white/90">
                    {currentProjectName}
                  </h1>
                </header>

                <div
                  className={`print-floor-layout mt-10 grid flex-1 items-stretch gap-6 ${"md:grid-cols-[1fr_220px]"}`}
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
                    {models.map((model: ModelData) => (
                      <div key={model._id} className="space-y-2">
                        <div className="print-pill inline-flex px-3 py-1 text-base bg-amber-100/70 rounded-full text-[#1B1B1F] sf-pro">
                          {model.name}
                        </div>
                        <div className="text-white/70">{model.area}</div>
                        <div className="text-white/40">{model.face}</div>
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

function UnitPill({ unit, unitCount = 4 }: { unit: UnitPillProps['unit']; unitCount?: number }) {
  const toneClass =
    unit.tone === "available"
      ? "bg-[#014d01]"
      : unit.tone === "reserved"
        ? "bg-[#D5B60A] text-black"
        : "bg-[#6F0000]";

  let colSpan = "col-span-1";
  if (unitCount === 4 && unit.wide) {
    colSpan = "col-span-2";
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