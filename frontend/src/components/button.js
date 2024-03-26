import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Button as MaterialUIButton, createTheme, styled, ThemeProvider } from '@material-ui/core';

const Button = ({ variant, children, size, ...props }) => {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFFFFF'
            },
            secondary: {
                main: '#000000'
            },
        },
    });

    const getButtonStyles = (variant) => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: '#fc0345',
                    borderColor: '#DE023D',
                    backgroundColorActive: '#DE023D',
                    borderColorActive: '#DE023D',
                };
            case 'secondary':
                return {
                    backgroundColor: '#D3FF86',
                    borderColor: '#D3FF86',
                    backgroundColorActive: '#DAFF99',
                    borderColorActive: '#D3FF86',
                };
            case 'link':
                return {
                    backgroundColor: 'none',
                    borderColor: 'none',
                    backgroundColorActive: 'none',
                    borderColorActive: 'none',
                };
            default:
                return {
                    backgroundColor: '#FFFFFF',
                    borderColor: '#FFFFFF',
                    backgroundColorActive: '#FFFFFF',
                    borderColorActive: '#FFFFFF',
                };
        }
    };

    const buttonStyles = getButtonStyles(variant);

    const ButtonStyled = styled(MaterialUIButton)({
        boxShadow: 'none',
        fontSize: 16,
        padding: size === 'sm' ? '6px' : '12px',
        border: variant === 'link' ? 'none' : '1px solid',
        fontWeight: 700,
        backgroundColor: buttonStyles.backgroundColor,
        borderColor: buttonStyles.borderColor,
        '&:hover': {
            backgroundColor: buttonStyles.backgroundColorActive,
            borderColor: buttonStyles.borderColorActive,
        },
        '&:active': {
            backgroundColor: buttonStyles.backgroundColorActive,
            borderColor: buttonStyles.borderColorActive,
        },
        "&:disabled": {
            backgroundColor: '#C3C7BC',
            borderColor: '#AFB5A6',
            color: '#000000',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <ButtonStyled {...props} color={variant === 'primary' ? 'primary' : 'secondary'}>
                {children}
            </ButtonStyled>
        </ThemeProvider>
    )
}

export default Button;
