// dsh-impeccable-skill 入口。
//
// 只做一件事：把包内的 `skill/` 目录注册成一个按需加载的 agent skill（技能名 `impeccable`）。
// skill/ 下的 SKILL.md 是技能正文，其中 `reference/...` 相对链接通过 directory 类型的
// resourceBase 解析到 `skill/` 目录。本插件不引入 harness 任何运行时模块（仅 node 内置），
// 因此不需要 peerDependencies，也不受 DSH 版本区间限制。
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-impeccable-skill'
export const inject = ['skills']

const packageRoot = dirname(fileURLToPath(import.meta.url))
const skillRoot = join(packageRoot, 'skill')
const SKILL_NAME = 'impeccable'

const FALLBACK_DESCRIPTION =
  'Use when the user wants to design, redesign, shape, critique, audit, polish, simplify, harden, animate, or otherwise improve a frontend interface: websites, landing pages, dashboards, product UI, components, forms, settings, onboarding, empty states, and native iOS or Android screens. Not for backend-only or non-UI tasks.'

/**
 * 去掉 SKILL.md 的 YAML frontmatter，返回 description 与正文。
 * frontmatter 缺失或格式损坏时，退回「无 description + 全文作为正文」。
 *
 * @param text - SKILL.md 原始内容
 * @returns 解析出的 description（若 frontmatter 有）与正文
 */
export function splitFrontmatter(text) {
  const open = /^---\r?\n/.exec(text)
  if (!open) return { description: undefined, body: text }
  const rest = text.slice(open[0].length)
  const close = /\r?\n---[ \t]*(?:\r?\n|$)/.exec(rest)
  if (!close) return { description: undefined, body: text }
  const meta = rest.slice(0, close.index)
  const body = rest.slice(close.index + close[0].length).replace(/^(?:[ \t]*\r?\n)+/, '')
  const match = /^description:[ \t]*(.+?)[ \t]*$/m.exec(meta)
  return { description: match?.[1]?.replace(/^["']|["']$/g, '').trim(), body }
}

/**
 * 注册 impeccable 技能。注册是一个 effect：`ctx.skills.register()` 返回的 disposer
 * 会在插件卸载时撤销该贡献。
 * @param ctx - 注入了 `skills` 服务的 Cordis 上下文
 */
export function apply(ctx) {
  let raw
  try {
    raw = readFileSync(join(skillRoot, 'SKILL.md'), 'utf8')
  } catch (error) {
    // 安装损坏时不要连带打断整个 profile：报一次警告并让插件空跑。
    ctx.logger?.warn?.(`dsh-impeccable-skill: 无法读取 skill/SKILL.md（${error.message}），本次未注册技能`)
    return
  }

  const { description, body } = splitFrontmatter(raw)
  ctx.effect(() =>
    ctx.skills.register({
      name: SKILL_NAME,
      source: 'bundled',
      description: description ?? FALLBACK_DESCRIPTION,
      content: body,
      resourceBase: { kind: 'directory', path: skillRoot },
    }),
  )
}
