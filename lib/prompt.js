/**
 * @description: 获取交互结果
 */


import { checkbox, confirm, select } from '@inquirer/prompts'

const answers = {}

answers.features = await checkbox({
  message: 'Check the features needed for your project:',
  choices: [
    {
      name: 'Router',
      value: 'router',
      description: 'Structure the app with dynamic pages',
      checked: true
    },
    {
      name: 'Vuex',
      value: 'vuex',
      description: 'Manage the app state with a centralized store',
      checked: true
    },
    {
      name: 'Babel',
      value: 'babel',
      description: 'Transpile modern JavaScript to older versions (for compatibility)',
      checked: true
    },
    {
      name: 'ESlint',
      value: 'eslint',
      description: 'Check and enforce code quality with ESLint',
      checked: true
    }
  ]
})


// 选择路由模式
if(answers.features.includes('router')) {
  answers.historyMode = await confirm({
    message: 'Use history mode for router?',
    default: false
  })
}

// 选择 eslint 标准
if(answers.features.includes('eslint')) {
  answers.eslint = await select({
    message: 'Pick a linter config',
    choices: [
      {
        name: 'ESLint + Airbnb',
        value: 'airbnb'
      },
      {
        name: 'ESLint + Standard',
        value: 'standard'
      }
    ]
  })
  answers.lintOn = await checkbox({
    message: 'Pick additional lint features',
    choices: [
        {
            name: 'Lint on save',
            value: 'save',
            checked: true
        },
        {
            name: 'Lint and fix on commit',
            value: 'commit'
        }
    ],
  })
}

export default answers