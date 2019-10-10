import React from 'react';
import './App.css';
import SudokuView from "./component/SudokuView";

const sudoku_test = [
    [0,7,6,0,1,0,0,4,3],
    [0,0,0,7,0,2,9,0,0],
    [0,9,0,0,0,6,0,0,0],
    [0,0,0,0,6,3,2,0,4],
    [4,6,0,0,0,0,0,1,9],
    [1,0,5,4,2,0,0,0,0],
    [0,0,0,2,0,0,0,9,0],
    [0,0,4,8,0,7,0,0,1],
    [9,1,0,0,5,0,7,2,0],
];

const default_test = [
    [false, true , true , false, true , false, false, true , true ],
    [false, false, false, true , false, true , true , false, false],
    [false, true , false, false, false, true , false, false, false],
    [false, false, false, false, true , true , true , false, true ],
    [true , true , false, false, false, false, false, true , true ],
    [true , false, true , true , true , false, false, false, false],
    [false, false, false, true , false, false, false, true , false],
    [false, false, true , true , false, true , false, false, true ],
    [true , true , false, false , true, false, true , true , false]
];

function App() {
    const [sudoku, changeSudoku] = React.useState(sudoku_test);
    const [defaultGrid, changeDefault] = React.useState(default_test);

    const [forcedSudoku, changeForcedSudoku] = React.useState(sudoku_test);

    const changeState = ({ sudoku, defaultGrid }) => {
        if(sudoku){
            changeSudoku(sudoku);
            changeForcedSudoku(sudoku);
        }
        if(defaultGrid)changeDefault(defaultGrid);
    };

    const verifySection = ( section ) => {
        const sum = section.map(n => Math.pow(2, n - 1)).reduce((a,n) => a+n);

        return sum === 511;
    };

    const getSection = (grid,x,y) => {
        const section = [];

        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                section.push(grid[x*3 + i][y*3 + j]);

        return section;
    };

    const verifySudoku = ( grid ) => {
        const verifiedRows = grid.reduce((acc,obj) => acc && verifySection(obj),true);
        const column = [[],[],[],[],[],[],[],[],[]];
        for(const i in grid)
            for(const j in grid[i])
                column[j].push(grid[i][j]);
        const verifiedColumns = column.reduce((acc,obj) => acc && verifySection(obj),true);
        const sections = [  getSection(grid,0,0),getSection(grid,0,1),getSection(grid,0,2),
            getSection(grid,1,0),getSection(grid,1,1),getSection(grid,1,2),
            getSection(grid,2,0),getSection(grid,2,1),getSection(grid,2,2)];
        const verifiedSections = sections.reduce((acc,obj) => acc && verifySection(obj),true);

        return verifiedRows && verifiedColumns && verifiedSections;
    };

    const nextValues = (values, candidates, index = values.length - 1) => {

        if(values[index] === candidates[index].length - 1)values = nextValues(values,candidates,index - 1);
        values[index] = (values[index] + 1) % candidates[index].length;

        return values;
    };

    const getCandidates = (grid, x, y) => {
        const initialCandidates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

        for(let i=0; i<9; i++)
            initialCandidates[ grid[x][i] ] = 0;

        for(let j=0; j<9; j++)
            initialCandidates[ grid[j][y] ] = 0;

        for(let z0=0; z0<3; z0++) {
            for (let z1 = 0; z1 < 3; z1++) {
                initialCandidates[grid[3 * (x - (x % 3)) / 3 + z0][3 * (y - (y % 3)) / 3 + z1]] = 0;
            }
        }

        return initialCandidates.filter(obj => (obj !== 0));
    }

    const solve_force_visual = ( grid, defaultMap ) => {
        let candidatesByValue = [];
        let valuesToForce = [];

        let need_brute_force = false;
        const testgrid = JSON.parse(JSON.stringify(grid));
        const defaultGrip = JSON.parse(JSON.stringify(defaultMap));

        while(!need_brute_force) {
            candidatesByValue = [];
            valuesToForce = [];

            for(let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {

                    if (!defaultGrip[i][j]){
                        candidatesByValue.push(getCandidates(testgrid, i, j));
                        valuesToForce.push(0);
                    }
                }
            }

            if(candidatesByValue.filter(obj => obj.length <= 1).length > 0){
                let count = 0;
                for (let i = 0; i < 9; i++){
                    for (let j = 0; j < 9; j++) {
                        if (!defaultGrip[i][j]) {
                            if(candidatesByValue[count].length <= 1) {
                                testgrid[i][j] = candidatesByValue[count][0];
                                defaultGrip[i][j] = true;
                            }
                            count++;
                        }
                    }
                }
            }
            else{ need_brute_force = true; }
        }

        ////////////////////////////////////////////
        ////////// HARD BRUTE FORCE ////////////////
        /////////// TO IMPLEMENTED /////////////////
        ////////////////////////////////////////////

/*
        let first = true;
        const possibilities = candidatesByValue.reduce((a,n) => a*n.length, 1);
        let tried = 0;

        while ( !verifySudoku(testgrid) ) {
            if (!first) valuesToForce = nextValues(valuesToForce, candidatesByValue);
            else first = false;

            //  console.log("Starting force 1");
            //
            //  const valuesAsInt = ( valuesToForce.join("") );
            //  const newValue = valuesAsInt + 1;
            //
            //  console.log("raw (new)",newValue);
            //
            //  valuesToForce = newValue.match(/.{1,1}/g).map(obj => parseInt(obj));
            //
            //  console.log("To force(new)",valuesToForce);
            //
            //  let index = valuesToForce.findIndex((obj) => obj === 0);
            //  console.log(index);
            //  while(index !== -1){
            //      valuesToForce[index] = 1;
            //      index = valuesToForce.findIndex((obj) => obj === 0);
            //  }

            let count = 0;
            for (let i = 0; i < 9; i++){
                for (let j = 0; j < 9; j++) {
                    if (!defaultMap[i][j]) {
                        testgrid[i][j] = candidatesByValue[count][valuesToForce[count]];
                        count++;
                    }
                }
            }

            tried++;
            console.log(tried,possibilities);
        }*/

        return testgrid;
    };

    const handleBrutForce = () => {
        changeForcedSudoku(solve_force_visual(sudoku,defaultGrid,changeForcedSudoku));
    };

    return (
        <div className="App">
            <div className="App-container">
                <div>
                    <SudokuView sudoku={sudoku} saveCallback={changeState} isCustomisable/>
                </div>
                <div>
                    <SudokuView sudoku={forcedSudoku} defaultMap={defaultGrid} custom-unsolved={(!verifySudoku(forcedSudoku)).toString()}/>
                    <button onClick={handleBrutForce}>Force</button>
                </div>
            </div>
        </div>
    );
}

export default App;
