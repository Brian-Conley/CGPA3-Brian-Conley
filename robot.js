"use strict";

function makeCube(center, size, rotation, color, canRecolor) {

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
        indices: indices,
        canRecolor: canRecolor
    }

}

function makeRectangularPrism(center, length, height, width, rotation, color, canRecolor) {

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

    const lengthh = length / 2;
    const heighth = height / 2;
    const widthh = width / 2;

    var local_vertices = [
        vec3( -lengthh, -heighth,  widthh ),
        vec3( -lengthh,  heighth,  widthh ),
        vec3(  lengthh,  heighth,  widthh ),
        vec3(  lengthh, -heighth,  widthh ),
        vec3( -lengthh, -heighth, -widthh ),
        vec3( -lengthh,  heighth, -widthh ),
        vec3(  lengthh,  heighth, -widthh ),
        vec3(  lengthh, -heighth, -widthh )
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
        indices: indices,
        canRecolor: canRecolor
    }

}

function makePyramid(center, base, height, rotation, color, canRecolor) {

    var vertexColors = [
        color,
        color,
        color,
        color
    ];

    const baseh = base / 2;
    const heighth = height / 2;

    var local_vertices = [
        vec3( 0.0, height, 0.0 ),
        vec3( baseh, -heighth, 0.0 ),
        vec3( -baseh, -heighth, baseh),
        vec3( -baseh, -heighth, -baseh)
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
        0, 1, 2,
        0, 1, 3,
        0, 2, 3,
        1, 2, 3
    ];

    return {
        vertices: vertices,
        vertexColors: vertexColors,
        numVertices: 12,
        indices: indices,
        canRecolor: canRecolor
    }

}

function constructComplexShape(shapes) {

    var vertices = [];
    var vertexColors = [];
    var indices = [];
    var numVertices = 0;
    var offset= 0;
    var recolorableVertices = [];

    for (const shape of shapes) {
        vertices = vertices.concat(shape.vertices);
        vertexColors = vertexColors.concat(shape.vertexColors);
        indices = indices.concat(shape.indices.map(i => i + offset));
        numVertices += shape.numVertices;

        if (shape.canRecolor) {
            for (let i = 0; i < shape.vertices.length; i++) {
                recolorableVertices.push(i + offset);
            }
        }

        offset += shape.vertices.length;
    }

    return {
        vertices: vertices,
        vertexColors: vertexColors,
        indices: indices,
        numVertices: numVertices,
        recolorableVertices: recolorableVertices
    };

}

function recolor(complexShape) {
    for (var v of complexShape.recolorableVertices) {
        var redval = complexShape.vertexColors[v][0];
        var blueval = complexShape.vertexColors[v][2];
        complexShape.vertexColors[v] = vec4((redval+1) % 2, 0, (blueval+1) % 2, 1);
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

let hat = makePyramid(
    vec3(0, .65, 0),
    .08, .1,
    vec3(0,0,0),
    vec4(0,0,1,1),
    true
);

// (.1, .6, .1) -> (-.1, .4, -.1)
let head = makeCube(
    vec3(0, .5, 0),
    0.2,
    vec3(0,0,0),
    vec4(1,0,0,1),
    true
);

let eye1 = makeCube(
    vec3(-.04, .5, .1),
    0.02,
    vec3(0,0,0),
    vec4(0,0,0,1),
    false
);

let eye2 = makeCube(
    vec3(.04, .5, .1),
    0.02,
    vec3(0,0,0),
    vec4(0,0,0,1),
    false
);

let torso = makeRectangularPrism(
    vec3(0, .15, 0),
    .4, .5, .2,
    vec3(0,0,0),
    vec4(0,0,1,1),
    true
);

let shoulder1 = makePyramid(
    vec3(.2, .3, 0),
    .2, .1,
    vec3(0,-90,90),
    vec4(1,0,0,1),
    true
);

let shoulder2 = makePyramid(
    vec3(-.2, .3, 0),
    .2, .1,
    vec3(0,-90,90),
    vec4(1,0,0,1),
    true
);

let arm1 = makeRectangularPrism(
    vec3(-.23, .365, .2),
    .075, .07, .3,
    vec3(0,0,0),
    vec4(1,0,0,1),
    true
);

let arm2 = makeRectangularPrism(
    vec3(.23, .365, .2),
    .075, .07, .3,
    vec3(0,0,0),
    vec4(1,0,0,1),
    true
);

let leg1 = makeRectangularPrism(
    vec3(-.1, -.25, 0),
    .1, .3, .1,
    vec3(0,0,0),
    vec4(1,0,0,1),
    true
);

let leg2 = makeRectangularPrism(
    vec3(.1, -.25, 0),
    .1, .3, .1,
    vec3(0,0,0),
    vec4(1,0,0,1),
    true
);

let shape = constructComplexShape([hat, head, eye1, eye2, torso, shoulder1, shoulder2, arm1, arm2, leg1, leg2]);

var vertices = shape.vertices;
var vertexColors = shape.vertexColors;
var indices = shape.indices;
var numVertices = shape.numVertices;

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
    document.getElementById( "colorButton" ).onclick = function () {
        recolor(shape);
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(shape.vertexColors), gl.STATIC_DRAW);
    };


    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 3.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawElements( gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0 );

    requestAnimFrame( render );
}
