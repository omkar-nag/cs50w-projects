document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').onsubmit = send_mail;
  load_mailbox('inbox');
});

function compose_email() {
  document.querySelector('#load-mail').style.display='none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
};

function load_mailbox(mailbox) {
  document.querySelector('#load-mail').style.display='none';
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  var el= document.createElement('div');
  el.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(function fireandforget(emails) {
    emails.forEach(email => {
      time=email.timestamp
      subject=email.subject
      recipients=email.recipients
      const namesub = document.createElement('p');
      const div= document.createElement('div');
      var t=document.createElement('p');
      var linebreak = document.createElement("br");
      namesub.innerHTML=`To: ${recipients}`+Array(10).fill('\xa0').join('') +`Subject: "${subject}"`+ Array(10).fill('\xa0').join('')
      namesub.appendChild(linebreak);
      namesub.style.float='left';
      t.innerHTML=`${time}`
      t.style.display='inline-block';
      t.style.float='right';
      div.style.width='1111px';
      div.appendChild(namesub);
      div.appendChild(t);
      div.style.display='inline-block';
      div.style.border='solid #C0C0C0';
      div.style.borderWidth= '1px';
      div.style.padding='4px';
      div.style.paddingBottom='0';
      div.style.margin='-3px';
      if (email['read']) {
        div.style.backgroundColor='white';
      }
      else {
        div.style.backgroundColor='#F5F5F5'
      }
      div.style.cursor='pointer';
      el.append(div);
      div.addEventListener('click', () => {
        load_mail(email['id'],mailbox);
      });
    });
    document.querySelector('#emails-view').innerHTML='';
    document.querySelector('#emails-view').append(el);
  });
}

function load_mail(id,mailbox) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#load-mail').style.display='block';
      var linebreak = document.createElement("br");
      var from=document.createElement('STRONG');
      var to=document.createElement('p');
      var bod=document.createElement('p');
      var time=document.createElement('p');
      var hr1=hr=document.createElement('hr')
      from.innerHTML=email['sender'];
      from.appendChild(linebreak);
      from.style.display='inline-block';
      from.style.fontSize='15px';
      to.innerHTML=email['recipients'];
      to.appendChild(linebreak);
      to.style.display='inline-block';
      to.style.fontSize='15px';
      sub=email['subject'];
      bod.innerHTML=email['body'];
      bod.appendChild(linebreak);
      time.innerHTML=email['timestamp'];
      time.appendChild(linebreak);
      time.style.float='right';
      time.style.display='inline-block';
      var h1=document.createElement('h2');
      h1.innerHTML=''+sub;
      var divel=document.createElement('div');
      divel.append(h1);
      divel.append(`from: `,from);
      divel.append(time);
      divel.appendChild(linebreak);
      divel.append(`to: `,to);
      divel.appendChild(hr);
      divel.append(bod);
      divel.style.backgroundColor='white';
      if (mailbox=='inbox') {
        var reply=document.createElement('button');
        var but=document.createElement('button');
        reply.innerHTML='Reply';
        reply.className="btn btn-secondary";
        but.innerHTML='Archive';
        but.className="btn btn-secondary";
        but.style.float='right';
        divel.append(reply); 
        divel.append(but);
      }
      else if (mailbox=='archive') {
        var but=document.createElement('button');
        var reply=document.createElement('button');
        reply.innerHTML='Reply';
        reply.className="btn btn-secondary";
        but.innerHTML='Unarchive';
        but.className="btn btn-secondary";
        but.style.float='right';
        divel.append(reply);
        divel.append(but);
      }
      divel.style.border='solid #E0E0E0';
      divel.style.borderWidth='1px';
      divel.style.padding='2ch';
      document.querySelector('#load-mail').innerHTML='';
      document.querySelector('#load-mail').append(divel);
      if (but) {
        but.addEventListener('click', function() {
          fetch(`/emails/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                archived: !email['archived']
            })
          })
          setTimeout(function() { load_mailbox('inbox'); }, 200)
        });
      }
      if (reply) {
          reply.addEventListener('click', function() {
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          document.querySelector('#load-mail').style.display='none';
          document.querySelector('#compose-recipients').value=email['sender'];
          document.getElementById("compose-recipients").disabled = true;
          if (email['subject'].includes('Re')) {
            document.getElementById('compose-subject').value='';
            document.getElementById('compose-subject').value=email['subject'];
            document.getElementById("compose-subject").disabled = true;
          }
          else {
            document.getElementById('compose-subject').value=`Re: `+email['subject'];
            document.getElementById("compose-subject").disabled = true;
          }
          document.getElementById('compose-body').value='';
          document.getElementById('compose-body').value=`"On ${email['timestamp']} ${email['sender']} wrote: ${email['body']}" ${linebreak.innerHTML}`
        });
      }
    });
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
}
function send_mail() {
  const res= document.querySelector('#compose-recipients').value;
  const sub= document.querySelector('#compose-subject').value;
  const bod= document.querySelector('#compose-body').value;
  fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: res,
        subject: sub,
        body: bod
    })
  })
  .then(response => response.json())
  .then(result => {
      console.log(result);
  });
  setTimeout(function() { load_mailbox('sent'); }, 200)
  return false;
}    
