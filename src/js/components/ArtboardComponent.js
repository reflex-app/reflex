import Vue from '../required/vue.dev';

// Import localStorage Information
import { artboardsLocalStorage } from './store/LocalStorage'

export function addArtboard() {
  this.artboards.push({
    id: artboardsLocalStorage.uid++,
    width: 400, // TODO: dynamic
    height: 400 // TODO: dynamic
  })
}