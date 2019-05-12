import React, {Component} from 'react';
import classnames from 'classnames';
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/es/Collapse/Collapse";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/es/CardHeader/CardHeader";
import Card from "@material-ui/core/es/Card";
import {withStyles} from "@material-ui/core";
import red from "@material-ui/core/es/colors/red";

import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    card: {},
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
});


class AnnonceDetail extends Component {

    /**
     *
     * @type {Annonce}
     */
    state = {
        title: "", images: [], criteria: [], price: "", date: "", seller: "", phone: "",
        expanded: false
    };

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {match} = nextProps;
        fetch(`api/annonces/${match.params.id}`).then(async (response) => {
            const data = await response.json();
            return this.setState(data);
        })
    }

    handleExpandClick = () => {
        this.setState(state => ({expanded: !state.expanded}));
    };

    render() {
        const {title, images, criteria: criterias, price, date, seller, phone} = this.state;
        const {classes} = this.props;
        return (
            <Card className={classes.card} width={1}>
                <CardHeader
                    action={
                        <IconButton>
                            <MoreVertIcon/>
                        </IconButton>
                    }
                    title={title}
                    subheader={
                        <React.Fragment>
                            <Typography variant={"subtitle2"}>
                                {price}
                            </Typography>
                            <Typography variant={"subtitle3"}>
                                {date}
                            </Typography>
                        </React.Fragment>
                    }
                />
                <CardMedia
                    className={classes.media}
                    image={images[0]}
                    title="Paella dish"
                />
                <CardContent>
                    <Grid item container direction="column" xs={12}>
                        <Typography variant="h4" gutterBottom className={classes.title}>
                            Criterias
                        </Typography>
                        <Grid container>
                            {criterias.map(criteria => (
                                <React.Fragment key={criteria.id}>
                                    <Grid item xs={6}>
                                        <Typography variant={"body1"} gutterBottom>{criteria.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant={"body2"} gutterBottom>{criteria.value}</Typography>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </Grid>

                    <Grid item container direction="column" xs={12}>
                        <Typography variant="h4" gutterBottom className={classes.title}>
                            Contacts
                        </Typography>
                        <Grid container>

                            <Grid item xs={6}>
                                <Typography variant={"body1"} gutterBottom>Seller</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant={"body2"} gutterBottom>{seller}</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant={"body1"} gutterBottom>Phone</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant={"body2"} gutterBottom>{phone}</Typography>
                            </Grid>

                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions className={classes.actions} disableActionSpacing>
                    <IconButton aria-label="Add to favorites">
                        <FavoriteIcon/>
                    </IconButton>
                    <IconButton aria-label="Share">
                        <ShareIcon/>
                    </IconButton>
                    <Button variant="contained" color="primary"
                            className={classnames(classes.button, classes.expand)}
                            onClick={this.handleExpandClick}
                            aria-expanded={this.state.expanded}
                            label={"test"}
                            aria-label="Show more">
                        <ExpandMoreIcon className={classnames(classes.expand, {
                            [classes.expandOpen]: this.state.expanded,
                        })}/>
                        See more pictures
                    </Button>

                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {images && images.map((src, i) => (
                            <React.Fragment key={`img.${i}`}>
                                <img src={src} alt={`Image-${i}`}/>
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Collapse>
            </Card>
        )
    }
}

// AnnonceDetail.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(AnnonceDetail);
