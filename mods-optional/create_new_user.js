/*****************************************************************************
                       Synchronet 3 Create New User Module
------------------------------------------------------------------------------
FILE NAME : create_new_user.js
CREATED BY: Michael J. Ryan (tracker1[at]theroughnecks.net)
CREATED ON: 2003-01-07
------------------------------------------------------------------------------
This file requires Synchronet v3.10g or newer.

This module will walk through a new user creation, and will email the password
to the user, instead of prompting for it... (telnet validation).

to use in your login.js
bbs.newuser = new Function("bbs.exec('?create_new_user.js');return false;");

for login.baja .. make sure to *NOT* login/on the user
exec "?create_new_user.js"


Changes by Merlin to stop it creating a temp user, only make it save to user
database when the entries are all done. It also fixes the bug that stops
users with a single username alias not being able to log on.

Also changed the password message.

*****************************************************************************/
load("sbbsdefs.js");
load("inc_dates.js");

// Global user object, to store information, status set to deleted.
newinfo = {}; //to temporarily store new user info.

//checks for an existing user with the value given
//   ex. checkForUser("alias","myUsername");
function checkForUser(info,value) {
	var oUser = new User(0);
	for (var i=1; i<=system.stats.total_users; i++) {
		oUser.number = i;
		
		if (!(oUser.settings&USER_DELETED)) {
			var info_chk = eval("oUser."+info);
			if (info_chk.replace(/\W/g,"").toLowerCase() == value.replace(/\W/g,"").toLowerCase())
				return true;
		}
	}
	return false;
}

//get the alias/username
function getAlias() {
	if (!newinfo.alias)
		 newinfo.alias = "";
	
	while(bbs.online) {
		console.print(bbs.text(338));
		 newinfo.alias = console.getstr( newinfo.alias,25,K_UPRLWR|K_LINE|K_EDIT)
		if ( newinfo.alias == "") {
			if (!console.noyes("Abort new user creation")) {
				 newinfo.abort = true;
				return;
			}
		} else if (!newinfo.alias.match(/^[a-z][\w\.\_' -]{1,}$/i))
			console.print("\1n    Must begin with a letter, and contain only letters, numbers and spaces.\1n\r\n\r\n");
		else if (checkForUser("alias", newinfo.alias))
			console.print("\1n    A user with that name already exists.\1n\r\n\r\n");
		else
			return;
	}
}

function getHandle() {
	if (! newinfo.handle)
		 newinfo.handle =  newinfo.alias.substr(0,8);
	var save = false;
	
	while(bbs.online && !save) {
		console.print(bbs.text(341));
		 newinfo.handle = console.getstr(newinfo.handle,8,K_LINE|K_EDIT)
		if (newinfo.handle == "") {
			if (!console.noyes("Abort new user creation")) {
				newinfo.abort = true;
				return;
			}
		} else if (!newinfo.handle.match(/^[a-z][\w ]{2,}$/i))
			console.print("\1n    Must begin with a letter, and contain only letters, numbers and spaces.\1n\r\n\r\n");
		else if (checkForUser("handle",newinfo.handle))
			console.print("\1n    A user with that chat handle already exists.\1n\r\n\r\n");
		else
			save = true;
	}
}

function getName() {
	if (!newinfo.name)
		newinfo.name = "";
	var save = false;
	
	while (bbs.online && !save) {
		console.print(bbs.text(339));
		newinfo.name = console.getstr(newinfo.name,25,K_LINE|K_EDIT|K_UPRLWR)
		if (newinfo.name == "") {
			if (!console.noyes("Abort new user creation")) {
				newinfo.abort = true;
				return;
			}
		} else if (!newinfo.name.match(/^[a-z][a-z-]+ [a-z][a-z\.\_' -]*$/i))
			console.print("\1n    First and Last name, only letters, spaces, and \"'.-\".\1n\r\n\r\n");
		else if (checkForUser("name",newinfo.name))
			console.print("\1n    A user with that name already exists.\1n\r\n\r\n");
		else
			save = true;
	}
}

function getDOB() {
	var now = new Date();
	
	if (!newinfo.dob)
		newinfo.dob = now.formatDate("yyyy-mm-dd");
	
	var y = parseInt(newinfo.dob.split("-")[0]);
	var m = parseInt(newinfo.dob.split("-")[1]);
	var d = parseInt(newinfo.dob.split("-")[1]);
	var this_year = parseInt(now.formatDate("yyyy"));
	
	console.print("\1h\1b[\1cû\1b]\1y Enter your date of birth:\r\n");
	do {
		console.print("\1n    Year : ");
		y = console.getstr(y.toString(),4,K_LINE|K_EDIT|K_NUMBER|K_AUTODEL);
		y = (isNaN(y))?1900:parseInt(y);
		if (y<=1900 || y>=this_year)
			console.print("\1n    Enter a full year (ex. 1975).\1n\r\n");
	} while (bbs.online && (y<1900 || y>=this_year));

	do {
		console.print("\1n    Month: ");
		m = console.getstr(m.toString(),2,K_LINE|K_EDIT|K_NUMBER|K_AUTODEL);
		m = (isNaN(m))?0:parseInt(m);
		if (m<1 || m>12)
			console.print("\1n    Enter a numeric month (1-12).\1n\r\n");
	} while (bbs.online && (m<1 || m>12));
	
	var max_d = (new Date(y,m,0,0,0,0,0)).formatDate("d");
	do {
		console.print("\1n    Day  : ");
		d = console.getstr(d.toString(),2,K_LINE|K_EDIT|K_NUMBER|K_AUTODEL);
		d = (isNaN(d))?0:parseInt(d);
		if (d<1 || d>max_d)
			console.print("\1n    Enter a numeric day (1-"+max_d+").\1n\r\n");
	} while (bbs.online && (d<1 || d>max_d));
		
	newinfo.dob = (new Date(y,m-1,d,0,0,0,0)).formatDate("yyyy-mm-dd");
}

function getGender() {
	console.print(bbs.text(342))
	newinfo.gender = console.getkeys("MF");
}

function getLocation() {
	if (!newinfo.location)
		newinfo.location = "";
	
	do {
		console.print(""+bbs.text(346));
		newinfo.location = console.getstr(newinfo.location,30,K_LINE|K_EDIT|K_NOEXASC|K_UPRLWR);
		
		if (newinfo.location == "") {
			if (!console.noyes("Abort new user creation")) {
				newinfo.abort = true;
				return;
			}
		} else
			return;
	} while (bbs.online && !newinfo.location);
}

function getEmail() {
	if (!newinfo.email)
		newinfo.email = "";
		
	while (bbs.online) {
		console.print("\1n\1h\1b[\1cû\1b] \1yPlease enter your email address:\r\n    \1n")
		newinfo.email = console.getstr(newinfo.email,60,K_LINE|K_EDIT).toLowerCase();
		
		if (newinfo.email.match(/^[a-z0-9][\w\.\_-]*@[a-z0-9][\w\.\_-]+\.[a-z]{2,7}$/)) {
			console.print("\1n\1h\1b[\1cû\1b] \1yPlease confirm your email address:\r\n    \1n")
			if (console.getstr("",60,K_LINE|K_EDIT).toLowerCase() == newinfo.email) {
				if (system.settings&SYS_FWDTONET)
					newinfo.emailforward = console.yesno("\r\n"+bbs.text(499));
				else
					newinfo.emailforward = false;
				return;
			} else
				console.print("    Email addresses don't match.\1n\r\n\r\n");
		} else
			console.print("    Please enter a VALID email address.\r\n\r\n");
	}
}

function saveNewUser(pwd) {
	var usr = system.new_user(newinfo.alias);
	usr.alias = newinfo.alias;
	usr.handle = newinfo.handle;
	usr.name = newinfo.name;
	
	var dob = newinfo.dob.split("-");
	dob = new Date(dob[0],dob[1]-1,dob[2],0,0,0,0)
	if (system.settings&SYS_EURODATE)
                usr.birthdate = dob.formatDate("dd/mm/yy");
	else
                usr.birthdate = dob.formatDate("mm/dd/yy");

        usr.gender = newinfo.gender;
        usr.location = newinfo.location;


	usr.security.password=pwd;	

        usr.netmail = newinfo.email
	if (newinfo.emailforward)
                usr.settings |= USER_NETMAIL;
	else
                usr.settings &= ~USER_NETMAIL;
	
	usr.settings |= USER_AUTOTERM;

	console.print("\1nSaved #"+ usr.number + " " + usr.alias + "\r\n");
	log("Saved #"+ usr.number + " " + usr.alias);
}

function sendPassword(pwd) {
	var mail = new MsgBase("mail");
	if(mail.open!=undefined && mail.open()==false) {
		var err_msg = "!ERROR " + msgbase.last_error;
		console.print(err_msg);
		log(err_msg);
		exit();
	}
	
	var hdr = {
		from:system.name,
		from_net_addr:"sysop"+system.inetaddr,
		to:newinfo.alias,
		to_net_addr:newinfo.email,
		subject:"Your password for " + system.name + "!",
		to_net_type:NET_INTERNET
		}
		
	var msg = "" +
		"Welcome to "+system.name+"!\r\n"+
		"\r\n"+
		"You have received this email because someone logged on as a new user\r\n" +
		"and entered this email address for verification.\r\n" +
		"\r\n" +
		"You now need to reconnect to "+system.name+" and log on using the following:\r\n\r\n"+
		"USERNAME: "+newinfo.alias+"\r\n" +
		"PASSWORD: "+pwd+"\r\n\r\n"+
		"\r\n"+
		"telnet://"+system.inetaddr+"\r\n";
		
	if (!mail.save_msg(hdr,msg)) {
		var err_msg = "!ERROR " + msgbase.last_error + " saving mail.";
		console.print(err_msg);
		log(err_msg);
		exit();
	}

/* uncomment, to send a notice to the sysop
	hdr = {
		to: 'sysop',
		to_ext: '1',
		from: system.name,
		subject: "New User Information"
		};
	
	msg = "" +
		"Alias         : "+newinfo.alias+"\r\n" +
		"Real name     : "+newinfo.name+"\r\n" +
		"Chat handle   : "+newinfo.handle+"\r\n" +
		"Location      : "+newinfo.location+"\r\n" +
		"Gender        : "+((newinfo.gender=="F")?"Female":"Male")+"\r\n" +
		"Date of birth : "+newinfo.dob+"\r\n" +
		"Email         : "+newinfo.email+((newinfo.emailforward)?" (forwarded)":"")+"\r\n";
	mail.save_msg(hdr,msg);
*/

	console.print("\1nYour password has been sent to \1h\1w"+newinfo.email+"\n\r\n");
	log("Password sent to " + newinfo.alias + " at " + newinfo.email);
}


function showInfo() {
	console.print("\r\n\r\n");
	console.print("\1h\1bAlias         \1k: \1n"+newinfo.alias+"\r\n");
	console.print("\1h\1bReal name     \1k: \1n"+newinfo.name+"\r\n");
	console.print("\1h\1bChat handle   \1k: \1n"+newinfo.handle+"\r\n");
	console.print("\1h\1bLocation      \1k: \1n"+newinfo.location+"\r\n");
	console.print("\1h\1bGender        \1k: \1n"+((newinfo.gender=="F")?"Female":"Male")+"\r\n");
	console.print("\1h\1bDate of birth \1k: \1n"+newinfo.dob+"\r\n");
	console.print("\1h\1bEmail         \1k: \1n"+newinfo.email+((newinfo.emailforward)?" (forwarded)":"")+"\r\n");
	console.print("\r\n");
}

function main() {
	bbs.user_event(EVENT_NEWUSER);
	system.node_list[bbs.node_num-1].status = NODE_NEWUSER;
	newinfo.saved = false;
	newinfo.abort = false;
		
	while (bbs.online && !(newinfo.abort||newinfo.saved)) {
		if (!newinfo.abort) getAlias();
		if (!newinfo.abort) getHandle();
		if (!newinfo.abort) getName();
		if (!newinfo.abort) getLocation();
		if (!newinfo.abort) getGender();
		if (!newinfo.abort) getDOB();
		if (!newinfo.abort) getEmail();
		
		if (newinfo.abort)
			console.print("\r\n\r\n\1h\1rAborted.\1n\r\n\r\n");
		else if (newinfo.email) {
			showInfo();
			if (console.yesno("Is this information correct (password will be emailed)")) {
				console.print("\1n");
				var passwd = parseInt(Math.random()*1000000000000).toString(36).toUpperCase().substr(0,8);
				saveNewUser(passwd);
				sendPassword(passwd);
				return;
			} else if (!console.noyes("Abort new user creation")) {
				return;
			}
		}
	}
}
main();
console.pause();
