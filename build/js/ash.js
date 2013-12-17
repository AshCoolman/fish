
/**
* Centralised data store that broadcasts when data has changed
* @pconstructor
**/
function DataStore () {
  var _interestingFish,
    _allFish,
    _interestingFish;
};
/**
* Getter for <code>interestingFish</code>
* @pconstructor
**/
DataStore.prototype.getInterestingFish = function () {
    return _interestingFish;
}
/**
* Event dispatching setter for <code>interestingFish</code>
* @pconstructor
**/
DataStore.prototype.setInterestingFish = function (val) {
    if (this._interestingFish != val) {
      $(window.document).trigger('dataStoreChangedInterestingFish', val);
      this._interestingFish = val;
    }
}




/**
* Mediator-ish object to handle what is visible
* @param (String) task - Describes the task the user is doing
**/
function setViewables(task) {
  switch (task) {
    case 'input': break;
  }
}

/**
* Object that shows some fish of interest when there is no user input
* @pconstructor
**/
function Fish(el) {
  this.el = el;
}
Fish.method('renderFishData', function (fishArr) {
    var html = ['<ul>'], fish;
    for (var f = 0, fish; f < fishArr.length, fish = fishArr[f]; f++) {
      html.push( AshLib.tm('<li class="{threat}"><a href="#">{name}</a></li>', fish) );
    }
    html.push('</ul>');
    console.log(html.join('\n'))
    return html.join('\n');
});
Fish.method('render', function (data) {
    this.el.innerHTML = this.renderFishData(data);
});


/**
* Object that shows some fish of interest when there is no user input
* @pconstructor
**/
function InterestingFish(el) {
  this.el = el;
};
InterestingFish.inherit(Fish);

/**
* Search results of user input
* @pconstructor
**/
function SearchedFish() {

}
SearchedFish.inherit(Fish);



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

/**
* Takes input of fish data, outputs fish list html
* @param (Array) fishArr - A list of fish data objects (<code>{threat: ..., name: ...}</code>)
**/
function renderFishData(fishArr) {
  var html = ['<ul>'], fish;
  for (var f = 0, fish; f < fishArr.length, fish = fishArr[f]; f++) {
    html.push( AshLib.tm('<li class="{threat}"><a href="#">{name}</a></li>', fish) );
  }
  html.push('</ul>');
  console.log(html.join('\n'))
  return html.join('\n');
}



$('input.autocompletion').autocompletion({
    source: genStub(5), 
    overlay: '.overlay-autocompletion'
});
 

$('input.autocompletion').on('updatedAutoComplete', function (me) {
    return function (e, items) {
      console.log('updatedAutoComplete detected', items);
      $('section.fish').html( renderFishData( items ) );
    }
  }()
);



var dataStore = new DataStore(),
  viewables = {
    interestingFish: new InterestingFish()
};

var interestingFish = new InterestingFish($('section.interesting-fish')[0]);
interestingFish.render(genStub(5));

