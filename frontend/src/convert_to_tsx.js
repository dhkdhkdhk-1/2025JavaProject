import fs from "fs";
import path from "path";

function convertJsxToTsx(dir) {
  for (const item of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      convertJsxToTsx(fullPath);
    } else if (item.endsWith(".jsx")) {
      const content = fs.readFileSync(fullPath, "utf8");
      const updated = content
        .replace(/(['"])react(['"])/g, "$1react$2")
        .replace(/PropTypes/g, "interface Props")
        .replace(/React\.Component/g, "React.FC");
      const newPath = fullPath.replace(/\.jsx$/, ".tsx");
      fs.writeFileSync(newPath, updated);
      fs.unlinkSync(fullPath);
      console.log(`✅ ${item} → ${path.basename(newPath)}`);
    }
  }
}

convertJsxToTsx("src");
