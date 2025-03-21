
'use client';
// import Box from '@mui/material/Box';
import { BoxProps, Box } from '@mui/material';
import { TransitionProps } from 'react-transition-group/Transition';
// import * as React from 'react';
import { forwardRef } from 'react';

export const AnimateCssTransition = forwardRef<BoxProps, TransitionProps & { children: React.ReactElement; className?: string }>(
    function AnimateCssTransition({ children, className, in: inProp, onEnter, onExited, ...props }, ref) {
        return (
            <Box
                ref={ref as React.Ref<HTMLDivElement>}
                className={className}
                style={{ animationDuration: '0.5s' }}
                onAnimationEnd={inProp ? onEnter : onExited}
                {...props}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '100vh',
                    alignItems: 'center'
                }}
            >
                {children}
            </Box>
        );
    }
);