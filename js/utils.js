/**
 * utils.js — Tüm sayfalarda kullanılan yardımcı fonksiyonlar.
 * Tüm sayfalarda yüklenir.
 */

/**
 * Bir fonksiyonu belirtilen süre boyunca geciktirir.
 * Resize gibi patlamalı olaylar için kullanılır.
 */
window.AppUtils = window.AppUtils || {};

window.AppUtils.debounce = function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
};

/**
 * Sayfa üzerindeki bir elementi güvenle seçer.
 * Bulunamazsa null döner, hata fırlatmaz.
 */
window.AppUtils.el = function el(selector) {
    return document.querySelector(selector);
};

/**
 * Sayfa üzerindeki tüm eşleşen elementleri seçer.
 */
window.AppUtils.els = function els(selector) {
    return document.querySelectorAll(selector);
};