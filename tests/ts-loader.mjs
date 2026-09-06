/**
 * Test-only module resolver.
 *
 * The source uses extensionless imports, which Vite resolves but Node's raw ESM
 * loader does not. This hook appends .ts (or /index.ts) so the same sources can
 * be exercised directly by `node --test` without a build step.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    try {
      return await next(specifier, context);
    } catch (err) {
      const base = context.parentURL ? new URL(specifier, context.parentURL) : pathToFileURL(specifier);
      for (const candidate of [`${base.href}.ts`, `${base.href}/index.ts`]) {
        if (existsSync(fileURLToPath(candidate))) {
          // Omit `format` so Node still applies its own .ts type-stripping.
          return { url: candidate, shortCircuit: true };
        }
      }
      throw err;
    }
  }
  return next(specifier, context);
}
