import SeriesForm from '../components/SeriesForm.js'
import getSeriesById from '../utils/getSeriesById.js'
import updateSeries from '../utils/updateSeries.js'

const EditSeriesPage = (parentElement, seriesId) => {
  const container = document.createElement('div')
  container.classList.add('edit-series-page')

  // Back button
  const backButton = document.createElement('button')
  backButton.textContent = 'Back'
  backButton.addEventListener('click', () => {
    window.navigate('/') // Navigate back to the previous page
  })
  container.appendChild(backButton)

  // Placeholder for the form
  let form

  // Fetch the series data
  const fetchSeries = async () => {
    try {
      const series = await getSeriesById(seriesId)
      form = SeriesForm({
        series,
        onSubmit: async (formData) => {
          try {
            await updateSeries(seriesId, formData)
            alert('Series updated successfully!')
            window.navigate('/') // Navigate back to the main page
          } catch (error) {
            console.error('Failed to update series:', error)
            alert('Failed to update series.')
          }
        },
      })
      container.appendChild(form)
    } catch (error) {
      console.error('Failed to fetch series:', error)
      alert('Failed to fetch series.')
    }
  }

  fetchSeries()

  return {
    render: () => {
      parentElement.innerHTML = ''
      parentElement.appendChild(container)
    },
  }
}

export default EditSeriesPage

