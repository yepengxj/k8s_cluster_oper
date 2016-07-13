var contactsGrid;
var contactsGridToolbar;
var contactsCarousel;
var contactsForm;
var contactsFormToolbar;

function contactsInit(cell) {
	
	if (contactsCarousel == null) {
		
		// init carousel
		contactsCarousel = cell.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});
		contactsCarousel.hideControls();
		contactsCarousel.addCell("grid");
		contactsCarousel.addCell("form");
		
		// attach grid
		contactsGrid = contactsCarousel.cells("grid").attachGrid();
		//contactsGrid.load(A.server+"contacts.xml?type="+A.deviceType);
		contactsGrid.load("/command/grid/dockerimages/cluster-admin");
		contactsGrid.attachEvent("onRowSelect", contactsFillForm);
		contactsGrid.attachEvent("onRowInserted", contactsGridBold);
		
		// attach grid toolbar
		contactsGridToolbar = contactsCarousel.cells("grid").attachToolbar({
			icons_size: 32,
			icons_path: "imgs/toolbar/",
			items: [
				{type: "button", id: "add", img: "add.png"}
			]
		});
		
		contactsInitForm();
		
	} else {
		contactsCarousel.cells("grid").setActive();
	}
	
}

function contactsInitForm() {
	
	// attach form
	contactsForm = contactsCarousel.cells("form").attachForm([
		{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160, offsetLeft: 0},
		{type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65},
		{type: "input", name: "name",    label: "Name", offsetTop: 20},
		{type: "input", name: "email",   label: "E-mail"},
		{type: "input", name: "phone",   label: "Phone"},
		{type: "input", name: "company", label: "Company"},
		{type: "input", name: "info",    label: "Additional info"}
	]);
	contactsForm.setSizes = contactsForm.centerForm;
	
	// attach form toolbar
	contactsFormToolbar = contactsCarousel.cells("form").attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "button", id: "back", img: "back.png"},
			{type: "spacer"},
			{type: "button", id: "save", img: "save.png"},
			{type: "button", id: "remove", img: "remove.png"}
		]
	});
	contactsFormToolbar.attachEvent("onClick", function(id){
		switch (id) {
			case "back":
				contactsCarousel.cells("grid").setActive();
				break;
		}
	});
}

function contactsFillForm(id) {
	// init form on demand
	if (contactsForm == null) {
		contactsInitForm();
	}
	// update form
	var data = contactsForm.getFormData();
	for (var a in data) {
		var index = contactsGrid.getColIndexById(a);
		if (index != null && index >=0) data[a] = String(contactsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi,"&");
	}
	contactsForm.setFormData(data);
	// change photo
	var img = contactsGrid.cells(id, contactsGrid.getColIndexById("photo")).getValue(); // <img src=....>
	var src = img.match(/src=\"([^\"]*)\"/)[1];
	contactsForm.getContainer("photo").innerHTML = "<img src='imgs/contacts/big/"+src.match(/[^\/]*$/)[0]+"' border='0' class='form_photo'>";
	// scroll to form
	contactsCarousel.cells("form").setActive();
}

function contactsGridBold(r, index) {
	contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
	contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("photo"), "border-right-width:0px;");
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "contacts") contactsInit(cell);
});
