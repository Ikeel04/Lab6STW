import BASE_URL from './BASE_URL.js'

const updateSeries = async (id, seriesData) => {
  const response = await fetch(`${BASE_URL}/series/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(seriesData),
  })

  if (!response.ok) {
    throw new Error('Failed to update series')
  }

  return await response.json()
}

export default updateSeries

