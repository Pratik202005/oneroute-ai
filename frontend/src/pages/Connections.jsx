import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const users = [
  { id: 1, initials: 'AS', name: 'User #A421', location: 'Rotterdam Port', space: '12 TEUs available', online: true },
  { id: 2, initials: 'MK', name: 'User #B882', location: 'Singapore Hub', space: '45 LCL units', online: true },
  { id: 3, initials: 'LV', name: 'User #X009', location: 'Long Beach Terminal', space: '2.5 Tons Payload', online: false },
]

const initialMessages = [
  { id: 1, from: 'them', text: "Hello! I saw you have an upcoming route to Rotterdam. I'm looking to fill 4 TEUs.", time: '10:24 AM' },
  { id: 2, from: 'me', text: "That matches my schedule perfectly. We have exactly 12 available. What's your cargo type?", time: '10:26 AM' },
  { id: 3, from: 'them', text: "It's non-perishable industrial parts. Packed and ready for the 15th.", time: '10:27 AM' },
]

function Connections() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [chatOpen, setChatOpen] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim()) return
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        from: 'me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ])
    setMessage('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  const handleConnect = (user) => {
    toast.success(`Connected with ${user.name}! 🎉`)
  }

  const handleChat = () => {
    setChatOpen(true)
  }

  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">

          {/* Left - User List */}
          <div className="lg:col-span-8">
            <section className="mb-8 sm:mb-12">
              <h1 className="font-headline font-extrabold text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight mb-3 sm:mb-4">
                Connect with Co-Shippers
              </h1>
              <p className="text-on-surface-variant text-sm sm:text-lg max-w-2xl leading-relaxed">
                Optimize your supply chain costs by partnering with verified co-shippers. Find matches for your route and split logistics overhead instantly.
              </p>
            </section>

            <div className="space-y-4 sm:space-y-6">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-headline font-bold
                        ${user.id === 1 ? 'kinetic-gradient text-white' : 'bg-surface-container-high text-primary'}
                      `}>
                        {user.initials}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white
                        ${user.online ? 'bg-secondary' : 'bg-slate-300'}
                      `}></div>
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-base sm:text-lg text-primary">{user.name}</h3>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-xs sm:text-sm mt-0.5">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        <span>{user.location}</span>
                      </div>
                      <div className="mt-1">
                        <span className="text-xs uppercase tracking-wider font-medium text-slate-400">Space: </span>
                        <span className="font-headline font-bold text-primary text-sm">{user.space}</span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleChat}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 outline outline-1 outline-outline/20 text-primary font-label font-bold rounded-lg hover:bg-surface-container-high transition-colors text-sm"
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => handleConnect(user)}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 kinetic-gradient text-white font-label font-bold rounded-lg shadow hover:scale-95 active:scale-90 transition-transform text-sm"
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Chat (Desktop always visible, Mobile toggle) */}
          <aside className={`lg:col-span-4 flex flex-col h-[500px] sm:h-[580px] lg:h-[calc(100vh-12rem)] min-h-[500px] bg-surface-container-low rounded-lg overflow-hidden shadow
            ${chatOpen ? 'flex' : 'hidden lg:flex'}
          `}>

            {/* Chat Header */}
            <div className="p-4 sm:p-6 bg-surface-container-lowest flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full kinetic-gradient flex items-center justify-center text-white text-xs font-bold">
                  AS
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-primary">User #A421</p>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Online Now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 sm:p-2 hover:bg-surface-container-high rounded-full transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant text-lg sm:text-2xl">more_vert</span>
                </button>
                {/* Close button for mobile */}
                <button
                  onClick={() => setChatOpen(false)}
                  className="lg:hidden p-1.5 hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 sm:space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 sm:p-4 rounded-2xl max-w-[85%]
                    ${msg.from === 'me'
                      ? 'kinetic-gradient text-white rounded-tr-none'
                      : 'bg-surface-container-high text-primary rounded-tl-none'
                    }
                  `}>
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                    <span className={`text-[10px] mt-1.5 sm:mt-2 block font-medium
                      ${msg.from === 'me' ? 'text-white/60' : 'text-slate-400'}
                    `}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 sm:p-6 bg-surface-container-lowest flex-shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-surface-container-high border-none rounded-full px-5 sm:px-6 py-3 pr-12 text-xs sm:text-sm focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 p-2 text-secondary hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    send
                  </span>
                </button>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sync encrypted via Firebase
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 kinetic-gradient w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-90 transition-transform z-40">
        <span className="material-symbols-outlined text-xl sm:text-2xl">person_add</span>
      </button>

      <Footer />
    </div>
  )
}

export default Connections