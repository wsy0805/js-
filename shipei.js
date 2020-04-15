'use strict'

const commonMethods = {
    // pc屏幕适配
    shiPei: function () {
        document.body.style.zoom = "normal";//避免zoom尺寸叠加
        let scale = document.body.clientWidth / 1920;
        document.body.style.zoom = scale;
        (function () {
            var throttle = function (type, name, obj) {
                obj = obj || window;
                var running = false;
                var func = function () {
                    if (running) { return; }
                    running = true;
                    requestAnimationFrame(function () {
                        obj.dispatchEvent(new CustomEvent(name));
                        running = false;
                    });
                };
                obj.addEventListener(type, func);
            };

            /* init - you can init any event */
            throttle("resize", "optimizedResize");
        })();
        window.addEventListener("optimizedResize", function () {
            document.body.style.zoom = "normal";
            let scale = document.body.clientWidth / 1920;
            document.body.style.zoom = scale;
        });
    }
}
export default commonMethods