const App = () => {
  const h1 = document.createElement("h1")
  h1.textContent = "Hello, World!"
  h1.classList.add("app-title")

  return h1
}

export { App }

