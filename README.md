# HOW WAS YOUR DAY? 
내 기분과 생각을 기록해서 보는 메모장.<br>
로컬스토리지에 데이터가 저장되어 있어서 시간이 지나고 확인해도 데이터가 남아있도록 구현했다.
<br><br>
![Image](https://user-images.githubusercontent.com/22652668/234521270-921ca04d-618e-4a85-84e5-3b17104fdd58.gif)



<br><br>
## 1. setTimeout() 함수를 사용해서 간단한 스플래쉬 화면 구현.
- 이모지 배열을 `Math.random()` 함수를 이용해서 랜덤으로 표시.

```js
    randomEmotion.innerHTML = '';
    const emotions = ['🤣', '🥵', '😵‍💫', '🤯', '🤩', '🤪', '🤨', '🤓', '🤗', '🤔', '🤭', '🤫', '🤥', '🤡', '🤥', '🤫', '🤐', '🤢', '🤮', '🤧', '🥶', '🥴', '😵‍💫', '🤯', '🤠', '🥳', '🤑'];
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
```
<br><br>

## 2. 메모를 작성하는 지금 나의 기분을 기록.
- 몇 가지 기분을 배열로 만든 뒤 해당 문자열을 `id`로 받아서 화면에서 선택할 수 있도록 구현.<br>
- 추후에 선택한 기분 별로 모아 보는 기능을 추가할 예정.

```js
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
```

<br><br>

## 3. 메모 입력.
- 기본적인 돔 제어를 통해 `input` 데이터와 작성 날짜를 가져오고 `allMemo` 배열에 push하고 생성된 배열을 JSON 문자열로 변환해서 로컬스토리지에 저장.<br>
- `textarea`를 통해 가져오는 content 데이터의 경우 실제로 사용해 보니 `Enter`키가 적용되지 않는 문제를 발견하고<br>
사용하는데 불편함이 없도록 `value.trim().replace()` 메서드와 정규표현식을 이용해서 인식되도록 서비스를 개선.

```js
function saveMemo() {
    const set = document.querySelector('#set');
    const title = set.querySelector('#title');
    const saveTitle = set.querySelector("#title").value;
    const content = set.querySelector('#content');
    const saveContent = content.value.trim().replace(/\n/g, '<br>');
    const saveEmotion = set.querySelector('input[type=radio]:checked').value;
    const saveLength = allMemo.length;
    const currentDate = new Date();
    const saveDate = `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.${currentDate.getDate()}`;

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
```


<br><br>

![Image](https://user-images.githubusercontent.com/22652668/234521354-dbeb17d1-cdf7-4324-abda-bafcf06da31e.gif)


<br><br>

## 4. 메모 수정 및 삭제.
- `allMemo` 배열의 index와 동일한 `saveLength`라는 변수를 버튼에 class로 순차적으로 적용해서 수정 및 삭제하는 제어가 가능하도록 구현.


```js
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
```

<br><br>

## 5. 메모 데이터 최적화.
- 사용자가 메모를 확인할 때 편의성을 높이기 위해서 최신 메모 데이터가 가장 위로 오도록 prepend()를 사용,
- 메모데이터는 `createDocumentFragment()` 를 사용해서 메인 돔트리에서 분리해서 메모리를 절약하기 위한 시도를 실행.

```js
function getMemo() {
    const display = document.querySelector('#display');
    display.innerHTML = '';
    const frag = document.createDocumentFragment();

    allMemo.forEach(item => {

        // code ...

        frag.prepend(memoListItem);
        memoListItem.append(memoEmotion, memoTitle, memoContent, memoDelete, memoEdit, memoDate);
    }

    display.append(frag);
};
```

<br><br>

## 참조
- https://toss.im/tossface
- https://campaign.naver.com/nanumsquare_neo/#introduce
