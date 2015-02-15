/**
 * Created by jerek0 on 13/02/2015.
 */

var Page = require('./Page');

var GamePage = function() {
    // Functions handlers
    this.onPageDisplayedHandler = this.onPageDisplayed.bind(this);
    this.onOtherPlayerReadyHandler = this.onOtherPlayerReady.bind(this);
    this.launchGameHandler = this.launchGame.bind(this);

    this.addEventListener('pageDisplayed', this.onPageDisplayedHandler);
    this.setTemplateUrl('templates/game.html');
};

// Héritage de Page
GamePage.prototype = new Page();
GamePage.prototype.constructor = GamePage;

/**
 * Called when page markup is loaded *
 */
GamePage.prototype.onPageDisplayed = function() {
    this.removeEventListener('pageDisplayed', this.onPageDisplayedHandler);

    // TODO Watch Memory Here
    var btnBack = document.getElementById("btn-back");
    btnBack.addEventListener('click', function() {
        global.serverDialer.leaveRoom();
    });
    
    this.bindServerEvents();
};

/**
 * Listen for events coming from the server *
 */
GamePage.prototype.bindServerEvents = function () {
    global.serverDialer.addEventListener('bridge', this.onOtherPlayerReadyHandler);
    global.serverDialer.addEventListener('launchGame', this.launchGameHandler);
}

/**
 * When the players are ready, we notify and wait for the game launch * 
 */
GamePage.prototype.onOtherPlayerReady = function() {
    global.serverDialer.removeEventListener('bridge', this.onOtherPlayerReadyHandler);
    document.getElementById("message").innerHTML = "Synced !";
};

/**
 * Here the fun begins ! Game launch *
 */
GamePage.prototype.launchGame = function () {
    global.serverDialer.removeEventListener('launchGame', this.launchGameHandler);
    document.getElementById("message").innerHTML = "";
    
    global.gameEngine.rendererController.setState('game');
};

/**
 * Override, called when page changes *
 */
GamePage.prototype.unbindUiActions = function() {
    global.serverDialer.removeEventListener('bridge', this.onOtherPlayerReadyHandler);
    global.serverDialer.removeEventListener('launchGame', this.launchGameHandler);
};

module.exports = GamePage;
