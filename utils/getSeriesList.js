import BASE_URL from './BASE_URL.js'

// Function to fetch the series list
const getSeriesList = async (queryParams = {}) => {
  // Construct query parameters
  const params = new URLSearchParams(queryParams)

  // Build the full URL
  const url = `${BASE_URL}/series?${params.toString()}`

  try {
    // Make the GET request
    const response = await fetch(url)

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Error fetching series: ${response.statusText}`)
    }

    // Parse and return the JSON response
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch series list:', error)
    throw error
  }
}

export default getSeriesList

