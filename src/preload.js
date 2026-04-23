var d = new Date(), m = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
var l = document.createElement('link');
l.rel = 'preload'; l.as = 'fetch'; l.href = '/meal/' + m + '.json'; l.crossOrigin = 'anonymous';
document.head.appendChild(l);
