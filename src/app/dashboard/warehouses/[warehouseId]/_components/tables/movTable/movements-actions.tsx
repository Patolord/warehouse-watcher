import { Doc } from "../../../../../../../../convex/_generated/dataModel";
import GenerateDocument from "../GenerateDocument";

export default function Actions({
  movement,
}: {
  movement: Doc<"material_movements">;
}) {
  return (
    <div className="flex items-center">
      <GenerateDocument movement={movement} />
    </div>
  );
}
