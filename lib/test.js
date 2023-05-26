import { execa, $ } from 'execa'



// console.log(await execa('cd', ['utils']))
console.log(await $`cd utils && mkdir tttt`)