import { Doc } from "../../../../../convex/_generated/dataModel";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import Actions from "./table-actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MaterialCard({ material }: { material: Doc<"materials"> & { url: string | null } }) {
    return (
        <Card className="overflow-hidden">
            <div className="flex">
                <div className="w-1/3 min-h-[150px] relative">
                    {material.url ? (
                        <Image
                            src={material.url}
                            alt={material.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="w-2/3 p-4">
                    <CardContent className="p-0">
                        <h3 className="text-lg font-semibold mb-2">{material.name}</h3>
                        <Badge variant="secondary" className="mb-2">
                            {material.type}
                        </Badge>
                        {/* Add more material details here if needed */}
                    </CardContent>
                    <CardFooter className="p-0 mt-4">
                        <Actions material={material} />
                    </CardFooter>
                </div>
            </div>
        </Card>
    );
}