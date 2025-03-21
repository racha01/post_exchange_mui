import { Paper } from "@mui/material";
import { memo } from "react"

const PaperDialog = memo((props: any) => {
    return (
        <Paper
            {...props}
            style={{
                width: '600px',
                ...props.style,
            }}
        >
            {props.children}
        </Paper>
    );
});

export default PaperDialog;