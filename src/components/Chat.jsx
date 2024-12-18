import React, { useEffect, useRef, useState } from 'react'

import {
  IoCloseOutline,
  IoMenuOutline,
  IoSendSharp,
  IoSettingsOutline,
} from 'react-icons/io5'

import Avatar from './Avatar'
import CopyButton from './CopyButton'
import Footer from './Footer'
import RoomModal from './RoomModal'
import Settings from './Settings'

const Chat = ({ socket }) => {
  const [userColors] = useState(() => new Map())

  // Add this function at the top level of your Chat component
  const getUserColor = (username) => {
    if (!userColors.has(username)) {
      // Generate a pastel color with moderate saturation
      const hue = Math.random() * 360
      const color = `hsla(${hue}, 50%, 70%, 0.3)` // Transparent pastel color
      userColors.set(username, color)
    }
    return userColors.get(username)
  }

  const [message, setMessage] = useState('')

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages')

    return savedMessages ? JSON.parse(savedMessages) : []
  })

  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || 'Anonymous',
  )

  const [currentRoom, setCurrentRoom] = useState(null)

  const [showRoomModal, setShowRoomModal] = useState(false)

  const [modalType, setModalType] = useState('')

  const [activePeople, setActivePeople] = useState(0)
const [roomMembers, setRoomMembers] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false)

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const messagesEndRef = useRef(null)

  const chatContainerRef = useRef(null)

  const inputRef = useRef(null)

  const checkScrollable = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current

      const shouldBeScrollable = scrollHeight > clientHeight

      if (shouldBeScrollable !== isScrollable) {
        setIsScrollable(shouldBeScrollable)
      }
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',

        block: 'end',
      })
    }
  }

  const forceScrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'auto',

        block: 'end',
      })
    }
  }

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(checkScrollable)

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    forceScrollToBottom()

    const timeoutId = setTimeout(checkScrollable, 50)

    return () => clearTimeout(timeoutId)
  }, [messages])

  useEffect(() => {
    socket.on('activePeople', (activePersons) => {
      setActivePeople(activePersons)
    })

    socket.on('message', (data) => {
      setMessages((prevMessages) => {
        // For room messages
        if (data.isRoomMessage) {
          if (currentRoom && data.room === currentRoom) {
            return [...prevMessages, {
              role: 'other',
              content: data.message,
              id: Date.now(),
              username: data.username,
              room: data.room,
              isRoomMessage: true,
              timestamp: data.timestamp
            }];
          }
          return prevMessages;
        }
        
        // For global messages
        if (!currentRoom && !data.isRoomMessage) {
          return [...prevMessages, {
            role: 'other',
            content: data.message,
            id: Date.now(),
            username: data.username,
            isRoomMessage: false,
            timestamp: data.timestamp
          }];
        }
        return prevMessages;
      });
    });

    socket.on('room_created', (roomId) => {
      setCurrentRoom(roomId)

      setMessages([])

      setShowRoomModal(false)

      // alert(

      //   `Private room created! Your room ID is: ${roomId}\nShare this ID with others to join.`,

      // )
    })

    socket.on('chatCleared', (data) => {
      if (data.username === username) {
        setMessages([])

        localStorage.removeItem('chatMessages')
      }
    })

    socket.on('room_joined', (roomId) => {
      setCurrentRoom(roomId)

      setMessages([])

      setShowRoomModal(false)

      // alert(`Joined private room: ${roomId}`)
    })

    socket.on('room_error', (error) => {
      alert(error)
    })

    socket.on('left_room_success', () => {
      setCurrentRoom(null)

      setMessages([])
    })

    socket.on('chatCleared', () => {
      setMessages([])
    })
    

  // Listen for room notifications
  socket.on('room_notification', (data) => {
    setMessages(prevMessages => [...prevMessages, {
      id: Date.now(),
      role: 'system',
      content: data.message,
      username: 'System',
      isSystemMessage: true,
      timestamp: new Date().toISOString()
    }]);
  });

  // Listen for room members count
  socket.on('room_members', (count) => {
    // You might want to add a state for room members count
    setRoomMembers(count); // Add this state if you haven't already
  });

    return () => {
      socket.off('activePeople')

      socket.off('message')

      socket.off('room_created')

      socket.off('room_joined')

      socket.off('room_error')

      socket.off('chatCleared')

      socket.off('left_room_success')

      socket.off('chatCleared')


          socket.off('room_notification');
    socket.off('room_members');
    }
  }, [socket, username, currentRoom])

const sendMessage = (e) => {
  e.preventDefault()
  const trimmedMessage = message.trim()
  if (trimmedMessage) {
    const timestamp = new Date().toISOString()
    const messageData = {
      message: trimmedMessage,
      username: username,
      room: currentRoom,
      timestamp: timestamp,
      isRoomMessage: !!currentRoom // Add this flag
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        content: trimmedMessage,
        id: Date.now(),
        username: username,
        room: currentRoom,
        isRoomMessage: !!currentRoom,
        timestamp: timestamp
      },
    ])
    socket.emit('clientMessage', messageData)
    setMessage('')
    inputRef.current?.focus()
    setTimeout(forceScrollToBottom, 100)
  }
}


  const handleCreateRoom = () => {
    socket.emit('create_room', username)
  }

  const handleJoinRoom = (roomId) => {
    if (!roomId.trim()) {
      alert('Please enter a room ID')
      return
    }
    // Clear messages when joining a new room
    setMessages([])
    socket.emit('join_room', { room: roomId.trim(), username })
  }

  const handleLeaveRoom = () => {
    if (currentRoom) {
      socket.emit('leave_room', { room: currentRoom, username })

      setCurrentRoom(null)

      setMessages([])
    }
  }

  const handleClearChat = () => {
    socket.emit('clearChat', { room: currentRoom, username })

    setMessages([])

    localStorage.removeItem('chatMessages')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}

      <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-lg border-b border-cyan-500/20 px-4 py-3 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse">
            Gossip Grid
          </h1>

          {/* Controls Container */}

          <div className="flex items-center gap-4">
            {/* Room Controls - Hidden on Mobile */}

            <div className="hidden md:flex items-center gap-2">
              {!currentRoom ? (
                <>
                  <button
                    onClick={() => {
                      setShowRoomModal(true)

                      setModalType('create')
                    }}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30 transition-colors"
                  >
                    Create Room
                  </button>

                  <button
                    onClick={() => {
                      setShowRoomModal(true)

                      setModalType('join')
                    }}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-500/30 transition-colors"
                  >
                    Join Room
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full border border-green-500/30">
                    Room id: {currentRoom}
                    <CopyButton textToCopy={currentRoom} />
                  </span>
                  {/* <CopyButton textToCopy={currentRoom} /> */}
                  <button
                    onClick={handleLeaveRoom}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm px-3 py-1 rounded-full border border-red-500/30 transition-colors"
                  >
                    Leave Room
                  </button>
                </div>
              )}
            </div>

            {/* <button

              onClick={handleClearChat}

              className="hidden md:flex p-2 rounded-full hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"

              title="Clear chat"

            >

              <IoTrashOutline className="w-6 h-6" />

            </button> */}

            {/* Settings Button and Online Count */}

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex bg-cyan-500/20 text-cyan-300 text-sm px-3 py-1 rounded-full border border-cyan-500/30">
                {activePeople} online
              </span>

              {/* Mobile Online Count */}

              <span className="md:hidden inline-flex bg-green-500/20 text-green-300 text-sm px-3 py-1 rounded-full border border-green-500/30">
                {activePeople} online
              </span>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="relative group p-2 rounded-full hover:bg-gray-700/50 transition-all"
                title="Settings"
              >
                <IoSettingsOutline className="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
              </button>

              {/* Mobile Menu Button */}

              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-full hover:bg-gray-700/50 transition-all"
              >
                <IoMenuOutline className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}

      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/95 backdrop-blur-sm animate-quickFade">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-cyan-400">Menu</h2>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-full hover:bg-gray-700/50"
              >
                <IoCloseOutline className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {!currentRoom ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowRoomModal(true)

                      setModalType('create')

                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-sm px-3 py-2 rounded-full border border-cyan-500/30 transition-colors"
                  >
                    Create Room
                  </button>

                  <button
                    onClick={() => {
                      setShowRoomModal(true)

                      setModalType('join')

                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-sm px-3 py-2 rounded-full border border-blue-500/30 transition-colors"
                  >
                    Join Room
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="block bg-green-500/20 text-green-300 text-sm px-3 py-2 rounded-full border border-green-500/30 text-center">
                    Room: {currentRoom}
                    <CopyButton textToCopy={currentRoom} />
                  </span>
                  {/* <CopyButton textToCopy={currentRoom} /> */}
                  <button
                    onClick={() => {
                      handleLeaveRoom()

                      setShowMobileMenu(false)
                    }}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm px-3 py-2 rounded-full border border-red-500/30 transition-colors"
                  >
                    Leave Room
                  </button>
                </div>
              )}

              {/* trash button disabled*/}

              {/* <button

                onClick={() => {

                  handleClearChat()

                  setShowMobileMenu(false)

                }}

                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-sm px-3 py-2 rounded-full border border-red-500/30 transition-colors"

              >

                <IoTrashOutline className="w-5 h-5" />

                Clear Chat

              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}

      <div className="max-w-3xl mx-auto p-3 md:p-4 h-[calc(100vh-144px)] flex flex-col">
        <div
          ref={chatContainerRef}
          className={`flex-1 mb-3 overflow-y-auto custom-scrollbar relative ${
            isScrollable ? 'is-scrollable' : ''
          }`}
        >
          <div className="flex flex-col justify-end min-h-full">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-center px-4">
                  {currentRoom
                    ? 'Start chatting in your private room!'
                    : 'Start a conversation!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
{messages.map((msg) => (
  <div
    key={msg.id}
    className={`flex ${
      msg.isSystemMessage
        ? 'justify-center'
        : msg.username === username
        ? 'justify-end'
        : 'justify-start'
    } items-start gap-2 group`}
  >
    {!msg.isSystemMessage && msg.username !== username && (
      <div className="flex-shrink-0 mt-1">
        <Avatar
          name={msg.username}
          size="sm"
          color={getUserColor(msg.username)}
        />
      </div>
    )}
    <div
      className={`${
        msg.isSystemMessage
          ? 'bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 px-3 py-1 rounded-full max-w-[85%] md:max-w-[75%] animate-quickFade'
          : `max-w-[85%] md:max-w-[75%] px-3 py-2 rounded-2xl
            ${
              msg.username === username
                ? 'bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-tr-none'
                : 'bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-tl-none'
            }
            transform hover:scale-[1.02] transition-transform duration-200
            animate-quickFade`
      }`}
    >
      {msg.isSystemMessage ? (
        <p className="text-gray-400 text-xs md:text-sm text-center">
          {msg.content}
        </p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 text-xs text-gray-400 mb-1">
            <span className="font-medium">
              {msg.username || 'Anonymous'}
            </span>
            {currentRoom && (
              <span className="text-cyan-400">Private Room</span>
            )}
          </div>
          <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
            {msg.content}
          </p>
        </>
      )}
    </div>
    {!msg.isSystemMessage && msg.username === username && (
      <div className="flex-shrink-0 mt-1">
        <Avatar
          name={msg.username}
          size="sm"
          color={getUserColor(msg.username)}
        />
      </div>
    )}
  </div>
))}

                <div
                  ref={messagesEndRef}
                  className="h-0"
                />
              </div>
            )}
          </div>
        </div>

        {/* Message Input Form */}

        <form
          onSubmit={sendMessage}
          className="relative mt-auto"
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSettingsOpen}
            placeholder={
              isSettingsOpen
                ? 'Close settings to send message...'
                : currentRoom
                ? `Messaging in room ${currentRoom}...`
                : 'Send a message to everyone...'
            }
            className={`w-full p-3 md:p-4 pr-16 rounded bg-black/50 backdrop-blur-md border

        ${
          isSettingsOpen
            ? 'border-gray-600 text-gray-500 cursor-not-allowed'
            : 'border-cyan-500/30 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
        }

        focus:outline-none transition-colors duration-200 placeholder-gray-400 text-sm md:text-base`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <button
              type="submit"
              disabled={isSettingsOpen}
              className={`group relative p-2 md:p-3 rounded-full overflow-hidden transition-colors duration-200

          ${isSettingsOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500

            ${
              isSettingsOpen ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
            }

            transition-opacity duration-200 rounded-full`}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500

            ${
              isSettingsOpen
                ? ''
                : 'group-hover:scale-[1.5] group-hover:blur-md'
            }

            transition-transform duration-200 rounded-full`}
              />

              <div className="relative">
                <IoSendSharp
                  className={`w-5 h-5 ${
                    isSettingsOpen
                      ? 'text-gray-400'
                      : 'text-cyan-400 group-hover:text-white'
                  }

            transition-colors duration-200`}
                />
              </div>
            </button>
          </div>
        </form>
      </div>

      {/* footer added here  */}

      <Footer />

      {/* here is the footer */}

      <Settings
        username={username}
        setUsername={setUsername}
        onClearChat={handleClearChat}
        socket={socket}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        currentRoom={currentRoom}
      />

      <RoomModal
        isOpen={showRoomModal}
        setIsOpen={setShowRoomModal}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        modalType={modalType}
      />
    </div>
  )
}

export default Chat
