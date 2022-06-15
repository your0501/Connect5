

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#DCB35C';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = '#000';

for (let i = 0; i < 15; i++) {
    ctx.fillRect(32 * i + 16, 16, 2, canvas.height - 32 + 2);
}
for (let i = 0; i < 15; i++) {
    ctx.fillRect(16, 32 * i + 16, canvas.width - 32 + 2, 2);
}

ctx.fillStyle = '#000';
ctx.arc(canvas.width / 2 + 1, canvas.height / 2 + 1, 4, 0, 2 * Math.PI);
ctx.fill();
ctx.closePath();


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
    drop(i, j, color);
    check_win();
}

document.getElementById('button').addEventListener('click', step);
document.getElementById('myCanvas').addEventListener('click', click);


// map 배열에서 같은 숫자가 가로, 세로, 대각선으로 5개 나열되어있는지 확인하는 함수
function connect5() {
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if (map[i]?.[j] === 0) continue;
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
