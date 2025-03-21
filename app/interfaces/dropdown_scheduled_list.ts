export interface IDropdownScheduled {
    scheduledLineCode: string;
    createdBy: string;
    modifiedBy: string | null;
    modifiedOn: string | null;
    name: string;
    isDeleted: boolean;
    createdOn: string;
    label?: string; 
    value?: string; 
}

export type DropdownScheduledLineList = IDropdownScheduled[];