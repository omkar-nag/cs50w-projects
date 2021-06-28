import React from "react";
import "./Styles/classpage.css"
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Posts from "./Classposts"
import SERVER_ADDRESS from "./Components/Accounts/config";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { CreatePost} from "./Forms"
import MyProfile from './ProfilePopUp';

const base_url = SERVER_ADDRESS

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


function Asmt(props) {
    
    const classes = useStyles();

    return (
        <div>
            
        <Card style= {{marginTop:"2ch",padding:"1ch"}} className={classes.root}>
            <Fab onClick={props.close} size="small" name="close" float="right" aria-label="add"><i className="fa fa-remove"></i>
            </Fab>
            <CardContent>
              <Typography variant="h5" component="h2">
                 {props.assignment.assignment_topic}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
              {props.assignment.assigned_student}
              </Typography>
              <Typography className="wrap" variant="h6" component="h6">
              {props.assignment.assignment_content}

              </Typography>
              <hr style={{color:"white"}}></hr>
              <Typography className={classes.pos} color="textSecondary">
              </Typography>
            </CardContent>
          </Card>
          </div>
    )
}

function Assignments(props) {
    return ( 
        <div>
            <Button style={{color:"#e6c49f",width:"100%"}} onClick={()=> props.onlyAssignments(props.assigned)}
            >{props.faculty === props.assigned.assigned_student ? null : props.assigned.assignment_topic}</Button>
        </div>
    )
}

export default class Classroom extends React.Component {

    constructor(props) {
        super(props)
        this.state={
            username:"",
            assignments:[],
            classAssignments:[],
            assignmentDisplay: true,
            singleAs:null,
            create:false
        }
    }

    componentDidMount() {
        fetch(base_url + `GCR/assignments/${this.props.student}`)  
        .then(response=>response.json())
        .then(response => {
            this.setState({
                assignments: [...response]
            })
        })
        fetch(base_url + `GCR/classassignments/${this.props.code}`)  
        .then(response=>response.json())
        .then(response => {
            this.setState({
                classAssignments: [...response]
            })
        })
        
    }
    displayAssignments = () => {
        var mydiv = document.getElementById("classassignments");
        mydiv.style.display = mydiv.style.display === 'none' ? '' : 'none';
        this.setState(state => ({assignmentDisplay : !state.assignmentDisplay}))
    }

    singleAssignment = (ass123) => {
        this.setState({singleAs : ass123})
    }
    closeAssignment = () => {
        this.setState({singleAs : null})
    }

    displayCreate = () => {
       this.setState(state => ({
           create : !state.create
       }))
    }


    render() {
        var style = this.state.assignmentDisplay ? {
                "color":"black",
                "fontSize":"15px",
                "textAligh":"centre",
                "padding" : "0",
                "width":"100%",
                "border":"none",
                "backgroundColor":"#ff99cc",
            } : {
                "fontSize":"15px",
                "border":"none",
                "width":"100%",
                "padding" : "0",
                "color" : "#e6c49f",
                "backgroundColor" : "#601e51",
            }
        return (
            <div style={{marginRight:"2ch",marginTop:"2ch"}}>
                <div style={{
                        textAlign: "left", 
                        width:"49%",
                        display: "inline-block"}}>
                        <h2 style={{display:"inline"}}>
                            {this.props.subject}
                        </h2>
                    </div>
                    <div style={{
                        width:"50%" , 
                        fontSize:"20px"}}>
                            <h4>Owner: { this.props.faculty}{this.props.faculty === this.props.student ? '(You)' : ''}
                            <i className="material-icons" style={{verticalAlign:"middle"}}>person</i>
                            </h4>
                            
                    </div>
                <hr></hr><br></br>
                


                <div className="sidebar">
                    
                    <div id="assignment-window">
                        <Button 
                            onClick={this.displayAssignments}  
                            style={style} variant="contained" 
                            color="secondary"
                            >
                        <h5>
                {this.props.faculty === this.props.student ? "Submitted to you" : "Your Assignments" }
                            ⠀</h5>{
                            this.state.assignmentDisplay ?  	
                            <i className='fa fa-caret-down'></i>  :
                            <i className='fa fa-caret-up'></i> 
                        }
                        </Button>
                        <div id="classassignments">
                            {this.props.faculty === this.props.student ?  
                            this.state.classAssignments.filter(a =>
                                a.assigned_classroom_code === this.props.code).map((assignment,i) => 
                                    <Assignments key={i} faculty={this.props.faculty} assigned={assignment} onlyAssignments={this.singleAssignment} />
                            )
                            :
                            this.state.assignments.filter(a =>
                                a.assigned_classroom_code === this.props.code).map((assignment,i) => 
                                    <Assignments key={i} faculty={this.props.faculty} assigned={assignment} onlyAssignments={this.singleAssignment} />
                            ) }
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div>
                        <Button onClick = {this.displayCreate}size="small" style={{padding:"1ch",margin:"2ch",backgroundColor:"#601e51",color:"#e6c49f"}} variant="contained">
                            Submit 
                            {this.props.faculty === this.props.student ? " a Post" : " an Assignment"}
                        </Button>
                        <Button size="small" style={{backgroundColor:"#601e51",color:"#e6c49f",margin:"2ch"}} variant="contained"><MyProfile user={this.props.user} />
                        </Button>
                        <Button size="small" style={{padding:"1ch",backgroundColor:"#601e51",color:"#e6c49f",margin:"2ch"}} onClick={() =>  navigator.clipboard.writeText(`${this.props.code}`)}>
                                Copy classroom code to clipboard
                        </Button>
                        
                    </div>
                {this.state.create ? 
                    <CreatePost subject={this.props.subject} username={this.props.student} faculty={this.props.faculty} class_code={this.props.code}/>
                : null}
                    {this.state.singleAs ? <Asmt close={this.closeAssignment} assignment={this.state.singleAs} /> :
                    <Posts faculty={this.props.faculty} classroom_code={this.props.code} class_posts={this.props.class_posts} />
                    }
                </div>




            </div>
        )
    }
}