/* data acquisition by category name */
'use strict';
const fetchData = function () {msgSrv({'':'fetchData module loaded'});
			       let startIndex = 0;			
	function fetchData (category,cbFuncName, catPlus=false) {
		if (!category || !cbFuncName) {msgSrv({'fetchData':'No category or cbFuncName defined'});return null;}
	    //fetch essential constants define
	if (catPlus) {startIndex=startIndex+cnst.cardQuantity;} else {startIndex = 0;}
		const requestString = `https://www.googleapis.com/books/v1/volumes?q="subject:${category}"&key=AIzaSyAOxRLvgkvNyb_NzWAoX2xvkwkVEa03wkU&printType=books&startIndex=${startIndex}&maxResults=6&langRestrict=en`,		
		storItemName = `bV-cat=${category}&idx=${startIndex}`,
		f_options={	method:"GET",
	   			mode:"cors",
	   			headers:{'content-type':'application/json'}		 
		};
		let y, dataOrigin = 'network', locData = false;
	    //fetch call
		msgSrv({'':'fetchData category '+category,'fetchData startIndex':startIndex, 'fetchData request':requestString,
			'fetchData storItemName':storItemName});
	fetch(requestString,f_options)
		.then((result)=>{return result.json();})	
		.then((data)=>{
				// data net load success
				localStorage.setItem(storItemName,JSON.stringify(data));
				y = data;			
		})
		.catch(()=>{	y = JSON.parse(localStorage.getItem(storItemName)), dataOrigin = 'local ';
				if (y)  {dataOrigin = dataOrigin + 'storage';
				} else	{
				// data localStorage load fail - loading from local file - locbase_respns.js
				 dataOrigin = dataOrigin + 'file (locbase_respns.js)';
				 locData = true;	if (catPlus) {startIndex=startIndex-cnst.cardQuantity;}
				y = JSON.parse(loc_response[category]);}			
		})
		.finally(() =>{ msgSrv({'fetchData':'loaded from '+dataOrigin,'fetchData return':y, 'fetchData locData':locData});		
		        	cbFuncName(y,locData);
		});
	}; return fetchData;
}();