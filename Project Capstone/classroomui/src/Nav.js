import React, {Component , useState } from 'react';
import NavComponent from './Components/NavComponent';
import SERVER_ADDRESS from "./Components/Accounts/config";
import MyProfile from './ProfilePopUp';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
const base_url = SERVER_ADDRESS


function ClassCodeReader(props) {
  const [code, setcode] = useState('');

	function abcd(event) {
		setcode(event.target.value)
	}
	function submit(key) {
		if (key==='Enter') {
			// api
			fetch(base_url+ `GCR/joinroom/${code}/${props.user}`, {
				method: 'PUT',
				headers: {
					Authorization : `JWT ${localStorage.getItem('token')}`
				}
				})
				.then(response => response.json())
				.then(data => {
				console.log('Success:', data);
				})
				.catch((error) => {
				console.error('Error:', error);
			});
			window.location.reload()
			setcode('')
		}
	}
  return (
		<TextField  autoComplete="off"
		onChange={(event) => abcd(event)} 
		onKeyPress={e => submit(e.key)} 
		value = {code} 
		placeholder="Input Class Code" 
		style={{backgroundColor:"#e6c49f",width:"100%",marginLeft:"0"}}  variant="filled" />
	);
}


const useStyles = makeStyles((theme) => ({
	root: {
	  display: 'flex',
	},
	paper: {
	  marginRight: theme.spacing(2),
	},
  }));
  


function NavBarUtils(props) {

	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
  
	const handleToggle = () => {
	  	setOpen((prevOpen) => !prevOpen);
	};
  
	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		setOpen(false);
	};
  
	function handleListKeyDown(event) {
		if (event.key === 'Tab') {
			event.preventDefault();
			setOpen(false);
		}
	}
	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}
  
		prevOpen.current = open;
	}, [open]);
  
  return (
    <div className={classes.root}>
		{props.loggedin ? 
			<div style={{width:"100%"}}>
			<ClassCodeReader user={props.username}/>
			
			<Button 
				onClick={props.viewForm} 
				size="small" 
				style=
					{{backgroundColor:"#601e51",
					marginTop:"2ch",
					marginBottom:"2ch",
					width:"100%",
					color:"#e6c49f"}} 
				variant="contained"
			>
				Create Classroom
			</Button>
				<br></br>
			<Paper style={{color:"#e6c49f",backgroundColor:"#601e51" ,width : "100%"}}>
			<MenuList>
			<MenuItem onClick = {props.home}>Home</MenuItem>
			{ props.user ? <MyProfile user={props.user} /> : null }
				<MenuItem
					ref={anchorRef}
					aria-controls={open ? 'menu-list-grow' : undefined}
					aria-haspopup="true"
					onClick={handleToggle}
					stye={{ display: "block"}}
					>
					Notifications [{props.allNotifications.length}]
					</MenuItem>
					<Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
						{...TransitionProps}
						style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
							<MenuList autoFocusItem={open} onClick={handleClose} id="menu-list-grow" style={{backgroundColor:"#e6c49f",height:"15ch",overflow:"auto"}} onKeyDown={handleListKeyDown}>
								{props.allNotifications.map((notif,i) => (
									<MenuItem key={i} onClick={() => props.handleClick(notif.notification_classroom_code,notif.id)} >
										{'New '+ 
										notif.notification_type +
										" in " +  
										(notif.notification_classroom.length > 10 ? 
											notif.notification_classroom.slice(0,10) + "..." 
											: notif.notification_classroom ) 
										}
									</MenuItem>
								))}
							</MenuList>
							</ClickAwayListener>
						</Paper>
						</Grow>
					)}
				</Popper>
			</MenuList>
			</Paper>
			<br></br> <br></br>
			</div>
		:
			null
		}
    </div>
  );
}

export default class Nav extends Component {
	constructor(props) {
		super(props)

		this.state = {
			logged_in : localStorage.getItem('token') ? true : false,
			user: null,
			username : '' ,
			displayed_form : '',
			allNotifications: [],
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
			.then(response => {
				var res = response.status === 401 ? () => {
					localStorage.removeItem('token') 
				} : response
				return res
			})
			.then(res => res.json())
			.then(resp => {
				this.setState({user:resp})
				this.setState({ username : resp.username })
				fetch(base_url + `GCR/notifications/${this.state.username}`, {
					method : 'GET'
				})
				.then(res => res.json())
				.then(notifications => {
					notifications.reverse();
					this.setState({allNotifications : [...notifications]})
				})
			})
			.catch(err => console.log(err))
			
		}
	}

	display_form = (formName) => {
        this.setState({
			displayed_form : formName,
			form_data : true
        });
    }

	handleLoginChange = event => {
        this.setState({
            [event.target.name] : event.target.value
        })
	}
	
	handleLogout = () => {
		localStorage.removeItem('token');
		this.setState({logged_in : false, username : ''})
		window.location.reload();
	}

	handleLogin = (e, data) => {
		e.preventDefault();
		fetch(base_url + 'token-auth/', {

			crossDomain : true,
			withCredentials : true,
			async : true,
			method : 'POST',
			headers : {
				'Content-Type' : 'application/json',
			},
			body : JSON.stringify(data)
		})
		.then(response => response.json())
		.then(json => {
			localStorage.setItem('token', json.token);
			this.setState({
				logged_in : true,
				username : json.user.username
			})
			window.location.reload();
		})
		.catch(error => {
			console.log(error)
		})
		this.setState({
			displayed_form : ''
		})
	}
	render() {
		const { logged_in, username, displayed_form } = this.state;
		return (
			<div style={{padding:"3ch"}}>	
				<h3>
					{
						this.state.logged_in && this.state.username!== undefined? 
						`Greetings, ${this.state.username}`: 
						'Login to continue.'
					}
				</h3>
				<NavComponent
					logged_in = {logged_in}
					handleLogin = {this.handleLogin}
					handleLoginChange = {this.handleLoginChange}
					handleLogout = {this.handleLogout}
					username = {username}
					displayed_form = {displayed_form}
					display_form = {this.display_form}
				/>
				<NavBarUtils 
					viewForm = {this.props.viewForm} 
					username={username} 
					handleClick={this.props.handleClick} 
					allNotifications = {this.state.allNotifications} 
					loggedin = {this.state.logged_in} 
					home={this.props.home}
					user={this.state.user}
				/>
			</div>
		)
	}
}
