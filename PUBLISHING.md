# 发布记录与后续

## 已完成

| 项 | 状态 |
|---|---|
| 本地校验 | `node --check index.js` 通过；`npm test` 3/3；`dsh-standards --scope entry` pass 9 / fail 0 |
| 打包 | `npm pack --dry-run` → 56 文件 / 185 KB tarball |
| 装机实测 | 装入 desktop profile，新会话技能目录出现 `impeccable` |
| 公共仓库 | https://github.com/kechao-sgp/dsh-impeccable-skill （topics: `dsh-plugin` 等） |
| 市场投稿 | 社区目录 PR：https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/pull/13019 （`data/plugins/kechao-sgp__dsh-impeccable-skill.yml`） |

## npm 发布（待办）

`npm publish --access public` 被 registry 拒绝：

```
403 Forbidden - PUT https://registry.npmjs.org/dsh-impeccable-skill
Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

账号 `valee1990` 的 `npm profile get` 显示 `two-factor auth: disabled`，但 registry 对发布强制要求 OTP —— 需要先在 https://www.npmjs.com/settings/valee1990/profile 启用 2FA（推荐 TOTP），再：

```bash
npm login
npm publish --access public --otp=<当前 6 位动态码>
```

包名 `dsh-impeccable-skill` 目前仍未被占用。发布后记得把条目的安装来源从 GitHub 换成 npm（或两者并存）。

## 精选清单不适用

dsh-m 的 `docs/registry-copy-guide.md` §6 规定：三方插件收录走社区目录 awesome-dsh-plugin，不进 `registry.json`。`market/registry-entry.json` 仅当被 iasiv5 邀请进精选时才有用。

## 后续维护

- 上游 Impeccable 更新时：同步 `skill/SKILL.md` 与 `skill/reference/`，重跑 `npm test`，核对 `dsh-runtime.md` 的命令映射是否仍与上游 verb 表一致。
- 改版本号 → 打 tag → （npm 恢复后）发布；GitHub 来源的安装锁 commit，市场条目无需改。
