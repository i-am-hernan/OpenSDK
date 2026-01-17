import { processSDKTypes } from "../utils/processSDKTypes";
import {
  components,
  getComponentNames,
  getComponentPath,
  compareVersions,
} from "../maps/components";
import { WEBVERSIONS } from "../constants/versions";
import { promises as fs } from "fs";
import * as path from "path";

/**
 * Get the minimum version where a component is available
 */
function getComponentMinVersion(componentName: string): string | null {
  const component = components[componentName];
  if (!component) return null;

  const pathVersions = Object.keys(component.path);
  if (pathVersions.length === 0) return null;

  // Return the earliest version
  return pathVersions.sort(compareVersions)[0];
}

/**
 * Get all versions where a component is available
 */
function getAvailableVersions(componentName: string): string[] {
  const minVersion = getComponentMinVersion(componentName);
  if (!minVersion) return [];

  return WEBVERSIONS.filter(
    (version) => compareVersions(version, minVersion) >= 0
  );
}

/**
 * Process a single component for a single version
 */
async function processComponent(
  componentName: string,
  version: string,
  specsDir: string
): Promise<boolean> {
  try {
    const parsedVersion = version.replaceAll(".", "_");
    const spec = await processSDKTypes(`v${version}`, componentName);

    if (!spec || Object.keys(spec).length === 0) {
      console.log(`  ⚠ No spec generated for ${componentName} ${version}`);
      return false;
    }

    const componentDir = path.join(specsDir, componentName);
    await fs.mkdir(componentDir, { recursive: true });

    const fileName = `${parsedVersion}.json`;
    const filePath = path.join(componentDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(spec, null, 2), "utf-8");
    console.log(`  ✓ ${componentName} ${version}`);
    return true;
  } catch (error: any) {
    console.error(`  ✗ Error processing ${componentName} ${version}:`, error.message);
    return false;
  }
}

/**
 * Process all components for specified versions
 */
async function updateComponentSpecs(
  componentNames?: string[],
  versions?: string[]
) {
  const specsDir = path.resolve(__dirname, "../../specs/components");
  await fs.mkdir(specsDir, { recursive: true });

  const components = componentNames || getComponentNames();
  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;

  console.log(`\n📦 Processing ${components.length} components...\n`);

  for (const componentName of components) {
    const availableVersions = versions || getAvailableVersions(componentName);

    if (availableVersions.length === 0) {
      console.log(`⚠ ${componentName}: No available versions`);
      continue;
    }

    console.log(
      `\n🔧 ${componentName} (${availableVersions.length} versions)`
    );

    for (const version of availableVersions) {
      totalProcessed++;
      const success = await processComponent(componentName, version, specsDir);
      if (success) {
        totalSuccess++;
      } else {
        totalFailed++;
      }

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Total processed: ${totalProcessed}`);
  console.log(`   Successful: ${totalSuccess}`);
  console.log(`   Failed/Empty: ${totalFailed}`);
}

// Parse command line arguments
const args = process.argv.slice(2);

// Check for specific components or versions
let componentFilter: string[] | undefined;
let versionFilter: string[] | undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--components" && args[i + 1]) {
    componentFilter = args[i + 1].split(",");
    i++;
  } else if (args[i] === "--versions" && args[i + 1]) {
    versionFilter = args[i + 1].split(",");
    i++;
  }
}

// Run the script
updateComponentSpecs(componentFilter, versionFilter).catch((err) => {
  console.error("Error updating component specs:", err);
  process.exit(1);
});
