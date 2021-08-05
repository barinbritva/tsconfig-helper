declare module 'marked' {
  export interface Options {
    // todo https://marked.js.org/using_advanced#options
  }
  
  export interface Callback {
    (error?: Error, result?: string)
  }

  function marked(src: string): string
  function marked(src: string, options: Options): string
  function marked(src: string, callback: Callback): void
  function marked(src: string, options: Options, callback: Callback): void
  
  export default marked
}
