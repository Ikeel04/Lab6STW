import updateRanking from '../utils/updateRanking.js'

const RankingControls = ({ ranking, sortOrder, seriesId, reRenderTable }) => {
  const container = document.createElement('div')
  container.classList.add('ranking-controls')
  const num = document.createElement('span')
  num.textContent = ranking
  container.appendChild(num)

  const buttons = document.createElement('div')
  buttons.classList.add('buttons')

  // Upvote button
  const upButton = document.createElement('button')
  const upImg = document.createElement('img')
  upImg.src = '/static/up.svg'
  upButton.appendChild(upImg)

  upButton.addEventListener('click', async () => {
    try {
      const direction = sortOrder === 'asc' ? 'downvote' : 'upvote'
      await updateRanking(seriesId, direction)
      console.log('Ranking updated')
      reRenderTable() // Ensure this is a valid function
    } catch (error) {
      console.error('Failed to update ranking:', error)
    }
  })
  buttons.appendChild(upButton)

  // Downvote button
  const downButton = document.createElement('button')
  const downImg = document.createElement('img')
  downImg.src = '/static/down.svg'
  downButton.appendChild(downImg)

  downButton.addEventListener('click', async () => {
    try {
      const direction = sortOrder === 'asc' ? 'upvote' : 'downvote'
      await updateRanking(seriesId, direction)
      console.log('Ranking updated')
      reRenderTable() // Ensure this is a valid function
    } catch (error) {
      console.error('Failed to update ranking:', error)
    }
  })
  buttons.appendChild(downButton)

  container.appendChild(buttons)

  return container
}

export default RankingControls

