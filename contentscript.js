//// TODO: 1) only activetab permission so no need for permission from all_urls 2) improved matching (see below) 3) set thresholds & add stoplight indicators

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
  var regex = new RegExp(val.toLowerCase(), "gi");
	if((body.match(regex) || []).length){
		match_list.push([val,(body.match(regex) || []).length])
	}
}

//var body = $('body').clone().find('script').remove().text();
var body = $('body *:not(:has(*)):visible').text(); //ignore hidden text to exclude script, style tags etc.
//console.log(body)

$.each(flag_list, function(key, val){
	match_func(val);
  //todo: also match with periods before and after
})
if(match_list.length > 0){
	to_alert(match_list)
}
