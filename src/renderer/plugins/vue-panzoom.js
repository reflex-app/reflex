import Vue from "vue"
import Panzoom, { vuePanzoom } from "./panzoom";

Vue.use(vuePanzoom, {
    startCentered: true
})


// export default (context, inject) => {
//     let instance = new Panzoom("", "", {
//         startCentered: true
//     });
//     inject('panzoom', instance)
// }



// // Initialize Panzoom
// let instance = new Panzoom(contentEl, controllerEl, {
//     startCentered: true
// });
// document.$panzoom = instance; // Attach to document