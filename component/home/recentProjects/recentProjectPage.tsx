import Link from "next/link";
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
  return (
    <div className="px-[79px] py-8">
      <h2 className="font-inter font-semibold text-xl leading-7 tracking-[-0.5px] mb-6 dark:text-[#F9FAFB] text-[#1F2937]" >
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
            recentid={project.recentid}
            onProjectMoved={onProjectMoved}
          />
          
          </Link>
          
        ))}
        {
          projects.length === 0 && (
            <p className="text-gray-500">No recent projects found.</p>
          )
        }
      </div>
    </div>
  );
}