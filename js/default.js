$(document).ready(function() {

	// Default hide? Then unhide?
	$("#wrapper").hide();

	// Dragging Support for Spotify
	$('img').live('dragstart', function(event) { event.preventDefault(); });

});

// Launch Spotify API
var sp = getSpotifyApi(1),
	models      = sp.require("sp://import/scripts/api/models"),
	views       = sp.require("sp://import/scripts/api/views"),
	ui          = sp.require("sp://import/scripts/ui"),
	player      = models.player,
	library     = models.library,
	application = models.application,
	playerImage = new views.Player();

var googletracker = sp.require("sp://import/scripts/googletracker");
var tracker = new googletracker.GoogleTracker("UA-XXXXXXXX-X");

$(function(){
	App = new App();
	App.run();
	tracker.track("/startup"); // Tracks startup in GA?
});

// App/Player Controls?
player.observe(models.EVENT.CHANGE, function (e) {
	if (e.data.curtrack == true) {
		tracker.track("/track/listen/"+player.track.data.name);
	}
});

models.session.observe(models.EVENT.STATECHANGED, function() {
    console.log('session_state', models.session.state);
	switch (models.session.state) {
		case 2:
			App.offline();
		default:
			document.location.href = '?'+Math.random()*100;
	}
});

/* The App! */
var App  = (function() {

	var App = function() {
		this.template = $("#wrapper").html();
	};

	App.prototype.run = function() {
		self = this;

		$.getJSON('http://luisterpaalapp.sebask.me', function(data) {
			var items = [];

			$.each(data, function(key, album) {
				items.push('<li style="display:inline-block;width:150px;" id="' + album.artist + '"><img class="cover" src="http://images.poms.omroep.nl/image/s150/c150x150/s150x150/' + album.cover + '" /><a href="' + album.album_uri + '">' + album.artist + ' - ' + album.title + '</a></li>');
			});

			$('<ul/>', {
				'class': 'my-new-list',
				html: items.join('')
			}).appendTo('#wrapper');


		}).success(function(d) {

			// Everything went OK while getting and the JSON data
			//alert("success");
			$("#wrapper").show();

		}).error(function(d) {

			// Seems something went wrong while getting the JSON data :(
			alert("error");

		}).complete(function(d) {

			// We're done!
			//alert("complete");

		});

	};

	App.prototype.offline = function() {
		$("#wrapper").hide();
		$('#offline').show();
	}

	return App;

})();