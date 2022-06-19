
const App = new PIXI.Application()
document.body.appendChild(App.view)
App.view.addEventListener('contextmenu', (e) => { e.preventDefault(); });


class RenjuBoard extends PIXI.Sprite {
    noneFunction = function() {}

    constructor() {
        let texture = PIXI.Texture.from("./images/renjuBoard.png");
        super(texture);
		this.interactive = true;
		this.on("pointerdown", this.onClicked);
		this.on("pointermove", this.onMove);
        this.initalize();
    }
	
    initalize() {
        this.map = new Array(15).fill(0).map(a => new Uint8Array(15)); // 15x15 사이즈 배열
		this.pieces = [];
		this.piecesIndex = 0; // 지금 넣을 요소의 인덱스
        this.phase = 'none'
        this.LeftCallback = this.noneFunction;

        this.cursor = new PIXI.Sprite.from("./images/cursor.png");
        this.addChild(this.cursor);
    }
	
    getMap() {
        return this.map;
    }

    getCell(x, y) {
        if (0 <= x && x < 15 && 0 <= y && y < 15) {
            return this.map[y][x]
        }
        return undefined;
    }

    setPhase(phase) {
        this.phase = phase;
    }

    getPhase() {
        return this.phase;
    }

    setCallback(func) {
        this.LeftCallback = func;
    }

	setPiece(color, x, y) {
		let piece = new RenjuPiece(color, x, y);

        //while (this.pieces.length > this.piecesIndex) {
        //    this.removeChild(this.pieces.pop()); // 수를 물러서 뒤로 간 만큼 지운다
        //}

        this.pieces[this.piecesIndex] = piece;
        this.piecesIndex++;
        this.map[y][x] = color;
        
		this.addChild(piece);
	}
	
	onClicked = ie => {
		switch(ie.data.button) {
			case 0:
				this.onLeftClick(ie);
				break;
			case 1:
				//this.redo(ie);
				break;
			case 2:
				//this.undo(ie);
				break;
				
		}
		

	}
	
    onLeftClick(interactionEvent) {
        if (this.phase == 'black' || this.phase == 'white') {
            const pos = interactionEvent.data.getLocalPosition(this);
            const x = Math.max(Math.min(Math.floor(pos.x / 32), 14), 0);
            const y = Math.max(Math.min(Math.floor(pos.y / 32), 14), 0);
            this.LeftCallback(x, y);
        }
    }
    
    onMove(interactionEvent) {
        if (this.phase == 'black' || this.phase == 'white') {
            const pos = interactionEvent.data.getLocalPosition(this);
            const x = Math.max(Math.min(Math.floor(pos.x / 32), 14), 0);
            const y = Math.max(Math.min(Math.floor(pos.y / 32), 14), 0);
            this.cursor.x = x * 32
            this.cursor.y = y * 32
        }
    }

	dropPiece(ie) { // no use
        if (this.phase == 'black' || this.phase == 'white') {
            const pos = ie.data.getLocalPosition(this);
            const x = Math.max(Math.min(Math.floor(pos.x / 32), 14), 0);
            const y = Math.max(Math.min(Math.floor(pos.y / 32), 14), 0);
            const color = (this.phase == 'black') ? RenjuManager.BLACK : RenjuManager.WHITE;
            this.setPiece(color, x, y);
            this.dropCallback(ie);
        }

	}
	
	undo(ie) {
		if (this.piecesIndex - 1 >= 0) {
			this.pieces[this.piecesIndex - 1].visible = false;
			this.piecesIndex--;
		}
	}
	
	redo(ie) {
		if (this.pieces.length > this.piecesIndex) {
			this.pieces[this.piecesIndex].visible = true;
			this.piecesIndex++;
		}
	}
}

class RenjuPiece extends PIXI.Sprite {
    static pieceTextures = [0, PIXI.Texture.from("./images/renjuBlack.png"), PIXI.Texture.from("./images/renjuWhite.png")]
	
    constructor(color, x, y) {
        super();
        this.initalize(color, x, y);
    }
	
    initalize(color, x, y) {
        this.texture = RenjuPiece.pieceTextures?.[color] ?? this.pieceTextures[0];
        this.x = x * 32;
        this.y = y * 32;
    }

}

class RenjuPlayer {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
}


class RenjuManager {
	static BLACK = 1;
	static WHITE = 2;
	
    constructor() {
        this.phase = RenjuManager.BLACK;

        this.audioManger = new AudioManager();

        this.renjuBoard = new RenjuBoard();
        this.renjuBoard.setPhase('black')
        this.renjuBoard.setCallback(this.onBoardleftClick.bind(this))

        App.stage.addChild(this.renjuBoard);
    }

    onBoardleftClick(x, y) {
        this.audioManger.playBgm(); // 하나 둔 이후에야 BGM 시작
        this.drop(x, y);
    }

    drop(x, y) {
        if (this.canDrop(x, y)) {
            this.renjuBoard.setPiece(this.phase, x, y);
            this.audioManger.playHit();
            this.checkWin();
            this.changeTurn();
        }
    }

    checkWin() {
        const win = this.find5();
        if (win == RenjuManager.BLACK || win == RenjuManager.WHITE) {
            alert(`${win == RenjuManager.BLACK? '흑': '백'}승`);
            this.phase = 'none';
            this.renjuBoard.setPhase('none');
        }

    }

    canDrop(x, y) {
        return this.isEmpty(x, y) && !this.isRestricted(x, y);
    }

    isEmpty(x, y) {
        return this.renjuBoard.getCell(x, y) == 0;
    }

    isRestricted(x, y) {
        if (this.phase == RenjuManager.WHITE) return false;
        return this.is33(x, y);
    }

    is33(x, y) {
        return false;
    }
    
    find5() {
        const map = this.renjuBoard.getCell.bind(this.renjuBoard);
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                if (!map(x, y)) continue;
                if (this.checkAllEqual(map(x, y), map(x, y+1), map(x, y+2), map(x, y+3), map(x, y+4)) || // 가로
                     this.checkAllEqual(map(x, y), map(x+1, y), map(x+2, y), map(x+3, y), map(x+4, y)) || // 세로
                      this.checkAllEqual(map(x, y), map(x+1, y+1), map(x+2, y+2), map(x+3, y+3), map(x+4, y+4)) || // ↘대각선
                       this.checkAllEqual(map(x, y), map(x-1, y+1), map(x-2, y+2), map(x-3, y+3), map(x-4, y+4))) { // ↙대각선
                    return map(x, y);
                }
            }
        }
        return 0;
    }

    changeTurn() {
        if (this.phase == RenjuManager.BLACK) {
            this.phase = RenjuManager.WHITE;
            this.renjuBoard.setPhase('white')
        } else if (this.phase == RenjuManager.WHITE) {
            this.phase = RenjuManager.BLACK;
            this.renjuBoard.setPhase('black')
        }
    }

    checkAllEqual() {
        const arr = Array.from(arguments);
        if (arr.length < 2) return true;
        const base = arr[0];
        return arr.reduce((p, c) => p && (c == base), true);
    }
}


class AudioManager {
    constructor() {
        this.bgm = new Audio('./audios/n57.mp3')
        this.bgm.addEventListener('ended', function() {
            this.currentTile = 0;
            this.play();
        });
        this.hit = new Audio('./audios/placement.mp3');
        this.bgmPlayed = false;
    }

    playBgm() {
        if (this.bgmPlayed) return;
        this.bgm.play();
        this.bgmPlayed = true;
    }

    playHit() {
        this.hit.play();
    }
}



const renjuManager = new RenjuManager();


