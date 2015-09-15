//CTRL-U replacement for S3's shell, requires sys_ctrl_u from the
// s3 utilities.

load("sbbsdefs.js");

function print_node_inuse(n) {
	var node = system.node_list[n];
	var oUser = new User(node.useron);
	
	var login = new Date(oUser.logontime * 1000);
	var timeon = (new Date()).valueOf() - login;
	var hrs = parseInt(timeon/3600000);
	var min = parseInt(timeon/60000) - (hrs*60);
	var flags = "";
	var sflags = "";
	
	action = format(NodeAction[node.action],node.aux);
	switch (node.action) {
		case NODE_XTRN:
			action = format("running %s",oUser.curxtrn);
			break;
	}
	
	printf(
		"\1n\1h\1y%3ld  \1w%-20s \1h\1b%02ld%1s \1n%-20s \1h\1b%-22s \1b%02ld:%02ld\1n\r\n",
		n+1,oUser.alias,oUser.age,oUser.gender,oUser.location,
		action,hrs,min
		);
}

function main() {
	var ctrl_u_header = system.text_dir + "menu/" + user.command_shell + "/ctrl_u_header.msg";
	console.line_counter = 0; //reset line counter
	
	if (file_exists(ctrl_u_header))
		console.printfile(ctrl_u_header);
	else {
		console.print("\r\n\1n\1cNode User                 A:S Location             Status                 On\r\n")
		console.print("\1nÄÄÄÄ ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ ÄÄÄ ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ ÄÄÄÄÄ\1n\r\n")
	}

	for (var n=0; n<system.node_list.length; n++) {
		switch (system.node_list[n].status) {
			case NODE_LOGON:
				printf("%3ld  Logging in...\r\n",n+1);
				break;
			case NODE_NEWUSER:
				printf("%3ld  New user...\r\n",n+1);
				break;
			case NODE_QUIET: //invisible
				if (user.security.level < 90)
					break; //if not a sysop, don't show quiet nodes.
			case NODE_INUSE:
					print_node_inuse(n);
			default:
				//show nothing
		}
	}
	console.print("\1n\1h\1kÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ\1n\r\n");

}
main();