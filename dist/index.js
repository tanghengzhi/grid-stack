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
        if (parseInt($(this).css('height')) > parseInt($('#canvas').css('height'))) {
            $('.grid-stack').data('gridstack').removeWidget($('.grid-stack').data('gridstack').container.children().last());
            alert("超出画布大小");
        }

        $('.grid-stack .grid-stack-item').each(function(index) {
        let iframeSrc = $(this).data('iframe-src');
        if (iframeSrc) {
            $(this).find('.grid-stack-item-content').html(iframeSrc);
        } else {
            $(this).find('.grid-stack-item-content').html(index + 1);
        }
        });
    });

    $('.grid-stack').on('change', function(e, items) {
        if (parseInt($(this).css('height')) > parseInt($('#canvas').css('height'))) {
            alert("超出画布大小");
        }
    });

    // Setting
    $(".grid-stack").on("click", ".grid-stack-item", function() {
        $(this).addClass('active');
        let iframeSrc = $(this).data('iframe-src');
        $('#settingModal input#iframe-src').val(iframeSrc);
        $('#settingModal').modal('show');
    })

    $('#settingModal form').on('submit', function(event) {
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
    $('#globalSettingModal form').on('submit', function(event) {
        event.preventDefault();
        let canvasSize = $('#canvas-size').val();
        if (canvasSize) {
            $("#canvas").css('height', canvasSize);
        }
        let marginSize = $('#margin-size').val();
        if (marginSize) {
            $('.grid-stack').data('gridstack').verticalMargin(marginSize);
            var sheet = window.document.styleSheets[3];
            sheet.removeRule(2);
            sheet.insertRule('.grid-stack>.grid-stack-item>.grid-stack-item-content { left: ' + marginSize / 2 + 'px; right: ' + marginSize / 2 + 'px; }', 2);
        }
        let showOnTop = $('input[name=inlineRadioOptions]:checked').val();
        if (showOnTop == 'option2') {
            $('#iframeModal').modal('show');
        }
        if (showOnTop == 'option3') {
            $('#timeModal').modal('show');
        }
        $('#globalSettingModal').modal('hide');
    })


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
                $(this).find('.grid-stack-item-content').html("<iframe src=" + iframeSrc + " style='width:100%; height: 100%;' scrolling='no' frameborder='0'></iframe>");
            }
        });
        let html = '<html>';
        html += '<head>';
        html += $("head").html();
        html += '<style type="text/css">';
        $.each(window.document.styleSheets[3].cssRules, function(i, cssRule) {
            html += cssRule.cssText;
        });
        $.each(window.document.styleSheets[4].cssRules, function(i, cssRule) {
            html += cssRule.cssText;
        });
        html += '</style>';
        html += '</head>';
        html += '<body>';
        html += '<h1>' + $("body h1").html() + '</h1>';
        html += '<div class="col-sm-12 col-md-12">';
        html += $('.grid-stack').parent().html();
        html += '</div>';
        html += '</body>';
        html += '</html>';
        var blob = new Blob(
        [html],
        { type: "text/plain;charset=utf-8" }
        );
        saveAs(blob, "demo.html");
    })
});