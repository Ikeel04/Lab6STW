import BASE_URL from './BASE_URL.js'

const createSeries = async (seriesData) => {
  const response = await fetch(`${BASE_URL}/series`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(seriesData),
  })

  if (!response.ok) {
    throw new Error('Failed to create series')
  }

  return await response.json()
}

export default createSeries

