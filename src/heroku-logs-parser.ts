#!/usr/bin/env node

import { Transform, TransformCallback } from 'stream'

const PREFIX = new RegExp(
  /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-6]\d(\.\d{3,6})?\+\d\d:\d\d\s\w+\[.+]:\s?)/,
)

export function parseLines(lines: string[]) {
  return lines.map((line) => line.replace(PREFIX, ''))
}

export class HerokuLogsParser extends Transform {
  _transform(chunk: Buffer, encoding: string, callback: TransformCallback) {
    this.push(parseLines(chunk.toString().split('\n')).join('\n'))

    callback()
  }
}
