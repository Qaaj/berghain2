(function(anatomy) {

	'use strict';

    var ClickzoneView = function(scope, dispatcher,element,lo,clickzone_model,scene_model) {

		lo.g("CLICKZONE","Clickzone view initiated",element);

		// Hide all clickzones
    	dispatcher.addEventListener('hide_clickzones', function(event) {
    		lo.g("CLICKZONE","Hiding all clickzones");
    		for (var i = 0; i < clickzone_model.clickzones.length; i++) {
    			var element = clickzone_model.clickzones[i].element;
    			$(element).hide();
    		};
    	});

    	// Show clickzones for a specific scene
    	dispatcher.addEventListener('show_clickzones', function(event) {
    		lo.g("CLICKZONE","Showing clickzones for " + event.params.name);

    		for (var i = 0; i < event.params.clickzones.length; i++) {
    			var element = event.params.clickzones[i].element;
    			$(element).show();
    		};
    	});

    	dispatcher.addEventListener('clickzone_hover_in', function(event) {
    		var clickzoneName = $(event.params).attr("id").split("_")[1];
    		lo.g("CLICKZONE","Showing overlay for clickzone " + clickzoneName);
 			$(element).css("background-image", "url('img/overlays/" + clickzoneName + ".png')");
      		$(element).css("background-size", "cover");
    	});


    

    	dispatcher.addEventListener('clickzone_hide_overlay', function(event) {
    		lo.g("CLICKZONE","Hiding current overlay");
    		$(element).css("background-image", ""); 
    	});




		// Change to different scene
		scope.goScene = function(event, id, params) {

			lo.g("USER","User has clicked a clickzone going to a scene");
			// It's a scene coming up
			var sceneName= $(event.target).attr("id").split("_")[1];
			var scene = scene_model.scenes[sceneName];

			lo.g("SCENE","Scene clickzone clicked: " +sceneName);

			dispatcher.dispatch("goto_scene",scene);
			
			

		};

		// CHANGE MENU 
		scope.goContent = function(event, id, params) {

			lo.g("USER","User has clicked a clickzone going to content");

			// It's content coming up
			var contentName = $(event.target).attr("id").split("_")[1];
			
			lo.g("CONTENT","Content clickzone clicked: " +contentName);
		
			

		};

		

    };

	anatomy.ClickzoneView = ClickzoneView;

})(window.anatomy = window.anatomy || {});