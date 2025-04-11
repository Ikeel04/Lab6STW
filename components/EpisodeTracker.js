import incrementEpisode from '../utils/incrementEpisode.js'

const EpisodeTracker = ({ lastEpisodeWatched, totalEpisodes, seriesId, reRenderTable }) => {
  const container = document.createElement('div')
  container.classList.add('episode-tracker')

  // Display the episode progress
  const progress = document.createElement('span')
  progress.textContent = `${lastEpisodeWatched}/${totalEpisodes}`
  container.appendChild(progress)

  // Create the +1 button
  const incrementButton = document.createElement('button')
  const incrementImage = document.createElement('img')
  incrementImage.src = '/static/plus.svg'
  incrementButton.appendChild(incrementImage)
  incrementButton.disabled = lastEpisodeWatched >= totalEpisodes
  incrementButton.addEventListener('click', async () => {
    try {
      await incrementEpisode(seriesId)
      console.log('Episode incremented')
      reRenderTable() // Trigger table re-render
    } catch (error) {
      console.error('Failed to increment episode:', error)
    }
  })
  container.appendChild(incrementButton)

  return container
}

export default EpisodeTracker

