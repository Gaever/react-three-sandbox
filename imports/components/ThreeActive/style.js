import { makeStyles } from '@material-ui/styles';

const useStyles = process.browser && makeStyles({
    '@global': {
        'html, body': {
            padding: 0,
            margin: 0
        },
    },
    
    threeactive: {
        position: 'absolute !important',
        width: '100%',
        height: '100%'
    },
});

export default useStyles;
