import React, {Component} from 'react';
import './App.css';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import AnnonceDetail from "./AnnonceDetail";
import {Route} from 'react-router-dom';

const styles = () => ({
        progress: {
            color: "white"
        },
        root: {
            flexGrow: 1,
        },
        grow: {
            flexGrow: 1,
        },

        content: {
            overflowX: 'hidden'
        },
        grid: {
            marginTop: '1vh',
            padding: '0 20px 0 20px'
        },
        list: {
            marginRight: 15,
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
    })
;

class App extends Component {
    state = {
        data: null,
        refresh: false,
        list: []
    };


    componentDidMount() {
        Notification.requestPermission();
        this.loadData()
    }


    scrapData = async () => {
        if (this.state.refresh) return;
        this.setState({refresh: true});

        const response = await fetch("/api/annonces", {
            method: "POST"
        });

        if (response) {

            const body = await response.json();

            if (response.status !== 200) {
                throw Error(body.message)
            }

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

    onClickItem = (item) => {
        debugger;
        this.props.history.push('/' + item._id);
    };

    render = () => {
        const {refresh, list} = this.state;
        const {classes} = this.props;
        return (
            <div className="root">
                <AppBar position="static">
                    <Toolbar>

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

                <div className={classes.content}>
                    <Grid className={classes.grid} container spacing={0}>
                        <Grid item xs={4} style={{display: 'flex'}}>
                            <Typography variant="h6" className={classes.title}>Annonces</Typography>
                            <IconButton style={{marginLeft: 10}}
                                        onClick={this.loadData}><Icon>refresh</Icon></IconButton>
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
                                                <div key={item._id}>
                                                    <ListItem button onClick={this.onClickItem.bind(this, item)}
                                                    >
                                                        <img className={classes.image} src={item.images[0]}
                                                             alt={item.title}/>
                                                        <ListItemText primary={item.title} secondary={item.date}/>

                                                    </ListItem>

                                                    {index < list.length - 1 && < Divider/>}
                                                </div>))
                                    }
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper className={classes.detail}>
                                <Route path="/:id" exact component={AnnonceDetail}/>
                            </Paper>
                        </Grid>
                    </Grid>

                </div>
            </div>
        );
    };
}


export default withStyles(styles)(App);
