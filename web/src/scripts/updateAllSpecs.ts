import { WEBVERSIONS } from "../constants/versions";
import { updateCheckoutSpecs } from "./updateCheckoutSpecs";
import { updateComponentSpecs } from "./updateComponentSpecs";

const run = async () => {
  console.log(
    `\n🌱 Seeding specs for ${WEBVERSIONS.length} version(s): ${WEBVERSIONS.join(", ")}\n`
  );

  console.log("→ Checkout specs");
  await updateCheckoutSpecs(WEBVERSIONS, ["checkout"]);

  console.log("\n→ Component specs");
  await updateComponentSpecs(undefined, WEBVERSIONS);

  console.log("\n✅ Done");
};

run().catch((err) => {
  console.error("Error seeding specs:", err);
  process.exit(1);
});
