"use client"

import { useState, useEffect, FC } from "react"
import { Check, ChevronDown, ChevronUp, Calendar, BarChart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

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

const ProjectDashboard: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isManagerOpen, setIsManagerOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState("Проект 3")
  const [selectedManager, setSelectedManager] = useState("Все менеджеры")
  const [selectedChartSections, setSelectedChartSections] = useState<string[]>([])
  const [showActiveProjects, setShowActiveProjects] = useState(true)

  const today = "10.08.2025"

  // Updated to use Friday dates (end of week) with more dates in the past
  const allDates = [
    // April dates (past)
    "05.04.2025",
    "12.04.2025",
    "19.04.2025",
    "26.04.2025",
    // May dates (past)
    "03.05.2025",
    "10.05.2025",
    "17.05.2025",
    "24.05.2025",
    "31.05.2025",
    // June dates (past)
    "07.06.2025",
    "14.06.2025",
    "21.06.2025",
    "28.06.2025",
    // July dates (past)
    "05.07.2025",
    "12.07.2025",
    "19.07.2025",
    "26.07.2025",
    // August dates (up to current date)
    "02.08.2025",
    "09.08.2025",
  ]

  // Group dates by month
  const datesByMonth = allDates.reduce((acc: Record<string, string[]>, date) => {
    const month = date.split(".")[1]
    let monthName = "Август"

    if (month === "04") monthName = "Апрель"
    else if (month === "05") monthName = "Май"
    else if (month === "06") monthName = "Июнь"
    else if (month === "07") monthName = "Июль"

    if (!acc[monthName]) {
      acc[monthName] = []
    }

    acc[monthName].push(date)
    return acc
  }, {})

  // Project-specific data with managers and active status
  const projectData: ProjectDataMap = {
    "Проект 1": {
      manager: "Иванов А.П.",
      isActive: true,
      sections: [
        {
          name: "Фундамент",
          color: "#40916C",
          progress: [
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "95%",
            "100%",
          ],
        },
        {
          name: "Стены",
          color: "#406987",
          progress: [
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "95%",
          ],
        },
        {
          name: "Крыша",
          color: "#D29F5D",
          progress: [
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
          ],
        },
        {
          name: "Окна и двери",
          color: "#D27C5D",
          progress: [
            "0%",
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
          ],
        },
      ],
    },
    "Проект 2": {
      manager: "Петров С.В.",
      isActive: true,
      sections: [
        {
          name: "Дизайн",
          color: "#3F6D58",
          progress: [
            "10%",
            "20%",
            "30%",
            "40%",
            "50%",
            "60%",
            "70%",
            "80%",
            "90%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Верстка",
          color: "#3D5565",
          progress: [
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "40%",
            "50%",
            "60%",
            "70%",
            "75%",
            "80%",
            "85%",
            "90%",
            "95%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Бэкенд",
          color: "#9D815B",
          progress: [
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "90%",
            "95%",
          ],
        },
        {
          name: "Тестирование",
          color: "#9D6D5B",
          progress: [
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
          ],
        },
        {
          name: "Деплой",
          color: "#155E3D",
          progress: [
            "0%",
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
          ],
        },
      ],
    },
    "Проект 3": {
      manager: "Сидоров И.К.",
      isActive: true,
      sections: [
        {
          name: "Раздел 1",
          color: "#153C57",
          progress: [
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "90%",
            "100%",
          ],
        },
        {
          name: "Раздел 2",
          color: "#885A1E",
          progress: [
            "2%",
            "4%",
            "6%",
            "8%",
            "10%",
            "12%",
            "14%",
            "16%",
            "18%",
            "20%",
            "22%",
            "24%",
            "26%",
            "28%",
            "30%",
            "32%",
            "34%",
            "36%",
            "40%",
          ],
        },
        {
          name: "Раздел 3",
          color: "#883B1E",
          progress: [
            "3%",
            "6%",
            "9%",
            "12%",
            "15%",
            "18%",
            "21%",
            "24%",
            "27%",
            "30%",
            "33%",
            "36%",
            "39%",
            "42%",
            "45%",
            "48%",
            "51%",
            "54%",
            "60%",
          ],
        },
        {
          name: "Раздел 4",
          color: "#74C8A2",
          progress: [
            "1%",
            "2%",
            "3%",
            "4%",
            "5%",
            "6%",
            "7%",
            "8%",
            "9%",
            "10%",
            "12%",
            "14%",
            "16%",
            "18%",
            "20%",
            "22%",
            "24%",
            "26%",
            "30%",
          ],
        },
        {
          name: "Раздел 5",
          color: "#76A3C3",
          progress: [
            "4%",
            "8%",
            "12%",
            "16%",
            "20%",
            "24%",
            "28%",
            "32%",
            "36%",
            "40%",
            "44%",
            "48%",
            "52%",
            "56%",
            "60%",
            "64%",
            "68%",
            "72%",
            "80%",
          ],
        },
      ],
    },
    "Проект 4": {
      manager: "Иванов А.П.",
      isActive: true,
      sections: [
        {
          name: "Планирование",
          color: "#E8BE87",
          progress: [
            "10%",
            "20%",
            "30%",
            "40%",
            "50%",
            "60%",
            "70%",
            "80%",
            "90%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Закупка материалов",
          color: "#E8A187",
          progress: [
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "60%",
            "70%",
            "80%",
            "90%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Производство",
          color: "#40916C",
          progress: [
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "90%",
            "95%",
          ],
        },
        {
          name: "Контроль качества",
          color: "#406987",
          progress: [
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
          ],
        },
        {
          name: "Доставка",
          color: "#D29F5D",
          progress: [
            "0%",
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
          ],
        },
        {
          name: "Установка",
          color: "#D27C5D",
          progress: [
            "0%",
            "0%",
            "0%",
            "0%",
            "5%",
            "10%",
            "15%",
            "20%",
            "25%",
            "30%",
            "35%",
            "40%",
            "45%",
            "50%",
            "55%",
            "60%",
            "65%",
            "70%",
            "75%",
          ],
        },
      ],
    },
    "Проект 5": {
      manager: "Петров С.В.",
      isActive: false,
      sections: [
        {
          name: "Исследование",
          color: "#3F6D58",
          progress: [
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Разработка",
          color: "#3D5565",
          progress: [
            "80%",
            "85%",
            "90%",
            "95%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Тестирование",
          color: "#9D815B",
          progress: [
            "60%",
            "65%",
            "70%",
            "75%",
            "80%",
            "85%",
            "90%",
            "95%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
      ],
    },
    "Проект 6": {
      manager: "Сидоров И.К.",
      isActive: false,
      sections: [
        {
          name: "Этап 1",
          color: "#9D6D5B",
          progress: [
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Этап 2",
          color: "#155E3D",
          progress: [
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
        {
          name: "Этап 3",
          color: "#153C57",
          progress: [
            "90%",
            "92%",
            "94%",
            "96%",
            "98%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
            "100%",
          ],
        },
      ],
    },
  }

  // Get unique managers
  const managers = ["Все менеджеры", ...new Set(Object.values(projectData).map((project) => project.manager))]

  // Filter projects based on selected manager and active status
  const filteredProjects = Object.entries(projectData)
    .filter(([_, project]) => {
      const managerMatch = selectedManager === "Все менеджеры" || project.manager === selectedManager
      const activeMatch = project.isActive === showActiveProjects
      return managerMatch && activeMatch
    })
    .map(([name]) => name)

  // If no projects match the filters, reset to default selection
  useEffect(() => {
    if (filteredProjects.length > 0 && !filteredProjects.includes(selectedProject)) {
      setSelectedProject(filteredProjects[0])
    }
  }, [filteredProjects, selectedProject])

  // Get current project data
  const currentProjectData = projectData[selectedProject as keyof typeof projectData]

  // Calculate average percentages for each date column for the current project
  const averageProgress = allDates.map((_, columnIndex) => {
    const validValues = currentProjectData.sections
      .map((section) => section.progress[columnIndex])
      .filter((value) => value !== "-")
      .map((value) => Number.parseInt(value.replace("%", "")))

    if (validValues.length === 0) return "-"

    const average = validValues.reduce((sum, value) => sum + value, 0) / validValues.length
    return `${Math.round(average)}%`
  })

  // Reset selected chart sections when project changes
  useEffect(() => {
    // Initialize with the first section of the selected project
    if (projectData[selectedProject]?.sections.length > 0) {
      setSelectedChartSections([projectData[selectedProject].sections[0].name])
    } else {
      setSelectedChartSections([])
    }
  }, [selectedProject]) // Only depend on selectedProject, not derived data

  // Toggle section selection for chart
  const toggleChartSection = (section: string) => {
    if (selectedChartSections.includes(section)) {
      setSelectedChartSections(selectedChartSections.filter((s) => s !== section))
    } else {
      setSelectedChartSections([...selectedChartSections, section])
    }
  }

  // Convert percentage string to number
  const percentToNumber = (percent: string): number | null => {
    if (percent === "-") return null
    return Number.parseInt(percent.replace("%", ""))
  }

  // Handle project change
  const handleProjectChange = (project: string) => {
    setSelectedProject(project)
    setIsOpen(false)
  }

  // Handle manager change
  const handleManagerChange = (manager: string) => {
    setSelectedManager(manager)
    setIsManagerOpen(false)
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
                  <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  <span className="font-medium">{selectedProject}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="absolute z-20 mt-1 w-full bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden">
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <div
                        key={project}
                        className={cn(
                          "px-4 py-3 cursor-pointer transition-colors",
                          project === selectedProject ? "bg-green-50 text-green-900" : "text-gray-700 hover:bg-gray-50",
                        )}
                        onClick={() => handleProjectChange(project)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                project === selectedProject ? "bg-green-600" : "bg-gray-300",
                              )}
                            ></div>
                            <span>{project}</span>
                          </div>
                          {project === selectedProject && <Check className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500">Нет проектов, соответствующих фильтрам</div>
                  )}
                </div>
              )}
            </div>

            {/* Manager filter */}
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
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setShowActiveProjects(true)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  showActiveProjects ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800",
                )}
              >
                Активные проекты
              </button>
              <button
                onClick={() => setShowActiveProjects(false)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  !showActiveProjects ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800",
                )}
              >
                Не активные проекты
              </button>
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
              Менеджер проекта: <span className="font-medium">{currentProjectData.manager}</span>
            </span>
          </div>
        </div>

        <div className="flex-1">
          {/* Chart Section */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-green-700" />
                <h3 className="font-medium text-gray-700">Визуализация прогресса</h3>
              </div>
            </div>

            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex flex-wrap gap-2">
                {currentProjectData.sections.map((section) => (
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

                {/* Average button */}
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
              </div>
            </div>

            <div className="p-4 pb-12">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={allDates.map((date, dateIndex) => {
                    // Create a single data point for each date with all selected sections
                    const dataPoint: any = { date }

                    // Add data for each selected section
                    selectedChartSections.forEach((sectionName) => {
                      if (sectionName === "Среднее значение") {
                        const avgValue = percentToNumber(averageProgress[dateIndex])
                        dataPoint[sectionName] = avgValue
                      } else {
                        const sectionData = currentProjectData.sections.find((s) => s.name === sectionName)
                        if (sectionData && dateIndex < sectionData.progress.length) {
                          dataPoint[sectionName] = percentToNumber(sectionData.progress[dateIndex])
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
                        : currentProjectData.sections.find((s) => s.name === sectionName)?.color ||
                          colorPalette[index % colorPalette.length]

                    // Make the average line thicker
                    const strokeWidth = sectionName === "Среднее значение" ? 3 : 2

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
                      />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center">
              <h3 className="font-medium text-gray-700">Прогресс по разделам</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto pr-2">
                <div className="w-3 h-3 bg-green-50 border border-gray-200"></div>
                <span>Последняя доступная дата</span>
              </div>
            </div>
            {/* Improved horizontal scrolling container */}
            <div className="overflow-x-auto" style={{ maxWidth: "100%", WebkitOverflowScrolling: "touch" }}>
              <table className="w-full" style={{ minWidth: "1500px" }}>
                <thead>
                  <tr>
                    <th className="border-b border-r border-gray-100 p-3 bg-white sticky left-0 z-[5]"></th>
                    {Object.entries(datesByMonth).map(([month, dates]) => (
                      <th
                        key={month}
                        colSpan={dates.length}
                        className="border-b border-r border-gray-100 p-3 text-center bg-white text-gray-600 font-medium"
                      >
                        {month}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="border-r border-gray-100 p-3 bg-white sticky left-0 z-[5]"></th>
                    {allDates.map((date, index) => {
                      const isLastDate = date === "09.08.2025" // Last date before current
                      return (
                        <th
                          key={date}
                          className={cn(
                            "border-r border-gray-100 p-3 text-center text-xs",
                            isLastDate ? "bg-green-50 text-gray-600" : "bg-white text-gray-500",
                          )}
                        >
                          <div className="rotate-90 h-24 flex items-center justify-center">{date}</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Average Row */}
                  <tr className="bg-green-50 hover:bg-green-50">
                    <td className="border-r border-b border-gray-100 p-3 font-medium text-gray-700 sticky left-0 z-10 bg-green-50">
                      Среднее значение
                    </td>
                    {averageProgress.map((value, index) => {
                      const isLastDate = index === averageProgress.length - 1
                      return (
                        <td
                          key={index}
                          className={cn(
                            "border-r border-b border-gray-100 p-3 text-center",
                            isLastDate ? "bg-green-50" : "",
                          )}
                        >
                          <span
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

                  {/* Project-specific Data Rows */}
                  {currentProjectData.sections.map((section) => (
                    <tr key={section.name} className="hover:bg-gray-50">
                      <td className="border-r border-b border-gray-100 p-3 bg-white font-medium text-gray-700 sticky left-0 z-10">
                        {section.name}
                      </td>
                      {section.progress.map((value, index) => {
                        const isLastDate = index === section.progress.length - 1
                        return (
                          <td
                            key={index}
                            className={cn(
                              "border-r border-b border-gray-100 p-3 text-center",
                              isLastDate ? "bg-green-50" : "bg-white",
                            )}
                          >
                            <span
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDashboard

