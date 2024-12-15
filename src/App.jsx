// App.jsx
import { io } from 'socket.io-client'
import Chat from './components/Chat'

// For development (when running locally)
// const socket = io('http://localhost:3000', {
//   transports: ['websocket', 'polling'],
//   withCredentials: true,
// });

// For production
const socket = io('https://gossipgrid-server.onrender.com', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
})

// Add connection event listeners
socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('connect_error', (error) => {
  console.error('Connection error:', error)
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <Chat socket={socket} />
    </div>
  )
}

export default App
