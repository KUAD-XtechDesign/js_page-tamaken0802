$(function(){
    "use strict";

    /**
     * objファイルを読み込む
     */
    function loadObj(objUrl, mtlUrl, callbackOnLoaded)
    {
        // obj mtl を読み込んでいる時の処理
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        // obj mtl が読み込めなかったときのエラー処理
        var onError = function ( xhr ) {
            console.log('obj, mtlが読み込めませんでした');
        };

        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('/assets/');
        mtlLoader.load(mtlUrl, function( materials ) {
            console.log(materials);
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( '/assets/' );
            objLoader.load(objUrl, function ( object ) {
                object.position.set(0, 0, 0);
                object.scale.set(50, 50, 50);

                callbackOnLoaded(object);
            }, onProgress, onError );
        });
    }

    var scene;
    var camera;
    var light;
    var renderer;
    var width = 600;
    var height = 600;

    // scene ステージ
    scene = new THREE.Scene();

    // 床
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200, 5, 5),
        new THREE.MeshLambertMaterial({color: 0x999999, ambient:0x050505}));
    plane.position.set(0, 0, 0);
    plane.rotation.x = -45;
    plane.receiveShadow = true;
    scene.add(plane);


    // light
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 100, 30);
    light.position.set(0, 0, 1000);
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.castShadow = true;
    scene.add(light);

    // camera
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(100, 300, 500);

    loadObj('cup3.obj', 'cup3.mtl', function(obj) {
        function setMaterialToBody(mat) {
            mesh.material[0] = mat;
            renderer.render(scene, camera);
        }
        function setMaterialToFace(mat) {
            mesh.material[1] = mat;
            renderer.render(scene, camera);
        }

        obj.castShadow = true;

        console.log(obj);
        var mesh = obj.getObjectByName('Cylinder');
        console.log(mesh);

        setMaterialToBody(new THREE.MeshPhongMaterial({
            color: 0x843872,
            specular: 0xcccccc
        }));
        setMaterialToFace(new THREE.MeshPhongMaterial({
            color: 0x66B6FF,
            specular: 0xffffff
        }));
        console.log(mesh.material);

        var texLoader = new THREE.TextureLoader();
        texLoader.load("/assets/tex.png", function(texture){
            setMaterialToFace(new THREE.MeshLambertMaterial({
                map: texture
            }));
        });

        scene.add( obj );

        light.lookAt(obj.position);
        camera.lookAt(obj.position);
        renderer.render(scene, camera);

        tick();
        function tick() {
            obj.rotation.y += 0.01;

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }


        (function(){
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                // Great success! All the File APIs are supported.
            } else {
                alert('The File APIs are not fully supported in this browser.');
                return;
            }

            function handleFileSelect(evt) {
                var files = evt.target.files; // FileList object

                // files is a FileList of File objects. List some properties.
                var output = [];
                for (var i = 0, f; f = files[i]; i++) {
                    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                        f.size, ' bytes, last modified: ',
                        f.lastModifiedDate.toLocaleDateString(), '</li>');
                }
                // 一つ目を採用
                var file = files[0];

                var file_reader = new FileReader();
                file_reader.onload = function(e){
                    console.log(file_reader.result);

                    var image = document.createElement( 'img' );
                    image.src = file_reader.result;

                    var texture = new THREE.Texture(image);
                    texture.needsUpdate = true;

                    setMaterialToFace(new THREE.MeshLambertMaterial({
                        map: texture
                    }));
                };
                file_reader.readAsDataURL(file);


                // 画像データを取得
                console.log(file);
                document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
            }

            document.getElementById('files').addEventListener('change', handleFileSelect, false);
        })();
    });

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff);
    document.getElementById('stage').appendChild(renderer.domElement);
    renderer.shadowMapEnabled = true;
    renderer.render(scene, camera);
})();