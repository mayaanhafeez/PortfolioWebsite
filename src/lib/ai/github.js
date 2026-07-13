const GITHUB_USER = "mayaanhafeez";
const GITHUB_HEADERS = { Accept: "application/vnd.github+json", "User-Agent": "ayaanhafeez-portfolio" };
const MAX_REPOS_WITH_COMMIT_LOOKUP = 8;
const isDev = process.env.NODE_ENV === "development";

function noteOtherEvent(bucket, e) {
  if (e.type === "CreateEvent" && e.payload?.ref_type === "repository") {
    bucket.other.push("created this repo");
  } else if (e.type === "PullRequestEvent") {
    bucket.other.push(`${e.payload?.action} PR #${e.payload?.number}`);
  } else if (e.type === "IssuesEvent") {
    bucket.other.push(`${e.payload?.action} issue: "${e.payload?.issue?.title}"`);
  } else if (e.type === "ReleaseEvent") {
    bucket.other.push(`published release ${e.payload?.release?.tag_name}`);
  }
}

// The events feed's PushEvent payload no longer includes commit messages (GitHub
// strips it), so actual commit text has to be fetched per-repo separately.
async function fetchCommitMessages(repoFullName, sinceIso) {
  try {
    const url = `https://api.github.com/repos/${repoFullName}/commits?since=${sinceIso}&author=${GITHUB_USER}&per_page=10`;
    const res = await fetch(url, { headers: GITHUB_HEADERS });
    if (!res.ok) return [];
    const commits = await res.json();
    if (isDev) console.log(`[github] commits response (${repoFullName}):`, JSON.stringify(commits, null, 2));
    if (!Array.isArray(commits)) return [];
    return commits.map((c) => c.commit?.message?.split("\n")[0]).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getGithubActivity(days = 7) {
  const clampedDays = Math.min(Math.max(Number(days) || 7, 1), 30);
  const sinceMs = Date.now() - clampedDays * 24 * 60 * 60 * 1000;
  const sinceIso = new Date(sinceMs).toISOString();

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`,
      { headers: GITHUB_HEADERS }
    );
    if (!res.ok) return "GitHub activity is temporarily unavailable.";

    const events = await res.json();
    if (isDev) console.log("[github] events response:", JSON.stringify(events, null, 2));

    const recent = events.filter((e) => new Date(e.created_at).getTime() >= sinceMs);
    if (recent.length === 0) return `No public GitHub activity in the last ${clampedDays} day(s).`;

    const repos = new Map();
    const pushCounts = new Map();
    for (const e of recent) {
      const repoName = e.repo?.name?.split("/")[1] ?? e.repo?.name ?? "unknown";
      if (!repos.has(repoName)) repos.set(repoName, { commits: [], other: [] });
      if (e.type === "PushEvent") {
        pushCounts.set(e.repo.name, (pushCounts.get(e.repo.name) ?? 0) + 1);
      } else {
        noteOtherEvent(repos.get(repoName), e);
      }
    }

    // Cap how many repos get a commit-detail lookup to bound GitHub API fan-out
    // (each lookup is a separate request against the same 60/hr unauthenticated limit).
    const topPushedRepos = [...pushCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_REPOS_WITH_COMMIT_LOOKUP)
      .map(([fullName]) => fullName);

    const commitResults = await Promise.all(
      topPushedRepos.map(async (fullName) => [fullName, await fetchCommitMessages(fullName, sinceIso)])
    );
    for (const [fullName, messages] of commitResults) {
      repos.get(fullName.split("/")[1]).commits.push(...messages);
    }

    const lines = [];
    for (const [repo, { commits, other }] of repos) {
      const parts = [];
      if (commits.length) {
        const shown = commits.slice(0, 6).map((m) => `"${m}"`).join(", ");
        parts.push(`${commits.length} commit(s): ${shown}${commits.length > 6 ? ", ..." : ""}`);
      }
      if (other.length) parts.push(other.slice(0, 4).join("; "));
      if (parts.length) lines.push(`- ${repo}: ${parts.join(" | ")}`);
    }

    if (lines.length === 0) return `No public GitHub activity in the last ${clampedDays} day(s).`;

    return `Public GitHub activity for the last ${clampedDays} day(s) (public repos only — private/client work isn't visible here):\n${lines.join("\n")}`;
  } catch {
    return "GitHub activity is temporarily unavailable.";
  }
}
