import React, { Component } from 'react'
import LoginUser from './Accounts/LoginUser';
import RegisterUser from './Accounts/RegisterUser';
import './NavComponent.css';
import Button from '@material-ui/core/Button';


class NavComponent extends Component {
    render(){
        
        let form;
        switch(this.props.displayed_form){
            case 'login' : 
                form =  <LoginUser
                        handleLoginChange={this.props.handleLoginChange}
                        handleLogin={this.props.handleLogin}
                        username={this.props.username}/>;
                break;
            case 'signup' : 
                form = <RegisterUser />
                break;
            default:
                form = null;
            }
        const logged_in_nav = (
            <ul style={{"listStyleType" : "none", "marginLeft": "-5ch"}}>
                <br></br>
                <li className='userlogging' onClick = {() => this.props.display_form('login')}><Button style={{backgroundColor:"#601e51",color:"#e6c49f",width:"150px"}}variant="contained" size="small" >Login</Button></li>
                <h3> Don't have an account?</h3>
                <li className='userlogging' onClick = {() => this.props.display_form('signup')}><Button style={{backgroundColor:"#601e51",color:"#e6c49f",width:"150px"}}variant="contained" size="small" >Signup</Button></li>
            </ul>
        );
        const logged_out_nav = (
            <ul style={{"listStyle":"none", "marginLeft":"-4ch"}}>
                <Button variant="contained" size="small"  style={{backgroundColor:"#601e51",color:"#e6c49f",width:"150px"}}onClick={this.props.handleLogout}><li >Logout</li></Button>
            </ul>
        );
        return (
            <div style={{paddingBottom:"3ch"}}>
                {this.props.logged_in? logged_out_nav : logged_in_nav}
                {form}            
            </div>
        );
    }
}
export default NavComponent