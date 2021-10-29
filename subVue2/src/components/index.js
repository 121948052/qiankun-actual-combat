import Vue from 'vue'
import Empty from './Empty'
import DeleteModel from './DeleteModel'
const myComponents = [Empty, DeleteModel]

myComponents.forEach(component => {
  Vue.component(component.name, component)
})
