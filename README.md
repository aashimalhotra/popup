# popup
email registration popup
Default behaviour of this popup is to display a popup to register email before a user leaves your site. You can also call it on any other event like onclick, onmouseover etc.
1) Include the css file in your code
			@import url("pathToFile/popupDesign.css");
					or
			<link rel="stylesheet" href="pathToFile/popupDesign.css">
2) Include javacsript file of popup in your code

			<script type="text/javascript" src="pathToFile/index.js"></script>

3) Create a new object with some parameters like defaultBehaviour,callback and theme.

Example:

			var object = new popupPlug({callback: onClose, defaultBehaviour: 'on', theme='red'});

			callback: The function you want to call when the popup returns the user details.
			defaultBehaviour: You can turn on or turn off the default behaviour.
			theme: As of now only red and orange themes are implemented.

You can also pass some extra parameters such as the main heading,para just below heading and the text on the close aur submit button. For all these use the following variables: mainHeading,para,submitText,closeText.

4) Call the open function to display the popup if you are not using the default behaviour.

			document.getElementById("popupButton").onclick=function(){
				object.open();
			};

5) Return the status of registration from the callback. If the status is success a thankyou message will be shown. If the user is already subscribed message will be shown that user is already subscribed. If some error occurs the popup will not close. 

6) In mobile this popup opens when user has scrolled the page over 70%.
