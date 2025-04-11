import SeriesForm from '../components/SeriesForm.js'
import createSeries from '../utils/createSeries.js'

const CreateSeriesPage = (parentElement) => {
  const container = document.createElement('div')
  container.classList.add('create-series-page')

  // Back button
  const backButton = document.createElement('button')
  backButton.textContent = 'Back'
  backButton.addEventListener('click', () => {
    window.navigate('/') // Navigate back to the previous page
  })
  container.appendChild(backButton)

  // SeriesForm component
  const form = SeriesForm({
    onSubmit: async (formData) => {
      try {
        await createSeries(formData)
        alert('Series created successfully!')
        window.navigate('/') // Navigate back to the main page
      } catch (error) {
        console.error('Failed to create series:', error)
        alert('Failed to create series.')
      }
    },
  })
  container.appendChild(form)

  return {
    render: () => {
      parentElement.innerHTML = ''
      parentElement.appendChild(container)
    },
  }
}

export default CreateSeriesPage

