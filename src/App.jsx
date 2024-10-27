// App.jsx
import { io } from 'socket.io-client'
import Chat from './components/Chat'
//use this when in localhost
// const socket = io('http://192.168.1.101:3000')

//have to put the server ip after hosting
const socket = io('https://gossipgrid-server.onrender.com', {
  transports: ['websocket', 'polling'],
  withCredentials: true,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      <Chat socket={socket} />
    </div>
  )
}

export default App
