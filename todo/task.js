
(function () {
  'use strict';

  var input  = document.querySelector('.tasks__input');
  var list   = document.querySelector('.tasks__list');
  var addBtn = document.querySelector('.tasks__add');

  if (!input || !list) return;

  function save() {
    var titles = [];
    var nodes = list.querySelectorAll('.task__title');
    for (var i = 0; i < nodes.length; i++) {
      titles.push(nodes[i].textContent.trim());
    }
    localStorage.setItem('tasks', JSON.stringify(titles));
  }

  function attachRemoveHandler(removeLink, taskEl) {
    removeLink.addEventListener('click', function (e) {
      e.preventDefault();
      if (taskEl && taskEl.parentNode) {
        taskEl.parentNode.removeChild(taskEl);
        save();
      }
    });
  }

  function createTask(text) {
    var task = document.createElement('div');
    task.className = 'task';

    var title = document.createElement('div');
    title.className = 'task__title';
    title.textContent = text;

    var rm = document.createElement('a');
    rm.href = '#';
    rm.className = 'task__remove';
    rm.innerHTML = '&times;';

    task.appendChild(title);
    task.appendChild(rm);
    attachRemoveHandler(rm, task);

    return task;
  }

  function addTaskFromInput() {
    var text = (input.value || '').trim();
    if (!text) return;
    var el = createTask(text);
    list.appendChild(el);
    input.value = '';
    save();
  }

  try {
    var stored = JSON.parse(localStorage.getItem('tasks') || '[]');
    for (var i = 0; i < stored.length; i++) {
      var el = createTask(stored[i]);
      list.appendChild(el);
    }
  } catch (e) {}

  if (addBtn) {
    addBtn.addEventListener('click', function (e) {
      e.preventDefault();
      addTaskFromInput();
    });
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      addTaskFromInput();
    }
  });
})();
