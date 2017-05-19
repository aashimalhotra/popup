var popupPlug=(function(){
    var Popup=function()
    {
        //element references
        this.closeButton = null;
        this.trigger=false;
        this.pop=null;
        this.popup = null,this.popupContact=null;

        // default parameters if user does not provide
        var defaults = {
            closeButton: true,
            form: {email: ""}
        }
        this.options=defaults;
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
        if(this.options.defaultBehaviour=='on')
        {
            var popupObj=this;
            document.addEventListener('DOMContentLoaded',function()
            {
                document.onmouseleave=function()
                {
                    if(popupObj.trigger!=true)
                    {
                        popupObj.trigger=true;
                        popupObj.open();
                    }
                }
            });
        }
    }
    Popup.prototype.open = function(event)
    {
        buildOut.call(this);
        initializeEvents.call(this);
    }

    close = function()
    {
        this.trigger=false;
        if(typeof this.options.callback ==="function"){
        var userInfo = { email: document.getElementById("email").value
            }
            this.options.callback(userInfo);    
        }
        this.popup.parentNode.removeChild(this.popup);
    }

    validateEmail = function()
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email= document.getElementById("email").value.toLowerCase();
        if(re.test(email)===true)
        {
            close.call(this);
        }
        else
        {
            event.preventDefault();
            document.getElementById("noEmail").style.display= "block";
        }
    }

    extendDefaults= function(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    buildOut=function(){
        var form,headerDiv,name,email,message,heading,submit,row,para;

        //popup div

        this.pop=document.createElement("div");
        this.pop.className="pop-container";

        this.popup = document.createElement("div");
        this.popup.id="popupStart";

        this.popupContact =document.createElement("div");
        this.popupContact.id="popupContact";

        if (this.options.closeButton === true) {
            this.closeButton = document.createElement("button");
            this.closeButton.id = "close";
            if(this.options.theme=='red')
            {
                this.closeButton.className='red';
            }
            else
            {
                this.closeButton.className='orange';
            }
            this.closeButton.innerHTML = "X";
        }


        // this.popupContact.appendChild(this.closeButton);

        if(this.options.form) {
            form=document.createElement("form");
            heading=document.createElement("h2");
            heading.id='leaveHeading';
            if(this.options.theme=='red')
            {
                heading.className='red';
            }
            else
            {
                heading.className='orange';
            }
            heading.innerHTML="Before Leaving Us!";
            form.appendChild(heading);
            form.appendChild(this.closeButton);
            row= document.createElement("hr");
            form.appendChild(row);
            para=document.createElement("p");
            para.innerHTML="Get FREE access to Real-Estate tips & useful resources.";
            form.appendChild(para);
            if(this.options.form.email!=null)
            {
                email=document.createElement("input");
                email.id="email";
                email.placeholder="email";
                email.type="text";
                form.appendChild(email);
            }
            var noEmail=document.createElement("div");
            noEmail.innerHTML="please enter valid email address";
            noEmail.id="noEmail";
            form.appendChild(noEmail);
            submit=document.createElement("button");
            submit.id="submit";
            if(this.options.theme=='red')
            {
                submit.className='red';
            }
            else
            {
                submit.className='orange';
            }
            submit.innerHTML="Yes I Am Interested";
            form.appendChild(submit);
            this.popupContact.appendChild(form);
        }
        this.popup.appendChild(this.popupContact);
        this.pop.appendChild(this.popup);
        document.body.appendChild(this.pop);
    }

    initializeEvents=function()
    {
        if (this.closeButton) {
            document.getElementById("close").addEventListener('click', close.bind(this));
        }
        document.getElementById("submit").addEventListener('click',validateEmail.bind(this));
    }

    return Popup;
})();
