// collect DOMs
const display = document.querySelector('.display')
const controllerWrapper = document.querySelector('.controllers')

const State = ['Initial', 'Record', 'Download']
let stateIndex = 0
let mediaRecorder, chunks = [], audioURL = ''

// mediaRecorder setup for audio


if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){//미디어디바이스를 감지하거나, 미디어입력을 실행할 때
    console.log('mediaDevices supported..')//미디어 장치가 지원된다는 메시지가 뜸.

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream => {
        mediaRecorder = new MediaRecorder(stream) //MediaRecorder 미디어를 쉽게 녹음할 수 있는 기능을 제공합니다

        mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data) //chunks 에 e저장.
        }

        mediaRecorder.onstop = () => { //기록이 중지되면 url로 저장하여 chunks배열에 할당.
            const blob = new Blob(chunks, {'type': 'audio/ogg; codecs=opus'})
            chunks = []
            audioURL = window.URL.createObjectURL(blob)
            document.querySelector('audio').src = audioURL

        }
    }).catch(error => {//에러
        console.log('Following error has occured : ',error)
    })
}else{//기기 감지 없을시 x
    stateIndex = ''
    application(stateIndex)
}

const clearDisplay = () => {
    display.textContent = ''
}

const clearControls = () => {
    controllerWrapper.textContent = ''
}



/*------------------녹음기에 각각 필요한 메서드 -------------------------*/
const record = () => {//녹음
    stateIndex = 1
    mediaRecorder.start()
    application(stateIndex)
}

const stopRecording = () => {//녹음중지
    stateIndex = 2
    mediaRecorder.stop()
    application(stateIndex)
}

const downloadAudio = () => {//다운로드 a태그 만들고 href로 url넣어줌 download 버튼, audio 속성
    const downloadLink = document.createElement('a')
    downloadLink.href = audioURL
    downloadLink.setAttribute('download', 'audio')
    downloadLink.click()
}

const addButton = (id, funString, text) => {
    const btn = document.createElement('button')
    btn.id = id
    btn.setAttribute('onclick', funString)
    btn.textContent = text
    controllerWrapper.append(btn)
}

const addMessage = (text) => {
    const msg = document.createElement('p')
    msg.textContent = text
    display.append(msg)
}

const addAudio = () => {
    const audio = document.createElement('audio')
    audio.controls = true
    audio.src = audioURL
    display.append(audio)
}
/**/
const application = (index) => {
    switch (State[index]) {
        case 'Initial': //초기값 start Recording 라고 써진 버튼이 생성되면서 버튼을 클릭하면 녹음메서드를 실행
            clearDisplay()
            clearControls()

            addButton('record', 'record()', '녹음시작')
            break;

        case 'Record': //녹음진행중에서는 stop recording 버튼을 누를시 stopRecording()함수가 실행
            clearDisplay()
            clearControls()

            addMessage('Recording...')
            addButton('stop', 'stopRecording()', '녹음중지')
            break

        case 'Download': //녹음된 음성을 들려줌
            clearControls()
            clearDisplay()

            addAudio()
            addButton('record', 'record()', '다시녹음')
            break

        default: //브라우저가 기능을 지원하지 않을 경우
            clearControls()
            clearDisplay()

            addMessage('Your browser does not support mediaDevices')
            break;
    }

}

application(stateIndex)
