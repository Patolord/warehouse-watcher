import GenerateDocument from "../../GenerateDocument";

export default function Actions({ movement }: { movement: any }) {
  return (
    <div className="flex items-center">
      <GenerateDocument movement={movement} />
    </div>
  );
}
