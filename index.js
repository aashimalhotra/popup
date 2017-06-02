var popupPlug=(function(){
    var popupObj;
    var Popup=function()
    {
        //element references
        this.closeButton = null;
        this.trigger=false;
        this.pop=null;
        this.popup = null,this.popupContact=null;

        // default parameters if user does not provide
        var defaults = {
            mainHeading: 'Before Leaving Us!',
            para: 'Get FREE access to Real-Estate tips & useful resources.',
            submitText: 'Yes I Am Interested',
            closeText: 'Close',
            closeButton: true,
            form: {email: ""}
        }
        this.options=defaults;
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
        if(this.options.defaultBehaviour=='on')
        {
            $(document).on('mouseleave',triggerCallback);
            if(isMobile(window))
            {
                var flag70=0;
                var winHeight= $(document).height();
                $(window).scroll(function(){
                    var wintop = $(window).scrollTop();
                    var height = (wintop/(winHeight))*100;
                    if(height>65 && flag70==0)
                    {
                        if(popupObj.trigger!=true)
                        {
                            popupObj.trigger=true;
                            popupObj.open();
                        }
                        flag70=1;
                    }                 
                });
            }
        }
        popupObj=this;
    }

    var isMobile = function($window) {
       var data = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
       return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(data)
    }

    var triggerCallback=function(event)
    {
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        if((event.pageY-scroll) < 7 && popupObj.trigger!=true)
        {
            popupObj.trigger=true;
            popupObj.open();
        }
    }

    Popup.prototype.open = function()
    {
        buildOut.call(this);
        initializeEvents.call(this);
        $(document).on('keypress',enterBind);
    }

    var enterBind= function(e){
        if (e.which == 13 || e.keyCode==13){
            e.preventDefault();
            $("#popupSubmit").click();
        }
    }

    Popup.prototype.removeDefault= function()
    {
        $(document).off('mouseleave',triggerCallback);
    }

    Popup.prototype.remove = function()
    {
        this.popup.parentNode.removeChild(this.popup);

    }

    var submit = function()
    {
        this.trigger=false;
        if(typeof this.options.submit ==="function"){
        var userInfo = { email: document.getElementById("email").value
            }
            var that =this;
            this.options.submit(userInfo,this).then(function(result){
                if(result=='Already Subscribed')
                {
                    showAlreadySubscribed.call(that);
                }
                else if(result=='success')
                {
                    subscribe.call(that);
                }
                $(document).off('keypress',enterBind);
            },function(err){
                // console.log("error in registering");
            });
        }
    }

    var subscribe = function()
    {
        var that=this;
        this.popupContact.getElementsByClassName('formElements')[0].style.display='none';
        this.popupContact.getElementsByClassName('thankyou')[0].style.display='block';
        document.getElementById("popupCloseSuccess").addEventListener('click',function(event){
            event.preventDefault();
            that.options.subscribeClose(that);
        })
    }

    var showAlreadySubscribed = function()
    {
        var that=this;
        this.popupContact.getElementsByClassName('formElements')[0].style.display='none';
        this.popupContact.getElementsByClassName('subscribed')[0].style.display='block';
        document.getElementById('popupCloseSuscribed').addEventListener('click',function(event){
            event.preventDefault();
            that.options.subscribeClose(that);
        })
    }

    var close = function(event)
    {
        this.trigger=false;
        this.options.close(this);
        this.popup.parentNode.removeChild(this.popup);

    }

    var validateEmail = function(event)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email= document.getElementById("email").value.toLowerCase();
        if(re.test(email)===true)
        {
            event.preventDefault();
            submit.call(this);
        }
        else
        {
            event.preventDefault();
            document.getElementById("noEmail").style.display= "block";
        }
    }

    var extendDefaults= function(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    var buildOut=function(){
        var form,headerDiv,name,email,message,heading,closeSuccess,closeSuscribed,submit,para,formElements,subscribed,thankyou;

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
        if(this.options.form) {
            subscribed=document.createElement("div");
            subscribed.className='subscribed';
            subscribed.innerHTML='You are already subscribed!';
            thankyou=document.createElement("div");
            thankyou.className='thankyou';
            thankyou.innerHTML='Thankyou for subscribing with us!';
            formElements=document.createElement("div");
            formElements.className='formElements';
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
            heading.innerHTML=this.options.mainHeading;
            form.appendChild(heading);
            form.appendChild(this.closeButton);
            para=document.createElement("p");
            para.innerHTML=this.options.para;
            formElements.appendChild(para);
            if(this.options.form.email!=null)
            {
                email=document.createElement("input");
                email.id="email";
                email.placeholder="email";
                email.type="text";
                formElements.appendChild(email);
            }
            var noEmail=document.createElement("div");
            noEmail.innerHTML="please enter valid email address";
            noEmail.id="noEmail";
            formElements.appendChild(noEmail);
            submit=document.createElement("button");
            submit.id="popupSubmit";
            if(this.options.theme=='red')
            {
                submit.className='popupRed';
            }
            else
            {
                submit.className='popupOrange';
            }
            submit.innerHTML=this.options.submitText;
            closeSuccess=document.createElement("button");
            closeSuccess.id="popupCloseSuccess";
            if(this.options.theme=='red')
            {
                closeSuccess.className='red';
            }
            else
            {
                closeSuccess.className='orange';
            }
            closeSuccess.innerHTML=this.options.closeText;
            closeSuscribed=document.createElement("button");
            closeSuscribed.id="popupCloseSuscribed";
            if(this.options.theme=='red')
            {
                closeSuscribed.className='red';
            }
            else
            {
                closeSuscribed.className='orange';
            }
            closeSuscribed.innerHTML=this.options.closeText;
            formElements.appendChild(submit);
            subscribed.appendChild(closeSuscribed);
            thankyou.appendChild(closeSuccess);
            form.appendChild(formElements);
            form.appendChild(subscribed);
            form.appendChild(thankyou);
            this.popupContact.appendChild(form);
        }
        this.popup.appendChild(this.popupContact);
        this.pop.appendChild(this.popup);
        document.body.appendChild(this.pop);
        this.options.visible();
    }

    var initializeEvents=function()
    {
        if (this.closeButton) {
            document.getElementById("close").addEventListener('click', close.bind(this));
        }
        document.getElementById("popupSubmit").addEventListener('click',validateEmail.bind(this));
    }

    return Popup;
})();

