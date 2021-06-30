var d = 7
function aa() {
    let d = 5
    function bb() {
        function cc() {
            console.log('this.d', this.d)
        }
        cc()
    }
    bb()
}

aa()





