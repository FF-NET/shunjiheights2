//=============================================================================
// MMO_ChatBox.js
//=============================================================================

/*:
 * @plugindesc MMORPG Maker MV - ChatBox
 * @author Samuel LESPES CARDILLO
 *
 * @help This plugin does not provide plugin commands.
 * 
 * @param chatPosition
 * @text Position of the chat
 * @type combo
 * @option TOP LEFT
 * @option TOP CENTER
 * @option TOP RIGHT
 * @option BOTTOM LEFT
 * @option BOTTOM CENTER
 * @option BOTTOM RIGHT
 * @default TOP LEFT
 */

function ChatBox() { 
  this.initialize.apply(this, arguments);
}

(function() {

  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // 모바일 환경에서는 스크립트 전체를 무시
  if (isMobileDevice()) {
    console.log("ChatBox script is disabled on mobile devices.");
    return;
  }

  ChatBox.moveByInput = Game_Player.prototype.moveByInput;
  
  ChatBox.Parameters = PluginManager.parameters('MMO_ChatBox');

  ChatBox.isGenerated = false;
  ChatBox.isVisible = false;
  ChatBox.isFocused = false;

  // ---------------------------------------
  // ---------- Native Functions Extending
  // ---------------------------------------

  // Handling the window resizing
  window.addEventListener('resize', function(){
    if(!ChatBox.isGenerated || !ChatBox.isVisible) return;

    ChatBox.resize(); // Resize the chatbox
    
  }, true);

  // Handle the first generation of the chatbox & when reentering a map scene
  ChatBox.onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    ChatBox.onMapLoaded.call(this);

    if ($gameMap.mapId() !== 7) {
      if (ChatBox.isVisible) ChatBox.hide(); // 맵이 7이 아니면 채팅박스 숨김
      return;
    }

    if(!ChatBox.isGenerated) {
      if (!document.getElementById('GameCanvas')) setTimeout(() => {}, 1000);
      return ChatBox.generate();
    }
    if(!ChatBox.isVisible) return ChatBox.toggle();
  }

  // Handle the toggle of the chatbox in case of battle or menu
  ChatBox.changeScene = SceneManager.changeScene;
  SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
      if(SceneManager._nextScene instanceof Scene_Map) {
        if ($gameMap.mapId() === 7) {
          ChatBox.isVisible = false;
          ChatBox.toggle();
        }
      } else {
        ChatBox.isVisible = true;
        ChatBox.toggle();
      }
    }
    ChatBox.changeScene.call(this);
  }

  // Handle the toggle of the chatbox in case of dialogue with NPC
  ChatBox.startMessage = Window_Message.prototype.startMessage;
  Window_Message.prototype.startMessage = function() {
    if ($gameMap.mapId() === 7) {
      ChatBox.toggle();
    }
    ChatBox.startMessage.call(this);
  }

  // Handle the toggle of the chatbox in case of dialogue with NPC
  ChatBox.terminateMessage = Window_Message.prototype.terminateMessage;
  Window_Message.prototype.terminateMessage = function() {
    if ($gameMap.mapId() === 7) {
      ChatBox.toggle();
    }
    ChatBox.terminateMessage.call(this);
  }

  // ---------------------------------------
  // ---------- Exposed Functions
  // ---------------------------------------

  // Generate the chatbox
  ChatBox.generate = function() {
    generateTextField();
    generateTextBox();
    this.resize();

    this.isGenerated = true;
    this.isVisible = true;
  };

  // Show the chatbox
  ChatBox.show = function() {
    if(!ChatBox.isVisible) {
      ChatBox.toggle();
    }
  };

  // Hide the chatbox
  ChatBox.hide = function() {
    if(ChatBox.isVisible) {
      ChatBox.toggle();
    }
  };

  // Toggle the chatbox
  ChatBox.toggle = function() {
    if(document.querySelector("#chatbox_box") === null) return;

    let state = (this.isVisible) ? "hidden" : "visible";
    let chatboxInput = document.querySelector("#chatbox_input");
    let chatboxBox = document.querySelector("#chatbox_box");
    chatboxInput.style.visibility = state;
    chatboxBox.style.visibility = state;
    this.isVisible = !this.isVisible;
  }

  // Resize the chatbox following predefined parameters
  ChatBox.resize = function() {
    let canvas = document.querySelector("canvas");
    let offsetTop = Math.max(0, canvas.offsetTop);
    let offsetLeft = Math.max(0, canvas.offsetLeft);

    let chatboxInput = document.querySelector("#chatbox_input");
    let chatboxBox = document.querySelector("#chatbox_box");
    
    switch (this.Parameters["chatPosition"]) {
      case "TOP LEFT":
        chatboxInput.style.left = (offsetLeft + 8) + "px";
        chatboxInput.style.top = (offsetTop + 116) + "px";
        chatboxBox.style.left = (offsetLeft + 8) + "px";
        chatboxBox.style.top = (offsetTop + 8) + "px";
        break;
      case "TOP CENTER":
        chatboxInput.style.left = "calc(50vw - 169px)"; 
        chatboxInput.style.top = (offsetTop + 116) + "px";
        chatboxBox.style.left = "calc(50vw - 169px)"; 
        chatboxBox.style.top = (offsetTop + 8) + "px";
        break;
      case "TOP RIGHT":
        chatboxInput.style.right = (offsetLeft + 8) + "px";
        chatboxInput.style.top = (offsetTop + 116) + "px";
        chatboxBox.style.right = (offsetLeft + 8) + "px";
        chatboxBox.style.top = (offsetTop + 8) + "px";
        break;
      case "BOTTOM LEFT":
        chatboxInput.style.left = (offsetLeft + 8) + "px";
        chatboxInput.style.bottom = (offsetTop + 8) + "px";
        chatboxBox.style.left = (offsetLeft + 8) + "px";
        chatboxBox.style.bottom = (offsetTop + 36) + "px";
        break;
      case "BOTTOM CENTER":
        /*chatboxInput.style.left = "33vw";*/
       /* chatboxInput.style.bottom = "10%";*/
        chatboxInput.style.transform = "translate(-50%, 50%)";
        chatboxInput.style.zoom = "1.5";
        chatboxInput.style.left = "50%"
        chatboxInput.style.bottom = "15%"
        
        chatboxBox.style.left = "50%"; 
        chatboxBox.style.bottom = "18.2%";
        chatboxBox.style.transform = "translateX(-50%)";
        chatboxBox.style.zoom = "1.5";
        break;
      case "BOTTOM RIGHT":
        chatboxInput.style.right = (offsetLeft + 8) + "px";
        chatboxInput.style.bottom = (offsetTop + 8) + "px";
        chatboxBox.style.right = (offsetLeft + 8) + "px";
        chatboxBox.style.bottom = (offsetTop + 36) + "px";
        break;
    }
  }

  // ---------------------------------------
  // ---------- Private Functions
  // ---------------------------------------

  function blurOnMove(elem, blurredOpacity = 0.2) {
    document.body.addEventListener('keydown', () => {
      setTimeout(() => {
      //  if ($gamePlayer.isMoving()) elem.style.opacity = blurredOpacity;
      }, 500);
    });
    document.body.addEventListener('keyup', () => {
      setTimeout(() => {
   //     if (!$gamePlayer.isMoving()) elem.style.opacity = 1;
      }, 500);
    });
  }

  // Generate the main chatbox that contains messages
  function generateTextField() {
    let textField = document.createElement('input');
    textField.id                    = 'chatbox_input';
    textField.type                  = 'text';
    textField.placeholder           = "모두에게";
    textField.style.position        = 'absolute';
    textField.style.width           = '335px';
    textField.style.height          = '21px';
    textField.style.zIndex          = "1001";
    textField.style.color           = "rgb(0, 0, 0)";
    textField.style.paddingLeft     = "8px";
    textField.style.backgroundColor = "background-color: #ffffff";
    textField.style.transition      = "opacity .3s ease";
    textField.style.cursor          = 'pointer';
    textField.style.borderRadius = "10px";
    textField.addEventListener('keydown', function(e){sendMessage(e)});
    textField.addEventListener('touchstart', function(e){handleTouch(e)});
    textField.addEventListener('focus', function(e){handleFocus(e)});
    textField.addEventListener('focusout', function(e){handleFocus(e)});
    document.body.appendChild(textField);
      // Add media query to hide on mobile
   // Hide on mobile devices
  if (isMobileDevice()) {
    textField.style.display = 'none';
  }
    blurOnMove(textField,0);
  }

  // Generate the textbox
  function generateTextBox() {
    let textBox = document.createElement('div');
    textBox.id                    = 'chatbox_box';
    textBox.style.position        = 'absolute';
    textBox.style.width           = '345px';
    textBox.style.height          = '44px';
    textBox.style.zIndex          = "1000";
    textBox.style.overflowY       = "auto";
    textBox.style.borderRadius    = "3px";
    textBox.style.color           = "#fafafa";
    textBox.style.backgroundColor = 'rgba(0,0,0,0.25)';
    textBox.style.transition      = "opacity .3s ease";
    textBox.style.pointerEvents   = "none";
    textBox.style.transition      = 'all .1s ease-out';
  
    textBox.style.borderColor     = textBox.style.backgroundColor;
    document.body.appendChild(textBox);
    let textZone = document.createElement('div');
    textZone.id                   = 'text_container';
    textZone.style.position       = 'absolute';
    textZone.style.bottom         = '0';
    textZone.style.width          = '100%';
    textBox.appendChild(textZone);
      // Add media query to hide on mobile
  // Hide on mobile devices
  if (isMobileDevice()) {
    textBox.style.display = 'none';
  }
    blurOnMove(textBox);
  }

  // Handle sending message
  function sendMessage(e) {
    if(e.keyCode !== undefined && e.keyCode != 13) return;
    if(e.keyCode === undefined && e !== "touch") return;

    let message = document.querySelector("#chatbox_input").value;
    if(message.length <= 0) return;

    MMO_Core.sendMessage(message);
    document.querySelector("#chatbox_input").value = "";
    document.querySelector("#chatbox_input").blur();
    ChatBox.toggle(); setTimeout(() => ChatBox.toggle(), 1);

    document.querySelector("#chatbox_box").scrollTop = document.querySelector("#chatbox_box").scrollHeight;    
  }

  // Handle touch events from mobile
  function handleTouch() {
    MMO_Core.allowTouch = false;           
  }

  // Handle focus on the chatbox
  function handleFocus(e) {
    ChatBox.isFocused = !ChatBox.isFocused;

    document.querySelector("#chatbox_box").scrollTop = document.querySelector("#chatbox_box").scrollHeight;

    (ChatBox.isFocused) ? $gameSystem.disableMenu() : $gameSystem.enableMenu();
    document.querySelector("#chatbox_box").style.overflowY = (ChatBox.isFocused) ? "scroll" : "hidden";
    document.querySelector("#chatbox_box").style.backgroundColor = (ChatBox.isFocused) ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.25)';
    document.querySelector("#chatbox_box").style.height = (ChatBox.isFocused) ? '164px' : '44px';
    document.querySelector("#chatbox_box").style.pointerEvents = (ChatBox.isFocused) ? 'initial' : 'none';
    document.querySelector("#chatbox_box").scrollTop = document.querySelector("#chatbox_box").scrollHeight;
    
    freezePlayer(ChatBox.isFocused);
    
    if(!ChatBox.isFocused) MMO_Core.allowTouch = true;

    MMO_Core_Player.updateBusy((ChatBox.isFocused) ? "écrit..." : false)
  }

  function freezePlayer(freezePlayer) {
    if(freezePlayer) { 
      $gamePlayer.moveByInput = function(){ return false; }  
    } else {
      $gamePlayer.moveByInput = ChatBox.moveByInput;
    }
  }

  // ---------------------------------------
  // ---------- MMO_Core.sockets Handling
  // ---------------------------------------

  // Handle new messages
   // Handle new messages
  // 사용자 아이디와 닉네임을 매핑하는 객체
const baseNicknames = [
  '배고픈 관찰자', '귀염둥이 관찰자', '사랑스러운 관찰자', '긍정왕', 
  '물총을 좋아하는 관찰자', '늦잠꾸러기', '오늘은 학교에 가기 싫은 관찰자',
  '오늘 막 하늘에서 떨어진 관찰자', '쓰레기산 산책왕', '발명왕', 
  '비밀을 알고 있다는 관찰자', '아무것도 모른다는 관찰자', '수수께끼를 몰고 다니는 관찰자',
  '존키벌레 전문 관찰자', '애니메이션 광', '메카닉 애호가', 
  '특촬물 전문 관찰자', '하늘에서 오늘 떨어진 관찰자', '별 애호가', 
  '위스키를 좋아하는 관찰자', '혼자 놀기의 달인', '초보 관찰자', 
  '등대지기를 무서워하는 관찰자', '영화광', '지도 애호가', 
  '우유 애호가', '나뭇잎을 좋아하는 관찰자', '요구르트에 진심인 관찰자', 
  '이제 막 태어난 관찰자'
];

const nicknameMap = {};
for (let i = 0; i < 1000; i++) {
  const userKey = `user${i.toString().padStart(3, '0')}`;
  const nicknameIndex = i % baseNicknames.length;  // baseNicknames 배열을 반복 사용
  nicknameMap[userKey] = `도레핀 마을의 ${baseNicknames[nicknameIndex]}`;
}

MMO_Core.socket.on("new_message", async function(messageData) {
    let span = document.createElement("div");
    span.style.display     = "flex";
    span.style.padding     = '2px';
    span.style.color       = "rgb(248, 248, 248)";
    span.style.paddingLeft = '8px';
    span.style.fontWeight  = '120';
    span.style.fontFamily  = 'monoscape';
    span.style.fontSize = '12px';
    span.style.opacity     = '1';  // 초기 투명도 설정
    span.style.transition  = 'opacity 2s ease';  // 2초 동안의 페이드아웃 효과

    const d = new Date();
    const time = (d.getHours().toString().length == 2 ? d.getHours() : '0' + d.getHours())  
                + ':' + 
                (d.getMinutes().toString().length == 2 ? d.getMinutes() : '0' + d.getMinutes());

    let username = messageData["username"];

    // 사용자 이름 변환
    let customName = nicknameMap[username] || `도레핀 마을의 알 수 없는 관찰자`;

    let message = document.createTextNode(customName + " :" + messageData["msg"]);
    console.log(span, message);

    span.appendChild(message); 
    if (document.querySelector("#text_container")) {
      document.querySelector("#text_container").appendChild(span);
    }
    if (document.querySelector("#chatbox_box")) {
      document.querySelector("#chatbox_box").scrollTop = document.querySelector("#chatbox_box").scrollHeight;
    }

     // 13초 후에 페이드아웃 시작 (2초 후 완전 투명해짐)
     setTimeout(function() {
      span.style.opacity = '0';
  }, 7000); // 13000 밀리초 = 13초 후에 페이드아웃 시작

  // 15초 후에 메시지 삭제
  setTimeout(function() {
      if (span.parentNode) {
          span.parentNode.removeChild(span);
      }
  }, 10000); // 15000 밀리초 = 15초 후에 완전히 삭제

    if (!ChatBox.isFocused) {
      if (document.querySelector("#chatbox_input")) {
        document.querySelector("#chatbox_input").blur();
      }
    }
  });



  document.addEventListener('keydown', function(e) {
    if(!ChatBox.isGenerated) return;

    switch (e.keyCode) {
      case 119:
        ChatBox.toggle();
        break;
      case 13:
        if(!ChatBox.isFocused) {
          document.querySelector("#chatbox_input").focus(); 
        } else {
          document.querySelector("#chatbox_input").blur();
        }
        break;
    }
  })
})();
