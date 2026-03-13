import { useState } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { useBoard } from './hooks/useBoard'
import Header from './components/Header'
import ProgressTracker from './components/ProgressTracker'
import Board from './components/Board'
import Overview from './components/Overview'
import CardModal from './components/CardModal'
import ParticleBackground from './components/ParticleBackground'

export default function App() {
  const board = useBoard()
  const [view, setView] = useState('overview')
  const [selectedCard, setSelectedCard] = useState(null)

  if (board.loading) {
    return <div className="loading"><span className="loading-spinner" />Loading objectives...</div>
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const { draggableId, destination } = result
    board.moveMilestone(draggableId, destination.droppableId)
  }

  const handleCardClick = (milestone) => {
    setSelectedCard(milestone)
  }

  const handleCloseModal = () => {
    setSelectedCard(null)
  }

  return (
    <>
      <ParticleBackground />
      <div className="app-shell">
        <Header
        title={board.data.title}
        subtitle={board.data.subtitle}
        view={view}
        onViewChange={setView}
        onReset={board.resetData}
      />
      <ProgressTracker
        objectives={board.data.objectives}
        getProgress={board.getProgress}
      />
      {view === 'board' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Board
            columns={board.data.columns}
            getMilestonesByStatus={board.getMilestonesByStatus}
            onCardClick={handleCardClick}
          />
        </DragDropContext>
      ) : (
        <Overview
          objectives={board.data.objectives}
          getProgress={board.getProgress}
          onMilestoneClick={handleCardClick}
          getAllMilestones={board.getAllMilestones}
        />
      )}
      {selectedCard && (
        <CardModal
          milestone={selectedCard}
          columns={board.data.columns}
          onClose={handleCloseModal}
          onStatusChange={(status) => {
            board.moveMilestone(selectedCard.id, status)
            setSelectedCard(prev => prev ? { ...prev, status } : null)
          }}
          onAddNote={(text) => board.addNote(selectedCard.id, text)}
          onDeleteNote={(noteId) => board.deleteNote(selectedCard.id, noteId)}
          allMilestones={board.getAllMilestones()}
        />
      )}
      </div>
    </>
  )
}
