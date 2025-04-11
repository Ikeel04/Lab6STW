import BASE_URL from './BASE_URL.js'

const getSeriesById = async (id) => {
  const response = await fetch(`${BASE_URL}/series/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch series')
  }

  return await response.json()
}

export default getSeriesById

