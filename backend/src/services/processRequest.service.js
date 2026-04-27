import { getRouteOptions } from './maps.service.js'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function makeId() {
  return `req_${Date.now()}_${Math.floor(Math.random() * 10000)}`
}

export async function buildProcessRequestResult(formData) {
  await delay(300)

  // --- Markets stay mocked for now (AI later) ---
  const markets = [
    {
      id: 1,
      name: 'Pune APMC',
      price: 4800,
      trend: '+12.4%',
      status: 'unfair',
      statusLabel: 'Unfair/Avoid',
      trendDirection: 'up',
      insight:
        'Vertex AI predicts a sharp price correction in 48 hours due to incoming surplus stock from northern districts.',
    },
    {
      id: 2,
      name: 'Mumbai Central',
      price: 5100,
      trend: 'Stable',
      status: 'high',
      statusLabel: 'Slightly High',
      trendDirection: 'flat',
      insight:
        'Artificial scarcity detected in local warehouses. BigQuery cross-referencing suggests holding off transactions.',
    },
    {
      id: 3,
      name: 'Nashik Agri Hub',
      price: 4200,
      trend: '-8.2%',
      status: 'best',
      statusLabel: 'Best Deal',
      trendDirection: 'down',
      insight: 'Competitive pricing with consistent supply chain. Recommended for execution.',
    },
  ]

  // --- ✅ REAL Routes from Google Maps ---
  let routes = []
  try {
    routes = await getRouteOptions({
      origin: formData.source,
      destination: formData.destination,
      quantity: formData.quantity,
    })
  } catch (err) {
    // Fallback so frontend still works even if Google fails
    routes = [
      { id: 1, name: 'Fallback Express', distance: 342, time: '6.5h', cost: 4200, recommended: true },
      { id: 2, name: 'Fallback Scenic', distance: 289, time: '8.2h', cost: 5100, recommended: false },
      { id: 3, name: 'Fallback Bypass', distance: 412, time: '7.1h', cost: 4850, recommended: false },
    ]
  }

  const journey = [
    { id: 1, name: 'Request Submitted', status: 'completed', timestamp: '10:45 AM, Oct 24' },
    { id: 2, name: 'Routes Calculated', status: 'completed', timestamp: '10:48 AM, Oct 24' },
    { id: 3, name: 'Market Prices Analyzed', status: 'completed', timestamp: '11:02 AM, Oct 24' },
    { id: 4, name: 'Users Matched', status: 'active', timestamp: 'IN PROGRESS' },
    { id: 5, name: 'Final Decision Ready', status: 'pending', timestamp: 'PENDING' },
  ]

  const savings = {
    standardCost: routes?.[0]?.cost ?? 4200,
    networkSavings: 2800,
    yourShare: 1400,
    coShippers: 3,
  }

  const requestId = makeId()

  return {
    requestId,
    request: formData,
    markets,
    routes,
    bestMarket: markets.find((m) => m.status === 'best') || markets[0],
    bestRoute: routes.find((r) => r.recommended) || routes[0],
    savings,
    journey,
  }
}