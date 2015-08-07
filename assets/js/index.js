var timer;
var $startButton;
var tempo       = 60;
var minuteToMil = 60000;
var subdivision = 4;
var interval    = Math.round((minuteToMil / tempo) / subdivision);
var swing       = false;
var monoAudio   = new Audio();

var sounds      = {
    'kick':     {'src': 'samples/03_BASS_01.wav',       'volume': 1   },
    'snare':    {'src': 'samples/06_SNARE_01.wav',      'volume': 1   },
    'clap':     {'src': 'samples/26_CLAP.wav',          'volume': 0.1 },
    'clHat':    {'src': 'samples/09_HI-HAT_CLOSED.wav', 'volume': 0.2 },
    'opHat':    {'src': 'samples/11_HI-HAT_OPEN.wav',   'volume': 0.07},
    'yeah':     {'src': 'samples/awyeah.wav',           'volume': 0.4 },
    'feel':     {'src': 'samples/canyoufeelit.wav',     'volume': 0.4 },
    'check':    {'src': 'samples/checkthisout.wav',     'volume': 0.4 },
    'here':     {'src': 'samples/herewego.wav',         'volume': 0.4 },
    'oww':      {'src': 'samples/oww.wav',              'volume': 0.4 },
    'woo':      {'src': 'samples/woo.wav',              'volume': 0.4 },
    'hiTom':    {'src': 'samples/12_TOM_01.wav',        'volume': 0.3 },
    'midTom':   {'src': 'samples/14_TOM_03.wav',        'volume': 0.3 },
    'loTom':    {'src': 'samples/17_TOM_06.wav',        'volume': 0.3 },
    'cowbell':  {'src': 'samples/808cowbell.wav',       'volume': 0.5 }
};

var pattern     = [
    {'name': 'kick',    'seq': [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]},
    {'name': 'snare',   'seq': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]},
    {'name': 'clap',    'seq': [0,0,0,0,1,1,0,0,1,0,0,1,0,0,1,0]},
    {'name': 'clHat',   'seq': [1,0,1,0,1,0,1,0,0,1,0,1,1,0,1,0]},
    {'name': 'opHat',   'seq': [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1]}
];

function initAudioPlayer() {
    setObjReference();
    handleStartStop();
    handleVolInput();
    bindDrumKeys();
    togglePattern();
    handleSwing();
}

function setObjReference() {
    $startButton    = $('.start-stop').find('button');

    $('.simple-button').each(function(i, elt) {
        elt.addEventListener('click', function(e) {
            $(e.currentTarget).toggleClass('active');

            if (elt.className.match(/(^| )kick( |$)/)) trigger(sounds.kick);
            else if (elt.className.match(/(^| )snare( |$)/)) trigger(sounds.snare);
            else if (elt.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat);
            else if (elt.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat);
            else if (elt.className.match(/(^| )clap( |$)/)) trigger(sounds.clap);
        });
    });
}

function handleSwing() {
    $('.swing').on('click', 'button', function () {
        $(this).toggleClass('active');
        swing = !swing;
    });
}

function loadPattern() {
    $('.row').each(function (index, elem) {
        $(elem).find('button').each(function (i, el) {
            if (pattern[index].seq[i] === 1) {
                $(el).addClass('active');
            }
        });
    });
}

function togglePattern() {
    loadPattern();
    $('.toggle-pattern').on('click', 'button', function () {
        var $this = $(this);
        $this.toggleClass('active');
        if ($this.hasClass('active')) {
            loadPattern();
        } else {
            $('.row').find('button').removeClass('active');
        }
    });
}

function handleStartStop() {
    var count = 0;

    $startButton.on('click', function(e) {
        var init = new Date().getTime();
        $(e.currentTarget).toggleClass('active');
        handleTempo(init);
        if ($startButton.hasClass('active')) {
            $('.glow').removeClass('hide');
            loop();
        } else {
            clearTimeout(timer);
            count = 0;
            $('.glow').addClass('hide');
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

function handleTempo(init) {
    var diff = new Date().getTime() - init;

    tempo = $('.tempo').find('input').val();
    interval = Math.round((minuteToMil / tempo) / subdivision - diff);
}

function handleVolInput() {
    document.onkeydown = function (e) {
        e = e || window.event;

        var $input = $('.tempo').find('input');
        var volume = Number($input.val());

        switch (e.keyCode) {
            case 38: // up arrow
                tempo = volume + 1;
                $input.val(tempo);
                break;
            case 40: // down arrow
                tempo = volume - 1;
                $input.val(tempo);
                break;
            case 37: // left arrow
               tempo = volume - 1;
               $input.val(tempo);
               break;
            case 39:  // right arrow
               tempo = volume + 1;
               $input.val(tempo);
               break;
        }
    };
}

function bindDrumKeys() {
    window.addEventListener("keydown", function() {
        if ($('.tempo input').is(':focus')) return;

        switch (window.event.keyCode) {
            case 49:
                trigger(sounds.kick);
                break;
            case 50:
                trigger(sounds.snare);
                break;
            case 51:
                trigger(sounds.clap);
                break;
            case 52:
                trigger(sounds.cowbell);
                break;
            case 53:
                trigger(sounds.hiTom);
                break;
            case 54:
                trigger(sounds.midTom);
                break;
            case 55:
                trigger(sounds.loTom);
                break;
            case 56:
                triggerMono(sounds.yeah);
                break;
            case 57:
                triggerMono(sounds.oww);
                break;
            case 48:
                triggerMono(sounds.woo);
                break;
            case 32:
                $startButton.click();
                break;
        }
    });
}

function triggerMono(sound, count) {
    monoAudio.src       = sound.src;
    monoAudio.volume    = sound.volume;

    playSound(monoAudio);
}

function trigger(sound, count) {
    var audio       = new Audio();
    audio.src       = sound.src;
    audio.volume    = sound.volume;

    if (swing && (count % 2 === 1)) {
        setTimeout(function () {
            playSound(audio); //delayed trigger
        }, interval/(Math.random() * 3 + 2));
    } else {
       playSound(audio); //normal
    }
}

function playSound(audio) {
    var $glow = $('.glow');

    audio.play();
    $glow.removeClass('hide');

    setTimeout(function () {
        $glow.addClass('hide');
    }, interval - 5);
}

function playSubdiv(count) {
    var rows = document.getElementsByClassName('row');

    for (var i = 0; i < rows.length; i++) {
        var buttons = rows[i].getElementsByClassName('simple-button');
        $(buttons).removeClass('on').eq(count).each(function (index, elt) {
            if (elt.className.match(/(^| )active( |$)/)) {
                if (elt.className.match(/(^| )kick( |$)/)) trigger(sounds.kick, count);
                else if (elt.className.match(/(^| )snare( |$)/)) trigger(sounds.snare, count);
                else if (elt.className.match(/(^| )clhat( |$)/)) trigger(sounds.clHat, count);
                else if (elt.className.match(/(^| )ophat( |$)/)) trigger(sounds.opHat, count);
                else if (elt.className.match(/(^| )clap( |$)/)) trigger(sounds.clap, count);
            }
            $(elt).addClass('on');
        });
    }
}

window.addEventListener("load", initAudioPlayer);
