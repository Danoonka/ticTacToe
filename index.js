if(document.readyState === 'complete') {
    start();
}else{
    window.addEventListener('load', () => {
        start();
    });
}

function start(){
    const gameField = document.querySelector('.container');
    const reset = document.querySelector('#reset');
    const playerDisplay = document.querySelector('.display-player');
    const announcer = document.querySelector('.announcer');
    const heros = document.querySelectorAll('.avatar-icon');
    const containers = document.querySelectorAll('.avatar-container');

    let numberOfRow = 3;
    let numberOfColumns = 3;
    let currentPlayer = 'X';

    const X_win = 'X_win';
    const O_win = 'O_win';
    const tie = 'TIE';

    changeAvatar();
    initKeyListener();

    function initKeyListener() {
        let currentPosition = 0;
        let init = false
        let arrayIndex = 0;
        let innerIndex = 0;
        let oldTile = null;
        let currTile = null;

        function setActive() {
            arrayIndex = Math.trunc(currentPosition / 3);
            innerIndex = currentPosition % 3;
            currTile = document.querySelector(`#row-${innerIndex}-square-${arrayIndex}`)
            currTile.classList.add('active')
            if (!!oldTile && oldTile !== currTile) {
                deactive()
            }
            oldTile = currTile;
        }

        function deactive() {
            oldTile.classList.remove('active')
        }

        function listenKey(event) {
            if (event.key === 'ArrowLeft') {
                if (currentPosition === 0) {
                    setActive();
                    return;
                }
                currentPosition -= 1;
                setActive()
                return;
            }
            if (event.key === 'ArrowRight') {
                if (currentPosition === 8) {
                    setActive();
                    return;
                }
                currentPosition += 1
                setActive()
                return;

            }
            if (event.key === 'Enter') {
                fillGap(currentPlayer, innerIndex, arrayIndex, currTile);
                return;
            }
        }

        document.addEventListener('keyup', (event) => {
            if (init !== true) {
                setActive()
                init = true;
                return;
            }
            listenKey(event)
        })
    }

    // create field
    function createArray(){
        let gameRows = new Array(numberOfRow);
        for (let i = 0; i < numberOfRow; i++) {
            gameRows[i] = new Array(numberOfColumns);
            for (let j = 0; j < numberOfColumns; j++){
                gameRows[i][j] = '';
            }
        }return gameRows;
    }
    let gameRows = createArray();

    gameRows.forEach((gameRow, index ) => {
        const rowElem = document.createElement('div');
        rowElem.setAttribute('id', 'row-' + index)
        rowElem.className = 'table_row';
        gameRow.forEach((square, squareIndex) => {
            const squareElem = document.createElement('div');
            squareElem.addEventListener('enter', (e) => console.log(e.detail.key))
            squareElem.setAttribute('id','row-'+ index+ '-square-' + squareIndex);
            squareElem.className = 'tile';
            squareElem.addEventListener('click', function (){
                fillGap(currentPlayer, squareIndex, index);
            })
            rowElem.append(squareElem);
        })

        gameField.append(rowElem);
    })

    //button reset reload page
    reset.addEventListener('click', function(){
        window.location.reload();
    });

    //get id of tiles
    function getId() {
        let elemId = event.target.id;
        return elemId;
    }

    // fill gaps for mouse click
    function fillGap(curPlayer, index, squareIndex, curTile){
        let tile;
        if (curTile) {
            tile = curTile;
        } else {
            const curElem = getId();
            tile = document.querySelector(`#${curElem}`);
        }
        tile.dispatchEvent(new CustomEvent('enter', {
            detail: { key: 'Enter' }
        }));
        if (tile.innerText === '' && gameRows[index][squareIndex] === '') {
            gameRows[index][squareIndex] = curPlayer; //fill array gameRows
            if (curPlayer === 'X'){
                tile.innerText = 'X';
                tile.classList.add('playerX');
                currentPlayer = 'O'
                curPlayer = 'O';
            }else{
                tile.innerText = 'O';
                tile.classList.add('playerO');
                currentPlayer = 'X'
                curPlayer = 'X';
            }

            changePlayer(curPlayer);
            chekRoundRes();
        }
    }

    //check combination for wining
    function gameCombination(){
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
        }
        return false;
    }

    //get result of game to announce it
    function chekRoundRes(){
        console.log(gameCombination());
        if (gameCombination()){
            if (currentPlayer === 'X'){
                announce(O_win);
            } else{
                announce(X_win);
            }
            return;
        }

        if (!gameRows[0].includes('') && !gameRows[1].includes('') && !gameRows[2].includes('')){
            announce(tie);
        }
    }

    function announce(type){
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

    // for player changing
    function changePlayer(currentPlayer){
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    // change avatar
    function changeAvatar(){
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