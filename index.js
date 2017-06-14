(function(windowObject) {
    var newHandler, popupState = {
        screen: 0,
        trigger: false,
        popupElement: null,
        scrollFlag: false
    };

    function Popup() {
        var defaults = {
            mainHeading: 'Before Leaving Us!',
            para: 'Get FREE access to Real-Estate tips & useful resources.',
            submitText: 'Yes I Am Interested',
            closeText: 'Close',
            closeButton: true,
            formType: 'email',
            minusScroll: 5,
            defaultBehaviour: false,
            form: {
                email: ""
            },
            callback: function() {},
            scrollPercentage: 70
        }
        this.options = defaults;
        if (arguments[0] && typeof arguments[0] === "object" && arguments[0].toString() == "[object Object]") {
            this.options = extendDefaults(defaults, arguments[0]);
        }
        if (this.options.defaultBehaviour) {
            newHandler = triggerCallback.bind(this);
            $(document).on('mouseleave', newHandler);
            if (isMobile(window)) {
                this.options.scrollPercentage = this.options.scrollPercentage < 90 ? this.options.scrollPercentage : 90;
                $(window).scroll(triggerCallbackMobile.bind(this));
            }
        }
    }

    var isMobile = function($window) {
        var data = $window.navigator.userAgent || $window.navigator.vendor || $window.opera;
        return /iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/.test(data)
    }

    var triggerCallback = function(event) {
        var scroll = window.pageYOffset || document.documentElement.scrollTop;
        if ((event.pageY - scroll) < 7 && popupState.trigger != true) {
            popupState.trigger = true;
            this.open();
        }
    }

    var triggerCallbackMobile = function() {
        var winHeight = $(document).height();
        var wintop = $(window).scrollTop();
        var height = (wintop / (winHeight)) * 100;
        if (height > (this.options.scrollPercentage - this.options.minusScroll) && !popupState.scrollFlag) {
            if (!popupState.trigger) {
                popupState.trigger = true;
                this.open();
            }
            popupState.scrollFlag = true;
        }
    }

    Popup.prototype.open = function() {
        if (this.options.formType == 'lead') {
            buildOutLead.call(this);
        } else {
            buildOutEmail.call(this);
        }
        popupState.popupElement = document.querySelector('[data-container-popup]')
        popupState.screen++;
        initializeEvents.call(this);
        $(document).on('keypress', enterBind);
        if (typeof this.options.callback === "function") {
            this.options.callback(null, {
                action: 'visible'
            });
        }
    }

    var enterBind = function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            $('[data-submitPopup]').click();
        }
    }

    Popup.prototype.removeDefault = function() {
        $(document).off('mouseleave', newHandler);
    }

    Popup.prototype.remove = function() {
        popupState.screen = 0;
        this.popup.parentNode.removeChild(this.popup);

    }

    var submitLead = function(event) {
        popupState.trigger = false;
        popupState.popupElement.parentNode.removeChild(popupState.popupElement);
        popupState.screen = 0;
        if (typeof this.options.callback === "function") {
            this.options.callback(null, {
                action: 'submit'
            });
        }
    }

    var submit = function() {
        popupState.trigger = false;
        if (typeof this.options.callback === "function") {
            var userInfo = {
                email: popupState.popupElement.querySelector('[data-emailPopup]').value
            }
            var that = this;
            this.options.callback(userInfo, {
                action: 'submit'
            });
            popupState.screen++;
            $(document).off('keypress', enterBind);
        }
    }

    Popup.prototype.processResults = function(result) {
        if (result == 'Already Subscribed') {
            showAlreadySubscribed.call(that);
        } else if (result == 'success') {
            subscribe.call(that);
        }
    }

    var subscribe = function() {
        var that = this;
        popupState.popupElement.querySelector('[data-contactPopup]').querySelector('data-formPopup').style.display = 'none';
        popupState.popupElement.querySelector('data-contactPopup').querySelector('data-thankyouPopup').style.display = 'block';
        var closeSuccess = popupState.popupElement.querySelector('[data-sucessPopup]');
        closeSuccess.addEventListener('click', function(event) {
            that.options.callback(null, {
                action: 'subscribeClose'
            });
        })
    }

    var showAlreadySubscribed = function() {
        var that = this;
        popupState.popupElement.querySelector('[data-contactPopup]').querySelector('[data-formPopup]').style.display = 'none';
        popupState.popupElement.querySelector('[data-contactPopup]').querySelector('[data-subscribedPopup]').style.display = 'block';
        var closeSuccess = popupState.popupElement.querySelector('[data-subscribedPopup]')[0];
        closeSuccess.addEventListener('click', function(event) {
            that.options.callback(null, {
                action: 'subscribeClose'
            });
        })
    }

    var close = function(event) {
        popupState.trigger = false;
        if (typeof this.options.callback === 'function') {
            this.options.callback(null, {
                action: 'close'
            });
        }
        popupState.popupElement.parentNode.removeChild(popupState.popupElement);
        popupState.screen = 0;
    }

    var validateEmail = function(event) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = popupState.popupElement.querySelector('[data-emailPopup]').value.toLowerCase();
        if (re.test(email) === true) {
            submit.call(this);
        } else {
            popupState.popupElement.querySelector('[data-noEmailPopup]').style.display = "block";
        }
    }

    var extendDefaults = function(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    var buildOutLead = function() {
        var form, closeButton, html, pop;

        //popup div
        if (this.options.closeButton === true) {
            closeButton = '<button class="closeLead" data-closePopup>X</button>';
        }
        if (this.options.form) {
            form = '<div class="formLead"> \
            <h2 class="leadHeading" data-headingPopup>' + this.options.mainHeading + '</h2>\
            <div class="formElementsLead" data-formPopup>\
            <p>' + this.options.para + '</p>\
            <button class="leadSubmit" data-submitPopup>' + this.options.submitText + '</button>\
            </div>\
            </div>';
        }
        html = '<div class="popupStartLead" data-startPopup>\
            <div class="popupContactLead" data-contactPopup>' + closeButton + form + '\
            </div>\
            </div>';
        pop = document.createElement('div');
        pop.innerHTML = html;
        pop.className = 'pop-container';
        pop.dataset.containerPopup = '';
        document.body.appendChild(pop);
    }

    var buildOutEmail = function() {
        var form, closeButton, pop, html, email, heading, closeSuccess, closeSuscribed, submit;

        //popup div
        if (this.options.closeButton) {
            if (this.options.theme == 'red') {
                closeButton = '<button class="closeRed" data-closePopup>X</button>';
            } else {
                closeButton = '<button class="closeOrange" data-closePopup>X</button>';
            }
        }
        if (this.options.form) {
            if (this.options.theme == 'red') {
                heading = '<h2 class="leaveHeadingRed" data-headingPopup>' + this.options.mainHeading + '</h2>';
                submit = '<button class="popupSubmitRed" data-submitPopup>' + this.options.submitText + '</button>';
                closeSuccess = '<button class="popupCloseSuccessRed" data-sucessPopup>Close</button>';
                closeSuscribed = '<button class="popupCloseSuscribedRed" data-subscribedPopup>Close</button>';
            } else {
                heading = '<h2 class="leaveHeadingOrange" data-headingPopup>' + this.options.mainHeading + '</h2>';
                submit = '<button class="popupSubmitOrange" data-submitPopup>' + this.options.submitText + '</button>';
                closeSuccess = '<button class="popupCloseSuccessOrange" data-sucessPopup>Close</button>';
                closeSuscribed = '<button class="popupCloseSuscribedOrange" data-subscribedPopup>Close</button>';
            }
            if (this.options.form.email != null) {
                email = '<input class="email" placeholder="email" type="text" data-emailPopup>';
            }
            var noEmail = '<div class="noEmail" data-noEmailPopup>please enter valid email address</div>';
            form = '<div class="formPopup">' + heading + closeButton + '\
                <div class="formElements" data-formPopup><p>' + this.options.para + '</p>\
                ' + email + noEmail + submit + '</div>\
                <div class="subscribed" data-alreadySubscribed>You are already subscribed!\
                ' + closeSuscribed + '</div>\
                <div class="thankyou" data-thankyouPopup>Thankyou for subscribing with us!' + closeSuccess + '</div>\
                </div>';
        }
        html = '<div class="popupStart" data-startPopup>\
            <div class="popupContact" data-contactPopup>' + form + '</div></div>';
        pop = document.createElement('div');
        pop.className = 'pop-container';
        pop.innerHTML = html;
        pop.dataset.containerPopup = '';
        document.body.appendChild(pop);
    }

    var initializeEvents = function() {
        if (this.options.closeButton) {
            popupState.popupElement.querySelector('[data-closePopup').addEventListener('click', close.bind(this));
        }
        if (this.options.formType == 'lead') {
            popupState.popupElement.querySelector('[data-submitPopup]').addEventListener('click', submitLead.bind(this));
        } else {
            popupState.popupElement.querySelector('[data-submitPopup]').addEventListener('click', submit.bind(this));
        }
    }
    windowObject.popupPlug = Popup;
})(window);
