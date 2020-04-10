declare module 'pino-debug' {
  import { Logger, Level } from 'pino'

  interface PinoDebugOptions {
    /**
     * If true (default) any debug namespaces found in the keys of opts.map will be enabled.
     */
    auto: boolean

    /**
     * Equivalent of prefixing a namespace with dash (-) when specifying DEBUG namespaces.
     *
     * Any namespaces specified will not be logged.
     */
    skip?: string[]

    /**
     * The keys of the map property correspond to the same namespaces that can be set on the DEBUG environment variable.
     *
     * @example
     *
     * map: {
     *   'my-app': 'info',
     *   'some-dep:*': 'debug',
     *   '*': 'trace'
     * }
     */
    map?: Record<string, Level>
  }

  export default function pinoDebug(logger: Logger, opts: PinoDebugOptions): void
}
