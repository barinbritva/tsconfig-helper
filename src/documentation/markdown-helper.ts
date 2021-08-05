import marked from 'marked'

export abstract class MarkdownHelper {
  public static wrapCodeBlock(value: string): string {
    return '`' + value + '`'
  }

  public static compile(value: string): string {
    return marked(value)
  }

  public static compileAsCodeBlock(value: string): string {
    return MarkdownHelper.compile(MarkdownHelper.wrapCodeBlock(value))
  }
}
