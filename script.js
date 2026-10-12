function updateClock() {
  var clock = document.getElementById('live-clock');
  var d = new Date(), m = d.getMinutes();
  if (clock) clock.textContent = d.getHours() + ':' + (m < 10 ? '0' + m : m);
}
updateClock(); setInterval(updateClock, 1000);

var view = document.getElementById('swipe-viewport'), canvas = document.getElementById('pages-canvas');
var startX = 0, currentX = 0, activePage = 0, totalPages = 2, width = 393, isDragging = false, pressTimer, isJiggleMode = false, isAppOpen = false, isSettingsOpen = false;

view.addEventListener('mousedown', function(e) { dragStart(e.clientX); });
view.addEventListener('mousemove', function(e) { dragMove(e.clientX); });
view.addEventListener('mouseup', dragEnd); view.addEventListener('mouseleave', dragEnd);
view.addEventListener('touchstart', function(e) { dragStart(e.touches.clientX); });
view.addEventListener('touchmove', function(e) { dragMove(e.touches.clientX); });
view.addEventListener('touchend', dragEnd);

function dragStart(x) { if (isJiggleMode || isAppOpen || isSettingsOpen) return; isDragging = true; canvas.style.transition = 'none'; startX = x; }
function dragMove(x) {
  if (!isDragging) return; currentX = x; var diff = currentX - startX, offset = -(activePage * width) + diff;
  canvas.style.transform = 'translateX(' + offset + 'px)';
}
function dragEnd() {
  if (!isDragging) return; isDragging = false; canvas.style.transition = 'transform 0.3s ease-out';
  var diff = currentX - startX;
  if (diff < -70 && activePage < totalPages - 1) activePage++;
  if (diff > 70 && activePage > 0) activePage--;
  canvas.style.transform = 'translateX(' + (-activePage * width) + 'px)';
  document.querySelectorAll('.dot').forEach(function(d, i) { d.className = i === activePage ? 'dot active' : 'dot'; });
}

function startPress() { if (isJiggleMode || isAppOpen || isSettingsOpen) return; pressTimer = setTimeout(activateJiggleMode, 1000); }
function endPress() { clearTimeout(pressTimer); }
function activateJiggleMode() {
  isJiggleMode = true;
  document.querySelectorAll('.app-item').forEach(function(item) { if (!item.querySelector('.icon-add')) item.classList.add('jiggling'); });
  view.addEventListener('click', exitJiggleMode);
}
function exitJiggleMode(e) {
  if (e.target.id === 'swipe-viewport' || e.target.id === 'pages-canvas') {
    isJiggleMode = false;
    document.querySelectorAll('.app-item').forEach(function(item) { item.classList.remove('jiggling'); });
    view.removeEventListener('click', exitJiggleMode);
  }
}

function handleAppClick(name) { 
  if (isJiggleMode || isSettingsOpen) return; 
  var win = document.getElementById('app-window'), title = document.getElementById('window-app-name');
  if (win && title) { title.textContent = name; win.classList.add('open'); isAppOpen = true; }
}

// Wallpaper Customizer Panel Engine Controls
function openSettings() {
  if (isJiggleMode || isAppOpen) return;
  var panel = document.getElementById('settings-panel');
  if (panel) { panel.classList.add('open'); isSettingsOpen = true; }
}
function changeWallpaper(url, thumbElement) {
  var screen = document.getElementById('main-screen');
  if (screen) {
    screen.style.backgroundImage = "url('" + url + "')";
    document.querySelectorAll('.wallpaper-thumb').forEach(function(t) { t.classList.remove('active'); });
    thumbElement.classList.add('active');
  }
}
function closeAllPanels() {
  var win = document.getElementById('app-window'), panel = document.getElementById('settings-panel');
  if (win && isAppOpen) { win.classList.remove('open'); isAppOpen = false; }
  if (panel && isSettingsOpen) { panel.classList.remove('open'); isSettingsOpen = false; }
}

function deleteApp(e, badge) { e.stopPropagation(); if (confirm('Delete App?')) badge.parentElement.remove(); }
function addNewApp() { if (!isJiggleMode && !isAppOpen && !isSettingsOpen) document.getElementById('install-modal').style.display = 'flex'; }
function closeModal() { document.getElementById('install-modal').style.display = 'none'; document.getElementById('app-name-input').value = ''; }
function confirmInstall() {
  var name = document.getElementById('app-name-input').value.trim();
  if (name) {
    var page = document.querySelector('.app-page'), item = document.createElement('div');
    item.className = 'app-item'; item.setAttribute('onmousedown', 'startPress()'); item.setAttribute('onmouseup', 'endPress()'); item.setAttribute('ontouchstart', 'startPress()'); item.setAttribute('ontouchend', 'endPress()');
    item.innerHTML = '<div class="delete-badge" onclick="deleteApp(event, this)">−</div><div class="app-icon" style="background:linear-gradient(135deg,#ff5e62,#ff9966)" onclick="handleAppClick(\''+name+'\')"></div><span class="app-label">'+name+'</span>';
    page.insertBefore(item, document.querySelector('.icon-add').parentElement);
  }
  closeModal();
}
