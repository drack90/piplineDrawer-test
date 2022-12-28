import React, { Component } from 'react'
import './css/canvasBoard.css'

export class CanvasBoard extends Component{
    static displayName = CanvasBoard.name;

    render() {
        return (
            <div className="canvasBoard__componen">
                <button className="btn btn-primary"> Добавить новый трубопровод </button>
                <button className="btn btn-success"> Добавить узел </button>
                <button className="btn btn-danger"> Удалить узел </button>
            </div>
        );  
    }
}