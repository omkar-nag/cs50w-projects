import  React, {useState } from "react" 
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {
    createMuiTheme,
    makeStyles,
    createStyles,
    ThemeProvider
  } from "@material-ui/core/styles";
import {green } from "@material-ui/core/colors";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme =>
    createStyles({
      root: {
        color: green[900],
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            border: "3px solid #670067",
            color:"red"
          },
          "&.Mui-focused fieldset": {
            border: "3px solid #e6c49f" // customized
          }
        }
      }
    })
  );
  
  function PostComponent(props) {
    const classes = useStyles();
    const [Title, setTitle] = useState('');
    const [Desc, setDesc] = useState('');
    const [Type, setType] = useState('');
    const [submitted, setSubmitted] =useState(false)
    const [submit,setSubmit]=useState("")
    function funcB(event) {
        setTitle(event.target.value)
        props.username === props.faculty ? setType(false) : setType(true)
        setSubmitted(false)
    }
    function funcC(event) {
        setSubmitted(false)
        setDesc(event.target.value)
    }
    function handleSubmit() {
        Title.length>3 && Desc.length>3 ? finalizeSubmit() : setSubmit("Minimum 3 characters required in each field.")
    }
    function finalizeSubmit() {
        fetch("http://127.0.0.1:8000/GCR/newpost", {
            method: "PUT",
            headers : {
                Authorization : `JWT ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                "class_code":props.class_code, 
                "username":props.username,
                "title":Title,
                "desc":Desc,
                "type":Type,
            })
        })
        .then(response=>response.json())
        .then(resp => {
            setSubmitted(true)
            setTitle("")
            setDesc("")
        })
        .then(
            fetch("http://127.0.0.1:8000/GCR/newnotif", {
                method:"PUT",
                headers : {
                    Authorization : `JWT ${localStorage.getItem("token")}`,
                },
                body : JSON.stringify({
                    "class_code" : props.class_code,
                    "post_type" : Type
                })
            })
            .then(resp => resp.json())
            .then(response => console.log(response))
        )

    }
    return (
        <Paper style={{padding:"2ch"}}>
            
            {submitted ? <div><h5 style={{color:"green"}}>Submitted</h5><p>Reload to see changes.</p></div> : <p>{submit}</p>}
            <TextField
                style={{color:"red"}}
                variant="outlined"
                value={Title}
                classes={{
                root: classes.root
                }}
                placeholder="Topic"
                onChange={(e) => funcB(e)}
            /><br></br><br></br>
            <TextField
                style={{color:"red",width:"100%"}}
                name="Desc"
                value={Desc}
                variant="outlined"
                    classes={{
                        root: classes.root
                    }}
                multiline
                rows={4}
                placeholder="Description"
                onChange={(ev) => funcC(ev)}
                />
            <Button onClick={handleSubmit} size="small" style={{backgroundColor:"#670067",color:"#e6c49f",marginTop:"2ch"}} variant="contained">Submit</Button>
        </Paper>
    );

  }
  const theme = createMuiTheme({});
  
  export function CreatePost(props) {
    return (
      <ThemeProvider theme={theme}>
        <PostComponent 
        subject= {props.subject} 
        class_code={props.class_code} 
        faculty={props.faculty} 
        username={props.username}
        />
      </ThemeProvider>
    );
  }
  

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class Form extends React.Component {
    
    constructor(props) {
        super(props);
        this.state={ 
            success : true,
            open: false}
        
    }
    createClassroom = (event)=> {
        if(event.target[0].value.length > 3) {

            fetch(`http://127.0.0.1:8000/GCR/createroom/${this.props.username}/${event.target[0].value}`, {
				method: 'PUT',
				headers: {
					Authorization : `JWT ${localStorage.getItem('token')}`
				}
				})
				.then(response => response.json())
				.then(data => {
                console.log('Success:', data);
                data.response === 'success' ? 
                this.setState({success:true}) :
                this.setState({success:null})

				})
				.catch((error) => {
				console.error('Error:', error);
			});
            this.setState({open:true})
            event.preventDefault()
            setTimeout(() => this.setState({open: false }),2000);
        }
        else {
            alert("Enter more than 3 characters")
            event.preventDefault()
        }
    }
    

    render() {
        return (
            <div style={{padding:"3ch"}}>
                <h1>Enter Classroom Title</h1><form onSubmit={(event,data) => this.createClassroom(event,data)}>
               <TextField autoComplete="off" style={{backgroundColor:"#e6c49f",width:"50%"}} id="standard-basic" label="Title" /><br></br><br></br>
                <Button  type="submit" size="small" style={{backgroundColor:"#670067",color:"#e6c49f"}} variant="contained">Create</Button>
                <br></br><br></br>
                <h2>You can find a classroom-code, by clicking on the classroom block in the homepage.<br></br>In the classroom, click on copy classroom code. Use this to invite more users.</h2>
                
                <Snackbar open={this.state.open} >
                {this.state.success ?
                    <Alert  severity="success">
                        Classroom Created. Reload to see changes.
                    </Alert>
                    : 
                    <Alert  severity="error">
                        Classroom with such title already exists. Please try again!
                    </Alert> 
                }
                </Snackbar>
                </form>
            </div>
        )
    }
}
