
const App = new PIXI.Application()
document.body.appendChild(App.view)

class RenjuBoard extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from("./assets/renjuBoard.png");
        super(texture);
        this.initalize();
    }
    initalize() {
        this.map = new Array(15).fill(0).map(a => new Uint8Array(15)); // 15x15 사이즈 배열

    }
}

class RenjuPiece extends PIXI.Sprite {
    pieceTextures = [PIXI.Texture.from("./assets/renjuBlack.png"), PIXI.Texture.from("./assets/renjuWhite.png")]
    constructor(color, x, y) {
        super();
        this.initalize(color, x, y);
    }
    initalize(color, x, y) {
        this.texture = this.pieceTextures?.[color] ?? this.pieceTextures[0];
        this.x = x * 32;
        this.y = y * 32;
    }
    s() {
        this.rotation += Math.random() / 2;
        this.x += Math.random();
        this.y += Math.random();
        this.x -= Math.random();
        this.y -= Math.random();

    }
}

class RenjuPlayer {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
}

class Input {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.cursor = new PIXI.Sprite.from("./assets/cursor.png");
        App.stage.addChild(this.cursor);
    }

    _mouse_move = (e) => {
        let x = Math.max(Math.min(Math.floor(e.offsetX / 32), 14), 0);
        let y = Math.max(Math.min(Math.floor(e.offsetY / 32), 14), 0);
        this.cursor.x = x * 32;
        this.cursor.y = y * 32;
    }

}

class RenjuManager {
    constructor() {
        this.turn = 'black'
    }
}

const renjuBoard = new RenjuBoard();
App.stage.addChild(renjuBoard)
const input = new Input();
document.addEventListener('mousemove', input._mouse_move)
 
const map = new Array(15).fill(0).map(() => new Array(15).fill(0));


let color = 0;
let turn = 0;


function step(f=false, ft=0) {
    const iss = ([].concat(...map)).reduce((acc, cur, i) => { if (cur === 0) acc.push(i); return acc; }, []);
    
    const r = iss[Math.floor(Math.random() * iss.length)];
    let x = r % 15;
    let y = Math.floor(r / 15);

    if (turn === 0) {
        x = 7
        y = 7
    }


    map[y][x] = 1 + color;
    ctx.fillStyle = color === 0 ? '#000' : '#FFF';
    console.log(iss, r, x, y);
    ctx.beginPath();
    ctx.arc(x * 32 + 16, y * 32 + 16, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    color = 1 - color;

    if (f === true) {
        color = ft
    }
    let c = connect5();
    switch(c) {
        case 1:
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('흑 승리', canvas.width / 2 - 50, canvas.height / 2);
            break;
        case 2:
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('백 승리', canvas.width / 2 - 50, canvas.height / 2);
            break;
    }

    turn++;
} 


function check_win() {
    let c = connect5();
    switch(c) {
        case 1:
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('흑 승리', canvas.width / 2 - 50, canvas.height / 2);
            break;
        case 2:
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('백 승리', canvas.width / 2 - 50, canvas.height / 2);
            break;
    }
}

function drop(x, y, color) {
    map[y][x] = 1 + color;

    ctx.fillStyle = color === 0 ? '#000' : '#FFF';

    ctx.beginPath();
    ctx.arc(x * 32 + 16, y * 32 + 16, 15, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();

    color = 1 - color;

    turn++;
} 


function click(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    const i = Math.floor((x) / 32);
    const j = Math.floor((y) / 32);
    if (i < 0 || i > 14 || j < 0 || j > 14) return;
    if (map[j][i] !== 0) return;
    const color = turn % 2;
    if (samsamRestrict(i, j)) { 
        console.log("삼삼")
    } else {
        drop(i, j, color);
        check_win();
    }


}


// map 배열에서 같은 숫자가 가로, 세로, 대각선으로 5개 나열되어있는지 확인하는 함수
function connect5() {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (!map[i]?.[j]) continue;
            if (map[i]?.[j] === map[i]?.[j + 1] && map[i]?.[j] === map[i]?.[j + 2] && map[i]?.[j] === map[i]?.[j + 3] && map[i]?.[j] === map[i]?.[j + 4]) {
                return map[i]?.[j];
            }
            if (map[i]?.[j] === map[i + 1]?.[j] && map[i]?.[j] === map[i + 2]?.[j] && map[i]?.[j] === map[i + 3]?.[j] && map[i]?.[j] === map[i + 4]?.[j]) {
                return map[i]?.[j];
            }
            if (map[i]?.[j] === map[i + 1]?.[j + 1] && map[i]?.[j] === map[i + 2]?.[j + 2] && map[i]?.[j] === map[i + 3]?.[j + 3] && map[i]?.[j] === map[i + 4]?.[j + 4]) {
                return map[i]?.[j];
            }
            if (map[i]?.[j] === map[i - 1]?.[j + 1] && map[i]?.[j] === map[i - 2]?.[j + 2] && map[i]?.[j] === map[i - 3]?.[j + 3] && map[i]?.[j] === map[i - 4]?.[j + 4]) {
                return map[i]?.[j];
            }
        }
    }
    return 0;
}

// map에서 열린삼을 확인한다.
const openSamList = ["01110", "011010", "010110"];
function findOpenSam(color) {
    let samCount = 0;
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {

            for (let sam of openSamList) { // 패턴으로 열린삼 찾기
                let pattern = sam.split("").map(a => parseInt(a));

                for (let dir of [[1, 0], [0, 1], [1, 1], [-1, 1]]) {
                    let valid = pattern.reduce((prevReturn, currValue, index) => {
                        if (currValue == map[i + index * dir[0]]?.[j + index * dir[1]] && prevReturn) {
                            return true;
                        }
                        return false;
                    }, true);
                    if (valid) {
                        samCount += 1;
                    };
                }

            }
            
        }
    }
    console.log("흑의 열린 3 갯수: ", samCount)
    return samCount;
}

function samsamRestrict(x, y) {
    const currSamCount = findOpenSam();
    if (currSamCount > 0) return false;
    map[x][y] = 1;
    const nextSamCount = findOpenSam();
    map[x][y] = 0;
    if (nextSamCount > currSamCount + 1) {
        return true
    };
    return false;
}