import { useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'

function RoomModal({ isOpen, setIsOpen, onCreateRoom, onJoinRoom, modalType }) {
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')

  const handleAction = () => {
    setError('') // Clear any previous errors

    if (modalType === 'create') {
      onCreateRoom()
    } else if (modalType === 'join') {
      if (!roomId.trim()) {
        setError('Please enter a room ID')
        return
      }
      onJoinRoom(roomId.trim())
    }
  }

  // Reset error and roomId when modal closes or opens
  const handleClose = () => {
    setError('')
    setRoomId('')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 animate-quickFade">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl animate-quickFade">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
          <div className="relative p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {modalType === 'create' ? 'Create Room' : 'Join Room'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-700/50 transition-all"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            {modalType === 'join' && (
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => {
                    setError('')
                    setRoomId(e.target.value)
                  }}
                  placeholder="Enter Room ID"
                  className={`w-full px-4 py-3 bg-black/20 rounded-lg border
                    ${
                      error
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-cyan-500/30 focus:border-cyan-400'
                    }
                    focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
                    transition-all duration-200`}
                />
                {error && <p className="text-red-400 text-sm px-1">{error}</p>}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700/50
                transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
                text-white font-medium transition-all duration-200"
              >
                {modalType === 'create' ? 'Create Room' : 'Join Room'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomModal
