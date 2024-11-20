interface Attributes {
     [key: string]: string | boolean | number
}

const app = document.getElementById('app')!
const table = document.getElementById('table')!

function setStorage<T>(data: T[]): void
{
     localStorage.setItem('data', JSON.stringify(data))
}

function getStorage<T>(): T[]
{
     const data = localStorage.getItem('data')
     if (data) {
          return JSON.parse(data) as T[]
     }
     return []
}

function addInStorage(object: Attributes)
{
     const data: Attributes[] = getStorage<Attributes>()
     data.push(object) 
     setStorage<Attributes>(data)
}

function createElement(tag: string, attributes: Attributes): HTMLElement
{
     const element = document.createElement(tag)
     if (attributes) {
          Object.keys(attributes).forEach(cle => {
               let value = attributes[cle]
               element.setAttribute(cle, typeof value == 'boolean' ? value.toString() : value.toString())
          })
     }
     return element
}

function createCell(content: string, attributes: Attributes)
{
     const cell = attributes.header ? document.createElement('th') : document.createElement('td')
     cell.textContent = content
     for (const key in attributes) {
          let value = attributes[key]
          if (key !== 'header') cell.setAttribute(key, typeof value == 'boolean' ? value.toString() : value.toString())
     }
     return cell
}

(function createForm() 
{
     const form = createElement('form', {class:'form d-flex align-items-center align-self-start justify-content-center gap-3'})
     const input = createElement('input', {class:'form-control', required:true, placeholder:'Ajouter une tâche...'}) as HTMLInputElement
     const addBtn = createElement('button', {class: 'btn btn-primary btn-sm', type:'submit'}) as HTMLButtonElement
     addBtn.innerHTML = "Ajouter"
     form.appendChild(input)
     form.appendChild(addBtn)
     app.prepend(form)
})()

function populateTable(data: any[])
{
     const thead = createElement('thead', {})
     const headerRow = document.createElement('tr')
     headerRow.appendChild(createCell('HJKHDFJKS', { header: true }))
     headerRow.appendChild(createCell('Prix', { header: true }))
     headerRow.appendChild(createCell('Actions', { header: true }))
     thead.appendChild(headerRow)
     const tbody = document.createElement('tbody')
     if (data == null || data.length > 0) {
          data.forEach(element => {
               const tr = document.createElement('tr')
               tr.setAttribute('data', element.id)
     
               tr.appendChild(createCell(element.id, {}))
               tr.appendChild(createCell(element.valeur, {}))
     
               const actionsCell = createCell('', { 'class': 'd-flex gap-1' })
               const edit = document.createElement('a')
               edit.setAttribute('href', '/articles/edit?id='+element.id)
               edit.setAttribute('class', 'btn btn-sm btn-primary')
               edit.textContent = "Éditer"
               
               const suppr = document.createElement('button')
               suppr.setAttribute('class', 'btn btn-sm btn-danger suppr')
               suppr.textContent = "Supprimer"
     
               actionsCell.appendChild(edit)
               actionsCell.appendChild(suppr)
               tr.appendChild(actionsCell)
     
               tbody.appendChild(tr)
          })
     }
     table.appendChild(thead)
     table.appendChild(tbody)
}
