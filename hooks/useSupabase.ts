import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostgrestFilterBuilder } from '@supabase/postgrest-js'

type SupabaseQueryResult<T> = {
  data: T[] | null
  error: Error | null
  loading: boolean
  refetch: () => Promise<void>
}

/**
 * Хук для работы с Supabase
 * @param table Название таблицы
 * @param query Функция для построения запроса (фильтры, сортировка и т.д.)
 * @param dependencies Массив зависимостей для перезапроса
 */
export function useSupabaseQuery<T extends Record<string, unknown>>(
  table: string,
  query?: (q: PostgrestFilterBuilder<any, any, any>) => PostgrestFilterBuilder<any, T, any>,
  dependencies: any[] = []
): SupabaseQueryResult<T> {
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      let queryBuilder = supabase.from(table).select('*')
      
      if (query) {
        queryBuilder = query(queryBuilder)
      }
      
      const { data: result, error: queryError } = await queryBuilder
      
      if (queryError) {
        throw queryError
      }
      
      setData(result)
      setError(null)
    } catch (err: any) {
      console.error(`Ошибка запроса к таблице ${table}:`, err)
      setError(err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [...dependencies])

  return { data, error, loading, refetch: fetchData }
} 