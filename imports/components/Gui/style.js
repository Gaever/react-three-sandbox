import { makeStyles } from '@material-ui/styles';

const useStyles = process.browser && makeStyles({
    gui: {
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white'
    },

    btn: {
        width: '50px',
        height: '50px',
        transition: 'transform 0.2s ease-in-out',
        transform: 'scale(1)',
        '&:hover': {
            transform: 'scale(1.2)',
            cursor: 'pointer',
        }
    },
});

export default useStyles;
