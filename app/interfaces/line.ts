export interface Line {
    scheduledLineCode: string;
    lineId: number;
    taktTime: string;
    createdBy: string;
    modifiedBy: string | null;
    modifiedOn: string | null;
    name: string;
    isDeleted: boolean;
    createdOn: string;
    scheduledLineName: string;
}

export type LineList = Line[];