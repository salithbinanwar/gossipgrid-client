import { useEffect, useState } from 'react'
import { FiTrash2, FiUser, FiWifi, FiWifiOff } from 'react-icons/fi'
import { IoCloseOutline, IoSaveOutline } from 'react-icons/io5'

function Settings({
  username,
  setUsername,
  onClearChat,
  socket,
  isOpen,
  setIsOpen,
  currentRoom,
}) {
  const [tempUsername, setTempUsername] = useState(username)
  const [isConnected, setIsConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark',
  )
  const [chatSettings, setChatSettings] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('chatSettings')) || {
        fontSize: 'medium',
        bubbleStyle: 'modern',
      }
    )
  })

  useEffect(() => {
    if (socket) {
      setIsConnected(socket.connected)
      const handleConnect = () => setIsConnected(true)
      const handleDisconnect = () => setIsConnected(false)
      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)
      return () => {
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
      }
    }
  }, [socket])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('chatSettings', JSON.stringify(chatSettings))
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme, chatSettings])

  const handleSave = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername)
      localStorage.setItem('username', tempUsername)
      setIsOpen(false)
    }
  }

  const tabs = [
    { id: 'profile', icon: FiUser, label: 'Profile' },
    { id: 'danger', icon: FiTrash2, label: 'Danger Zone' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cyan-400 mb-2">
                Username
              </label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                className="w-full px-4 py-3 bg-black/20 rounded-lg border border-cyan-500/30
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none
                transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                  Status
                </span>
                {isConnected ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <FiWifi className="w-4 h-4" />
                    <span className="text-sm">Connected</span>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <FiWifiOff className="w-4 h-4" />
                    <span className="text-sm">Disconnected</span>
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'danger':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <h3 className="text-sm font-medium text-red-400 mb-2">
                Clear Chat History
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                This action will clear your chat history. Other users' messages
                will not be affected.
              </p>
              <button
                onClick={() => {
                  onClearChat()
                  setIsOpen(false)
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
          bg-red-500/10 hover:bg-red-500/20 border border-red-500/30
          text-red-400 transition-all duration-200"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear My Messages
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderFooter = () => {
    if (activeTab === 'profile') {
      return (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-700/50
            transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
            bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400
            text-white font-medium transition-all duration-200 group"
          >
            <IoSaveOutline className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            Save Changes
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 animate-quickFade">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="mt-20 fixed inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900/95 to-gray-800/95 rounded-2xl shadow-2xl animate-quickFade">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl" />
              <div className="relative p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                    Settings
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-all"
                  >
                    <IoCloseOutline className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-none">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-400 hover:text-cyan-300 hover:bg-gray-700/30'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  {renderTabContent()}
                </div>
                {renderFooter()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings
