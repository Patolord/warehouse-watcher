import { api } from "../../../../../../../convex/_generated/api";
import { Doc } from "../../../../../../../convex/_generated/dataModel";
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

export default function GenerateDocument({
  movement,
}: {
  movement: Doc<"material_movements">;
}) {
  const toWarehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: movement.toWarehouseId,
  });

  const fromWarehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: movement.fromWarehouseId,
  });
  const formattedDate = milisecondsToDate(movement._creationTime);

  const generateDocument = async () => {
    // Fetch the image as an ArrayBuffer
    const response = await fetch("/RLPHeader.png"); // Adjust path if necessary
    const imageArrayBuffer = await response.arrayBuffer();

    const doc = new Document({
      sections: [
        {
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  children: [
                    new ImageRun({
                      data: imageArrayBuffer,
                      transformation: {
                        width: 350,
                        height: 100,
                      },
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            new Paragraph({
              text: `São Paulo, ${formattedDate}`,
              alignment: AlignmentType.RIGHT,
            }),
            new Paragraph({
              text: "Controle de entrega de material",
              heading: HeadingLevel.HEADING_1,
              thematicBreak: true,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Origem: ${fromWarehouse?.name || "N/A"} | Endereço: ${fromWarehouse?.address || ""}`,
                  size: 24, // Font size 12 (half-points)
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Destino: ${toWarehouse?.name || "N/A"} | Endereço: ${toWarehouse?.address || ""}`,
                  size: 24, // Font size 12 (half-points)
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Material levado para Obra",
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
                            new TextRun({ text: "Quantidade", size: 24 }),
                          ],
                        }),
                      ],
                      width: { size: 15, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "Medida", size: 24 })],
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
                    }),
                ),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
            new Paragraph({
              text: "Declaro ter recebido os materiais descritos acima.",
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
                          text: "Assinatura RLP Engenharia",
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
                          text: "Assinatura do Recebedor",
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
    const fileName = `Romaneio_${formattedDate}_${toWarehouse ? toWarehouse.name : ""}.docx`;

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
