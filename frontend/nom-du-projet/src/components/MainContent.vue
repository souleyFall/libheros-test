<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { taskAPI } from '../services/api';

interface Task {
  id: string;
  shortDescription: string;
  longDescription?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

const props = defineProps({
  selectedListId: String,
});

const emit = defineEmits<{
  selectTask: [task: Task];
  taskUpdated: [];
}>();

const tasks = ref<Task[]>([]);
const showCompletedSection = ref(false);
const loading = ref(false);
const showCreateForm = ref(false);

const newTask = ref({
  shortDescription: '',
  longDescription: '',
  dueDate: '',
});

const activeTasks = computed(() => tasks.value.filter((t) => !t.completed));
const completedTasks = computed(() => tasks.value.filter((t) => t.completed));

const fetchTasks = async () => {
  if (!props.selectedListId) return;

  try {
    const response = await taskAPI.getByList(props.selectedListId);
    tasks.value = response.data;
  } catch (error) {
    console.error('Erreur lors du chargement des tâches', error);
  }
};

const handleCreateTask = async () => {
  if (!newTask.value.shortDescription.trim()) {
    alert('La description courte est obligatoire');
    return;
  }

  if (!newTask.value.dueDate) {
    alert('La date d\'échéance est obligatoire');
    return;
  }

  if (!props.selectedListId) {
    alert('Veuillez d\'abord sélectionner une liste');
    return;
  }

  loading.value = true;
  try {
    await taskAPI.create({
      shortDescription: newTask.value.shortDescription,
      longDescription: newTask.value.longDescription || undefined,
      dueDate: newTask.value.dueDate,
      listId: props.selectedListId,
    });

    newTask.value = {
      shortDescription: '',
      longDescription: '',
      dueDate: '',
    };
    showCreateForm.value = false;
    await fetchTasks();
    emit('taskUpdated');
  } catch (error) {
    console.error('Erreur lors de la création de la tâche', error);
    alert('Erreur lors de la création de la tâche');
  } finally {
    loading.value = false;
  }
};

const handleToggleTask = async (task: Task) => {
  try {
    await taskAPI.update(task.id, { completed: !task.completed });
    await fetchTasks();
    emit('taskUpdated');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche', error);
  }
};

watch(() => props.selectedListId, () => {
  fetchTasks();
});

defineExpose({
  fetchTasks,
});
</script>

<template>
  <main class="main-content">
    <div v-if="!selectedListId" class="no-list-selected">
      <p>Sélectionnez une liste de tâches pour commencer</p>
    </div>

    <div v-else class="task-container">
      <!-- Bouton créer tâche -->
      <div class="task-header">
        <h2>Tâches</h2>
        <button
          class="create-btn"
          @click="showCreateForm = !showCreateForm"
        >
          {{ showCreateForm ? '✕' : '+ Nouvelle tâche' }}
        </button>
      </div>

      <!-- Formulaire de création -->
      <div v-if="showCreateForm" class="create-form">
        <div class="form-group">
          <label>Description courte *</label>
          <input
            v-model="newTask.shortDescription"
            type="text"
            placeholder="Titre de la tâche..."
          />
        </div>

        <div class="form-group">
          <label>Description longue</label>
          <textarea
            v-model="newTask.longDescription"
            placeholder="Détails supplémentaires..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>Date d'échéance *</label>
          <input
            v-model="newTask.dueDate"
            type="date"
          />
        </div>

        <div class="form-actions">
          <button class="btn-submit" @click="handleCreateTask" :disabled="loading">
            {{ loading ? 'Création...' : 'Créer' }}
          </button>
          <button class="btn-cancel" @click="showCreateForm = false">
            Annuler
          </button>
        </div>
      </div>

      <!-- Tâches actives -->
      <div class="tasks-section">
        <h3>Mes tâches</h3>
        <div v-if="activeTasks.length === 0" class="empty-section">
          Aucune tâche. Créez-en une!
        </div>
        <div v-else class="tasks-list">
          <div
            v-for="task in activeTasks"
            :key="task.id"
            class="task-item"
            @click="emit('selectTask', task)"
          >
            <input
              type="checkbox"
              :checked="task.completed"
              @click.stop="handleToggleTask(task)"
              class="task-checkbox"
            />
            <div class="task-info">
              <p class="task-title">{{ task.shortDescription }}</p>
              <p class="task-date">{{ new Date(task.dueDate).toLocaleDateString('fr-FR') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tâches terminées -->
      <div class="tasks-section">
        <button class="toggle-completed" @click="showCompletedSection = !showCompletedSection">
          {{ showCompletedSection ? '▼' : '▶' }} Mes tâches terminées ({{ completedTasks.length }})
        </button>

        <div v-if="showCompletedSection" class="tasks-list completed">
          <div
            v-for="task in completedTasks"
            :key="task.id"
            class="task-item completed-task"
            @click="emit('selectTask', task)"
          >
            <input
              type="checkbox"
              :checked="task.completed"
              @click.stop="handleToggleTask(task)"
              class="task-checkbox"
            />
            <div class="task-info">
              <p class="task-title">{{ task.shortDescription }}</p>
              <p class="task-date">{{ new Date(task.dueDate).toLocaleDateString('fr-FR') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  background: #f7fafc;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
}

.no-list-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  font-size: 1.2rem;
}

.task-container {
  max-width: 800px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.task-header h2 {
  margin: 0;
  color: #2d3748;
}

.create-btn {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.create-btn:hover {
  background: #764ba2;
}

.create-form {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-submit {
  flex: 1;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #764ba2;
}

.btn-submit:disabled {
  opacity: 0.6;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background: #cbd5e0;
  color: #2d3748;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #a0aec0;
}

.tasks-section {
  margin-bottom: 2rem;
}

.tasks-section h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.toggle-completed {
  width: 100%;
  padding: 1rem;
  background: #edf2f7;
  color: #2d3748;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  text-align: left;
  transition: background 0.2s;
}

.toggle-completed:hover {
  background: #e2e8f0;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #667eea;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.task-item.completed-task {
  opacity: 0.7;
  border-left-color: #cbd5e0;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
  accent-color: #667eea;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-title {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-weight: 500;
  word-break: break-word;
}

.task-item.completed-task .task-title {
  text-decoration: line-through;
  color: #a0aec0;
}

.task-date {
  margin: 0;
  font-size: 0.85rem;
  color: #a0aec0;
}

.empty-section {
  padding: 2rem;
  text-align: center;
  color: #a0aec0;
}
</style>
