// src/styles/theme.ts
const customTheme = {
    button: {
      defaultProps: {
        color: 'blue',
      },
      valid: {
        colors: ['blue', 'red', 'green', 'yellow'],
      },
      styles: {
        base: {
          backgroundColor: 'var(--color-bg)',
          color: 'var(--color-text)',
          '&:hover': {
            backgroundColor: 'var(--color-bg-hover)',
          },
        },
      },
    },
    // Define other components' styles here
  };
  
  export default customTheme;
  