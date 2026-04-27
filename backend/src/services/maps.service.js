import axios from 'axios'

function formatDuration(seconds) {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function estimateCost(distanceKm, quantityTons = 1) {
  const basePerKm = 12
  const weightFactor = 0.02
  const cost = distanceKm * basePerKm + distanceKm * weightFactor * Number(quantityTons || 1)
  return Math.round(cost)
}

export async function getRouteOptions({ origin, destination, quantity }) {
  // ✅ Debug log: confirms this function is being called
  console.log('[Maps] getRouteOptions called:', { origin, destination, quantity })

  const key = process.env.GOOGLE_MAPS_KEY
  if (!key) {
    console.log('[Maps] GOOGLE_MAPS_KEY is missing') // ✅ debug
    throw new Error('GOOGLE_MAPS_KEY missing in backend .env')
  }

  const url = 'https://maps.googleapis.com/maps/api/directions/json'

  // ✅ Debug log: confirms request is about to be made
  console.log('[Maps] Calling Directions API...')

  const res = await axios.get(url, {
    params: {
      origin,
      destination,
      alternatives: true,
      key,
    },
    timeout: 12000,
  })

  const data = res.data

  // ✅ Debug logs: shows Google status + how many routes
  console.log('[Maps] Google Maps status:', data.status)
  console.log('[Maps] Routes returned:', data.routes?.length)
  if (data.error_message) console.log('[Maps] error_message:', data.error_message)

  if (data.status !== 'OK') {
    throw new Error(`Directions API error: ${data.status} ${data.error_message || ''}`.trim())
  }

  const routes = (data.routes || []).slice(0, 3)

  const mapped = routes.map((r, idx) => {
    const leg = r.legs?.[0]
    const distanceMeters = leg?.distance?.value ?? 0
    const durationSeconds = leg?.duration?.value ?? 0
    const distanceKm = Math.max(1, Math.round(distanceMeters / 1000))

    return {
      id: idx + 1,
      name: r.summary ? r.summary : `Route Option ${idx + 1}`,
      distance: distanceKm,
      time: formatDuration(durationSeconds),
      cost: estimateCost(distanceKm, quantity),
      recommended: false,
    }
  })

  // ✅ Debug log: show final mapped output
  console.log('[Maps] Mapped routes:', mapped)

  // pick recommended = lowest cost
  let bestIndex = 0
  for (let i = 1; i < mapped.length; i++) {
    if (mapped[i].cost < mapped[bestIndex].cost) bestIndex = i
  }
  if (mapped[bestIndex]) mapped[bestIndex].recommended = true

  console.log('[Maps] Recommended route:', mapped[bestIndex])

  

  return mapped

  
}