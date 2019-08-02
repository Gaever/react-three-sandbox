import React, { Component } from 'react';
import * as THREE from 'three';

export default class DraggableCubes extends Component {

}

var container, stats;
var camera, controls, scene, projector, renderer;
var objects = [], plane;
var mouse = new THREE.Vector2(),
offset = new THREE.Vector3(),
INTERSECTED, SELECTED;
init();
animate();
function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    scene = new THREE.Scene();
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    light.castShadow = true;
    light.shadowCameraNear = 200;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;
    light.shadowBias = -0.00022;
    light.shadowDarkness = 0.5;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    scene.add( light );
    var geometry = new THREE.CubeGeometry( 40, 40, 40 );
    for ( var i = 0; i < 200; i ++ ) {
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        object.material.ambient = object.material.color;
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600 - 300;
        object.position.z = Math.random() * 800 - 400;
        object.rotation.x = ( Math.random() * 360 ) * Math.PI / 180;
        object.rotation.y = ( Math.random() * 360 ) * Math.PI / 180;
        object.rotation.z = ( Math.random() * 360 ) * Math.PI / 180;
        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add( object );
        objects.push( object );
    }
    plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
    plane.visible = false;
    scene.add( plane );
    projector = new THREE.Projector();
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.sortObjects = false;
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    container.appendChild( renderer.domElement );
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - draggable cubes';
    container.appendChild( info );
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    if ( SELECTED ) {
        var intersects = ray.intersectObject( plane );
        SELECTED.position.copy( intersects[ 0 ].point.subSelf( offset ) );
        return;
    }
    var intersects = ray.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        if ( INTERSECTED != intersects[ 0 ].object ) {
            if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ 0 ].object;
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            plane.position.copy( INTERSECTED.position );
            plane.lookAt( camera.position );
        }
        container.style.cursor = 'pointer';
    } else {
        if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
        container.style.cursor = 'auto';
    }
}
function onDocumentMouseDown( event ) {
    event.preventDefault();
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    var intersects = ray.intersectObjects( objects );
    if ( intersects.length > 0 ) {
        controls.enabled = false;
        SELECTED = intersects[ 0 ].object;
        var intersects = ray.intersectObject( plane );
        offset.copy( intersects[ 0 ].point ).subSelf( plane.position );
        container.style.cursor = 'move';
    }
}
function onDocumentMouseUp( event ) {
    event.preventDefault();
    controls.enabled = true;
    if ( INTERSECTED ) {
        plane.position.copy( INTERSECTED.position );
        SELECTED = null;
    }
    container.style.cursor = 'auto';
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}
function render() {
    controls.update();
    renderer.render( scene, camera );
}