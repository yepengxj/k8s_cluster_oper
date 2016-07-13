var eventsDataView;
var eventsDataViewToolbar;
var eventsCarousel;
var eventsMap;
var eventsMapToolbar;

function eventsInit(cell) {
	
	if (eventsCarousel == null) {
		
		// init carousel
		eventsCarousel = cell.attachCarousel({
			offset_item: 0,
			keys: false,
			touch_scroll: false
		});
		eventsCarousel.hideControls();
		eventsCarousel.addCell("dataview");
		eventsCarousel.addCell("details");
		
		eventsDataLayout = eventsCarousel.cells("dataview").attachLayout({
                    pattern: "2U"
                });
                eventsDataLayout.cells("a").hideHeader();
                eventsDataLayout.cells("b").hideHeader();
                eventsDataLayout.cells("a").fixSize(1, 0);
                eventsDataLayout.cells("a").setWidth(120);
                eventsDataLayout.cells("b").fixSize(1, 0);
                

		// attach dataview
		eventsDataView = eventsDataLayout.cells("a").attachList({
			type: {
				template: "<span class='dhx_strong'>#NAME#</span>"+
						"<span class='dhx_light'>#STATUS#</span>"+
						"<span class='dhx_light'>#AGE#</span>",
				margin: 1,
				height: "auto",
				padding: 5
			},
			autowidth: (A.deviceOrient=="portrait"?2:4),
			drag: false,
			select: true,
			edit: false
		});
		eventsDataView.load("/command/list/ocgetnode/cluster-admin");
		eventsDataView.attachEvent("onItemClick", function(id){
		},200);
		
		// attach datview toolbar
		//eventsDataViewToolbar = eventsDataLayout.cells("datalist").attachToolbar({
		eventsDataViewToolbar = eventsDataLayout.attachToolbar({
			icons_size: 32,
			icons_path: "imgs/toolbar/",
			items: [
				{type: "button", id: "add", img: "add.png"}
			]
		});
		
	} else {
		eventsDataLayout.cells("datalist").setActive();
	}
	
}


window.dhx4.attachEvent("onSidebarSelect", function(id, cell){
	if (id == "events") eventsInit(cell);
});

window.dhx4.attachEvent("onOrientationChange", function(deviceOrient){
	if (eventsDataView != null) {
		eventsDataView.config.autowidth = (deviceOrient=="portrait"?2:4);
		eventsDataView.refresh();
	}
});
