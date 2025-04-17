import { Section } from '@/lib/types/sections'

export interface ProjectBase {
  ws_project_id: number
  name?: string
  user_to?: Record<string, any>
  status?: 'active' | 'not active'
}

export interface ProjectWithoutSections extends ProjectBase {
  id: string
}

export interface Project extends ProjectBase {
  id: string
  sections: Section[]
} 