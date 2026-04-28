import { useEffect } from 'react'
import { db } from '../firebase'
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

/**
 * Writes the user's online status to Firestore on mount
 * and marks them offline when the tab is closed or hidden.
 */
export function usePresence() {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) return
    const ref = doc(db, 'presence', currentUser.uid)

    const markOnline  = () => setDoc(ref, { uid: currentUser.uid, name: currentUser.displayName || 'Unknown', photoURL: currentUser.photoURL || '', online: true,  lastSeen: serverTimestamp() }, { merge: true })
    const markOffline = () => setDoc(ref, { online: false, lastSeen: serverTimestamp() }, { merge: true })

    markOnline()

    const onVisibility = () => document.hidden ? markOffline() : markOnline()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('beforeunload', markOffline)

    return () => {
      markOffline()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('beforeunload', markOffline)
    }
  }, [currentUser])
}
