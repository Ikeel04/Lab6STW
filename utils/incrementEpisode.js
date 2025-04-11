import BASE_URL from './BASE_URL.js'

const incrementEpisode = async (id) => {
  const url = `${BASE_URL}/series/${id}/episode`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
    })

    if (!response.ok) {
      throw new Error(`Error incrementing episode: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to increment episode:', error)
    throw error
  }
}

export default incrementEpisode

