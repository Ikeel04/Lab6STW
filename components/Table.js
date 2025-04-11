import TableRow from './TableRow.js'

const Table = ({ data, sortOrder, reRenderTable }) => {
  const table = document.createElement('table')
  table.classList.add('series-table')

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')

  const headers = ['Ranking', 'Title', 'Status', 'Episodes', 'Delete']
  headers.forEach((header) => {
    const th = document.createElement('th')
    th.textContent = header
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  data.forEach((series) => {
    const row = TableRow({ series, sortOrder, reRenderTable })
    tbody.appendChild(row)
  })
  table.appendChild(tbody)

  return table
}

export default Table

