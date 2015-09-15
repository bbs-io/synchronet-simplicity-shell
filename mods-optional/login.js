/*****************************************************************************
                         Synchronet 3 Login Module
------------------------------------------------------------------------------
FILE NAME : login.js
CREATED BY: Michael J. Ryan (tracker1[at]theroughnecks.net)
CREATED ON: 2002-11-15
------------------------------------------------------------------------------
This file requires Synchronet v3.10g or newer.
Make text/answer.asc a blank file, this uses text/menu/s3/s3_login.asc
*****************************************************************************/

load("sbbsdefs.js"); //load sbbsdefs
load("inc_dates.js"); //load date handling functions

//rem out this line to use the default new user creation
bbs.newuser = new Function("bbs.exec('?create_new_user.js');return false;");

function showPreLogin() {
	//clear counter, clear screen, and display s3_login from the menu/s3 folder
	console.line_counter = 0;	//clear line counter
	console.clear();			//clear screen
	bbs.menu("s3/login");		//display login header

	//display stats
	console.print("\1h\1w  SERVER\1b   NAME:\1w "+system.name+"\1k (\1n"+system.inetaddr+"\1h\1k)\r\n");
	console.print("\1h\1w        \1b  ADMIN:\1n "+system.operator+"\r\n");
	console.print("\1h\1w        \1b   SOFT:\1n "+system.version_notice+"\r\n");
	console.print("\1h\1w        \1b     OS:\1n "+system.os_version+"\r\n");
	console.print("\1h\1w        \1b   TIME:\1n " + (new Date()).formatDate("day month d, yyyy at h12:nn ap") + "\r\n\r\n"); /*.formatDate("yyyy-mm-dd hh:nnap")*/
	console.print("\1h\1w  CLIENT\1b   NODE:\1n "+bbs.node_num+" of "+system.node_list.length+"\r\n");
	console.print("\1h\1w        \1b   FROM:\1n "+client.host_name+"\1h\1k (\1n"+client.ip_address+"\1h\1k)\r\n");

	//display line
	console.print("\1h\1k컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴컴�\1n");
	console.line_counter = 0;	//clear line counter
}

function main() {
	bbs.logout(); //logout any existing user.
	showPreLogin(); //show prelogin header and stats.
	
	var logged_in = false;
	var user_name = "";
	var count = 0;
	while (bbs.online && (!logged_in) && (count < 5)) {
		system.node_list[bbs.node_num-1].status = NODE_LOGON; //set status to logging on.
		count++;
		
		//show login prompt
		if (system.matchuser("guest"))
			console.print("\r\n\1h\1bEnter Name, Number, '\1wNew\1b', or '\1wGuest\1b'\1n\r\nNN: ");
		else
			console.print("\r\n\1h\1bEnter Name, Number, or '\1wNew\1b'\1n\r\nNN: ");
		user_name = console.getstr(user_name,25,K_UPRLWR|K_LOWPRIO|K_E71DETECT|K_TAB).toUpperCase();
		
		if (user_name == "")
			continue;
			
		if (user_name == "NEW") {
			if (bbs.newuser())
				logged_in = true;
			else
				showPreLogin();
			continue;
		}
		
		logged_in = bbs.login(user_name,"PW: ");
	}
	
	if (logged_in)
		bbs.logon();
	else
		console.print("\r\n\1h\1yGoodbye!\r\n");
}


main(); //start main();