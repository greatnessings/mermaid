let title = '';
let currentSection = '';

const sections = [];
const tasks = [];
const rawTasks = [];

export const clear = function() {
  sections.length = 0;
  tasks.length = 0;
  currentSection = '';
  title = '';
  rawTasks.length = 0;
};

export const setTitle = function(txt) {
  title = txt;
};

export const getTitle = function() {
  return title;
};

export const addSection = function(txt) {
  currentSection = txt;
  sections.push(txt);
};

export const getSections = function() {
  return sections;
};

export const getTasks = function() {
  let allItemsProcessed = compileTasks();
  const maxDepth = 100;
  let iterationCount = 0;
  while (!allItemsProcessed && iterationCount < maxDepth) {
    allItemsProcessed = compileTasks();
    iterationCount++;
  }

  tasks.length = 0;
  tasks.push(...rawTasks);

  return tasks;
};

const updateActors = function() {
  const tempActors = [];
  const sourceTasks = [...tasks, ...rawTasks];
  sourceTasks.forEach(task => {
    if (task.people) {
      tempActors.push(...task.people);
    }
  });

  const unique = new Set(tempActors);
  return [...unique].sort();
};

export const addTask = function(descr, taskData) {
  const normalizedData = taskData.startsWith(':') ? taskData.substr(1) : taskData;
  const pieces = normalizedData.split(':');

  let score = 0;
  let peeps = [];
  if (pieces.length === 1) {
    score = Number(pieces[0]);
    peeps = [];
  } else {
    score = Number(pieces[0]);
    peeps = pieces[1].split(',');
  }
  const peopleList = peeps.map(s => s.trim()).filter(Boolean);

  const rawTask = {
    section: currentSection,
    type: currentSection,
    people: peopleList,
    task: descr,
    score
  };

  rawTasks.push(rawTask);
};

export const addTaskOrg = function(descr) {
  const newTask = {
    section: currentSection,
    type: currentSection,
    description: descr,
    task: descr,
    classes: []
  };
  tasks.push(newTask);
};

const compileTasks = function() {
  const compileTask = function(pos) {
    return rawTasks[pos].processed;
  };

  let allProcessed = true;
  for (let i = 0; i < rawTasks.length; i++) {
    compileTask(i);

    allProcessed = allProcessed && rawTasks[i].processed;
  }
  return allProcessed;
};

const getActors = function() {
  return updateActors();
};

export const getJourneySummary = function() {
  const compiled = getTasks();
  const actors = getActors();
  const scores = compiled.map(t => Number(t.score)).filter(n => Number.isFinite(n));
  const meanScore = scores.length > 0 ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(4)) : 0;
  return {
    title: getTitle(),
    sectionCount: sections.length,
    taskCount: compiled.length,
    actorCount: actors.length,
    meanScore
  };
};

export default {
  clear,
  setTitle,
  getTitle,
  addSection,
  getSections,
  getTasks,
  addTask,
  addTaskOrg,
  getActors,
  getJourneySummary
};
