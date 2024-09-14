import { useQuery } from "convex/react";
import {
  AlignmentType,
  Document,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { Clipboard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { milisecondsToDate } from "@/lib/utils";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

type EnrichedTransaction = {
  _creationTime: number;
  _id: Id<"transactions">;
  from_location?: Id<"warehouses">;
  to_location?: Id<"warehouses">;
  action_type: string;
  materials: {
    materialId: Id<"materials">;
    materialVersionId: Id<"materialVersions">;
    quantity: number;
    materialName: string;
    materialType: string | undefined;
    materialImageFileId: Id<"_storage"> | undefined;
    versionNumber: number;
    versionCreationTime: number;
  }[];
  fromWarehouseId?: Id<"warehouses">;
  toWarehouseId?: Id<"warehouses">;
  description?: string;
};

export default function GenerateDocument({
  movement,
}: {
  movement: EnrichedTransaction;
}) {
  const toWarehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: movement.to_location,
  });

  const fromWarehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: movement.from_location,
  });
  const formattedDate = milisecondsToDate(movement._creationTime);

  const generateDocument = async () => {
    // Fetch the image as an ArrayBuffer

    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${formattedDate}`,
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              text: `${formattedDate}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: "Material delivery control",
              heading: HeadingLevel.HEADING_1,
              thematicBreak: true,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Origin: ${fromWarehouse?.name || "N/A"} | Address: ${fromWarehouse?.address || ""}`,
                  size: 24, // Font size 12 (half-points)
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Destination: ${toWarehouse?.name || "N/A"} | Address: ${toWarehouse?.address || ""}`,
                  size: 24, // Font size 12 (half-points)
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Materials taken to the site",
                  size: 24, // Font size 12 (half-points)
                }),
              ],
              spacing: { before: 200, after: 200 },
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "Item", size: 24 })],
                        }),
                      ],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Quantity", size: 24 }),
                          ],
                        }),
                      ],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "Unit", size: 24 })],
                        }),
                      ],
                      width: { size: 10, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Material", size: 24 }),
                          ],
                        }),
                      ],
                      width: { size: 65, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                ...movement.materials.map(
                  (material, index) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: `${index + 1}`, size: 24 }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${material.quantity}`,
                                  size: 24,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: "un.", size: 24 }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${material.materialName}`,
                                  size: 24,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({
              text: "I hereby declare that I have received the materials described above.",
              spacing: { before: 400, after: 800 },
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph("____________________________________"),
                        new Paragraph({
                          text: "Warehouse signature",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: "none", color: "#ffffff" },
                        bottom: { style: "none", color: "#ffffff" },
                        left: { style: "none", color: "#ffffff" },
                        right: { style: "none", color: "#ffffff" },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph("____________________________________"),
                        new Paragraph({
                          text: "Receiver signature",
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: "none", color: "#ffffff" },
                        bottom: { style: "none", color: "#ffffff" },
                        left: { style: "none", color: "#ffffff" },
                        right: { style: "none", color: "#ffffff" },
                      },
                    }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: "none", color: "#ffffff" },
                bottom: { style: "none", color: "#ffffff" },
                left: { style: "none", color: "#ffffff" },
                right: { style: "none", color: "#ffffff" },
              },
            }),
          ],
        },
      ],
    });
    const fileName = `Warehouse_Movement_${formattedDate}_${toWarehouse ? toWarehouse.name : ""}.docx`;

    // Convert the document to a Blob and save it
    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
  };

  return (
    <Button variant="ghost" onClick={() => generateDocument()}>
      <Clipboard size={20} color="#0000FF" />
    </Button>
  );
}
