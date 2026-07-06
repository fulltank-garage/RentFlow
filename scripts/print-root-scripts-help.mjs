import packageJson from "../package.json" with { type: "json" };

const scripts = packageJson.scripts ?? {};
const descriptions = packageJson.scriptDescriptions ?? {};
const groups = [
  {
    title: "เริ่มต้น",
    names: ["scripts:help", "setup", "setup:dev"],
  },
  {
    title: "รันระบบด้วย Docker",
    names: ["dev", "db", "api"],
  },
  {
    title: "รันแยกแบบ Local",
    names: ["customer", "admin", "partner", "api:local", "api:watch"],
  },
  {
    title: "ตรวจงานและ Build",
    names: [
      "build",
      "build:customer",
      "build:admin",
      "build:partner",
      "lint",
      "lint:customer",
      "lint:admin",
      "lint:partner",
      "test",
      "check",
    ],
  },
  {
    title: "จัดการ Docker",
    names: ["logs", "ps", "stop"],
  },
];

const groupedNames = groups.flatMap((group) => group.names);
const extraNames = Object.keys(scripts).filter((name) => !groupedNames.includes(name));
const names = [...groupedNames, ...extraNames];
const longestName = Math.max(...names.map((name) => name.length));

console.log("Root scripts ของ RentFlowCar\n");

for (const group of groups) {
  const visibleNames = group.names.filter((name) => scripts[name]);

  if (visibleNames.length === 0) {
    continue;
  }

  console.log(`[${group.title}]`);

  for (const name of visibleNames) {
    const description = descriptions[name] ?? "ยังไม่มีคำอธิบาย";
    console.log(`npm run ${name.padEnd(longestName)}  ${description}`);
  }

  console.log("");
}

if (extraNames.length > 0) {
  console.log("[อื่น ๆ]");

  for (const name of extraNames) {
    const description = descriptions[name] ?? "ยังไม่มีคำอธิบาย";
    console.log(`npm run ${name.padEnd(longestName)}  ${description}`);
  }
}
