export const AnimetionDialog = (open: boolean): string => {
    return open ?
        "animate__animated animate__bounceIn" :
        "animate__animated animate__bounceOut"
};

export const BouncingInOut = (open: boolean): string => {
    return open ?
        "animate__animated animate__bounceIn" :
        "animate__animated animate__bounceOut"
};

export const RotateInOut = (open: boolean): string => {
    return open ?
        "animate__animated animate__rotateIn" :
        "animate__animated animate__rotateOut"
};

export const ShakeX = "animate__animated animate__shakeX";