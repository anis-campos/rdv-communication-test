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
import Icon from "@material-ui/core/Icon";


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
    grid: {
        marginTop: '1vh',
        padding: '0 20px 0 20px'
    },
    list: {
        maxHeight: '80vh',
        minHeight: '40vh',
        overflow: 'auto',
    },
    detail: {
        height: '80vh',
        overflow: 'auto',
    },
    image: {
        height: '10vh'
    },
    title: {paddingTop: 6}
});

class App extends Component {
    state = {
        data: null,
        refresh: false,
        list: []
    };

    componentDidMount() {
        Notification.requestPermission()
        this.loadData()
    }


    scrapData = async () => {
        if (this.state.refresh) return;
        this.setState({refresh: true});

        new Notification("Starting Scrapping");
        const response = await fetch("/api/annonces", {
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
        this.setState({refresh: false});

    };

    loadData = async () => {
        const response = await fetch("/api/annonces");
        if (response) {

            const body = await response.json();

            if (response.status !== 200) {
                throw Error(body.message)
            }

            this.setState({list: body})
        }
    };

    render = () => {
        const {refresh, list} = this.state;
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

                <Grid className={classes.grid} container spacing={8}>
                    <Grid item xs={4} style={{display: 'flex'}}>
                        <Typography variant="h6" className={classes.title}>Annonces</Typography>
                        <IconButton style={{marginLeft: 10}} onClick={this.loadData}><Icon>refresh</Icon></IconButton>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h6" className={classes.title}>
                            Details
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Paper className={classes.list}>
                            <List component="nav">
                                {

                                    list.map((item, index) =>
                                        (
                                            <>
                                                <ListItem button>
                                                    <img className={classes.image} src={item.images[0]}
                                                         alt={item.title}/>
                                                    <ListItemText primary={item.title} secondary={item.date}/>

                                                </ListItem>

                                                {index < list.length - 1 && < Divider/>}
                                            </>))
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper className={classes.detail}>xs=6</Paper>
                    </Grid>
                </Grid>

            </div>
        );
    };
}

export default withStyles(styles)(App);
