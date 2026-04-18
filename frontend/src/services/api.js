const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const mockUsers = [
  {
    id: 1,
    initials: 'AS',
    name: 'User #A421',
    location: 'Rotterdam Port',
    space: '12 TEUs available',
    online: true
  },
  {
    id: 2,
    initials: 'MK',
    name: 'User #B882',
    location: 'Singapore Hub',
    space: '45 LCL units',
    online: true
  },
  {
    id: 3,
    initials: 'LV',
    name: 'User #X009',
    location: 'Long Beach Terminal',
    space: '2.5 Tons Payload',
    online: false
  }
]

const mockMarkets = [
  {
    id: 1,
    name: 'Pune APMC',
    price: 4800,
    trend: '+12.4%',
    status: 'unfair',
    statusLabel: 'Unfair/Avoid',
    trendDirection: 'up',
    insight: 'Vertex AI predicts a sharp price correction in 48 hours due to incoming surplus stock from northern districts.'
  },
  {
    id: 2,
    name: 'Mumbai Central',
    price: 5100,
    trend: 'Stable',
    status: 'high',
    statusLabel: 'Slightly High',
    trendDirection: 'flat',
    insight: 'Artificial scarcity detected in local warehouses. BigQuery cross-referencing suggests holding off transactions.'
  },
  {
    id: 3,
    name: 'Nashik Agri Hub',
    price: 4200,
    trend: '-8.2%',
    status: 'best',
    statusLabel: 'Best Deal',
    trendDirection: 'down',
    insight: 'Competitive pricing with consistent supply chain. Recommended for execution.'
  }
]

const mockRoutes = [
  {
    id: 1,
    name: 'Highway Express',
    distance: 342,
    time: '6.5h',
    cost: 4200,
    recommended: true
  },
  {
    id: 2,
    name: 'Mountain Path',
    distance: 289,
    time: '8.2h',
    cost: 5100,
    recommended: false
  },
  {
    id: 3,
    name: 'Rural Bypass',
    distance: 412,
    time: '7.1h',
    cost: 4850,
    recommended: false
  }
]

const mockJourneySteps = [
  {
    id: 1,
    name: 'Request Submitted',
    status: 'completed',
    timestamp: '10:45 AM, Oct 24'
  },
  {
    id: 2,
    name: 'Routes Calculated',
    status: 'completed',
    timestamp: '10:48 AM, Oct 24'
  },
  {
    id: 3,
    name: 'Market Prices Analyzed',
    status: 'completed',
    timestamp: '11:02 AM, Oct 24'
  },
  {
    id: 4,
    name: 'Users Matched',
    status: 'active',
    timestamp: 'IN PROGRESS'
  },
  {
    id: 5,
    name: 'Final Decision Ready',
    status: 'pending',
    timestamp: 'PENDING'
  }
]

export async function processRequest(formData) {
  await delay(1500)
  return {
    success: true,
    data: {
      request: formData,
      markets: mockMarkets,
      routes: mockRoutes,
      bestMarket: mockMarkets[2],
      bestRoute: mockRoutes[0],
      savings: {
        standardCost: 4200,
        networkSavings: 2800,
        yourShare: 1400,
        coShippers: 3
      },
      journey: mockJourneySteps
    }
  }
}

export async function getMarkets() {
  await delay(800)
  return {
    success: true,
    data: mockMarkets
  }
}

export async function getRoutes() {
  await delay(1000)
  return {
    success: true,
    data: mockRoutes
  }
}

export async function getJourneyStatus() {
  await delay(600)
  return {
    success: true,
    data: {
      steps: mockJourneySteps,
      stats: {
        confidenceScore: 98.4,
        activeNodes: 124,
        estimatedWait: '2 mins'
      }
    }
  }
}

export async function getCoShippers() {
  await delay(500)
  return {
    success: true,
    data: mockUsers
  }
}

export async function sendMessage(message) {
  await delay(300)
  return {
    success: true,
    data: {
      id: Date.now(),
      from: 'me',
      text: message.text,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      sent: true
    }
  }
}

export async function connectWithUser(userId) {
  await delay(1000)
  const user = mockUsers.find(u => u.id === userId)
  return {
    success: true,
    data: {
      connected: true,
      user: user,
      message: `Successfully connected with ${user.name}`
    }
  }
}