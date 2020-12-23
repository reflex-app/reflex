import registerPromiseWorker from 'promise-worker/register'

registerPromiseWorker((message) => {
  if (message.type === 'getPrimesMessage') {
    // const amount = message.amount
    // this function returns an array of primes
    // [1, 2, 3, 5, 7, 11, 13, ...]
    // const primes = calculate_first_n_primes(amount)
    const primes = [1, 2, 3]
    return JSON.stringify({ primes })
  }
})
