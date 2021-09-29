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
}