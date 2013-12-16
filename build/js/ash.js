
$('input.autocompletion').autocompletion({
    source: ['Mother', 'Mother1', 'Father', 'Sister', 'Brother'] // Also it can be a function. See below.
});
 

$('input.autocompletion').on('updatedAutoComplete', function (me) {
    return function (e, items) {
        console.log('updatedAutoComplete detected', arguments);
    }
  }()
);