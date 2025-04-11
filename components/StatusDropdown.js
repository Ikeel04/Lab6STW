import updateSeriesStatus from '../utils/updateSeriesStatus.js'

const StatusDropdown = ({ status, seriesId, reRenderTable }) => {
  const dropdown = document.createElement('select')
  dropdown.classList.add('status-dropdown')

  const statuses = ['Plan to Watch', 'Watching', 'Dropped', 'Completed']
  statuses.forEach((optionStatus) => {
    const option = document.createElement('option')
    option.value = optionStatus
    option.textContent = optionStatus
    if (optionStatus === status) {
      option.selected = true
    }
    dropdown.appendChild(option)
  })

  dropdown.addEventListener('change', async (event) => {
    try {
      await updateSeriesStatus(seriesId, event.target.value)
      console.log(`Status updated to: ${event.target.value}`)
      reRenderTable() // Trigger table re-render
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  })

  return dropdown
}

export default StatusDropdown

