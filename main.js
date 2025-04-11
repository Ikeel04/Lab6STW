import { getCurrentPage } from './pages/index.js'
import render from './utils/render.js'

// Select the root element
const root = document.getElementById('root')

// Initial render
render(root, getCurrentPage())

