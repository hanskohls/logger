declare module 'pino-caller' {
  import { Logger } from 'pino'
  export default function pinoCaller(logger: Logger): Logger
}
