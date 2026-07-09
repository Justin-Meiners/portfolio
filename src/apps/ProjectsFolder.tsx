import { useState } from 'react'
import { useWindowManager } from '../context/WindowManager'
import DesktopIcon from '../components/DesktopIcon'
import { projects } from '../data/projects'

export default function ProjectsFolder() {
  const { openWindow } = useWindowManager()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="explorer">
      <div
        className="sunken-panel folder-icons"
        onClick={() => setSelected(null)}
      >
        {projects.map((project) => (
          <DesktopIcon
            key={project.id}
            label={project.name}
            icon={project.icon}
            selected={selected === project.id}
            onSelect={() => setSelected(project.id)}
            onOpen={() =>
              openWindow({
                id: `project-${project.id}`,
                title: project.name,
                icon: project.icon,
                appId: 'project-detail',
                params: { projectId: project.id },
                position: { x: 200, y: 140 },
                width: 480,
              })
            }
          />
        ))}
      </div>
      <div className="status-bar">
        <p className="status-bar-field">{projects.length} object(s)</p>
      </div>
    </div>
  )
}
