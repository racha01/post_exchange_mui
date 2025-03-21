import { Box, Stack, Typography } from "@mui/material";
import DeliverGoodsCutOffTable from "../components/DeliverGoodsCutOffTable";
import Grid from "@mui/material/Grid2"
import DeliverGoodsCusOffExportExcelComponent from "../components/DeliverGoodsCusOffExportExcel";

export default function DeliverGoodsCutOffPage() {
    return (
        <Box sx={{ width: '100%', marginTop: '-32px' }}>
            <Grid
                container
                direction="row"
                sx={{
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: '10px',
                }}
            >
                <Box>
                    <h1>ยอดการส่งสินค้า</h1>
                </Box>
                <Box>
                    <Stack direction="row" spacing={2}>
                        <Box>
                            {/* <DeliverGoodsCusOffExportExcelComponent /> */}
                        </Box>
                    </Stack>
                </Box>
            </Grid>
            <DeliverGoodsCutOffTable sellerId="" />
        </Box>
    )
} 
