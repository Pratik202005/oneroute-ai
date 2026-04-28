import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageBackground from '../components/PageBackground'
import { db } from '../firebase'
import {
  collection, addDoc, onSnapshot, query,
  serverTimestamp, where, doc, updateDoc, getDoc
} from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

// ── Per-user online indicator ─────────────────────────────────────────────────
function OnlineDot({ uid }) {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    if (!uid) return
    const ref = doc(db, 'presence', uid)
    const unsub = onSnapshot(ref, snap => {
      setOnline(snap.exists() && snap.data().online === true)
    })
    return unsub
  }, [uid])

  return (
    <span
      title={online ? 'Online' : 'Offline'}
      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-[#0b1f2a] transition-colors duration-500 ${
        online ? 'bg-[#14B8A6]' : 'bg-white/30'
      }`}
    />
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
function Connections() {
  const location = useLocation()
  const journeyIdFromState = location.state?.journeyId

  const { currentUser } = useAuth()
  const [activeJourney, setActiveJourney] = useState(null)
  const [matchedUsers, setMatchedUsers] = useState([])
  const [allJourneys, setAllJourneys] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatOpen, setChatOpen] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [endingJourney, setEndingJourney] = useState(false)
  const messagesEndRef = useRef(null)

  // ── 1. Current user's active journey ────────────────────────────────────────
  useEffect(() => {
    if (!currentUser) return

    // If a specific journeyId was passed (from history selection), load it directly
    if (journeyIdFromState) {
      const journeyRef = doc(db, 'journeys', journeyIdFromState)
      getDoc(journeyRef).then(snap => {
        if (snap.exists()) {
          setActiveJourney({ id: snap.id, ...snap.data() })
        }
      }).catch(err => console.error('[Journey] Load error:', err))
      return
    }

    // Default: find the latest active journey
    const q = query(
      collection(db, 'journeys'),
      where('uid', '==', currentUser.uid),
      where('status', '==', 'active')
    )
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
        setActiveJourney(docs[0])
      } else {
        setActiveJourney(null)
      }
    }, err => console.error('[Journey]', err.code, err.message))
    return unsub
  }, [currentUser, journeyIdFromState])

  // ── 2. All active journeys for debug panel ───────────────────────────────────
  useEffect(() => {
    if (!showDebug) return
    const q = query(collection(db, 'journeys'), where('status', '==', 'active'))
    const unsub = onSnapshot(q, snap => {
      setAllJourneys(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return unsub
  }, [showDebug])

  // ── 3. Route-matched users ───────────────────────────────────────────────────
  useEffect(() => {
    if (!activeJourney || !currentUser) return
    const normSrc  = activeJourney.normalizedSource  || activeJourney.request.source.toLowerCase().trim()
    const normDest = activeJourney.normalizedDestination || activeJourney.request.destination.toLowerCase().trim()

    const q = query(collection(db, 'journeys'), where('status', '==', 'active'))
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      const others = all.filter(j => {
        if (!testMode && j.uid === currentUser.uid) return false
        const jSrc  = j.normalizedSource  || j.request?.source?.toLowerCase().trim()
        const jDest = j.normalizedDestination || j.request?.destination?.toLowerCase().trim()
        return jSrc === normSrc && jDest === normDest
      })
      const userMap = {}
      others.forEach(j => {
        if (!userMap[j.uid] || (j.createdAt?.toMillis() || 0) > (userMap[j.uid].createdAt?.toMillis() || 0)) {
          userMap[j.uid] = j
        }
      })
      setMatchedUsers(Object.values(userMap))
    }, err => console.error('[Match]', err.code, err.message))
    return unsub
  }, [activeJourney, currentUser, testMode])

  // ── 4. Real-time room messages ───────────────────────────────────────────────
  useEffect(() => {
    if (!activeJourney) return
    const roomId = getRoomId(activeJourney)
    const q = query(collection(db, 'messages'), where('roomId', '==', roomId))
    const unsub = onSnapshot(q, snap => {
      const msgs = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        time: d.data().createdAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '...'
      }))
      msgs.sort((a, b) => (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0))
      setMessages(msgs)
    }, err => console.error('[Chat]', err.code, err.message))
    return unsub
  }, [activeJourney])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function getRoomId(journey) {
    const src  = journey.normalizedSource  || journey.request.source.toLowerCase().trim()
    const dest = journey.normalizedDestination || journey.request.destination.toLowerCase().trim()
    return `${src.replace(/\s+/g, '_')}_${dest.replace(/\s+/g, '_')}`.toLowerCase()
  }

  // ── 5. Send message ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!message.trim() || !currentUser || !activeJourney) return
    const roomId = getRoomId(activeJourney)
    const txt = message
    setMessage('')
    try {
      await addDoc(collection(db, 'messages'), {
        roomId, text: txt, uid: currentUser.uid,
        name: currentUser.displayName || 'Unknown',
        photoURL: currentUser.photoURL || '',
        createdAt: serverTimestamp()
      })
    } catch (e) {
      console.error('[Chat] Send failed:', e.code, e.message)
      toast.error('Send failed: ' + e.message)
    }
  }

  // ── 6. End Journey ───────────────────────────────────────────────────────────
  const handleEndJourney = async () => {
    if (!activeJourney || endingJourney) return
    const confirmed = window.confirm('Are you sure you want to end this journey? You will no longer appear in the Connections list for this route.')
    if (!confirmed) return
    setEndingJourney(true)
    try {
      const journeyRef = doc(db, 'journeys', activeJourney.id)
      await updateDoc(journeyRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      })
      toast.success('Journey ended. You have been removed from the route.')
    } catch (e) {
      console.error('[Journey] End failed:', e.code, e.message)
      toast.error('Failed to end journey: ' + e.message)
    } finally {
      setEndingJourney(false)
    }
  }

  // ── No active journey screen ─────────────────────────────────────────────────
  if (!activeJourney) {
    return (
      <div className="min-h-screen text-white font-body relative">
        <PageBackground /><Navbar />
        <main className="pt-40 px-4 text-center">
          <div className="max-w-md mx-auto p-10 rounded-3xl border border-white/12 bg-white/8 backdrop-blur-2xl space-y-4">
            <span className="material-symbols-outlined text-6xl text-[#14B8A6]">route</span>
            <h2 className="text-2xl font-black">No Active Journey</h2>
            <p className="text-white/60 text-sm">Submit a route on the dashboard to see co-shippers.</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full py-4 kinetic-gradient rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const roomId = getRoomId(activeJourney)

  return (
    <div className="min-h-screen text-white font-body relative selection:bg-white/10">
      <PageBackground /><Navbar />

      <main className="pt-28 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto pb-24">

        {/* ── Top Bar ── */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 px-5 backdrop-blur-md">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-ping flex-shrink-0" />
            <span className="text-xs font-black uppercase tracking-widest text-[#14B8A6]">
              Live Room: {activeJourney.request.source} → {activeJourney.request.destination}
            </span>
            <span className="text-[10px] text-white/30 font-mono hidden sm:inline">[{roomId}]</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDebug(!showDebug)}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all"
            >
              {showDebug ? 'Close Debug' : 'Debug'}
            </button>
            <button
              onClick={handleEndJourney}
              disabled={endingJourney}
              className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-400/20 text-red-300 text-xs font-black uppercase tracking-widest hover:bg-red-500/25 active:scale-95 transition-all disabled:opacity-50"
            >
              {endingJourney ? 'Ending...' : '⏹ End Journey'}
            </button>
          </div>
        </div>

        {/* ── Debug Panel ── */}
        {showDebug && (
          <div className="mb-8 p-6 rounded-3xl border border-[#14B8A6]/30 bg-black/40 backdrop-blur-3xl space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                <p className="text-[#14B8A6] font-bold uppercase mb-2">My Session</p>
                <p><span className="opacity-50">User:</span> {currentUser?.displayName}</p>
                <p><span className="opacity-50">UID:</span> {currentUser?.uid?.slice(0, 12)}...</p>
                <p><span className="opacity-50">Normalized:</span> {activeJourney.normalizedSource} → {activeJourney.normalizedDestination}</p>
                <p><span className="opacity-50">Room:</span> {roomId}</p>
                <p><span className="opacity-50">Messages:</span> {messages.length}</p>
                <div className="pt-2">
                  <button
                    onClick={() => setTestMode(!testMode)}
                    className={`px-3 py-1 rounded-full border text-[10px] transition-all ${testMode ? 'bg-[#14B8A6] border-[#14B8A6]' : 'border-white/20 text-white/50'}`}
                  >
                    Test Mode: {testMode ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-[#14B8A6] font-bold uppercase mb-2">All Active Journeys ({allJourneys.length})</p>
                <div className="max-h-36 overflow-y-auto space-y-1">
                  {allJourneys.map(j => (
                    <div key={j.id} className="flex justify-between text-[10px] py-0.5 border-b border-white/5">
                      <span className="text-white/60 truncate w-24">{j.userName}</span>
                      <span className="text-[#14B8A6]">{j.normalizedSource} → {j.normalizedDestination}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          {/* ── Left: Matched Users ── */}
          <div className="lg:col-span-8">
            <h1 className="font-headline font-extrabold text-4xl sm:text-5xl mb-2 leading-tight">
              Matched <span className="text-[#14B8A6]">Co-Shippers</span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg mb-10">
              {matchedUsers.length} shipper{matchedUsers.length !== 1 ? 's' : ''} on the{' '}
              <span className="text-white font-bold">{activeJourney.request.source} → {activeJourney.request.destination}</span> corridor.
            </p>

            <div className="space-y-5">
              {matchedUsers.length > 0 ? matchedUsers.map(user => (
                <div
                  key={user.id}
                  className="p-5 sm:p-7 rounded-3xl border border-white/12 bg-white/5 backdrop-blur-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:bg-white/8 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    {/* Avatar + online dot */}
                    <div className="relative flex-shrink-0">
                      {user.userPhoto
                        ? <img src={user.userPhoto} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white/10 p-0.5" alt={user.userName} />
                        : (
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center text-2xl font-black text-[#14B8A6]">
                            {user.userName?.charAt(0)}
                          </div>
                        )
                      }
                      <OnlineDot uid={user.uid} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline font-extrabold text-lg sm:text-xl text-white">
                          {user.userName}
                        </h3>
                        {user.uid === currentUser.uid && (
                          <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded font-black uppercase">YOU</span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                        {user.request.product} · {user.request.quantity} Tons
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setChatOpen(true)}
                    className="w-full sm:w-auto px-7 py-3 kinetic-gradient text-white font-black rounded-xl text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Open Chat
                  </button>
                </div>
              )) : (
                <div className="p-16 sm:p-20 rounded-[40px] border border-dashed border-white/10 bg-white/[0.01] text-center flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-6xl text-white/10">group_search</span>
                  <p className="text-white/30 italic text-sm">No co-shippers found on this route yet.</p>
                  <p className="text-white/15 text-xs">Ask a partner to submit the same route to connect.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Chat Panel ── */}
          <aside
            className={`lg:col-span-4 flex flex-col h-[600px] lg:h-[calc(100vh-14rem)] rounded-[32px] overflow-hidden border border-white/12 bg-black/40 backdrop-blur-3xl shadow-2xl
              ${chatOpen ? 'fixed inset-0 z-50 m-4 rounded-3xl lg:relative lg:inset-auto lg:z-0 lg:m-0' : 'hidden lg:flex'}`}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#14B8A6]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#14B8A6] text-lg">sensors</span>
                </div>
                <div>
                  <p className="font-black text-[10px] text-white/40 uppercase tracking-widest">Route Corridor Chat</p>
                  <p className="text-xs font-black text-white">
                    {activeJourney.request.source} ⇌ {activeJourney.request.destination}
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="lg:hidden text-white/40 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center opacity-40">
                  <span className="material-symbols-outlined text-4xl">chat_bubble_outline</span>
                  <p className="text-xs italic">No messages yet. Start the conversation!</p>
                </div>
              )}
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.uid === currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 items-end max-w-[85%] ${msg.uid === currentUser?.uid ? 'flex-row-reverse' : ''}`}>
                    {msg.uid !== currentUser?.uid && (
                      <img
                        src={msg.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.name)}&background=14B8A6&color=fff&size=32`}
                        className="w-7 h-7 rounded-full border border-white/10 flex-shrink-0"
                        alt={msg.name}
                      />
                    )}
                    <div className={`p-3 rounded-2xl border text-sm leading-relaxed ${
                      msg.uid === currentUser?.uid
                        ? 'kinetic-gradient text-white rounded-br-none border-white/10'
                        : 'bg-white/10 text-white rounded-bl-none border-white/12'
                    }`}>
                      {msg.uid !== currentUser?.uid && (
                        <p className="text-[10px] font-black text-[#14B8A6] uppercase mb-1">{msg.name}</p>
                      )}
                      <p>{msg.text}</p>
                      <p className="text-[9px] opacity-30 mt-1 text-right">{msg.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#14B8A6]/40 transition-all placeholder:text-white/30"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#14B8A6] hover:bg-[#0f9d8b] text-white p-3.5 rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Connections