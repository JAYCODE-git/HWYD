// * splash 3초 보여준 후에 main으로 이동
function splash() {
    const main = document.querySelector('main');
    const splash = document.querySelector('.splash');
    const randomEmotion = splash.querySelector('.splash p');
    const emotions = ['🤣', '🥵', '😵‍💫', '🤯', '🤩', '🤪', '🤨', '🤓', '🤗', '🤔', '🤭', '🤫', '🤥', '🤡', '🤥', '🤫', '🤐', '🤢', '🤮', '🤧', '🥶', '🥴', '😵‍💫', '🤯', '🤠', '🥳', '🤑'];

    // splash 화면 보여주기
    splash.style.transition = 'opacity 5s ease-in-out';
    setTimeout(() => {
        splash.classList.add('hide');
        main.classList.remove('hide');
        main.classList.add('show');
    }, 3000);

    // splash에 랜덤 이모티콘 3개 표시
    randomEmotion.innerHTML = '';
    const getEmotion = setInterval(() => {
        const emotionsArr = [];
        while (emotionsArr.length < 3) {
            const num = emotions[parseInt(Math.random() * emotions.length)];
            if (emotionsArr.indexOf(num) === -1) {
                emotionsArr.push(num);
            }
        }
        randomEmotion.innerHTML = emotionsArr.join('');
    }, 200);
    setTimeout(() => {
        clearInterval(getEmotion);
    }, 10000);
}
splash();



// * LocalStorage 데이터 Parsing
let allMemo = JSON.parse(localStorage.getItem("allMemo"));
allMemo = allMemo ?? [];
getMemo();



// * Emotion 선택
function setEmotion() {
    const allEmotion = ['Awesome', 'Happy', 'Sad', 'Angry', 'Bored', 'Tired']
    const selectEmotion = document.querySelector('.select-emotion');
    allEmotion.forEach(item => {
        const emoInput = document.createElement('input');
        const emoLabel = document.createElement('label');

        emoInput.setAttribute('type', 'radio');
        emoInput.setAttribute('name', 'Emotions');
        emoInput.setAttribute('id', item);
        emoInput.setAttribute('value', item);
        emoLabel.setAttribute('for', item);
        emoLabel.textContent = item;

        selectEmotion.appendChild(emoInput);
        selectEmotion.appendChild(emoLabel);
    });
    const firstInp = document.querySelector('input[type=radio]:first-of-type');
    firstInp.setAttribute('checked', '');
}
setEmotion()



// * 메모 저장
function saveMemo() {
    const set = document.querySelector('#set');
    const title = set.querySelector('#title');
    const saveEmotion = set.querySelector('input[type=radio]:checked').value;
    const saveTitle = set.querySelector("#title").value;
    const content = set.querySelector('#content');

    // 'Enter'키 인식
    const saveContent = content.value.trim().replace(/\n/g, '<br>');
    // 작성일 자동 표기
    const currentDate = new Date();
    const saveDate = `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.${currentDate.getDate()}`;
    const saveLength = allMemo.length;

    if (saveTitle !== '' && saveContent) {
        allMemo.push({ saveEmotion, saveTitle, saveContent, saveLength, saveDate });
        localStorage.setItem('allMemo', JSON.stringify(allMemo));
        getMemo()
    } else {
        alert('✏️ 메모를 입력해주세요')
    }

    title.value = '';
    content.value = '';
}



// * 메모 표시
function getMemo() {
    const display = document.querySelector('#display');
    display.innerHTML = '';

    // 성능 향상을 위해 DocumentFragment() 사용
    const frag = document.createDocumentFragment();

    allMemo.forEach(item => {
        const memoListItem = document.createElement('article');
        const memoEmotion = document.createElement('span');
        const memoTitle = document.createElement('h2');
        const memoContent = document.createElement('p');
        const memoDate = document.createElement('time');
        const memoDelete = document.createElement('button');
        const memoEdit = document.createElement('button');

        memoTitle.textContent = item.saveTitle;
        memoDate.textContent = item.saveDate;
        // 정규표현식 사용을 위해 innerHTML 사용
        memoContent.innerHTML = item.saveContent;
        memoEmotion.classList = item.saveEmotion;
        memoDelete.textContent = '삭제';
        memoEdit.textContent = '수정';

        memoDelete.setAttribute("class", 'del-' + item.saveLength);
        memoDelete.setAttribute('onclick', 'removeMemo()');
        memoEdit.setAttribute("class", 'edit-' + item.saveLength);
        memoEdit.setAttribute('onclick', 'editMemo()');

        // 최근 작성한 메모가 위로 오도록 prepend()
        frag.prepend(memoListItem);
        memoListItem.append(memoEmotion, memoTitle, memoContent, memoDelete, memoEdit, memoDate);
    });
    display.append(frag);
}


// * 메모 수정
function editMemo() {
    const editIdx = event.srcElement.className.slice(5);
    const memo = allMemo.find(item => item.saveLength == editIdx);
    if (memo) {
        const title = document.querySelector('#title');
        const content = document.querySelector('#content');
        const saveEmotion = memo.saveEmotion;

        title.value = memo.saveTitle;
        content.value = memo.saveContent;
        document.querySelector('input[type=radio][value="' + saveEmotion + '"]').checked = true;

        allMemo.splice(allMemo.findIndex(item => item.saveLength == editIdx), 1);
        localStorage.setItem("allMemo", JSON.stringify(allMemo));
        getMemo();
    }
}



// * 메모 삭제
function removeMemo() {
    const deleteIdx = allMemo.find(
        (item) => item.saveLength == event.srcElement.className.slice(4)
    );
    if (deleteIdx) {
        allMemo.splice(
            allMemo.findIndex((item) => item.saveLength == deleteIdx.saveLength),
            1
        );
    }
    // JSON.stringify()로 문자열로 변환 후 localStorage에 저장
    localStorage.setItem("allMemo", JSON.stringify(allMemo));
    getMemo();
}