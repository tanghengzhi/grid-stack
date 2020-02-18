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

    $('.grid-stack').on('dropped', function(event, previousWidget, newWidget) {
        $('.grid-stack .grid-stack-item').each(function(index) {
        let iframeSrc = $(this).data('iframe-src');
        if (iframeSrc) {
            $(this).find('.grid-stack-item-content').html(iframeSrc);
        } else {
            $(this).find('.grid-stack-item-content').html(index + 1);
        }
        });
    });

    // Setting
    $(".grid-stack").on("click", ".grid-stack-item", function() {
        $(this).addClass('active');
        let iframeSrc = $(this).data('iframe-src');
        $('#settingModal input#iframe-src').val(iframeSrc);
        $('#settingModal').modal('show');
    })

    $('form').on('submit', function(event) {
        event.preventDefault();
        let iframeSrc = $('#iframe-src').val();
        $(".grid-stack .grid-stack-item.active").data('iframe-src', iframeSrc);
        $(".grid-stack .grid-stack-item.active").find('.grid-stack-item-content').html(iframeSrc);
        $('#settingModal').modal('hide');
    })

    $('#settingModal').on('hidden.bs.modal', function (e) {
        $(".grid-stack .grid-stack-item.active").removeClass('active');
    })

    // Global Setting


    // Preview
    $('#preview').on("click", function() {
        $(this).hide();
        $('#cancel-preview').show();

        $('.grid-stack .grid-stack-item').each(function() {
        let iframeSrc = $(this).data('iframe-src');
        if (iframeSrc) {
            $(this).find('.grid-stack-item-content').html("<iframe src=" + iframeSrc + " style='width:100%; height: 100%;' scrolling='no' frameborder='0'></iframe>");
        }
        });
    })

    $('#cancel-preview').on("click", function() {
        $(this).hide();
        $('#preview').show();

        $('.grid-stack .grid-stack-item').each(function(index) {
        let iframeSrc = $(this).data('iframe-src');
        if (iframeSrc) {
            $(this).find('.grid-stack-item-content').html(iframeSrc);
        } else {
            $(this).find('.grid-stack-item-content').html(index + 1);
        }
        });
    })

    // Download
    $('#download').on("click", function() {
        $('.grid-stack .grid-stack-item').each(function() {
        let iframeSrc = $(this).data('iframe-src');
        if (iframeSrc) {
            $(this).find('.grid-stack-item-content').html("<iframe src=" + iframeSrc + " style='width:100%; height: 100%;' scrolling='no' frameborder='0></iframe>");
        }
        });
        let html = '<html>';
        html += '<head>';
        html += $("head").html();
        html += '</head>';
        html += '<body>';
        html += '<div class="col-sm-12 col-md-12">';
        html += $('.grid-stack').parent().html();
        html += '</div>';
        html += '<script src="http://tanghengzhi.com/grid-stack/dist/demo.js"><\/script>';
        html += '</body>';
        html += '</html>';
        var blob = new Blob(
        [html],
        { type: "text/plain;charset=utf-8" }
        );
        saveAs(blob, "demo.html");
    })
});