const Filters = ({ filters, onFilterChange }) => {
  // Create a container for the filters
  const container = document.createElement('div')
  container.classList.add('filters')

  // Debouncing logic for the text input
  let debounceTimeout
  const handleSearchChange = (event) => {
    const value = event.target.value

    // Clear the previous timeout
    clearTimeout(debounceTimeout)

    // Set a new timeout to delay the filter update
    debounceTimeout = setTimeout(() => {
      onFilterChange({ search: value })
    }, 300) // 300ms debounce delay
  }

  // Create the text input for search
  const searchInput = document.createElement('input')
  searchInput.type = 'text'
  searchInput.placeholder = 'Search by title...'
  searchInput.value = filters.search || ''
  searchInput.addEventListener('input', handleSearchChange)
  searchInput.classList.add('filter-search')
  container.appendChild(searchInput)

  // Create the dropdown for status
  const statusDropdown = document.createElement('select')
  statusDropdown.classList.add('filter-status')
  const statuses = ['All', 'Plan to Watch', 'Watching', 'Dropped', 'Completed']
  statuses.forEach((status) => {
    const option = document.createElement('option')
    option.value = status === 'All' ? '' : status
    option.textContent = status
    statusDropdown.appendChild(option)
  })
  statusDropdown.value = filters.status || ''
  statusDropdown.addEventListener('change', (event) => {
    onFilterChange({ status: event.target.value })
  })
  container.appendChild(statusDropdown)

  // Create the dropdown for sort
  const sortDropdown = document.createElement('select')
  sortDropdown.classList.add('filter-sort')
  const sortOptions = ['asc', 'desc']
  sortOptions.forEach((sort) => {
    const option = document.createElement('option')
    option.value = sort
    option.textContent = sort === 'asc' ? 'Ascending' : sort === 'desc' ? 'Descending' : 'None'
    sortDropdown.appendChild(option)
  })
  sortDropdown.value = filters.sort || 'desc'
  sortDropdown.addEventListener('change', (event) => {
    onFilterChange({ sort: event.target.value })
  })
  container.appendChild(sortDropdown)

  return container
}

export default Filters

