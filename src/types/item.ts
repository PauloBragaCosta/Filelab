// src/types/item.ts
export interface Item {
    itemCode: string;
    itemType: string;
    boxNumber: string;
    spaceNumber: string;
    examType: string;
    status: string;
    // Add any other properties that should be part of the Item interface
};

export interface OverviewData {
    countbloco: number;
    countlaminas: number;
    blocoChange: string;
    laminasChange: string;
};

export interface VisaoGeralProps {
    items: Item[];
    overviewData: OverviewData | null;
};