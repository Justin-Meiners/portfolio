import type { ComponentType } from 'react'
import Welcome from './Welcome'
import AboutMe from './AboutMe'
import MyComputer from './MyComputer'
import RecycleBin from './RecycleBin'
import ProjectsFolder from './ProjectsFolder'
import ProjectDetail from './ProjectDetail'
import SpotifyMetrics from './SpotifyMetrics'

export interface AppParams {
  projectId?: string
}

export const APP_REGISTRY = {
  welcome: Welcome,
  about: AboutMe,
  'my-computer': MyComputer,
  'recycle-bin': RecycleBin,
  projects: ProjectsFolder,
  'project-detail': ProjectDetail,
  spotify: SpotifyMetrics,
} satisfies Record<string, ComponentType<AppParams>>

export type AppId = keyof typeof APP_REGISTRY
