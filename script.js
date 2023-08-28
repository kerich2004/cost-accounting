const form = document.getElementsByTagName('form')[0]
const tbody = document.getElementsByTagName('tbody')[0]
const tfoot = document.getElementsByTagName('tfoot')[0]
const totalAmountCell = tfoot.querySelector('th')
const addBtn = document.getElementById('add-btn')
const resetFormBtn = document.getElementById('reset-btn')
const dateControl = document.querySelector('input[type="date"]')
const types = ['number', 'text', 'date']
const ls = localStorage

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const savedDataJSON = localStorage.getItem('formData')
const savedData = JSON.parse(savedDataJSON) || []

dateControl.valueAsDate = new Date()

window.addEventListener('load', renderTable)

form.addEventListener('submit', handleAdd)
resetFormBtn.addEventListener('click', resetForm)
tbody.addEventListener('click', editTableRow)


function handleAdd() {
  const formData = Object.fromEntries(new FormData(form))

  savedData.push(formData)
  ls.setItem('formData', JSON.stringify(savedData))
  
  renderTable()
}

function renderTable() {
  const date = new Date()
  const currentDate = date.getDate()
  const currentMonth = date.getMonth()
  const hours = date.getHours()
  let minutes = date.getMinutes()

  if (minutes < 10) minutes = '0' + date.getMinutes()

  tbody.innerHTML = ''

  savedData.forEach(item => {
    const row = tbody.insertRow()
    const amountCell = row.insertCell();
    const descriptionCell = row.insertCell();
    const datetimeCell = row.insertCell();
    const btnCell = row.insertCell()
    const deleteBtn = document.createElement('button')

    deleteBtn.addEventListener('click', deleteRow)

    amountCell.textContent = item.amount;
    descriptionCell.textContent = item.description;
    datetimeCell.textContent = `${currentDate}  ${months[currentMonth]} at ${hours}:${minutes}`;
    deleteBtn.textContent = 'Delete';
    btnCell.appendChild(deleteBtn)
  })

  updateTotal()
}

function updateTotal() {
  let total = 0;
  const amountCells = tbody.querySelectorAll('td:first-child')
  for (const cell of amountCells) {
    total += parseFloat(cell.innerText)
  }
  totalAmountCell.innerText = total
}

function resetForm() {
  document.querySelector('tbody').innerText = ''
  total = 0;
  totalAmountCell.innerText = total
  form.reset()
  dateControl.valueAsDate = new Date();
  savedData.splice(0)
  ls.setItem('formData', JSON.stringify(savedData))
}

function editTableRow(e) {
  const cell = e.target
  const keysObj = ['amount', 'description', 'datetimeLocal']

  if (cell.tagName === 'TD') {
    const rowIndex = cell.parentElement.rowIndex - 1
    const colIndex = cell.cellIndex
    const currentValue = cell.textContent
    const input = document.createElement('input')
    input.value = currentValue
    input.type = types[colIndex]

    input.addEventListener('keydown', function (event) {
      if (event.keyCode != 13) return
      const newValue = input.value

      savedData[[rowIndex]][keysObj[colIndex]] = newValue;
      cell.textContent = newValue
      ls.setItem('formData', JSON.stringify(savedData))
      updateTotal()
      
    })
    cell.textContent = '';
    cell.appendChild(input);
    input.focus();
  }
}


function deleteRow(e) {
  const row = this.closest('tr')
  const rowIndex = row.rowIndex - 1
  savedData.splice(rowIndex, 1)
  renderTable()
  ls.setItem('formData', JSON.stringify(savedData))
}