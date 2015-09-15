/*****************************************************************************
                 CTRL-P Replacement for Synchronet
------------------------------------------------------------------------------
FILE NAME : sys_ctrl_p.js
VERSION   : 1.0
CREATED BY: Michael J. Ryan (tracker1[at]theroughnecks.net)
CREATED ON: 2003-01-07
------------------------------------------------------------------------------
INSTALLATION:
	in SCFG->External Programs->Online Hot Key Events
	Add an event for P
	command line: ?sys_ctrl_p.js
	
NOTES:
    if there is a SHELL_CTRL_P.JS (where shell is the user's shell)
    it will run the shell's ctrlp, otherwise, will display the default.
    
    will display a ../text/ctrl_p_header.msg if there is one.
*****************************************************************************/

var shell_ctrl_p = user.command_shell + "_ctrl_p.js"
if (file_exists(system.exec_dir + "/" + shell_ctrl_p))
	bbs.exec("?"+shell_ctrl_p);
else {
	var ctrl_p_header = system.text_dir + "ctrl_p_header.msg";
	if (file_exists(ctrl_p_header))
		console.printfile(ctrl_p_header);
	console.line_counter = 0; //reset line counter
	bbs.private_message();
}