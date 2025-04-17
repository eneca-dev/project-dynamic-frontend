export interface Section {
  ws_section_id: number
  name?: string
  ws_project_id: number
  created_at: string
  tags?: Record<string, any>
}

export interface SectionWithTag {
  ws_section_id: number
  name?: string
  ws_project_id: number
  created_at: string
  tag?: string
}

export interface ProjectSectionsResponse {
  ws_project_id: number
  project_name?: string
  sections: SectionWithTag[]
} 