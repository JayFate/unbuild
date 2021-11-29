import type { PackageJson } from 'pkg-types'
import type { Hookable } from 'hookable'
import type { RollupOptions, RollupBuild } from 'rollup'
import type { MkdistOptions } from 'mkdist'

export interface BuildEntry {
  input: string
  name?: string
  builder?: 'rollup' | 'mkdist' | 'untyped'
  format?: 'esm' | 'cjs'
  defaults?: Record<string, any>
  declaration?: boolean
  outDir?: string
  ext?: 'cjs' | 'mjs' | 'js' | 'ts'
}

export type MkdistEntry = BuildEntry & { builder: 'mkdist' }

export interface BuildOptions {
  rootDir: string
  declaration?: boolean
  entries: BuildEntry[],
  clean: boolean
  outDir: string
  stub: boolean
  dependencies: string[],
  devDependencies: string[]
  externals: string[]
  inlineDependencies: boolean
  emitCJS: boolean
  cjsBridge: boolean
}

export interface BuildContext {
  options: BuildOptions,
  pkg: PackageJson,
  buildEntries: { path: string, bytes?: number, exports?: string[], chunks?: string[] }[]
  usedImports: Set<string>
  hooks: Hookable<BuildHooks> // eslint-disable-line no-use-before-define
}

export interface BuildConfig extends Partial<Omit<BuildOptions, 'entries'>> {
  entries: (BuildEntry | string)[],
  hooks?: BuildHooks // eslint-disable-line no-use-before-define
}

export interface BuildHooks {
  'build:before': (ctx: BuildContext) => void | Promise<void>
  'build:done': (ctx: BuildContext) => void | Promise<void>

  'rollup:options': (ctx: BuildContext, options: RollupOptions) => void | Promise<void>
  'rollup:build': (ctx: BuildContext, build: RollupBuild) => void | Promise<void>
  'rollup:dts:options': (ctx: BuildContext, options: RollupOptions) => void | Promise<void>
  'rollup:dts:build': (ctx: BuildContext, build: RollupBuild) => void | Promise<void>
  'rollup:done': (ctx: BuildContext) => void | Promise<void>

  'mkdist:before': (ctx: BuildContext, entries: MkdistEntry[]) => void | Promise<void>
  'mkdist:options': (ctx: BuildContext, options: MkdistOptions) => void | Promise<void>
  'mkdist:build': (ctx: BuildContext, output: { writtenFiles: string[] }) => void | Promise<void>
  'mkdist:done': (ctx: BuildContext) => void | Promise<void>
}

export function defineBuildConfig (config: BuildConfig): BuildConfig {
  return config
}
