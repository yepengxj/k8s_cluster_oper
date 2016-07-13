var settingsDataView;
var settingsDataViewToolbar;
var settingsCarousel;
var settingsForm;
var settingsFormToolbar;

function settingsInit(cell) {
	
	if (settingsCarousel == null) {
		
		// init carousel
		settingsCarousel = cell.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});
		settingsCarousel.hideControls();
		settingsCarousel.addCell("dataview");
		settingsCarousel.addCell("details");
		
		// attach dataview
		settingsDataView = settingsCarousel.cells("dataview").attachDataView({
			type: {
				template: "<div style='position:relative;'>"+
						"<div class='settings_image'><img src='imgs/settings/#image#' border='0' ondragstart='return false;'></div>"+
						"<div class='settings_title'>#title#"+
							"<div class='settings_descr'>#descr#</div>"+
						"</div>"+
						"</div>",
				margin: 5,
				padding: 10,
				height: 100
			},
			autowidth: (A.deviceOrient=="portrait"?1:2),
			drag: false,
			select: true,
			edit: false
		});
		settingsDataView.load(A.server+"settings.xml?type="+A.deviceType);
		settingsDataView.attachEvent("onItemClick", settingsFormFill);
		
		// attach datview toolbar
		settingsDataViewToolbar = settingsCarousel.cells("dataview").attachToolbar({
			icons_size: 32,
			icons_path: "imgs/toolbar/",
			items: [
				{type: "button", id: "add", img: "add.png"}
			]
		});
		
		
	} else {
		settingsCarousel.cells("dataview").setActive();
	}
	
}

function settingsInitForm() {
	
	// attach form
	settingsForm = settingsCarousel.cells("details").attachForm();
	settingsForm.setSizes = settingsForm.centerForm;
	
	// attach toolbar
	settingsFormToolbar = settingsCarousel.cells("details").attachToolbar({
		icons_size: 32,
		icons_path: "imgs/toolbar/",
		items: [
			{type: "button", id: "back", img: "back.png"}
		]
	});
	settingsFormToolbar.attachEvent("onClick", function(id){
		switch (id) {
			case "back":
				settingsCarousel.cells("dataview").setActive();
				break;
		}
	});
	
}

function settingsFormFill(id) {
	
	// init settings form on demand
	if (settingsForm == null) settingsInitForm(); else settingsForm.removeItem("zero");
	
	settingsForm.loadStruct([
		{type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160},
		{type: "block", width: "auto", blockOffset: 0, name: "zero", list: settingsFormStruct[id]}
	]);
	settingsForm.setSizes();
	
	// add small timeout for select effect
	window.setTimeout(function(){
		settingsCarousel.cells("details").setActive();
	},200);
	
}

window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "settings") settingsInit(cell);
});

window.dhx4.attachEvent("onBeforeUnload", function(){
	if (settingsForm != null) {
		settingsForm.unload();;
		settingsForm = null;
	}
});

window.dhx4.attachEvent("onOrientationChange", function(deviceOrient){
	if (settingsDataView != null) {
		settingsDataView.config.autowidth = (deviceOrient=="portrait"?1:2);
		settingsDataView.refresh();
	}
});