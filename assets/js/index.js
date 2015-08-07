var kick, kickBtn, snare, snareBtn, clHat, clHatBtn, opHat, opHatBtn, timer;
var tempo       = 60;
var minuteToMil = 60000;
var subdivision = 4;
var interval    = Math.round((minuteToMil/tempo)/subdivision);

function initAudioPlayer () {
    kick = new Audio();
    snare = new Audio();
    clHat = new Audio();
    opHat = new Audio();


    kick.src = 'samples/03_BASS_01.wav';
    snare.src = 'samples/06_SNARE_01.wav';
    clHat.src = 'samples/09_HI-HAT_CLOSED.wav';
    opHat.src = 'samples/11_HI-HAT_OPEN.wav';

    // set obj references
    kickBtn = $('.kick');
    snareBtn = $('.snare');
    clHatBtn = $('.clhat');
    opHatBtn = $('.ophat');

    kickBtn.each(function(i, elt) {
        elt.addEventListener('click', function (e){
            $(e.currentTarget).toggleClass('active');
            trigger(kick);
        });
    });
    snareBtn.each(function(i, elt) {
        elt.addEventListener('click', function (e){
            $(e.currentTarget).toggleClass('active');
            trigger(snare);
        });
    });
    clHatBtn.each(function(i, elt) {
        elt.addEventListener('click', function (e){
            $(e.currentTarget).toggleClass('active');
            trigger(clHat);
        });
    });
    opHatBtn.each(function(i, elt) {
        elt.addEventListener('click', function (e){
            $(e.currentTarget).toggleClass('active');
            trigger(opHat);
        });
    });

    handleStartStop();
}

function trigger (audio) {
    audio.play();
}

function handleStartStop() {
    var $startButton    = $('.start-stop').find('button');
    var count           = 0;
    $startButton.on('click', function (e) {
        var init = new Date().getTime();
        $(e.currentTarget).toggleClass('active');
        handleTempo(init);
        if ($startButton.hasClass('active')) {
            //playSubdiv(count);
            dome();
        } else {
            clearTimeout(timer);
            count = 0;
            $('.simple-button').removeClass('on');
        }
        function dome() {
            timer = setTimeout(function () {
                var init2 = new Date().getTime();
                playSubdiv(count);
                handleTempo(init2);
                if (count >= subdivision * 4) count = 0;
                else count++;
                dome();
            }, interval);
        }
    });
}

function handleTempo(init) {
    var diff = new Date().getTime() - init;
    tempo    = $('.tempo').find('input').val();
    interval = Math.round((minuteToMil/tempo)/subdivision - diff);
}

function playSubdiv(count) {
    var rows = document.getElementsByClassName('row');

    for (var i = 0; i < rows.length; i++) {
        var buttons = rows[i].getElementsByClassName('simple-button');
        $(buttons).removeClass('on').eq(count).each(function (index, elt) {
            if (elt.className.match(/(^| )active( |$)/)) {
                if (elt.className.match(/(^| )kick( |$)/)) trigger(kick);
                else if (elt.className.match(/(^| )snare( |$)/)) trigger(snare);
                else if (elt.className.match(/(^| )clhat( |$)/)) trigger(clHat);
                else if (elt.className.match(/(^| )ophat( |$)/)) trigger(opHat);
            }
            $(elt).addClass('on');
        });
    }
}

window.addEventListener("load", initAudioPlayer);
