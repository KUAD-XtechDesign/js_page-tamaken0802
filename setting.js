$(function(){
     //基本設定
     var width = 900;//横幅
     var height = 900;//縦幅
    
     var renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#canvas"),//id="canvas"に描画
      alpha: true //背景を透過する
     });
     renderer.setPixelRatio(window.devicePixelRatio);
     renderer.setSize(width, height);
     var scene = new THREE.Scene();
    
     // カメラ設定
     var camera = new THREE.PerspectiveCamera(3,width / height,1,10000);//視野角,縦横比,手前の距離,奥の距離
     camera.position.set(0, 0, 1000);//カメラ位置
        
     // ライト設定
     ambientLight = new THREE.AmbientLight(0xffffff);//環境光源
     hemisphereLight = new THREE.HemisphereLight(0xffffff,0x4169e1, 0.5);//半球光源
     scene.add(hemisphereLight);
     scene.add(ambientLight);

     // ボックス
 var geometry = new THREE.BoxGeometry(10, 10, 10);//x,y,z
 var material = new THREE.MeshStandardMaterial({color: 0xaaaaaa});
 var box = new THREE.Mesh(geometry, material);
 scene.add(box);

     // 実行
     animate();
     function animate(){
       renderer.render(scene, camera);
     };
    });