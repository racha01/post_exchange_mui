import React, { useState, FC } from "react";
import { Backdrop, CircularProgress, Button } from "@mui/material";

interface FullScreenLoadingProps {
    loading: boolean
}

const FullScreenLoading: FC<FullScreenLoadingProps> = ({ loading }) => {

    // const toggleLoading = () => {
    //     setLoading(!loading);
    //     setTimeout(() => setLoading(false), 3000);
    // };

    return (
        <div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
export default FullScreenLoading;