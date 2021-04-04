export interface IndexHtmlTransformContext {
  path: string
  filename: string
}
export type IndexHtmlTransformHook = (
  html: string,
  ctx: IndexHtmlTransformContext
) => string

export async function applyHtmlTransforms(
  html: string,
  path: string,
  filename: string,
  hooks: IndexHtmlTransformHook[]
): Promise<string> {
  return html
}
