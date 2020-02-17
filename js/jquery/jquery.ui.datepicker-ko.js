/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */
jQuery(function($){
	$.datepicker.regional['ko'] = {
		closeText: '닫기',
		prevText: '이전달',
		nextText: '다음달',
		currentText: '오늘',
		monthNames: ['1월(Jan)', '2월(Feb)', '3월(Mar)', '4월(Apr)', '5월(May)', '6월(Jun)',
		'7월(Jul)','8월(Aug)','9월(Sep)','10월(Oct)','11월(Nov)','12월(Dec)'],
		monthNamesShort: ['1월(Jan)', '2월(Feb)', '3월(Mar)', '4월(Apr)', '5월(May)', '6월(Jun)',
		'7월(Jul)', '8월(Aug)', '9월(Sep)', '10월(Oct)', '11월(Nov)', '12월(Dec)'],
		dayNames: ['일','월','화','수','목','금','토'],
		dayNamesShort: ['일','월','화','수','목','금','토'],
		dayNamesMin: ['일','월','화','수','목','금','토'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: true
		, yearSuffix: '&nbsp;'
	};

	$.datepicker.regional['en'] = {
		closeText: 'Close',
		prevText: 'Prev Month',
		nextText: 'Next Month',
		currentText: 'Today',
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		weekHeader: 'Wk',
		dateFormat: 'yy-mm-dd',
		firstDay: 0,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''
	};

	$.datepicker.setDefaults($.datepicker.regional['ko']);
});