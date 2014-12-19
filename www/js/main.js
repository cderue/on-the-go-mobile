(function() {
	'use strict';
	
	angular
		.module('onthego')
		.factory('common', [common]);
	
	function common() {
		var serverTimezoneOffset = 2;
		
		var service = {
			dateFromISO8601: dateFromISO8601,
			_t: _t,
			formatFileSize: formatFileSize,
			formatDate: formatDate,
			removeTimezoneOffset: removeTimezoneOffset,
			removeServerTimezoneOffset: removeServerTimezoneOffset,
			formatSize: formatSize,
			formatMiliseconds: formatMiliseconds,
			fnSelect: fnSelect,
			fnDeSelect: fnDeSelect,
			toggleContent: toggleContent,
			htmlEntities: htmlEntities,
			htmlEntitiesReverse: htmlEntitiesReverse,
			isString: isString,
			detectScrollbarWidth: detectScrollbarWidth
		}
		
		return service;
		
		/**
		 * 
		 */
		function dateFromISO8601(isostr) {
		  var parts = isostr.match(/\d+/g);
		
		  var utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]));
		  var offsetDate = utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
		
		  return new Date(offsetDate);
		}
			
		/**
		 * 
		 */
		function _t(str, params) {
		  return str.substitute(params);
		}
		
		/**
		 * 
		 */
		function formatFileSize(size, order) {
			if (size == 0) {
				return '';
			}
			var exp = Math.log(size) / Math.log(1024) | 0;
		    var result = (size / Math.pow(1024, exp)).toFixed(2);
		
		    return result + ' ' + (exp == 0 ? 'bytes': 'KMGTPEZY'[exp - 1] + 'B');
		
		}
		
		/**
		 * 
		 */
		function formatDate(date, dateFormat, shortforms) {
		  // convert clean timestamp to date object
		  if (typeof(date) == 'number' || typeof(date) == 'string') {
		    date = new Date(date * 1000);
		    date = removeTimezoneOffset(date);
		  }
		
		  // set the timezone offset
		  date = new Date(date.getTime() + (serverTimezoneOffset * 1000 * 3600));
		
		  if (typeof(shortforms) == "undefined") {
		    shortforms = true;
		  }
		
		  if (typeof(dateFormat) == "undefined" || dateFormat == null) {
		    dateFormat = "%d/%b/%Y %k:%M:%S";
		  }
		
		  if (shortforms) {
		    var calcDate 	= (removeTimezoneOffset(new Date())).getTime() + (serverTimezoneOffset * 1000 * 3600);
		    console.log(calcDate);
		    var today 		= new Date(calcDate);
		    var tomorrow	= new Date(calcDate).increment('day', 1);
		    var yesterday	= new Date(calcDate).decrement('day', 1);
		    var lastWeek 	= new Date(calcDate).decrement('week', 1);
		    var nextWeek 	= new Date(calcDate).increment('week', 1);
		
		    if (today.format('%d.%m.%y') == date.format('%d.%m.%y')) {
		      return date.format(_t("Today") + ', %H:%M:%S');
		    } else if (tomorrow.format('%d.%m.%y') == date.format('%d.%m.%y')) {
		      return date.format(_t("Tomorrow") + ', %H:%M:%S');
		    } else if (yesterday.format('%d.%m.%y') == date.format('%d.%m.%y')) {
		      return date.format(_t("Yesterday") + ', %H:%M:%S');
		    } else if (date > lastWeek && date < nextWeek) {
		      return date.format('%A, %H:%M:%S');
		    }
		  }
		
		  return date.format(dateFormat);
		}
		
		/**
		 * 
		 */
		function removeTimezoneOffset(date) {
		  date = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
		  return date;
		}
		
		/**
		 * 
		 */
		function removeServerTimezoneOffset(date) {
		  date = new Date(date.getTime() - serverTimezoneOffset * 3600000);
		  return date;
		}
		
		/**
		 * 
		 */
		function formatSize(size, seperator) {
		  if (size < 1000) {
		    return size;
		  }
		
		  if (seperator == undefined) {
		    seperator = '';
		  }
		
		  if (size < 1000000) {
		    return Math.floor(size / 1000) + seperator + 'k';
		  } else {
		    return Math.floor(size / 1000000) + seperator + 'm';
		  }
		}
		
		/**
		 * 
		 */
		function formatMiliseconds(miliseconds, seperator) {
		  if (miliseconds <= 0) {
		    return miliseconds;
		  }
		
		  if (seperator == undefined) {
		    seperator = '';
		  }
		
		  var seconds = (miliseconds / 1000) % 60;
		  var minutes = (miliseconds / (1000*60)) % 60;
		  var hours = (miliseconds / (1000*60*60)) % 24;
		
		  if (hours >= 16) {
		    return hours.round(1) + seperator + 'h';
		  } else if (minutes >= 1) {
		    return (minutes + (hours * 60)).round(1) + seperator + 'm';
		  } else if (seconds >= 1) {
		    return seconds.round(1) + seperator + 's';
		  } else {
		    return miliseconds + seperator + 'ms';
		  }
		}
		
		/**
		 * 
		 */
		function fnSelect(objId) {
		   fnDeSelect();
		   if (document.selection)
		   {
		      var range = document.body.createTextRange();
		      range.moveToElementText(document.getElementById(objId));
		      range.select();
		   }
		   else if (window.getSelection)
		   {
		      var range = document.createRange();
		      range.selectNode(document.getElementById(objId));
		      window.getSelection().addRange(range);
		   }
		}
		
		/**
		 * 
		 */
		function fnDeSelect() {
		   if (document.selection)
		             document.selection.empty();
		   else if (window.getSelection)
		              window.getSelection().removeAllRanges();
		}
		
		/**
		 * 
		 */
		function toggleContent(target) {
		  $(target).getParent().toggleClass('mui-vars-open');
		  $(target).toggleClass('hidden');
		}
		
		/**
		 * 
		 */
		function htmlEntities(str) {
		  if (isString(str)) {
		    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		  }
		
		  return '';
		}
		
		/**
		 * 
		 */
		function htmlEntitiesReverse(str) {
		  if (isString(str)) {
		    return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		  }
		
		  return '';
		}
		
		/**
		 * 
		 */
		function isString(o) {
		  if (!o) {
		    return false;
		  }
		  return typeof o == "string" || (typeof o == "object" && o.constructor === String);
		}
		
		/**
		 * 
		 */
		function detectScrollbarWidth()  {
		  // Create the measurement node
		  var scrollDiv = document.createElement("div");
		  scrollDiv.setStyle('width', '100px');
		  scrollDiv.setStyle('height', '100px');
		  scrollDiv.setStyle('overflow', 'scroll');
		  scrollDiv.setStyle('position', 'absolute');
		  scrollDiv.setStyle('top', '-9999px');
		  document.body.appendChild(scrollDiv);
		
		  // Get the scrollbar width
		  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		
		  // Delete the DIV
		  document.body.removeChild(scrollDiv);
		  return scrollbarWidth;
		}
	}
})();
