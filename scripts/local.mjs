// Starts everything the site needs locally in one step (used by `pnpm local` and by the
// "web" entry in .claude/launch.json):
//   1. creates .env from .env.example when missing
//   2. starts Docker Desktop when the Docker engine is not running, and waits for it
//   3. starts Postgres, runs migrations, seeds sample data when the database is empty
//   4. runs the Next.js dev server on port 3210
import { execSync, spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";

const PORT = process.env.PORT ?? "3210";
const run = (command) => execSync(command, { stdio: "inherit" });
const quiet = (command) => spawnSync(command, { shell: true, stdio: "ignore" }).status === 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("[local] Đã tạo .env từ .env.example");
}

if (!quiet("docker info")) {
  const desktop = "C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe";
  if (process.platform === "win32" && existsSync(desktop)) {
    console.log("[local] Đang mở Docker Desktop...");
    spawn(desktop, [], { detached: true, stdio: "ignore" }).unref();
  } else {
    console.log("[local] Docker chưa chạy, hãy mở Docker rồi thử lại.");
  }
  for (let i = 0; i < 90 && !quiet("docker info"); i++) await sleep(2000);
  if (!quiet("docker info")) {
    console.error("[local] Docker vẫn chưa sẵn sàng sau 3 phút.");
    process.exit(1);
  }
}

run("docker compose up -d --wait");
run("pnpm exec drizzle-kit migrate");

process.loadEnvFile(".env");
const user = process.env.POSTGRES_USER ?? "tiem_chung";
const dbName = process.env.POSTGRES_DB ?? "tiem_chung";
const count = spawnSync("docker", ["compose", "exec", "-T", "db", "psql", "-U", user, "-d", dbName, "-tAc", "select count(*) from vaccines"], {
  encoding: "utf8",
}).stdout?.trim();
if (count === "0") {
  console.log("[local] Database trống, đang nhập dữ liệu mẫu...");
  run("pnpm db:seed");
}

const dev = spawn("pnpm", ["exec", "next", "dev", "--port", PORT], { stdio: "inherit", shell: true });
dev.on("exit", (code) => process.exit(code ?? 0));
