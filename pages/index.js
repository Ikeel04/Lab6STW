import SeriesPage from './SeriesPage.js'
import CreateSeriesPage from './CreateSeriesPage.js'
import EditSeriesPage from './EditSeriesPage.js'
import render from '../utils/render.js'

// Select the root element
const root = document.getElementById('root')

// Initialize the global currentPage variable
window.currentPage = { page: SeriesPage, params: null }

// Define the navigate function
window.navigate = (path) => {
  // Split the path into parts (e.g., "edit/1" -> ["edit", "1"])
  const [pageName, id] = path.split('/')

  // Determine the page to render based on the path
  let page
  let params = null

  if (pageName === 'create') {
    page = CreateSeriesPage
  } else if (pageName === 'edit') {
    page = EditSeriesPage
    params = id // Pass the series ID as a parameter
  } else {
    page = SeriesPage
  }

  // Update the current page
  window.currentPage = { page, params }

  // Re-render the app
  render(root, window.currentPage)
}

// Export the current page for the initial render
export const getCurrentPage = () => window.currentPage

