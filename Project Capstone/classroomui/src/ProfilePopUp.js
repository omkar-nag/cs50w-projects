import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { MenuItem } from '@material-ui/core';

function ProfileDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog  onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          {props.user.username ? 
      <DialogTitle >My Details</DialogTitle>: 
      <DialogTitle >Participants</DialogTitle>
          }
      <List>
      {props.user.username ? 
          <ListItem >
            <ListItemAvatar>
              <Avatar style={{color:"#e6c49f",backgroundColor:"#601e51",height:"5ch",width:"5ch",marginRight:"2ch"}} >
              </Avatar>
            </ListItemAvatar>
            <ListItemText >
            Username: <h3 style={{display:"inline"}}>{props.user.username}</h3><br></br><br></br>
            Fullname: <h3 style={{display:"inline"}}>{props.user.first_name} {props.user.last_name}</h3><br></br><br></br>
            Unique ID: <h3 style={{display:"inline"}}>{props.user.user_roll}</h3><br></br><br></br>
            </ListItemText>
          </ListItem>
          :props.user.map((username,i) => ( 
          <ListItem key= {i}>
            <ListItemAvatar>
              <Avatar style={{color:"#e6c49f",backgroundColor:"#601e51",marginRight:"2ch"}} >
              </Avatar>
            </ListItemAvatar>
              <ListItemText > <h4 style={{paddingLeft:"5ch",paddingRight:"5ch"}}>{username}</h4> </ListItemText>
          </ListItem>
          ))
          }
      </List>
    </Dialog>
  );
}

export default function MyProfile(props) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <div>
      <MenuItem style={{color:"#e6c49f",width:"100%",left:"0",fontSize:"unset"}} onClick={handleClickOpen}>
      {props.user.username ? "Profile" : "Participants" }
      </MenuItem>
      <ProfileDialog user={props.user} open={open} onClose={handleClose} />
    </div>
  );
}