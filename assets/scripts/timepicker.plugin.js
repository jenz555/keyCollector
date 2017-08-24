;(function ( $ ) {

	'use strict';

	if (typeof $.als === 'undefined') {
		throw "Oops! It looks like you are missing globals.js. You can download it from https://github.allstate.com/UIEngineering/UIToolkitBoilerplate/tree/master/assets/scripts/globals.js";
		return;
	}

	// TIMEPICKER CALENDAR-STYLE
	// ---------------------------------------------------------------------------
	$.als.plugins.timePickerScheduler = function (timepicker, config) {

		this.utiliites = $.als.utilities;

		this.timepickerInput = timepicker;

		this.exclusions = [];

		this.tabIndex = 0;

		this.timepickerId = $('.timepicker--schedulerWrapper').length;

		this.activeTimepicker = -1;

		this.isTouch = 'ontouchstart' in document.documentElement;

		this.isMac = !!window.navigator.userAgent.match(/macintosh/gi);

		this.config = $.extend({
			onload: false,
			modifierClass: '',
			showSetToNow: false,
			defaultTimeZone: this.getTimeZone(new Date().toString()).trim(),
			timezones: [],
			minuteIncrements: 5 // 1, 5, 15, 30, 45
		}, config);

		this.showTimeZones = this.config.timezones.length ? true : false;

		this.config.modifierClass = this.config.minuteIncrements === 1 ? this.config.modifierClass + ' timepicker--scheduler--overflow' : this.config.modifierClass

		this.init();

		return this;
	}

	$.als.plugins.timePickerScheduler.prototype = {
		accessibilize: function (e) {

			var activeTimepicker          = this.$timepicker.find(this.asClass(this.CSS_CLASS.TIMEPICKER_SCHEDULER)).is(':visible'),
				  $lastSelectedOption       = $(this.asClass(this.CSS_CLASS.TIMEPICKER_OPTION)).eq(this.tabIndex),
					$timePickerOption         = this.$timepicker.find(this.asClass(this.CSS_CLASS.TIMEPICKER_OPTION)),

					upDownArrowKeyIncrement   = 6,

					// Current seleced item
					$selectedOption           = $timePickerOption.eq(this.tabIndex),

					// Get section of selected item
					$currentSection           = $selectedOption.parents(this.asClass(this.CSS_CLASS.TIMEPICKER_MODULE)),

					// Check if selectd option is disabled
					selectedOptionIsDisabled  = $lastSelectedOption.is('[disabled]'),

					// Get total number of unselected options
					unselectedOptionsLength   = $timePickerOption.length - 1,

					// Determine id selected option is a "close" or "set" button
					isSetBtn                  = $timePickerOption.eq(this.tabIndex).hasClass('btn--setTime'),
					isCloseBtn                = $timePickerOption.eq(this.tabIndex).hasClass('btn--close'),

					$timePickerOption,

					// Key codes
					isEnterKey	    = e.keyCode === 13,
					isEscapeKey     = e.keyCode === 27,
					isLeftArrowKey  = e.keyCode === 37,
					isUpArrowKey    = e.keyCode === 38,
					isDownArrowKey  = e.keyCode === 40,
					isRightArrowKey = e.keyCode === 39;

			// prevent default tabing behavior when timepicker is open
			if (activeTimepicker) {

				e.preventDefault();

				if (isRightArrowKey) {
					this.tabIndex = (this.tabIndex === unselectedOptionsLength) ? 0 : this.tabIndex += 1;
				}

				if (isLeftArrowKey) {
					this.tabIndex = (this.tabIndex === -1 || this.tabIndex === 0) ? unselectedOptionsLength : this.tabIndex -= 1;
				}

				// TODO: THIS LOGIC IS MESSY! - REVISE LOGIC TO BE DOM INDEPENDENT
				if (isDownArrowKey) {
					if (isSetBtn) {
						return;
					}
					else if ($currentSection.is(':last-of-type')
						  && $selectedOption.nextAll().length < upDownArrowKeyIncrement) {
						this.tabIndex += $selectedOption.nextAll().length + 1;
					}
					else if ($currentSection.children().length < upDownArrowKeyIncrement) {
						this.tabIndex += $selectedOption.nextAll().length + 1;
					}
					else {
						this.tabIndex += upDownArrowKeyIncrement;
					}
				}

				// TODO: THIS LOGIC IS MESSY! - REVISE LOGIC TO BE DOM INDEPENDENT
				if (isUpArrowKey) {
					if ($currentSection.is(':first-of-type')
							&& $selectedOption.prevAll().length < upDownArrowKeyIncrement) {
						return;
					}
					else if ($currentSection.prev().children().length < upDownArrowKeyIncrement
									 && $selectedOption.prevAll().length < upDownArrowKeyIncrement) {
						this.tabIndex -= $selectedOption.prevAll().length + 1;
					}
					else {
						this.tabIndex -= upDownArrowKeyIncrement;
					}
				}

				if (isEnterKey && !selectedOptionIsDisabled) {
					if (isSetBtn) {
						this.setTimeInput(this)
							  .closeTimepicker(this);
					}
					else {
						this.setSelectedOption($selectedOption)
								.setBlockedOutHours();
					}
				}

				if (isEscapeKey) {
					this.closeTimepicker(this);
				}

				$timePickerOption.removeClass(this.CSS_CLASS.IS_TABBED);
				$timePickerOption.eq(this.tabIndex).addClass(this.CSS_CLASS.IS_TABBED);
			}
		},
		asClass: function (className) {
			return '.' + className;
		},
		asId: function (idName) {
			return '#' + idName;
		},
		bindTimePickerToDOM: function () {

			var self = this,
				options = '';

			function createHourOptions () {

				var options = '',
					i = 1;

				for (; i <= 12; i += 1) {

					options += self.utiliites.renderTemplate(self.templates.timePickerOption, {
						'@text': i,
						'@title': '',
						'@dataProp': 'selectedHour',
						'@ariaSelected': (i == self.selectedHour ? true : false),
						'@selectedClass': (i == self.selectedHour ? ' isSelected' : '')
					});
				}

				return options;
			}

			function createMinuteOptions () {

				var options = '',
					numOptions = 60 / self.config.minuteIncrements,
					minute = 0,
					text,
					i = 0;

				for (; i < numOptions; i += 1) {

					minute += i === 0 ? 0 : self.config.minuteIncrements;
					text = (minute < 10) ? ':0' + minute : ':' + minute;

					options += self.utiliites.renderTemplate(self.templates.timePickerOption, {
						'@text': text,
						'@title': '',
						'@dataProp': 'selectedMinute',
						'@ariaSelected': (text === self.selectedMinute ? true : false),
						'@selectedClass': (text === self.selectedMinute ? ' isSelected' : '')
					});
				}

				return options;
			}

			function createTimeZoneOptions () {

				var options = '';

				if (self.config.timezones && self.config.timezones.length) {
					self.config.timezones.forEach(function (timezone, i) {
						for (var prop in timezone) {
							if (timezone.hasOwnProperty(prop)) {
								options += self.utiliites.renderTemplate(self.templates.timePickerOption, {
									'@text': prop,
									'@title': timezone[prop],
									'@dataProp': 'selectedTimezone',
									'@ariaSelected': (prop === self.selectedTimezone ? true : false),
									'@selectedClass': (prop === self.selectedTimezone ? ' isSelected' : '')
								});
							}
						}
					});
				}

				return options;
			}

			// Timepicker template
			var timepickerHTML = this.templates.timepicker.slice(0);

			// If showSetToNow = true, prepend template with "Set to current time" button
			if (this.config.showSetToNow) {
				timepickerHTML.unshift(this.templates.setToCurrentBtn);
			}

			// Wrap timepicker input with timepicker wrapper div
			this.timepickerInput.wrap(this.utiliites.renderTemplate(
				this.templates.timePickerWrapper, {
					'@timepickerId': this.timepickerId
				})
			);

			// Get a reference to the new timepicker wrapper
			this.$timepicker = $('#timepicker--scheduler-' + this.timepickerId);

			// Append timepicker to wrapper and replace placeholders with markup content
			this.$timepicker.append(
				self.utiliites.renderTemplate(timepickerHTML.join(''), {
					'@selectedTime': this.getSelectedTime() || '',
					'@modifierClass': this.config.modifierClass || '',
					'@hourOptions': createHourOptions(),
					'@minuteOptions': createMinuteOptions(),
					'@timeZoneOptions': createTimeZoneOptions(),
					'@timeZoneShowHideClass': !this.showTimeZones ? ' isHidden' : ''
				})
			);

			// Set placeholder for timepicker input to default
			// selected time. Make input readonly.
			this.$timepicker
				.find('input[type="text"]')
				.attr('placeholder', this.getSelectedTime())
				.attr('readonly', true);

			return this;
		},
		bindEvents: function () {

			var self = this;

			if (this.config.onload) {
				self.showTimepicker(self, $('.timepicker', self.$timepicker));
			}

			// timepicker input - on click
			this.ELEMENTS.$TIMEPICKER_INPUT.on(this.isTouch ? 'click touchstart' : 'click focus', function (e) {

				var $this = $(this);

				e.stopPropagation();
				e.preventDefault();

				self.showTimepicker(self, $this);

				self.handleOnShowCallback();
			});

			// timepicker time of day option - on click
			this.ELEMENTS.$TOD_OPTION.on('click', function () {
				setTimeout(function () {
					self.setBlockedOutHours();
				}, 10);
			});

			// timepicker all close/set buttons - on click
			this.ELEMENTS.$ALL_CLOSE_BTNS.on('click', function () {
				if (!!$(this).attr('disabled')) return false;
				self.closeTimepicker(self)
						.handleOnHideCallback();
			});

			// document - on click
			this.ELEMENTS.$DOCUMENT.on('click touchstart', function (e) {
				if (e.which === 3) return;

				$(self.asClass(self.CSS_CLASS.TIMEPICKER_WRAPPER)).removeClass(self.CSS_CLASS.IS_ACTIVE);
				self.activeTimepicker = -1;
				self.resetTabIndex();
			});

			// document - on keydown
			this.ELEMENTS.$DOCUMENT.on('keydown', function (e) {
				self.accessibilize(e);
			});

			// timepicker option - on click
			this.ELEMENTS.$TIMEPICKER_OPTION.on('click', function () {

				var $this = $(this);

				self.setSelectedOption($this);
			});

			// timepicker close button - on click
			this.ELEMENTS.$CLOSE_BTN.on('click', function () {
				self.resetTimepickerUI();
			});

			// timepicker "set time" and "set to current" - on click
			this.ELEMENTS.$SET_BTNS.on('click', function () {
				if (!!$(this).attr('disabled')) return false;
				self.setTimeInput(self, $(this));
			});

			// timepicker * - on click
			$(self.asClass(self.CSS_CLASS.TIMEPICKER_SCHEDULER) + ' *').on('click touchstart', function (e) {
				e.stopPropagation();
			});

			return this;
		},
		showTimepicker: function (self, $el) {

			$(self.asClass(self.CSS_CLASS.TIMEPICKER_WRAPPER)).removeClass(self.CSS_CLASS.IS_ACTIVE);
			$el.parents(self.asClass(self.CSS_CLASS.TIMEPICKER_WRAPPER)).addClass(self.CSS_CLASS.IS_ACTIVE);

			self.tabIndex = 0;

			return self;
		},
		closeTimepicker:function (self) {

			self.$timepicker.removeClass(self.CSS_CLASS.IS_ACTIVE);
			self.resetTabIndex();

			return this;
		},
		handleOnShowCallback: function () {
			if (this.config.onShow) this.config.onShow();
			return this;
		},
		handleOnHideCallback: function () {
			if (this.config.onHide) this.config.onHide();
			return this;
		},
		getCurrentTime: function () {

			var d   = new Date(),
				h   = d.getHours() > 12 ? d.getHours() - 12 : d.getHours(),
				m   = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes(),
				tod = d.getHours() < 12 ? ' AM ' : ' PM ',
				tz  = this.config.timezones ? this.getTimeZone(d.toString()) : '';

			return h + ':' + m + tod + tz;
		},
		getSelectedTime: function () {
			return this.selectedHour
						+ this.selectedMinute
						+ ' '
						+ this.selectedTod
						+ ' '
						+ this.selectedTimezone;
		},
		getTimeZone: function (time) {
			var timezone = this.isTouch || this.isMac ? time.toString().match(/\(([A-Za-z\s].*)\)/)[1] : time.toString().match(/\(([A-Za-z\s].*)\)/)[1].match(/\b(\w)/g).join('').toUpperCase();

			return timezone;
		},
		init: function () {

			this.resetDefaults()
				.validateOptions()
				.bindTimePickerToDOM()
				.setConstants()
				.bindEvents();

			if (this.config.blockOutTimes) {
				this.setBlockedOutTimes()
					.setBlockedOutHours();
			}

			return this;
		},
		preventSelectionOfDisabledTime: function () {

			var selectedMinutes = this.selectedMinute,
				selectedMinutesOption = this.$timepicker.find('[data-prop="selectedMinute"]:contains("' + selectedMinutes + '")');

			this.$timepicker
				.find('.btn--setTime')
				.attr('disabled', selectedMinutesOption.attr('disabled') === 'disabled' ? true : false);

			return this;
		},
		resetTabIndex: function () {
			this.tabIndex = 0;
			this.$timepicker
				.find(this.asClass(this.CSS_CLASS.TIMEPICKER_OPTION))
				.removeClass(this.CSS_CLASS.IS_TABBED);

			return this;
		},
		resetTimepickerUI: function () {

			var self = this;

			this.$timepicker
				.find(this.asClass(this.CSS_CLASS.TIMEPICKER_OPTION))
				.removeClass(this.CSS_CLASS.SELECTED)
				.removeAttr('disabled');

			['AM', '12', ':00', this.config.defaultTimeZone].forEach(function (item) {
				self.$timepicker
					.find(self.asClass(self.CSS_CLASS.TIMEPICKER_OPTION + ':contains("' + item + '")'))
					.addClass(self.CSS_CLASS.SELECTED);
			});

			this.resetDefaults()
				.setTimepickerLabel()
				.setBlockedOutHours();

			return this;
		},
		resetDefaults: function () {

			var d       = new Date(),
				hour    = d.getHours(),
				minutes = d.getMinutes();

			this.selectedTod      = 'AM';
			this.selectedHour     = '12';
			this.selectedMinute   = ':00';
			this.selectedTimezone = this.config.timezones ? this.config.defaultTimeZone : '';

			return this;
		},
		setBlockedOutHours: function () {

			var self       = this,
				exclusions = this.exclusions;

			this.$timepicker
				.find('[data-prop="selectedHour"]')
				.attr('disabled', false);

			exclusions.forEach(function (timeRanges) {
				timeRanges.forEach(function (range) {
					if (range.length) {
						var rangeTod        = range[0].match(/am|pm/gi).toString(),
							rangeHour       = range[0].split(':')[0],
							fullHourblocked = range.length === (60 / self.config.minuteIncrements);

						if (rangeTod === self.selectedTod.toLowerCase() && fullHourblocked) {
							self.$timepicker
								.find('[data-prop="selectedHour"]:contains("' + rangeHour + '")')
								.attr('disabled', true);
						}
					}
				});
			});

			return this;
		},
		setBlockedOutTimes: function () {

			var self             = this,
				minuteIncrements = self.config.minuteIncrements,
				nextMinute       = 0,
				numOptions       = 60 / minuteIncrements,
				blockedOutTimes  = this.config.blockOutTimes,
				minutesArray     = [],
				i                = 0,
				timesArray;

			for (; i < numOptions; i += 1) {
				nextMinute += i === 0 ? 0 : minuteIncrements;
				minutesArray.push(nextMinute < 10 ? '0' + nextMinute : nextMinute);
			}

			blockedOutTimes.forEach(function (timeRange) {

				var

					// Start and end times
					startTime          = timeRange[0],
					endTime 		   = timeRange[1],

					// Start and end hours
					startTimeHour      = startTime.split(':')[0],
					endTimeHour        = endTime.split(':')[0],

					// Start and end time minutes
					startTimeMinutes   = startTime.split(':')[1].replace(/am|pm/gi, ''),
					endTimeMinutes     = endTime.split(':')[1].replace(/am|pm/gi, ''),

					// Start and end time of day
					startTod           = startTime.match(/am|pm/gi).toString(),
					endTod    		   = endTime.match(/am|pm/gi).toString(),

					// Check if start and end times occur at the top of the hour
					start_notTopOfHour = !startTimeMinutes.match(/00/g),
					end_notTopOfHour   = !endTimeMinutes.match(/00/g),

					// Full start and end time strings
					fullStartTime      = startTime.replace(/am|pm/gi, ''),
					fullEndTime        = endTime.replace(/am|pm/gi, ''),

					// Start hour
					startHour 		   = startTod === 'am' ? parseInt(startTimeHour)
														   : parseInt(startTimeHour) + 12,

					// End hour
					endHour   		   = endTod === 'am' ? parseInt(endTimeHour)
													     : parseInt((endTimeHour === '12' ? 0 : endTimeHour)) + 12,

					// Array to store times
					timesArray 		   = [],

					// incrementor
					i = startHour
				;

				if (startTod === 'pm' && endTod === 'am') {
					endHour = 24 + endHour;
				}

				for (; i <= endHour; i++) {
					timesArray.push(minutesArray.map(function (minutes) {
						var hours = i >= 24 ? i - 24 : i;
						return (hours > 12 ? Math.abs(12 - hours) : (hours === 0 ? 12 : hours)) + ':' + minutes + (hours >= 12 ? 'pm' : 'am');
					}));
				}

				// Filter out any times prior to start time and after end time
				timesArray.forEach(function (timeRange, i) {
					var startTimeIndex = timeRange.indexOf(startTime),
						endTimeIndex = timeRange.indexOf(endTime);

					if (startTimeIndex !== -1) {
						timeRange.splice(0, startTimeIndex);
					}
					if (endTimeIndex === 0) {
						timesArray.splice(i, 1);
					}
					if (endTimeIndex !== -1 && endTimeIndex !== 0) {
						timeRange.splice(endTimeIndex, timeRange.length);
					}
				});

				self.exclusions.push(timesArray);
			});

			return this;
		},
		setConstants: function () {

			this.CSS_CLASS = {
				'IS_ACTIVE': 		        'isActive',
				'IS_TABBED': 		        'isTabbed',
				'SELECTED':  		        'isSelected',
				'SET_TO_NOW': 		      'btn--setToNow',
				'TIMEPICKER_OPTION': 	  'timepicker__optionModule__option',
				'TIMEPICKER_SCHEDULER': 'timepicker--scheduler',
				'ENABLED_OPTION':       'timepicker__optionModule__option:not([disabled])',
				'TIMEPICKER_WRAPPER':   'timepicker--schedulerWrapper',
				'CLOSE_BTN': 		        'btn--close',
				'TIMEPICKER_MODULE':    'timepicker--scheduler__optionModule'
			};

			this.ELEMENTS = {
				'$DOCUMENT':          $(document),
				'$TIMEPICKER_INPUT':  this.$timepicker.find('input[type="text"]'),
				'$TOD_OPTION':        this.$timepicker.find('[data-prop="selectedTod"]'),
				'$CLOSE_BTN':  		    this.$timepicker.find('.btn--close'),
				'$ALL_CLOSE_BTNS':    this.$timepicker.find('.btn--close, .btn--setTime, .btn-setToCurrentTime'),
				'$TIMEPICKER_OPTION': this.$timepicker.find('.timepicker__optionModule__option'),
				'$SET_BTNS':          this.$timepicker.find('.btn--setTime, .btn--setToNow'),
				'$ALL_TIMEPICKERS':   $('[id^="timepicker"]')
			};

			return this;
		},
		setExclusions: function () {

			var self       = this,
				exclusions = this.exclusions;

			this.$timepicker
				.find('[data-prop="selectedMinute"]')
				.attr('disabled', false);

			exclusions.forEach(function (timeRanges) {
				timeRanges.forEach(function (range) {
					if (range.length) {

						var hourIsMatch = range[0].split(':')[0] === self.selectedHour;

						if (hourIsMatch) {
							range.forEach(function (time) {

								var todIsMatch  = time.match(self.selectedTod.toLowerCase()),
									hourIsMatch = time.split(':')[0].match(self.selectedHour),
									minutes     = time.split(':')[1].replace(/am|pm/gi, '');

									self.$timepicker
										.find('[data-prop="selectedMinute"]:not([disabled]):contains("' + minutes + '")')
										.attr('disabled', hourIsMatch && todIsMatch ? true : false);
							});
						}
					}
				});

			});

			return this;
		},
		setSelectedOption: function ($el) {

			var self = this;

			if ($el.attr('disabled')) return;

			self[$el.data('prop')] = $el.text();

			$el.siblings().removeClass(self.CSS_CLASS.SELECTED).attr('aria-selected', false);

			$el.addClass(self.CSS_CLASS.SELECTED).attr('aria-selected', true);

			$(self.asClass(self.CSS_CLASS.TIMEPICKER_OPTION)).removeClass(self.CSS_CLASS.IS_TABBED);

			self.tabIndex = self.$timepicker.find(self.asClass(self.CSS_CLASS.TIMEPICKER_OPTION)).index($el);

			self.setTimepickerLabel();

			if (self.exclusions.length) {
				self.setExclusions()
						.preventSelectionOfDisabledTime();
			}

			return this;
		},
		setTimeInput: function (self, $el) {

			var isCurrentTime = (typeof $el !== 'undefined') ? $el.hasClass(self.CSS_CLASS.SET_TO_NOW) : false;

			self.$timepicker
				.find('.input--timepicker')
				.val(isCurrentTime ? self.getCurrentTime() : self.getSelectedTime());

			if (isCurrentTime) {
				self.resetTimepickerUI();
			}

			return this;
		},
		setTimepickerLabel: function (timeStr) {
			this.$timepicker
				.find('.timepicker--scheduler__header__label')
				.text(timeStr ? timeStr : this.getSelectedTime());

			return this;
		},
		templates: {
			timepicker: [
				'<div class="timepicker--scheduler @modifierClass">',
					'<div class="timepicker--scheduler__header">',
						'<div class="timepicker--scheduler__header__label" role="heading">@selectedTime</div>',
					'</div>',
					'<div class="timepicker--scheduler__body">',
						'<div class="timepicker--scheduler__optionModule" data-section="Hour">@hourOptions</div>',
						'<div class="timepicker--scheduler__optionModule" data-section="Minutes">@minuteOptions</div>',
						'<div class="timepicker--scheduler__optionModule" data-section="Time of Day">',
							'<div data-prop="selectedTod" aria-selected="true" class="timepicker__optionModule__option isSelected">AM</div>',
							'<div data-prop="selectedTod" aria-selected="false" class="timepicker__optionModule__option">PM</div>',
						'</div>',
						'<div class="timepicker--scheduler__optionModule @timeZoneShowHideClass" data-section="Time Zone">@timeZoneOptions</div>',
					'</div>',
					'<div class="timepicker--scheduler__footer">',
						'<span class="timepicker__optionModule__option btn btn--setTime">Done</span>',
					'</div>',
				'</div>'
			],
			timePickerOption: '<div data-prop="@dataProp" aria-selected="@ariaSelected" class="timepicker__optionModule__option @selectedClass" title="@title">@text</div>',
			timePickerWrapper: '<span id="timepicker--scheduler-@timepickerId" class="timepicker--schedulerWrapper" role="application" />',
			setToCurrentBtn: '<a class="btn--setToNow">Set to current time</a>',
			timezoneLabel: '<span class="txt--xs">@timeZoneLabel</span>'
		},
		validateOptions: function () {

			var acceptedMinuteIncrements = [1, 5, 10, 15, 30, 45];

			// Validate to make sure that config.minuteIncrements contains allowed values
			if (acceptedMinuteIncrements.indexOf(this.config.minuteIncrements) === -1) {
				this.config.minuteIncrements = 5;
				throw 'config.minuteIncrements can only be set to: ' + acceptedMinuteIncrements;
			}

			return this;
		}
	};

	$.fn.timepicker = function (config) {
		var config = config || {};
		return this.each(function () {
			return new $.als.plugins.timePickerScheduler($(this), config);
		});
	};

}( jQuery ));
