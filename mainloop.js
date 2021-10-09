var Core = {
    frameID: 0,
    version: '0.0.4',
};

var batch = null;
// temp values translated out of loop for better performance
var blend_map = [1,1,1,1];
var AR = 1.0;

var player = new Player(new vec3(12,6,0), 10, {});
player.inventory['floor'] = 11;

var accessSlots = []
for (let name in player.inventory){
    accessSlots.push(name);
}
for (let i = accessSlots.length; i < 10; i++)
    accessSlots.push(null);

function main() {
    Window.setup(canvas);
    Window.printDevInfo()
    console.log("version: "+Core.version);
    
    AR = Window.width / Window.height
    load_assets();
    batch = new Batch(4096, Assets.shader);
    
    var camera = new Camera(new vec3(10,5,1));
    camera.flipped = true;
    camera.fov = Window.width / 128.0;
    camera.centred = true;
    
    var uicamera = new Camera(new vec3(0,0,0));
    uicamera.centred = false;
    
    camera.update();
    
    function onTick(now) {
        Core.frameID++;
        Time.update(now);
        Window.update();
        uicamera.fov = Window.height*0.5*0.5;
        camera.fov = Window.height / 128.0;

        let speed = 2.0;
        player.go = false;
        if (Events.left){
            player.coords.x -= Time.dt * speed;
            player.dir = 0;
            player.go = true;
        }
        if (Events.right){
            player.coords.x += Time.dt * speed;
            player.dir = 2;
            player.go = true;
        }
        if (Events.down){
            player.coords.y -= Time.dt * speed;
            player.dir = 3;
            player.go = true;
        }
        if (Events.up){
            player.coords.y += Time.dt * speed;
            player.dir = 1;
            player.go = true;
        }

        camera.coords.x = player.coords.x;
        camera.coords.y = player.coords.y;
        camera.toBounds(0.5,current_map.width+0.5, 0.5,current_map.height+0.5);
        camera.update();
        
        draw_level(camera, Assets.shader);
        
        let mx = (Events.mx / Window.width - 0.5) * 2.0 * (Window.width / Window.height)
        let my = -(Events.my / Window.height - 0.5) * 2.0
        
        mx = mx * camera.fov + camera.coords.x;
        my = my * camera.fov + camera.coords.y;
        
        draw_ui_layer(mx,my, uicamera, camera, Assets.uiShader);

        gl.flush();
        Events.pull()
        window.requestAnimationFrame(onTick);
    }
    onTick(0.0);
}

window.onload = main;
