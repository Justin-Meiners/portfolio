import type { ComponentType } from 'react'
import Welcome from './Welcome'
import AboutMe from './AboutMe'
import MyComputer from './MyComputer'
import RecycleBin from './RecycleBin'

export const APP_REGISTRY = {
  welcome: Welcome,
  about: AboutMe,
  'my-computer': MyComputer,
  'recycle-bin': RecycleBin,
} satisfies Record<string, ComponentType>

export type AppId = keyof typeof APP_REGISTRY
