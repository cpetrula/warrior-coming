// In-memory storage for sermons (in production, use a proper database)
let sermons = []
let nextId = 1

export const sermonModel = {
  // Get all sermons sorted by order
  getAll() {
    return sermons.sort((a, b) => a.order - b.order)
  },

  // Get sermon by ID
  getById(id) {
    return sermons.find(s => s.id === id)
  },

  // Create new sermon
  create(sermonData) {
    const sermon = {
      id: String(nextId++),
      ...sermonData,
      order: sermons.length,
      createdAt: new Date().toISOString()
    }
    sermons.push(sermon)
    return sermon
  },

  // Update sermon order
  updateOrder(sermonIds) {
    sermonIds.forEach((id, index) => {
      const sermon = sermons.find(s => s.id === id)
      if (sermon) {
        sermon.order = index
      }
    })
  },

  // Delete sermon
  delete(id) {
    const sermonIndex = sermons.findIndex(s => s.id === id)
    if (sermonIndex === -1) {
      return null
    }
    const sermon = sermons[sermonIndex]
    sermons.splice(sermonIndex, 1)
    return sermon
  }
}