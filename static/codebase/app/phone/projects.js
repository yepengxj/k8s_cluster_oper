var projectsGrid;
var projectsGridToolbar;
var projectsCarousel;
var projectsForm;
var projectsFormToolbar;

function projectsInit(cell) {
	
	if (projectsCarousel == null) {
		
		// init carousel
		projectsCarousel = cell.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});
		projectsCarousel.hideControls();
		projectsCarousel.addCell("grid");
		projectsCarousel.addCell("form");
		
		// attach grid
		projectsGrid = projectsCarousel.cells("grid").attachGrid();
		//projectsGrid.load(A.server+"projects.xml?type="+A.deviceType);
		projectsGrid.load("/command/grid/dockerps/cluster-admin");
		projectsGrid.attachEvent("onRowSelect", projectsFillForm);
		projectsGrid.attachEvent("onRowInserted", function(r, index){
			projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
		});
		
		// attach grid toolbar
		projectsGridToolbar = projectsCarousel.cells("grid").attachToolbar({
			icons_size: 32,
			icons_path: "imgs/toolbar/",
			items: [
				{type: "button", id: "add", img: "add.png"}
			]
		});
		
	} else {
		projectsCarousel.cells("grid").setActive();
	}
	
}

function projectsInitForm() {
	
	// attach form
	projectsForm = projectsCarousel.cells("form").attachForm([
		{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
		{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
		{type: "input", name: "due",     label: "Due date", offsetTop: 20},
		{type: "input", name: "project", label: "Project"},
		{type: "input", name: "status",  label: "Status"},
		{type: "input", name: "assign",  label: "Assigned to"},
		{type: "input", name: "info",    label: "Additional info"}
	]);
	projectsForm.setSizes = projectsForm.centerForm;
	projectsForm.getContainer("photo").innerHTML = "<img src='imgs/projects/project.png' border='0' class='form_photo'>";
	
	// attach form toolbar
	projectsFormToolbar = projectsCarousel.cells("form").attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "button", id: "back", img: "back.png"},
			{type: "spacer"},
			{type: "button", id: "save", img: "save.png"},
			{type: "button", id: "remove", img: "remove.png"}
		]
	});
	projectsFormToolbar.attachEvent("onClick", function(id){
		switch (id) {
			case "back":
				projectsCarousel.cells("grid").setActive();
				break;
		}
	});
	
}

function projectsFillForm(id) {
	// init form on demand
	if (projectsForm == null) {
		projectsInitForm();
	}
	// update form
	var data = projectsForm.getFormData();
	for (var a in data) {
		var index = projectsGrid.getColIndexById(a);
		if (index != null && index >=0) data[a] = String(projectsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi,"&");
	}
	projectsForm.setFormData(data);
	
	// scroll to form
	projectsCarousel.cells("form").setActive();
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "projects") projectsInit(cell);
});
