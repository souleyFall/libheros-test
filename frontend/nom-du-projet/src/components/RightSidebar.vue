<script setup lang="ts">
import { ref } from 'vue';
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
  task: Object as () => Task | null,
});

const emit = defineEmits<{
  taskDeleted: [];
  close: [];
}>();

const deleteConfirm = ref(false);
const deleting = ref(false);

const handleDeleteTask = async () => {
  if (!props.task) return;

  deleting.value = true;
  try {
    await taskAPI.delete(props.task.id);
    emit('taskDeleted');
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche', error);
    alert('Erreur lors de la suppression de la tâche');
  } finally {
    deleting.value = false;
    deleteConfirm.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <aside class="right-sidebar">
    <div v-if="!task" class="no-task">
      <p>Sélectionnez une tâche pour voir les détails</p>
    </div>

    <div v-else class="task-details">
      <button class="close-btn" @click="emit('close')">✕</button>

      <h3>{{ task.shortDescription }}</h3>

      <div class="details-section">
        <h4>Date d'échéance</h4>
        <p class="due-date">{{ new Date(task.dueDate).toLocaleDateString('fr-FR') }}</p>
      </div>

      <div class="details-section">
        <h4>Créée le</h4>
        <p class="created-date">{{ formatDate(task.createdAt) }}</p>
      </div>

      <div v-if="task.longDescription" class="details-section">
        <h4>Description</h4>
        <p class="long-description">{{ task.longDescription }}</p>
      </div>

      <div class="details-section">
        <h4>Statut</h4>
        <p class="status" :class="{ completed: task.completed }">
          {{ task.completed ? '✓ Terminée' : 'En cours' }}
        </p>
      </div>

      <div class="action-buttons">
        <button
          class="delete-task-btn"
          @click="deleteConfirm = true"
        >
          Supprimer cette tâche
        </button>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div v-if="deleteConfirm" class="confirm-modal">
        <div class="confirm-content">
          <p>Êtes-vous sûr de vouloir supprimer cette tâche?</p>
          <div class="confirm-buttons">
            <button class="btn-danger" @click="handleDeleteTask" :disabled="deleting">
              {{ deleting ? 'Suppression...' : 'Confirmer' }}
            </button>
            <button class="btn-cancel" @click="deleteConfirm = false">
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.right-sidebar {
  width: 320px;
  background: white;
  border-left: 1px solid #cbd5e0;
  padding: 2rem;
  overflow-y: auto;
  height: 100vh;
  position: relative;
}

.no-task {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #a0aec0;
  text-align: center;
}

.task-details {
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #a0aec0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #2d3748;
}

h3 {
  margin: 0 0 2rem 0;
  color: #2d3748;
  font-size: 1.3rem;
  word-break: break-word;
  padding-right: 2rem;
}

.details-section {
  margin-bottom: 2rem;
}

.details-section h4 {
  margin: 0 0 0.75rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  text-transform: uppercase;
  font-weight: 600;
}

.details-section p {
  margin: 0;
  color: #2d3748;
  line-height: 1.6;
}

.due-date {
  font-weight: 500;
  color: #667eea;
}

.created-date {
  font-size: 0.9rem;
  color: #a0aec0;
}

.long-description {
  white-space: pre-wrap;
  word-break: break-word;
}

.status {
  font-weight: 500;
}

.status.completed {
  color: #48bb78;
}

.action-buttons {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-task-btn {
  padding: 0.75rem;
  background: #f56565;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.delete-task-btn:hover {
  background: #e53e3e;
}

.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #333;
  max-width: 400px;
}

.confirm-content p {
  margin-bottom: 1.5rem;
  color: #666;
}

.confirm-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #c53030;
}

.btn-danger:disabled {
  opacity: 0.6;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: #cbd5e0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #a0aec0;
}
</style>
