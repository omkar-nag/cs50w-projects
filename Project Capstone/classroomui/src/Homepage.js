import React from "react";
import Classroom from "./Classpage"
import NavColumn from "./Nav";
import SERVER_ADDRESS from "./Components/Accounts/config";
import Button from '@material-ui/core/Button';
import Nav from "./Nav";
import { ReactComponent as Svg2 } from "./Styles/ill2.svg";
import { ReactComponent as Svg1 } from "./Styles/ill1.svg";

import Form from "./Forms"

const base_url = SERVER_ADDRESS
function Block(props) {
    return (
        <div title="Go to classroom" id="blocks" onClick={() => props.handleClick(props.code)}>
            <h2 id="classroomname-homepage">{props.subject.length > 15 ? props.subject.slice(0,15) + '...' : props.subject }</h2>
            <h5>{props.faculty} <i className="material-icons" style={{verticalAlign:"-4px"}}>person</i></h5>
        </div>
    )
}

export default class Homepage extends NavColumn {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            logged_in : localStorage.getItem('token') ? true : false,
            classrooms: [],
            goToClass : null,
            class_posts: [],
            class_students: [],
            anyForm : false,
        }
    }

    componentDidMount(){
        
		if(this.state.logged_in){
			fetch(base_url + 'GCR/current_user/', {
				method : 'GET',
				headers : {
					Authorization : `JWT ${localStorage.getItem('token')}`
				}
			})
			.then(res => res.json())
			.then(resp => {
                this.setState({ username : resp.username })

                fetch(base_url + `GCR/rooms/${resp.username}`)  
                .then(response=>response.json())
                .then(response => {
                    this.setState({
                        classrooms : [...response]
                    })
                })
            })
			.catch(err => console.log(err));
        }
    }
    
    handleClick= (mycode,notifid) => {
        var result = this.state.classrooms.find(x => x.classroom_code === mycode)
        this.setState({goToClass:result})
        fetch(base_url + `GCR/classposts/${mycode}`)  
        .then(response=>response.json())
        .then(response => {
            this.setState({
                class_posts: [...response]
            })
        })

        fetch(base_url + `GCR/classroomstudents/${mycode}`)
        .then(res=>res.json())
        .then(resp=>
            this.setState({class_students: [...resp]})
            )
        notifid ? 
        fetch("http://127.0.0.1:8000/GCR/delnotif", {
            method:"PUT",
            headers:{
                Authorization: `JWT ${localStorage.getItem('token')}`
            },
            body : JSON.stringify({
                "id":notifid
            })
        })
        .then(res=> res.json())
        .then(resp =>console.log(resp))
        : console.log('bb') 
    }

    switchFormView= ()=> {
        this.setState({anyForm:true})
    }
    
    goback = () => {
        this.setState({goToClass:null})
        this.setState({anyForm:false})
        
    }

    render() {
        console.log(this.state.class_students)
        return (
            <div>
                <div id="left">
                    <Nav viewForm = {this.switchFormView} handleClick= {this.handleClick} home={this.goback}/>
                </div>
                <div id="right">
                    {this.state.anyForm ? <Form username={this.state.username}/> :
                        <div>
                            <div style={{left: 0}}> 
                                {this.state.logged_in ? 
                                !this.state.goToClass ? <h1 style={{margin:"3ch"}}>Enrolled Classrooms</h1> : null :
                                <div><h1 style={{textAlign:"center",marginTop:"5vh"}}>Please login to proceed</h1> 
                                <Svg2 /></div>
                                }
                            </div>
                            {this.state.goToClass ? 
                                <div style={{padding:"2ch"}}>
                                    <Button onClick={this.goback} size="small" style={{backgroundColor:"#601e51",color:"#e6c49f"}} variant="contained">Back</Button>
                                    
                                    <Classroom 
                                        user={this.state.class_students}
                                        student={this.state.username}
                                        faculty={this.state.goToClass.classroom_faculty} 
                                        subject={this.state.goToClass.classroom_subject} 
                                        code={this.state.goToClass.classroom_code} 
                                        class_posts={this.state.class_posts}
                                    />
                                </div> : this.state.classrooms.length ?
                                this.state.classrooms.map((room,i) => (
                                    <Block 
                                        key={i} 
                                        subject={room.classroom_subject} 
                                        faculty={room.classroom_faculty}
                                        code= {room.classroom_code}
                                        handleClick= {this.handleClick}
                                    />
                                ))
                                :
                                 this.state.username ?
                                <div>
                                <Svg1 />
                                <h4 style={{textAlign:"center"}}>Empty! Try joining or creating a classroom!</h4></div>
                                :<div></div>

                            }
                        </div>
                    }
                </div>
            </div>
        )
    }
}