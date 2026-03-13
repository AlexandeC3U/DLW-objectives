import { useState, useEffect, useCallback } from 'react'
import { ref, onValue, set } from 'firebase/database'
import { db } from '../firebase'
import yaml from 'js-yaml'

const DB_REF = ref(db, 'board')

export function useBoard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Subscribe to Firebase — all changes from any user show up in real time
  useEffect(() => {
    const unsubscribe = onValue(DB_REF, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        setData(val)
        setLoading(false)
      } else {
        // DB is empty — seed it from data.yaml
        fetch('/data.yaml')
          .then(res => res.text())
          .then(text => {
            const parsed = yaml.load(text)
            set(DB_REF, parsed)
            // onValue will fire again once seed is written
          })
      }
    })
    return () => unsubscribe()
  }, [])

  // Helper: write the full board to Firebase
  const persist = useCallback((updater) => {
    setData(prev => {
      const next = updater(prev)
      set(DB_REF, next)
      return next
    })
  }, [])

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
    persist(prev => ({
      ...prev,
      objectives: prev.objectives.map(obj => ({
        ...obj,
        milestones: obj.milestones.map(m =>
          m.id === milestoneId ? { ...m, status: newStatus } : m
        )
      }))
    }))
  }, [persist])

  const addNote = useCallback((milestoneId, text) => {
    const note = {
      id: `note-${Date.now()}`,
      text,
      timestamp: new Date().toISOString()
    }
    persist(prev => ({
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
  }, [persist])

  const deleteNote = useCallback((milestoneId, noteId) => {
    persist(prev => ({
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
  }, [persist])

  const getProgress = useCallback((objectiveId) => {
    if (!data) return { done: 0, total: 0, percent: 0 }
    const obj = data.objectives.find(o => o.id === objectiveId)
    if (!obj) return { done: 0, total: 0, percent: 0 }
    const total = obj.milestones.length
    const done = obj.milestones.filter(m => m.status === 'done').length
    return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [data])

  const resetData = useCallback(() => {
    setLoading(true)
    fetch('/data.yaml')
      .then(res => res.text())
      .then(text => {
        const parsed = yaml.load(text)
        set(DB_REF, parsed)
        // onValue listener will update state automatically
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
