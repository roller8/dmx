var kick, kickBtn, snare, snareBtn, clHat, clHatBtn, opHat, opHatBtn, timer;
var tempo       = 120;
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
    var $startButton = $('.start-stop').find('button');
    var count = 0;
    $startButton.on('click', function (e) {
        $(e.currentTarget).toggleClass('active');
        if ($startButton.hasClass('active')) {
            playSubdiv(count);
            timer = setInterval(function () {
                if (count > subdivision * 4) count = 0;
                playSubdiv(count);
                count++;
            }, interval);
        } else {
            clearInterval(timer);
        }
    });
    
}
function playSubdiv(count) {
    $('.row').each(function(i, elt){
        $(elt).find('.simple-button').eq(count).each(function (ii, elt2) {
            if ($(elt2).hasClass('active')) {
                if ($(elt2).hasClass('kick')) trigger(kick);
                if ($(elt2).hasClass('snare')) trigger(snare);
                if ($(elt2).hasClass('clhat')) trigger(clHat);
                if ($(elt2).hasClass('ophat')) trigger(opHat);
            }
        });
    });
}
window.addEventListener("load", initAudioPlayer);