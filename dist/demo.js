$(function () {
    var $grid = $('#advanced-grid');
    
    $grid.on('added', function(e, items) { log(' added ', items) });
    $grid.on('removed', function(e, items) { log(' removed ', items) });
    $grid.on('change', function(e, items) { log(' change ', items) });
    function log(type, items) {
      if (!items) { return; }
      var str = '';
      for (let i=0; i<items.length && items[i]; i++) { str += ' (x,y)=' + items[i].x + ',' + items[i].y; }
      console.log(type + items.length + ' items.' + str );
    }

    $grid.gridstack({
      alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ),
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      removable: '#trash',
      removeTimeout: 100,
      acceptWidgets: '.newWidget'
    });

    $('.newWidget').draggable({
      revert: 'invalid',
      scroll: false,
      appendTo: 'body',
      helper: 'clone',
    });
});