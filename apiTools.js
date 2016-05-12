var XMLHttpRequest = require('xmlhttprequest')
    .XMLHttpRequest;

exports.callFitbit = (verb, path, userId, accessToken) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            console.log('status ', this.status, ' ', userId)
            if (this.status == 200) {
                var response = JSON.parse(this.responseText);
                resolve(response);
            } else {
                reject(this);
            }
        }
        xhr.open(verb, path);
        xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
        xhr.send();
    });
}
