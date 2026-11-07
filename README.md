# dsh-impeccable-skill

把 [Impeccable](https://github.com/pbakaus/impeccable) 设计体系做成一个 **DeepSeek Harness 技能插件**：24 个设计剧本、craft-floor 质量底线、四种界面模式分层，全部随包离线可用，并附一份 DSH 原生运行时映射。

装上它之后，直接对 DSH 说「把这个落地页重做一遍」「审一下这套设置页」「字排得没层次」，模型会按 Impeccable 的方法走完整流程，而不是给你一堆泛泛的建议。

## 它做了什么

注册一个名为 `impeccable` 的技能（`source: bundled`），正文与参考资料来自上游 Apache-2.0 的 Impeccable 技能：

| 能力 | 剧本 |
|---|---|
| 规划 | `shape`、`init`、`document`、`extract` |
| 评审 | `critique`、`audit` |
| 打磨 | `polish`、`bolder`、`quieter`、`distill`、`harden`、`onboard` |
| 强化 | `animate`、`colorize`、`typeset`、`layout`、`delight`、`overdrive` |
| 修复 | `clarify`、`adapt`、`optimize` |
| 迭代 | `live`、`generate` |

外加 `craft-floor.md`（质量底线与绝对禁令）、`new-work.md`（新界面完整流程）、`region-map.md`（组件区域拆分）、四种模式（Persuade / Operate / Read / Experience）与原生端（iOS / Android）指引。

## 安装

**方式一：从仓库安装**（当前可用）。包声明了 `dsh.bundle`，把仓库地址填进插件管理即可：

```
https://github.com/kechao-sgp/dsh-impeccable-skill
```

**方式二：本机目录安装**（开发调试用）——把这个包目录作为 bundle 装进当前 profile。

**方式三：市场安装**（待收录）。已向社区目录（awesome-dsh-plugin）提交条目，合并后可在市场里搜到；npm 包 `dsh-impeccable-skill` 尚未发布，发布后也能直接填包名。

安装后按宿主提示重启（Desktop 退出重开；Web 重启服务并刷新页面），之后新会话的技能目录里会出现 `impeccable`。

## 使用

直接用自然语言提需求即可，模型会路由到对应剧本：

- 「这个落地页太平了，帮我设计一版有观点的」→ new-work
- 「审一下 dashboard，给我量化评分和问题清单」→ `critique`
- 「上线前做一次可访问性和响应式检查」→ `audit`
- 「文案太糊了，把错误提示和空状态重写」→ `clarify`
- 「这套设计系统抽成 token 和组件」→ `extract`

也可以直接点名剧本：「用 impeccable 的 polish 过一遍」。

## 与上游引擎的差异（重要）

上游技能依赖一个私有二进制（`scripts/impeccable`，首次运行自动下载）和一个浏览器桥，负责上下文加载、反模式检测、组件区域测量、字体匹配和 live 取色迭代。**本移植版不打包该二进制**：来源不可审计、体积与本插件定位不符。取而代之的是 `skill/reference/dsh-runtime.md`，把每一个引擎命令映射到 DSH 原生动作：

| 上游能力 | 本移植版 |
|---|---|
| `impeccable context` | 直接读 `PRODUCT.md` / `DESIGN.md` / `.impeccable/` |
| `detect`（反模式检测） | 手工检测遍历：craft-floor 禁令 + `grep` + 逐条读上下文 |
| `generate-image` | DSH 原生 `generate_image` 工具 |
| 截图与视觉核对 | `playwright` 技能 / 已提交的视觉回归基准 / 用户截图 |
| `comp-spec`（像素测量） | 读图后用 `regions.json` 手写，尺寸明确标注为估算 |
| `font-match`（字体指纹） | 目测取最接近的可获得字体，并声明字号为估算 |
| `live` 浏览器取色迭代 | 落成静态变体文件 + 截图，列出意图让用户挑 |
| 钩子（编辑后自动检测） | 无。模型在交付前自己做一遍手工检测并说明 |

结论：**规划、评审、打磨、强化、修复这几类剧本是完整可用的**；需要像素级测量或浏览器交互的部分按上表降级，不会卡住工作，也不会假装做过。

## 与 `dsh-impeccable` 的区别

npm 上已有他人发布的 [`dsh-impeccable`](https://www.npmjs.com/package/dsh-impeccable)（Cassius0924），它带客户端工作台、反模式检测器和斜杠命令。本包是**另一种取向**：

|  | 本插件 | dsh-impeccable |
|---|---|---|
| 形态 | 纯技能，Host-only | 技能 + Web 客户端 UI + 检测器 |
| 体积 | ~540 KB | ~984 KB |
| 二进制/脚本 | 无 | 打包 `live-browser*.js`、检测器脚本 |
| 离线 | 完全离线 | 需要本地 Web 宿主渲染工作台 |
| 界面改动 | 无 | 会话顶栏新增「设计」面板 |

两者都注册同名技能 `impeccable`，**不要同时安装**（同层同名先到先得，后装的不生效）。

## 兼容性

- 只依赖 Node 内置模块，不需要 `peerDependencies`，不绑定 DSH 版本区间；技能服务（`skills.register`）存在即可用。
- 技能名 `impeccable` 会遮蔽用户目录下的同名技能（runtime 层优先于 user 层）。如果你的项目里已有自定义 `impeccable`，卸载本插件或改名使用。

## 权限与副作用

只读、无网络。`index.js` 用 Node 内置 `node:fs` 读一次包内 `skill/SKILL.md`，然后向技能服务注册一个技能；不写文件、不跑子进程、不改宿主配置、不注册工具或斜杠命令。据此在 `package.json` 声明 `dsh.capabilities: ["fs:read"]`。

## 来源与许可

- 技能正文与 `skill/reference/` 来自 [pbakaus/impeccable](https://github.com/pbakaus/impeccable)，Apache-2.0；`reference/ios.md`、`reference/android.md` 源自 [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills)，MIT。
- 本移植版的改动（重写 Setup、Edition limits、新增 `dsh-runtime.md`、逐个文件加 DSH 说明、移除二进制与 Claude 专用子代理定义）见 [NOTICE.md](./NOTICE.md)。
- 本插件为社区移植，**非上游官方发布**，也非 DSH 官方插件。上游的商标与署名权归其作者。
