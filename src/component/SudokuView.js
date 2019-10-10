import React from 'react';
import CellView from "./CellView";

const _sudoku = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
];

const _default = [
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false]
];



function SudokuView({ sudoku=_sudoku, defaultMap = _default, isCustomisable=false, saveCallback, ...props }) {
    const [grid,changeGrid] = React.useState(sudoku);

    const save = () => {
        const defaultGrid = [];

        for(const row  of grid){
            defaultGrid.push([]);
            for(const cell of row)
                defaultGrid[defaultGrid.length - 1].push( (cell !== 0) );
        }

        if(saveCallback)saveCallback({ sudoku: grid, defaultGrid })
    };

    const changeCellValueHandle = (row,cell) => {
        return (value) => {
            const grid_cpy = JSON.parse(JSON.stringify(grid));
            grid_cpy[row][cell] = value;
            changeGrid(grid_cpy);
        }
    };

    return (
        <div className="SudokuView" {...props}>
            {(isCustomisable ? grid : sudoku).map((row,rowIndex) =>
                <div className={"Row"} key={"row_" + rowIndex}>
                    {row.map((cell,cellIndex) =>
                        <CellView key={"Cell_"+ rowIndex + "_" + cellIndex} changeValueCallback={changeCellValueHandle(rowIndex,cellIndex)} value={cell} isDefault={defaultMap[rowIndex][cellIndex] && !isCustomisable} isCustomisable={isCustomisable && !defaultMap[rowIndex][cellIndex]}/>
                    )}
                </div>
            )}
            {isCustomisable && <button onClick={save}>Save</button>}
        </div>
    );
}

export default SudokuView;
