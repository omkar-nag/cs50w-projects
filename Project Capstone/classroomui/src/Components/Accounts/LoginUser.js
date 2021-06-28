import React, { Component } from 'react'
import {Row} from 'reactstrap';
import Button from '@material-ui/core/Button';

class LoginUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password : ''
        }
    }
    handlePasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    render() {
        return (
            <div >
                <form   onSubmit={e => this.props.handleLogin(e, {
                    username : this.props.username, 
                    password : this.state.password
                })} >
                    <Row>
                        <label htmlFor="username" >Username</label>
                        <input style ={{ "width":150 , "marginLeft":20, "height": "4ch","fontSize":"2ch"}}  
                        type="text"
                        onChange={this.props.handleLoginChange} 
                        value={this.props.username} 
                        name="username"
                        id="username"
                        placeholder="Username" />
                    </Row>
                    <Row style={{marginBottom:"2ch"}}>
                        <label htmlFor="password" >Password </label>
                        <input style ={{ "width":150 , "marginLeft":20, "height": "4ch","fontSize":"2ch"}}  
                        type="password"
                        onChange={this.handlePasswordChange} 
                        value={this.state.password} 
                        name="password"
                        id="password"
                        placeholder="Password" />
                    </Row>
                    <Button  style={{backgroundColor:"#601e51",color:"#e6c49f" ,width:"150px"}} variant="contained" size="small" type='submit'>Login</Button>
                </form>
            </div>
        )
    }
}

export default LoginUser
