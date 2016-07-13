var ocnodeinfoGrid;
var ocnodeinfoGridToolbar;
var ocnodeinfoCarousel;
var ocnodeinfoForm;
var ocnodeinfoFormToolbar;

function ocnodeinfoInit(cell) {
	
	if (ocnodeinfoCarousel == null) {
		
		// init carousel
		ocnodeinfoCarousel = cell.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});
		ocnodeinfoCarousel.hideControls();
		ocnodeinfoCarousel.addCell("grid");
		ocnodeinfoCarousel.addCell("form");
		
		// attach grid
		ocnodeinfoGrid = ocnodeinfoCarousel.cells("grid").attachGrid();
		//ocnodeinfoGrid.load(A.server+"ocnodeinfo.xml?type="+A.deviceType);
		ocnodeinfoGrid.load("/command/grid/ocgetnode/cluster-admin");
		ocnodeinfoGrid.attachEvent("onRowSelect", ocnodeinfoFillForm);
		
		// attach grid toolbar
		ocnodeinfoGridToolbar = ocnodeinfoCarousel.cells("grid").attachToolbar({
			icons_size: 32,
			icons_path: "imgs/toolbar/",
			items: [
			]
		});
		
		ocnodeinfoInitForm();
		
	} else {
		ocnodeinfoCarousel.cells("grid").setActive();
	}
	
}

function ocnodeinfoInitForm() {
	
	// attach form
	ocnodeinfoForm = ocnodeinfoCarousel.cells("form").attachForm([
		{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160, offsetLeft: 0},
		{type: "input", name: "NAME",    label: "NAME", offsetTop: 20},
		{type: "input", name: "STATUS",   label: "STATUS"},
		{type: "input", name: "AGE",   label: "AGE"},
                {type: "combo", label: "PROCESS", name: "PROCESS",readonly: "1", options:[
					{text: "restart machine", value: "restartmachine"},
					{text: "restart docker", value: "restartdocker"},
					{text: "restart ocnode", value: "restartocnode"},
					{text: "restart ovs", value: "restartovs"}
				]},
                {type: "button",name: "click", value: "Yes"}                
	]);
	ocnodeinfoForm.setSizes = ocnodeinfoForm.centerForm;
	
	// attach form toolbar
	ocnodeinfoFormToolbar = ocnodeinfoCarousel.cells("form").attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "button", id: "back", img: "back.png"},
			{type: "spacer"},
			{type: "button", id: "save", img: "save.png"},
			{type: "button", id: "remove", img: "remove.png"}
		]
	});

        ocnodeinfoForm.attachEvent("onButtonClick", function(id){
             alert(id);
             ocnodeinfoForm.getItemValue("NAME", true);
             ocnodeinfoForm.getItemValue("PROCESS", true);
             dhx.ajax.get(
                 url="/command/exec/" + ocnodeinfoForm.getItemValue("PROCESS", true) + "/" + ocnodeinfoForm.getItemValue("NAME", true),
                 call=function(text, xml, xhr){
                       //response
                       alert(text);
                  } 
             )


        });
	ocnodeinfoFormToolbar.attachEvent("onClick", function(id){
		switch (id) {
			case "back":
				ocnodeinfoCarousel.cells("grid").setActive();
				break;
		}
	});
}

function ocnodeinfoFillForm(id) {
	// init form on demand
	if (ocnodeinfoForm == null) {
		ocnodeinfoInitForm();
	}
	// update form
	var data = ocnodeinfoForm.getFormData();
	for (var a in data) {
		var index = ocnodeinfoGrid.getColIndexById(a);
		if (index != null && index >=0) data[a] = String(ocnodeinfoGrid.cells(id, index).getValue()).replace(/\&amp;?/gi,"&");
	}
	ocnodeinfoForm.setFormData(data);
	// change photo
	//var img = ocnodeinfoGrid.cells(id, ocnodeinfoGrid.getColIndexById("photo")).getValue(); // <img src=....>
	//var src = img.match(/src=\"([^\"]*)\"/)[1];
	//ocnodeinfoForm.getContainer("photo").innerHTML = "<img src='imgs/ocnodeinfo/big/"+src.match(/[^\/]*$/)[0]+"' border='0' class='form_photo'>";
	// scroll to form
	ocnodeinfoCarousel.cells("form").setActive();
}

function ocnodeinfoGridBold(r, index) {
	ocnodeinfoGrid.setCellTextStyle(ocnodeinfoGrid.getRowId(index), ocnodeinfoGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
	ocnodeinfoGrid.setCellTextStyle(ocnodeinfoGrid.getRowId(index), ocnodeinfoGrid.getColIndexById("photo"), "border-right-width:0px;");
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "ocnodeinfo") ocnodeinfoInit(cell);
});
