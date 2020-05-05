#!/usr/bin/env node

import { HerokuLogsParser } from '../heroku-logs-parser'

const hp = new HerokuLogsParser()

process.stdin.pipe(hp).pipe(process.stdout)
