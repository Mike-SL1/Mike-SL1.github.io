//   		 0	   1		2	3	   4		5	 	6
let clrs=['aliceblue','antiquewhite','aqua','burlywood','cadetblue','chartreuse','darkgreen','yellowgreen','darkslategrey',
'aquamarine','azure','beige','chocolate','coral','cornflowerblue','darkkhaki','darkmagenta','darkolivegreen','wheat','darkviolet',
'deeppink','bisque','crimson','cyan','darkorange','darkorchid','darkred','yellow','darkturquoise','blue','blueviolet','brown','darkblue',
'darkcyan','darkgoldenrod','darkseagreen','darkslateblue','deepskyblue','mediumaquamarine','firebrick','forestgreen','hotpink',
'indianred','lightcyan','lightgoldenrod','lightgray','violet','magenta','maroon','fuchsia','gold','goldenrod','gray','lavender',
'lavenderblush','lawngreen','lightseagreen','lightskyblue','green','greenyellow','llightblue','lightcoral','tomato','springgreen',
'steelblue','mediumspringgreen','mediumturquoise','mediumvioletred','orange','orangered','orchid','powderblue','purple','rebeccapurple',
'thistle','dodgerblue','midnightblue','mistyrose','palegoldenrod','palegreen','paleturquoise','red','rosybrown','royalblue','teal',
'moccasin','navajowhite','navy','palevioletred','peachpuff','saddlebrown','sandybrown','mediumslateblue','olive','olivedrab',
'peru','pink','plum','seagreen','sienna','mediumseagreen','mediumpurple','slateblue','skyblue','silver','limegreen','lime',
'lightyellow','white'];//108 colors
const random = (min=0, max=0, last=0.5) => {let aux1;
				    if (isNaN(min)) {min=0;}if (isNaN(max)) {max=0;} if (isNaN(last)) {last=0.5;}	   
				    if (min==max) return min; else {if (min>max) {aux1=min;min=max;max=aux1;}}
			      	    aux1=max-min+1;  const rnd =()=> min+Math.floor(Math.random()*aux1);
			      	    let first=rnd ();while (last===first){first=rnd ();}           return first;}