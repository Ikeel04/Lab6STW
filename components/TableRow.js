import StatusDropdown from './StatusDropdown.js'
import EpisodeTracker from './EpisodeTracker.js'
import RankingControls from './RankingControls.js'
import deleteSeries from '../utils/deleteSeries.js'

const TableRow = ({ series, sortOrder, reRenderTable }) => {
  const row = document.createElement('tr')

  // Ranking (first column)
  const rankingCell = document.createElement('td')
  const rankingControls = RankingControls({
    ranking: series.ranking,
    sortOrder,
    reRenderTable,
    seriesId: series.id,
  })
  rankingCell.appendChild(rankingControls)
  row.appendChild(rankingCell)

  // Title
  const titleCell = document.createElement('td')
  titleCell.textContent = series.title
  titleCell.classList.add('title-cell') // Add a class for potential styling
  const titleIcon = document.createElement('img')
  titleIcon.src = '/static/pen.svg'
  titleCell.appendChild(titleIcon)
  titleCell.addEventListener('click', () => {
    // Navigate to the edit page for this series
    window.navigate(`edit/${series.id}`)
  })
  row.appendChild(titleCell)

  // Status (editable dropdown)
  const statusCell = document.createElement('td')
  const statusDropdown = StatusDropdown({
    status: series.status,
    seriesId: series.id,
    reRenderTable,
  })
  statusCell.appendChild(statusDropdown)
  row.appendChild(statusCell)

  // Episodes (tracker)
  const episodesCell = document.createElement('td')
  const episodeTracker = EpisodeTracker({
    lastEpisodeWatched: series.lastEpisodeWatched,
    totalEpisodes: series.totalEpisodes,
    seriesId: series.id,
    reRenderTable,
  })
  episodesCell.appendChild(episodeTracker)
  row.appendChild(episodesCell)

  // Delete button
  const deleteCell = document.createElement('td')
  const deleteButton = document.createElement('button')
  const imgDelete = document.createElement('img')
  imgDelete.src = '/static/trash.svg'
  deleteButton.appendChild(imgDelete)

  deleteButton.classList.add('delete-button')
  deleteButton.addEventListener('click', async () => {
    const confirmed = confirm(`Are you sure you want to delete "${series.title}"?`)
    if (confirmed) {
      try {
        await deleteSeries(series.id)
        console.log(`Series "${series.title}" deleted successfully`)
        reRenderTable() // Trigger table re-render
      } catch (error) {
        console.error('Failed to delete series:', error)
      }
    }
  })
  deleteCell.appendChild(deleteButton)
  row.appendChild(deleteCell)

  return row
}

export default TableRow

