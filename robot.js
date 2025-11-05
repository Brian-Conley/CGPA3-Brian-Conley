"use strict";

function makeCube(center, size, rotation, color) {

    /*
        var vertexColors = [
            color,
            color,
            color,
            color,
            color,
            color,
            color,
            color
        ];
    */

    var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 0.0, 1.0 ),
        vec4( 0.0, 1.0, 0.0, 1.0 ),
        vec4( 0.0, 0.0, 1.0, 1.0 ),
        vec4( 1.0, 1.0, 0.0, 1.0 ),
        vec4( 1.0, 0.0, 1.0, 1.0 ),
        vec4( 0.0, 1.0, 1.0, 1.0 ),
        vec4( 0.5, 0.5, 0.5, 1.0 ),
    ];

    const sizeh = size / 2;

    var local_vertices = [
        vec3( -sizeh, -sizeh,  sizeh ),
        vec3( -sizeh,  sizeh,  sizeh ),
        vec3(  sizeh,  sizeh,  sizeh ),
        vec3(  sizeh, -sizeh,  sizeh ),
        vec3( -sizeh, -sizeh, -sizeh ),
        vec3( -sizeh,  sizeh, -sizeh ),
        vec3(  sizeh,  sizeh, -sizeh ),
        vec3(  sizeh, -sizeh, -sizeh )
    ];
    var vertices = [];

    var rotx = rotateX(rotation[0]);
    var roty = rotateY(rotation[1]);
    var rotz = rotateZ(rotation[2]);
    var rot = mult(rotx, mult(roty, rotz));
    var t = mult(translate(center), rot);

    for (let v of local_vertices) {
        var v4 = vec4(v, 1);
        var rot_v4 = vec3( dot(v4, t[0]), dot(v4, t[1]), dot(v4, t[2]) );
        vertices.push(vec3( rot_v4[0], rot_v4[1], rot_v4[2] ));
    }

    var indices = [
        1, 0, 3,
        3, 2, 1,
        2, 3, 7,
        7, 6, 2,
        3, 0, 4,
        4, 7, 3,
        6, 5, 1,
        1, 2, 6,
        4, 5, 6,
        6, 7, 4,
        5, 4, 0,
        0, 1, 5
    ];

    return {
        vertices: vertices,
        vertexColors: vertexColors,
        numVertices: 36,
        indices: indices
    }

}

var canvas;
var gl;

var axis = 1;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [ 0, 0, 0 ];
var thetaLoc;

let shape = makeCube(vec3(0.0, 0.0, 0), 1.0, vec3(45, 0, 15), vec4(0.5, 0.25, 0.5, 1.0));
var vertices = shape.vertices;
var vertexColors = shape.vertexColors;
var indices = shape.indices;
var numVertices = shape.numVertices;

/*
var vertices = [
    // Head: Pyramid
    vec3(  0.0,  0.5,  0.0 ), // 0
    vec3(  0.5, -0.5,  0.0 ), // 1
    vec3( -0.5, -0.5, -0.5 ), // 2
    vec3( -0.5, -0.5,  0.5 ), // 3

];

var vertexColors = [
    // Head: Pyramid
    vec4( 1.0, 0.5, 0.0, 1.0 ),
    vec4( 0.0, 0.0, 0.0, 1.0 ),
    vec4( 0.0, 0.0, 0.0, 1.0 ),
    vec4( 0.0, 0.0, 0.0, 1.0 ),

];

var numVertices  = 12;
var indices = [
    // Head: Pyramid
    0, 1, 2,
    0, 1, 3,
    0, 2, 3,
    1, 2, 3

];
*/

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);;

    //
        //  Load shaders and initialize attribute buffers
    //
        var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };


    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);


    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );

    requestAnimFrame( render );
}
