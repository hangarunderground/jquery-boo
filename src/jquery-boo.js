/*
jQuery Boo-Raptorize Plugin 2.0.2
https://github.com/hangarunderground/jquery-boo

Inspired by and compatable with ZURB's jQuery Raptorize Plugin 1.0 (http://www.ZURB.com/playground)
This is an API-compatible re-write of their plugin to support newer jQuery versions.
Depends upon Modernizr with HTML5 Audio detection enabled.

Free to use under the MIT license.
http://www.opensource.org/licenses/mit-license.php
*/


(function() {
    (function($) {
        return $.fn.raptorize = function(options) {
            var animate, arraysEqual, audioSupported, locked, boo,
                booAudioMarkup, booImageMarkup, settings, watchForKonami,
                image, audio_mp3, audio_ogg, audio_on;
            settings = $.extend({
                "enterOn": "click",
                "delayTime": 5000
            }, options);

            options = (options === undefined) ? {}: options;
            image = ('image' in options) ? options['image']: 'image/boo.png';
            audio_mp3 = ('audio_mp3' in options) ? options['audio_mp3']: 'sounds/boo-sound.mp3';
            audio_ogg = ('audio_ogg' in options) ? options['audio_ogg']: 'sounds/boo-sound.ogg';

            audio_on = ('audio_on' in options) ? options['audio_on']: false;

            booImageMarkup = '<img id="elBoo" style="display: none" src="' + image + '" />';
            if (!$('#elBoo').length) {
                $('body').append(booImageMarkup);
            }

            if (audio_on) {
                audioSupported = Modernizr.audio;
                booAudioMarkup = '<audio id="elBooShriek" preload="auto"><source src="' + audio_mp3 + '" /><source src="' + audio_ogg + '" /></audio>';
                if (!($('#elBooShriek').length || !audioSupported)) {
                    $('body').append(booAudioMarkup);
                }
            }

            boo = $('#elBoo').css({
                "position": "fixed",
                "bottom": "-700px",
                "right": "0",
                "display": "block"
            });
            arraysEqual = function(array1, array2) {
                return array1.length === array2.length && array1.every(function(e, i) {
                    return e === array2[i];
                });
            };
            watchForKonami = function() {
            var konamiCode, pressedKeys;
                pressedKeys = [];
                konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
                return $(window).bind('keydown.raptorz', function(e) {
                    pressedKeys.push(e.which);
                    while (pressedKeys.length > konamiCode.length) {
                        pressedKeys.shift();
                    }
                    if (arraysEqual(pressedKeys.slice(-konamiCode.length), konamiCode)) {
                        return animate();
                    }
                });
            };
            locked = false;
            animate = function() {
                if (!locked) {
                    locked = true;
                    if (audioSupported && audio_on) {
                        $('#elBooShriek').get(0).play();
                    }
                    if (settings['enterOn'] === 'konami-code') {
                        $(window).unbind('keydown.raptorz');
                    }
                    return boo.animate({
                        "bottom": "0"
                    }, function() {
                        return $(this).animate({
                            "bottom": "-130px"
                        }, 100, function() {
                            var offset;
                            offset = ($(this).position().left) + 400;
                            return $(this).delay(300).animate({
                                "right": offset
                            }, 2200, function() {
                                boo = $('#elBoo').css({
                                    "bottom": "-700px",
                                    "right": "0"
                                });
                                return locked = false;
                            });
                        });
                    });
                }
            };
            if (settings['enterOn'] === 'timer') {
                setTimeout(animate, settings['delayTime']);
            }
            if (settings['enterOn'] === 'konami-code') {
                watchForKonami();
            }
            return this.each(function() {
                if (settings['enterOn'] === 'click') {
                  return $(this).click(animate);
                }
            });
        };
    })(jQuery);
}).call(this);
