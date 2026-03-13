import { useState, useEffect, useCallback } from 'react'
import yaml from 'js-yaml'

const STORAGE_KEY = 'road2supremeleader-data'

export function useBoard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setData(JSON.parse(saved))
        setLoading(false)
        return
      } catch { /* fall through to YAML */ }
    }

    fetch('/data.yaml')
      .then(res => res.text())
      .then(text => {
        const parsed = yaml.load(text)
        setData(parsed)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  const getAllMilestones = useCallback(() => {
    if (!data) return []
    return data.objectives.flatMap(obj =>
      obj.milestones.map(m => ({ ...m, objective: obj }))
    )
  }, [data])

  const getMilestonesByStatus = useCallback((status) => {
    return getAllMilestones().filter(m => m.status === status)
  }, [getAllMilestones])

  const moveMilestone = useCallback((milestoneId, newStatus) => {
    setData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        milestones: obj.milestones.map(m =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        )
      }))
    }))
  }, [])

  const addNote = useCallback((milestoneId, text) => {
    const note = {
      id: `note-${Date.now()}`,
      text,
      timestamp: new Date().toISOString()
    }
    setData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        milestones: obj.milestones.map(m =>
          m.id === milestoneId
            ? { ...m, notes: [...(m.notes || []), note] }
            : m
        )
      }))
    }))
  }, [])

  const deleteNote = useCallback((milestoneId, noteId) => {
    setData(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        milestones: obj.milestones.map(m =>
          m.id === milestoneId
            ? { ...m, notes: (m.notes || []).filter(n => n.id !== noteId) }
            : m
        )
      }))
    }))
  }, [])

  const getProgress = useCallback((objectiveId) => {
    if (!data) return { done: 0, total: 0, percent: 0 }
    const obj = data.objectives.find(o => o.id === objectiveId)
    if (!obj) return { done: 0, total: 0, percent: 0 }
    const total = obj.milestones.length
    const done = obj.milestones.filter(m => m.status === 'done').length
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [data])

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setLoading(true)
    fetch('/data.yaml')
      .then(res => res.text())
      .then(text => {
        const parsed = yaml.load(text)
        setData(parsed)
        setLoading(false)
      })
  }, [])

  return {
    data,
    loading,
    getAllMilestones,
    getMilestonesByStatus,
    moveMilestone,
    addNote,
    deleteNote,
    getProgress,
    resetData,
  }
}
