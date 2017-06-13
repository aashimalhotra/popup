(function(a){
    var newHandler;
    function Popup(){
        //element references
        this.trigger=false;

        // default parameters if user does not provide
        var defaults = {
            mainHeading: 'Before Leaving Us!',
            para: 'Get FREE access to Real-Estate tips & useful resources.',
            submitText: 'Yes I Am Interested',
            closeText: 'Close',
            closeButton: true,
            defaultBehaviour: false,
            form: {email: ""},
            callback: function(){},
            scrollPercentage: 70
        }
        this.options=defaults;
        if (arguments[0] && typeof arguments[0] === "object" && arguments[0].length==undefined) {
            this.options = extendDefaults(defaults, arguments[0]);
        }
        if(this.options.defaultBehaviour)
        {
            newHandler=triggerCallback.bind(this);
            $(document).on('mouseleave',newHandler);
            if(isMobile(window))
            {
                if(this.options.scrollPercentage>90)
                {
                    this.options.scrollPercentage=90;
                }
                var scrollFlag=0,that=this;
                $(window).scroll(function(){
                    var winHeight= $(document).height();
                    var wintop = $(window).scrollTop();
                    var height = (wintop/(winHeight))*100;
                    if(height>(that.options.scrollPercentage-5) && scrollFlag==0)
                    {
                        if(that.trigger!=true)
                        {
                            that.trigger=true;
                            that.open();
                        }
                        scrollFlag=1;
                    }                 
                });
            }
        }
    }

    var isMobile = function($window) {
       var data = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
       return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(data)
    }

    var triggerCallback=function(event){
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        if((event.pageY-scroll) < 7 && this.trigger!=true)
        {
            this.trigger=true;
            this.open();
        }
    }

    Popup.prototype.open = function(){
        if(this.options.formType=='lead')
        {
            buildOutLead.call(this);
        }
        else
        {
            buildOutEmail.call(this);
        }
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
        $(document).off('mouseleave',newHandler);
    }

    Popup.prototype.remove = function()
    {
        this.popup.parentNode.removeChild(this.popup);

    }

    var submitLead = function(event)
    {
        event.preventDefault();
        this.trigger=false;
        document.getElementsByClassName('popupStartLead')[0].parentNode.removeChild(document.getElementsByClassName('popupStartLead')[0]);
        if(typeof this.options.callback ==="function"){
            this.options.callback(null,'submit');
        }
    }

    var submit = function()
    {
        this.trigger=false;
        if(typeof this.options.callback ==="function"){
        var userInfo = { email: document.getElementsByClassName("email")[0].value
            }
            var that =this;
            this.options.callback(userInfo,'submit');
            $(document).off('keypress',enterBind);
        }
    }

    Popup.prototype.processResults= function(result){
        if(result=='Already Subscribed')
        {
            showAlreadySubscribed.call(that);
        }
        else if(result=='success')
        {
            subscribe.call(that);
        }
    }

    var subscribe = function()
    {
        var that=this;
        document.getElementsByClassName('popupContact')[0].getElementsByClassName('formElements')[0].style.display='none';
        document.getElementsByClassName('popupContact')[0].getElementsByClassName('thankyou')[0].style.display='block';
        if(this.options.theme=='red')
        {
            var closeSuccess=document.getElementsByClassName("popupCloseSuccessRed")[0];
        }
        else
        {
            var closeSuccess=document.getElementsByClassName("popupCloseSuccessRed")[0];   
        }
        closeSuccess.addEventListener('click',function(event){
            event.preventDefault();
            that.options.callback(null,'subscribeClose');
        })
    }

    var showAlreadySubscribed = function()
    {
        var that=this;
        document.getElementsByClassName('popupContact')[0].getElementsByClassName('formElements')[0].style.display='none';
        document.getElementsByClassName('popupContact')[0].getElementsByClassName('subscribed')[0].style.display='block';
        if(this.options.theme=='red')
        {
            var closeSuccess=document.getElementsByClassName("popupCloseSubscribedRed")[0];
        }
        else
        {
            var closeSuccess=document.getElementsByClassName("popupCloseSubscribedOrange")[0];   
        }
        closeSuccess.addEventListener('click',function(event){
            event.preventDefault();
            that.options.callback(null,'subscribeClose');
        })
    }

    var close = function(event)
    {
        this.trigger=false;
        if(typeof this.options.callback === 'function')
        {
            this.options.callback(null,'close');
        }
        if(this.options.formType=='lead')
        {
            document.getElementsByClassName('popupStartLead')[0].parentNode.removeChild(document.getElementsByClassName('popupStartLead')[0]);
        }
        else
        {
            document.getElementsByClassName('popupStart')[0].parentNode.removeChild(document.getElementsByClassName('popupStart')[0]);            
        }

    }

    var validateEmail = function(event)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email= document.getElementsByClassName("email")[0].value.toLowerCase();
        if(re.test(email)===true)
        {
            event.preventDefault();
            submit.call(this);
        }
        else
        {
            event.preventDefault();
            document.getElementsByClassName("noEmail")[0].style.display= "block";
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

    var buildOutLead=function(){
        var form,closeButton,html,pop;

        //popup div
        if (this.options.closeButton === true) {
            closeButton = '<button class="closeLead">X</button>';
        }
        if(this.options.form) {
            form='<form class="formLead"> \
            <h2 class="leadHeading">'+this.options.mainHeading+'</h2>\
            <div class="formElementsLead">\
            <p>'+this.options.para+'</p>\
            <button class="leadSubmit">'+this.options.submitText+'</button>\
            </div>\
            </form>';
        }
        html='<div class="popupStartLead">\
            <div class="popupContactLead">'+closeButton+form+'\
            </div>\
            </div>';
        pop=document.createElement('div');
        pop.innerHTML=html;
        pop.className='pop-container';
        document.body.appendChild(pop);
        if(typeof this.options.callback ==="function"){
            this.options.callback(null,'visible');
        }
    }

    var buildOutEmail=function(){
        var form,closeButton,pop,html,email,heading,closeSuccess,closeSuscribed,submit;

        //popup div
        if (this.options.closeButton === true) {
            if(this.options.theme=='red')
            {
                closeButton='<button class="closeRed">X</button>';
            }
            else
            {
                closeButton='<button class="closeOrange">X</button>';
            }
        }
        if(this.options.form) {
            if(this.options.theme=='red')
            {
                heading='<h2 class="leaveHeadingRed">'+this.options.mainHeading+'</h2>';
            }
            else
            {
                heading='<h2 class="leaveHeadingOrange">'+this.options.mainHeading+'</h2>';
            }
            if(this.options.form.email!=null)
            {
                email='<input class="email" placeholder="email" type="text">';
            }
            var noEmail='<div class="noEmail">please enter valid email address</div>';
            if(this.options.theme=='red')
            {
                submit='<button class="popupSubmitRed">'+this.options.submitText+'</button>';
            }
            else
            {
                submit='<button class="popupSubmitOrange">'+this.options.submitText+'</button>';
            }
            if(this.options.theme=='red')
            {
                closeSuccess='<button class="popupCloseSuccessRed">Close</button>';
            }
            else
            {
                closeSuccess='<button class="popupCloseSuccessOrange">Close</button>';
            }
            if(this.options.theme=='red')
            {
                closeSuscribed='<button class="popupCloseSuscribedRed">Close</button>';
            }
            else
            {
                closeSuscribed='<button class="popupCloseSuscribedOrange">Close</button>';
            }
            form='<form>'+heading+closeButton+'\
                <div class="formElements"><p>'+this.options.para+'</p>\
                '+email+noEmail+submit+'</div>\
                <div class="subscribed">You are already subscribed!\
                '+closeSuscribed+'</div>\
                <div class="thankyou">Thankyou for subscribing with us!'+closeSuccess+'</div>\
                </form>';
        }
        html='<div class="popupStart">\
            <div class="popupContact">'+form+'</div></div>';
        pop=document.createElement('div');
        pop.className='pop-container';
        pop.innerHTML=html;
        document.body.appendChild(pop);
        if(typeof this.options.callback ==="function"){
            this.options.callback(null,'visible');
        }
    }

    var initializeEvents=function()
    {
        if (this.options.closeButton) {
            if(this.options.formType=='lead')
            {
                document.getElementsByClassName("closeLead")[0].addEventListener('click', close.bind(this));
            }
            else
            {
                if(this.options.theme=='red')
                {
                    document.getElementsByClassName("closeRed")[0].addEventListener('click', close.bind(this));
                }
                else
                {
                    document.getElementsByClassName("closeOrange")[0].addEventListener('click', close.bind(this));
                }
            }
        }
        if(this.options.formType=='lead')
        {
            document.getElementsByClassName("leadSubmit")[0].addEventListener('click',submitLead.bind(this));
        }
        else
        {
            if(this.options.theme=='red')
            {
                document.getElementsByClassName("popupSubmitRed")[0].addEventListener('click',validateEmail.bind(this));   
            }
            else
            {
                document.getElementsByClassName("popupSubmitOrange")[0].addEventListener('click',validateEmail.bind(this));                
            }
        }
    }
    a.popupPlug=Popup;
})(window);

