export interface Tag {
  id: string
  title: string
}

// Список тегов прогресса с приоритетами
export const PROGRESS_TAGS: Tag[] = [
  { id: "200867", title: "0%" },
  { id: "201071", title: "5%" },
  { id: "200870", title: "10%" },
  { id: "201074", title: "15%" },
  { id: "200879", title: "20%" },
  { id: "201080", title: "25%" },
  { id: "200882", title: "30%" },
  { id: "201083", title: "35%" },
  { id: "200885", title: "40%" },
  { id: "201086", title: "45%" },
  { id: "200888", title: "50%" },
  { id: "201089", title: "55%" },
  { id: "200891", title: "60%" },
  { id: "201092", title: "65%" },
  { id: "200894", title: "70%" },
  { id: "201095", title: "75%" },
  { id: "200897", title: "80%" },
  { id: "201098", title: "85%" },
  { id: "200876", title: "90%" },
  { id: "201101", title: "95%" },
  { id: "200873", title: "100%" },
]

// Словарь ID тегов для быстрого поиска
export const PROGRESS_TAG_IDS: Record<string, string> = 
  Object.fromEntries(PROGRESS_TAGS.map(tag => [tag.id, tag.title])) 