import getSeriesList from '../utils/getSeriesList.js'
import Filters from '../components/Filters.js'
import Table from '../components/Table.js'

const SeriesPage = (parentElement) => {
  // State-like variables to hold series data and filters
  let series = []
  let filters = {
    search: '',
    status: '',
    sort: '',
  }

  // Function to fetch series data based on current filters
  const fetchSeries = async () => {
    try {
      // Fetch series using the current filters
      series = await getSeriesList(filters)

      // Re-render just the table with the updated series
      renderTable()
    } catch (error) {
      console.error('Error fetching series:', error)
    }
  }

  // Callback to handle filter changes
  const handleFilterChange = (newFilters) => {
    // Update the filters object with the new values
    filters = { ...filters, ...newFilters }

    // Fetch the series again with the updated filters
    fetchSeries()
  }

  // Function to render the table
  const renderTable = () => {
    // Find the table container
    const tableContainer = parentElement.querySelector('.table-container')

    // Clear the table container
    tableContainer.innerHTML = ''

    // Create and append the Table component
    const tableComponent = Table({ data: series, reRenderTable: fetchSeries })
    tableContainer.appendChild(tableComponent)
  }

  // Render function to create the page structure
  const render = () => {
    // Clear the parent element
    parentElement.innerHTML = ''

    // Create a container for the page
    const container = document.createElement('div')
    container.classList.add('series-page')

    // Add "Add New" button
    const addNewButton = document.createElement('button')
    addNewButton.textContent = 'Add New'
    addNewButton.classList.add('add-new-button') // Add a class for potential styling
    const addNewLogo = document.createElement('img')
    addNewLogo.src = './static/add.svg'
    addNewButton.append(addNewLogo)
    addNewButton.append()
    addNewButton.addEventListener('click', () => {
      // Navigate to the CreateSeriesPage
      window.navigate('create')
    })
    container.appendChild(addNewButton)

    // Create and append the Filters component
    const filtersComponent = Filters({
      filters,
      onFilterChange: handleFilterChange,
    })
    container.appendChild(filtersComponent)

    // Create a container for the table
    const tableContainer = document.createElement('div')
    tableContainer.classList.add('table-container')
    container.appendChild(tableContainer)

    // Append the container to the parent element
    parentElement.appendChild(container)

    // Initial render of the table
    renderTable()
  }

  // Initial fetch and render
  fetchSeries()

  return {
    render,
  }
}

export default SeriesPage

