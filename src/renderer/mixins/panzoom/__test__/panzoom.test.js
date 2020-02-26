// import * as pan from '../pan'
// import {
//   Panzoom
// } from '../index'

// describe('panzoom:api', () => {
//   const setup = () => {
//     document.body.innerHTML = '' // empty
//     document.body.innerHTML = `
//     <div id="parent">
//       <div id="child"></div>
//     </div>
//   `
//     return {
//       parent: document.querySelector('#parent'),
//       child: document.querySelector('#child')
//     }
//   }

//   it('emits panStart event', done => {
//     const {
//       parent,
//       child
//     } = setup()

//     // Initialize Panzoom
//     const instance = new Panzoom(parent, child, {
//       startCentered: true
//     })

//     // Event listener
//     instance.on('panStart', () => {
//       done()
//     })

//     // Trigger a pan
//     pan.start({}, instance)
//   })
// })
