import { Fragment, useCallback, useEffect, useState } from 'react'
import { Task } from './api/tasks'
import { Grid, Checkbox, IconButton, Input, List, ListItem, ListItemButton, ListItemText, Paper, InputAdornment, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Add, Cancel,Delete, Save } from '@mui/icons-material'
import { UserRead } from 'permitio/build/main/openapi'

const styles = {
  Paper: {
    padding: 20,
    margin: '10px auto',
    width: 500
  }
};

const api = async (user: string, method: string, body: any = {}, query: string = '') => {
  const req: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      user
    },
  };
  if (method !== 'GET') {
    req.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/tasks${query}`, req);
  const data = await res.json();
  if (res.status !== 200) {
    throw new Error(data.message);
  }
  return data;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>('');
  const [newTask, setNewTask] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [edit, setEdit] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<UserRead[]>([]);
  const [user, setUser] = useState<string>('');

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => (setUsers(data)))
      .catch((err) => (setError(err.message)));
  }, []);

  useEffect(() => {
    if (processing) {
      setError('');
    }
  }, [processing]);

  useEffect(() => {
    if (!user) return;
    api(user, 'GET', {})
      .then((data) => (setTasks(data)))
      .catch((err) => (setError(err.message)));
  }, [user]);

  const cancelEditTask = useCallback(() => {
    setEdit(null);
    setEditedTask(null);
  }, []);

  const addTask = useCallback(async () => {
    if (!newTask) return;
    setProcessing(true);
    setError('');
    try {
      const data = await api(user, 'POST', {
        text: newTask,
        isCompleted: false
      });
      setTasks((t) => ([...t, data]));
      setNewTask('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [newTask, user]);

  const updateTask = useCallback(async () => {
    if (edit === null) return;
    setProcessing(true);
    setError('');
    try {
      const data = await api(user, 'PUT', {
        ...editedTask
      }, `?id=${edit.toString()}`);
      setTasks((t) => {
        const newTasks = [...t];
        newTasks[edit] = data;
        return newTasks
      });
      setEdit(null);
      setEditedTask(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [edit, editedTask, user]);

  const deleteTask = useCallback(async (idx: number) => {
    setProcessing(true);
    setError('');
    setEdit(null);
    setEditedTask(null);
    try {
      await api(user, 'DELETE', {}, `?id=${idx.toString()}`);
      const newTasks = [...tasks];
      newTasks.splice(idx, 1);
      setTasks(newTasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [tasks, user]);

  const toggleTask = useCallback(async (idx: number) => {
    setProcessing(true);
    setError('');
    try {
      const data = await api(user, 'PATCH', {
        isCompleted: !tasks[idx].isCompleted
      }, `?id=${idx.toString()}`);
      const newTasks = [...tasks];
      newTasks[idx] = data;
      setTasks(newTasks);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }, [tasks, user]);

  return (
    <>
      <Fragment>
        <Grid container spacing={0}>
          {error &&
            <Paper style={{ width: 500, margin: '10px auto' }}>
              <Alert severity='error' onClose={() => (setError(''))}>{error}</Alert>
            </Paper>
          }
          {users.length !== 0 && <Grid item xs={12}>
            <Paper style={styles.Paper}>
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Choose User</InputLabel>
                <Select
                  labelId="user-select-label"
                  value={user}
                  label="Choose User"
                  onChange={({ target: { value } }) => (setUser(value))}
                >
                  {users.map((user) => (
                    <MenuItem key={user.key} value={user.key}>{user.first_name} {user.last_name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Grid>}
          {user && <Grid item xs={12}>
            <Paper style={styles.Paper}>
              <form onSubmit={(e) => { e.preventDefault(); addTask(); }}>
                <Input fullWidth placeholder="Task" value={newTask} onChange={({ target: { value } }) => (setNewTask(value))} endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={addTask} disabled={!newTask || processing}>
                      <Add />
                    </IconButton>
                  </InputAdornment>
                } />
              </form>
            </Paper>
          </Grid>}
          {tasks.length !== 0 && <Grid item xs={12}>
            <Paper style={styles.Paper}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {tasks.map((task, idx) => (
                  <ListItem
                    key={idx}
                    secondaryAction={
                      <>
                        {edit === idx &&
                          <>
                            <IconButton disabled={processing} onClick={cancelEditTask}><Cancel /></IconButton>
                            <IconButton disabled={processing} onClick={updateTask}><Save /></IconButton>
                          </>
                        }
                        {edit !== idx &&
                          <IconButton disabled={processing} onClick={() => (deleteTask(idx))}><Delete /></IconButton>
                        }
                      </>
                    }
                    disablePadding
                  >
                    <Checkbox
                      checked={task.isCompleted}
                      tabIndex={-1}
                      disableRipple
                      disabled={processing}
                      onClick={() => (toggleTask(idx))}
                    />
                    <ListItemButton onClick={() => { setEditedTask({ ...task }); setEdit(idx); }} dense>
                      {edit === idx &&
                        <Input fullWidth placeholder="Task" value={editedTask?.text} onChange={({ target: { value } }) => (
                          setEditedTask((e) => ({ isCompleted: e?.isCompleted || false, text: value }))
                        )} />
                      }
                      {edit !== idx &&
                        <ListItemText id={idx.toString()} primary={task.text} />
                      }
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          }
        </Grid>
      </Fragment>
    </>
  )
}
