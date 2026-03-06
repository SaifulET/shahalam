'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import RecentProjects from "./recentProjectPage";
import FoldersComponent from '../forderSection';
import { AxiosError } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import api from '@/lib/api';

interface ApiProject {
  _id: string;
  userId: string;
  name: string;
  image:string;
  location: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface RecentApiResponseItem {
  _id: string;
  projectId: ApiProject;
  userId: string;
  viewedAt: string;
  __v: number;
}

interface RecentApiResponse {
  success: boolean;
  count: number;
  data: RecentApiResponseItem[];
}

interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  recentid: string;
  status: 'Active' | 'Inactive';
}

const ARABIC_DIGITS = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];

function fallbackArabicText(value: string) {
  return value
    .replace(/\d/g, (digit) => ARABIC_DIGITS[Number(digit)])
    .replace(/,/g, '\u060C')
    .replace(/;/g, '\u061B')
    .replace(/\?/g, '\u061F');
}

export default function RecentProjectsComponent() {
  const t = useTranslations('home.recentProjects');
  const locale = useLocale();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedDynamicText, setTranslatedDynamicText] = useState<Record<string, string>>({});

  const user = useAuthStore((state) => state.user);
  const clearFolderId = useProjectStore((state) => state.clearFolderId);

  useEffect(() => {
    clearFolderId();
  }, [clearFolderId]);

  const textsToTranslate = useMemo(() => {
    const values: string[] = [
      ...projects.map((project) => project.title),
      ...projects.map((project) => project.location),
    ];

    return Array.from(
      new Set(values.map((value) => value?.trim()).filter(Boolean))
    ) as string[];
  }, [projects]);

  const localizeDynamicText = (value?: string | null) => {
    if (!value) return '';
    const normalizedValue = value.trim();
    const translatedValue = translatedDynamicText[normalizedValue];
    if (translatedValue) return translatedValue;

    return locale === 'ar'
      ? fallbackArabicText(normalizedValue)
      : normalizedValue;
  };

  const localizedProjects = projects.map((project) => ({
    ...project,
    title: localizeDynamicText(project.title),
    location: localizeDynamicText(project.location),
  }));

  useEffect(() => {
    const fetchRecents = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<RecentApiResponse>(
          `/recents/user/${user.id}`
        );

        const mappedProjects: Project[] = response.data.data.map((item) => ({
          id: item.projectId._id,
          image:item.projectId?.image || '/rc1.png', // static image for now
          title: item.projectId.name,
          location: item.projectId.location,
          status: 'Active',
          recentid: item._id,
        }));

        setProjects(mappedProjects);
      } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecents();
    
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    if (textsToTranslate.length === 0) {
      setTranslatedDynamicText({});
      return;
    }

    const fetchDynamicTranslations = async () => {
      try {
        const response = await fetch('/internal-translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target: locale,
            source: 'auto',
            texts: textsToTranslate,
          }),
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recent project translations');
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

  const handleProjectDropped = (folderName: string, projectId?: string) => {
    if (projectId) {
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    }
  };

  const removeProjectFromList = (projectId: string) => {
    setProjects((prev) => prev.filter((project) => project.id !== projectId));
  };

  return (
    <main dir="ltr" className="min-h-screen bg-white dark:bg-black">
      <FoldersComponent 
        onProjectDropped={(folderName ) => handleProjectDropped(folderName)} 
       
      />

      {loading && <p className="px-6 text-gray-500">{t('loading')}</p>}
      {error && <p className="px-6 text-red-500">{error}</p>}

      <RecentProjects 
        projects={localizedProjects} 
        onProjectMoved={removeProjectFromList}
      />
    </main>
  );
}
