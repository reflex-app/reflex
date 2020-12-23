import PromiseWorker from 'promise-worker'
// import Worker from 'worker-loader!./worker'
import Worker from 'worker-loader!./worker'

const worker = new Worker()
const promiseWorker = new PromiseWorker(worker)

const getPrimes = (amount) =>
  promiseWorker.postMessage({
    type: 'getPrimesMessage',
    amount,
  })

export default getPrimes
