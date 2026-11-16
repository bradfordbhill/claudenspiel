/* Living Grounds: each Grounds card on the board shows a tiny pixel diorama of its terrain in the art window, four
   frames stepped by CSS (Marsh reeds sway, Battlefield embers rise, a cart crosses the Crossroads, the Library's
   candle gutters, a wisp drifts over the Barrow, light walks across the Shrine). Each is a 48×15 tile, drawn once
   into a sprite sheet of four frames stacked downwards and shown at twice the size. CSTerrain.css(id) returns the
   inline style for the art window, or '' for a card that isn't a Grounds card. */
var CSTerrain = (function () {
  'use strict';
  var TW = 48, TH = 15, FR = 4, cache = {};
  var P = {
    sky: '#2a2140', skyLo: '#3d3350',
    water: '#2a3a5a', waterHi: '#5a78a0', mud: '#3a3424', reed: '#5a8a3a', reedHi: '#9ac060', cat: '#6a4020',
    ash: '#3a2e2e', ashHi: '#5a4646', ember: '#f0a86a', emberHot: '#ffe08a', pole: '#2a1e1a', rag: '#8a1a1a',
    grass: '#3a6a3a', grassHi: '#5a8a4a', path: '#b49464', pathLo: '#8a6e48', post: '#5a3a20', sign: '#c8a060', cart: '#6a4a2a', wheel: '#2a1e1a',
    wood: '#4a2e1a', woodHi: '#6a4428', book: ['#7a1a2a', '#1e3a6a', '#2a5a2a', '#7a5a10', '#5a2a6a'], candle: '#f6efd8', flame: '#f0a86a', flameHi: '#ffe9a8',
    mound: '#3a4a30', moundHi: '#4e6040', stone: '#8a8a90', stoneLo: '#5a5a62', wisp: '#c8f0e0', wispLo: '#6aa898',
    marble: '#e8e0c8', marbleLo: '#b0a888', gold: '#f3d27a', goldHi: '#fff4c0', roof: '#7a5a10'
  };
  function draw(id) {
    var cv = document.createElement('canvas'); cv.width = TW; cv.height = TH * FR;
    var g = cv.getContext('2d');
    for (var f = 0; f < FR; f++) {
      var oy = f * TH;
      var px = function (x, y, c) { if (x < 0 || x >= TW || y < 0 || y >= TH) return; g.fillStyle = c; g.fillRect(x, oy + y, 1, 1); };
      var rect = function (x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) px(x + i, y + j, c); };
      var dith = function (x, y, w, h, a, b) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) px(x + i, y + j, (x + i + y + j) % 2 ? a : b); };
      PAINT[id](px, rect, dith, f);
    }
    return cv.toDataURL();
  }
  var PAINT = {
    // Marsh: dark water, reeds and cattails swaying a pixel either way, a ripple spreading.
    marsh: function (px, rect, dith, f) {
      dith(0, 0, TW, 6, P.sky, P.skyLo); rect(0, 6, TW, 9, P.water); rect(0, 13, TW, 2, P.mud);
      for (var x = 2; x < TW; x += 5) { var h = 6 + (x * 7) % 5, sway = [0, 1, 0, -1][(f + x) % 4];
        for (var y = 0; y < h; y++) px(x + (y < 3 ? sway : 0), 13 - y, y > h - 3 ? P.reedHi : P.reed);
        if (x % 3 === 1) { px(x + sway, 13 - h, P.cat); px(x + sway, 12 - h, P.cat); } }
      var r = 2 + f * 2; px(30 - r, 9, P.waterHi); px(30 + r, 9, P.waterHi); if (f < 3) { px(30 - r + 1, 10, P.waterHi); px(30 + r - 1, 10, P.waterHi); }
    },
    // Battlefield: scorched ground, a broken spear with a torn flag, embers rising in steps.
    battlefield: function (px, rect, dith, f) {
      dith(0, 0, TW, 9, P.sky, P.ash); dith(0, 9, TW, 6, P.ash, P.ashHi);
      for (var y = 2; y < 13; y++) px(12, y, P.pole); var wv = f % 2; rect(13, 2 + wv, 5, 2, P.rag); px(18, 3 + wv, P.rag); px(16, 4 + wv, P.rag);
      for (y = 6; y < 13; y++) px(33 + (y < 9 ? 1 : 0), y, P.pole);
      [[6, 0], [22, 2], [28, 1], [40, 3], [44, 0]].forEach(function (e, i) { var yy = 12 - ((f + e[1]) % 4) * 3, xx = e[0] + ((f + i) % 2); px(xx, yy, yy < 6 ? P.ember : P.emberHot); });
      for (var x = 0; x < TW; x += 7) px(x + (f % 2), 13, P.ember);
    },
    // Crossroads: two dirt roads crossing on grass, a signpost, and a cart rolling along.
    crossroads: function (px, rect, dith, f) {
      dith(0, 0, TW, 15, P.grass, P.grassHi); rect(0, 7, TW, 3, P.path); rect(21, 0, 4, 15, P.path);
      for (var x = 0; x < TW; x += 3) px(x, 9, P.pathLo); for (var y = 0; y < 15; y += 3) px(24, y, P.pathLo);
      for (y = 1; y < 7; y++) px(27, y, P.post); rect(28, 2, 5, 1, P.sign); rect(26, 4, 4, 1, P.sign); px(32, 2, P.post);
      var cx = 2 + f * 3; rect(cx, 5, 6, 2, P.cart); px(cx + 1, 7, P.wheel); px(cx + 4, 7, P.wheel); px(cx + 1 + (f % 2), 8, P.wheel);
    },
    // Library: shelves of coloured spines and a candle whose flame gutters.
    library: function (px, rect, dith, f) {
      rect(0, 0, TW, 15, P.wood); rect(0, 6, TW, 1, P.woodHi); rect(0, 13, TW, 2, P.woodHi);
      for (var x = 1, i = 0; x < TW - 1; i++) { var w = 1 + (i % 3 === 0 ? 1 : 0), c = P.book[(i * 3) % 5], tall = (i * 7) % 3;
        if (x > 20 && x < 27) { x++; continue; }
        rect(x, 1 + tall, w, 5 - tall, c); rect(x, 8 + (i % 2), w, 5 - (i % 2), P.book[(i * 2 + 1) % 5]); x += w + (i % 4 === 3 ? 1 : 0); }
      rect(23, 9, 2, 4, P.candle); var fl = [[0, 0], [1, 0], [0, 1], [-1, 0]][f]; px(23 + fl[0] + (f % 2), 7 - fl[1], P.flame); px(23 + (f % 2), 8, P.flameHi);
      if (f % 2 === 0) { px(22, 7, P.flame); }
    },
    // Barrow: a grassy mound with a standing stone and a pale wisp drifting over it.
    barrow: function (px, rect, dith, f) {
      dith(0, 0, TW, 15, P.sky, P.skyLo);
      for (var x = 0; x < TW; x++) { var h = Math.max(0, Math.round(8 - Math.pow((x - 24) / 4.2, 2) * 0.5)); for (var y = 15 - h - 2; y < 15; y++) px(x, y, y === 15 - h - 2 ? P.moundHi : P.mound); }
      rect(23, 1, 3, 4, P.stone); px(25, 1, P.stoneLo); px(25, 2, P.stoneLo); rect(22, 5, 1, 1, P.stoneLo);
      var wx = 8 + f * 8, wy = 4 + [0, -1, 0, 1][f]; px(wx, wy, P.wisp); px(wx - 1, wy, P.wispLo); px(wx - 2, wy + 1, P.wispLo); px(wx, wy - 1, P.wispLo);
    },
    // Shrine: a small pale shrine with a gold roof, and a glint of light walking across the gold.
    shrine: function (px, rect, dith, f) {
      dith(0, 0, TW, 15, P.sky, P.skyLo); rect(0, 13, TW, 2, P.grass);
      rect(14, 6, 20, 7, P.marble); for (var x = 16; x < 33; x += 4) rect(x, 7, 1, 6, P.marbleLo);
      for (var y = 0; y < 4; y++) rect(14 - y + 3, 5 - y, 20 + 2 * y - 6, 1, P.roof);
      rect(23, 0, 2, 2, P.gold); rect(17, 12, 14, 1, P.marbleLo);
      var gx = 14 + f * 6; px(gx, 5, P.goldHi); px(gx + 1, 5, P.gold); px(24, 0, f % 2 ? P.goldHi : P.gold);
      for (var i = 0; i < 4; i++) if ((i + f) % 3 === 0) px(6 + i * 11, 2 + (i * 5) % 7, P.goldHi);
    }
  };
  function css(id) {
    if (!PAINT[id] || typeof document === 'undefined') return '';
    if (!cache[id]) cache[id] = draw(id);
    return 'background-image:url(' + cache[id] + ');background-size:' + TW * 2 + 'px ' + TH * FR * 2 + 'px';
  }
  return { css: css, has: function (id) { return !!PAINT[id]; } };
})();
