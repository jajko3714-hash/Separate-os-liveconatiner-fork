// 1. Clock Tracker
function updateClock() {
  var clock = document.getElementById('live-clock');
  var d = new Date();
  var m = d.getMinutes();
  var currentMin = m < 10 ? '0' + m : m;
  if (clock) clock.textContent = d.getHours() + ':' + currentMin;
}
updateClock();
setInterval(updateClock, 1000);

// 2. Swipe Tracking Setup
var view = document.getElementById('swipe-viewport');
var canvas = document.getElementById('pages-canvas');
var startX = 0, currentX = 0, activePage = 0, totalPages = 2, width = 393, isDragging = false;

view.addEventListener('mousedown', function(e) { dragStart(e.clientX); });
view.addEventListener('mousemove', function(e) { dragMove(e.clientX); });
view.addEventListener('mouseup', dragEnd);
view.addEventListener('mouseleave', dragEnd);

view.addEventListener('touchstart', function(e) { dragStart(e.touches[0].clientX); });
view.addEventListener('touchmove', function(e) { dragMove(e.touches[0].clientX); });
view.addEventListener('touchend', dragEnd);

function dragStart(x) {
  isDragging = true;
  canvas.style.transition = 'none';
  startX = x;
}
function dragMove(x) {
  if (!isDragging) return;
  currentX = x;
  var diff = currentX - startX;
  var offset = -(activePage * width) + diff;
  canvas.style.transform = 'translateX(' + offset + 'px)';
}
function dragEnd() {
  if (!isDragging) return;
  isDragging = false;
  canvas.style.transition = 'transform 0.3s ease-out';
  var diff = currentX - startX;
  if (diff < -60 && activePage < totalPages - 1) activePage++;
  if (diff > 60 && activePage > 0) activePage--;
  canvas.style.transform = 'translateX(' + (-activePage * width) + 'px)';
  
  document.querySelectorAll('.dot').forEach(function(d) { d.classList.remove('active'); });
  var dot = document.getElementById('dot-' + activePage);
  if (dot) dot.classList.add('active');
}

// 3. UI Actions
function addNewApp() { 
  alert('LiveContainer Select IPA File Mockup triggered'); 
}
