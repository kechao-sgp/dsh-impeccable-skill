import assert from 'node:assert/strict'
import { test } from 'node:test'
import { apply, name, inject, splitFrontmatter } from '../index.js'

function fakeContext() {
  const registered = []
  return {
    registered,
    logger: { warn() {} },
    effect(fn) { fn() },
    skills: { register(skill) { registered.push(skill); return () => {} } },
  }
}

test('registers the impeccable skill with an intact body', () => {
  const ctx = fakeContext()
  apply(ctx)
  assert.equal(ctx.registered.length, 1)
  const skill = ctx.registered[0]
  assert.equal(skill.name, 'impeccable')
  assert.equal(skill.source, 'bundled')
  assert.match(skill.description, /^Use when the user wants to design/)
  assert.ok(skill.content.length > 9_000, 'body should carry the whole SKILL.md text')
  assert.doesNotMatch(skill.content, /^---\nname:/, 'frontmatter must be stripped')
  assert.match(skill.content, /dsh-runtime\.md/)
  assert.equal(skill.resourceBase.kind, 'directory')
  assert.match(skill.resourceBase.path, /skill$/)
})

test('survives a malformed frontmatter', () => {
  const parsed = splitFrontmatter('no frontmatter here')
  assert.equal(parsed.description, undefined)
  assert.equal(parsed.body, 'no frontmatter here')
})

test('package identity is stable', () => {
  assert.equal(name, 'dsh-impeccable-skill')
  assert.deepEqual(inject, ['skills'])
})
