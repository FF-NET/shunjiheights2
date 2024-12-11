//=============================================================================
// MMO_LoginForm.js
//=============================================================================

/*:
 * @plugindesc MMORPG Maker MV - Login Form
 * @author Samuel LESPES CARDILLO
 *
 * @help 
 * /!\ WARNING /!\
 * If you turn the "require account creation" to off, make sure to change the server
 * configuration "passwordRequired" to false.
 *
 * @param allowAccountCreation
 * @text Require account creation
 * @type combo
 * @option Yes
 * @option No
 * @default Yes
 */

function LoginForm() {
    this.initialize.apply(this, arguments);
  }
  
  (function() {  
    LoginForm.Parameters = PluginManager.parameters('MMO_LoginForm');
    LoginForm.Parameters.allowAccountCreation = (LoginForm.Parameters.allowAccountCreation === "Yes");
    LoginForm.connectionLost = false;
  
    document.addEventListener("mmorpg_core_lost_connection", function() {
        let wasLogged = (MMO_Core_Player.Player.id !== undefined);
        LoginForm.connectionLost = true;
  
        if (wasLogged) SceneManager.goto(LoginForm);
        
        LoginForm.prototype.displayError("Connection lost.");
    });
  
    LoginForm.prototype = Object.create(Scene_Base.prototype);
    LoginForm.prototype.constructor = LoginForm;
  
    LoginForm.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
    };
  
    LoginForm.prototype.reBindInput = function() {
        Input.initialize();
    };
  
    LoginForm.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.createForeground();
    };
  
    LoginForm.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
        this.createLoginForm();
    };
  
    LoginForm.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
    };
  
    LoginForm.prototype.isBusy = function() {
        return Scene_Base.prototype.isBusy.call(this);
    };
  
    LoginForm.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        SceneManager.snapForBackground();
    };
  
    LoginForm.prototype.createLoginForm = function() {
        let html = `
        <div id="LoginForm" 
            style="position: fixed;
    top: 40%;
    left: 50%;
        margin: 0 auto;
            transform: translate(-50%, 50%);
    z-index: 999999999999999;
            "
        >
            <div>
                <div style="margin-bottom: 16px;">
                    <input id="inputUsername" type="text" placeholder="" class="login-input"
                        style="
                            display: none; 
                            margin: 0 auto 8px auto; 
                            font-size: 24px;
                            
                        "
                    />
                    ${LoginForm.Parameters.allowAccountCreation ? 
                    `<input id="inputPassword" type="password" placeholder="Password" class="login-input"
                        style="
                            display: block; 
                            margin: 0 auto; 
                            font-size: 24px;
                        "
                    />` : ``}
                </div>
                <div id="loginErrBox" 
                    style="
                        display: block; 
                        margin: 0 auto 16px auto; 
                        text-align: center; 
                        width: 100%; 
                        font-family: Comic Sans, arial; 
                        font-size: 18px;
                    "
                ></div>
                <button id="btnConnect" 
                    style="
display: none;
    margin: 0 auto;
    border: 0;
    border-radius: 25px;
    /* padding: 8px; */
    font-size: 24px;
    padding: 8px 15px 8px 15px;
                    "
                  >
                      지금 플레이!
                </button>
            </div><div style="display:none; width:100%; flex-direction:center;">
                        <div style="transform:translate(0, 240px); color:white; font-size:12px;">비즐라 톤토장 에디터의 아지카진 작업실 취재기</div></div>
            ${LoginForm.Parameters.allowAccountCreation ? 
            `<div style="text-align: center; margin-top: 8px;">
                <a style="color: white;" href="./register.html" target="_blank">Sign up</a>
            </div>` : ``}
        </div>
        `;
  
        document.getElementById('text_zone').innerHTML = html;
        document.getElementById("inputUsername").focus();
        
  
        const verifyPass = () => {
            if (LoginForm.Parameters.allowAccountCreation) {
                const pwdField = document.getElementById('inputPassword');
                const pwdValidPass = !!pwdField.value.length;
                const btnConnect = document.getElementById('btnConnect');
                if (pwdValidPass) {
                    btnConnect.classList.remove('disabled');
                    return true;
                } else {
                    btnConnect.classList.add('disabled');
                    return false;
                }
            } else {
                return true;
            }
        };
  
        //Bind commands
        var that = this;
        document.getElementById("inputUsername").addEventListener('keypress', (e) => {
            verifyPass();
            if (e.which == 13) { //enter
                that.connectAttempt();
            }; 
        });
        document.getElementById("inputUsername").addEventListener('keydown', (e) => {
            if (e.which == 9) { // tabulation
                e.preventDefault();
                if (LoginForm.Parameters.allowAccountCreation) {
                    document.getElementById("inputPassword").focus();
                }
            }
        });
        if (LoginForm.Parameters.allowAccountCreation) {
            document.getElementById('inputPassword').addEventListener('keyup', () => {
                verifyPass();
            });
            document.getElementById('inputPassword').addEventListener('keydown', (e) => {
                verifyPass();
                if (e.which == 13) { //enter
                    that.connectAttempt();
                }; 
            });
        }
        document.getElementById('btnConnect').addEventListener('click', () => {
            if (verifyPass()) that.connectAttempt();
        });    // 폼이 생성된 후 '접속하기' 버튼을 자동으로 클릭
        setTimeout(() => {
            document.getElementById('btnConnect').click();
        }, 1000); // 1초 후에 클릭 (필요시 조정 가능)
                    // 폼이 생성된 후 '접속하기' 버튼을 자동으로 클릭
        MMO_Core.allowTouch = false;
    };
  
    LoginForm.prototype.displayError = function(message) {
        document.getElementById("loginErrBox").innerHTML = `<div style="color: red;">${message}</div>`;
    };
  
    LoginForm.prototype.connectAttempt = function(){
      var that = this;
  
  // user000부터 user020까지 중 하나의 아이디를 랜덤으로 선택
  const userNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 000부터 020까지의 숫자
  const username = `user${userNumber}`;
  
  let payload = { username: username };
  
  
      // 서버와의 상호작용을 통해 로그인 시도
      MMO_Core.socket.on("login_success", function(data){
          if (data.err) return that.displayError("Error : " + data.err);
  
          MMO_Core_Player.Player = data["msg"];
  
          that.fadeOutAll();
          DataManager.setupNewGame();
          document.getElementById('LoginForm').style.display = 'none';
          SceneManager.goto(Scene_Map);
          MMO_Core.allowTouch = true;
  
          setTimeout(async () => {
              setTimeout(async () => MMO_Core.socket.emit("new_message", '/count'), 1);
              MMO_Core.socket.emit("new_message", '/all logged in');
          }, 1000);
  
          return true;
      });
  
      MMO_Core.socket.on("login_error", function(data) {
          that.displayError(data.msg);      
      });
  
      // If you're no longer connected to socket - retry connection and then continue
      if (!MMO_Core.socket.connected) {
          MMO_Core.socket.connect();
      }
  
      MMO_Core.socket.emit("login", payload);
  };
  
  
    LoginForm.prototype.createBackground = function() {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    };
  
    LoginForm.prototype.createForeground = function() {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    };
  
    LoginForm.prototype.drawGameTitle = function() {
        var x = 20;
        var y = Graphics.height / 4;
        var maxWidth = Graphics.width - x * 2;
        var text = $dataSystem.gameTitle;
        this._gameTitleSprite.bitmap.outlineColor = 'black';
        this._gameTitleSprite.bitmap.outlineWidth = 8;
        this._gameTitleSprite.bitmap.fontSize = 72;
        this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, 'center');
    };
  
    LoginForm.prototype.centerSprite = function(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    };
  
    LoginForm.prototype.playTitleMusic = function() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    };
  
    // Overwriting the Title screen to display the login form
    Scene_Title.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        SceneManager.goto(LoginForm);
    };
  
    // Overriding Input._shouldPreventDefault to allow the use of the 'backspace key'
    // in input forms.
    Input._shouldPreventDefault = function(e) {
        if(e === undefined) return;
        return false;
    };
  })();