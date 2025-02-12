type Attributes = {
     [key: string]: string
}

const app = document.getElementById('app')

function createElement(tag: string, attributes: Attributes): HTMLElement
{
     const element = document.createElement(tag)
     Object.keys(attributes).forEach(cle => {
          element.setAttribute(cle, attributes[cle])
     })
     return element
}

function createForm() 
{

}
