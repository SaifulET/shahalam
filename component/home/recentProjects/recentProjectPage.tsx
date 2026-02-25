 'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";
import ProjectCard from "./projectCard";

interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  recentid: string;
  status: 'Active' | 'Inactive';
}

interface RecentProjectsProps {
  projects: Project[];
  onProjectMoved: (projectId: string) => void;
}

export default function RecentProjects({ projects, onProjectMoved }: RecentProjectsProps) {
  const t = useTranslations('home.recentProjects');
  return (
    <div dir="ltr" className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <h2 className="font-inter font-semibold text-xl leading-7 tracking-[-0.5px] mb-6 dark:text-[#F9FAFB] text-[#1F2937]" >
        {t('title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-7">
        {projects.map((project) => (
          <Link href="/dashboard" key={project.id} >
          
          <ProjectCard
            key={project.id}
            id={project.id}
            image={project.image}
            title={project.title}
            location={project.location}
            status={project.status}
            recentid={project.recentid}
            onProjectMoved={onProjectMoved}
          />
          
          </Link>
          
        ))}
        {
          projects.length === 0 && (
            <p className="text-gray-500">{t('empty')}</p>
          )
        }
      </div>
    </div>
  );
}
