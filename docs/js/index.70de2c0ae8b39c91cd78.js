(()=>{"use strict";var e={};function f(e){return o(e)||n(e)||r(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function r(e,t){if(!e)return;if(typeof e==="string")return a(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor)r=e.constructor.name;if(r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return a(e,t)}function n(e){if(typeof Symbol!=="undefined"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function o(e){if(Array.isArray(e))return a(e)}function a(e,t){if(t==null||t>e.length)t=e.length;for(var r=0,n=new Array(t);r<t;r++){n[r]=e[r]}return n}function l(){var m={};if(localStorage.map){m=JSON.parse(localStorage.map)}ymaps.ready(function(){var r;var n=[];var c=new ymaps.Map("map",{center:[53.902496,27.561481],zoom:10,controls:[]});var e=ymaps.templateLayoutFactory.createClass('<div class="" data-id="{{ properties.idForGeoObj }}">{{ properties.balloonContentHeader|raw }}</div>');var u=new ymaps.Clusterer({preset:"islands#redClusterIcons",clusterDisableClickZoom:true,clusterOpenBalloonOnClick:true,clusterBalloonContentLayout:"cluster#balloonCarousel",clusterBalloonItemContentLayout:e,clusterBalloonContentLayoutWidth:355,clusterBalloonContentLayoutMaxHeight:500,clusterBalloonPagerSize:5});var o=function e(t){var r=document.querySelector("#template_list").cloneNode(true);if(t.length>0){var n=document.createDocumentFragment();for(var o in t){var a=t[o],l=a.name,i=a.place,c=a.text,u=a.date,s=u===void 0?"":u;var d=r.querySelector(".review__item").cloneNode(true);var v=d.querySelector(".review__item-text"),m=d.querySelector(".review__item-name"),f=d.querySelector(".review__item-place"),p=d.querySelector(".review__item-date");v.textContent=c;m.textContent=l;f.textContent=i;p.textContent=s;n.append(d)}r.querySelector(".review__list").innerHTML="";r.querySelector(".review__list").style.display="block";r.querySelector(".review__list").append(n)}return r.innerHTML};var a=function e(){var t=document.querySelector("#template");var r=t.cloneNode(true);return r.innerHTML};function l(e,t){var r=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"";var n=e.elements.reviewName.value,o=e.elements.reviewPlace.value,a=e.elements.reviewText.value,l=(new Date).toLocaleDateString();if(!n||!o||!a){alert("Все поля должны быть заполнены!")}else{var i={name:n,place:o,text:a,date:l};if(!m[t]){m[t]=[];s(t,[i])}else{u.remove(r);s(t,[].concat(f(m[t]),[i]))}m[t].push(i);localStorage.map=JSON.stringify(m);c.balloon.close()}}var i=0;function s(e,t){r=new ymaps.Placemark(e,{balloonContentHeader:o(t),balloonContent:a(),myCoords:e,idForGeoObj:i},{preset:"islands#redIcon",balloonMaxHeight:500,balloonMaxWidth:355});if(t.length>1){r.options.set({preset:"islands#redCircleIcon"});r.properties.set({iconContent:t.length})}r.events.add("click",function(e){console.log(e.get("coords"))});n[i]=r;u.add(r);i++}if(Object.entries(m).length>0){for(var t in m){var d=m[t],v=t.split(",");s(v,d)}}c.events.add("balloonopen",function(e){if(e.get("target").geometry){var r=e.get("target");var n=e.get("target").geometry.getCoordinates();var t=document.querySelectorAll('form[name="review"]');t.forEach(function(t){t.addEventListener("submit",function(e){e.preventDefault();l(t,n,r)})})}});c.events.add("click",function(e){if(!c.balloon.isOpen()){var r=e.get("coords");c.balloon.open(r,{contentBody:a()}).then(function(){var e=document.querySelectorAll('form[name="review"]');e.forEach(function(t){t.addEventListener("submit",function(e){e.preventDefault();l(t,r)})})})}else{c.balloon.close()}});c.geoObjects.add(u)})}window.onload=l()})();