import Link from "next/link";
import ProjectCard from "./projectCard";

interface Project {
  id: string;
  image: string;
  title: string;
  location: string;
  status: 'Active' | 'Inactive';
}

interface RecentProjectsProps {
  projects: Project[];
  onProjectMoved: (projectId: string) => void;
}

export default function RecentProjects({ projects, onProjectMoved }: RecentProjectsProps) {
  return (
    <div className="px-[79px] py-8">
      <h2 className="font-inter font-semibold text-xl leading-7 tracking-[-0.5px] mb-6 dark:text-[#F9FAFB]" >
        Recent Projects
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[28px]">
        {projects.map((project) => (
          <Link href="/dashboard" key={project.id} >
          
          <ProjectCard
            key={project.id}
            id={project.id}
            image={project.image}
            title={project.title}
            location={project.location}
            status={project.status}
            onProjectMoved={onProjectMoved}
          />
          
          </Link>
          
        ))}
      </div>
    </div>
  );
}