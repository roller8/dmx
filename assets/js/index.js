var kick, kickBtn, snare, snareBtn, clHat, clHatBtn, opHat, opHatBtn, clap, clapBtn, timer;
var tempo = 60;
var minuteToMil = 60000;
var subdivision = 4;
var interval = Math.round((minuteToMil / tempo) / subdivision);

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
}

function trigger(audio) {
    audio.play();
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
        console.log('focus');
        document.onkeydown = checkKey;
    }).on('blur', function () {
        console.log('blur');
    });
}
function checkKey(e) {

    e = e || window.event;
    var $input = $('.tempo').find('input');
    var volume = Number($input.val());

    if (e.keyCode == '38') {
        // up arrow
        console.log('up arrow');
        tempo = volume + 1;
    }
    else if (e.keyCode == '40') {
        // down arrow
        console.log('down arrow');
        tempo = volume - 1;
    }
    else if (e.keyCode == '37') {
       // left arrow
       console.log('left arrow');
       tempo = volume - 1;
    }
    else if (e.keyCode == '39') {
       // right arrow
       console.log('right arrow');
       tempo = volume + 1;
    }
    $input.val(tempo);
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
                if (elt.className.match(/(^| )kick( |$)/)) trigger(kick);
                else if (elt.className.match(/(^| )snare( |$)/)) trigger(snare);
                else if (elt.className.match(/(^| )clhat( |$)/)) trigger(clHat);
                else if (elt.className.match(/(^| )ophat( |$)/)) trigger(opHat);
                else if (elt.className.match(/(^| )clap( |$)/)) trigger(clap);
            }
            $(elt).addClass('on');
        });
    }
}

window.addEventListener("load", initAudioPlayer);
