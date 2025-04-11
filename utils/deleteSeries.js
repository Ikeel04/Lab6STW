import BASE_URL from './BASE_URL.js'

const deleteSeries = async (id) => {
  const url = `${BASE_URL}/series/${id}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Error deleting series: ${response.statusText}`)
    }

    return true // Return true to indicate success
  } catch (error) {
    console.error('Failed to delete series:', error)
    throw error
  }
}

export default deleteSeries

