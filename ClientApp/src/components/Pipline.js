import React, { Component } from 'react';
import { render } from 'react-dom'
import './css/Pipline.css'


export class Pipline extends Component {
    static dislpayName = Pipline.name;

    state = {
        piplinesSegmentCount: 0
    }

    render(){
        return (
            <section className="piplineSections">
                <div className="alert alert-danger alert-dismissible fade" id="alert-message" role="alert">
                    Удалить можно только первую и последнюю точку трубопровода.
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={closeAlert}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                <div className="container">
                    <div className="pipline-title mx-auto">
                        <h1>Тестовое задание</h1>
                        <h6>Задача: реализовать построение и обработку трубопроводов с проверкой коллизий</h6>
                    </div>
                   <div className="row">
                        <div className="col-xxl-8 col-xl-8 col-lg-8">
                            <div className="canvasContainer">
                                <canvas id="piplineCanvas" width="700" height="350"
                                    onMouseDown={(e) => {
                                        let newEvent = e.nativeEvent;
                                        HandleMouseDown(newEvent)
                                    }}
                                    onMouseUp={e => {
                                        let newEvent = e.nativeEvent;
                                        HandleMouseUp(newEvent);
                                    }}
                                    onMouseMove={e => {
                                        let newEvent = e.nativeEvent;
                                        HandleMouseMove(newEvent);
                                    }}                                >
                                </canvas>
                            </div>
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4">
                            <div className="boardContainer">
                                <div className="canvasBoard_componen">
                                    <button className="btn btn-primary" onClick={AddPipline}> Добавить новый трубопровод </button>
                                    <button className="btn btn-success" onClick={SetAddPointActive}> Добавить узел </button>
                                    <button className="btn btn-danger" onClick={deleteSelectedPoint}> Удалить узел </button>
                                    <button className="btn btn-warning" onClick={getCollisium}> Рассчитать пересечения</button>
                                </div>
                            </div>
                            <div className="piplineElements" id="piplineItems">
                                <ul className="piplineList" id="piplineList">
                                    
                                </ul>
                            </div>
                        </div>
                   </div>
                </div>    
            </section>
           
        );
    }


    
}



let piplines = []
let mouseDown = false
let piplinesCount = 0;
let defaultId = 0;
let defaultPoint = [0, 0]
let AddPointActive = false
let downOnSelected = false;
let points = []
let selectedNumber = -1;
let activePipline = -1;
let linesArr = []

 

function SetAddPointActive(pipline, point) {
    activeCanvas()
    AddPointActive = true;
}

let activeCanvas = () => {
    let color = piplines[activePipline].color
    let canvas = document.getElementById('piplineCanvas')
    canvas.style.borderColor = color
}

let deActiveCanvas =() =>{
    let defaultColor = '#1b6ec2'
    let canvas = document.getElementById('piplineCanvas')
    canvas.style.borderColor = defaultColor
}


let renderAlert = () => {
    document.getElementById('alert-message').classList.add('show')
    autoCloseAlert(2000)
}
let autoCloseAlert = (time) => {
    setTimeout(() => {
        closeAlert()
    }, time);
}

let closeAlert= () => {
    document.getElementById('alert-message').classList.remove('show')
}

let renderPiplineItems = () => {
    return render(
        piplines.map((item, key) => (
            <li key={item.id} id={key + "pipline"}>
                <button className="pipline-btn" type="button" onClick={() =>setPipline(key)}>{item.name}</button> 
                    <button type="button" className="close red" aria-label="Close" onClick={()=>DeletePipline(item.id)}>
                            <span aria-hidden="true">&times;</span>
                    </button>
            </li>
        )),
        document.getElementById('piplineList')
    );
}


let setPipline = (key) => {
    if (activePipline !== key && activePipline !== -1 && document.getElementById(activePipline + "pipline")) {
        document.getElementById(activePipline + "pipline").classList.remove('pipline-btn__active')
    }
    let pipline = document.getElementById(key + "pipline")

    if(pipline){
        pipline.classList.add('pipline-btn__active')
        activePipline = key;

    }
    
}

let getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let AddPipline = () => {
    let color = getRandomColor()
    let pipline = {
        id: piplinesCount + 1,
        name: "Трубопровод " + (piplinesCount + 1),
        color: color,
        points: []
    }
    piplines.push(pipline)
    piplinesCount += 1
    renderPiplineItems()
    if (piplines.length <= 1) {
        activePipline = 0
        setPipline(0)
    }
}


let DeletePipline = (id) => {

    for (const key in piplines) {
        if (Object.hasOwnProperty.call(piplines, key)) {
            const pipline = piplines[key];
            if(pipline.id === id){
                if(key === '0'){
                    piplines.shift()
                    piplinesCount = 0
                    activePipline = -1
                }else{
                    piplines.splice(key, key)
                }
                renderPiplineItems();
                DrawPipeline();
            }
        }
    }
}

let deleteSelectedPoint = () =>{
        if(selectedNumber && selectedNumber.point === 0){
            piplines[selectedNumber.key].points.shift()
            selectedNumber = -1;
            DrawPipeline()
        }else if(selectedNumber && selectedNumber.point === piplines[selectedNumber.key].points.length -1){
            piplines[selectedNumber.key].points.pop()
            selectedNumber = -1;
            DrawPipeline()
        }else{
            renderAlert()
        }
       
    
}


let addPointsToPipline = (piplineIndex, x, y) =>{
    let point = {x, y};
    piplines[piplineIndex].points.push(point);
}

let TrySelectPoint = (x, y) => {
    piplines.forEach((pipline, key) =>{
        for (var i = 0; i < pipline.points.length; i++) {
            var point = pipline.points[i];
            if (x >= point.x - 5 && x <= point.x + 5 && y >= point.y - 5 && y <= point.y + 5) {
                selectedNumber = {key: key, point: i};
                DrawPipeline();
                downOnSelected = true;
                break
            }
        }
    })    
}
function HandleMouseDown(event) {
    mouseDown = true;
    if (AddPointActive) {
        var x = event.offsetX;
        var y = event.offsetY;
        addPointsToPipline(activePipline, x, y)
        DrawPipeline();
        AddPointActive = false;
    }
    else {
        x = event.offsetX;
        y = event.offsetY;
        TrySelectPoint(x, y);
    }

}
function HandleMouseMove(event) {
    if (mouseDown) {
        if (downOnSelected) {
            let point = piplines[selectedNumber.key].points[selectedNumber.point];
            point.x = event.offsetX;
            point.y = event.offsetY;
            DrawPipeline();
        }
    }
}

function HandleMouseUp() {
    mouseDown = false;
    downOnSelected = false;
    deActiveCanvas()
}

function DrawPipeline() {
    var canvas = document.getElementById('piplineCanvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (points.length > 0) {
        DrawLines();
    }
    piplines.forEach((pipline, keys) => {
        for (const key in pipline.points) {
            if (Object.hasOwnProperty.call(pipline.points, key)) {
                if(pipline.points.length > 0){
                    DrawLines();
                }
                const point = pipline.points[key];
                if(Number(keys) === selectedNumber.key && Number(key) === selectedNumber.point){
                    DrawPoint(point.x, point.y, "blue")
                }else{
                    DrawPoint(point.x, point.y, pipline.color)
                }
            }
        }
    });

}

function DrawPoint(x, y, color) {
    var canvas = document.getElementById('piplineCanvas');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, getRadians(360));
    ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.fill();
}

function DrawLines() {
    var canvas = document.getElementById('piplineCanvas');
    var ctx = canvas.getContext('2d');
    for (const key in piplines) {
        if (Object.hasOwnProperty.call(piplines, key) ) {
            const pipline = piplines[key];
            if(pipline.points.length > 0 ){
                ctx.moveTo(pipline.points[0].x, pipline.points[0].y);
                for (var i = 0; i < pipline.points.length; i++) {
                    ctx.lineTo(pipline.points[i].x, pipline.points[i].y);                
                    ctx.strokeStyle = pipline.color;
                }
            }
        }
        ctx.stroke()
        ctx.beginPath();
    }

}

function getRadians(degrees) {
    return (Math.PI / 180) * degrees;
}

let intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
        // Check if none of the lines are of length 0
          if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
              return false
          }
      
          let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
      
        // Lines are parallel
          if (denominator === 0) {
              return false
          }
      
          let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
          let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
      
        // is the intersection along the segments
          if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
              return false
          }
      
        // Return a object with the x and y coordinates of the intersection
          let x = x1 + ua * (x2 - x1)
          let y = y1 + ua * (y2 - y1)
      
          return {x, y}
}


let getCollisium = () =>{
        let allLines = getAlllines()
    for (let i = 0; i < allLines.length -1; i++) {
        for (let y = 1; y < allLines.length; y++) {
            const line1 = allLines[i];

            const line2 = allLines[y]
            let point = intersect(line1.x1, line1.y1, line1.x2, line1.y2, line2.x1, line2.y1,line2.x2, line2.y2)
            if(point.x && point.y){
                if(point.x < 0 && point.y < 0 || 
                point.x == line1.x2 && point.y == line1.y2 || 
                point.x == line2.x1 && point.y == line2.y1 || 
                point.x == line1.x1 && point.y == line1.y1 || 
                point.x == line2.x2 && point.y == line2.y2){
                    console.log('break');
                }else{
                    DrawPoint(point.x, point.y, "red")
                }
            }
        }
        
        
    }
}

let getAlllines = () => { 
    let allLines = []
    for (let i = 0; i < piplines.length; i++) { //количество иттераций от количества пайплайнов:
        for (let y = 0; y < piplines[i].points.length; y++) { //вложенные иттерации от количества поинтов в пайплайне 
            let line1 = {}
            if(piplines[i].points[y+1]){
                line1 = {x1:piplines[i].points[y].x, 
                         y1:piplines[i].points[y].y,
                         x2:piplines[i].points[y+1].x, 
                         y2:piplines[i].points[y+1].y}
                         allLines.push(line1)
            }else{
                break;
            }
        

            
        }
    }
    return allLines;
}