import ImageSlot from '../components/ImageSlot'
import { projects } from '../data/projects'

export default function ProjectDetail({ projectId }: { projectId?: string }) {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return <p>Project not found.</p>

  return (
    <div className="project-detail">
      {project.screenshot && (
        <ImageSlot
          src={project.screenshot}
          alt={project.name}
          width={448}
          height={252}
        />
      )}
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {project.tech.map((tech) => (
          <span key={tech} className="project-tag">
            {tech}
          </span>
        ))}
      </div>
      {project.links && project.links.length > 0 && (
        <div className="project-links">
          {project.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
              <button>{link.label}</button>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
