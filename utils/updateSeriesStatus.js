import BASE_URL from './BASE_URL.js'

const updateSeriesStatus = async (id, status) => {
  const url = `${BASE_URL}/series/${id}/status`

  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(`Error updating series status: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to update series status:', error)
    throw error
  }
}

export default updateSeriesStatus

