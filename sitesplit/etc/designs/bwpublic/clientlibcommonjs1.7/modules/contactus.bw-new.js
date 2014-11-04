(function (BW, $, undefined) {

    /* ======================================================================
     23: Contact Us Form
     Description:

     Templates: 3 Steps Contact Form
     Components:
    ========================================================================*/

    BW.contactUs = {

        // Form Sections (<div>)
        sections: {
            contactContainer: $('#contactForm'),
            formServices: $('#contactFormServices'),
            formAddress: $('#contactFormAddress'),
            formButton: $('#buttonContainer'),
            formDetails: $('#contactFormDetails'),
            formMessage: $('#contactFormMessage'),
            formServiceMessage: $('#contactFormServiceMessage'),
            formAll: $('#contactFormAll'),
            formTerms: $('#contactFormTerms'),
            formAdditionalText1: $('#contactFormAdditional1'),
            formAdditionalText2: $('#contactFormAdditional2'),
            formAdditionalText3: $('#contactFormAdditional3'),
            formAdditionalHeader1: $('#contactFormAddHeading1'),
            formAdditionalHeader2: $('#contactFormAddHeading2'),
            formAdditionalHeader3: $('#contactFormAddHeading3'),
            formAdditionalMessage: $('#contactFormAdditionalMessage'),
            toolTipContainer: $('.frmTooltipWrap')
        },

        // Form Fields
        fields: {
            customer: $('input[name="extClient"]'),
            country: $('#country'),
            services: $('#services'),
            modePostalCountry: $('#allCountry'),
            additionalQn1: $('input[name="additionalQuestion1"]'),
            additionalQn2: $('input[name="additionalQuestion2"]'),
            additionalQn3: $('input[name="additionalQuestion3"]')
        },

        // User Messages
        messages: {
            US: {
                isCustomer: $('#USisCustomer').val(),
                isNotCustomer: $('#USisNotCustomer').val()
            },
            Blocked: {
                isCustomer: $('#BLisCustomer').val(),
                isNotCustomer: $('#BLisNotCustomer').val()
            },
            Secretive: {
                isCustomer: $('#SVisCustomer').val(),
                isNotCustomer: $('#SVNotCustomer').val()
            },
            PrivateBanking: {
                isCustomer: $('#PBisCustomer').val(),
                isNotCustomer: $('#PBisNotCustomer').val()
            },
            RestrictedAccount:{
                isNotCustomer: $('#ARisNotCustomer').val()
            }
        },

        /* Office Address Sections */
        officeAddress: {
            serviceType: $('#serviceType'),
            buName: $('#buName'),
            addressWrap: $('#addressWrap'),
            address1: $('#address1'),
            address2: $('#address2'),
            address3: $('#address3'),
            address4: $('#address4'),
            postCode: $('#postCode'),
            email: $('#email'),
            phoneWrap: $('#phoneWrap'),
            telephone: $('#telephone'),
            fax: $('#fax'),
            timeWrap: $('#timeWrap'),
            openingHour: $('#openingHour')
        },

        init: function() {

            this.resetForm();

            this.countryInfo;

            this.getData();

            this.tooltip();

            this.attachHandlers();
        },

        resetForm: function() {
            var $contactForm = $('#contactForm');

            window.onload = function() {
                if($contactForm.length){
                    $contactForm[0].reset();
                    //hack to ensure /content/bwpublic is present in the path for post processing
                    var formAction = $contactForm.attr('action');
                    if (formAction.indexOf('content/bwpublic') == -1) {
                        formAction = '/content/bwpublic' + formAction;
                        $contactForm.attr('action', formAction);
                    }
                }
            }
        },

        // Get contact information from JSON file
        getData: function() {
            var self = this;

            $.getJSON('/json/country-information.json', function(data) {
                self.countryInfo = data;
            }).done(function() {
                self.populateSelectField(self.countryInfo);
            });
        },

        // Populate Select Fields
        populateSelectField: function(countryInfo) {
            self.countryInfo = countryInfo;

            this.populateSelect(BW.config.ContactForm.SelectCountryLbl, this.countryInfo, this.fields.country);
        },

        attachHandlers: function() {
            var self = this;

            /***** BEGIN Handlers *****/
            /* On Change of the Existing Customer Option */
            this.fields.customer.on('ifChecked', function(event) {
                // Fields Modified? Reset 'em all!
                self.fields.country.selectBox('refresh');
                self.processRules();
            });

            /* On Change of the Country */
            this.fields.country.change(function () {
                self.processRules();
            });

            // On Change of Services */
            this.fields.services.change(function () {
                self.resetFields();

                self.sections.formServiceMessage.addClass('hide');
                self.sections.formAdditionalText1.addClass('hide');
                self.sections.formAdditionalText2.addClass('hide');
                self.sections.formAdditionalText3.addClass('hide');
                // Reset Fields
                self.processServicesRules();
            });

            this.fields.additionalQn1.on('ifChecked', function(event) {
                self.resetFields();
                self.sections.formAdditionalText2.addClass('hide');
                self.sections.formAdditionalText3.addClass('hide');
                $('.button-wrap #additionalQ1Continue').removeClass('hide');
            });

            this.fields.additionalQn2.on('ifChecked', function(event) {
                self.resetFields();
                self.sections.formAdditionalText3.addClass('hide');
                $('.button-wrap #additionalQ2Continue').removeClass('hide');
            });

            this.fields.additionalQn3.on('ifChecked', function(event) {
                self.resetFields();
                $('.button-wrap #additionalQ3Continue').removeClass('hide');
            });

            // Submitting the form after validting it (cross browser)
            $('input#submitForm').on('click', function (e) {
                self.formValidation();
                self.services.contactContainer.submit();

                e.preventDefault();
            });
            /***** END Handlers *****/
        },

        resetFields: function() {
            // Fields Modified? Reset 'em all!
            this.services = this.fields.services.val() || "";
            this.sections.formMessage.addClass('hide');
            this.sections.formAddress.addClass('hide');
            this.sections.formDetails.addClass('hide');
            this.sections.formAdditionalMessage.addClass('hide');
        },

        // Process Rules
        processRules: function() {
            var self = this,
                countryState,
                counter;

            /* Get the Option */
            self.isCustomer = $('input[name="extClient"]:checked').val() || "";
            self.country = self.fields.country.val() || "";
            self.services = self.fields.services.val() || "";

            if (self.country !== "") {
                self.isBlocked = self.countryInfo[self.country].isBlocked || 0;
                self.isSecretive = self.countryInfo[self.country].isSecretive || 0;
                self.isRestrictedAccount = self.countryInfo[self.country].isAccountRestricted || 0;
            }

            // Sections Opened? Hide 'em all!
            self.sections.formServices.addClass('hide');
            self.sections.formButton.addClass('hide');
            self.sections.formMessage.addClass('hide');
            self.sections.formServiceMessage.addClass('hide');
            self.sections.formAdditionalText1.addClass('hide');
            self.sections.formAdditionalText2.addClass('hide');
            self.sections.formAdditionalText3.addClass('hide');
            self.sections.formAddress.addClass('hide');
            self.sections.formDetails.addClass('hide');
            self.sections.formAdditionalMessage.addClass('hide');

            //Set the additional Question values as blank
            $('input[name="addQn1Ans"]').val("");
            $('input[name="addQn2Ans"]').val("");
            $('input[name="addQn3Ans"]').val("");

            // Reset Fields
            self.fields.services.selectBox('refresh');

            if (self.isCustomer === "" || self.country == "") {
                return;
            }

            // Check Country State
            if (self.country === "US") {
                // US Specific
                countryState = 0
            } else if(self.isBlocked == 1) {
                // Blocked Specific
                countryState = 1
            }
            else if (self.isSecretive == 1) {
                // Secretive Specific
                countryState = 2
            } else if(self.isRestrictedAccount == 1){
                // Account Restrict Specific
                countryState = 3
            }

            // Country Status Specific
            switch (countryState) {
                case 0: /* US */
                    if (self.isCustomer === "Yes") {
                        self.sections.formMessage.html(self.messages.US.isCustomer);
                        self.sections.formMessage.removeClass('hide');
                    } else {
                        self.sections.formMessage.html(self.messages.US.isNotCustomer);
                        self.sections.formMessage.removeClass('hide');

                    }
                    break;

                case 1: /* Blocked */
                    if (self.isCustomer === "Yes") {
                        self.sections.formMessage.html(self.messages.Blocked.isCustomer);
                        self.sections.formMessage.removeClass('hide');
                    } else {
                        self.sections.formMessage.html(self.messages.Blocked.isNotCustomer);
                        self.sections.formMessage.removeClass('hide');

                    }
                    break;

                case 2: /* Secretive */
                    if (self.isCustomer === "Yes") {
                        self.sections.formMessage.html(self.messages.Secretive.isCustomer);
                        self.sections.formMessage.removeClass('hide');
                    } else {
                        this.showServices();
                    }
                    break;

                case 3: /* Restricted Account */
                        if (self.isCustomer === "Yes") {
                             this.showServices();
                        } else {
                            self.sections.formMessage.html(self.messages.RestrictedAccount.isNotCustomer);
                                self.sections.formMessage.removeClass('hide');

                        }
                        break;

                default: /* All Others */
                    this.showServices();
                    break;
            }

            if (!self.sections.formMessage.hasClass('hide')) {
                $('html,body').animate({scrollTop: self.sections.formMessage.offset().top},'slow');
            }
        },

        // Show Services & Country Informations
        showServices: function() {
            // Populate Services Field
            this.populateSelect(BW.config.ContactForm.SelectServicesLbl, this.countryInfo[this.country].services, this.fields.services);
            // Show Service Section
            this.sections.formServices.removeClass('hide');
            this.fields.services.selectBox('refresh');
        },

        processServicesRules: function() {
            var self = this;

            // Hide Sections, if services is not selected
            if (self.services === "") {
                self.sections.formAddress.addClass('hide');
                self.sections.formServiceMessage.addClass('hide');
                self.sections.formAdditionalText1.addClass('hide');
                self.sections.formAdditionalText2.addClass('hide');
                self.sections.formAdditionalText3.addClass('hide');
                self.sections.formAddress.addClass('hide');
                self.sections.formMessage.addClass('hide');
                self.sections.formDetails.addClass('hide');
                self.sections.formAdditionalMessage.addClass('hide');
            }

            $('input[name="addQn1"]').val(self.countryInfo[self.country].services[self.services].additionalQuestion1.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));

            $('input[name="addQn2"]').val(self.countryInfo[self.country].services[self.services].additionalQuestion2.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));

            $('input[name="addQn3"]').val(self.countryInfo[self.country].services[self.services].additionalQuestion3.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));


            //Do this only if qualifying text exists
            if (self.countryInfo[self.country].services[self.services].qualifyingText != "") {
                self.sections.formServiceMessage.html(self.countryInfo[self.country].services[self.services].qualifyingText.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '<br> <div class="button-wrap"><input type="submit" id="continue" name="continue" class="continue"  value="Continue"</div>');
                self.sections.formServiceMessage.removeClass('hide');

                if (!$('#contactFormServiceMessage').hasClass('hide')) {
                    $('html,body').animate({scrollTop: self.sections.formServices.offset().top},'slow');
                }

                $('#continue').on('click', function(e) {

                    $('.button-wrap #continue').addClass('hide');

                    // Show Services Additional Text/Questions
                    self.showAdditionalServices();

                    e.preventDefault();
                });
            } else {
                // Does not have qaulifiying text
                self.showAdditionalServices();
            }

            //scrolling the page to mode section BWP-1276
            if (!$('#contactformAll').hasClass('hide')) {
                $('html,body').animate({scrollTop: self.sections.formServices.offset().top},'slow');
            }
        },

        showPanels: function() {
            this.sections.formDetails.removeClass('hide');
            this.sections.formAll.removeClass('hide');
            this.sections.formAddress.removeClass('hide');
            $('#additionalQn').addClass('hide');
        },

        scrollToPanel: function() {
            var self = this;

            if (!$('#contactFormAll').hasClass('hide')) {
                $('html,body').animate({scrollTop: self.sections.formAddress.offset().top},'slow');
            }
        },

        showAdditionalServices: function() {
            var self = this;

            if (($('input[name="extClient"]:checked').val() === "Yes" && self.countryInfo[self.country].services[self.services].isClientSevice === "0") || ($('input[name="extClient"]:checked').val() === "No" && self.countryInfo[self.country].services[self.services].isProspectSevice === "0")) {

                self.sections.formAdditionalMessage.removeClass('hide');

                if ($('input[name="extClient"]:checked').val() === "Yes") {
                    self.sections.formAdditionalMessage.html('<p>' + self.countryInfo[self.country].services[self.services].clientSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
                } else {
                    self.sections.formAdditionalMessage.html('<p>' + self.countryInfo[self.country].services[self.services].prospectSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
                }
                return false;
            } else if (self.countryInfo[self.country].services[self.services].isAdditionalQuestions === "1" && $('input[name="extClient"]:checked').val() === "No") {
                // Show Services Additional Text/Questions

                self.additionalQuestions();

            } else {

                // Show Services Address
                self.showPanels();
                // Process Address
                self.processAddress();

            }
        },

        additionalQuestions: function() {
            var self = this;

            // Show Services Additional Text/Questions
            self.sections.formAdditionalHeader1.html(self.countryInfo[self.country].services[self.services].additionalQuestion1);
            self.sections.formAdditionalText1.removeClass('hide');

            $('.button-wrap #additionalQ1Continue').removeClass('hide');

            if (!$('#contactFormAll').hasClass('hide')) {
                $('html,body').animate({scrollTop: self.sections.formAdditionalText1.offset().top},'slow');
            }

            /* Q1 */
            ////////////////////////////////////////////////////////////////////
            $('#additionalQ1Continue').on('click', function (e) {
                $('.button-wrap #additionalQ1Continue').addClass('hide');

                $('input[name="addQn1"]').val(self.countryInfo[self.country].services[self.services].additionalQuestion1);

                if ($('input[name="additionalQuestion1"]:checked').val() === "Yes") {
                    $('input[name="addQn1Ans"]').val("Yes");

                    self.showPanels();
                    self.scrollToPanel();

                    // Process Address
                    self.processAddress();
                } else {
                    $('input[name="addQn1Ans"]').val("No");
                    self.sections.formAdditionalHeader2.html(self.countryInfo[self.country].services[self.services].additionalQuestion2);
                    self.sections.formAdditionalText2.removeClass('hide');
                    $('.button-wrap #additionalQ2Continue').removeClass('hide');
                }

                e.preventDefault();
            });


            /* Q2 */
            ////////////////////////////////////////////////////////////////////
            $('#additionalQ2Continue').on('click', function (e) {
                $('.button-wrap #additionalQ2Continue').addClass('hide');

                if ($('input[name="additionalQuestion2"]:checked').val() === "Yes") {

                    $('input[name="addQn2Ans"]').val("Yes");
                    self.showPanels();
                    self.scrollToPanel();
                    // Process Address
                    self.processAddress();
                } else {
                    $('input[name="addQn2Ans"]').val("No");
                    self.sections.formAdditionalHeader3.html(self.countryInfo[self.country].services[self.services].additionalQuestion3);
                    self.sections.formAdditionalText3.removeClass('hide');
                    $('.button-wrap #additionalQ3Continue').removeClass('hide');
                }

                e.preventDefault();
            });


            /* Q3 */
            ////////////////////////////////////////////////////////////////////
            $('#additionalQ3Continue').on('click', function (e) {
                $('.button-wrap #additionalQ3Continue').addClass('hide');

                if ($('input[name="additionalQuestion3"]:checked').val() === "Yes") {
                    $('input[name="addQn3Ans"]').val("Yes");

                    self.showPanels();
                    self.scrollToPanel();

                    // Process Address
                    self.processAddress();
                } else {
                    self.sections.formAdditionalMessage.removeClass('hide');
                    self.sections.formAdditionalMessage.html('<p>' + self.countryInfo[self.country].services[self.services].additionalSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
                }

                e.preventDefault();
            });

        },

        processAddress: function() {
            var self = this,
                serviceObj;

            serviceObj = self.countryInfo[self.country].services[self.services];
            // Hide all the sections
            $.each([
                self.officeAddress.serviceType, self.officeAddress.buName,
                self.officeAddress.address1, self.officeAddress.address2,
                self.officeAddress.address3, self.officeAddress.address4,
                self.officeAddress.postCode, self.officeAddress.email,
                self.officeAddress.email, self.officeAddress.fax, self.officeAddress.openingHour
                ], function(i, $el){
                    $el.addClass('hide');
            });

            // Get the values from the Country JSON
            var serviceType = serviceObj["name"],
                buName = serviceObj["buName"],
                address1 = serviceObj["addr1"],
                address2 = serviceObj["addr2"],
                address3 = serviceObj["addr3"],
                address4 = serviceObj["addr4"],
                postCode = serviceObj["postCode"],
                email = serviceObj["email"],
                telephone = serviceObj["telephone"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'),
                fax = serviceObj["fax"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'),
                openingHour = serviceObj["openingHour"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>');

            /* Hide / Show the Sections */
            /* Address Wrap */
            if (buName === "" && address1 === "" && address2 === "" && address3 === "" && address4 === "") {
                self.officeAddress.addressWrap.addClass('hide');
            } else {
                self.officeAddress.addressWrap.removeClass('hide');
            }
            /* Telephone Wrap */
            if (telephone === "" && fax ==="") {
                self.officeAddress.phoneWrap.addClass('hide');
            } else {
                self.officeAddress.addressWrap.removeClass('hide');
            }
            /* Time Wrap */
            if (openingHour === "") {
                self.officeAddress.timeWrap.addClass('hide');
            } else {
                self.officeAddress.addressWrap.removeClass('hide');
            }

            /* Show the Sections if the data is present in the JSON */
            if (serviceType !== "") {
                self.officeAddress.serviceType.text(serviceObj["name"]).removeClass('hide');
            }

            if (buName !== "") {
                self.officeAddress.buName.text(serviceObj["buName"]).removeClass('hide');
            }

            if (address1 !== "") {
                self.officeAddress.address1.text(serviceObj["addr1"]).removeClass('hide');
            }

            if (address2 !== "") {
                self.officeAddress.address2.text(serviceObj["addr2"]).removeClass('hide');
            }

            if (address3 !== "") {
                self.officeAddress.address3.text(serviceObj["addr3"]).removeClass('hide');
            }

            if (address4 !== "") {
                self.officeAddress.address4.text(serviceObj["addr4"]).removeClass('hide');
            }

            if (postCode !== "") {
                self.officeAddress.postCode.text(serviceObj["postCode"]).removeClass('hide');
            }

            if (email !== "") {
                self.officeAddress.email.text(serviceObj["email"]).removeClass('hide');
            }

            if (telephone !== "") {
                self.officeAddress.telephone.html(serviceObj["telephone"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
            }

            if (fax !== "") {
                self.officeAddress.fax.html(serviceObj["fax"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
            }

            if (openingHour !== "") {
                self.officeAddress.openingHour.html(serviceObj["openingHour"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
            }

            //Popluate the users country to the postal mode country field
            if (self.countryInfo[self.country].name !== "Rest of World") {
                self.fields.modePostalCountry.val(self.countryInfo[self.country].name);
                self.fields.modePostalCountry.attr('readonly', 'readonly');
            } else {
                self.fields.modePostalCountry.val("");
                self.fields.modePostalCountry.attr('readonly', false);
            }
        },

        populateSelect: function(defaultTxt, obj, element) {
            var items = [],
                l;

            // Populate Country Options
            items[0] = "<option value=''>" + defaultTxt + "</option>";

            for (l in obj) {
                items.push("<option value='" + l + "'>" + obj[l].name +"</option>");
            }

            element.empty().html(items.join(''));
            this.customFormStyles();
        },

        formValidation: function() {
            $("#contactForm").validate({
                groups: {
                    allPhoneNumber: "allPhone allPhoneSCode allPhoneNum",
                    allPhoneAltNumber: "allPhoneAlt allPhoneAltSCode allPhoneAltNum"
                },
                rules: {
                    allEmailAddConf: {
                        required: true,
                        equalTo: "#allEmailAdd"
                    },
                },
                messages: {
                    allEmailAddConf: {
                        equalTo: "Please enter the same email as above"
                    }
                }
            });
        },

        customFormStyles: function() {
            // Style the Checkbox and Radio Button
            $('input').iCheck({
                checkboxClass: 'icheckbox_minimal-blue',
                radioClass: 'iradio_minimal-blue'
            });

            // Show the Contact Form Based on the Country and Existing Client
            $('select').selectBox();
        },

        tooltip: function() {
            var self = this;

            self.sections.contactContainer.find('.tooltipIndicator').focus(function(){
                self.sections.toolTipContainer.hide();
            });

            self.sections.contactContainer.find('input, radio, select, textarea, body').blur( function() {
                self.sections.toolTipContainer.hide();
            });

            $('.tooltipIndicator').hover(function(e) {

                var t = $(this),
                    tooltip = self.sections.toolTipContainer;

                tooltip.css({
                    "left": t.position().left - 17,
                    "top": t.offset().top - 304
                });

                tooltip.find('.content').text(t.closest('div').children('.reqTooltip').attr('message'));

                var toolTipHt = self.sections.toolTipContainer.height(),
                    ttArrow = $('.tt-arrow'),
                    toolTipArrow = ttArrow.css('top').replace('px','');

                if ($.browser.msie) {

                    if (tooltip.height() == 33 ) {
                        ttArrow.css("top", '47px');
                    }

                    if (tooltip.height() != 33  && tooltip.height() > 33  ) {
                        tooltip.css({
                             "top": (t.offset().top - 304 ) - 15
                        });
                        if (toolTipArrow >= 36) {
                            ttArrow.css("top", toolTipHt  + 16);
                        }
                    }

                    if (tooltip.height() < 33 ) {
                        tooltip.css({
                            "top": (t.offset().top - 304 ) + 10,
                            "left": t.position().left - 17
                        });
                        if (toolTipArrow > 36) {
                            ttArrow.css("top", toolTipArrow - toolTipHt + 9);
                        }
                    }

                } else {
                    if (tooltip.height() < 31 ) {
                        tooltip.css({
                            "top": (t.offset().top - 304 ) + 10,
                            "left": t.position().left - 17
                        });
                        if (toolTipArrow > 36) {
                            ttArrow.css("top", toolTipArrow - toolTipHt + 9);
                        }
                    }

                    if (tooltip.height() == 31 ) {
                        ttArrow.css("top", '47px');
                    }

                    if (tooltip.height() > 31 ) {
                        tooltip.css({
                            "top": (t.offset().top - 304 ) - 15
                        });
                        if (toolTipArrow >= 36) {
                            ttArrow.css("top", toolTipHt  + 16);
                        }
                    }
                }

                self.sections.toolTipContainer.delay(500).show(0);

                e.preventDefault();

                e.stopPropagation();

            }, function () {
                self.sections.toolTipContainer.delay(200).hide(0);
            });
        }

    };

    BW.contactUs.init();

    // add a Contact Form Validation rule
    jQuery.validator.addMethod(
        "numberAndPlus",
        function(value, element) {
            return this.optional(element) || /^(\+[0-9]{1,4}$|[0-9]{0,4}$)/.test(value);
        }, "Please enter a valid phone number"
    );

}(window.BW = window.BW || {}, jQuery));