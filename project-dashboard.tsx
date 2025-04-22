"use client"

import { useState, useEffect, FC } from "react"
import { Check, ChevronDown, ChevronUp, Calendar, BarChart, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useProjects, useProjectSections, filterProjectsByManager, calculateProjectProgress } from "@/hooks/useApi"
import { Project, Section as ApiSection } from "@/lib/api"

// Predefined color palette for chart sections
const colorPalette = [
  "#40916C", // Green
  "#406987", // Blue
  "#D29F5D", // Orange
  "#D27C5D", // Coral
  "#3F6D58", // Dark Green
  "#3D5565", // Dark Blue
  "#9D815B", // Brown
  "#9D6D5B", // Rust
  "#155E3D", // Forest Green
  "#153C57", // Navy
  "#885A1E", // Amber
  "#883B1E", // Brick
  "#74C8A2", // Mint
  "#76A3C3", // Sky Blue
  "#E8BE87", // Sand
  "#E8A187", // Peach
  "#791B39", // Burgundy
  "#5D3A9B", // Purple
  "#2D93AD", // Teal
  "#AD2D2D", // Red
]

// Special color for average line
const averageLineColor = "#791B39" // Burgundy

interface Section {
  name: string
  color: string
  progress: string[]
}

interface ProjectData {
  manager: string
  isActive: boolean
  sections: Section[]
}

interface ProjectDataMap {
  [key: string]: ProjectData
}

// Функция для форматирования даты из строки "2025-03-21T13:55:35.612254" в "21.03.2025"
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
};

const ProjectDashboard: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined)
  const [selectedManager, setSelectedManager] = useState("Все руководители")
  const [selectedChartSections, setSelectedChartSections] = useState<string[]>([])
  const [showActiveProjects, setShowActiveProjects] = useState(true)
  const [allDates, setAllDates] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Получаем данные с помощью хуков
  const { data: projects = [], isLoading: isProjectsLoading, error: projectsError } = useProjects();
  const { data: projectSections = [], isLoading: isSectionsLoading } = useProjectSections(selectedProjectId);

  // Список проектов, отфильтрованный по менеджеру и статусу
  const filteredProjects = projects
    .filter(project => showActiveProjects ? project.status === 'active' : project.status !== 'active')
    .filter(project => selectedManager === "Все руководители" ? true : project.manager === selectedManager);

  // Фильтрация проектов по поисковому запросу и сортировка по алфавиту
  const searchFilteredProjects = filteredProjects
    .filter(project => project.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Список всех менеджеров, отсортированный по алфавиту
  const managers = ["Все руководители", ...Array.from(new Set(projects.map(project => project.manager))).sort()];

  // Устанавливаем первый проект по умолчанию при загрузке данных
  useEffect(() => {
    if (filteredProjects.length > 0 && !selectedProject) {
      setSelectedProject("");
      setSelectedProjectId(undefined);
    }
  }, [filteredProjects, selectedProject]);

  // Получаем даты из секций проекта
  useEffect(() => {
    if (projectSections && projectSections.length > 0) {
      // Собираем все даты из полей created_at секций
      const dates = projectSections
        .filter(section => section.created_at)
        .map(section => formatDate(section.created_at || ""))
        .filter(date => date) // Убираем пустые строки
      
      // Удаляем дубликаты и сортируем даты
      const uniqueDates = Array.from(new Set(dates)).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      });
      
      setAllDates(uniqueDates.length > 0 ? uniqueDates : []);
    }
  }, [projectSections]);

  // Получаем текущую дату в формате "DD.MM.YYYY"
  const today = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');

  // Конвертация данных секций из API в формат для отображения
  const formatSectionsForDisplay = (apiSections: ApiSection[]): Section[] => {
    // Проверка, что apiSections является массивом
    if (!Array.isArray(apiSections)) {
      console.error('apiSections не является массивом:', apiSections);
      return [];
    }
    
    console.log('Начало formatSectionsForDisplay, получено секций:', apiSections.length);
    console.log('Доступные даты:', allDates);
    
    // Создаем карту для группировки секций по имени раздела (отображаемому имени)
    const sectionsByName = new Map<string, ApiSection[]>();
    
    // Группируем все секции по имени раздела
    apiSections.forEach(section => {
      if (!section.name) {
        return;
      }
      
      const sectionName = section.name;
      if (!sectionsByName.has(sectionName)) {
        sectionsByName.set(sectionName, []);
      }
      sectionsByName.get(sectionName)?.push(section);
    });
    
    console.log('Сгруппировано по имени раздела:', sectionsByName.size, 'групп');
    
    // Формируем итоговый список секций с историей прогресса
    const sectionsWithProgress: Section[] = [];
    
    // Обрабатываем каждую группу секций (с одинаковым именем)
    sectionsByName.forEach((sections, sectionName) => {
      if (sections.length === 0 || sectionName.includes('!') || sectionName.includes('#')) {
        return; // Пропускаем пустые группы и секции с символами "!" или "#"
      }
      
      console.log(`Обработка группы секций "${sectionName}", количество: ${sections.length}`);
      
      // Создаем карту прогресса по датам
      const progressByDate: Record<string, number> = {};
      
      // Сортируем секции по дате создания (от самой ранней)
      sections.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      });
      
      // Заполняем историю прогресса для всех дат создания секций
      sections.forEach(section => {
        if (section.created_at) {
          const dateKey = formatDate(section.created_at);
          if (dateKey) {
            const progress = section.progress !== undefined ? section.progress : 0;
            progressByDate[dateKey] = progress;
            console.log(`   Запись ${dateKey}: прогресс = ${progress}%`);
          }
        }
      });
      
      // Получаем самую раннюю дату создания для определения, когда секция стала доступна
      const earliestSection = sections[0];
      const earliestDate = earliestSection?.created_at ? formatDate(earliestSection.created_at) : '';
      
      console.log(`   Самая ранняя дата для секции "${sectionName}": ${earliestDate}`);
      
      // Сортируем ключи дат, чтобы обрабатывать их в хронологическом порядке
      const sortedDates = Object.keys(progressByDate).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('.').map(Number);
        const [dayB, monthB, yearB] = b.split('.').map(Number);
        return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
      });
      
      console.log(`   Отсортированные даты с прогрессом: ${sortedDates.join(', ')}`);
      
      // Заполняем прогресс для всех дат в allDates
      const progressArray = allDates.map(date => {
        const [dayDate, monthDate, yearDate] = date.split('.').map(Number);
        const currentDate = new Date(yearDate, monthDate - 1, dayDate).getTime();
        
        // Проверяем, есть ли для текущей даты прогресс
        if (progressByDate[date] !== undefined) {
          return `${progressByDate[date]}%`;
        }
        
        // Если нет, ищем ближайшую предыдущую дату с прогрессом
        // Для начала проверяем, что дата не раньше, чем секция была создана
        if (earliestDate) {
          const [dayEarliest, monthEarliest, yearEarliest] = earliestDate.split('.').map(Number);
          const earliestDateTime = new Date(yearEarliest, monthEarliest - 1, dayEarliest).getTime();
          
          if (currentDate < earliestDateTime) {
            console.log(`   Дата ${date} раньше создания секции, возвращаем "-"`);
            return "-"; // Дата раньше создания секции
          }
        }
        
        // Ищем последнюю предыдущую дату с известным прогрессом
        let latestPreviousDate = '';
        
        for (const dateKey of sortedDates) {
          const [dayKey, monthKey, yearKey] = dateKey.split('.').map(Number);
          const keyDate = new Date(yearKey, monthKey - 1, dayKey).getTime();
          
          if (keyDate <= currentDate) {
            latestPreviousDate = dateKey;
          } else {
            break; // Прекращаем поиск, когда нашли дату позже текущей
          }
        }
        
        // Возвращаем прогресс для ближайшей предыдущей даты или "-" если такой нет
        if (latestPreviousDate && progressByDate[latestPreviousDate] !== undefined) {
          console.log(`   Для даты ${date} используем прогресс ${progressByDate[latestPreviousDate]}% от даты ${latestPreviousDate}`);
          return `${progressByDate[latestPreviousDate]}%`;
        }
        
        return "-";
      });
      
      console.log(`   Итоговый массив прогресса для секции "${sectionName}":`, progressArray);
      
      // Добавляем секцию в итоговый список
      sectionsWithProgress.push({
        name: sectionName,
        color: colorPalette[sectionsWithProgress.length % colorPalette.length],
        progress: progressArray
      });
    });
    
    // Сортируем секции по имени
    sectionsWithProgress.sort((a, b) => a.name.localeCompare(b.name));
    
    console.log('Завершение formatSectionsForDisplay, возвращено секций:', sectionsWithProgress.length);
    
    return sectionsWithProgress;
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (isProjectsLoading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка проектов...</div>;
  }

  // Если есть ошибка, показываем сообщение об ошибке
  if (projectsError) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">Ошибка загрузки проектов</div>;
  }

  // Используем данные из API вместо статических данных
  const currentProject = filteredProjects.find(project => project.name === selectedProject);
  
  // В данном случае, используем адаптированные секции или пустой массив
  const currentProjectSections = isSectionsLoading ? [] : formatSectionsForDisplay(projectSections);

  // Calculate average percentages for each date column for the current project
  const averageProgress = allDates.map((_, columnIndex) => {
    const validValues = currentProjectSections
      .map((section) => section.progress[columnIndex])
      .filter((value) => value !== "-")
      .map((value) => Number.parseInt(value.replace("%", "")))

    if (validValues.length === 0) return "-"

    const average = validValues.reduce((sum, value) => sum + value, 0) / validValues.length
    return `${Math.round(average)}%`
  })

  // Фильтруем даты, чтобы отобразить только те, где хотя бы одна секция имеет ненулевой прогресс
  const filteredDates = allDates.filter((_, index) => {
    // Получаем среднее значение для этой даты
    const avgValue = averageProgress[index];
    
    // Если среднее значение не "-" и не "0%", значит хотя бы одна секция имеет ненулевой прогресс
    return avgValue !== "-" && avgValue !== "0%";
  });

  // Находим индекс начала ненулевых дат в массиве allDates
  const nonZeroStartIndex = allDates.findIndex((_, index) => {
    const avgValue = averageProgress[index];
    return avgValue !== "-" && avgValue !== "0%";
  });

  // Массив дат для отображения - если все даты с нулевыми значениями, показываем все даты
  // В противном случае показываем только даты начиная с первой ненулевой
  const displayDates = nonZeroStartIndex !== -1 
    ? allDates.slice(nonZeroStartIndex) 
    : allDates;

  // Toggle section selection for chart
  const toggleChartSection = (section: string) => {
    if (selectedChartSections.includes(section)) {
      setSelectedChartSections(selectedChartSections.filter((s) => s !== section))
    } else {
      setSelectedChartSections([...selectedChartSections, section])
    }
  }

  // Выбрать все секции для отображения на графике
  const selectAllSections = () => {
    const allSections = [
      ...(selectedProject ? ["Среднее значение"] : []), 
      ...currentProjectSections.map(section => section.name)
    ];
    setSelectedChartSections(allSections);
  }

  // Снять выбор со всех секций на графике
  const deselectAllSections = () => {
    setSelectedChartSections([]);
  }

  // Convert percentage string to number
  const percentToNumber = (percent: string): number | null => {
    if (percent === "-") return null
    return Number.parseInt(percent.replace("%", ""))
  }

  // Handle project change
  const handleProjectChange = (projectName: string) => {
    const selectedProjectObj = filteredProjects.find(project => project.name === projectName);
    setSelectedProject(projectName);
    setSelectedProjectId(selectedProjectObj?.ws_project_id);
    setIsOpen(false);
    setSearchQuery(""); // Сбрасываем поисковый запрос при выборе проекта
    // Добавляем "Среднее значение" в выбранные секции при выборе проекта
    setSelectedChartSections(["Среднее значение"]);
  }

  // Handle manager change
  const handleManagerChange = (manager: string) => {
    setSelectedManager(manager);
    setIsManagerOpen(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-4 mb-8">
          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Project selector */}
            <div className="relative w-64">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", selectedProject ? "bg-green-600" : "bg-gray-400")}></div>
                  <span className="font-medium">{selectedProject || "Выберите проект"}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                  {/* Поле поиска */}
                  <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Поиск проекта..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {/* Список проектов с прокруткой */}
                  <div className="max-h-60 overflow-y-auto">
                    {searchFilteredProjects.length === 0 ? (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        Проекты не найдены
                      </div>
                    ) : (
                      searchFilteredProjects.map((project) => (
                        <div
                          key={project.ws_project_id}
                          className={cn(
                            "px-4 py-3 cursor-pointer transition-colors",
                            project.name === selectedProject ? "bg-green-50 text-green-900" : "text-gray-700 hover:bg-gray-50",
                          )}
                          onClick={() => handleProjectChange(project.name)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  project.status === 'active' ? "bg-green-600" : "bg-gray-400",
                                )}
                              ></div>
                              <span>{project.name}</span>
                            </div>
                            {project.name === selectedProject && <Check className="h-4 w-4 text-green-600" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Manager selector */}
            <div className="relative w-64">
              <button
                onClick={() => setIsManagerOpen(!isManagerOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-800 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{selectedManager}</span>
                </div>
                {isManagerOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isManagerOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                  {managers.map((manager) => (
                    <div
                      key={manager}
                      className={cn(
                        "px-4 py-3 cursor-pointer transition-colors",
                        manager === selectedManager ? "bg-green-50 text-green-900" : "text-gray-700 hover:bg-gray-50",
                      )}
                      onClick={() => handleManagerChange(manager)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User
                            className={cn("h-4 w-4", manager === selectedManager ? "text-green-600" : "text-gray-400")}
                          />
                          <span>{manager}</span>
                        </div>
                        {manager === selectedManager && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Active/Inactive toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 h-12">
                <button
                  onClick={() => setShowActiveProjects(true)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors h-10",
                    showActiveProjects ? "bg-white text-gray-800 shadow-sm" : "text-gray-600  hover:bg-gray-200",
                  )}
                >
                  Активные проекты
                </button>
                <button
                  onClick={() => setShowActiveProjects(false)}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors h-10",
                    !showActiveProjects ? "bg-white text-gray-800 shadow-sm" : "text-gray-600  hover:bg-gray-200",
                  )}
                >
                  Не активные проекты
                </button>
              </div>

              {currentProject?.ws_project_id && (
                <a
                  href={`https://eneca.worksection.com/project/${currentProject.ws_project_id}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-4 flex items-center text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Открыть проект в WS
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg ml-auto">
              <Calendar className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>

          {/* Project manager info */}
          <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <User className="h-4 w-4" />
            <span>
              Руководитель проекта: <span className="font-medium">{currentProject?.manager || "Не назначен"}</span>
            </span>
        </div>

        <div className="flex-1">
          {/* Chart Section */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-green-700" />
                <h3 className="font-medium text-gray-700">Визуализация прогресса</h3>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={selectAllSections}
                  className="px-3 py-1.5 text-xs rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                >
                  Отобразить все разделы
                </button>
                <button
                  onClick={deselectAllSections}
                  className="px-3 py-1.5 text-xs rounded-md bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  Скрыть все разделы
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex flex-wrap gap-2">
                {/* Average button - показываем только если проект выбран */}
                {selectedProject && (
                  <button
                    onClick={() => toggleChartSection("Среднее значение")}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md border transition-colors",
                      selectedChartSections.includes("Среднее значение")
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: averageLineColor }}></div>
                      Среднее значение
                      {selectedChartSections.includes("Среднее значение") && <Check className="h-3 w-3 text-green-600" />}
                    </div>
                  </button>
                )}
                
                {/* Секции проекта - отсортированы в formatSectionsForDisplay */}
                {currentProjectSections.map((section) => (
                  <button
                    key={section.name}
                    onClick={() => toggleChartSection(section.name)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-md border transition-colors",
                      selectedChartSections.includes(section.name)
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: section.color }}></div>
                      {section.name}
                      {selectedChartSections.includes(section.name) && <Check className="h-3 w-3 text-green-600" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 pb-12">
              {displayDates.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={displayDates.map((date, dateIndex) => {
                      // Находим соответствующий индекс в полном массиве дат
                      const originalIndex = allDates.indexOf(date);
                      
                      // Create a single data point for each date with all selected sections
                      const dataPoint: any = { date }

                      // Add data for each selected section
                      selectedChartSections.forEach((sectionName) => {
                        if (sectionName === "Среднее значение") {
                          const avgValue = percentToNumber(averageProgress[originalIndex])
                          dataPoint[sectionName] = avgValue
                        } else {
                          const sectionData = currentProjectSections.find((s) => s.name === sectionName)
                          if (sectionData && originalIndex < sectionData.progress.length) {
                            dataPoint[sectionName] = percentToNumber(sectionData.progress[originalIndex])
                          }
                        }
                      })

                      return dataPoint
                    })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      angle={-45}
                      textAnchor="end"
                      padding={{ left: 30, right: 30 }}
                      tick={{ fill: "#666" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={{ stroke: "#e5e5e5" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      tick={{ fill: "#666" }}
                      axisLine={{ stroke: "#e5e5e5" }}
                      tickLine={{ stroke: "#e5e5e5" }}
                    />
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      labelFormatter={(label) => `Дата: ${label}`}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      verticalAlign="bottom"
                      align="center"
                      wrapperStyle={{
                        paddingTop: 30,
                        bottom: -10,
                        left: 0,
                        right: 0,
                      }}
                    />

                    {selectedChartSections.map((sectionName, index) => {
                      // Use a special color for the average line, otherwise use the color palette
                      const color =
                        sectionName === "Среднее значение"
                          ? averageLineColor
                            : currentProjectSections.find((s) => s.name === sectionName)?.color ||
                            colorPalette[index % colorPalette.length]

                      // Make the average line thicker
                      const strokeWidth = sectionName === "Среднее значение" ? 3 : 2

                      // Находим последнее непустое значение для секции
                      const firstDataIndex = 0;

                      return (
                        <Line
                          key={sectionName}
                          type="monotone"
                          dataKey={sectionName}
                          name={sectionName}
                          stroke={color}
                          strokeWidth={strokeWidth}
                          dot={{ r: 5, fill: color }}
                          activeDot={{ r: 7 }}
                          connectNulls
                          label={({ x, y, value, index }) => {
                            // Показываем подпись только для последней точки данных
                            if (index === firstDataIndex && value !== null) {
                              return (
                                <g>
                                  <text
                                    x={x + 10}
                                    y={y - 5}
                                    fill={color}
                                    fontSize={10}
                                    textAnchor="start"
                                    fontWeight={sectionName === "Среднее значение" ? "bold" : "normal"}
                                  >
                                    {sectionName}
                                  </text>
                                </g>
                              );
                            }
                            return <g></g>;
                          }}
                        />
                      )
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex justify-center items-center h-400 text-gray-500">
                  Нет данных для отображения графика
                </div>
              )}
            </div>
          </div>
              </div>

          {/* Используем секции из API */}
          <div className="grid grid-cols-1 gap-6">
            {/* Project sections table */}
            <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="sticky left-0 z-10 bg-gray-50 py-3 px-3 border-b border-r border-gray-100 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        Раздел
                      </th>
                      {displayDates.map((date, index) => (
                        <th
                          key={index}
                          className={cn(
                            "py-3 px-3 border-b border-r border-gray-100 text-gray-500 font-medium text-xs text-center",
                            date === today ? "bg-green-50" : "bg-gray-50",
                          )}
                        >
                          {date}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Строка среднего значения показывается только если проект выбран и есть даты */}
                  {selectedProject && displayDates.length > 0 && (
                    <tr className="bg-green-50 hover:bg-green-50">
                      <td className="border-r border-b border-gray-100 p-3 font-medium text-gray-700 sticky left-0 z-10 bg-green-50">
                        Среднее значение
                      </td>
                      {displayDates.map((date, displayIndex) => {
                        // Находим соответствующий индекс в полном массиве дат
                        const originalIndex = allDates.indexOf(date);
                        const value = averageProgress[originalIndex];
                        const isLastDate = displayIndex === displayDates.length - 1;
                        
                        return (
                          <td
                            key={displayIndex}
                            className={cn(
                              "border-r border-b border-gray-100 p-3 text-center",
                              isLastDate ? "bg-green-50" : "",
                            )}
                          >
                            <span
                              key={`avg-span-${displayIndex}`}
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                value === "-"
                                  ? "text-gray-400"
                                  : Number.parseInt(value) > 50
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {value}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  )}

                    {isSectionsLoading ? (
                      <tr>
                        <td colSpan={displayDates.length + 1} className="text-center py-4">
                          Загрузка секций проекта...
                        </td>
                      </tr>
                    ) : displayDates.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4">
                          Нет данных о датах для этого проекта
                        </td>
                      </tr>
                    ) : currentProjectSections.length === 0 ? (
                      <tr>
                        <td colSpan={displayDates.length + 1} className="text-center py-4">
                          Нет данных о секциях для этого проекта
                        </td>
                      </tr>
                    ) : (
                      // Секции отсортированы в formatSectionsForDisplay
                      currentProjectSections.map((section) => (
                    <tr key={section.name} className="hover:bg-gray-50">
                      <td className="border-r border-b border-gray-100 p-3 bg-white font-medium text-gray-700 sticky left-0 z-10">
                        {section.name}
                      </td>
                      {displayDates.map((date, displayIndex) => {
                        // Находим соответствующий индекс в полном массиве дат
                        const originalIndex = allDates.indexOf(date);
                        const value = section.progress[originalIndex];
                        const isLastDate = displayIndex === displayDates.length - 1;
                        
                        return (
                          <td
                            key={displayIndex}
                            className={cn(
                              "border-r border-b border-gray-100 p-3 text-center",
                              isLastDate ? "bg-green-50" : "bg-white",
                            )}
                          >
                            <span
                              key={`span-${displayIndex}`}
                              className={cn(
                                "px-2 py-1 rounded-full text-xs",
                                value === "-"
                                  ? "text-gray-400"
                                  : Number.parseInt(value) > 50
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-700",
                              )}
                            >
                              {value}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                      ))
                    )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard


