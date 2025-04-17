'use client'

import { useSupabaseQuery } from '@/hooks/useSupabase'

interface DataItem {
  id: number
  name: string
  created_at: string
  [key: string]: any
}

export default function SupabaseDataTable() {
  const { data, loading, error, refetch } = useSupabaseQuery<DataItem>(
    'projects',
    (query) => query.order('created_at', { ascending: false }).limit(20)
  )

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Данные из Supabase</h2>
        <p>Загрузка данных...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Данные из Supabase</h2>
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Ошибка: {error.message}
        </div>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Попробовать снова
        </button>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Данные из Supabase</h2>
        <p>Нет данных для отображения</p>
      </div>
    )
  }

  // Получаем заголовки таблицы из первого объекта данных
  const headers = Object.keys(data[0]).filter(key => 
    // Можно исключить некоторые поля из отображения
    !['updated_at'].includes(key)
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Данные из Supabase</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {headers.map(header => (
                <th key={header} className="py-2 px-4 border-b text-left font-semibold">
                  {header.replace('_', ' ').toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                {headers.map(header => (
                  <td key={`${item.id}-${header}`} className="py-2 px-4 border-b">
                    {typeof item[header] === 'object' 
                      ? JSON.stringify(item[header]) 
                      : String(item[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <button 
        onClick={() => refetch()} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Обновить данные
      </button>
    </div>
  )
} 