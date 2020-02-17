/*
first coded date : 2010.09
coded by : @wimy1, wimy1@hanmail.net
description : 일반화 처리를 위한 jquery를 이용한 common.js
			: common.js와 같이 사용해야 합니다.
			: 자유롭게 변경해서 사용가능하나, 이 설명 내용을 제거하지 마십시오. 
			: 가급적이면 변경 이력을 추가해서 사용하십시오.
			: 이 코드들이 제대로 작동하지 않을 경우, 페이지의 하단에 추가해 보십시오. 
*/

//전역 : 모바일 브라우저 여부
var __isMobile = false;

//전역 : 읽기전용 필드 background-color 처리
var __readonlyColor = '#dadada';

/**
onload
*/
$(document).ready(function () {

	_initPageLoad();
});      		


/** login *********************************************************************************/
//비동기 함수이므로 붙여서 쓸 것
//ajax 로그인 체크
//jquery 필요
//type : 'front', 'admin'
//return : true:로그인, false:로그인 아님
function checkLoginAjax(type) {
	$.ajax({
		async: false
		, url: '/pages/ajax/checkLogin.aspx'
		, type: "post"
		, dataType: 'text'
		, data: {
			checkType: type == null ? 'front' : type
		}
		, success: function (msg) {
			var isLogin = eval(msg);
			return isLogin;
		}
	});
}
/************************************************************************************************/


//일반화 전처리 함수:
//여러 가지 일반화 기능이 들어있습니다.
//css class name 등으로 접근 가능합니다. 상세 내역은 각 기능별 주석을 참조하십시오.
function _initPageLoad() {

	var arrKeywords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
	var isMobile = false;
	for (var key in arrKeywords) {
		if (navigator.userAgent.indexOf(arrKeywords[key]) > -1) {
			isMobile = true;
			__isMobile = true;
			break;
		}
	}	

	//모바일 브라우저; URL 입력폼 숨김 스크롤
	if(isMobile)
		setTimeout(function () { window.scrollTo(0, 1) }, 100);

	//웹 접근성을 적용할 경우 사용 금지
	//$('img, a').focusin(function () {
	//	$(this).blur();
	//});

	//readonly 속성일 경우 색상 변경
	//추가 : nochangebgcolor 클래스를 가지고 있으면 변경안함
	$('input, select, textarea').each(function () {
		if ($(this).attr('readonly') != null && !$(this).hasClass('nochangebgcolor')) {
			if ($(this).attr('readonly') == 'readonly' || $(this).attr('readonly') == true) {
				$(this).css({ 'background-color': __readonlyColor });

				if ($(this).parent('span').parent('span.input').length = 1) {
					$(this).parent('span').parent('span.input').addClass('readonly');
				}
			}
		}
	});


	//html object cursor:pointer 속성 설정
	$('.mousePointer').each(function () {
		$(this).css({ cursor: 'pointer' });

		//if ($(this).context.nodeName.toLowerCase() == "a")
		//	$(this).css({ 'font-weight': 'bold' });
	});

	//cursor:pointer 속성 설정2 : img, a 태그에 onclick 이벤트가 있을 경우
	$('a, img').each(function () {
		if ($(this).attr('onclick') != null) {
			$(this).css({
				cursor: 'pointer'
				//, 'font-weight': 'bold'
			});
		}
	});

	//, input[type=image]
	//이미지태그, 이미지 버튼 이미지 연결 오류시
	//alert($('img').length);
	$('.onerror').each(function () {
		//alert($(this).attr('complete'))
		var sText = '이미지가 없습니다.';
		$(this).error(function () {
			$(this).attr('alt', sText).attr('title', sText);
		});
	});

	//단순 개발중 경고 이벤트
	$('.devAlert').css('cursor', 'pointer').click(function () {
		alert('구현중입니다.');
		event.preventDefault();
	});

	// 관리자페이지 전용
	$('.datepicker_admin').each(function (index) {
		if ($(this).context.nodeName == "INPUT") {
			//$(this).css({ 'ime-mode': 'disabled', 'width': '90px' });
			var result = index % 2;
			//alert(result);
			$(this).datepicker({
				showOtherMonths: true
				, showButtonPanel: true
				, selectOtherMonths: true
				//, changeMonth: true
				, changeYear: true
				, autoSize: true
				//, option: { width: 240 }
				//, minDate: $(this).attr('minDate')
				//, maxDate: $(this).attr('maxDate')
				, numberOfMonths: 3
				, onClose: function (selectedDate) {
					if (result == 0) {
						$('input.datepicker_admin').eq(index + 1).datepicker("option", "minDate", selectedDate);
					} else {
						$('input.datepicker_admin').eq(index - 1).datepicker("option", "maxDate", selectedDate);
					}
				}
			});


			if ($(this).attr('maxDate') != null) {
				//최대 날짜 등록
				var maxDate = toTimeObject(getyyyyMMdd(getDateByjQueryDateFormat($(this).attr('maxDate'), new Date())));
				$(this).data('maxDate', maxDate);
			}
		}
		else if ($(this).context.nodeName == "IMG" || $(this).context.nodeName == "A") {
			$(this).css({ cursor: 'pointer' });
			$(this).click(function () {
				$(this).prev().focus();
			});
		}
	});

	if ($('input.datepicker_admin').length > 0) {

		var objDatepickers = $('input.datepicker_admin');
		var iFormCount = 1;
		if (objDatepickers.length > 2)
			iFormCount = objDatepickers.length / 2; 				//datepicker 세트수

		var objDateRange = $('.dateRange');
		var iDateRangeCount = objDateRange.length / iFormCount; 	//날짜 범위 설정 컨트롤 개수

		objDateRange.each(function (idx, elm) {
			$(this).click(function () {

				try {
					if (iFormCount > 1) {
						var iCurrentIndex = Math.floor(idx / iDateRangeCount);
						var iMin = iCurrentIndex * 2 - 1;
						var iMax = iCurrentIndex * 2 + 2 - 1;
						//alert(iMin + " : " + iMax);
						if (iMin < 1) {
							iMax = 2;
							objDatepickers = $('input.datepicker_admin:lt(' + iMax + ')');
						}
						else
							objDatepickers = $('input.datepicker_admin:gt(' + iMin + '):lt(' + iMax + ')');
					}
					var today = new Date();
					var baseDay = $(this).attr('baseDay');
					if (baseDay != null) {
						//오늘 - 1 이 기본값
						today.setDate(today.getDate() + parseInt(baseDay, 10));
					}
					var range = $(this).attr('range');
					if (range == 'none') {
						objDatepickers.each(function (idxDate, elmDate) {
							$(this).val('');
						});
					}
					else {
						var startDate = getDateByjQueryDateFormat(range, today);

						// 시작일과 종료일을 반대로 대입 reverse="1"
						var reverse = $(this).attr('reverse');
						
						if (reverse == "1") {
							$(objDatepickers[0]).val(getyyyyMMdd(today));
							$(objDatepickers[1]).val(getyyyyMMdd(startDate));
						}
						else {
							$(objDatepickers[0]).val(getyyyyMMdd(startDate));
							$(objDatepickers[1]).val(getyyyyMMdd(today));
						}
						
						//alert(startDate + "\n" + today);

					}

					if ($(this).data('click') != null) {
						$('#' + $(this).data('click')).click();
					}
				}
				catch (e) {
					alert('datepicker 날짜 범위 설정에서 오류 발생\n' + e.message);
				}
			});
		});
	}

	//날짜 선택기 설정 - 캘린더 이미지는 텍스트폼 다음에 있어야 함
	//maxDate, minDate 속성 지원 
	$('.datepicker').each(function () {
		if ($(this).context.nodeName == "INPUT") {
			$(this).css({ 'ime-mode': 'disabled', 'width': '90px' });
			$(this).datepicker({
				showOtherMonths: true
				, showButtonPanel: true
				, selectOtherMonths: true
				, changeMonth: true
				, changeYear: true
				, option: {
					width: 600
				}
				, minDate: $(this).attr('minDate')
				, maxDate: $(this).attr('maxDate')
			});

			if ($(this).attr('maxDate') != null) {
				//최대 날짜 등록
				var maxDate = toTimeObject(getyyyyMMdd(getDateByjQueryDateFormat($(this).attr('maxDate'), new Date())));
				$(this).data('maxDate', maxDate);
			}
		}
		else if ($(this).context.nodeName == "IMG" || $(this).context.nodeName == "A") {
			$(this).css({ cursor: 'pointer' });
			$(this).click(function () {
				$(this).prev().focus();
			});
		}
	});

	// 날짜 범위 자동 설정
	// input.datepicker가 있어야 함
	// common.js 필요 - getyyyyMMdd(), getDate(), getDateByjQueryDateFormat() 필요
	// data-click attribute 지원 : 해당 id 엘리먼트를 클릭 
	// n개의 세트 지원
	// baseDay 속성 지원
	if ($('input.datepicker').length > 0) {

		var objDatepickers = $('input.datepicker');
		var iFormCount = 1;
		if (objDatepickers.length > 2)
			iFormCount = objDatepickers.length / 2; 				//datepicker 세트수

		var objDateRange = $('.dateRange');
		var iDateRangeCount = objDateRange.length / iFormCount; 	//날짜 범위 설정 컨트롤 개수

		objDateRange.each(function (idx, elm) {
			$(this).click(function () {

				try {
					if (iFormCount > 1) {
						var iCurrentIndex = Math.floor(idx / iDateRangeCount);
						var iMin = iCurrentIndex * 2 - 1;
						var iMax = iCurrentIndex * 2 + 2 - 1;
						//alert(iMin + " : " + iMax);
						if (iMin < 1) {
							iMax = 2;
							objDatepickers = $('input.datepicker:lt(' + iMax + ')');
						}
						else
							objDatepickers = $('input.datepicker:gt(' + iMin + '):lt(' + iMax + ')');
					}
					var today = new Date();
					var baseDay = $(this).attr('baseDay');
					if (baseDay != null) {
						//오늘 - 1 이 기본값
						today.setDate(today.getDate() + parseInt(baseDay, 10));
					}
					var range = $(this).attr('range');
					if (range == 'none') {
						objDatepickers.each(function (idxDate, elmDate) {
							$(this).val('');
						});
					}
					else {
						var startDate = getDateByjQueryDateFormat(range, today);
						//alert(startDate + "\n" + today);
						$(objDatepickers[0]).val(getyyyyMMdd(startDate));
						$(objDatepickers[1]).val(getyyyyMMdd(today));
					}

					if ($(this).data('click') != null) {
						$('#' + $(this).data('click')).click();
					}
				}
				catch (e) {
					alert('datepicker 날짜 범위 설정에서 오류 발생\n' + e.message);
				}
			});
		});
	}



	//우편번호 양식 설정
	//한 화면에 N개의 우편번호 양식이 존재할 경우 : 우편번호 팝업에 인덱스 값을 넘김
	//												인덱스 값을 다시 보내므로 인덱스 값으로 바인딩할 부분을 맞춰서 매핑 처리해야함
	$('.inputZipCode').each(function (idx, elm) {

		var i = idx % 4;
		var iFormIndex = 0;

		//우편번호
		if (i == 0 && $(this).context.nodeName == "INPUT") {
			$(this).attr('readonly', 'true');
			$(this).css({ 'background-color': __readonlyColor });
			$(this).attr('maxlength', '7');

			$(this).click(function () {
				$(this).nextAll('img.inputZipCode').click();
			});
		}
		//버튼
		else if (i == 1 && ($(this).context.nodeName == "IMG" || $(this).context.nodeName == "A" || $(this).attr('type') == "button")) {
			$(this).css({ 'cursor': 'pointer' });
			$(this).click(function () {
				iFormIndex = Math.floor(idx / 4);
				//alert("주소 검색 팝업 열기"); 외부 함수 필요 - common.js
				if (openPop != null)
					//openPop("?formIndex=" + iFormIndex, "openZipCode");
					openPop('', 'openZipcode');
				else
					alert('주소창을 열기위한 코드가 필요합니다.');
			});
		}
		//주소1
		else if (i == 2 && $(this).context.nodeName == "INPUT") {
			$(this).attr('readonly', 'true');
			$(this).css({ 'background-color': __readonlyColor });
			$(this).click(function () {
				$(this).prevAll('img.inputZipCode').click();
			});
		}
		else if (i == 3 && $(this).context.nodeName == "INPUT") {
			$(this).css({ 'ime-mode': 'active' });
		}
	});

	//전화번호 양식 설정
	$('.inputPhone').each(function (idx, elm) {
		var objPhones = $('.inputPhone');
		var iFormSet = 1;
		var iDivisor = 3;		//n개의 세트 구분용
		if (objPhones.length > iDivisor)
			iFormSet = objPhones.length / iDivisor;

		if ($(this).context.nodeName == "INPUT") {

			$(this).css({ 'ime-mode': 'disabled' });
			$(this).attr('maxlength', ((idx % iDivisor) == 0) ? '3' : '4');

			if ($(this) != null) {
				$(this).keydown(function (event) {
					var iKeyCode = event.which;
					if (event.shiftKey)
						event.preventDefault();
					if ((iKeyCode < 48 || iKeyCode > 57) && (iKeyCode < 96 || iKeyCode > 105) && (iKeyCode < 37 || iKeyCode > 40) && iKeyCode != 8 && iKeyCode != 9 && iKeyCode != 13)
						event.preventDefault();
				});
			}

			//두번째 입력 폼으로 이동
			if ((idx % iDivisor) == 0) {
				$(this).keyup(function () {
					if ($(this).val().length == 3)
						$($('.inputPhone')[idx + 1]).focus();
				});
			}
			//세번째 입력폼으로 이동
			else if ((idx % iDivisor) == 1) {
				$(this).keyup(function () {
					if ($(this).val().length == 4)
						$($('.inputPhone')[idx + 1]).focus();
				});
			}
		}
	});

	//이메일 입력 양식 설정
	$('input.inputEmail').each(function (idx) {
		$(this).css({ 'ime-mode': 'disabled' });
	});

	//이메일 입력 양식 설정2 - 셀렉트 박스
	$('select.inputEmail').each(function (idx) {
		var iFormSet = 2; 	//n개의 세트 구분용
		var objEmails = $('input.inputEmail');
		$(this).change(function () {
			if (objEmails.length == 0)
				return;

			if ($(this).val() == "") {
				$(objEmails[(idx * iFormSet) + 1]).val('');
				$(objEmails[(idx * iFormSet) + 1]).removeAttr('readonly');
				$(objEmails[(idx * iFormSet) + 1]).css({ 'background-color': '#ffffff' });
				$(objEmails[(idx * iFormSet) + 1]).focus();
				//프론트용 일부 조건 추가
				//if ($(objEmails[(idx * iFormSet) + 1]).parent('span').parent('span.input').length = 1) {
				//	$(objEmails[(idx * iFormSet) + 1]).parent('span').parent('span.input').removeClass('readonly');
				//}
			}
			else {
				$(objEmails[(idx * iFormSet) + 1]).val($(this).val());
				$(objEmails[(idx * iFormSet) + 1]).attr('readonly', 'readonly');
				$(objEmails[(idx * iFormSet) + 1]).css({ 'background-color': __readonlyColor });
				//프론트용 일부 조건 추가
				//if ($(objEmails[(idx * iFormSet) + 1]).parent('span').parent('span.input').length = 1) {
				//	$(objEmails[(idx * iFormSet) + 1]).parent('span').parent('span.input').addClass('readonly');
				//}
			}
		});
	});

	//주민등록번호 입력양식(이름 포함) : 3개 입력 폼 필요
	$('input.inputRegistNumber').each(function (idx, elm) {
		if (idx == 0) {
			$(this).css('ime-mode', 'active');
			$(this).attr('maxlength', '20');
		}
		else {
			$(this).css('ime-mode', 'disabled');

			//첫번째 주민번호 입력 폼
			if (idx == 1) {
				$(this).attr('maxlength', '6');
				$(this).keyup(function () {
					if ($(this).val().length == 6)								//포커스 자동이동
						$($('input.inputRegistNumber')[idx + 1]).focus();
				});
			}
			//두번째 주민번호 입력 폼
			else if (idx == 2) {
				$(this).attr('maxlength', '7');
			}

			$(this).keydown(function (event) {
				var iKeyCode = event.which;
				if (event.shiftKey)
					event.preventDefault();
				if ((iKeyCode < 48 || iKeyCode > 57) && (iKeyCode < 96 || iKeyCode > 105) && (iKeyCode < 37 || iKeyCode > 40) && iKeyCode != 8 && iKeyCode != 9 && iKeyCode != 13)
					event.preventDefault();
			});
		}
	});


	
	//일반 팝업 페이지 사이즈 자동 조절
	$('.popupResizeJ').each(function () {

		var iAddWidth = 20;
//		if ($(document.body).innerWidth() > $(this).width())
//			iAddWidth += $(this).width() - $(document.body).innerWidth();
		
		var iAddHeight = 100;

		var iWidth = 0;
		var iHeight = 0;

		if (iWidth == 0)
			iWidth = $(this).width() + iAddWidth;

		if (iHeight == 0)
			iHeight = $(this).height() + iAddHeight;

		window.resizeTo(iWidth, iHeight);

		var left = (screen.availWidth - iWidth) / 2;
		var top = (screen.availHeight - iHeight) / 2;

		window.moveTo(left, top);
	});


	//iframe 너비, 높이 자동 조절 : 로컬 리소스만 가능
	//주의 : html DOCTYPE이 쿼크 모드일 경우 제대로 작동하지 않음
	$('iframe.autoIframe').each(function () {
		//$(this).width($(this).contents().width() + 10);
		//$(this).height($(this).contents().height());

		$(this).load(function () {
			$(this).width($(this).contents().width());
			$(this).height($(this).contents().height());
		});
	});

    $('iframe.resizeIframe').each(function () {
        $(this).load(function () {
            $(this).height($(this).contents().height());
        });
    });


	//해당 클래스 하위 자식으로 존재하는 이미지(<img>)의 가로 사이즈를 조절 : 0.125배율로 축소
	//이미지에 팝업 링크 포함시킴
	$('.editorChangeMode').ready(function () {
		var children = $('.editorChangeMode').children().find('img');
		children.each(function () {
			var iWidth = $(this).width();
			if (iWidth && iWidth > 630) {
				while (iWidth > 630) {
					iWidth = iWidth * 0.875;
				}

				$(this).width(iWidth);
			}
			$(this).css({ 'cursor': 'pointer' });
			$(this).click(function () {
				//프로젝트에서 사용되는 이미지 팝업 스크립트 적용
				openFileViewPop($(this).attr('src'), $(this).attr('src').substr($(this).attr('src').lastIndexOf("/") + 1));
			});
		});
	});

	//검색 입력 폼에서 엔터키 입력시 지정된 검색 버튼 실행 처리 : 해당 객체에 이미 이벤트가 있으면 이 로직은 무시됨
	//검색 필드 class에 searchWord가 있어야 함
	//검색 버튼의 ID에는 btnSearch가 있어야 함
	//텍스트 폼에 validate 속성이 있을 경우, 빈 공백으로 엔터키 입력시 해당 속성값을 경고창으로 띄움
	$('input.searchWord').each(function () {
		//텍스트 폼 일 경우

		var btnObj = $('input[id*=btnSearch], a[id*=btnSearch]');

		//검색 필드에 btnid 값이 있을 경우 이 값에 해당하면 검색 버튼 사용
		if ($(this).data('btnid') != null && $(this).data('btnid') != '') {
			btnObj = $('input[id*=' + $(this).data('btnid') + ']');
		}

		if ($(this).attr('type') == "text") {
			$(this).keypress(function (event) {
				if (event.which == 13) {
					if ($(this).attr('validate') != null) {
						if ($.trim($(this).val()) == "") {
							alert($(this).attr('validate'));
							event.preventDefault();
						}
						else {
							btnObj.click();
							event.preventDefault();
						}
					}
					else {
						btnObj.click();
						event.preventDefault();
					}
				}
			});
		}

	});

	//엔터 금지
	$('.disableEnter').each(function () {
		$(this).keydown(function (event) {
			var iKeyCode = event.which;
			if (iKeyCode == 13)
				event.preventDefault();
		});
	});


	// 한글/영문/숫자/공백만 입력가능 (나머지 제거)
	$('.textWhiteList2').each(function () {

		var pattern = /[^ㄱ-ㅎ가-힣A-Za-z0-9\s]/g;

		$(this).keyup(function (e) {
			if (pattern.test($(this).val()))
				$(this).val($(this).val().replace(pattern, ''));

		}).blur(function (e) {
			if (pattern.test($(this).val()))
				$(this).val($(this).val().replace(pattern, ''));
		});

	});


	//숫자만 입력
	$('input.onlyNumber').each(function () {
		$(this).css({ 'ime-mode': 'disabled' });
		$(this).keydown(function (event) {
			var iKeyCode = event.which;
			//alert(iKeyCode);
			if (event.shiftKey)
				event.preventDefault();

			if ((iKeyCode < 48 || iKeyCode > 57) && (iKeyCode < 96 || iKeyCode > 105) && (iKeyCode < 37 || iKeyCode > 40) && iKeyCode != 8 && iKeyCode != 9 && iKeyCode != 13)
				event.preventDefault();
		});
	});

	//숫자, 소수점, 마이너스 가능
	$('input.onlyRealNumber').each(function () {
		$(this).css({ 'ime-mode': 'disabled' });
		$(this).keydown(function (event) {
			var iKeyCode = event.which;
			//alert(iKeyCode);
			if (event.shiftKey)
				event.preventDefault();

			if ((iKeyCode < 48 || iKeyCode > 57) && (iKeyCode < 96 || iKeyCode > 105) && (iKeyCode < 37 || iKeyCode > 40) && iKeyCode != 8 && iKeyCode != 9 && iKeyCode != 13 && iKeyCode != 190 && iKeyCode != 110 && iKeyCode != 189 && iKeyCode != 109)
				event.preventDefault();
			/*
			if ($(this).val() != '') {
			var patternRealNumber = /^[\+\-]?(\d+|\d+\.?\d*)$/g;
			var rtns = patternRealNumber.exec($(this).val());
			if (rtns != null)
			event.preventDefault(); 
				
			alert(rtns.$0 + " : " + rtns.$1 + " : " + rtns.$2 + " : " + rtns.$3);
			}
			*/
		});
	});


	//twitter
	//anchor 태그를 사용할 것(_blank 창 필요함)
	//class = sendtotwitter
	$('.sendtotwitter').each(function () {
		var sText = "";
		if ($(this).attr('text') != null && $.trim($(this).attr('text')) != "")
			sText = $.trim($(this).attr('text'));
		else
			sText = encodeURIComponent(document.title);


		$(this).attr('target', '_blank');
		$(this).attr('href', 'http://twitter.com/share' + (sText != "" ? "?text=" + sText : ""));
	});

	//전화번호 링크
	//class = tel(모바일 웹 브라우저에서 전화걸기 지원)
	//telno 추가 속성 필요
	$('.tel').each(function () {
		if ($(this).attr('telno') != null && $.trim($(this).attr('telno')) != "") {
			$(this).css({ 'cursor': 'pointer' });
			$(this).click(function () {
				location.href = "tel:" + $(this).attr('telno');
			});			
		}
	});


	//jquery validator 기본값 설정
	if ($.validator != null) {
		$.validator.setDefaults({
			debug: false
			, onfocusout: false
			, onkeyup: false
			, onclick: false
			, invalidHandler: function (form, validator) {
				var errors = validator.numberOfInvalids();
				if (errors) {
					var msg = validator.errorList[0].message;
					alert(msg);
					validator.errorList[0].element.focus();
				}
			}
			, errorPlacement: function (error, element) {
				// Override error placement to not show error messages beside elements 
			}
		});
	}

	//입력 필드 기본 문자열 표시 (placeholder) : html5 지원
//	$('input[type=text]').each(function () {
//		if ($(this).attr('placeholder') != null && $(this).attr('placeholder') != '') {
//			//$(this).val($(this).attr('placeholder'));

//			$(this).focus(function () {
//				if ($(this).val() == $(this).attr('placeholder'))
//					$(this).val('');
//			});

//			$(this).blur(function () {
//				if ($(this).val() == '')
//					$(this).val($(this).attr('placeholder'));
//			});
//		}
//	}); 
}



/**
* ajaXray : Multilevel subselect (jquery-1.3.x)
* 자식 select > option 개체에 class="sub_부모카테고리값"을 추가하면 동적 바인딩 가능
*/
function makeSublist(parent, child, isSubselectOptional, childVal) {

	$("body").append("<select style='display:none' id='" + parent + child + "'></select>");
	$('#' + parent + child).html($("#" + child + " option"));

	var parentValue = $('#' + parent).val();
	$('#' + child).html($("#" + parent + child + " .sub_" + parentValue).clone());

	$('#' + parent).change(function () {
		var parentValue = $('#' + parent).val();
		$('#' + child).html($("#" + parent + child + " .sub_" + parentValue).clone());
		
		if (isSubselectOptional)
			$('#' + child).prepend("<option value='-1' selected='selected'>-- 선택 --</option>");

		$('#' + child).trigger('change');
		//$('#' + child).focus();

		childVal = (childVal == null) ? "" : childVal;
		$('#' + child).val(childVal).attr('selected', 'selected');	
	});
}


//asp:CheckBoxList 객체 요소 체크 여부 확인
//uniqueID : asp.net의 UniqueID 필요
//체크된 개수 반환
function checkCheckBoxList(uniqueID) {
	var iCount = $('input[name*="' + uniqueID + '"]:checked').length;
	return iCount;
}

//라디오버튼 초기화
//radioName : html 객체 또는 이름
function clearRadioButtons(radioName) {
	//alert(typeof radioName);
	var jqObj = $(radioName);
	if (typeof radioName == "string") {
		jqObj = $('input[name="' + radioName + '"]:radio');
	}

	if (jqObj == null) return;

	jqObj.each(function () {
		$(this).attr('checked', false);
	});
}

// 라디오버튼값 리턴
// name 으로 가져옴
function returnRadioButton(radioName) {
	$.trim($('input:radio[name="' + radioName + '"]:checked').val());
	if (typeof ($('input:radio[name="' + radioName + '"]:checked').val()) == 'undefined') {
		return '';
	} else {
		return $('input:radio[name="' + radioName + '"]:checked').val();
	}
}



//리스트 박스의 내용을 히든폼으로 복사 : 구분자 설정 가능
//valueAttr : 히든폼으로 옮길 속성 : 기본값 = value
//separator : 구분자 : 기본값 = ;
function copyToHiddenFromListBox(listBoxID, hiddenID, valueAttr, separator) {

	if (separator == null)
		separator = ";"

	var hidden = $('#' + hiddenID);
	var options = $('#' + listBoxID + ' > option');

	var value = '';
	options.each(function () {
		if (valueAttr == null)
			value += $(this).val() + separator;
		else
			value += $(this).attr(valueAttr) + separator;
	});	  

	value = value.substr(0, value.lastIndexOf(separator));
	hidden.val(value);
}


//element block : loading
function loadingIcon(element, imageURL, msg) {
	if (element == null)
		return;

	if (imageURL == null)
		imageURL = '/images/preload_72x72.gif';

	if (msg == null)
		msg = '';

	var sMsg = '<img src="' + imageURL + '" />';
	if (msg != '')
		sMsg += '<br/>' + msg;


	//blockUI 환경 변수
	var varBlockUI = {
		message: sMsg
		, fadeIn: 100
		, fadeOut: 100
		, centerY: true
		, centerX: true
		, css: {border: 'none'}
		, overlayCSS: { backgroundColor: '#fff', opacity: 0.7 }
	};

	$(element).block(varBlockUI);
}


//jQuery 경고 : jqobj 객체를 받아 해당 객체 위치의 바로 아래에 growlUI출력
//jQuery.blockUI 필요
function warnForm(jqobj, addedMsg, delayTime) {

	//여러 개의 객체일 경우 처음 한 개를 지정
	var jqobjTarget = jqobj;
	if (jqobjTarget.length > 1) {
		jqobj.each(function (idx, elm) {
			jqobjTarget = $(elm);
			return false;
		});
	}

	//표시용 메시지 만들기
	if ($('div.growlUI').length == 0) {
		$(document.body).after("<div class='growlUI'><h1>Alert</h1><h2>Message Here.</h2></div>");
	}

	var htmlTag = jqobjTarget.context.nodeName.toLowerCase();
	if (htmlTag == "#document" || htmlTag == null)
		var htmlTag = jqobjTarget.attr('type');

	var htmlObjectType = jqobjTarget.attr('type');
	//alert("nodeName : " + htmlTag + "\nobject Type : " + htmlObjectType);


	var msg = "Please fill this form."
	if (htmlObjectType.indexOf("select") > -1 || htmlTag == "select")
		msg = "Please select this form.";
	else if (htmlObjectType.indexOf("checkbox") > -1 || htmlObjectType.indexOf("radio") > -1)
		msg = "Please check this form(s) at least one.";

	if (addedMsg != null && addedMsg != "")
		msg = addedMsg;

	$('div.growlUI > h2').html(msg);

	var bgColor = jqobjTarget.css('background-color');

	//브라우저가 스크롤되어 경고 대상 객체가 스크롤 위에 있을 때, 우선적으로 화면 스크롤
	if ($(window).scrollTop() > $(jqobjTarget).offset().top) {
		$(window).scrollTop($(jqobjTarget).offset().top + $(jqobjTarget).height() - $(document).scrollTop());
	}

	//blockUI 환경 변수
	var varBlockUI = {
		message: $('div.growlUI')
		, fadeIn: 500
		, fadeOut: 500
		, timeout: (delayTime == null) ? 1500 : delayTime
		, showOverlay: false
		, centerY: false
		, css: {
			width: '250px'
			, top: $(jqobjTarget).offset().top + $(jqobjTarget).height() - $(document).scrollTop()
			, left: $(jqobjTarget).offset().left
			, right: '10px'
			, border: 'none'
			, padding: '5px'
			, backgroundColor: '#000'
			, '-webkit-border-radius': '10px'
			, '-moz-border-radius': '10px'
			, opacity: .6
			, color: '#fff'
			, cursor: 'default'
		}
	};


	if (htmlObjectType == 'text' || htmlObjectType == 'password' || htmlObjectType == 'file' || htmlTag.indexOf("select") > -1 || htmlTag == "textarea") {

		jqobjTarget.animate({ 'background-color': '#ff5555' }, 50)
			.animate({ 'background-color': bgColor }, 50)
			.animate({ 'background-color': '#ff5555' }, 50)
			.animate({ 'background-color': bgColor }, 50, function () {
				$.blockUI(varBlockUI);
				$(this).focus();
			});
	}
	else if (htmlObjectType == "checkbox" || htmlObjectType == "radio" || htmlTag == "a") {
		$.blockUI(varBlockUI);
	}
	else {
		alert("Undefined HTML objcet. please contact system engineer and check warnForm method.");
	}
	
	return false;
}


//jquery blockUI를 이용하여 레이어 메시지 출력
//jQuery.blockUI 필요
function alertGrowl(title, addedMsg, delayTime) {

	//표시용 메시지 만들기
	if ($('div.growlUI').length == 0) {
		$(document.body).after("<div class='growlUI'><h1>Information</h1><h2>Message Here.</h2></div>");
	}

	if (title != null && title != "")
		$('div.growlUI > h1').html(title);

	if (addedMsg != null && addedMsg != "")
		$('div.growlUI > h2').html(addedMsg);


	//blockUI 환경 변수
	var varBlockUI = {
		message: $('div.growlUI')
		, fadeIn: 500
		, fadeOut: 500
		, timeout: (delayTime == null) ? 1200 : delayTime
		, showOverlay: false
		, centerY: false
		, centerX: false
		, css: {
			width: '250px'
		, border: 'none'
		, padding: '5px'
		, backgroundColor: '#000'
		, '-webkit-border-radius': '10px'
		, '-moz-border-radius': '10px'
		, opacity: .6
		, color: '#fff'
		, cursor: 'default'
		}
	};

	$.blockUI(varBlockUI);
}


//캘린더 일정 표시용 blockUI
//사용하지 마십시오.
function alertGrowlForSchedule(data) {

    var sIconString = '<div class="place04"><img src="/images/customerservice/icon_calendar.gif" alt="calendar" class="imgSchedule" style="cursor:pointer; "/></div>';

	//각 td에 day속성을 미리 넣어준다.
	$('table.table_calendar').children('tbody').children('tr').children('td').each(function () {
		if (/[\d]/g.test($(this).html()))
			$(this).attr('day', $(this).html());
	});

	//캘린터 각 날짜 요소에 알림이 있는 날일 경우 아이콘 표시
	$('table.table_calendar').children('tbody').children('tr').children('td').each(function () {
		for (var x in data) {
			if (x == $(this).attr('day')) {
				$(this).html($(this).attr('day') + sIconString);
				break;
			}
		}
	});


	//아이콘 이벤트 처리
	$('img.imgSchedule').each(function () {
		$(this).mouseenter(function () {

			var sDay = $(this).parents('td').attr('day')
			var iTop = $(this).offset().top + $(this).height() - $(window).scrollTop() + 5;
			var iLeft = $(this).offset().left;

			for (var x in data) {
				if (sDay == x) {

					//alertGrowlForSchedule(x, data[x], iLeft, iTop, 4000); 	//ref. common.jquery.util.js
					//표시용 메시지 만들기
					if ($('div.growlUI').length == 0) {
						$(document.body).after("<div class='growlUI'><h1>Information</h1><h2>Message Here.</h2></div>");
					}

					//날짜
					//if (title != null && title != "")
					$('div.growlUI > h1').html(x);

					//본문 내용
					//if (body != null && body != "")
					$('div.growlUI > h2').html(data[x]);

					//blockUI 환경 변수
					var varBlockUI = {
						message: $('div.growlUI')
						, fadeIn: 500
						, fadeOut: 500
						, timeout: 3000
						, showOverlay: false
						, centerY: false
						, centerX: false
						, css: {
							width: '230px'
							, border: '3px solid #72604b'
							, padding: '5px'
							, color: '#fff'
							, background: '#9d866c'
							, backgroundColor: '#000'
							, '-webkit-border-radius': '10px'
							, '-moz-border-radius': '10px'
							, opacity: 0.9
							, color: '#fff'
							, cursor: 'default'
							, 'text-align': 'left'
							, left: iLeft
							, top: iTop
						}
					};

					$.blockUI(varBlockUI);

					break;
				}
			}
		});
	});
}




//jQuery ajax + jQuery BlockUI
//blockUI를 이용하여 화면 가운데에 다른 HTML페이지를 출력
//jQuery.blockUI 필요
function showBlockPageAjax(URL, paramMap) {

	var iWidth = 0;
	var iHeight = 0;

	var tagString = "<div class='divAjaxDetail' style='display:none; text-align:left;'></div>";

	if ($('div.divAjaxDetail').length == 0) {
		$(document.body).after(tagString);
	}
	else {
		$('div.divAjaxDetail').remove();
		$(document.body).after(tagString);
	}

//	$.ajax({ async: true });
//	$('div.divAjaxDetail').ajaxStart(function () {
//		$(this).html('<img src="/images/preload_72x72.gif" border="0" />');
//	});

	$('div.divAjaxDetail').load(
		URL
		, paramMap
		, function () {
			iWidth = $(this).width();
			iHeight = $(this).height();

			//$(this).html($(this).html() + "<center><input type='button' class='button01' value='Close' onclick='$.unblockUI();' /></center>");
			//$('input[type=button]').css({ 'display': 'block', 'text-align': 'center' });

			$.blockUI({
				message: $('div.divAjaxDetail')
				, centerX: true
				, centerY: true
				, fadeIn: 700
				, fadeOut: 700
				//, css: { width: iWidth, height: iHeight, left: ($(document.body).width() - iWidth) / 2, top: ($(document.body).height() - iHeight) / 2 }
				, overlayCSS: { backgroundColor: '#fff', opacity: 0.7 }
			});
		}
	);
}

//blockUI를 이용하여 이미지를 화면 가운데 보여주기
//jQuery.blockUI 필요
function showBlockPageImage(imageURL) {
	var tagString = "<img id='imgBlockUI' src='" + imageURL + "' onclick='$.unblockUI();' style='display:none;'/>"

	if ($('#imgBlockUI').length > 0)
		$('#imgBlockUI').remove();

	$(document.body).append(tagString);

	$('#imgBlockUI').load(function () {
		//alert($(this).width() + " : " + $(this).height());
		$.blockUI({
			message: $(this)
			, fadeIn: 700
			, fadeOut: 700
			, centerX: true
			, centerY: true
			, css: { left: ($(document.body).width() - $(this).width()) / 2
				, top: ($(document.body).height() - $(this).height()) / 2
			}
			, overlayCSS: {
				backgroundColor: '#fff'
				, opacity: 0.8
			}
		});
	});
}


//객체 화면 출력
function documentWrite(obj) {
	if ($('div.divDebug').length == 0)
		$(document.body).append('<div class="divDebug"></div>');

	$('div.divDebug').html('<xmp>' + obj + '</xmp>');
}


//for debugging : loop element
// obj : 루프가 가능한 객체
function debugObject(obj) {
	if ($('div.divDebug').length == 0)
		$(document.body).append('<div class="divDebug"></div>');

	var str = debugObjectLoop(obj);

	$('div.divDebug').html(str);
}

function debugObjectLoop(obj) {
	var sStr = '<table border="1" cellspacing="0" cellpadding="0" style="width:100%; margin-bottom:20px;">';
	sStr += '<col width="100" /><col width="50" /><col width="*" />';
	sStr += '<tbody>';
	for (var x in obj) {
//		if (typeof obj[x] != 'object')
//			sStr += '<tr><th style="font-weight:bold;">' + x + '</th><td>' + (obj[x] == null || obj[x] == '' ? '&nbsp;' : obj[x]) + '</td></tr>';
//		else {
//			//var sInnerObject = debugObjectLoop(obj[x]);
//			sStr += '<tr><th style="font-weight:bold;">' + x + '</th><td><a>' + obj[x] + '</a></td></tr>';
//		} 
		
		sStr += '<tr><th style="font-weight:bold;">' + x + '</th><th>' + (typeof obj[x]) + '</th><td>' + (obj[x] == null || obj[x] == '' ? '&nbsp;' : obj[x]) + '</td></tr>';
	}
	sStr += '</tbody></table>';

	return sStr;
}

//엑셀 저장 : ajax
//DB데이터
//proc : 프로시저
//params : 프로시저에 들어갈 파라미터 맵 (ex) {parameterName: value:dataType}
//header : 엑셀에 표시될 헤더 맵 (ex) {DBColumnName : displayHeaderName}		: 따옴표 넣지 말 것
//additionals : 추가적으로 넣을 문자열 배열(엑셀의 상단에 한 줄씩 표시)
function exportToExcel(proc, params, headers, additionals) {
	if ($('#formExcel').length > 0) {
		$('#formExcel').remove();
	}

	var str = "<form id='formExcel' method='post' action='/pages/common/excelDownloadDB.asp'>";
	if (proc != "")
		str += "<input type='hidden' name='proc' value=\"" + proc + "\" />";

	if (params != null) {
		for (var x in params) {
			var val = x + ":" + params[x];
			str += "<input type='hidden' name='params' value=\"" + val + "\" />";
		}
	}

	if (headers != null) {
		for (var x in headers) {
			var val = x + ":" + headers[x];
			str += "<input type='hidden' name='headers' value=\"" + val + "\" />";
		}
	}

	if (additionals != null) {
		for (var x in additionals) {
			var val = additionals[x];
			str += "<input type='hidden' name='additionals' value=\"" + val + "\" />";
		}
	}
	str += "</form>";

	//alert(str)
	$(document.body).after(str);
	$('#formExcel').submit();
}
/********************************************************************************************
* use only for ASP 

//HTML 데이터 엑셀 저장
//arguments : HTML 문자열 배열
function makeStringForExcel() {
args =makeStringForExcel.arguments;

if ($('#formExcel').length > 0) {
$('#formExcel').remove();
}

var str = "<form id='formExcel' method='post' action='/pages/etc/excelDownload.asp'>";
for (var i = 0; i < args.length; i++) {

var patt = /(\<a [^\>]+\>)|(\<\/a\>)/gi;
var change = args[i].replace(patt, "");
change = change.replace(/[']/g, '&squot;');
str += "<input type='hidden' name='param' value='" + change + "' />";
}
str += "</form>";

$(document.body).after(str);
$('#formExcel').submit();
}
********************************************************************************************/