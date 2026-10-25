import fs from "node:fs/promises";
import path from "node:path";

const roots = process.argv.slice(2);
if (!roots.length) throw new Error("Pass the artifact directories to summarize, in chronological order.");
const output = path.resolve(roots[0]);
const cases = new Map();
const runs = [];
function collect(suites, group, directory) {
  for (const suite of suites) {
    collect(suite.suites || [], group, directory);
    for (const spec of suite.specs || []) {
      for (const test of spec.tests) {
        const result = test.results.at(-1);
        const key = `${group}|${test.projectName}|${path.basename(spec.file)}|${spec.title}`;
        cases.set(key, { group, project: test.projectName, file: path.basename(spec.file), title: spec.title, status: result?.status || "missing", durationMs: result?.duration, run: path.relative(output, directory) || "." });
      }
    }
  }
}
for (const root of roots) {
  const directory = path.resolve(root);
  const report = JSON.parse(await fs.readFile(path.join(directory, "results.json"), "utf8"));
  const group = path.basename(directory).startsWith("production") ? "production" : "development";
  runs.push({ directory: path.relative(output, directory) || ".", group, stats: report.stats, errors: report.errors });
  collect(report.suites, group, directory);
}
const results = [...cases.values()];
const groups = [...new Set(results.map((test) => test.group))].map((group) => {
  const tests = results.filter((test) => test.group === group);
  return { group, cases: tests.length, passed: tests.filter((test) => test.status === "passed").length, failed: tests.filter((test) => test.status !== "passed").length, configurations: new Set(tests.map((test) => test.project)).size };
});
const summary = { generatedAt: new Date().toISOString(), note: "Latest executed result per project and test wins; original reports are retained unchanged. Reruns correct audit scrolling/capture and navigation-load waits; historical failures remain in their raw reports.", groups, runs, cases: results };
await fs.writeFile(path.join(output, "summary.json"), JSON.stringify(summary, null, 2));
const escape = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const rows = results.map((test) => `<tr><td>${escape(test.group)}</td><td>${escape(test.project)}</td><td>${escape(test.title)}</td><td class="${test.status}">${escape(test.status)}</td><td>${(test.durationMs / 1000).toFixed(1)}s</td><td><a href="${test.run.replaceAll("\\", "/")}/html-report/index.html">Raw run</a></td></tr>`).join("");
await fs.writeFile(path.join(output, "summary.html"), `<!doctype html><meta charset="utf-8"><title>Amsterdam Studio Podcast — audit results</title><style>body{font:15px system-ui;max-width:1500px;margin:30px auto;padding:0 20px;color:#151719}h1{font-size:28px}table{border-collapse:collapse;width:100%}td,th{padding:10px;border:1px solid #ddd;text-align:left}.passed{color:#18612a;font-weight:bold}.failed,.timedOut{color:#a00;font-weight:bold}a{color:#1457a1}code{background:#eee;padding:2px 4px}</style><h1>Amsterdam Studio Podcast — executed audit</h1><p>${groups.map((group) => `${group.group}: ${group.passed}/${group.cases} passing cases across ${group.configurations} configurations`).join("; ")}.</p><p>${escape(summary.note)}</p><p><a href="screenshots.html">Screenshot index</a> · <a href="summary.json">Machine-readable summary</a> · <a href="lighthouse/mobile.report.html">Lighthouse mobile</a> · <a href="lighthouse/desktop.report.html">Lighthouse desktop</a></p><table><thead><tr><th>Build</th><th>Configuration</th><th>Check</th><th>Result</th><th>Duration</th><th>Evidence</th></tr></thead><tbody>${rows}</tbody></table>`);
console.log(JSON.stringify(groups, null, 2));
