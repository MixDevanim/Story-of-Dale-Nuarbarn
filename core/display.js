var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('experimental-webgl', { alpha: false, antialias: false, premultipliedAlpha: false})

var Window = {
    width: canvas.width,
    height: canvas.height,
    
    setup: function(canvas){
        canvas.addEventListener('keydown', handleKeyPress);
        canvas.addEventListener('keyup', handleKeyRelease);
        canvas.addEventListener('mousemove', handleMouseMove, {passive: true, capture: true});
        canvas.addEventListener('click', handleMouseClick);
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('wheel', handleScroll, false);
        canvas.focus();
    },
    
    printDevInfo: function(){
        function getUnmaskedInfo(gl) {
            var unMaskedInfo = {
                renderer: '',
                vendor: ''
            };

            var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
                if (dbgRenderInfo != null) {
                unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
                unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
            }

            return unMaskedInfo;
        }
        console.log("GPU Info:");
        console.log("  vendor:", getUnmaskedInfo(gl).vendor);
        console.log("  renderer:", getUnmaskedInfo(gl).renderer);
    },
    
    update: function(){
        let w = window.innerWidth - 200;
        let h = window.innerHeight - 200;
        w -= w % 8;
        h -= h % 8;
        if (w != canvas.width && h != canvas.height){
            canvas.style.width  = w+'px';
            canvas.style.height = h+'px';
            var dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            Window.width = canvas.width;
            Window.height = canvas.height;
            AR = Window.width / Window.height
        }
    }
}
