const SeriesForm = ({ series = {}, onSubmit }) => {
  const container = document.createElement('div')
  container.classList.add('series-form')

  // Helper function to create labeled inputs
  const createLabeledInput = (labelText, inputElement) => {
    const wrapper = document.createElement('div')
    wrapper.classList.add('form-group')

    const label = document.createElement('label')
    label.textContent = labelText
    label.classList.add('form-label')
    wrapper.appendChild(label)

    wrapper.appendChild(inputElement)
    return wrapper
  }

  // Title input
  const titleInput = document.createElement('input')
  titleInput.type = 'text'
  titleInput.placeholder = 'Title'
  titleInput.value = series.title || ''
  titleInput.classList.add('form-input')
  container.appendChild(createLabeledInput('Title:', titleInput))

  // Status dropdown
  const statusDropdown = document.createElement('select')
  const statuses = ['Plan to Watch', 'Watching', 'Dropped', 'Completed']
  statuses.forEach((status) => {
    const option = document.createElement('option')
    option.value = status
    option.textContent = status
    if (series.status === status) {
      option.selected = true
    }
    statusDropdown.appendChild(option)
  })
  statusDropdown.classList.add('form-select')
  container.appendChild(createLabeledInput('Status:', statusDropdown))

  // Last Episode Watched input
  const lastEpisodeInput = document.createElement('input')
  lastEpisodeInput.type = 'number'
  lastEpisodeInput.placeholder = 'Last Episode Watched'
  lastEpisodeInput.value = series.lastEpisodeWatched || 0
  lastEpisodeInput.classList.add('form-input')
  container.appendChild(createLabeledInput('Last Episode Watched:', lastEpisodeInput))

  // Total Episodes input
  const totalEpisodesInput = document.createElement('input')
  totalEpisodesInput.type = 'number'
  totalEpisodesInput.placeholder = 'Total Episodes'
  totalEpisodesInput.value = series.totalEpisodes || 0
  totalEpisodesInput.classList.add('form-input')
  container.appendChild(createLabeledInput('Total Episodes:', totalEpisodesInput))

  // Ranking input
  const rankingInput = document.createElement('input')
  rankingInput.type = 'number'
  rankingInput.placeholder = 'Ranking'
  rankingInput.value = series.ranking || 0
  rankingInput.classList.add('form-input')
  container.appendChild(createLabeledInput('Ranking:', rankingInput))

  // Submit button
  const submitButton = document.createElement('button')
  submitButton.textContent = 'Save'
  submitButton.classList.add('form-submit')
  submitButton.addEventListener('click', () => {
    const formData = {
      title: titleInput.value,
      status: statusDropdown.value,
      lastEpisodeWatched: parseInt(lastEpisodeInput.value, 10),
      totalEpisodes: parseInt(totalEpisodesInput.value, 10),
      ranking: parseInt(rankingInput.value, 10),
    }
    onSubmit(formData)
  })
  container.appendChild(submitButton)

  return container
}

export default SeriesForm

