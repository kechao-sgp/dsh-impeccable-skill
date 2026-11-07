# 发布清单

包已经装好壳、跑过测试，剩下的是把它推到 npm 和市场收录里。前两步需要你的账号，我无法代做。

## 0. 已完成（本地可复核）

| 检查 | 命令 | 结果 |
|---|---|---|
| 语法 | `node --check index.js` | 通过 |
| 行为 | `npm test` | 3 项通过（技能注册、frontmatter 容错、包标识） |
| 打包 | `npm pack --dry-run` | 56 文件 / 185 KB tarball / 498 KB 展开，`tests/` 与 `.npm-cache/` 不入包 |
| 内容完整性 | `ls skill/reference` | 42 个参考文件 + `dsh-runtime.md` |

## 1. 占位符待填

| 位置 | 占位符 | 填什么 |
|---|---|---|
| `package.json` | 无 `repository` / `homepage` / `bugs` | 建仓后补上，npm 页面上会显示 |
| `market/registry-entry.json` | `OWNER`（2 处） | 你的 GitHub 用户名 |
| `market/awesome-entry.json` | `OWNER`（2 处） | 同上 |

## 2. 发布到 npm

包名 `dsh-impeccable-skill` 在 registry 上仍是 404（2026-11-07 校验）。注意 npm 上已有他人发布的 `dsh-impeccable`，**不要改名成它**，会冲突。

```bash
npm login                     # 浏览器 OAuth
npm publish --access public   # 若账号开了 2FA，按提示填一次性验证码
```

发布后自检：

```bash
npm view dsh-impeccable-skill version dist.tarball
curl -s https://registry.npmjs.org/dsh-impeccable-skill | head -c 200
```

补 `repository` 后重新发一个 patch 版本即可（`npm version patch && npm publish`）。

## 3. 建 GitHub 仓库

市场卡片、社区目录、问题反馈都依赖一个公开仓库。

```bash
git init && git add -A
git commit -m "feat: dsh-impeccable-skill 0.1.0"
git branch -M main
git remote add origin git@github.com:OWNER/dsh-impeccable-skill.git
git push -u origin main
```

推送前确认 `.npm-cache/` 与 `*.tgz` 已在 `.gitignore` 里（本包已带）。

## 4. 进精选清单（dsh-m 收录区）

精选清单是 dsh-m 仓库里的 `registry.json`，人工策展，靠 PR 进。规则见 [docs/registry-copy-guide.md](https://github.com/iasiv5/dsh-m/blob/main/docs/registry-copy-guide.md)。

1. Fork `iasiv5/dsh-m`。
2. 把 `market/registry-entry.json` 的内容追加进 `registry.json` 的 `plugins` 数组，`github` / `homepage` 里的 `OWNER` 换成你的用户名。
3. `category` 目前填的是 `watchlist`（观察区）——新包、无使用记录，这是最合适的起点；被策展人认可后可移到更靠前的分区。
4. 提 PR，说明：纯技能插件、只读文件系统、无网络与子进程、Apache-2.0、上游署名见 NOTICE。

## 5. 进社区目录（6,000+ 条目）

社区区来自 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，条目由 GitHub + npm 数据生成。

1. 确保 GitHub 仓库已公开，且 README 与 package.json 的 `keywords` 里带 `dsh`、`dsh-plugin`。
2. 在 awesome-dsh-plugin 仓库按它的 CONTRIBUTING 提交条目，或提 issue 请求收录；`market/awesome-entry.json` 是可直接提交的字段草稿（`category` 取 `skill`）。
3. 收录生效后，DSH 里 `dshm_search "impeccable"` 应能搜到；社区目录有缓存，必要时在插件市场「设置」里刷新目录。

## 6. 发版纪律

- 技能内容变更（`skill/`）→ patch 版本。
- 新增剧本或运行时映射规则 → minor 版本。
- 上游 Impeccable 发新版：同步 `skill/`，逐个确认 `dsh-runtime.md` 的映射仍成立，再升 minor。
- 每次发版都跑 `npm test` 与 `npm pack --dry-run`；`skill/SKILL.md` 的 frontmatter 一旦损坏，技能会静默回落到兜底描述。
