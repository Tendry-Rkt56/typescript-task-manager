interface Attributes {
     [key: string]: string | boolean | number
}

const app = document.getElementById('app')!
const table = document.getElementById('table')!
const flash = document.querySelector('.flashMessage') as HTMLElement

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

function getById<ArgType>(id: number): ArgType | undefined 
{
     const storage = getStorage<Attributes>()
     
     const data = storage.find(element => element.id == id) 
     
     if (!data) return undefined
     return data as ArgType
}

function updateStorage(newValue: string, id: number) 
{
     const storage = getStorage<Attributes>();
     const index = storage.findIndex(item => item.id === id);
     if (index !== -1) {
          storage[index].valeur = newValue
          setStorage<Attributes>(storage)
     }
}
 
function addInStorage(object: Attributes)
{
     const data: Attributes[] = getStorage<Attributes>()
     data.push(object) 
     setStorage<Attributes>(data)
}

function deleteInStorage(id: number | null)
{
     if (id) {
          const storage: Attributes[] = getStorage() || []
          const newStorage = storage.filter((element) => element.id != id)
          setStorage(newStorage)
          console.log(newStorage)
          console.log('Salut les gens')
     }
}

function filterStorage(search: string)
{
     const storage: Attributes[] = getStorage() || []
     const newStorage = storage.filter((element) => element.valeur.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase()))
     return newStorage
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

function createForm() 
{

     const form = createElement('form', {class:'form d-flex align-items-center align-self-start justify-content-center gap-3'})
     
     const searchInput = createElement('input', {
          id:'search' ,class:'form-control', placeholder:'Rechercher...'
     }) as HTMLInputElement
     
     const input = createElement('input', {
          class:'input form-control', required:true, placeholder:'Ajouter une tâche...'
     }) as HTMLInputElement

     const addBtn = createElement('button', {
          class: 'btn btn-primary btn-sm', type:'submit'
     }) as HTMLButtonElement
     addBtn.innerHTML = "Ajouter"

     form.appendChild(searchInput)
     form.appendChild(input)
     form.appendChild(addBtn)
     app.prepend(form)

}

function populateTable(data: any[])
{

     table.innerHTML = ''
     const thead = createElement('thead', {})
     const headerRow = document.createElement('tr')

     headerRow.appendChild(createCell('#', { header: true }))
     headerRow.appendChild(createCell('Valeur', { header: true }))
     headerRow.appendChild(createCell('Actions', { header: true }))
     thead.appendChild(headerRow)

     const tbody = document.createElement('tbody')

     if (data !== null && data.length > 0) {

          data.forEach(element => {
               const tr = document.createElement('tr')
     
               tr.appendChild(createCell(element.id, {}))
               tr.appendChild(createCell(element.valeur, {}))
     
               const actionsCell = createCell('', { 'class': 'd-flex gap-1' })
               const edit = document.createElement('button')
               edit.setAttribute('class', 'edit-btn btn btn-sm btn-primary')
               edit.setAttribute('data-index', element.id)
               edit.textContent = "Éditer"
               
               const suppr = document.createElement('button')
               suppr.setAttribute('class', 'btn btn-sm btn-danger suppr')
               suppr.textContent = "Supprimer"
               suppr.setAttribute('data-index', element.id)
     
               actionsCell.appendChild(edit)
               actionsCell.appendChild(suppr)
               tr.appendChild(actionsCell)
     
               tbody.appendChild(tr)
          })
     }

     table.appendChild(thead)
     table.appendChild(tbody)

}

function flashMessage(valeur: string, type: string, container: HTMLElement)
{
     const div = document.createElement('div')
     div.textContent = valeur
     div.setAttribute('class', `alert alert-${type} container d-flex align-items-center justify-content-center`)
     setTimeout(() => {
          container.classList.remove('active')
          div.remove()
     }, 4000)
     container.classList.add('active')
     container.prepend(div)

}

(function main()
{
     
     createForm()
     populateTable(getStorage())

     const form = document.querySelector('.form') as HTMLFormElement
     const input = document.querySelector('.input') as HTMLInputElement
     const search = document.getElementById('search') as HTMLInputElement
     const formUpdate = document.querySelector('.form-update') as HTMLFormElement
     const updateInput = document.querySelector('#input-edit') as HTMLInputElement

     let id: number | null = null

     form.addEventListener('submit', (e: SubmitEvent) => {
          e.preventDefault()
          if (input.value !== "") {
               addInStorage({
                    id: ++getStorage().length,
                    valeur: input.value,
               })
               input.value = ''
               flashMessage("Nouvelle tâche ajoutée", 'success', flash)
               populateTable(getStorage())
          }
     })

     search.addEventListener('input', (e) => {
          console.log(search.value)
          const dataFilter = filterStorage(search.value)
          populateTable(dataFilter)
     })

     table.addEventListener('click', (e: MouseEvent) => {
          const target = e.target as HTMLElement
          if (target.classList.contains('suppr')) {
               const id = target.getAttribute('data-index')
               if (id) deleteInStorage(parseInt(id))
               flashMessage("Tache N° "+id+ " supprimée", "danger", flash)
               populateTable(getStorage())
          }  
          if (target.classList.contains('edit-btn')) {
               const index = target.getAttribute('data-index')
               if (index) id = parseInt(index)
               formUpdate.classList.add('active')
               let valeur: Attributes | undefined = {}
               if (id) valeur = getById<Attributes>(id)
               if (valeur) {
                    updateInput.value = valeur.valeur.toString()
                    console.log(valeur.valeur)
                    console.log(id)
               }
          }
     })

     formUpdate.addEventListener('submit', (e: SubmitEvent) => {
          e.preventDefault()
          if (updateInput.value !== '') {
               if (id) updateStorage(updateInput.value, id)
               formUpdate.classList.remove('active')
               flashMessage("Tache N° "+id+ " mise à jour", "info", flash)
               populateTable(getStorage())
          }
     })

     
})()


