import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';

interface Material {
    materialId: string;
    materialName: string;
    quantity: number;
}

interface MaterialListProps {
    materialsList: Material[];
    onRemove: (index: number) => void;
}

const MaterialList: React.FC<MaterialListProps> = ({ materialsList, onRemove }) => {
    const renderContent = () => (
        <ScrollArea className="h-[200px] pr-4">
            {materialsList.length === 0 ? (
                <div className="flex items-center justify-between mb-2 last:mb-0">
                    <div className="flex items-center space-x-2">
                        <Badge variant="secondary" />
                        <span>Nenhum item adicionado</span>
                    </div>
                </div>
            ) : (
                materialsList.map((mat, index) => (
                    <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{mat.quantity}x</Badge>
                            <span>{mat.materialName}</span>
                        </div>
                        <XCircle
                            className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-destructive transition-colors"
                            onClick={() => onRemove(index)}
                        />
                    </div>
                ))
            )}
        </ScrollArea>
    );

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Lista de Materiais</CardTitle>
            </CardHeader>
            <CardContent>
                {renderContent()}
            </CardContent>
        </Card>
    );
};

export default MaterialList;