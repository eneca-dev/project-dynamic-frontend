'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function SupabaseExample() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Пример запроса к Supabase
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .limit(10)
        
        if (error) {
          throw error
        }
        
        setData(data || [])
      } catch (err: any) {
        setError(err.message || 'Произошла ошибка при загрузке данных')
        console.error('Ошибка при загрузке данных из Supabase:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Пример интеграции с Supabase</h2>
      
      {loading && <p>Загрузка данных...</p>}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          <p className="mb-2">Загружено записей: {data.length}</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  )
} 