import { HerokuLogsParser, parseLines } from './heroku-logs-parser'

const lines = `
2020-05-05T09:13:34.754509+00:00 app[run.1787]: {"level":30,"time":1588670014754,"pid":115,"hostname":"a8d57749-9c74-4a85-8edc-x","msg":"msg1"}
2020-05-05T09:13:34.759052+00:00 app[run.1787]: {"level":30,"time":1588670014757,"pid":115,"hostname":"a8d57749-9c74-4a85-8edc-x","msg":"msg2"}
2020-05-05T09:12:48+00:00 app[heroku-postgres]: source=HEROKU_POSTGRESQL addon=postgresql-animate-13221 sample#current_transaction=2836
2020-05-05T09:14:44.550886+00:00 app[run.1787]: {"level":30,"time":1588670084548,"pid":115,"hostname":"a8d57749-9c74-4a85-8edc-x","msg":"msg3"}
`
  .trim()
  .split('\n')

describe(`${HerokuLogsParser.name}`, () => {
  it('should parse lines', () => {
    expect.assertions(1)

    expect(parseLines(lines)).toMatchSnapshot()
  })
})
