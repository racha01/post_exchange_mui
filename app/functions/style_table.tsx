import { styled, TableRow } from "@mui/material";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.selected,
    },
    
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const selectedTableCellIndex = (event: React.MouseEvent<unknown>, id: number, selected: readonly number[]) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];
    if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
    }
    return newSelected;
};
