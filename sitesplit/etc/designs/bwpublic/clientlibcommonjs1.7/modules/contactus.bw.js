(function (BW, $, undefined) {

	/* ==========================================================================
   23: Contact Us Form
   Description:

   Templates: 3 Steps Contact Form
   Components:
========================================================================== */
	BW.ContactUs = (function () {

	  	var ContactUs = function () {

			this.init = function () {
		  		var curObj,
			  		c = this,
			  		l;

	  			//Reset the form on hitting  back browser button
	  			window.onload = function() {
					if($('#contactForm').length){
						$('#contactForm')[0].reset();
						//hack to ensure /content/bwpublic is present in the path for post processing
						var formAction = $('#contactForm').attr('action');
						if (formAction.indexOf('content/bwpublic') == -1) {
							formAction =  '/content/bwpublic' + formAction;
							$('#contactForm').attr('action', formAction);
						}
					}
	  			}

	  			// Get the Country Country Details - Stored in the Hidden Variable
	  			c.countryInfo = $.parseJSON($('#countryInformation').val());

				// Customer Selections
				c.isCustomer,
				c.country,
				c.services,
				c.isBlocked,
				c.isSecretive,
				c.privateBanking,
				c.isRestrictedAccount,
				c.mode = {};

				// Form Sections (<div>)
				c.sections = {
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
					formAdditionalMessage: $('#contactFormAdditionalMessage')
				}

			  	// Form Fields
			  	c.fields = {
					customer: $('input[name="extClient"]'),
					country: $('#country'),
					services: $('#services'),
					modePostalCountry: $('#allCountry'),
					additionalQn1: $('input[name="additionalQuestion1"]'),
					additionalQn2: $('input[name="additionalQuestion2"]'),
					additionalQn3: $('input[name="additionalQuestion3"]')
			  	};

				// User Messages
				c.messages = {
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
				};

				/* Office Address Sections */
				c.officeAddress = {
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
				}

	  			// Populate Select Fields
	  			c.populateSelect(BW.config.ContactForm.SelectCountryLbl, c.countryInfo, c.fields.country);

	  			/***** BEGIN Handlers *****/
	  			/* On Change of the Existing Customer Option */
	  			c.fields.customer.on('ifChecked', function(event) {
					// Fields Modified? Reset 'em all!
					c.fields.country.selectBox('refresh');
					c.processRules();
	  			});

	  			/* On Change of the Country */
	  			c.fields.country.change(function () {
					c.processRules();
	  			});

	  			// On Change of Services */
	  			c.fields.services.change(function () {
					c.services = c.fields.services.val() || "";
					//c.sections.formButton.addClass('hide');
					c.sections.formMessage.addClass('hide');
					c.sections.formServiceMessage.addClass('hide');
					c.sections.formAdditionalText1.addClass('hide');
					c.sections.formAdditionalText2.addClass('hide');
					c.sections.formAdditionalText3.addClass('hide');
					c.sections.formAddress.addClass('hide');
					c.sections.formDetails.addClass('hide');
					c.sections.formAdditionalMessage.addClass('hide');
					// Reset Fields
					c.processServicesRules();
	  			});

	  			c.fields.additionalQn1.on('ifChecked', function(event) {
			   		// Fields Modified? Reset 'em all!
			  		c.services = c.fields.services.val() || "";
				   //c.sections.formButton.addClass('hide');
				   c.sections.formMessage.addClass('hide');
				   //c.sections.formServiceMessage.addClass('hide');
				   //c.sections.formAdditionalText1.addClass('hide');
				   $('.button-wrap #additionalQ1Continue').removeClass('hide');
				   c.sections.formAdditionalText2.addClass('hide');
				   c.sections.formAdditionalText3.addClass('hide');
				   c.sections.formAddress.addClass('hide');
				   c.sections.formDetails.addClass('hide');
				   c.sections.formAdditionalMessage.addClass('hide');
			 	});

			  	c.fields.additionalQn2.on('ifChecked', function(event) {
				   // Fields Modified? Reset 'em all!
				   c.services = c.fields.services.val() || "";
				   //c.sections.formButton.addClass('hide');
				   c.sections.formMessage.addClass('hide');
				   //c.sections.formServiceMessage.addClass('hide');
				   //c.sections.formAdditionalText1.addClass('hide');
				   $('.button-wrap #additionalQ2Continue').removeClass('hide');
				   c.sections.formAdditionalText3.addClass('hide');
				   c.sections.formAddress.addClass('hide');
				   c.sections.formDetails.addClass('hide');
				   c.sections.formAdditionalMessage.addClass('hide');
				});

			  	c.fields.additionalQn3.on('ifChecked', function(event) {
					// Fields Modified? Reset 'em all!
					c.services = c.fields.services.val() || "";
					//c.sections.formButton.addClass('hide');
					c.sections.formMessage.addClass('hide');
					//c.sections.formServiceMessage.addClass('hide');
					//c.sections.formAdditionalText1.addClass('hide');
					$('.button-wrap #additionalQ3Continue').removeClass('hide');
					//c.sections.formAdditionalText2.addClass('hide');
					c.sections.formAddress.addClass('hide');
					c.sections.formDetails.addClass('hide');
					c.sections.formAdditionalMessage.addClass('hide');
				});
			  	
			  	/* Site cat contact-us drop down -- Country */
				$('#contactForm #country').on('change', function (e) {
					var countryName = $(this).find("option:selected").text();
					var siteCatJsonObj = {
						"category" : "country",
						"categoryValue" : countryName
					};
					var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
					getSiteCatContent('contact-us', siteCatJsonStr);
				});

				/* Site cat contact-us drop down -- Service/Department */
				$('#contactForm #services').on('change', function (e) {
					var serviceName = $(this).find("option:selected").text();
					var siteCatJsonObj = {
						"category" : "department",
						"categoryValue" : serviceName
					};
					var siteCatJsonStr = JSON.stringify(siteCatJsonObj);
					getSiteCatContent('contact-us', siteCatJsonStr);
				});


				/***** END Handlers *****/

				/* Initate the Helper Functions */
				this.customFormStyles();
				this.tooltip();


				// Submitting the form after validting it (cross browser)
				$('input#submitForm').on('click', function (e) {
					e.preventDefault();
					BW.ContactUs.formValidation();
					$('#contactForm').submit();
				});

			}

			// Process Rules
			this.processRules = function () {

		  		var c = this,
			  		countryState,
			  		counter;

		  		/* Get the Option */
		  		c.isCustomer = $('input[name="extClient"]:checked').val() || "";
		  		c.country = c.fields.country.val() || "";
		  		c.services = c.fields.services.val() || "";
		  		if (c.country !== "") {
					c.isBlocked = c.countryInfo[c.country].isBlocked || 0;
					c.isSecretive = c.countryInfo[c.country].isSecretive || 0;
					c.isRestrictedAccount = c.countryInfo[c.country].isAccountRestricted || 0;
		  		}

			  	// Sections Opened? Hide 'em all!
			  	c.sections.formServices.addClass('hide');
			  	c.sections.formButton.addClass('hide');
			  	c.sections.formMessage.addClass('hide');
			  	c.sections.formServiceMessage.addClass('hide');
			  	c.sections.formAdditionalText1.addClass('hide');
			  	c.sections.formAdditionalText2.addClass('hide');
			  	c.sections.formAdditionalText3.addClass('hide');
			  	c.sections.formAddress.addClass('hide');
			  	c.sections.formDetails.addClass('hide');
			  	c.sections.formAdditionalMessage.addClass('hide');

		  		//Set the additional Question values as blank
		  		$('input[name="addQn1Ans"]').val("");
		  		$('input[name="addQn2Ans"]').val("");
		  		$('input[name="addQn3Ans"]').val("");

		  		// Reset Fields
		  		c.fields.services.selectBox('refresh');

		  		if (c.isCustomer === "" || c.country == "") {
					return;
		  		}

			  	// Check Country State
			  	if (c.country === "US") {
					// US Specific
					countryState = 0
			  	} else if(c.isBlocked == 1) {
					// Blocked Specific
					countryState = 1
			  	}
			  	else if (c.isSecretive == 1) {
					// Secretive Specific
					countryState = 2
			  	} else if(c.isRestrictedAccount == 1){
					// Account Restrict Specific
				  	countryState = 3
			  	}

		  		// Country Status Specific
		  		switch (countryState) {
					case 0: /* US */
			  			if (c.isCustomer === "Yes") {
							c.sections.formMessage.html(c.messages.US.isCustomer);
							c.sections.formMessage.removeClass('hide');
			  			} else {
							c.sections.formMessage.html(c.messages.US.isNotCustomer);
							c.sections.formMessage.removeClass('hide');

			  			}
			  			break;

					case 1: /* Blocked */

			  			if (c.isCustomer === "Yes") {
							c.sections.formMessage.html(c.messages.Blocked.isCustomer);
							c.sections.formMessage.removeClass('hide');
			  			} else {
							c.sections.formMessage.html(c.messages.Blocked.isNotCustomer);
							c.sections.formMessage.removeClass('hide');
			  			}
			  			break;

					case 2: /* Secretive */

			  			if (c.isCustomer === "Yes") {
							c.sections.formMessage.html(c.messages.Secretive.isCustomer);
							c.sections.formMessage.removeClass('hide');
			  			} else {
							this.showServices();
			  			}
			  			break;

					case 3: /* Restricted Account */

						if (c.isCustomer === "Yes") {
				   			this.showServices();
						} else {
				  			c.sections.formMessage.html(c.messages.RestrictedAccount.isNotCustomer);
							c.sections.formMessage.removeClass('hide');

						}
						break;

					default: /* All Others */
			  			this.showServices();
			  			break;
		  		}

		  		if (!$('#contactFormMessage').hasClass('hide')) {
					$('html,body').animate({scrollTop: c.sections.formMessage.offset().top},'slow');
		  		}

			}

			// Show Services & Country Informations
			this.showServices = function () {

		  		var c = this;
		  		// Populate Services Field
		  		c.populateSelect(BW.config.ContactForm.SelectServicesLbl, c.countryInfo[c.country].services, c.fields.services);
		  		// Show Service Section
		  		c.sections.formServices.removeClass('hide');
			}

			// Services Rules
			this.processServicesRules = function () {

		  		var c = this;

		  		// Hide Sections, if services is not selected
		  		if (c.services === "") {
					c.sections.formAddress.addClass('hide');
					c.sections.formServiceMessage.addClass('hide');
					c.sections.formAdditionalText1.addClass('hide');
					c.sections.formAdditionalText2.addClass('hide');
					c.sections.formAdditionalText3.addClass('hide');
					c.sections.formAddress.addClass('hide');
					c.sections.formMessage.addClass('hide');
					c.sections.formDetails.addClass('hide');
					c.sections.formAdditionalMessage.addClass('hide');
		  		}

		  		$('input[name="addQn1"]').val(c.countryInfo[c.country].services[c.services].additionalQuestion1.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));
		  		$('input[name="addQn2"]').val(c.countryInfo[c.country].services[c.services].additionalQuestion2.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));
		  		$('input[name="addQn3"]').val(c.countryInfo[c.country].services[c.services].additionalQuestion3.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>'));

		  		//Do this only if qualifying text exists
		  		if (c.countryInfo[c.country].services[c.services].qualifyingText != "") {
					c.sections.formServiceMessage.html(c.countryInfo[c.country].services[c.services].qualifyingText.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '<br> <div class="button-wrap"><input type="submit" id="continue" name="continue" class="continue"  value="Continue"</div>');
					c.sections.formServiceMessage.removeClass('hide');

		   			if (!$('#contactFormServiceMessage').hasClass('hide')) {
			  			$('html,body').animate({scrollTop: c.sections.formServices.offset().top},'slow');
					}

		   			$('#continue').on('click', function () {

						$('.button-wrap #continue').addClass('hide');

						// Show Services Additional Text/Questions
				 		if (($('input[name="extClient"]:checked').val() === "Yes" && c.countryInfo[c.country].services[c.services].isClientSevice === "0") || ($('input[name="extClient"]:checked').val() === "No" &&  c.countryInfo[c.country].services[c.services].isProspectSevice==="0")) {

				 			c.sections.formAdditionalMessage.removeClass('hide');
				 			if ($('input[name="extClient"]:checked').val() === "Yes"){
					 			c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].clientSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
				 			} else {
					 			c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].prospectSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
					 		}
				 			return false;
				 		}
				 		else {
				   			if (c.countryInfo[c.country].services[c.services].isAdditionalQuestions === "1" && $('input[name="extClient"]:checked').val() === "No") {
								c.sections.formAdditionalHeader1.html(c.countryInfo[c.country].services[c.services].additionalQuestion1);
						 		c.sections.formAdditionalText1.removeClass('hide');

						 		if (!$('#contactFormAll').hasClass('hide')) {
									$('html,body').animate({scrollTop: c.sections.formAdditionalText1.offset().top},'slow');
						  		}

						 		$('.button-wrap #additionalQ1Continue').removeClass('hide');

						 		$('#additionalQ1Continue').on('click', function (e) {
							 		e.preventDefault();
							 		$('.button-wrap #additionalQ1Continue').addClass('hide');

							 		$('input[name="addQn1"]').val(c.countryInfo[c.country].services[c.services].additionalQuestion1);

							  		if ($('input[name="additionalQuestion1"]:checked').val() === "Yes") {
								  		$('input[name="addQn1Ans"]').val("Yes");
										c.sections.formDetails.removeClass('hide');
										c.sections.formAll.removeClass('hide');
										$('#additionalQn').removeClass('hide');
										c.sections.formAddress.removeClass('hide');

										if (!$('#contactFormAll').hasClass('hide')) {
											$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
								  		}

										// Process Address
										c.processAddress();
									} else {

								 		$('input[name="addQn1Ans"]').val("No");
							  			c.sections.formAdditionalHeader2.html(c.countryInfo[c.country].services[c.services].additionalQuestion2);
							  			c.sections.formAdditionalText2.removeClass('hide');
							  			$('.button-wrap #additionalQ2Continue').removeClass('hide');

							  			$('#additionalQ2Continue').on('click', function (e) {
											e.preventDefault();

											$('.button-wrap #additionalQ2Continue').addClass('hide');

											if ($('input[name="additionalQuestion2"]:checked').val() === "Yes") {
												$('input[name="addQn2Ans"]').val("Yes");
									   			c.sections.formDetails.removeClass('hide');
									   			c.sections.formAll.removeClass('hide');
									   			$('#additionalQn').removeClass('hide');
									   			c.sections.formAddress.removeClass('hide');

									   			if (!$('#contactFormAll').hasClass('hide')) {
										   			$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
										 		}

									   			// Process Address
									   			c.processAddress();
								   			} else {

									   			$('input[name="addQn2Ans"]').val("No");
									  			c.sections.formAdditionalHeader3.html(c.countryInfo[c.country].services[c.services].additionalQuestion3);
									  			c.sections.formAdditionalText3.removeClass('hide');
									  			$('.button-wrap #additionalQ3Continue').removeClass('hide');

									  			$('#additionalQ3Continue').on('click', function (e) {
											 		e.preventDefault();
													$('.button-wrap #additionalQ3Continue').addClass('hide');

											 		if ($('input[name="additionalQuestion3"]:checked').val() === "Yes") {

												 		$('input[name="addQn3Ans"]').val("Yes");
											   			c.sections.formDetails.removeClass('hide');
														c.sections.formAll.removeClass('hide');
														$('#additionalQn').removeClass('hide');
														c.sections.formAddress.removeClass('hide');

														if (!$('#contactFormAll').hasClass('hide')) {
															$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
												  		}

														// Process Address
														c.processAddress();
													} else {
											   			c.sections.formAdditionalMessage.removeClass('hide');
														c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].additionalSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
													}

										 		});
									 		}

										});
									}

						 		});

				   			} else {
					   			c.sections.formAddress.removeClass('hide');
					   			c.sections.formDetails.removeClass('hide');
					   			$('#additionalQn').addClass('hide');
					   			c.sections.formAll.removeClass('hide');

								if (!$('#contactFormAll').hasClass('hide')) {
									$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
				  				}
				   			}

				  			// Process Address
				  			c.processAddress();
				  			return false;
				 		}
					});

		  		} else {

			  		//c.sections.formAddress.removeClass('hide');
			  		//c.sections.formMode.removeClass('hide');
			  		if (($('input[name="extClient"]:checked').val() === "Yes" && c.countryInfo[c.country].services[c.services].isClientSevice === "0") || ($('input[name="extClient"]:checked').val() === "No" && c.countryInfo[c.country].services[c.services].isProspectSevice === "0")) {

				  		c.sections.formAdditionalMessage.removeClass('hide');

				  		if ($('input[name="extClient"]:checked').val() === "Yes") {
					 		c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].clientSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
				 		} else {
					 		c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].prospectSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
					 	}
				  		return false;
			 		} else if (c.countryInfo[c.country].services[c.services].isAdditionalQuestions === "1" && $('input[name="extClient"]:checked').val() === "No") {

						// Show Services Additional Text/Questions
				  		c.sections.formAdditionalHeader1.html(c.countryInfo[c.country].services[c.services].additionalQuestion1);
				  		c.sections.formAdditionalText1.removeClass('hide');
				  		$('.button-wrap #additionalQ1Continue').removeClass('hide');

				   		if (!$('#contactFormAll').hasClass('hide')) {

					  		$('html,body').animate({scrollTop: c.sections.formAdditionalText1.offset().top},'slow');
						}

				   		$('#additionalQ1Continue').on('click', function (e) {
					   		e.preventDefault();

					   		$('.button-wrap #additionalQ1Continue').addClass('hide');

					   		if ($('input[name="additionalQuestion1"]:checked').val() === "Yes") {

						   		$('input[name="addQn1Ans"]').val("Yes");
						  		c.sections.formDetails.removeClass('hide');
						  		c.sections.formAll.removeClass('hide');
						  		$('#additionalQn').removeClass('hide');
						  		c.sections.formAddress.removeClass('hide');

						  		if (!$('#contactFormAll').hasClass('hide')) {
							  		$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
								}

						  		// Process Address
						  		c.processAddress();
					  		} else {

						  		$('input[name="addQn1Ans"]').val("No");
						  		c.sections.formAdditionalHeader2.html(c.countryInfo[c.country].services[c.services].additionalQuestion2);
						  		c.sections.formAdditionalText2.removeClass('hide');
						  		$('.button-wrap #additionalQ2Continue').removeClass('hide');

						  		$('#additionalQ2Continue').on('click', function (e) {
							  		e.preventDefault();
							  		$('.button-wrap #additionalQ2Continue').addClass('hide');

							  		if ($('input[name="additionalQuestion2"]:checked').val() === "Yes") {
								 		$('input[name="addQn2Ans"]').val("Yes");
								 		c.sections.formDetails.removeClass('hide');
								 		c.sections.formAll.removeClass('hide');
								 		$('#additionalQn').removeClass('hide');
								 		c.sections.formAddress.removeClass('hide');

								 		if (!$('#contactFormAll').hasClass('hide')) {
									 		$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
								   		}
								 		// Process Address
								 		c.processAddress();

							 		} else {

								 		$('input[name="addQn2Ans"]').val("No");
								 		c.sections.formAdditionalHeader3.html(c.countryInfo[c.country].services[c.services].additionalQuestion3);
								  		c.sections.formAdditionalText3.removeClass('hide');
								  		$('.button-wrap #additionalQ3Continue').removeClass('hide');

								  		$('#additionalQ3Continue').on('click', function (e) {
											e.preventDefault();
											$('.button-wrap #additionalQ3Continue').addClass('hide');

											if ($('input[name="additionalQuestion3"]:checked').val() === "Yes") {

										   		$('input[name="addQn3Ans"]').val("Yes");
										   		c.sections.formDetails.removeClass('hide');
										   		c.sections.formAll.removeClass('hide');
										   		$('#additionalQn').removeClass('hide');
										   		c.sections.formAddress.removeClass('hide');

										   		if (!$('#contactFormAll').hasClass('hide')) {
											   		$('html,body').animate({scrollTop: c.sections.formAddress.offset().top},'slow');
											 	}

										   		// Process Address
										   		c.processAddress();

									   		} else {
										   		c.sections.formAdditionalMessage.removeClass('hide');
										   		c.sections.formAdditionalMessage.html('<p>' + c.countryInfo[c.country].services[c.services].additionalSorryMessage.replace(/ /g, "&nbsp;").replace(/\n/g,'<br>') + '</p>');
									   		}
										});
									}
						  		});
					  		}
				   		});

			 		} else {
			 			// Show Services Address
			  			c.sections.formAddress.removeClass('hide');
			  			c.sections.formDetails.removeClass('hide');
			  			c.sections.formAll.removeClass('hide');
			  			$('#additionalQn').addClass('hide');
			  			// Process Address
			  			c.processAddress();
					}
		  		}

			  	// De-select the Mode
			  	//this.fields.country.iCheck('uncheck');
			  	// Uncheck and show all Mode of Communications
			  	//this.fields.country.iCheck('uncheck');

		  		//scrolling the page to mode section BWP-1276
		  		if (!$('#contactformAll').hasClass('hide')) {
					$('html,body').animate({scrollTop: c.sections.formServices.offset().top},'slow');
		  		}
		 	}

			// Process Address
			this.processAddress = function () {

		  		var c = this,
			  	serviceObj;

		  		serviceObj = c.countryInfo[c.country].services[c.services];

		  		// Hide all the sections
		  		$.each([
					c.officeAddress.serviceType, c.officeAddress.buName,
					c.officeAddress.address1, c.officeAddress.address2,
					c.officeAddress.address3, c.officeAddress.address4,
					c.officeAddress.postCode, c.officeAddress.email,
					c.officeAddress.email, c.officeAddress.fax, c.officeAddress.openingHour
					], function(i, $el) {
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
					c.officeAddress.addressWrap.addClass('hide');
		  		} else {
					c.officeAddress.addressWrap.removeClass('hide');
		  		}

		  		/* Telephone Wrap */
		  		if (telephone === "" && fax ==="") {
					c.officeAddress.phoneWrap.addClass('hide');
		  		} else {
					c.officeAddress.addressWrap.removeClass('hide');
		  		}

		  		/* Time Wrap */
		  		if (openingHour === "") {
					c.officeAddress.timeWrap.addClass('hide');
		  		} else {
					c.officeAddress.addressWrap.removeClass('hide');
		  		}

		  		/* Show the Sections if the data is present in the JSON */
		  		if (serviceType !== "") {
					c.officeAddress.serviceType.text(serviceObj["name"]).removeClass('hide');
		  		}

		  		if (buName !== "") {
					c.officeAddress.buName.text(serviceObj["buName"]).removeClass('hide');
		  		}

		  		if (address1 !== "") {
					c.officeAddress.address1.text(serviceObj["addr1"]).removeClass('hide');
		  		}

		  		if (address2 !== "") {
					c.officeAddress.address2.text(serviceObj["addr2"]).removeClass('hide');
		  		}

			  	if (address3 !== "") {
					c.officeAddress.address3.text(serviceObj["addr3"]).removeClass('hide');
			  	}

			  	if (address4 !== "") {
					c.officeAddress.address4.text(serviceObj["addr4"]).removeClass('hide');
			  	}

			  	if (postCode !== "") {
					c.officeAddress.postCode.text(serviceObj["postCode"]).removeClass('hide');
			  	}

			  	if (email !== "") {
					c.officeAddress.email.text(serviceObj["email"]).removeClass('hide');
			  	}

			  	if (telephone !== "") {
					c.officeAddress.telephone.html(serviceObj["telephone"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
			  	}

			  	if (fax !== "") {
					c.officeAddress.fax.html(serviceObj["fax"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
			  	}

			  	if (openingHour !== "") {
					c.officeAddress.openingHour.html(serviceObj["openingHour"].replace(/ /g, "&nbsp;").replace(/\n/g,'<br>')).removeClass('hide');
			  	}

				//Popluate the users country to the postal mode country field
			  	if (c.countryInfo[c.country].name !== "Rest of World") {
					c.fields.modePostalCountry.val(c.countryInfo[c.country].name);
					c.fields.modePostalCountry.attr('readonly', 'readonly');
			  	} else {
				  	c.fields.modePostalCountry.val("");
				  	c.fields.modePostalCountry.attr('readonly', false);
			  	}
			}


			// Populate Select Fields
			this.populateSelect = function (defaultTxt, obj, element) {

			  	var c = this,
				  	items = [];

		  		// Populate Country Options
		  		items[0] = "<option value=''>" + defaultTxt + "</option>";

		  		for (l in obj) {
					items.push("<option value='" + l + "'>" + obj[l].name +"</option>");
		  		}

		  		element.empty().html(items.join(''));
		  		c.fields.services.selectBox('refresh');

			}

		 	// add a Contact Form Validation rule
			jQuery.validator.addMethod(
				"numberAndPlus",
				function(value, element) {
					return this.optional(element) || /^(\+[0-9]{1,4}$|[0-9]{0,4}$)/.test(value);
				}, "Please enter a valid phone number"
			);

			// Contact Form Validation
			this.formValidation = function () {

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
			}

			// Custom Form Styles
			this.customFormStyles = function () {
			  	// Style the Checkbox and Radio Button
			  	$('input').iCheck({
					checkboxClass: 'icheckbox_minimal-blue',
					radioClass: 'iradio_minimal-blue'
			  	});

			  	// Show the Contact Form Based on the Country and Existing Client
			  	$('select').selectBox();
			}

			// Form Tooltip
			this.tooltip = function () {

		  		$('#contactForm').find('.tooltipIndicator').focus(function(){
					$('.frmTooltipWrap').hide();
		  		});

		  		$('#contactForm').find('input, radio, select, textarea, body').blur( function() {
					$('.frmTooltipWrap').hide();
		  		});

		 		$('.tooltipIndicator').hover (function(e) {

					e.preventDefault();

					var t = $(this),
						tooltip = $('.frmTooltipWrap');

					tooltip.css({
			  			"left": t.position().left - 17,
			  			"top": t.offset().top - 304
					});

					tooltip.find('.content').text(t.closest('div').children('.reqTooltip').attr('message'));

					var toolTipHt = $('.frmTooltipWrap').height(),
						toolTipArrow = $('.tt-arrow').css('top').replace('px','');


					if ($.browser.msie) {

			  			if (tooltip.height() == 33 ) {
				  			$('.tt-arrow').css("top", '47px');
						}

			   			if (tooltip.height() != 33  && tooltip.height() > 33  ) {
				  			tooltip.css({
				   				"top": (t.offset().top - 304 ) - 15
				  			});
				  		if (toolTipArrow >= 36) {
							$('.tt-arrow').css("top", toolTipHt  + 16);
				  		}
					}

					if (tooltip.height() < 33 ) {
				  		tooltip.css({
				   			"top": (t.offset().top - 304 ) + 10,
				   			"left": t.position().left - 17
				  		});

				  		if (toolTipArrow > 36) {
							$('.tt-arrow').css("top", toolTipArrow - toolTipHt + 9);
				  		}
					}

					} else {
						if (tooltip.height() < 31 ) {
				  			tooltip.css({
				   				"top": (t.offset().top - 304 ) + 10,
				   				"left": t.position().left - 17
				  			});
				  		if (toolTipArrow > 36) {
							$('.tt-arrow').css("top", toolTipArrow - toolTipHt + 9);
				  		}
					}

				 	if (tooltip.height() == 31 ) {
				  		$('.tt-arrow').css("top", '47px');
					}

					if (tooltip.height() > 31 ) {
				  		tooltip.css({
				   			"top": (t.offset().top - 304 ) - 15
				  		});
				  	if (toolTipArrow >= 36) {
						$('.tt-arrow').css("top", toolTipHt  + 16);
				  	}
				}
			}

		   	$('.frmTooltipWrap').delay(500).show(0);
			  	e.stopPropagation();
		  	}, function () {
			 	$('.frmTooltipWrap').delay(200).hide(0);
		  	});

	   	}
		this.init();
	}

	return new ContactUs();

	}());

}(window.BW = window.BW || {}, jQuery));