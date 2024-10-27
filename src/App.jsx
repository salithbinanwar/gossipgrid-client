// App.jsx
import { io } from 'socket.io-client'
import Chat from './components/Chat'
const socket = io('http://192.168.1.101:3000')

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <Chat socket={socket} />
    </div>
  )
}

export default App
