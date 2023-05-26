#!/usr/bin/env node

import { program }  from 'commander'
import create from '../lib/create.js'

program
    .version('1.0.0')
    .command('create <name>')
    .description('create a new project')
    .action(name => { 
        create(name)
    })

program.parse()