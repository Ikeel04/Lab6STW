const render = (rootElement, currentPage) => {
  // Clear the root element
  rootElement.innerHTML = ''

  // Render the current page
  const { page, params } = currentPage
  const renderedPage = params ? page(rootElement, params) : page(rootElement)
  renderedPage.render()
}

export default render

