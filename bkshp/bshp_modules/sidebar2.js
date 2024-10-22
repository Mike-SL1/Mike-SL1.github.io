//sidebar menu build & selector module v.3.2.2 for bookshop prj
//sidebar menu build section
'use strict';
const sbList=function(){
msgSrv({'':'sidebarMenu module loaded'});
/*
	<div class="sidebarItem">
		<div class="sibarMark"></div>	// - firstChild
		Art & Fashion			// - lastChild
	</div>
*/
const sidebar=cnst.d7.querySelector('.sidebarTextBlock'), 
      liPrefx='<div class="sibarMark"></div>';
siList.forEach((i)=>{let siItem = putEl('sidebarItem',liPrefx+i); sidebar.appendChild(siItem);});
}();	

//sidebar selector section
const sbItemSel=function(){
			   const sbItems=cnst.d7.querySelectorAll('.sidebarItem'), sbMarkers=cnst.d7.querySelectorAll('.sibarMark'),
			         selectedFontWeight='900', selectedFontSizeFactor=1.2, markerSign='&#8226;';
			// initial condition - category 2 selected - local control
			   let selectedItem =2, unselectedFontSize;
			function getFontSize (){unselectedFontSize=getProp2(sbItems[selectedItem],'font-size');}
			getFontSize();
msgSrv({'':'sidebarSelector module loaded'});			
			sbItems.forEach((i)=>{i.addEventListener('click',(ev)=>{categorySelect(sbItemSel(ev));})});
			function rst0(x=null){				           
				  if (x===null) {
						 setProp(sbItems[selectedItem], {'fontWeight':'', 'fontSize':''});
						 sbMarkers[selectedItem].innerHTML='';
						 getFontSize();
						 msgSrv({'sidebar selector':'item '+selectedItem+' mark clear "'+siList[selectedItem]+'"'});}
					   else {
						 setProp(sbItems[x], {'fontWeight':selectedFontWeight, 
								      'fontSize':plusPX(unselectedFontSize*selectedFontSizeFactor)});	  	   
						 sbMarkers[x].innerHTML=markerSign;
						 msgSrv({'sidebar selector':'item '+selectedItem+' mark set "'+siList[selectedItem]+'"'});}
			};
			window.addEventListener('resize',()=>{rst0();rst0(selectedItem);});
				
			function sbItemSel (ev=selectedItem) {
			  let nameText;
			  if (typeof ev ==='number') {	selectedItem=ev;
							nameText=siList[selectedItem];
						      rst0(selectedItem);}
			  else {rst0();
			    	sbItems.forEach((i,n)=>{if (i===ev.target) {selectedItem=n;}});				
			    	rst0(selectedItem);
				nameText=ev.target.lastChild.textContent;}				 			
			return {'number':selectedItem,'name':nameText};
			};
return sbItemSel;}();