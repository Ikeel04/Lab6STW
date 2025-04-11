import BASE_URL from './BASE_URL.js'

const updateRanking = async (id, direction) => {
  if (direction !== 'upvote' && direction !== 'downvote') {
    throw new Error('Invalid direction. Use "upvote" or "downvote".')
  }

  const url = `${BASE_URL}/series/${id}/${direction}`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
    })

    if (!response.ok) {
      throw new Error(`Error updating ranking: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to update ranking:', error)
    throw error
  }
}

export default updateRanking

