requirejs.config(
    {
        paths: {
            jquery: 'jquery-3.4.1.min',
            circle: 'control/circle-1.0'
        }
    }
)

define(['jquery'], function($) {
    console.log('jquery loaded');
    window.jQuery = $;
});