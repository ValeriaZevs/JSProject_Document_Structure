(() => {
  'use strict';

  const input  = document.querySelector('.tasks__input');
  const list   = document.querySelector('.tasks__list');
  const addBtn = document.querySelector('.tasks__add');

  if (!input || !list || !addBtn) return;

  const getStored = () => JSON.parse(localStorage.getItem('tasks')) || [];
  const save = () => {
    const titles = [...list.querySelectorAll('.task__title')].map(n => n.textContent.trim());
    localStorage.setItem('tasks', JSON.stringify(titles));
  };

  const attachRemoveHandler = (taskEl) => {
    const removeLink = taskEl.querySelector('.task__remove');
    if (!removeLink) return;
    removeLink.addEventListener('click', (e) => {
      e.preventDefault();
      taskEl.remove();
      save();
    }, { once: false });
  };

  const insertTask = (title) => {
    const text = String(title || '').trim();
    if (!text) return;

    list.insertAdjacentHTML('beforeend', `
      <div class="task">
        <div class="task__title">${text}</div>
        <a href="#" class="task__remove">&times;</a>
      </div>
    `);

    const taskEl = list.lastElementChild;
    attachRemoveHandler(taskEl);
    save();
  };

  const initial = getStored();
  initial.forEach(insertTask);

  addBtn.addEventListener('click', (e) => {
    e.preventDefault();          
    insertTask(input.value);
    input.value = '';
    input.focus();
  });
})();
