declare module 'pino-pretty' {
  import { PrettyOptions } from 'pino'
  export default function prettyFactory(options: PrettyOptions): (inputData: object | string) => string
}
