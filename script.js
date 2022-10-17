class TicTacToe {
  constructor() {
      this.gameField = document.querySelector('.container');
      this.reset = document.querySelector('#reset');
      this.playerDisplay = document.querySelector('.display-player');
      this.announcer = document.querySelector('.announcer');
      this.heros = document.querySelectorAll('.avatar-icon');
      this.containers = document.querySelectorAll('.avatar-container');
      this.gameRows = [
          ['','',''],
          ['','',''],
          ['','','']
      ];
      this.curTile = null;
      this.currentPlayer = 'X';

      this.X_win = 'X_win';
      this.O_win = 'O_win';
      this.tie = 'TIE';
  }

    InitKeyListener(currTile){
        let currentPosition = 0;
        let init = false
        let arrayIndex = 0;
        let innerIndex = 0;
        let oldTile = null;

        document.addEventListener('keyup', (event) => {
            if (init !== true) {
                this.SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition)
                init = true;
                return;
            }
            this.ListenKey(event, arrayIndex, innerIndex, currTile, oldTile, currentPosition)
        })
    }

    Deactive(el) {
        el.classList.remove('active')
    }

    SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition) {
        arrayIndex = Math.trunc(currentPosition / 3);
        innerIndex = currentPosition % 3;
        currTile = document.querySelector(`#row-${innerIndex}-square-${arrayIndex}`)
        currTile.classList.add('active')
        if (!!oldTile && oldTile !== currTile) {
            this.Deactive(oldTile)
        }
        oldTile = currTile;
    }

    ListenKey(event, arrayIndex, innerIndex, currTile, oldTile, currentPosition, currentPlayer,gameRows, curTile,
              squareIndex, index, curPlayer, playerDisplay, O_win, X_win, tie, announcer){
        if (event.key === 'ArrowLeft') {
            if (currentPosition === 0) {
                this.SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition);
                return;
            }
            currentPosition -= 1;
            this.SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition);
            return;
        }
        if (event.key === 'ArrowRight') {
            if (currentPosition === 8) {
                this.SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition);
                return;
            }
            currentPosition += 1
            this.SetActive(arrayIndex, innerIndex, currTile, oldTile, currentPosition)
            return;
        }
        if (event.key === 'Enter') {
            this.FillGap(this.currentPlayer, index, squareIndex, curTile,  gameRows, playerDisplay, O_win, X_win,
                tie, announcer);
        }
    }

    FillTile(gameRows, gameField, curTile, playerDisplay, O_win, X_win, tie, announcer){
      console.log(gameRows)
        gameRows.forEach((gameRow, index ) => {
            const rowElem = document.createElement('div');
            rowElem.setAttribute('id', 'row-' + index)
            rowElem.className = 'table_row';
            gameRow.forEach((square, squareIndex) => {
                const squareElem = document.createElement('div');
                squareElem.addEventListener('enter', (e) => console.log(e.detail.key))
                squareElem.setAttribute('id','row-'+ index+ '-square-' + squareIndex);
                squareElem.className = 'tile';
                squareElem.addEventListener('click',  () => {
                    this.FillGap(this.currentPlayer, index, squareIndex, curTile, gameRows, playerDisplay,
                        O_win, X_win, tie, announcer);
                })
                rowElem.append(squareElem);
            })
            gameField.append(rowElem);
        })
    }

    GetId() {
        return event.target.id;
    }

    FillGap(curPlayer, index, squareIndex, curTile, gameRows, playerDisplay, O_win, X_win, tie,
            announcer){
        let tile;
        if (curTile) {
            tile = curTile;
        } else {
            const curElem = this.GetId();
            tile = document.querySelector(`#${curElem}`);
        }
        tile.dispatchEvent(new CustomEvent('enter', {
            detail: { key: 'Enter' }
        }));
        if (tile.innerText === '' && gameRows[index][squareIndex] === '') {
            gameRows[index][squareIndex] = curPlayer;
            console.log(curPlayer)//fill array gameRows
            if (curPlayer === 'X'){
                tile.innerText = 'X';
                tile.classList.add('playerX');
                this.currentPlayer = 'O'
                curPlayer = 'O';
            }else{
                tile.innerText = 'O';
                tile.classList.add('playerO');
                this.currentPlayer = 'X'
                curPlayer = 'X';
            }

            this.ChangePlayer(curPlayer, playerDisplay);
            this.ChekRoundRes(gameRows, curPlayer, O_win, X_win, tie, announcer);
        }
    }

    GameCombination(gameRows){
        for(let i = 0; i < 3; i++){
            if (gameRows[i][0] !== ''&& gameRows[i][0] === gameRows[i][1] && gameRows[i][1] === gameRows[i][2]){
                return true;
            }else if(gameRows[0][i] !== '' && gameRows[0][i] ===gameRows[1][i] && gameRows[1][i] === gameRows[2][i]) {
                return true;
            }
        }
        if (gameRows[1][1] !== ''){
            if (gameRows[0][0] === gameRows[1][1] && gameRows[1][1] === gameRows[2][2]){
                return true;
            }else if(gameRows[0][2] === gameRows[1][1] && gameRows[1][1] === gameRows[2][0]) {
                return true;
            }
        }return false;
    }

    ChekRoundRes(gameRows, currentPlayer, O_win, X_win, tie, announcer){
        console.log(this.GameCombination(gameRows));
        if (this.GameCombination(gameRows)){
            if (currentPlayer === 'X'){
                this.Announce(O_win, O_win, X_win, announcer, tie);
            } else{
                this.Announce(X_win, O_win, X_win, announcer, tie);
            }return;
        }

        if (!gameRows[0].includes('') &&
            !gameRows[1].includes('') &&
            !gameRows[2].includes('')){
            this.Announce(tie, O_win, X_win, announcer, tie);
        }
    }

    Announce(type, O_win, X_win, announcer, tie){
        switch(type){
            case O_win:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case X_win:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case tie:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    }

    ChangePlayer(currentPlayer, playerDisplay){
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    ChangeAvatar(heros, containers){
        heros.forEach(hero => {
            hero.onmousedown = function(e) {
                containers.forEach((container) => {
                    if (!container.hasChildNodes()){
                        hero.style.position = 'absolute';
                        moveAt(e);
                        container.appendChild(hero);
                        hero.style.zIndex = 1000;
                        document.onmousemove = function(e) {
                            moveAt(e);
                        }
                        hero.onmouseup = function() {
                            document.onmousemove = null;
                            hero.onmouseup = null;
                        }
                    }
                })
                function moveAt(e) {
                    hero.style.left = e.pageX - hero.offsetWidth / 2 + 'px';
                    hero.style.top = e.pageY - hero.offsetHeight / 2 + 'px';
                }
            }
        })
    }
}

if(document.readyState === 'complete') {go()}else{
    window.addEventListener('load', () => {go()});
}

function go(){
    let start = new TicTacToe();
    start.reset.addEventListener('click', function(){
        window.location.reload();
    });
    start.ChangeAvatar(start.heros, start.containers);
    start.InitKeyListener();
    start.FillTile(start.gameRows, start.gameField, start.curTile,
        start.playerDisplay, start.O_win, start.X_win, start.tie, start.announcer)
}

