var mainSidebar;

function appInit() {
	
	// init sidebar
	mainSidebar = new dhtmlXSideBar({
		parent: document.body,
		icons_path: "imgs/sidebar/",
		width: 180,
		template: "tiles",
		autohide: true,
		header: true,
		offsets: {top: 0, right: 0, bottom: 0, left: 0},
		items: [
			{id: "contacts", text: "Contacts", icon: "contacts.png"},
			{id: "ocnodeinfo", text: "ocnodes", icon: "contacts.png"},
			{id: "projects", text: "Projects", icon: "projects.png"},
			{id: "events",   text: "Events",   icon: "events.png"  },
			{id: "settings", text: "Settings", icon: "settings.png"}
		]
	});
	
	mainSidebar.attachEvent("onSelect", function(id){
		window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
	});
	
	mainSidebar.cells("contacts").setActive(true);
	
}

function appUnload() {
	if (mainSidebar != null && mainSidebar.unload != null) {
		mainSidebar.unload();
		mainSidebar = null;
	}
}

window.dhx4.attachEvent("init", appInit);
window.dhx4.attachEvent("unload", appUnload);
