import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Connections() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'them',
      text: "Hello! I saw you have an upcoming route to Rotterdam. I'm looking to fill 4 TEUs.",
      time: '10:24 AM'
    },
    {
      id: 2,
      from: 'me',
      text: "That matches my schedule perfectly. We have exactly 12 available. What's your cargo type?",
      time: '10:26 AM'
    },
    {
      id: 3,
      from: 'them',
      text: "It's non-perishable industrial parts. Packed and ready for the 15th.",
      time: '10:27 AM'
    }
  ])

  const handleSend = () => {
    if (message.trim() === '') return
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
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

  const users = [
    {
      id: 1,
      initials: 'AS',
      name: 'User #A421',
      location: 'Rotterdam Port',
      space: '12 TEUs available',
      online: true,
      color: 'kinetic-gradient'
    },
    {
      id: 2,
      initials: 'MK',
      name: 'User #B882',
      location: 'Singapore Hub',
      space: '45 LCL units',
      online: true,
      color: 'bg-surface-container-high'
    },
    {
      id: 3,
      initials: 'LV',
      name: 'User #X009',
      location: 'Long Beach Terminal',
      space: '2.5 Tons Payload',
      online: false,
      color: 'bg-surface-container-high'
    }
  ]

  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-32 px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left - User List */}
          <div className="lg:col-span-8">

            {/* Header */}
            <section className="mb-12">
              <h1 className="font-headline font-extrabold text-4xl lg:text-5xl text-primary tracking-tight mb-4">
                Connect with Co-Shippers
              </h1>
              <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
                Optimize your supply chain costs by partnering with verified co-shippers.
                Find matches for your route and split logistics overhead instantly.
              </p>
            </section>

            {/* User List */}
            <div className="space-y-6">

              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-surface-container-lowest p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-6 hover:-translate-y-1 transition-transform duration-300"
                >
                  {/* Avatar + Info */}
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-headline font-bold
                          ${user.id === 1
                            ? 'kinetic-gradient text-white'
                            : 'bg-surface-container-high text-primary'
                          }`}
                      >
                        {user.initials}
                      </div>
                      {/* Online Dot */}
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white
                          ${user.online ? 'bg-secondary' : 'bg-slate-300'}`}
                      ></div>
                    </div>

                    <div>
                      <h3 className="font-headline font-bold text-lg text-primary">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span>{user.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Space Info */}
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <span className="text-xs uppercase tracking-wider font-medium text-slate-400">
                      Inventory Space
                    </span>
                    <span className="font-headline font-bold text-primary">
                      {user.space}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button className="px-6 py-2.5 outline outline-1 outline-outline/20 text-primary font-label font-bold rounded-lg hover:bg-surface-container-high transition-colors">
                      Chat
                    </button>
                    <button className="px-6 py-2.5 kinetic-gradient text-white font-label font-bold rounded-lg shadow hover:scale-95 active:scale-90 transition-transform">
                      Connect
                    </button>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Right - Chat Drawer */}
          <aside className="lg:col-span-4 flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-surface-container-low rounded-lg overflow-hidden shadow">

            {/* Chat Header */}
            <div className="p-6 bg-surface-container-lowest flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full kinetic-gradient flex items-center justify-center text-white text-xs font-bold">
                  AS
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-primary">User #A421</p>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">
                    Online Now
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`p-4 rounded-2xl max-w-[85%]
                      ${msg.from === 'me'
                        ? 'kinetic-gradient text-white rounded-tr-none'
                        : 'bg-surface-container-high text-primary rounded-tl-none'
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-2 block font-medium
                        ${msg.from === 'me' ? 'text-white/60' : 'text-slate-400'}`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-surface-container-lowest">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="w-full bg-surface-container-high border-none rounded-full px-6 py-3 pr-12 text-sm focus:ring-2 focus:ring-secondary/20 focus:bg-surface-container-lowest transition-all outline-none"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 p-2 text-secondary hover:scale-110 transition-transform"
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    send
                  </span>
                </button>
              </div>

              {/* Firebase Sync */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sync encrypted via Firebase
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
              </div>
            </div>

          </aside>

        </div>
      </main>

      {/* FAB Button */}
      <button className="fixed bottom-8 right-8 kinetic-gradient w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-90 transition-transform z-40">
        <span className="material-symbols-outlined text-2xl">person_add</span>
      </button>

      <Footer />
    </div>
  )
}

export default Connections