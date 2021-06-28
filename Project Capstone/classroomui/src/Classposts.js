import React from "react";
import "./Styles/classpage.css"
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });


function SinglePost(props) {
  const classes = useStyles();
  var style = props.post.post_user === props.faculty ? {color:"#670067"} : null 
  return ( 
        <div>
          {/*  */}
        <Card style= {{backgroundImage: "linear-gradient(to right, #e6c49f 10%, #ff99cc 100%)",marginTop:"2ch"}} className={classes.root}>
            <CardContent>
              <Typography variant="h5" component="h2">
                 {props.post.post_topic}
              </Typography>
              <Typography style={style} className={classes.pos} color="textSecondary">
                  {props.post.post_user === props.faculty ?  props.faculty + '(faculty)' : props.post.post_user}
              </Typography>
              <Typography variant="h6" component="h6">
                {props.post.post_content}
              </Typography>
              <hr style={{color:"white"}}></hr>
              <Typography className={classes.pos} color="textSecondary">
                {props.post.post_timestamp.slice(11,19)} { props.post.post_timestamp.slice(0,10)}
              </Typography>
            </CardContent>
          </Card>
        </div>
    )
}

class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            class_code:""
        }
    }

    
    render() {
      return (
          <div>
        {this.props.class_posts.map((post,i) => (
            <SinglePost faculty={this.props.faculty} post={post} key={i}/>
            ))
        }
        </div>
      )
    }
}

export default Posts