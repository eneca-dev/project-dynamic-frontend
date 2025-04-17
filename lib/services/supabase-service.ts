import { supabase } from '@/lib/supabase'

// Интерфейс для примера записи в таблице
interface Record {
  id: string
  ws_section_id: number
  ws_project_id: number
  name: string
  date_added: string
  date_start: string
  date_end: string
  date_closed: string
  tags: string[]
  created_at: string
  // Добавьте другие поля в соответствии с вашей таблицей
}

/**
 * Сервис для работы с Supabase
 */
export const SupabaseService = {
  /**
   * Получить список записей из таблицы
   */
  async getRecords(): Promise<Record[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Ошибка при получении записей:', error)
      throw error
    }
    
    return data || []
  },
  
  /**
   * Получить запись по ID
   */
  async getRecordById(id: number): Promise<Record | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error(`Ошибка при получении записи с ID ${id}:`, error)
      throw error
    }
    
    return data
  },
  
  /**
   * Создать новую запись
   */
  async createRecord(record: Omit<Record, 'id' | 'created_at'>): Promise<Record> {
    const { data, error } = await supabase
      .from('projects')
      .insert(record)
      .select()
      .single()
    
    if (error) {
      console.error('Ошибка при создании записи:', error)
      throw error
    }
    
    return data
  },
  
  /**
   * Обновить существующую запись
   */
  async updateRecord(id: number, updates: Partial<Record>): Promise<Record> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error(`Ошибка при обновлении записи с ID ${id}:`, error)
      throw error
    }
    
    return data
  },
  
  /**
   * Удалить запись
   */
  async deleteRecord(id: number): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error(`Ошибка при удалении записи с ID ${id}:`, error)
      throw error
    }
  }
} 