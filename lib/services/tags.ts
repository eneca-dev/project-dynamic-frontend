import { Tag, PROGRESS_TAG_IDS } from '@/lib/types'

/**
 * Извлекает тег прогресса из JSON данных тегов секции
 * Если есть несколько подходящих тегов, выбирает с наивысшим приоритетом
 */
export function extractProgressTag(tags_json?: Record<string, any>): Tag | null {
  if (!tags_json) {
    return null
  }

  // Находим все теги прогресса в JSON
  const foundTags: Tag[] = []
  for (const [tagId, tagTitle] of Object.entries(tags_json)) {
    if (tagId in PROGRESS_TAG_IDS) {
      foundTags.push({ id: tagId, title: tagTitle as string })
    }
  }

  if (foundTags.length === 0) {
    return null
  }

  // Сортируем найденные теги по приоритету (процентному значению)
  // и берем тег с наивысшим значением
  const highestPriorityTag = [...foundTags].sort((a, b) => {
    return b.title.localeCompare(a.title)
  })[0]

  return highestPriorityTag
} 