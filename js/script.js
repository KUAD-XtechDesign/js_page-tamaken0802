$(function(){
    /*
 * WebGLRendererの生成
 */
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1.0);
document.body.appendChild(renderer.domElement);


/*
 * シーンの追加
 */
var scene = new THREE.Scene();


/*
 * カメラの生成
 */
var fov = 75;
var aspect = window.innerWidth / window.innerHeight;
var near = 0.1;
var far = 10000;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
var camera_position_x0 = 0;
var camera_position_y0 = 0;
var camera_position_z0 = 800;
camera.position.set(camera_position_x0,camera_position_y0,camera_position_z0);


/*
 * Orbitコントローラを生成
 */
var controls = new THREE.OrbitControls(camera, renderer.domElement);


/*
 * Lightをシーンに追加
 */
var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0,30,-50);
scene.add(light);


/*
 *環境光を追加
 */
var ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);


/*
 * 3Dモデルの読み込み
 */
var loader = new THREE.OBJLoader();

loader.load('obj/', function ( object ) {
    scene.add( object );
});


/*
 *レンダリング
 */
function renderRender() {
  renderer.render(scene, camera);

  requestAnimationFrame(animate);
}

/*
 *アニメーション
 */
function animate(){
  renderRender()
}

animate();

})