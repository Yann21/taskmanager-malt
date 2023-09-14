CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255),
  description TEXT
);

CREATE TABLE kanbans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255),
  -- project, context
  type VARCHAR(255),
  backlog_list_id INT,
  todo_list_id INT,
  done_list_id INT
);

CREATE TABLE lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255),
  type VARCHAR(255) -- inbox, later, backlog, todo, done
);

CREATE TABLE task_list_association (
  task_id INT,
  list_id INT,
  PRIMARY KEY (task_id, list_id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (list_id) REFERENCES lists(id)
);

-- Insert data into kanbans table (projects and contexts)
INSERT INTO
  kanbans (
    id,
    name,
    type,
    -- project, context
    backlog_list_id,
    todo_list_id,
    done_list_id
  )
VALUES
  (2, 'Project 1', 'project', 4, 5, 6),
  (3, 'Project 2', 'project', 7, 8, 9),
  (4, 'Project 3', 'project', 10, 11, 12),
  (5, 'Project 4', 'project', 13, 14, 15),
  (6, 'Project 5', 'project', 16, 17, 18),
  (7, 'Project 6', 'project', 19, 20, 21),
  (8, 'Project 7', 'project', 22, 23, 24),
  (9, 'Project 8', 'project', 25, 26, 27),
  (10, 'Project 9', 'project', 28, 29, 30),
  (12, 'Project 10', 'project', 34, 35, 36),
  (13, 'Project 11', 'project', 37, 38, 39),
  (14, 'Project 12', 'project', 40, 41, 42),
  (15, 'Project 13', 'project', 43, 44, 45),
  (16, 'Project 14', 'project', 46, 47, 48),
  (17, 'Context 1', 'context', 49, 50, 51),
  (18, 'Context 2', 'context', 52, 53, 54),
  (19, 'Context 3', 'context', 55, 56, 57),
  (20, 'Context 4', 'context', 58, 59, 60);



INSERT INTO
  lists (id, name, type)
VALUES
  (4, '_', 'backlog'),
  (5, '_', 'todo'),
  (6, '_', 'done'),
  (7, '_', 'backlog'),
  (8, '_', 'todo'),
  (9, '_', 'done'),
  (10, '_', 'backlog'),
  (11, '_', 'todo'),
  (12, '_', 'done'),
  (13, '_', 'backlog'),
  (14, '_', 'todo'),
  (15, '_', 'done'),
  (16, '_', 'backlog'),
  (17, '_', 'todo'),
  (18, '_', 'done'),
  (19, '_', 'backlog'),
  (20, '_', 'todo'),
  (21, '_', 'done'),
  (22, '_', 'backlog'),
  (23, '_', 'todo'),
  (24, '_', 'done'),
  (25, '_', 'backlog'),
  (26, '_', 'todo'),
  (27, '_', 'done'),
  (28, '_', 'backlog'),
  (29, '_', 'todo'),
  (30, '_', 'done'),
  (34, '_', 'backlog'),
  (35, '_', 'todo'),
  (36, '_', 'done'),
  (37, '_', 'backlog'),
  (38, '_', 'todo'),
  (39, '_', 'done'),
  (40, '_', 'backlog'),
  (41, '_', 'todo'),
  (42, '_', 'done'),
  (43, '_', 'backlog'),
  (44, '_', 'todo'),
  (45, '_', 'done'),
  (46, '_', 'backlog'),
  (47, '_', 'todo'),
  (48, '_', 'done'),
  (49, '_', 'backlog'),
  (50, '_', 'todo'),
  (51, '_', 'done'),
  (52, '_', 'backlog'),
  (53, '_', 'todo'),
  (54, '_', 'done'),
  (55, '_', 'backlog'),
  (56, '_', 'todo'),
  (57, '_', 'done'),
  (58, '_', 'backlog'),
  (59, '_', 'todo'),
  (60, '_', 'done'),
  (61, 'inbox', 'inbox'),
  (62, 'later', 'later');

-- Insert data into tasks table
INSERT INTO
  tasks (id, name, description)
VALUES
  -- Inbox tasks
  (
    1,
    'Task',
    'Task'
  ),
  (2, 'Task', ''),
  (3, 'Task', ''),
  (
    4,
    'Task',
    'Task'
  ),
  (5, 'Task', ''),
  (6, 'Task', ''),
  (
    7,
    'Task',
    'Task'
  ),
  (
    8,
    'Task',
    'Task'
  ),
  (
    9,
    'Task',
    'Task'
  ),
  -- System project tasks
  (10, 'Task', ''),
  (11, 'Task', ''),
  (
    12,
    'Task',
    'Task'
  ),
  (13, 'Task', ''),
  (
    14,
    'Task',
    'Task'
  ),
  (15, 'Task', ''),
  (16, 'Task', ''),
  (17, 'Task', ''),
  -- ISO Tasks
  (18, 'Task', ''),
  (
    19,
    'Task',
    'Task'
  ),
  (20, 'Task', ''),
  (21, 'Task', ''),
  (22, 'Task', ''),
  (23, 'Task', ''),
  (24, 'Task', ''),
  (25, 'Task', ''),
  (26, 'Task', ''),
  (27, 'Task', ''),
  (28, 'Task', ''),
  (
    29,
    'Task',
    'Task'
  ),
  (30, 'Task', ''),
  (
    31,
    'Task',
    'Task'
  ),
  -- Emacs Tasks
  (32, 'Task', ''),
  (33, 'Task', ''),
  (
    34,
    'Task',
    'Task'
  ),
  (35, 'Task', ''),
  (
    36,
    'Task',
    'Task'
  ),
  (
    37,
    'Task',
    'Task'
  ),
  -- Infra Tasks
  (
    38,
    'Task',
    'Task'
  ),
  (
    39,
    'Task',
    'Task'
  ),
  (
    40,
    'Task',
    'Task'
  ),
  (41, 'Task', ''),
  (
    42,
    'Task',
    'Task'
  ),
  -- GPhotos Tasks
  (
    43,
    'Task',
    'Task'
  ),
  -- PhD Tasks
  (44, 'Task', ''),
  (
    45,
    'Task',
    'Task'
  ),
  -- Brevets
  (46, 'Task', ''),
  -- Ari's context tasks
  (47, 'Task', ''),
  (48, 'Task', ''),
  (49, 'Task', ''),
  (50, 'Task', ''),
  (
    51,
    'Task',
    'Task'
  ),
  -- Learning Tasks
  (
    52,
    'Task',
    'Task'
  ),
  -- Article Tasks
  (
    53,
    'Task',
    'Task'
  ),
  -- Laptop Tasks
  (
    54,
    'Task',
    'Task'
  ),
  -- Later Tasks
  (55, 'Task', ''),
  (
    56,
    'Task',
    'Task'
  ),
  (
    57,
    'Task',
    'Task'
  ),
  (58, 'Task', ''),
  -- Louis Tasks
  (
    59,
    'Task',
    'Task'
  ),
  (
    60,
    'Task',
    'Task'
  ),
  -- Outdoors Tasks
  (61, 'Task', ''),
  (
    62,
    'Task',
    'Task'
  ),
  (63, 'Task', ''),
  (
    64,
    'Task',
    'Task'
  ),
  (
    65,
    'Task',
    'Task'
  ),
  (66, 'Task', ''),
  (67, 'Task', ''),
  (68, 'Task', ''),
  (69, 'Task', ''),
  -- Root Phone Tasks
  (70, 'Task', ''),
  -- Research tasks
  (71, 'Task', ''),
  (
    72,
    'Task',
    'Task'
  ),
  -- Prismalia website
  (73, 'Task', ''),
  (74, 'Task', ''),
  (75, 'Task', ''),
  (76, 'Task', ''),
  -- Xmonad
  (
    77,
    'Task',
    'Task'
  ),
  (78, 'Task', ''),
  (79, 'Task', ''),
  (
    80,
    'Task',
    'Task'
  ),
  -- Poincaré tasks
  (81, 'Task', ''),
  (
    82,
    'Task',
    'Task'
  ),
  (83, 'Task', ''),
  (
    84,
    'Task',
    'Task'
  ),
  (
    85,
    'Task',
    'Task'
  ),
  (86, 'Task', ''),
  (87, 'Task', ''),
  (88, 'Task', ''),
  (89, 'Task', ''),
  (
    90,
    'Task',
    'Task'
  ),
  (
    91,
    'Task',
    'Task'
  ),
  (92, 'Task', '');

INSERT INTO
  task_list_association(task_id, list_id)
VALUES
  (1, 61),
  (2, 61),
  (3, 61),
  (4, 61),
  (5, 61),
  (6, 61),
  (7, 61),
  (8, 61),
  (9, 61),
  (10, 46),
  (11, 46),
  (12, 46),
  (13, 46),
  (14, 46),
  (15, 46),
  (16, 46),
  (17, 46),
  (17, 4),
  (18, 4),
  (19, 4),
  (20, 4),
  (21, 4),
  (22, 4),
  (23, 4),
  (24, 4),
  (25, 4),
  (26, 4),
  (27, 4),
  (28, 4),
  (29, 4),
  (30, 4),
  (31, 4),
  (32, 7),
  (37, 7),
  (38, 10),
  (42, 10),
  (43, 13),
  (44, 16),
  (45, 16),
  (46, 19),
  (47, 49),
  (48, 49),
  (49, 49),
  (50, 49),
  (51, 49),
  (52, 22),
  (53, 25),
  (54, 28),
  (55, 54),
  (56, 54),
  (57, 54),
  (58, 54),
  (59, 55),
  (60, 55),
  (61, 58),
  (62, 58),
  (63, 58),
  (64, 58),
  (65, 58),
  (66, 58),
  (67, 58),
  (68, 58),
  (69, 58),
  (70, 34),
  (71, 37),
  (72, 37),
  (73, 40),
  (74, 40),
  (75, 40),
  (76, 40),
  (77, 43),
  (78, 43),
  (79, 43),
  (80, 43),
  (81, 52),
  (82, 52),
  (83, 52),
  (84, 52),
  (85, 52),
  (86, 52),
  (87, 52),
  (88, 52),
  (89, 52),
  (90, 52),
  (91, 52),
  (92, 52);
