export const FS_PREFIX = `/@fs/`

export const DEP_VERSION_RE = /[\?&](v=[\w\.-]+)\b/
export const DEP_CACHE_DIR = `.vite`

export const CLIENT_PUBLIC_PATH = `/@vite/client`
/**
 * Some Rollup plugins use ids that starts with the null byte \0 to avoid
 * collisions, but it is not permitted in import URLs so we have to replace
 * them.
 */
export const NULL_BYTE_PLACEHOLDER = `__x00__`
