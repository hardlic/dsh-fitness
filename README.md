# dsh-fitness 🏋️

DeepSeek Harness 的健身打卡插件与左侧栏画报。本地优先：不联网、无账号，数据存本机 SQLite。

**English TL;DR** — a fitness log plugin for DeepSeek Harness: agent tools (`fitness_log`) + a read-only Web UI panel. Local-first SQLite, MIT licensed.

- 插件（Agent 工具）——`fitness_log`：记训练、查今天/历史/周报、建训练计划、看今天该练什么
- 画报（Web 面板）——左侧栏可视化：今日计划与完成对照、今日训练、动作榜、训练历史、动态健身建议

仓库结构：

```
dsh-fitness/        ← 插件包（package.json 在根）
  lib/index.js      ← 宿主半：SQLite + fitness_log 工具
  test/smoke.mjs    ← 冒烟测试
  ui/               ← 画报包（独立的 DSH 插件包）
```

## 安装

### 方式一：本地目录安装（推荐，DSH 已有插件管理器）

```bash
git clone https://github.com/cildr/dsh-fitness.git
cd dsh-fitness
# 在 DSH 里（或让助手）执行，target 为克隆目录：
#   plugin_manager install_bundle target=<克隆目录>
# 画报（可选），target 为克隆目录下的 ui：
#   plugin_manager install_bundle target=<克隆目录>/ui
```

### 方式二：npm

> npm 上 `dsh-fitness` 这个名字已被他人占用，本项目的 npm 包名为 `@cildr/dsh-fitness`（发布后可用）。

```bash
dsh plugin --profile <你的 profile> add @cildr/dsh-fitness
```

## 工具：fitness_log

| action | 说明 |
|---|---|
| `log` | 记一次训练：`exercise` 动作名、`sets` 组数、`reps` 每组次数、`weightKg` 重量、`date` 可省=今天、`note` 备注 |
| `today` | 看今天 |
| `history` | 查历史：`exercise` 筛动作、`days` 往前几天 |
| `stats` | 周报：总组数、总容量（组数×次数×重量）、动作榜 |
| `plan_add` | 建计划：`name` 计划名、`weekday` 周一~周日/每天、`exercises` 动作列表 |
| `plan_list` | 看所有计划 |
| `plan_remove` | 删计划（`id`） |
| `plan_today` | 今天该练什么 + 完成对照 |

示例（在 QQ / DSH 对话里）：

```
记一下，卧推 4组 8次 60公斤
今天该练什么？
这周练得怎么样？
```

## 画报面板（ui/）

左侧插件栏「健身」图标进入：

- 近 7/30/90 天统计：训练天数、总组数、总容量
- 训练计划：全部计划列表，今天的高亮
- 今日计划对照：✅ 完成 / ⭕ 已 X 组；休息日提示
- 今天训练、动作榜、训练历史（按天分组）
- 健身建议：根据数据动态生成（训练频率、计划未完成、动作休眠、推/拉/腿平衡、容量趋势、渐进原则）

面板只读数据库，记录仍通过 `fitness_log` 工具进行。

## 数据

```
$DSH_HOME/dsh-fitness/fitness.sqlite    # DSH_HOME 默认 ~/.dsh
```

表：`sets`（训练记录）、`plans`（训练计划）。

## 开发

```bash
node --test test/smoke.mjs   # 插件冒烟测试
node --check ui/index.js     # 画报宿主半语法检查
```

CI 在推送时自动跑 `node --test`。

## License

MIT © cildr
