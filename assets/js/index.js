var kick, kickBtn, snare, snareBtn, clHat, clHatBtn, opHat, opHatBtn, clap, clapBtn, timer;
var tempo = 60;
var minuteToMil = 60000;
var subdivision = 4;
var interval = Math.round((minuteToMil / tempo) / subdivision);
var swing = false;

function initAudioPlayer() {
    kick = new Audio();
    snare = new Audio();
    clap = new Audio();
    clHat = new Audio();
    opHat = new Audio();


    kick.src = 'samples/03_BASS_01.wav';
    snare.src = 'samples/06_SNARE_01.wav';
    clap.src = 'samples/26_CLAP.wav'
    clHat.src = 'samples/09_HI-HAT_CLOSED.wav';
    opHat.src = 'samples/11_HI-HAT_OPEN.wav';

    clap.volume = 0.2;
    clHat.volume = 0.2;
    opHat.volume = 0.07;

    // set obj references
    kickBtn = $('.kick');
    snareBtn = $('.snare');
    clapBtn = $('.clap');
    clHatBtn = $('.clhat');
    opHatBtn = $('.ophat');

    kickBtn.each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');
            trigger(kick);
        });
    });
    snareBtn.each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');
            trigger(snare);
        });
    });
    clapBtn.each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');
            trigger(clap);
        });
    });
    clHatBtn.each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');
            trigger(clHat);
        });
    });
    opHatBtn.each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');
            trigger(opHat);
        });
    });

    handleStartStop();
    handleVolInput();
    bindDrumKeys();

    $('.swing').on('click', 'button', function () {
        $(this).toggleClass('active');
        swing = !swing;
    });
}

function trigger(audio, count) {
    if (swing && (count % 2 === 1)) {
        setTimeout(function () {
            audio.play();//delayed trigger
        }, interval/(Math.random() * 10 + 3));
    } else {
       audio.play();//normal
    }
}

function handleStartStop() {
    var $startButton = $('.start-stop').find('button');
    var count = 0;
    $startButton.on('click', function(e) {
        var init = new Date().getTime();
        $(e.currentTarget).toggleClass('active');
        handleTempo(init);
        if ($startButton.hasClass('active')) {
            loop();
        } else {
            clearTimeout(timer);
            count = 0;
            $('.simple-button').removeClass('on');
        }

        function loop() {
            timer = setTimeout(function() {
                var init2 = new Date().getTime();
                if (count === subdivision * 4) count = 0;
                playSubdiv(count);
                handleTempo(init2);
                count++;
                loop();
            }, interval);
        }
    });
}

function handleVolInput() {
    var $input = $('.tempo').find('input');
    $input.on('focus', function () {
        document.onkeydown = checkKey;
    });
}
function checkKey(e) {

    e = e || window.event;
    var $input = $('.tempo').find('input');
    var volume = Number($input.val());

    if (e.keyCode == '38') {
        // up arrow
        tempo = volume + 1;
        $input.val(tempo);
    }
    else if (e.keyCode == '40') {
        // down arrow
        tempo = volume - 1;
        $input.val(tempo);
    }
    else if (e.keyCode == '37') {
       // left arrow
       tempo = volume - 1;
       $input.val(tempo);
    }
    else if (e.keyCode == '39') {
       // right arrow
       tempo = volume + 1;
       $input.val(tempo);
    }
}

function bindDrumKeys() {
    window.addEventListener("keydown", function() {
        switch (window.event.keyCode) {
            case 49:
                trigger(kick);
                break;
            case 50:
                trigger(snare);
                break;
            case 51:
                trigger(clap);
                break;
            case 52:
                trigger(clHat);
                break;
            case 53:
                trigger(opHat);
                break;
        }
    });
}

function handleTempo(init) {
    var diff = new Date().getTime() - init;
    tempo = $('.tempo').find('input').val();
    interval = Math.round((minuteToMil / tempo) / subdivision - diff);
}

function playSubdiv(count) {
    var rows = document.getElementsByClassName('row');

    for (var i = 0; i < rows.length; i++) {
        var buttons = rows[i].getElementsByClassName('simple-button');
        $(buttons).removeClass('on').eq(count).each(function(index, elt) {
            if (elt.className.match(/(^| )active( |$)/)) {
                if (elt.className.match(/(^| )kick( |$)/)) trigger(kick, count);
                else if (elt.className.match(/(^| )snare( |$)/)) trigger(snare, count);
                else if (elt.className.match(/(^| )clhat( |$)/)) trigger(clHat, count);
                else if (elt.className.match(/(^| )ophat( |$)/)) trigger(opHat, count);
                else if (elt.className.match(/(^| )clap( |$)/)) trigger(clap, count);
            }
            $(elt).addClass('on');
        });
    }
}

window.addEventListener("load", initAudioPlayer);
