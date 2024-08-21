import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFilterControlsProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    selectedType: string;
    onTypeChange: (value: string) => void;
    types: { label: string; value: string }[];
}

const SearchFilterControls: React.FC<SearchFilterControlsProps> = ({
    searchTerm,
    onSearchChange,
    selectedType,
    onTypeChange,
    types
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Input
                placeholder="Buscar materiais..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
            />
            <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="max-w-[200px]">
                    <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {types.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            {type.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default SearchFilterControls;