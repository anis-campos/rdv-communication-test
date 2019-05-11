import React, {Component} from 'react';
import './App.css';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";


const styles = theme => ({
    progress: {
        color: "white"
    },
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    paper: {
        'min-height': '90vh'
    }
});

class App extends Component {
    state = {
        data: null,
        refresh: false
    };

    componentDidMount() {
        Notification.requestPermission()
    }


    scrapData = async () => {
        if (this.state.refresh) return;
        this.setState({refresh: true});

        new Notification("Starting Scrapping");
        const response = await fetch("/", {
            method: "POST"
        });

        if (response) {

            const body = await response.json();

            if (response.status !== 200) {
                throw Error(body.message)
            }

            new Notification(`Scrapping over: ${body.number} annonces found`)

        } else {
            throw Error("No Answers")
        }
    };

    render = () => {
        const {refresh} = this.state;
        const {classes} = this.props;
        return (
            <div className="root">
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h4" color="inherit" className={classes.grow}>
                            Le Bon Coin Scrapper
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={refresh}
                            onClick={this.scrapData}>
                            Start Scrapping
                        </Button>
                        {refresh && <CircularProgress className={classes.progress}/>}
                    </Toolbar>
                </AppBar>

                <Grid container spacing={8}>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>
                            <List component="nav">
                                <ListItem button>
                                    <ListItemText primary="Inbox"/>
                                </ListItem>
                                <Divider />
                                <ListItem button>
                                    <ListItemText primary="Drafts"/>
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.paper}>xs=6</Paper>
                    </Grid>
                </Grid>

            </div>
        );
    };
}

export default withStyles(styles)(App);
