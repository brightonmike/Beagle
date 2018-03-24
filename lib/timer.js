(function() {
    let P = ["\\", "|", "/", "-"];
    let x = 0;
    return setInterval(function() {
        process.stdout.write("\r" + P[x++]);
        x &= 3;
    }, 100);
})();