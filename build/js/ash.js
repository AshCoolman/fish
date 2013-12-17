
$('input.autocompletion').autocompletion({
    source: genStub(5) // Also it can be a function. See below.
});
 

$('input.autocompletion').on('updatedAutoComplete', function (me) {
    return function (e, items) {
        console.log('updatedAutoComplete detected', items);

      $('section.fish').html( renderFishData( items ) );

    }
  }()
);




/**
* Takes in data structure representing fishData, Outputs fish list html
**/


function genStub (num) {
  var stub = [],
    num = num || 10,
    nameSeg='sal,mon,kip,per,whit,ing,gar,fish,group,per'.split(','),
    threatLevels='low,med,high'.split(',');
    //console.log(threatLevels.randomModulus(1));
    for (var g=0; g < num; g++) {
      stub.push({
        name: nameSeg.randomModulus(1)+nameSeg.randomModulus(2),
        threat: threatLevels.random()
      });
    }
    return stub;
}


function renderFishData(fishArr) {
  var html = ['<ul>'], fish;
  for (var f = 0, fish; f < fishArr.length, fish = fishArr[f]; f++) {
    html.push( AshLib.tm('<li class="{threat}"><a href="#">{name}</a></li>', fish) );
  }
  html.push('</ul>');
  console.log(html.join('\n'))
  return html.join('\n');
}

$('section.fish').html( renderFishData( genStub(5) ) );


