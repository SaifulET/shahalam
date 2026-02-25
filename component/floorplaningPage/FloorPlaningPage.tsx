"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Playfair_Display, Poppins } from "next/font/google";
import { Download, ImageDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import domtoimage from "dom-to-image-more";
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

const ARABIC_DIGITS = [
  "\u0660",
  "\u0661",
  "\u0662",
  "\u0663",
  "\u0664",
  "\u0665",
  "\u0666",
  "\u0667",
  "\u0668",
  "\u0669",
];

function fallbackArabicText(value: string) {
  return value
    .replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)])
    .replace(/,/g, "\u060C")
    .replace(/;/g, "\u061B")
    .replace(/\?/g, "\u061F");
}

export default function RealEstateProject() {
  const t = useTranslations("floorPlanning");
  const locale = useLocale();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [translatedDynamicText, setTranslatedDynamicText] = useState<
    Record<string, string>
  >({});
  const [selectedUnitType, setSelectedUnitType] = useState<
    "apartment" | "annex" | null
  >(null);
  const isArabic = locale === "ar";
  const exportRef = useRef<HTMLDivElement | null>(null);
  const exportContentRef = useRef<HTMLDivElement | null>(null);
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

  const textsToTranslate = useMemo(() => {
    const values: string[] = [
      ...projects.map((project) => project.name),
      ...floors.map((floor: FloorData) => floor.name),
      ...floors.flatMap((floor: FloorData) =>
        floor.units.map((unit) => unit.name)
      ),
      ...models.map((model: ModelData) => model.name),
      ...models.map((model: ModelData) => String(model.area ?? "")),
      ...models.map((model: ModelData) => model.face).filter(Boolean),
    ];

    return Array.from(
      new Set(values.map((value) => value?.trim()).filter(Boolean))
    ) as string[];
  }, [projects, floors, models]);

  const localizeDynamicText = (value?: string | null) => {
    if (!value) return "";
    const normalizedValue = value.trim();
    const translatedValue = translatedDynamicText[normalizedValue];
    if (translatedValue) return translatedValue;
    return locale === "ar"
      ? fallbackArabicText(normalizedValue)
      : normalizedValue;
  };

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

  useEffect(() => {
    let active = true;

    if (textsToTranslate.length === 0) {
      setTranslatedDynamicText({});
      return;
    }

    const fetchDynamicTranslations = async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            target: locale,
            source: "auto",
            texts: textsToTranslate,
          }),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dynamic translations");
        }

        const data = (await response.json()) as {
          translations?: Record<string, string>;
        };

        if (active) {
          setTranslatedDynamicText(data.translations ?? {});
        }
      } catch {
        if (active) {
          setTranslatedDynamicText({});
        }
      }
    };

    fetchDynamicTranslations();

    return () => {
      active = false;
    };
  }, [locale, textsToTranslate]);

  // Transform floors data to match the unitRows structure
  const unitRows = floors.map((floor: FloorData) => ({
    units: floor.units.map((unit) => ({
      label: localizeDynamicText(unit.name),
      tone: unit.status,
      wide: false, // You might want to add a `wide` field to your unit schema if needed
    })),
  }));

  // Transform floor names for the floor labels panel
 // Transform floor names for the floor labels panel - REVERSE THE ORDER to match the visual layout
const floorLabelsLocalized = floors.map((floor: FloorData) =>
  localizeDynamicText(floor.name)
);

const floorsPanel = (
  <div
    className="flex h-full  flex-col items-center justify-between rounded-3xl border border-white/10 bg-[#1a221f]/30 px-4 py-6 text-center text-sm uppercase tracking-[0.2em] text-[#F2DFA7] sf-pro"
    dir={isArabic ? "rtl" : "ltr"}
  >
    {/* Map in reverse order so first floor (1st) appears at bottom */}
    {floorLabelsLocalized.slice().reverse().map((label, index) => (
      <span key={`floor-label-${index}`} className="leading-6">
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

  const handleExportImage = async () => {
    const exportNode = exportContentRef.current;
    if (!exportNode || isExportingImage) return;

    try {
      setIsExportingImage(true);

      const imageDataUrl = await domtoimage.toPng(exportNode, {
        cacheBust: true,
        width: exportNode.scrollWidth,
        height: exportNode.scrollHeight,
        copyDefaultStyles: false,
        style: {
          border: "0",
          outline: "0",
        },
      });

      const link = document.createElement("a");
      const baseName =
        currentProjectName
          ?.trim()
          .replace(/[^\w-]+/g, "_")
          .replace(/^_+|_+$/g, "") || "project-preview";

      link.href = imageDataUrl;
      link.download = `${baseName}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to export image", error);
    } finally {
      setIsExportingImage(false);
    }
  };

  const currentProjectName =
    localizeDynamicText(
      projects.find((p) => p._id === selectedProjectId)?.name
    ) || t("selectProject");

  return (
    <main
      className={`${body.className} min-h-screen bg-white dark:bg-[#0b1110] text-white`}
      lang={locale}
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
                {t("unitType")}
              </h1>

              {/* Radio Options */}
              <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
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
                    {t("apartment")}
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
                    {t("annex")}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {/* Cancel Button */}
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-white bg-white dark:bg-black text-gray-900 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  {t("cancel")}
                </button>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!selectedUnitType}
                  className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("continue")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid min-h-screen grid-rows-[auto_1fr]">
        <div className="grid grid-cols-1 gap-4 p-3 sm:p-4 lg:grid-cols-[240px_1fr] lg:p-6" dir="ltr">
          <aside className="rounded-2xl border border-white/10 bg-[#E5E7EB] px-4 py-4 dark:bg-[#0f1513] lg:border-r lg:py-6">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#111827] dark:text-white/40">
              {t("projectName")}
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
                  {localizeDynamicText(project.name)}
                </button>
              ))}
            </nav>
          </aside>

          <section className="flex min-w-0 flex-col items-center justify-start px-1 sm:px-2 lg:px-4">
            <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-2 sm:mb-6 sm:justify-end">
              <button
                onClick={handleExportImage}
                disabled={isExportingImage}
                className="flex rounded-xl bg-[#16A34A] px-3 py-2 font-semibold text-[#FFFFFF] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <ImageDown className="h-5 w-5 pr-1" />
                {isExportingImage ? t("exportingImage") : t("exportImage")}
              </button>
              <button
                onClick={handleEdit}
                className="rounded-xl border border-[#D1D5DB] dark:border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10 text-[#374151] text-md dark:text-[#D3D7DE]"
              >
                {t("edit")}
              </button>
              <button
                onClick={handleAdd}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0088FF] text-lg font-semibold text-[#FFFFFF]"
              >
                +
              </button>
              <button
                onClick={handleExportPdf}
                className="flex rounded-xl bg-[#0088FF] px-3 py-2 font-semibold text-[#FFFFFF]"
              >
                <Download className="w-6 h-6 pr-1" /> {t("exportPdf")}
              </button>
            </div>
            <div
              className="relative w-full overflow-x-auto overflow-y-hidden rounded-md border border-white/10"
              dir="ltr"
              ref={exportRef}
              data-export="true"
              data-lang={locale}
            >
              <div
                className="relative min-w-[680px] sm:min-w-[760px] lg:min-w-0"
                ref={exportContentRef}
              >
              <div className="print-bg absolute inset-0 opacity-40">
                <Image
                  src="/bg.jpg"
                  alt={t("buildingBackgroundAlt")}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="print-white-overlay absolute inset-0 bg-black/15" />

              <div className="print-scale relative flex min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-16 lg:py-10">
                <header className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-[24px] sm:mb-4 sm:h-32 sm:w-32 lg:h-40 lg:w-40 lg:rounded-[32px]">
                    <Image
                      src="/logo.svg"
                      alt={t("logoAlt")}
                      width={160}
                      height={160}
                      className="h-full w-full"
                    />
                  </div>
                  <h1 className="text-lg font-bold text-white/90 sm:text-xl lg:text-2xl">
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
                  <LegendPill colorClass="bg-[#006400]" label={t("status.available")} />
                  <LegendPill colorClass="bg-[#D5B60A]" label={t("status.reserved")} />
                  <LegendPill colorClass="bg-[#6F0000]" label={t("status.sold")} />
                </div>

                <div className="print-models mt-8 border-t border-white/10 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-center text-sm uppercase tracking-[0.16em] text-white/60 sm:grid-cols-5">
                    {models.map((model: ModelData) => (
                      <div key={model._id} className="space-y-2">
                        <div className="print-pill inline-flex px-3 py-1 text-base bg-amber-100/70 rounded-full text-[#1B1B1F] sf-pro">
                          {localizeDynamicText(model.name)}
                        </div>
                        <div className="text-white/70">
                          {localizeDynamicText(String(model.area ?? ""))}
                        </div>
                        <div className="text-white/40">
                          {localizeDynamicText(model.face)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

               

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-white sf-pro sm:mt-12 lg:mt-[70px]">
                  <div className="flex items-center gap-2 text-center text-lg font-bold leading-none tracking-normal sm:text-2xl lg:text-[32px]">
                    <div>
                      <Image
                        src="/instagram.svg"
                        alt=""
                        width={60}
                        height={60}
                      />
                    </div>
                    <div>
                      <Image
                        src="/alart.svg"
                        alt=""
                        width={60}
                        height={60}
                      />
                    </div>
                    wsl.realestate
                  </div>
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
