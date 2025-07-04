import { processSDKTypes } from "../utils/processSDKTypes";
import { WEBVERSIONS } from "../constants/versions";
import { promises as fs } from "fs";
import * as path from "path";

const updateAllSpecs = async () => {
    const versions = WEBVERSIONS;
    const configurations = ["checkout"];
    const specsDir = path.resolve(__dirname, "../../specs/checkout");

    // Ensure the specs/checkout directory exists
    await fs.mkdir(specsDir, { recursive: true });

    for (const version of versions) {
        for (const configuration of configurations) {
            console.log("version: ", version);
            const parsedVersion = version.replaceAll(".", "_");
            const spec = await processSDKTypes(`v${parsedVersion}`, configuration);
            const fileName = `${configuration}-${parsedVersion}.json`;
            const filePath = path.join(specsDir, fileName);
            await fs.writeFile(filePath, JSON.stringify(spec, null, 2), "utf-8");
            console.log(`Wrote spec for ${configuration} ${version} to ${filePath}`);
        }
    }
};

updateAllSpecs().catch((err) => {
    console.error("Error updating all specs:", err);
    process.exit(1);
});