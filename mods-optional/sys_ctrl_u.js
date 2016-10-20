/*****************************************************************************
                 CTRL-U Replacement for Synchronet
------------------------------------------------------------------------------
FILE NAME : sys_ctrl_u.js
VERSION   : 1.1
CREATED BY: Michael J. Ryan (tracker1[at]theroughnecks.net)
CREATED ON: 2003-01-07
MODIFIED ON: 2016-10-19
------------------------------------------------------------------------------
INSTALLATION:
	in SCFG->External Programs->Online Hot Key Events
	Add an event for U
	command line: ?sys_ctrl_u.js

NOTES:
    if there is a shell_ctrl_u.js (where shell is the user's shell)
    it will run the shell's ctrlp, otherwise, will display the default.

    will display a ../text/ctrl_u_header.msg if there is one.
*****************************************************************************/

var shell_ctrl_u = user.command_shell.toLowerCase() + "_ctrl_u.js"
if (file_exists(system.exec_dir + "/" + shell_ctrl_u))
	bbs.exec("?"+shell_ctrl_u);
else if (file_exists(system.mods_dir + "/" + shell_ctrl_u))
	bbs.exec("?"+shell_ctrl_u);
else {
	var ctrl_u_header = system.text_dir + "ctrl_u_header.msg";
	if (file_exists(ctrl_u_header))
		console.printfile(ctrl_u_header);
	console.line_counter = 0; //reset line counter
	bbs.whos_online();
}