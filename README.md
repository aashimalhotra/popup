# popup
email registration popup
Default behaviour of this popup is to diapkay a popup to register email before a user leaves your site. You can also call it on any other event like onclick, onmouseover etc.
1) Include the css and javacsript file of popup in your code
2) Create a new object with some parameters like defaultBehaviour,callback and theme.

Example:

var object = new popupPlug({callback: onClose, defaultBehaviour: 'on', theme='light'});

3) Call the open function to display the popup if you are not using the default behaviour.

document.getElementById("popupButton").onclick=function(){
	object.open();
};
