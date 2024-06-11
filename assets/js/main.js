let scroll = new SmoothScroll('a[href*="#"]', {
    header: '#c_hd',
    offset: 20
});

$(function() {
    click_c_menu();
    set_c_cursor();
    hover_c_nav();
    hover_work_post();
    set_office_gallery();
    select_file();
    set_work_nav();
});

function click_c_menu() {
    // メニューの開閉
    $('#c_menu').on('click', function() {
        $(this).toggleClass('-open');
        $('#c_nav').fadeToggle('400').css('display', 'flex').toggleClass('-active');
        $('.c_logo').toggleClass('-open');
    });
}

function set_c_cursor() {

    var cursor = $('#c_cursor');

    $('a, .contact_submit_btn')
    .on('mouseenter', function() {

        cursor.addClass('-active');

    })
    .on('mouseleave', function() {
        // transition で小さく
        cursor.removeClass('-active');

    });

    // マウスストーカー要素
    var mouse_stalker;

    // マウスストーカー要素の位置
    var stalker = {
        x: 0,
        y: 0
    }

    // マウスの位置
    var mouse = {
        x: 0,
        y: 0
    }

    // マウスの動きを監視
    document.addEventListener('mousemove', mousemove);

    // 初期化処理
    function setup() {
        // マウスストーカー要素を取得
        mouse_stalker = document.querySelector('#c_cursor');

        // 更新処理を開始
        update();
    }

    // マウスが動くたびにマウスの位置を保持しておく
    function mousemove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    // 更新処理
    function update() {
        // マウスストーカー要素の位置を更新
        stalker.x += (mouse.x - stalker.x) * 0.1;
        stalker.y += (mouse.y - stalker.y) * 0.1;

        // マウスストーカーの位置を小数点第一位まで四捨五入
        var x = Math.round(stalker.x * 10) / 10;
        var y = Math.round(stalker.y * 10) / 10;

        // マウスストーカー要素のスタイルを更新
        mouse_stalker.style.transform = `translate3d(` + x + 'px,' + y + 'px, 0)';

        // ループ
        requestAnimationFrame(update);
    }

    setup();
}


function hover_c_nav(){
    // マウスオーバー時の処理
    const _class = ['-service', '-works', '-about', '-recruit', '-contact'];
    $.each(_class, function(index, value){
        $('#c_nav .c_nav_list').find('.'+value+' a').on({
            'mouseenter' : function() {
                $('#c_nav').addClass(value);
            },
            'mouseleave' : function() {
                $('#c_nav').removeClass(value);
            }
        });
    });
}

function hover_work_post() {
    // .wks_postにマウスオーバーすると
    // #c_cursorの中にimg要素を追加し、そのimg要素をついかする
    $('.wks_post').on({
        'mouseenter' : function() {
            let img = $(this).attr('data-src');
            $('#c_cursor div').remove();
            $('#c_cursor').append('<img src="'+img+'" alt="">');
        },
        'mouseleave' : function() {
            $('#c_cursor img').remove();
            $('#c_cursor').append('<div></div>');
        }
    });
}

function set_office_gallery() {
    var office_timer;
    var slide_count = $('.ofc_p_cnt').length;

    $('#office_list > li')
        .on('mouseenter', function() {
            clearTimeout(office_timer);

            var office = $(this).data('office');
            $('.ofc_p_cnt').removeClass('-current');
            $('.ofc_p_cnt[data-office="' + office + '"]').addClass('-current');

            office_timer = setTimeout(next_slide, 6000);
        });

    function next_slide() {
        clearTimeout(office_timer);

        var current_index = $('.ofc_p_cnt.-current').index();
        var next_index = (current_index + slide_count + 1) % slide_count;
        $('.ofc_p_cnt').removeClass('-current').eq(next_index).addClass('-current');

        office_timer = setTimeout(next_slide, 4000);
    }

    $(window).on('load', function() {
        setTimeout(next_slide, 4000); 
    });
}

function select_file() {
    let files = $('.f_file');

    files.find('input[type="file"]').on('change', function() {
        let file = $(this).prop('files')[0];
        let file_name = file.name;
        //兄弟要素である.f_file_labelにファイル名を表示
        $(this).siblings('.f_file_label').text(file_name);
    });
}

function set_work_nav() {
    // .wks_cat_navのクリックイベント
    // クリックされた.wks_cat_navのdata-catを取得
    $('.wks_cat_nav').on('click', function() {
        let cat = $(this).attr('data-list');

        // catの値と一致するdata-cat-typeを持つ.wks_cat_listを表示する
        $('.wks_cat_list').each(function() {
            if ($(this).attr('data-cat-type') === cat) {
                $(this).fadeToggle(0);
            }
            else {
                $(this).fadeOut(0);
            }
        });
    });

    // .wks_cat_list > li のクリックイベント
    // クリックされた.wks_cat_list > liのdata-catを取得し、その要素に-activeを付与し
    // work_bind関数を実行
    $('[data-cat]').on('click', function() {
        let cat = $(this).attr('data-cat');

        if(cat === 'all') {
            $('.wks_item').addClass('-active');
            return false;
        }
        $(this).toggleClass('-active');
        work_bind();
    });
}

function work_bind() {
    // data-catの中で-activeを持つ要素を取得し、data-catの値を取得
    let cat = [];

    $('[data-cat].-active').map(function() {
        cat.push($(this).attr('data-cat'));
    });

    // data-catの値がcatに含まれる要素を表示
    $('.wks_item').each(function() {
        // data-catの値を,で分割
        let data_cat = $(this).attr('data-item-cat').split(',');

        // data-catの値がcatに含まれる場合は表示
        if (data_cat.some(function(v) {
            return cat.indexOf(v) >= 0;
        })) {
            $(this).addClass('-active');
        }
        else {
            $(this).removeClass('-active');
        }
    });
}