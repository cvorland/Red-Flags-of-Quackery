//// TODO: 1) only activetab permission so no need for permission from all_urls 2) set thresholds & add stoplight indicators

var flag_list = ['Bulletproof','Detox','Cleanse','Optimize','Magnetic','Toxin','Easy','Quick','Instant','Simple','Trick','Hack','Biohack','Secret','Holistic','Natural','Organic','Guaranteed','Boost','Supercharge','Block','Burn','Alkaline','Acidic',' IV ','Ozone','Miracle','Amazing','Energy','Aura','Ionic','Ionized','Crystals','Magic','Cure','Super','Proven','Purest','Safest','Breakthrough','Ancient','Ancestral','Evolutionary','Revolutionary','Pioneering','Chemicals','Integrative','Functional','Quantum','Candida','Dysbiosis','Leaky','Lectin','Chelation','100%','Antioxidant','Chronic Lyme','Adrenal fatigue','Anti-aging','Nutraceutical ','Belly fat','Cellulite ','Rejuvenating','Rejuvenate','Adaptogen','Ph-balancing','Buy','Microbiome','Personalized','Precision','Nutrigenomic','Ancient','Forgotten','Undiscovered','Permanent','Eliminate','Brain Fog','Maximize','Vitality','Nourish','Powerhouse','Sharpen','Vital','Thrive','Disclaimer','Primal','Superfood','Leaky','Game changer','As you know','Doctors hate','Next level','For good','Without side effects']
var match_list = [];

window.addEventListener("message", function(e){
  if(e.data.msg == 'close'){
    $('#quackframe').remove();
  }
})

function to_alert(msg){
    if($('#quackframe').length){
      var iframe = $('#quackframe');
	    iframe[0].contentWindow.postMessage(msg, "*");
    }
    else{
      	var iframe = document.createElement('iframe');
      	iframe.src = chrome.extension.getURL('alert.html');
      	iframe.style.height = '100px';
      	iframe.style.width = '175px';
      	iframe.style.position = 'fixed';
        bodyStyle = document.body.style;
        cssTransform = 'transform' in bodyStyle ? 'transform' : 'webkitTransform';
      	iframe.scrolling = 'no';
      	iframe.style.border='0';
      	iframe.style.zIndex = '938089';
      	iframe.id="quackframe";
        iframe.style.display = 'none;'
      	document.documentElement.appendChild(iframe);
        iframe.style.bottom = '5%';
        $(document.body).css({"-webkit-transition":"0.5s"});
      	iframe.onload = function() {
			       iframe.contentWindow.postMessage(msg, "*");
      	}
    }
}

function match_func(val){
  var regex = new RegExp('\\b' + val.toLowerCase() + '(?:es|s)?\\b', "gi"); //boundary matching for punctuation
  //var regex = new RegExp(val.toLowerCase(), "gi"); //old way
	if((body.match(regex) || []).length){
		match_list.push([val,(body.match(regex) || []).length])
	}
}

//var body = $('body').clone().find('script').remove().text();
var body = $('body *:not(:has(*)):visible').text(); //ignore hidden text to exclude script, style tags etc.
//console.log(body)

//Look for matches in document body
$.each(flag_list, function(key, val){
	match_func(val);
})

//Sort list to put most matches first
match_list.sort(function(a, b){
  if(a[1] == b[1]){
    return 0;
  }
  if(a[1] < b[1]){
    return 1;
  }else{
    return -1;
  }
});

if(match_list.length > 0){
  stop = 'no';
  //Rule 1: Check if DOI in meta tags, if so, it is a scholarly website and we should not show alert.
  var pattern = '(10[.][0-9]{4,}(?:[.][0-9]+)*/(?:(?![%"#?; ])\\S)+)';
  var meta = $(document).find('meta');
  $.each(meta,function(key,tag){
    var tagcontent = tag.content;
    if(tagcontent.match(pattern) && tagcontent.length < 1000){ // huffingtonpost crams their whole article in the content meta tag which may contain doi
      stop = 'yes';
      return false;
    }
  })
  //Rule 2 (being conservative for now): Check if there are at least 3 unique keyword matches on the page and at least 1 of them has multiple matches. If so, show the panel
  if(match_list.length < 3){
    stop = 'yes';
  }
  var counter = 0;
  $.each(match_list,function(key,tag){
    if(tag[1] > 1){
      counter ++
    }
  })
  if(counter == 0){
    stop = 'yes';
  }
  //Show alert if all rules pass
  if(stop == 'no'){
	 to_alert(match_list)
  }
}
